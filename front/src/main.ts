import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';
import '@/assets/style/main.less';
import 'ant-design-vue/dist/reset.css';

// Register icon sprite
import 'virtual:svg-icons-register';

import { createApp } from 'vue';

import App from '@/layouts/App.vue';
import Antd from 'ant-design-vue';
import router, { setupRouter } from './router';
import { setupStore } from './store';
import { setupGlobDirectives } from './directives';
import { setupRouterGuard } from './router/guard';

async function bootstrap() {
  const app = createApp(App);

  app.use(Antd);

  // Configure store
  setupStore(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  app.mount('#app');
}

bootstrap();
