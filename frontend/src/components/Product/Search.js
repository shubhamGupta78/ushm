import React, { Fragment, useState } from 'react'
import './Search.css'
import MetaData from '../layouts/MetaData';
const Search = ({history}) => {
    const [keyword,searchKeyword]=useState("");

    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        if(keyword.trim())
        {
            history.push(`/products/${keyword}`);
        }
        else
        {
            history.push(`/products/`);
        }
    }

  return (
   <Fragment>
       <MetaData title="search a product"/>
       <form className="searchBox" onSubmit={searchSubmitHandler}>
           <input 
                    type="text" 
                    placeholder="enter value to search"
                    onChange={(e)=> searchKeyword(e.target.value)}
                    />
                    <input type="submit" value="Search"/>
       </form>
   </Fragment>
  )
}

export default Search
