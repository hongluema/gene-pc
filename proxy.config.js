/**
 * 本地代理配置文件。更多配置见：
 * https://webpack.js.org/configuration/dev-server/#devserverproxy
 */

// 因为服务端接口会依赖请求头里的 `Host` 值，如果我们使
// 用了 127.0.0.1 进行本地开发，就会因为 `Host` 值错误，
// 导致接口返回错误的数据。所以，这里需要根据业务情况手动设置下
// const REQUEST_HEADER_HOST = 'arenal-testing.dev.gdapi.net';
const REQUEST_HEADER_HOST = 'app.oriomics.cn';

const proxyConfig = {
  // 后端接口服务代理
  '/api': {
    // 填写代理服务的域名或 ip 地址
    target: 'https://' + REQUEST_HEADER_HOST,
    requestHeaderHost: REQUEST_HEADER_HOST,
  },
};

module.exports = Object.entries(proxyConfig).reduce(
  (result, [path, config]) => {
    const { target, requestHeaderHost } = config;
    const hasProtocol = /https?:\/\//.test(target);

    result[path] = {
      secure: false,
      changeOrigin: true,
      ...config,
      target: hasProtocol ? target : `http://${target}`,
      onProxyReq(proxyReq) {
        // 因为后端接口会校验请求头里的 host，故对其进行修改
        if (requestHeaderHost) {
          proxyReq.setHeader('host', requestHeaderHost);
        }
      },
      onProxyRes(proxyRes, req) {
        // 将接口响应头里其它域名下的 cookie 修改为本地的
        const cookies = proxyRes.headers['set-cookie'] || [];
        proxyRes.headers['set-cookie'] = cookies.map(function (cookie) {
          return cookie.replace(/Domain=[^;]*/i, `Domain=${req.host}`);
        });
      },
    };

    return result;
  },
  {},
);
