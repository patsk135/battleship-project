import React from 'react';
import { Overlay } from './Overlay';

export const BoardSquare = ({ isPlaced, isAttacked, isOwner }) => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            {isPlaced && isAttacked && (
                <img style={{ width: '130%', height: '130%' }} src='/boom.png' alt='' />
            )}
            {isPlaced && isAttacked && <Overlay color='red'></Overlay>}
            {isOwner && isPlaced && !isAttacked && <Overlay color='red'></Overlay>}
            {isOwner && !isPlaced && isAttacked && <Overlay color='blue'></Overlay>}
            {isOwner && !isPlaced && !isAttacked && <Overlay color='white'></Overlay>}
            {!isOwner && !isAttacked && <Overlay color='white'></Overlay>}
            {!isOwner && isAttacked && !isPlaced && <Overlay color='blue'></Overlay>}
            {/* {isOwner && isPlaced && isAttacked && <Overlay color='black'></Overlay>} */}
            {/* {!isOwner && isAttacked && isPlaced && <Overlay color='black'></Overlay>} */}
        </div>
    );
};
