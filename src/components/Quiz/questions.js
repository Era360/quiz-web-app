import React, { useEffect, useState } from 'react';

function Questions({ info, sendPts }) {
    const [number, setNumber] = useState(0);
    const [amount, setAmount] = useState(0);
    const [pts, setPts] = useState(0);

    const pickAnswer = (e) => {
        let userAnswer = e.target.outerText;


        if (info[number].answer === userAnswer) {
            setPts(pts + 1);
            setNumber(number + 1);
            setAmount(amount + 1);
        } else {
            setNumber(number + 1);
            setAmount(amount + 1);
        }

    }
    useEffect(() => {
        if (amount >= info.length) {
            sendPts(pts)
            // console.log(pts);
        }
    })

    return <>
        {
            number < info.length
                ?
                <div className='q_cont mb-3'>
                    <div className='q' dangerouslySetInnerHTML={{ __html: info[number].question }}></div>
                    <div className='options'>
                        {
                            info[number].options.map((item, index) => (
                                <div className='option' key={index} dangerouslySetInnerHTML={{ __html: item }} onClick={pickAnswer}>
                                </div>
                            ))
                        }
                    </div>
                </div>
                :
                <div>No more questions</div>

        }

    </>;
}

export default Questions;
