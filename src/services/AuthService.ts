
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

export const authService = {
    logout
};

export default authService;