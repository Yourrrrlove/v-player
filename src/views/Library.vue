<template>
  <div>
    <custom-col title="最近播放" subtitle="activity" class="mb-4">
      <template>
        <cover-row-skeleton v-if="loadingRecent" />
        <carousel :rows="4" gridStyle="C">
          <song-bar
            :song="recent.data"
            class="track-item"
            v-for="recent in recents"
            :key="recent['resourceId']"
          />
        </carousel>
      </template>
    </custom-col>
    <v-tabs ref="tabs" v-model="tab" class="mb-4 tab_tabs">
      <v-tab
        v-for="t in tabs"
        :key="t.key"
        class="font-weight-bold"
        @click="loadData"
      >
        {{ t.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tab_page pt-4">
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list>
          <div>
            <v-dialog v-model="newlistDialog" persistent max-width="400px">
              <template v-slot:activator="{ on }">
                <v-responsive
                  class="rounded-lg surfaceVariant"
                  aspect-ratio="1"
                  content-class="new-playlist"
                  v-on="on"
                >
                  <v-btn icon v-on="on">
                    <v-icon v-text="icon.mdiPlus" large />
                  </v-btn>
                </v-responsive>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">新建歌单</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model="playlistName"
                      label="新歌单标题*"
                      maxlength="40"
                      required
                    ></v-text-field>
                    <v-checkbox
                      v-model="playlistPrivate"
                      label="设为隐私歌单"
                    ></v-checkbox>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="newlistDialog = false"> 关闭 </v-btn>
                  <v-btn text @click="createNewPlaylist"> 保存 </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <div class="text-caption font-weight-bold mt-2">新建歌单</div>
          </div>
          <cover
            v-for="item in playlist"
            :data="item"
            type="playlist"
            :key="item.id"
          />
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list v-else>
          <div v-for="album in albums" :key="album.id">
            <cover :data="album" />
          </div>
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" type="avatar" />
        <cover-list v-else>
          <artists-cover
            v-for="artist in artists"
            :artists="artist"
            :key="artist.id"
          />
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list v-else grid-style="B">
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </cover-list>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import CustomCol from '@components/layout/Col.vue';
import CoverList from '@components/app/CoverList.vue';
import VideoCover from '@components/app/VideoCover.vue';
import ArtistsCover from '@components/app/Artists.vue';
import CoverRowSkeleton from '@components/skeleton/CoverRowSkeleton.vue';
import SongBar from '@components/app/SongBar.vue';
import Cover from '@components/app/Cover.vue';
import Carousel from '@components/layout/Carousel.vue';

import { sync, get, dispatch } from 'vuex-pathify';
import { favAlbums, favArtists, favMVs, getUserPlaylist } from '@api/user';
import { createPlaylist } from '@api/index';
import { recent } from '@api/recent';

import { mdiPlus } from '@mdi/js';

export default {
  name: 'Library',
  components: {
    Cover,
    ArtistsCover,
    SongBar,
    CoverList,
    VideoCover,
    CustomCol,
    CoverRowSkeleton,
    Carousel,
  },
  data() {
    return {
      icon: { mdiPlus },
      tabs: [
        { key: 'playlists', name: this.$t('main.playlists') },
        { key: 'albums', name: this.$t('main.albums') },
        { key: 'artists', name: this.$t('main.artists') },
        { key: 'mvs', name: this.$t('main.mvs') },
      ],
      tab: 0,
      albums: [],
      mvs: [],
      artists: [],
      recents: [],
      loadingRecent: false,
      loading: {
        playlists: false,
        albums: false,
        artists: false,
        mvs: false,
      },
      newlistDialog: false,
      playlistName: '',
      playlistPrivate: false,
    };
  },
  computed: {
    playlist: sync('music/playlist'),
    recentIds: get('music/recent'),
    type() {
      return {
        0: 'playlists',
        1: 'albums',
        2: 'artists',
        3: 'mvs',
      }[this.tab];
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      // const { songs } = await getSongData(this.recentIds.slice(0, 16));
      const {
        data: { list = [] },
      } = await recent(15);
      this.recents = list;
    },
    loadData() {
      this.$nextTick(async () => {
        // todo 简化以下逻辑
        if (this.type === 'albums' && !this.albums.length) {
          this.loading[this.type] = true;
          const { data } = await favAlbums();
          this.albums = data;
        } else if (this.type === 'artists' && !this.artists.length) {
          this.loading[this.type] = true;
          const { data } = await favArtists();
          this.artists = data;
        } else if (this.type === 'mvs' && !this.mvs.length) {
          this.loading[this.type] = true;
          const { data } = await favMVs();
          this.mvs = data;
        } else if (this.type === 'playlists' && !this.playlist.length) {
          this.loading[this.type] = true;
          const { playlist } = await getUserPlaylist();
          this.playlist = playlist;
        }
        this.loading[this.type] = false;
        // this.$vuetify.goTo(this.$refs['tabs']);
      });
    },
    async createNewPlaylist() {
      await createPlaylist({
        name: this.playlistName,
        privacy: this.playlistPrivate ? '10' : '',
      });
      this.$toast.success('创建成功');
      this.newlistDialog = false;
      await dispatch('music/fetch');
    },
  },
};
</script>

<style scoped lang="scss">
.tab_tabs {
  ::v-deep .v-tabs-bar {
    background: inherit !important;
  }
}
.tab_page {
  background: inherit !important;
  min-height: calc(100vh - 210px);
  ::v-deep .new-playlist {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
