export const getUserToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('USER_JWT') : '';
}