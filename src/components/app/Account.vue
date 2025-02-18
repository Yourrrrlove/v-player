<template>
  <div>
    <div v-if="logged">
      <app-menu>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="30">
              <v-img :src="profile.avatarUrl" />
            </v-avatar>
          </v-btn>
        </template>
        <template>
          <v-card flat color="surface" width="350" rounded="xl" class="pa-4">
            <div class="d-flex justify-center">
              <v-badge avatar bordered overlap bottom>
                <template v-slot:badge v-if="profile.vipType === 11">
                  <v-avatar>
                    <v-img src="@assets/vip.png"></v-img>
                  </v-avatar>
                </template>
                <v-avatar size="80">
                  <v-img :src="profile.avatarUrl" />
                </v-avatar>
              </v-badge>
            </div>
            <div class="d-flex flex-column my-4 text-center align-center">
              <span class="text-body-1 onSurface--text h-1x mb-1">{{
                profile.nickname
              }}</span>
              <v-btn
                width="150"
                outlined
                rounded
                color="primary"
                @click="dispatch('settings')"
              >
                前往播放设置
              </v-btn>
            </div>
            <v-divider />
            <div class="d-flex justify-center my-2">
              <v-btn
                depressed
                outlined
                small
                rounded
                color="primary"
                @click="dispatch('sign_out')"
              >
                <v-icon color="primary" small class="mr-2">
                  {{ icon.mdiLogin }} </v-icon
                >退出
              </v-btn>
            </div>
            <v-divider />
            <div class="d-flex justify-center mt-2">
              <v-btn plain small> 免责声明 </v-btn>
              <v-divider vertical />
              <v-btn plain small @click="goto"
                ><v-icon small>{{ icon.mdiGithub }}</v-icon> github</v-btn
              >
            </div>
          </v-card>
        </template>
      </app-menu>
    </div>
    <v-btn
      v-else
      plain
      class="text-lowercase text-caption px-0"
      @click="showLogin = !showLogin"
    >
      <v-icon small>
        {{ icon.mdiLogin }}
      </v-icon>
      {{ $t('common.sign_in') }}
    </v-btn>
  </div>
</template>

<script>
import { sync, get, dispatch } from 'vuex-pathify';
import { mdiLogin, mdiCog, mdiGithub } from '@mdi/js';
import AppMenu from '@components/default/Menu.vue';
import { isElectron } from '@util/fn';

export default {
  name: 'DefaultAccount',
  components: { AppMenu },
  data: function () {
    return {
      icon: {
        mdiLogin,
        mdiCog,
        mdiGithub,
      },
      options: [
        {
          type: 'sign_out',
          title: this.$t('common.sign_out'),
        },
        {
          type: 'settings',
          title: this.$t('common.setting'),
        },
      ],
    };
  },
  computed: {
    showSettings: sync('app/showSettings'),
    profile: get('settings/account@profile'),
    showLogin: sync('app/showLogin'),
    logged: (vm) => vm.$store.getters['settings/logged'],
    items() {
      return [{ heading: this.profile?.nickname }, ...this.options];
    },
  },
  methods: {
    handleLogin() {},
    dispatch(type) {
      switch (type) {
        case 'sign_out':
          this.signOut();
          break;
        case 'settings':
          this.showSettings = true;
          break;
      }
    },
    signOut() {
      dispatch('settings/signOut');
    },
    goto() {
      const url = 'https://github.com/GuMengYu/v-player';
      if (isElectron()) {
        this.$ipcRenderer.invoke('open-url', url);
      } else {
        window.open(url, '_blank');
      }
    },
  },
};
</script>
