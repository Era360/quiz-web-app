import React, { useEffect, useState } from 'react';
import { EmojiAngryFill } from 'react-bootstrap-icons';
import Spinner from './spinner';

function Category(props) {
    const [catego, setCatego] = useState();
    const [params, setParams] = useState();
    const [currPara, setCurrpara] = useState(0);
    const [error, setError] = useState("");
    // const navigate = useNavigate();

    useEffect(() => {
        fetchlist();

        async function fetchlist() {
            try {
                const res = await fetch("https://opentdb.com/api_category.php");
                const data = await res.json();
                setCatego(data.trivia_categories);

            } catch (error) {
                console.log(error);
            }
        }
    }, [])
    const pickCat = (id) => {
        setParams({
            ...params,
            "cat_id": id
        })
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
        } else {
            setParams({
                ...params,
                "amount": amount
            })
            setCurrpara(currPara + 1)
        }
    };
    const submitting = () => {
        // console.log(params);
        props.setcat(params);
        setCurrpara(0)
    };

    const Cats = () => {
        return <div className='text-white'>
            <div className='h4 mx-2'>Choose your favorite category</div>
            <div className='categories'>
                {catego.map((item, index) => (
                    <div className='category' key={index} dangerouslySetInnerHTML={{ __html: item["name"] }} onClick={() => pickCat(item["id"])}>
                    </div>
                ))}
            </div>
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
