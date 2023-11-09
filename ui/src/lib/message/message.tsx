import style from './message.module.less';
import WarnIcon from './assets/warn.svg';
import SuccessIcon from './assets/success.svg';
import ErrorIcon from './assets/error.svg';
import InfoIcon from './assets/info.svg';
import CloseIcon from './assets/close.svg';
import { useEffect, useRef, useState, FC } from 'react';
import { createRoot } from 'react-dom/client';
import classNames from 'classnames';

enum MessageType {
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success',
    INFO = 'info',
    DEFAUTL = 'default',
}

interface IMessage {
    type?: MessageType; // 类型
    duration?: number; // 自动关闭时长，默认为3s
    content: string; // 文本
    autoHide?: boolean; // 是否自动关闭，当autoHide=false, 则hasClose等于true，只能手动关闭
    hasClose?: boolean; // 是否包含关闭按钮
}

interface MessageQueueItem extends IMessage {
    id: string;
}

interface propsMessage {
    warning: (options: IMessage | string) => void;
    success: (options: IMessage | string) => void;
    error: (options: IMessage | string) => void;
    info: (options: IMessage | string) => void;
    default: (options: IMessage | string) => void;
}

const CONTAINER_ID = 'global__message-container';
let containerRoot: any;
let messageCount: number = 0;
let messageQueue: Array<MessageQueueItem> = [];

const MessageItem = (props: MessageQueueItem) => {
    const { type = MessageType.WARNING, content, duration = 3000, id, autoHide = true, hasClose = false } = props;
    const [hidden, setHidden] = useState<boolean>(false);
    const refMessage = useRef<any>();
    const clear = () => removeMessage(id);
    const handleHidden = () => {
        if (refMessage.current) {
            refMessage.current.addEventListener('animationend', clear, {
                once: true,
            });
        }
        setHidden(true);
    };
    useEffect(() => {
        setHidden(false);
        autoHide &&
            setTimeout(() => {
                handleHidden();
            }, duration);
    }, []);
    return (
        <div className={classNames(style.message, style[type], hidden ? style.hidden : style.visible)} ref={refMessage}>
            <div className={style.messageInner}>
                {type === MessageType.SUCCESS && <img alt="" src={SuccessIcon} className={style.messageInnerIcon} />}
                {type === MessageType.ERROR && <img alt="" src={ErrorIcon} className={style.messageInnerIcon} />}
                {type === MessageType.WARNING && <img alt="" src={WarnIcon} className={style.messageInnerIcon} />}
                {type === MessageType.INFO && <img alt="" src={InfoIcon} className={style.messageInnerIcon} />}
                <span>{content}</span>
                {(hasClose || !autoHide) && (
                    <div className={style.messageInnerClose} onClick={handleHidden}>
                        <img className={style.icon} src={CloseIcon} />
                    </div>
                )}
            </div>
        </div>
    );
};

const getUuid = () => {
    return CONTAINER_ID + new Date().getTime() + '-' + messageCount++;
};

const createContainer = () => {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', CONTAINER_ID);
        document.body.appendChild(container);
    }
    return container;
};

const renderMessage = (queue: Array<MessageQueueItem>) => {
    const container = createContainer();
    if (!containerRoot) {
        containerRoot = createRoot(container);
    }
    const messageComp = queue.map((props) => {
        return <MessageItem {...props} key={props.id} />;
    });
    containerRoot.render(messageComp);
};

const addMessage = (options: IMessage) => {
    const id = getUuid();
    messageQueue.push({ ...options, id });
    renderMessage([...messageQueue]);
};

const removeMessage = (id: string) => {
    const position = messageQueue.findIndex((x) => x.id == id);
    messageQueue.splice(position, 1);
    renderMessage([...messageQueue]);
};

const Message = {
    warning: (options: IMessage | string) =>
        addMessage({
            ...(typeof options === 'string' ? { content: options } : options),
            type: MessageType.WARNING,
        }),
    success: (options: IMessage | string) =>
        addMessage({
            ...(typeof options === 'string' ? { content: options } : options),
            type: MessageType.SUCCESS,
        }),
    error: (options: IMessage | string) =>
        addMessage({
            ...(typeof options === 'string' ? { content: options } : options),
            type: MessageType.ERROR,
        }),
    info: (options: IMessage | string) =>
        addMessage({
            ...(typeof options === 'string' ? { content: options } : options),
            type: MessageType.INFO,
        }),
    default: (options: IMessage | string) =>
        addMessage({
            ...(typeof options === 'string' ? { content: options } : options),
            type: MessageType.DEFAUTL,
        }),
};

export default Message as propsMessage;
