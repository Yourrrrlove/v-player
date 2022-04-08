import {defineStore} from 'pinia';
import { useLocalStorage } from '@vueuse/core';
export const useSettingStore = defineStore('setting', {
    state: () => {
        const data = useLocalStorage('setting', {
            locale: 'en',
            appearance: 'system',
            wallpaperColor: 'GreenRockyMountains',
            customPalettes: {
                dataURL: '',
                colors: {},
            },
            quality: '320000',
            cacheLimit: 500,
            volume: 0.8,
            account: {},
            playingMode: 'basic',
            wallhaven: false,
            purity: ['sfw', 'sketchy'],
            categories: ['general', 'anime', 'people'],
        });
        console.log(data);
        return data;
    }
})
