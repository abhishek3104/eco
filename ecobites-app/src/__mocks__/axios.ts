// __mocks__/axios.ts or  __mocks__/axios.js

export default {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    // other methods if required...
  };


