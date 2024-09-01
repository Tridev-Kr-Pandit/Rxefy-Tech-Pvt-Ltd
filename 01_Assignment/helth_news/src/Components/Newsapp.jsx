import React, { useEffect, useState } from 'react'
import Card from './Card'

const Newsapp = () => {
    const [newsData, setNewsData] = useState(null)

    const getData = async() =>{
        // const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
        const response = await fetch('https://newsapi.org/v2/everything?q=health&apiKey=74ac6855b8a145f69b23aa49c90ac752');
        const jsonData = await response.json();
        // console.log(jsonData.articles);
        let dt = jsonData.articles.slice(0,10)
        setNewsData(dt)
        
    }

    useEffect(()=>{
        getData()
    },[])

    const handleInput = (e) =>{
        console.log(e.target.value);
        setSearch(e.target.value)
        
    }

  return (
    <div>
        <nav>
            <div>
                <h1>HealthNews</h1>
            </div>
            <ul style={{display:"flex", gap:"11px"}}>
                <a style={{fontWeight:600, fontSize:"17px"}}>All News</a>
                <a style={{fontWeight:600, fontSize:"17px"}}>Trending</a>

            </ul>
            <div className=''>
                <button>Subscribe</button>
            </div>
        </nav>
        <div>
            <p className='head'>Stay Update with TrendyNews</p>
        </div>
        <div className='categoryBtn'>
            <button value="health">Health</button>
        </div>

        <div>
        {newsData?  <Card data={newsData}/> : null}
            
        </div>
    </div>
  )
}

export default Newsapp