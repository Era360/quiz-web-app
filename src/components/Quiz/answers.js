import React, { useState } from 'react'
import css from "./answers.module.css"

function Answers({ users, data, repeat, repeat_same, q_limit, parameter, quitting }) {
    const [curr, setCurr] = useState(0)

    const Outp = () => {
        return <div className='text-center text-white'>
            <div className='h1 mb-4'>{q_limit === 0 ? "Oops, you got none of the questions. Not bad you can try again."
                :
                `Congrats, you got ${q_limit} out of ${parameter.amount} questions.`}</div>
            <div className='my-3'>
                <div className='my-3'><button className='btn btn-success' onClick={() => repeat_same(parameter)}>repeat with same choices</button></div>
                <button className='btn btn-success mx-4' onClick={repeat}>repeat with different choices</button>
            </div>
            <button className='btn btn-danger fs-5' onClick={quitting}>Quit</button>
        </div>
    }

    const Answer = () => {
        return <>
            <div className={css.card}>
                {
                    data.map((item, index) => (
                        <div className={css.divider} key={index}>
                            <div className={css.quest} dangerouslySetInnerHTML={{ __html: item.question }}></div>
                            <div className={css.ansc}>
                                <div className={css.ans} >
                                    <div dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                                </div>
                            </div>
                            <div>
                                <div className='text-center fw-bold'>Your answer: </div>
                                <div className='text-center'>{users[index]}</div>
                            </div>

                        </div>
                    ))
                }
                <div className={css.btnn}><button className='btn btn-success' onClick={() => setCurr(curr + 1)}>Okay</button></div>
            </div>
        </>
    }

    return (
        <div>
            {
                {
                    0: <Answer />,
                    1: <Outp />
                }[curr]
            }
        </div>
    )
}

export default Answers