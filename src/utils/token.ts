// 这里我要获取token，从一个接口，请求的示例：

import request from "@/config/request";

const TOKEN_KEY = 'auth_token';

const getAuthToken = async () => {
  try {
    const res: any = await request.get('/api/token')
    localStorage.setItem(TOKEN_KEY, res.token);
    console.log('>>>>res', res.token);
  } catch (error) {
    console.error('Error:', error);
  }
}

export {
  getAuthToken,
  TOKEN_KEY
}

