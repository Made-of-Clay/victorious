import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import Vue from 'vue';
import vuetify from 'vuetify';

describe('App.vue', () => {
    let wrapper;
    let title = 'App component';
    beforeEach(()=>{
        Vue.use(vuetify);
        wrapper = shallowMount(App, {
            provide: {
                firebase: {
                    getVictories(func) {
                        func();
                    },
                },
            },
        });
    });
    it('renders a vue instance', () => {
        expect(shallowMount(App).isVueInstance()).toBe(true);
    });
});