import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Fib() {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        const values = (await axios.get('/api/values/current')).data;
        console.log(':: Values ::');
        console.log(values);
        setValues(values);
    }

    const fetchIndexes = async () => {
        const seenIndexes = (await axios.get('/api/values/all')).data;
        console.log(seenIndexes);
        setSeenIndexes(seenIndexes);
    }

    useEffect(() => {
        async function fetchData() {
            await fetchValues();
            await fetchIndexes();
        }
        fetchData();
    }, []);

    const renderSeenIndexes = () => {
        return seenIndexes.map(({ number }) => number).join(', ');
    }

    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For Index {key}, I Calculated {values[key]}
                </div>
            )
        }
        return <div>{entries}</div>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('/api/values', {
            index
        });
        setIndex('');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index: </label>
                <input value={index} onChange={(e) => setIndex(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>

            <h3>Indexes I have seen: </h3>
            {
                renderSeenIndexes()
            }
            <h3>Calculated Values: </h3>
            {
                renderValues()
            }
        </div>
    )
}