const BASE_URL = "https://study.duyiedu.com/api";

const fetchFn = async ({ url, method = "GET", params = {} }) => {
	const extendsObj = {};
	sessionStorage.token && (extendsObj.Authorization = "Bearer " + sessionStorage.token);
	if (method === "GET" && Object.keys(params).length) {
		// url += '?' + Object.keys(params).map(key=>''.concat(key,"=",params[key])).join('&');
		url +=
			"?" +
			Object.keys(params)
				.map((key) => `${key}=${params[key]}`)
				.join("&");
	}

	try {
		const response = await fetch(BASE_URL + url, {
			method,
			headers: {
				"Content-Type": "application/json",
				...extendsObj,
			},
			body: method === "GET" ? null : JSON.stringify(params),
		});

		const token = response.headers.get("Authorization");
		token && (sessionStorage.token = token);

		const result = await response.json();
		if (result.code === 0) {
			if (result.hasOwnProperty("chatTotal")) {
				result.data = { chatTotal: result.chatTotal, data: result.data };
			}
			return result.data;
		} else if (result.status === 401) {
			alert("权限token错误");
			sessionStorage.removeItem(token);
			window.location.replace("../login.html");
			return;
		} else {
			alert(result.msg);
		}
	} catch (err) {
		console.log(err);
	}
};
