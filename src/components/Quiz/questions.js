import React, { useEffect, useState } from 'react';
import Answers from './answers';

function Questions({ info, repeat, repeat_same, parameter, quitting }) {
    const [number, setNumber] = useState(0);
    const [amount, setAmount] = useState(0);
    const [pts, setPts] = useState(0);
    const [usersAns, setUsersAns] = useState(false)
    const [u_choice, setU_choice] = useState([])

    // const [users, setusers] = useState([])
    // let u = []

    const pickAnswer = (e) => {
        let userAnswer = e.target.outerText;
        // u.push(userAnswer)
        // getAnswers(userAnswer)
        setU_choice([...u_choice, userAnswer])
        // if (number >= info.length) {
        //     console.log(usersAns)
        // }


        if (info[number].answer === userAnswer) {
            setPts(pts + 1);
            setNumber(number + 1);
            setAmount(amount + 1);
            // getAnswers(info[number].answer)
        } else {
            setNumber(number + 1);
            setAmount(amount + 1);
            // getAnswers(info[number].answer)
        }

    }
    useEffect(() => {
        if (amount >= info.length) {
            setUsersAns(true)
            // console.log(pts);
        }
    }, [setUsersAns, amount, info.length])

    return <>
        {
            usersAns ? <div>
                <Answers data={info} users={u_choice} repeat={repeat} repeat_same={repeat_same} q_limit={pts} parameter={parameter} quitting={quitting} />
            </div>
                :
                (<>
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
                </>)
        }


    </>;
}

export default Questions;
