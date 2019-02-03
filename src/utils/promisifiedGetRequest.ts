import * as request from 'request';

const promisifiedGetRequest: (url: string, cb: CallableFunction, options?: {}) => Promise<any> = (
  url,
  cb,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    console.log('my options', options);

    const sendReq = request.get(url, options);
    sendReq.on('response', response => {
      if (response.statusCode !== 200) {
        reject(cb('Response status was ' + response.statusCode));
      }
      sendReq.on('end', function() {
        console.log('\n');
        resolve(cb('end'));
      });

      sendReq.on('error', err => {
        // @ts-ignore
        reject(cb(err.message));
      });
    });
  });
};

export default promisifiedGetRequest;
