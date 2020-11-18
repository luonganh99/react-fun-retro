/* eslint-disable @typescript-eslint/no-redeclare */
import { BarsOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { axiosFunRetro } from 'api/axiosClient';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const { Meta } = Card;
const { Title } = Typography;

type Board = {
    userId: number;
    boardId: number;
    boardName: string;
    imageUrl: string;
    createdAt: string;
};

const BoardList: React.FC = () => {
    const [boardList, setBoardList] = useState<Board[]>([]);
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState<null | number>(null);
    const history = useHistory();

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await axiosFunRetro.get('/boards');
                if (res.data.status === 'success') {
                    console.log(res.data.data.boardList);
                    setBoardList(res.data.data.boardList);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBoards();
    }, []);

    const handleAddClick = () => {
        setVisible(true);
    };

    const handleEditClick = (boardId: number) => {
        setVisible(true);
        setIsEdit(true);
        setSelectedBoardId(boardId);
        setName(boardList.filter((board) => board.boardId === boardId)[0].boardName);
    };

    const handleOk = async () => {
        if (isEdit) {
            const payload = {
                boardName: name,
            };
            const res = await axiosFunRetro.patch(`/boards/${selectedBoardId}`, payload);
            if (res.data.status === 'success') {
                const updatedBoardList = boardList.map((board) =>
                    board.boardId === selectedBoardId ? res.data.data.boardInfo : board
                );
                setBoardList(updatedBoardList);
                setName('');
                setVisible(false);
                setIsEdit(false);
            }
        } else {
            const payload = {
                boardName: name,
            };
            const res = await axiosFunRetro.post(`/boards`, payload);
            if (res.data.status === 'success') {
                history.push(`/boards/${res.data.data.boardInfo.boardId}`);
            }
        }
    };

    const handleCancel = () => {
        setName('');
        setVisible(false);
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'name') {
            setName(e.target.value);
        }
    };

    const handleDelete = async (boardId: number) => {
        const res = await axiosFunRetro.delete(`/boards/${boardId}`);
        if (res.data.status === 'success') {
            const updatedBoardList = boardList.filter((board) => board.boardId !== boardId);
            setBoardList(updatedBoardList);
        }
    };

    const handleViewDetail = (boardId: number) => {
        history.push(`/boards/${boardId}`);
    };

    return (
        <div style={{ height: '90vh', width: 1300, margin: 'auto' }}>
            <Title style={{ paddingTop: 10, textAlign: 'center' }} level={2}>
                Board List
            </Title>

            <Row>
                <Col offset='22' style={{ marginBottom: 20 }}>
                    <Button type='primary' style={{ marginLeft: 'auto' }} onClick={handleAddClick}>
                        Add Board
                    </Button>
                </Col>
                {boardList?.map((board, id) => (
                    <Col span={4} key={board.boardId}>
                        <Card
                            style={{ width: 200, margin: 'auto' }}
                            hoverable
                            cover={<img alt={board.imageUrl} src={board.imageUrl} />}
                            actions={[
                                <BarsOutlined onClick={() => handleViewDetail(board.boardId)} />,
                                <EditOutlined
                                    onClick={() => handleEditClick(board.boardId)}
                                    key='edit'
                                />,
                                <DeleteOutlined onClick={() => handleDelete(board.boardId)} />,
                            ]}
                        >
                            <Meta title={board.boardName} description={board.createdAt} />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={isEdit ? 'Edit Board' : 'Add Board'}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input placeholder='Board Name' name='name' value={name} onChange={handleChange} />
            </Modal>
        </div>
    );
};

export default BoardList;
