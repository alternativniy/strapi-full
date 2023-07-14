export const getUserToken = () => {
  return localStorage.getItem('USER_JWT');
}