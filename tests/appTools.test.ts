import { expect } from 'chai';
import { isMainThread } from 'worker_threads';
import * as appTools from '../lib/appTools';

describe('normalizePort', function () {
  it('works', function () {
    const result = 1;
    expect(result).equal(1);
  });
});

describe('onError', function () {
  it('also works', function () {
    const result = 1;
    expect(result).equal(1);
  });
});
