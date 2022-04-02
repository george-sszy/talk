(() => {
    let page = 0;
    let size = 10;
    let chatTotal = 0;
    let sendType = 'enter';
    const init = () => {
        getUserInfo();
        initChatList('bottom');
        initEvent();
    };

    const initEvent = () => {
        sendBtn.addEventListener('click', onSendBtnClick);
        contentBody.addEventListener('scroll', onContentBodyScroll);
        arrowBtn.addEventListener('click', onArrowBtnClick);
        document
            .querySelectorAll('.select-item')
            .forEach(node => node.addEventListener('click', onSelectItemClick));
        inputContainer.addEventListener('keyup', onInputContainerKeyUp);
        closeBtn.addEventListener('click', onCloseBtnClick);
        clearBtn.addEventListener('click', onClearBtnClick);
    };

    const onClearBtnClick = () => {
        inputContainer.value = '';
    };

    const onCloseBtnClick = () => {
        sessionStorage.removeItem('token');
        window.location.replace(baseURL + 'login.html');
    };

    const onInputContainerKeyUp = e => {
        if (
            (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey) ||
            (e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey)
        ) {
            sendBtn.click();
        }
    };

    const onSelectItemClick = function () {
        /* 高亮状态的处理 */
        document.querySelectorAll('.select-item').forEach(node => node.classList.remove('on'));
        this.classList.add('on');
        /* 赋值的操作 */
        sendType = this.getAttribute('type');
        selectType.style.display = 'none';
    };

    const onArrowBtnClick = () => {
        selectType.style.display = 'block';
    };

    const onContentBodyScroll = function () {
        if (this.scrollTop === 0) {
            // 	/* 判断后端是否还有数据 */
            if (chatTotal <= (page + 1) * size) return;
            page++;
            initChatList('top');
        }
    };

    const onSendBtnClick = async () => {
        const content = inputContainer.value.trim();

        if (!content) {
            window.alert('发送消息不能为空');
            return;
        }
        renderChatForm([{ from: 'user', content }], 'bottom');
        inputContainer.value = '';

        const res = await fetchFn({
            url: '/chat',
            method: 'POST',
            params: { content },
        });
        renderChatForm([{ from: 'robot', content: res.content }], 'bottom');
    };

    const getUserInfo = async () => {
        const res = await fetchFn({
            url: '/user/profile',
        });

        nickname.innerHTML = res.nickname;
        accountName.innerHTML = res.loginId;
        loginTime.innerHTML = formaDate(res.lastLoginTime);
    };

    const initChatList = async direction => {
        const res = await fetchFn({
            url: '/chat/history',
            params: {
                page,
                size,
            },
        });
        chatTotal = res.chatTotal;
        renderChatForm(res.data, direction);
    };

    const renderChatForm = (list, direction) => {
        list.reverse();
        if (!list.length) {
            contentBody.innerHTML = `<div class="chat-container robot-container">
                                        <img src="./img/robot.jpg" alt="">
                                        <div class="chat-txt">
                                            您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                                        </div>
                                    </div>
                                    `;
        }

        const chatData = list.map(item => {
            return item.from === 'user'
                ? `<div class="chat-container avatar-container">
                        <img src="./img/avtar.png" alt="">
                        <div class="chat-txt">${item.content}</div>
                </div>`
                : `<div class="chat-container robot-container">
                        <img src="./img/robot.jpg" alt="">
                        <div class="chat-txt">
                            ${item.content}
                        </div>
                  </div>`;
        });
        contentBody.innerHTML += chatData.join('');
        if (direction === 'bottom') {
            const bottomDistance =
                document.querySelectorAll('.chat-container')[
                    document.querySelectorAll('.chat-container').length - 1
                ].offsetTop;
            contentBody.scrollTo(0, bottomDistance);
        } else {
            contentBody.innerHTML = chatData.join(' ') + contentBody.innerHTML;
        }
    };
    init();
})();
