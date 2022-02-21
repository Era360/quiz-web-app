import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { EmojiAngryFill } from 'react-bootstrap-icons';
import { db } from '../../firebase';
import Spinner from '../utils/spinner';

function Category(props) {
    const [catego, setCatego] = useState();
    const [fav, setFav] = useState()
    const [best, setBest] = useState([]);
    const [params, setParams] = useState();
    const [currPara, setCurrpara] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        if (props.currentUser) {
            fetchfav()
        }
        fetchlist();

        async function fetchfav() {
            try {
                const { uid } = props.currentUser;
                const userRef = doc(db, `users/${uid}`);
                const data = await getDoc(userRef)
                if (data.data()["favourite"]) {
                    setFav(data.data()["favourite"])
                    let bests = []
                    data.data()["favourite"].forEach((item) => {
                        if (bests.length === 3) {
                            const min = bests.reduce(function (prev, current) {
                                return (prev.count < current.count) ? prev : current
                            })
                            const index = bests.indexOf(min);
                            if (index > -1) {
                                bests[index] = item;
                            }
                            // console.log(min);
                        } else {
                            bests.push(item)
                        }
                        // console.log(item["count"])
                    })

                    setBest(bests);
                }

            } catch (error) {
                console.log(error.message);
            }
        }
        async function fetchlist() {
            try {
                const res = await fetch("https://opentdb.com/api_category.php");
                const data = await res.json();
                setCatego(data.trivia_categories);

            } catch (error) {
                console.log(error);
            }
        }
    }, [props])

    const pickCat = async (item, index) => {
        // console.log(item);
        setParams({
            ...params,
            "cat_id": item["id"]
        })

        if (props.currentUser) {
            setLoading(true);
            const { uid } = props.currentUser;
            const dbRefDif = doc(db, `users/${uid}`);
            let gotIt = false
            let none = false
            let indexx;

            if (fav === undefined) {
                try {

                    let favourite = {
                        id: item["id"],
                        count: 1,
                        name: item["name"]
                    }
                    await updateDoc(dbRefDif, {
                        favourite: arrayUnion(favourite)
                    });

                } catch (err) {
                    console.log("failed to upload favourite")
                }

            } else if (fav.includes(item)) {
                fav[index]["count"] += 1
                await setDoc(dbRefDif, {
                    favourite: fav
                }, { merge: true });
            } else {
                fav.forEach((itemm, index) => {
                    if (itemm["name"] === item["name"]) {
                        indexx = index
                        gotIt = true
                        none = false
                    } else {
                        none = true
                    }
                })
            }
            if (gotIt) {
                fav[indexx]["count"] += 1
                await setDoc(dbRefDif, {
                    favourite: fav
                }, { merge: true });
            } else if (none) {
                let favourite = {
                    id: item["id"],
                    count: 1,
                    name: item["name"]
                }
                await updateDoc(dbRefDif, {
                    favourite: arrayUnion(favourite)
                });
            }
        }
        setLoading(false);
        setCurrpara(currPara + 1)
    };

    const difPut = (e) => {
        setParams({
            ...params,
            "dif": e.target.outerText
        })
        setCurrpara(currPara + 1)
    };
    const amountPut = (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        const amount = parseInt(data.get("amount"));
        if (amount > 50) {
            setError("Please enter amount less than 50")
        } else if (amount <= 0) {
            setError("Please enter resonable number of questions.")
        }

        else {
            setParams({
                ...params,
                "amount": amount
            })
            setCurrpara(currPara + 1)
        }
    };
    const submitting = () => {
        props.setcat(params);
        setCurrpara(0)
    };

    const Cats = () => {
        return <div className='text-white'>
            {
                !loading ?
                    <>
                        {
                            best[0] ?
                                <>
                                    <div className='h4 mx-4'>What you might like</div>
                                    <div className='categories'>
                                        {best.map((item, index) => (
                                            <div className='category' key={index} onClick={() => pickCat(item, index)}>
                                                {item["name"]}
                                            </div>
                                        ))}
                                    </div>
                                </>
                                :
                                <Spinner />
                        }

                        <div className='h4 mx-4'>Choose your favorite category</div>
                        <div className='categories'>
                            {catego.map((item, index) => (
                                <div className='category' key={index} dangerouslySetInnerHTML={{ __html: item["name"] }} onClick={() => pickCat(item)}>
                                </div>
                            ))}
                        </div>

                    </>
                    :
                    <Spinner />
            }
        </div>;
    }
    const Difficulty = () => {
        const difs = ["easy", "medium", "hard"]
        return <div className='text-white'>
            <div className='h4 mx-2'>How hard?</div>
            <div className='categories'>
                {difs.map((item, index) => (
                    <div className='category' key={index} dangerouslySetInnerHTML={{ __html: item }} onClick={difPut}>
                    </div>
                ))}
            </div>
        </div>;
    }
    const Amount = () => {
        const but = {
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            margin: "8px 5px",
            boxSizing: "border-box",
            color: "white",
            backgroundColor: "#94928e"
        }
        const style = {
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            margin: "8px 0",
            boxSizing: "border-box",
        };

        return <div className='text-white text-center'>
            {!error ?
                <div className='alert alert-warning' role="alert" style={{ width: "max-content", margin: "0 auto" }}>Not more than 50 questions please</div>
                :
                <>
                    <EmojiAngryFill color='#bd523c' size={40} style={{ margin: "10px" }} />
                    <div role="alert" className="alert alert-danger" style={{ width: "max-content", margin: "0 auto" }} >{error}</div>
                </>
            }
            <form onSubmit={amountPut} >
                <input required type="number" style={style} name='amount' placeholder='How many questions' />
                <button type="submit" style={but}>Enter</button>
            </form>
        </div>;
    }
    const Sub = () => {
        const but = {
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            margin: "8px 5px",
            boxSizing: "border-box",
            color: "white",
            backgroundColor: "#94928e"
        }
        return <div className='text-center'>
            <button style={but} onClick={submitting}>Done</button>
        </div>
    };

    return <>
        <div>
            {!catego ? <Spinner /> :
                {
                    0: <Cats />,
                    1: <Difficulty />,
                    2: <Amount />,
                    3: <Sub />
                }[currPara]

            }
        </div>
    </>;
}

export default Category;
