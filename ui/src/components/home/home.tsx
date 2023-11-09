import styles from './home.module.less';
import { Button, Card, Col, Input, Layout, Menu, message, Modal, Row, Select, Space } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import React, { useState } from 'react';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { siderStyle } from './home.style';
import { v4 as uuidv4 } from 'uuid';
import http from '@/utils/axios';

interface ModelInfo {
    model_name_or_path: string;
    nickname: string;
    id: string;
}
interface UserInfo {
    username: string;
    id: string;
}

const Home = () => {
    const initModelInfo: ModelInfo[] = [
        {
            model_name_or_path: '',
            nickname: '',
            id: uuidv4(),
        },
    ];
    const initUserInfo: UserInfo[] = [
        {
            username: '',
            id: uuidv4(),
        },
    ];
    const [modelInfoList, setModelInfoList] = useState<ModelInfo[]>(initModelInfo);
    const [userInfoList, setUserInfoList] = useState<UserInfo[]>(initUserInfo);

    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configName, setConfigName] = useState<string>('新的设置');
    const [inputConfigName, setInputConfigName] = useState<string>('');

    const addModelInfoEvent = () => {
        const len = modelInfoList.length;
        if (len > 4) {
            messageApi.open({
                type: 'error',
                content: '模型的配置数量不能超过4个',
            });
        } else {
            let newModelInfoList = modelInfoList.slice();
            const modelInfo: ModelInfo = {
                model_name_or_path: '',
                nickname: '',
                id: uuidv4(),
            };
            newModelInfoList.push(modelInfo);
            setModelInfoList(newModelInfoList);
        }
    };

    const addUserInfoEvent = () => {
        const len = userInfoList.length;
        if (len > 4) {
            messageApi.open({
                type: 'error',
                content: '用户的数量不能超过4个',
            });
        } else {
            let newUserInfoList = userInfoList.slice();
            const userInfo: UserInfo = {
                username: '',
                id: uuidv4(),
            };
            newUserInfoList.push(userInfo);
            setUserInfoList(newUserInfoList);
        }
    };

    const editModelNameEvent = (idx: number) => (e: any) => {
        const model_name_or_path = e.target.value;
        const newItem: ModelInfo = {
            model_name_or_path: model_name_or_path,
            nickname: modelInfoList[idx].nickname,
            id: modelInfoList[idx].id,
        };
        modelInfoList[idx] = newItem;
        setModelInfoList(modelInfoList);
    };
    const editNickNameEvent = (idx: number) => (e: any) => {
        const nickname = e.target.value;
        const newItem: ModelInfo = {
            model_name_or_path: modelInfoList[idx].model_name_or_path,
            nickname: nickname,
            id: modelInfoList[idx].id,
        };
        modelInfoList[idx] = newItem;
        setModelInfoList(modelInfoList);
    };
    const editUserNameEvent = (idx: number) => (e: any) => {
        const userName = e.target.value;
        const newItem: UserInfo = {
            username: userName,
            id: modelInfoList[idx].id,
        };
        userInfoList[idx] = newItem;
        setUserInfoList(userInfoList);
    };
    const deleteModelInfoEvent = (idx: number) => {
        const newModelInfoList = [...modelInfoList];
        newModelInfoList.splice(idx, 1);
        console.log(modelInfoList);
        setModelInfoList(newModelInfoList);
    };
    const deleteUserInfoEvent = (idx: number) => {
        const newUserInfoList = [...userInfoList];
        newUserInfoList.splice(idx, 1);
        setUserInfoList(newUserInfoList);
    };
    const editeConfigNameEvent = () => {
        if (inputConfigName.length == 0) {
            messageApi.open({
                type: 'error',
                content: '请先输入配置的名字',
            });
        } else {
            setConfigName(inputConfigName);
            setIsModalOpen(false);
        }
    };
    const editeInputConfigNameEvent = (e: any) => {
        setInputConfigName(e.target.value);
    };

    const submitFormEvent = () => {
        const confirmInfo = () => {
            let valid = false;
            modelInfoList.map((modelInfo: ModelInfo) => {
                if (modelInfo.model_name_or_path.length === 0) {
                    valid = valid || true;
                }
            });
            userInfoList.map((userInfo: UserInfo) => {
                console.log(userInfo.username.length);
                if (userInfo.username.length === 0) {
                    valid = valid || true;
                }
            });
            return valid;
        };
        if (!confirmInfo()) {
            http.post<any, any>('/set_config', {
                data: {
                    userInfo: userInfoList,
                    modelInfo: modelInfoList,
                },
            }).then((res: any) => {
                console.log(res);
            });
        } else {
            messageApi.open({
                type: 'error',
                content: '请先填写内容',
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="修改设置名字"
                open={isModalOpen}
                onOk={editeConfigNameEvent}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input onChange={editeInputConfigNameEvent} placeholder="请输入设置名字" />
            </Modal>
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    style={siderStyle}
                >
                    <div className={styles.siderTiltle}>ChatZoo Config</div>

                    <div className={styles.siderBody}>
                        <div className={styles.siderItem}>
                            <div className={styles.siderItemName}>{configName}</div>
                            <div className={styles.siderItemTime}>2023/11/8</div>
                        </div>
                    </div>
                </Sider>
                <Layout>
                    <Header className={styles.mainHeader}>
                        <div className={styles.mainHeaderName}>{configName}</div>
                        <div className={styles.mainHeaderIcon}>
                            <Button onClick={() => setIsModalOpen(true)} icon={<EditOutlined />}></Button>
                        </div>
                    </Header>
                    <Content className={styles.mainContent}>
                        <Space direction="vertical" size={16} className={styles.spaceStyle}>
                            <Card
                                className={styles.mainContentCard}
                                title="模型配置"
                                extra={
                                    <Button onClick={addModelInfoEvent} style={{ fontWeight: 700 }} type="text">
                                        More
                                    </Button>
                                }
                            >
                                {modelInfoList.map((modelInfo: ModelInfo, idx: number) => {
                                    return (
                                        <Card
                                            key={modelInfo.id}
                                            title={'模型' + idx.toString()}
                                            extra={
                                                <Button
                                                    onClick={() => deleteModelInfoEvent(idx)}
                                                    icon={<DeleteOutlined />}
                                                ></Button>
                                            }
                                            type="inner"
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input
                                                onChange={editModelNameEvent(idx)}
                                                defaultValue={modelInfo.model_name_or_path}
                                                className={styles.mainContentCardInput}
                                                placeholder="model_name_or_path"
                                            />
                                            <Input
                                                onChange={editNickNameEvent(idx)}
                                                defaultValue={modelInfo.nickname}
                                                className={styles.mainContentCardInput}
                                                placeholder="nickname"
                                            />
                                        </Card>
                                    );
                                })}
                            </Card>
                            <Card
                                className={styles.mainContentCard}
                                title="用户配置"
                                extra={
                                    <Button onClick={addUserInfoEvent} style={{ fontWeight: 700 }} type="text">
                                        More
                                    </Button>
                                }
                            >
                                {userInfoList.map((userInfo: UserInfo, idx: number) => {
                                    return (
                                        <Card
                                            key={userInfo.id}
                                            title={'用户' + idx.toString()}
                                            extra={
                                                <Button
                                                    onClick={() => deleteUserInfoEvent(idx)}
                                                    icon={<DeleteOutlined />}
                                                ></Button>
                                            }
                                            type="inner"
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input
                                                onChange={editUserNameEvent(idx)}
                                                defaultValue={userInfo.username}
                                                className={styles.mainContentCardInput}
                                                placeholder="username"
                                            />
                                        </Card>
                                    );
                                })}
                            </Card>
                        </Space>
                    </Content>
                    <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                        <Button onClick={submitFormEvent} style={{ width: 100 }} type="primary">
                            提交
                        </Button>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};
export default Home;
