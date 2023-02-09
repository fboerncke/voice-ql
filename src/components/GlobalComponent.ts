import { Component, BaseComponent, Global, Handle } from '@jovotech/framework';
import { VqlMainComponent } from './VqlMainComponent';

/*
|--------------------------------------------------------------------------
| Global Component
|--------------------------------------------------------------------------
|
| The global component handlers can be reached from anywhere in the app
| Learn more here: www.jovo.tech/docs/components#global-components
|
*/
@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$delegate(VqlMainComponent, {
      config: {
        someKey: 'someValue'
      },
      resolve: {
        success: this.MAGIC_PROTOTYPER,
        terminate: this.END
      }
    });
  }

  MAGIC_PROTOTYPER(): any {
    return this.$delegate(VqlMainComponent, {
      config: {
        someKey: 'someValue'
      },
      resolve: {
        // kind of an event loop ...
        success: this.MAGIC_PROTOTYPER,
        terminate: this.END
      }
    });
  }

  END(): any {
    return this.$send({
      message: this.$t('VQL_MAIN_COMPONENT_STOP_INTENT_SPEECH'),
      listen: false
    });
  }

  startOver() {
    return this.LAUNCH();
  }

  @Handle({ intents: ['RepeatIntent'], prioritizedOverUnhandled: true })
  repeatPreviousMessage() {
    // the value of "REPEAT_INTRO" may be something like "OK, I say this once again: "
    //this.$send(this.$t('REPEAT_INTRO'));
    if (this.$history.prev?.output) {
      return this.$send(this.$history.prev.output);
    } else {
      return this.$send('Unfortunately, there is nothing to repeat.');
    }
  }
}
