import { ExpressJs, Request, Response, Webhook } from '@jovotech/server-express';
import cors from 'cors';
import { app } from './app';

import http from 'http';
import * as fs from 'fs';

/*
|--------------------------------------------------------------------------
| EXPRESS SERVER CONFIGURATION
|--------------------------------------------------------------------------
|
| Creates a new express app instance, default for local development
| Learn more here: www.jovo.tech/marketplace/server-express
|
*/
const port = process.env.JOVO_PORT || 3000;
(async () => {
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return;
  }

  console.log('Train Locales: ');
  // now start training voice model on Snips NLU
  await trainModel('de');
  await trainModel('en');

  Webhook.use(cors());

  await app.initialize();

  Webhook.listen(port, () => {
    console.info(`Local server listening on port ${port}.`);
  });
  Webhook.get('/webhook', async (req: Request, res: Response) => {
    const response = await app.handle(new ExpressJs(req, res));
    res.json(response);
  });
  Webhook.post('/webhook', async (req: Request, res: Response) => {
    await app.handle(new ExpressJs(req, res));
  });
})();

async function trainModel(locale: string) {
  console.log('Start training Snips NLU with ' + locale + ' voice model in background');
  const model = fs.readFileSync(process.cwd() + '/models/' + locale + '.json', 'utf8');

  const options = {
    hostname: '172.17.0.2',
    port: 5001,
    path: '/engine/train?engine_id=voice-ql&locale=' + locale,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('Snips NLU: Done training ' + locale + ' model.');
    });
  });

  req.on('error', (e) => {
    console.error(`💥 Problem with request to Snips NLU server: ${e.message} 💥`);
  });

  // write data to request body
  req.write(model);
  req.end();
}
