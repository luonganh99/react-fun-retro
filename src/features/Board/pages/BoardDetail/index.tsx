import React, { useEffect, useState } from 'react';
import { match } from 'react-router-dom';
import { axiosFunRetro } from '../../../../api/axiosClient';
import { Button, Card, Col, Input, Row, Typography } from 'antd';
import Column from 'features/Board/components/Column';

const { Title } = Typography;

type BoardDetailParams = {
    boardId: string;
};

type BoardDetailProps = {
    match: match<BoardDetailParams>;
};

type Board = {
    userId: number;
    boardId: number;
    boardName: string;
    imageUrl: string;
    createdAt: string;
};

type Column = {
    columnId: number;
    columnName: string;
    boardId: number;
};

const BoardDetail: React.FC<BoardDetailProps> = ({ match }) => {
    const { boardId } = match.params;
    const [boardInfo, setBoardInfo] = useState<Board>();
    const [columnList, setColumnList] = useState<Column[]>([]);

    useEffect(() => {
        const fetchColumns = async () => {
            const res = await axiosFunRetro.get(`/boards/${boardId}`);
            if (res.data.status === 'success') {
                setBoardInfo(res.data.data.boardInfo);
                setColumnList(res.data.data.columnList);
            }
        };

        fetchColumns();
    }, []);

    return (
        <div style={{ height: '90vh', textAlign: 'center' }}>
            <Title style={{ paddingTop: 10 }} level={2}>
                {boardInfo?.boardName}
            </Title>
            <Row>
                {columnList?.map((column) => (
                    <Col span={8} key={column.columnId}>
                        <Column columnInfo={column} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BoardDetail;
