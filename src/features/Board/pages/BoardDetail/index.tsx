import { Col, Input, Row, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Column from 'features/Board/components/Column';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useRouteMatch } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import deepClone from 'utils/deepClone';
import { axiosFunRetro } from '../../../../api/axiosClient';

const { Title } = Typography;

// type BoardDetailParams = {
//     boardId: string;
// };

// type BoardDetailProps = {
//     match: match<BoardDetailParams>;
// };

type Board = {
    userId: number;
    boardId: number;
    boardName: string;
    imageUrl: string;
    createdAt: string;
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
type Column = {
    columnId: number;
    columnName: string;
    boardId: number;
};

let socket: any;

const BoardDetail: React.FC = () => {
    const match: any = useRouteMatch();
    const { boardId } = match.params;
    const [boardInfo, setBoardInfo] = useState<Board>();
    const [columnList, setColumnList] = useState<any>([]);

    const [visible, setVisible] = useState(false);
    const [cardContent, setCardContent] = useState('');
    const [selectedCardId, setSelectedCardId] = useState<number>();
    const [selectedColumnPos, setSelectedColumnPos] = useState<any>();
    const [isEdit, setIsEdit] = useState(false);

    console.log('OUTPUT: columnList', columnList);

    useEffect(() => {
        const fetchData = async () => {
            // const columnRes = await axiosFunRetro.get(`/columns?boardId=${boardId}`);
            // const cardRes = await axiosFunRetro.get(`/cards?boardId=${boardId}`);
            const boardRes = await axiosFunRetro.get(`/boards/${boardId}`);

            // if (columnRes.data.status === 'success' && cardRes.data.status === 'success') {
            //     const columnListRes = columnRes.data.data.columnList;
            //     const cardListRes = cardRes.data.data.cardList;
            //     setColumnList(
            //         columnListRes.map((column: any) => {
            //             return {
            //                 columnInfo: column,
            //                 cardList: cardListRes.filter(
            //                     (card: any) => card.columnId === column.columnId
            //                 ),
            //             };
            //         })
            //     );
            // }

            if (boardRes.data.status === 'success') {
                setBoardInfo(boardRes.data.data.boardInfo);
            }
        };

        fetchData();

        socket = socketIOClient('https://api-fun-retro.herokuapp.com/');
        socket.emit('joinBoard', { boardId });
        socket.emit('initialData', { boardId });
        socket.on('getData', (res: any) => {
            console.log(res);
            setColumnList(res.columnList);
        });
        socket.on('changeData', (res: any) => {
            socket.emit('initialData', { boardId });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnDragEnd = async (result: any) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        console.log(result);
        const updatedColumnList = deepClone(columnList);

        // if move card inside column
        if (destination.droppableId === source.droppableId) {
            const selectedColumn = updatedColumnList.filter(
                (column: any) => column.columnInfo.columnName === destination.droppableId
            )[0];
            const updatedCardList = selectedColumn.cardList;
            const updatedCard = updatedCardList[source.index];
            updatedCardList.splice(source.index, 1);
            updatedCardList.splice(destination.index, 0, updatedCard);
            setColumnList(updatedColumnList);

            const payload =
                source.index <= destination.index
                    ? {
                          columnId: selectedColumn.columnInfo.columnId,
                          positionFrom: source.index + 1,
                          positionTo: destination.index + 1,
                          operation: 'minus',
                          cardId: updatedCard.cardId,
                          boardId,
                      }
                    : {
                          columnId: selectedColumn.columnInfo.columnId,
                          positionFrom: destination.index + 1,
                          positionTo: source.index + 1,
                          operation: 'plus',
                          cardId: updatedCard.cardId,
                          boardId,
                      };
            // const res = await axiosFunRetro.patch(`/cards/updatePositionInOneCol`, payload);
            // if (res.data.status === 'success') {
            // }
            socket.emit('updatePositionInOneCol', payload);
        } else {
            // remove card source column
            const sourceColumn = updatedColumnList.filter(
                (column: any) => column.columnInfo.columnName === source.droppableId
            )[0];
            const updatedCard = sourceColumn.cardList[source.index];
            sourceColumn.cardList.splice(source.index, 1);

            const srcColumnPayload = {
                columnId: sourceColumn.columnInfo.columnId,
                positionFrom: source.index + 1,
                positionTo: sourceColumn.cardList.length + 1,
                operation: 'minus',
            };
            // add card destinaton column
            const destinationColumn = updatedColumnList.filter(
                (column: any) => column.columnInfo.columnName === destination.droppableId
            )[0];
            destinationColumn.cardList.splice(destination.index, 0, updatedCard);
            setColumnList(updatedColumnList);

            const destColumnPayload = {
                columnId: destinationColumn.columnInfo.columnId,
                positionFrom: destination.index + 1,
                positionTo: destinationColumn.cardList.length,
                operation: 'plus',
            };

            socket.emit('updatePositionInMultipleCol', {
                sourceColumn: srcColumnPayload,
                destColumn: destColumnPayload,
                cardId: updatedCard.cardId,
                boardId,
            });

            // const res = await axiosFunRetro.patch(`/cards/updatePositionInMultipleCol`, {
            //     sourceColumn: srcColumnPayload,
            //     destColumn: destColumnPayload,
            //     cardId: updatedCard.cardId,
            // });
        }
    };

    const handleAddClick = (columnPos: number) => {
        setVisible(true);
        setSelectedColumnPos(columnPos);
    };

    const handleEditClick = (cardId: number, columnPos: number) => {
        setVisible(true);
        setIsEdit(true);
        setSelectedCardId(cardId);
        setSelectedColumnPos(columnPos);
        setCardContent(
            columnList[columnPos].cardList.filter((card: any) => card.cardId === cardId)[0]
                .cardContent
        );
    };

    const handleOk = async () => {
        if (isEdit) {
            // const payload = {
            //     cardContent,
            // };
            // const res = await axiosFunRetro.patch(`/cards/${selectedCardId}`, payload);
            // if (res.data.status === 'success') {
            //     const updatedColumnList = deepClone(columnList);
            //     updatedColumnList[selectedColumnPos].cardList = updatedColumnList[
            //         selectedColumnPos
            //     ].cardList.map((card: any) =>
            //         card.cardId === selectedCardId ? res.data.data.cardInfo : card
            //     );

            // }
            console.log('edit');
            socket.emit('editCard', { cardId: selectedCardId, cardContent, boardId });
            setCardContent('');
            setVisible(false);
            setIsEdit(false);
        } else {
            // const payload = {
            //     cardContent,
            //     columnId: columnList[selectedColumnPos].columnInfo.columnId,
            //     position: columnList[selectedColumnPos].cardList.length + 1,
            // };
            // const res = await axiosFunRetro.post(`/cards`, payload);
            // if (res.data.status === 'success') {
            //     const updatedColumnList = deepClone(columnList);
            //     updatedColumnList[selectedColumnPos].cardList = [
            //         ...updatedColumnList[selectedColumnPos].cardList,
            //         res.data.data.cardInfo,
            //     ];

            //     setColumnList(updatedColumnList);
            //     setCardContent('');
            //     setVisible(false);
            // }

            socket.emit('addCard', {
                cardContent,
                columnId: columnList[selectedColumnPos].columnInfo.columnId,
                position: columnList[selectedColumnPos].cardList.length + 1,
                boardId,
            });
            setCardContent('');
            setVisible(false);
        }
    };

    const handleCancel = () => {
        setCardContent('');
        setVisible(false);
        setIsEdit(false);
    };

    const handleDelete = async (cardId: number, columnPos: number) => {
        // const res = await axiosFunRetro.delete(`/cards/${cardId}`);
        // if (res.data.status === 'success') {
        //     const updatedColumnList = deepClone(columnList);
        //     updatedColumnList[columnPos].cardList = updatedColumnList[columnPos].cardList.filter(
        //         (card: any) => card.cardId !== cardId
        //     );
        //     setColumnList(updatedColumnList);
        // }
        socket.emit('deleteCard', { cardId, boardId });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'cardContent') {
            setCardContent(e.target.value);
        }
    };

    return (
        <div style={{ height: '90vh', textAlign: 'center' }}>
            <Title style={{ paddingTop: 10 }} level={2}>
                {boardInfo?.boardName}
            </Title>
            <Row>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    {columnList?.map(({ columnInfo, cardList }: any, index: number) => (
                        <Col span={8} key={columnInfo.columnId}>
                            <Column
                                columnInfo={columnInfo}
                                columnPos={index}
                                cardList={cardList}
                                onAddClick={handleAddClick}
                                onEditClick={handleEditClick}
                                onDelete={handleDelete}
                            />
                        </Col>
                    ))}
                </DragDropContext>
            </Row>
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
        </div>
    );
};

export default BoardDetail;
