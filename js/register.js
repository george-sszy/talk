(() => {
	let isRegister = false;
	const init = () => {
		initEvent();
	};
	const initEvent = () => {
		userName.addEventListener("blur", onUserNameBlur);
		formContainer.addEventListener("submit", onFormSubmit);
	};

	const onFormSubmit = (e) => {
		e.preventDefault();
		const loginId = userName.value.trim();
		const nickname = userNickname.value.trim();
		const loginPwd = userPassword.value.trim();
		const confirmPwd = userConfirmPassword.value.trim();
		if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) return;
		sendData(loginId, nickname, loginPwd);
	};

	const sendData = async (loginId, nickname, loginPwd) => {
		const res = await fetchFn({
			url: "/user/reg",
			method: "POST",
			params: {
				loginId,
				nickname,
				loginPwd,
			},
		});

		res && (window.location.href = "../index.html");
	};

	const checkForm = (loginId, nickName, pwd, confirmPwd) => {
		switch (true) {
			case !loginId:
				alert("用户名不能为空");
				return;
			case !nickName:
				alert("昵称不能为空！");
				return;
			case !pwd:
				alert("密码不能为空");
				return;
			case !confirmPwd:
				alert("确认密码不能为空");
				return;
			case pwd !== confirmPwd:
				alert("两次输入密码不同");
				return;
			case isRegister:
				alert("用户名已存在，请更换");
				return;
			default:
				return true;
		}
	};

	// 账户名失去焦点事件
	const onUserNameBlur = async () => {
		const loginId = userName.value.trim();
		if (!loginId) return;

		const res = await fetchFn({
			url: "/user/exists",
			method: "GET",
			params: { loginId },
		});

		isRegister = res;
		if (res) {
			alert("用户名已存在，请更换");
		}
	};

	init();
})();
