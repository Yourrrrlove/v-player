<template>
  <div>
    <v-tooltip bottom color="black" :open-delay="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon @click="$router.go(-1)" v-on="on" v-bind="attrs">
          <v-icon>
            {{ mdiChevronLeft }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.backward') }}</span>
    </v-tooltip>
    <v-tooltip bottom color="black" :open-delay="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon @click="$router.go(1)" v-on="on" v-bind="attrs">
          <v-icon>
            {{ mdiChevronRight }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.forward') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';
export default {
  name: 'BF',
  data: () => ({ mdiChevronRight, mdiChevronLeft }),
};
</script>
