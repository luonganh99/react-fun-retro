import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const { Title } = Typography;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type Card = {
    cardId: number;
    cardContent: string;
    columnId: number;
};

const Column: React.FC<any> = ({
    columnInfo,
    columnPos,
    cardList,
    onAddClick,
    onEditClick,
    onDelete,
}) => {
    // const [cardList, setCardList] = useState<Card[]>([]);
    // const [visible, setVisible] = useState(false);
    // const [cardContent, setCardContent] = useState('');
    // const [selectedCardId, setSelectedCardId] = useState<number>();
    // const [isEdit, setIsEdit] = useState(false);

    // useEffect(() => {
    //     const fetchCards = async () => {
    //         try {
    //             const res = await axiosFunRetro.get(`/columns/${columnInfo.columnId}`);
    //             if (res.data.status === 'success') {
    //                 setCardList(res.data.data.cardList);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchCards();
    // }, []);

    // const handleAddClick = () => {
    //     setVisible(true);
    // };

    // const handleEditClick = (cardId: number) => {
    //     setVisible(true);
    //     setIsEdit(true);
    //     setSelectedCardId(cardId);
    //     setCardContent(cardList.filter((card) => card.cardId === cardId)[0].cardContent);
    // };

    // const handleOk = async () => {
    //     if (isEdit) {
    //         const payload = {
    //             columnId: columnInfo.columnId,
    //             cardContent,
    //         };
    //         const res = await axiosFunRetro.patch(`/cards/${selectedCardId}`, payload);
    //         if (res.data.status === 'success') {
    //             const updatedCardList = cardList.map((card) =>
    //                 card.cardId === selectedCardId ? res.data.data.cardInfo : card
    //             );
    //             setCardList(updatedCardList);
    //             setCardContent('');
    //             setVisible(false);
    //             setIsEdit(false);
    //         }
    //     } else {
    //         const payload = {
    //             columnId: columnInfo.columnId,
    //             cardContent,
    //         };
    //         const res = await axiosFunRetro.post(`/cards`, payload);
    //         if (res.data.status === 'success') {
    //             const updatedCardList = [...cardList, res.data.data.cardInfo];
    //             setCardList(updatedCardList);
    //             setCardContent('');
    //             setVisible(false);
    //         }
    //     }
    // };

    // const handleCancel = () => {
    //     setCardContent('');
    //     setVisible(false);
    //     setIsEdit(false);
    // };

    // const handleDelete = async (cardId: number) => {
    //     const res = await axiosFunRetro.delete(`/cards/${cardId}`);
    //     if (res.data.status === 'success') {
    //         const updatedCardList = cardList.filter((card) => card.cardId !== cardId);
    //         setCardList(updatedCardList);
    //     }
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.name === 'cardContent') {
    //         setCardContent(e.target.value);
    //     }
    // };

    return (
        <>
            <Title level={4}>{columnInfo?.columnName}</Title>
            <Button
                type='primary'
                style={{ display: 'block', margin: '10px auto' }}
                onClick={() => onAddClick(columnPos)}
            >
                Add Card{' '}
            </Button>
            <Droppable droppableId={columnInfo.columnName}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Space direction='vertical'>
                            {cardList?.map((card: any, index: number) => (
                                <Draggable
                                    key={card.cardId}
                                    draggableId={card.cardId.toString()}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <Card
                                                style={{ width: 320 }}
                                                key={card.cardId}
                                                hoverable
                                                actions={[
                                                    <EditOutlined
                                                        onClick={() =>
                                                            onEditClick(card.cardId, columnPos)
                                                        }
                                                        key='edit'
                                                    />,
                                                    <DeleteOutlined
                                                        onClick={() =>
                                                            onDelete(card.cardId, columnPos)
                                                        }
                                                    />,
                                                ]}
                                            >
                                                {' '}
                                                {card.cardContent}{' '}
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </Space>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    );
};

export default Column;
