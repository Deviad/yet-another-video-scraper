import { TimeFactory } from '@typings';

const timeFactory: TimeFactory = (minSec = 30, maxSec = 60) => {
  if (minSec >= maxSec) {
    throw new Error('The number of minim seconds to wait must be lower than max');
  }
  let x = Math.floor(Math.random() * maxSec + 1);
  if (x < minSec) {
    x = minSec;
  }
  return x * 1000;
};
export default timeFactory;
