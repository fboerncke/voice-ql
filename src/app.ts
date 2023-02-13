import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { WebPlatform } from '@jovotech/platform-web';
import { SnipsNlu } from '@jovotech/nlu-snips';
import { App } from '@jovotech/framework';
import { SpintaxOutputPlugin } from 'jovo-v4-community-plugin-spintax-output';
import { JexlOutputPlugin } from 'jovo-v4-community-plugin-jexl-output';

import en from './i18n/en.json';
import de from './i18n/de.json';

import { GlobalComponent } from './components/GlobalComponent';
import { VqlMainComponent } from './components/VqlMainComponent';
import { VqlAskTableNameComponent } from './components/VqlAskTableNameComponent';
import { VqlAskColumnNameComponent } from './components/VqlAskColumnNameComponent';

/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| All relevant components, plugins, and configurations for your Jovo app
| Learn more here: www.jovo.tech/docs/app-config
|
*/
const app = new App({
  /*
  |--------------------------------------------------------------------------
  | i18n 
  |--------------------------------------------------------------------------
  | Learn more here https://www.jovo.tech/docs/i18n
  |
  |
  */
  i18n: {
    // Configuration
    resources: {
      en,
      de
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */
  components: [
    GlobalComponent,
    VqlMainComponent,
    VqlAskTableNameComponent,
    VqlAskColumnNameComponent
  ],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/marketplace
  |
  */
  plugins: [
    // https://www.jovo.tech/marketplace/platform-web#web-platform-and-core-platform
    new WebPlatform({
      plugins: [
        new SnipsNlu({
          serverUrl: 'http://172.17.0.2:5001/',
          serverPath: '/engine/parse',
          engineId: 'voice-ql',
          fallbackLanguage: 'de'
        })
        /*        new NlpjsNlu({
              languageMap: {
                en: LangEn,
                de: LangDe,
              },
            }),*/
      ]
    }),

    // @see https://www.jovo.tech/marketplace/platform-googleassistant
    new GoogleAssistantPlatform(),

    // @see https://www.jovo.tech/marketplace/platform-alexa
    new AlexaPlatform({
      intentMap: {
        'AMAZON.StopIntent': 'StopIntent',
        'AMAZON.CancelIntent': 'CancelIntent',
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.StartOverIntent': 'StartOverIntent'
      }
    }),
    new SpintaxOutputPlugin(),
    new JexlOutputPlugin()
  ],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */
  logging: true
});

export { app };
