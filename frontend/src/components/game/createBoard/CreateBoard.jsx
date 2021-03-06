import React, { useState } from 'react';
import { socket } from '../../../socket';
import './css/CreateBoard.css';

export const CreateBoard = ({ setGameMessage }) => {
    const [squares, setSquares] = useState(new Array(64).fill(0));
    const [ship, setShip] = useState([]);
    const [numberOfShips, setNumberOfShips] = useState(0);

    const [clickedReady, setClickedReady] = useState(false);
    // const [count, setCount] = useState(0);

    const ready = () => {
        // console.log('READY!');
        setGameMessage('Waiting for opponent to place ships!');
        // console.log(user.oppId);
        socket.emit('createBoard', squares);
        setClickedReady(true)
    };

    const handleOnClick = index => {
        if (numberOfShips === 4) {
            setGameMessage('You already have 4 ships! Please click Ready!');
            //console.log('You already have 4 ships!');
            return;
        }
        if (ship.length === 4) {
            setGameMessage('Ship size must be 4!');
            //console.log('Ship size must be 4!');
        } else if (squares[index] === 1) {
            setGameMessage('This slot already has a ship.');
        } else {
            // setCount(count + 1);
            setShip(prev => [...prev, index]);
            const newBoard = squares.map(x => x);
            newBoard[index] = newBoard[index] === 0 ? 1 : 0;
            // console.log(newBoard);
            setSquares(newBoard);
        }
        // console.log(ship.length);
    };

    const placeAShip = () => {
        setClickedReady(false);
        if (ship.length !== 4) {
            setGameMessage('Ship size must be 4!');
            //console.log('Ship size must be 4!');
            const newBoard = squares.map(x => x);
            for (let i = 0; i < 4; i++) {
                newBoard[ship[i]] = 0;
            }
            setShip([]);
            setSquares(newBoard);
            return;
        }
        let check = false;
        let check1 = false;
        let check2 = false;
        const checkConsecutive = ship
            .sort((a, b) => a - b)
            .map(v => {
                return [v % 8, Math.floor(v / 8)];
            });
        // console.log(checkConsecutive);
        for (let i = 1; i < 4; i++) {
            if (checkConsecutive[0][0] === checkConsecutive[i][0]) {
                check1 = true;
            } else {
                check1 = false;
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            if (checkConsecutive[0][1] === checkConsecutive[i][1]) {
                check2 = true;
            } else {
                check2 = false;
                break;
            }
        }
        // console.log('check1' + check1);
        // console.log('check2' + check2);
        if (check1) {
            for (let i = 1; i < 4; i++) {
                if (checkConsecutive[0][1] + i === checkConsecutive[i][1]) {
                    check = true;
                } else {
                    check = false;
                    break;
                }
            }
        } else if (check2) {
            for (let i = 1; i < 4; i++) {
                if (checkConsecutive[0][0] + i === checkConsecutive[i][0]) {
                    check = true;
                } else {
                    check = false;
                    break;
                }
            }
        }
        // console.log(check);
        if (check && numberOfShips < 4) {
            setNumberOfShips(prev => {
                setGameMessage(
                    `You have placed ${prev + 1} ship(s). Place ${3 - prev} ship(s) more.`,
                );
                return prev + 1;
            });
        } else {
            if (check) {
                setGameMessage('You already have 4 ships! Please click Ready!');
            } else {
                setGameMessage('Ship must be 4 consecutive blocks.');
            }
            const newBoard = squares.map(x => x);
            for (let i = 0; i < 4; i++) {
                newBoard[ship[i]] = 0;
            }
            setSquares(newBoard);
        }
        // setCount(0);
        setShip([]);
        // console.log(ship.length);
    };

    const renderSquare = () => {
        return squares.map((value, index) => {
            return (
                <div
                    key={index}
                    onClick={e => handleOnClick(index)}
                    style={{
                        width: '12.5%',
                        height: '12.5%',
                        borderColor: 'black',
                        borderStyle: 'solid',
                    }}
                >
                    {value === 1 && (
                        <div
                            style={{
                                backgroundColor: 'red',
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <div className='containerBoard'>
                <div>{renderSquare()}</div>
                {numberOfShips !== 4 && (
                    <button id='placeShip' onClick={placeAShip}>
                        Place a Ship
                    </button>
                )}
                {numberOfShips === 4 && (
                    <button className={`ready ${clickedReady && 'wait'}`} onClick={ready}>
                        Ready
                    </button>
                )}
            </div>
        </>
    );
};
