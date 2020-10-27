import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title } = Typography;

type Board = {
    userId: number;
    boardId: number;
    name: string;
    imageUrl: string;
    createdAt: string;
};

const Board = () => {
    const [boards, setBoards] = useState<Board[]>([]);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await axios.get('http://localhost:7000/board');
                console.log(res.data);
                setBoards(res.data.boards);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBoards();
    }, []);

    return (
        <>
            <Title>Board List</Title>
            <Space size='large'>
                {boards.map((board) => (
                    <Card
                        style={{ width: 200 }}
                        key={board.boardId}
                        hoverable
                        cover={<img alt={board.imageUrl} src={board.imageUrl} />}
                        actions={[<EditOutlined key='edit' />]}
                    >
                        <Meta title={board.name} description={board.createdAt} />
                    </Card>
                ))}
            </Space>
        </>
    );
};

export default Board;
