import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row, Space, Typography } from 'antd';
import { axiosFunRetro } from 'api/axiosClient';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { useHistory } from 'react-router-dom';
const { Title } = Typography;

type TColumn = {
    columnId: number;
    columnName: string;
    boardId: number;
};

type Card = {
    cardId: number;
    cardContent: string;
    columnId: number;
};

type ColumnProps = {
    columnInfo: TColumn;
};

const Column: React.FC<ColumnProps> = ({ columnInfo }) => {
    const [cardList, setCardList] = useState<Card[]>([]);
    const [visible, setVisible] = useState(false);
    const [cardContent, setCardContent] = useState('');
    const [selectedCardId, setSelectedCardId] = useState<number>();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await axiosFunRetro.get(`/columns/${columnInfo.columnId}`);
                if (res.data.status === 'success') {
                    setCardList(res.data.data.cardList);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCards();
    }, []);

    const handleAddClick = () => {
        setVisible(true);
    };

    const handleEditClick = (cardId: number) => {
        setVisible(true);
        setIsEdit(true);
        setSelectedCardId(cardId);
        setCardContent(cardList.filter((card) => card.cardId === cardId)[0].cardContent);
    };

    const handleOk = async () => {
        if (isEdit) {
            const payload = {
                columnId: columnInfo.columnId,
                cardContent,
            };
            const res = await axiosFunRetro.patch(`/cards/${selectedCardId}`, payload);
            if (res.data.status === 'success') {
                const updatedCardList = cardList.map((card) =>
                    card.cardId === selectedCardId ? res.data.data.cardInfo : card
                );
                setCardList(updatedCardList);
                setCardContent('');
                setVisible(false);
                setIsEdit(false);
            }
        } else {
            const payload = {
                columnId: columnInfo.columnId,
                cardContent,
            };
            const res = await axiosFunRetro.post(`/cards`, payload);
            if (res.data.status === 'success') {
                const updatedCardList = [...cardList, res.data.data.cardInfo];
                setCardList(updatedCardList);
                setCardContent('');
                setVisible(false);
            }
        }
    };

    const handleCancel = () => {
        setCardContent('');
        setVisible(false);
        setIsEdit(false);
    };

    const handleDelete = async (cardId: number) => {
        const res = await axiosFunRetro.delete(`/cards/${cardId}`);
        if (res.data.status === 'success') {
            const updatedCardList = cardList.filter((card) => card.cardId !== cardId);
            setCardList(updatedCardList);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'cardContent') {
            setCardContent(e.target.value);
        }
    };
    return (
        <>
            <Title level={4}>{columnInfo?.columnName}</Title>
            <Button
                type='primary'
                style={{ display: 'block', margin: '10px auto' }}
                onClick={handleAddClick}
            >
                Add Card{' '}
            </Button>
            <Space direction='vertical'>
                {cardList?.map((card) => (
                    <Card
                        style={{ width: 320 }}
                        key={card.cardId}
                        hoverable
                        actions={[
                            <EditOutlined
                                onClick={() => handleEditClick(card.cardId)}
                                key='edit'
                            />,
                            <DeleteOutlined onClick={() => handleDelete(card.cardId)} />,
                        ]}
                    >
                        {' '}
                        {card.cardContent}{' '}
                    </Card>
                ))}
            </Space>
            <Modal
                title={isEdit ? 'Edit Card' : 'Add Card'}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    placeholder='Card Content'
                    name='cardContent'
                    value={cardContent}
                    onChange={handleChange}
                />
            </Modal>
        </>
    );
};

export default Column;
