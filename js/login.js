(() => {
    const init = () => {
        initEvent();
    };

    const initEvent = () => {
        formContainer.addEventListener('submit', e => {
            e.preventDefault();
            const loginId = userName.value.trim();
            const loginPwd = userPassword.value.trim();
            if (!loginId || !loginPwd) {
                alert('账号或密码不能为空');
            }
            sendData(loginId, loginPwd);
        });
    };

    const sendData = async (loginId, loginPwd) => {
        const res = await fetchFn({
            url: '/user/login',
            method: 'POST',
            params: {
                loginId,
                loginPwd,
            },
        });
        // res && window.location.replace("../index.html");

        res && (window.location.href = '../index.html');
    };

    init();
})();
