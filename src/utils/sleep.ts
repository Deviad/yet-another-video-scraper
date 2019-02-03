const sleep: (time: number, cb?: CallableFunction) => Promise<any> = (time, cb = () => {}) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(cb()), time);
    } catch (err) {
      reject(console.log(err));
    }
  });
};

export default sleep;
