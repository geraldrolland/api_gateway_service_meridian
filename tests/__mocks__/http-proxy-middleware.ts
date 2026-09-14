const mockProxyMiddleware = jest.fn(() => (req: any, res: any, next: any) => next());

module.exports = {
  createProxyMiddleware: mockProxyMiddleware,
};
