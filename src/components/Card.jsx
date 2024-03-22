
import React from 'react';

const Card = (props) => {
    return (
        <div>
            <li className="card" onClick={() => {
                console.log('Clicked on card: ', props.name);
                props.onClick();
            }}>
                <img src={props.image} ></img>

                <div className="infos">
                    <h2>{props.name}</h2>
                </div>
            </li>
        </div>
    );
};

export default Card;