import { parseRawWsMessage, WebsocketClient, isWsFormatted24hrTicker } from "../src";

describe.only('websocket-client', () => {
  describe('parseRawWsMessage()', () => {
    it('should parse & resolve an event with nested data', () => {
      const event = '{"stream":"!forceOrder@arr","data":{"e":"forceOrder","E":1634653599186,"o":{"s":"IOTXUSDT","S":"SELL","o":"LIMIT","f":"IOC","q":"3661","p":"0.06606","ap":"0.06669","X":"FILLED","l":"962","z":"3661","T":1634653599180}}}';
      const result = parseRawWsMessage(event);
      expect(typeof result).toBe('object');
      expect(result.data).toBe(undefined);
    });
  });

  describe.only('proxy', () => {
    it('should work with http proxy', (done) => {
      const client = new WebsocketClient({
        api_key: process.env.apiKey,
        api_secret: process.env.apiSecret,
        beautify: true,
        requestOptions: {
          proxy: {host: '127.0.0.1', port: 4780}
        }
      });

      // receive beautify message
      client.on('formattedMessage', (event: any) => {
        if (isWsFormatted24hrTicker(event)) {
          console.log('24hrTicker received ', event);
          return;
        }
        expect(event).not.toBeNull();
        done();
      });
      client.subscribeAll24hrTickers('coinm');
    }, 20000);
  });
});
