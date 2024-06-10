"use client";

import { useState, useEffect } from 'react';
import PromptCard from '@components/PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [defaultPosts, setDefaultPosts] = useState([]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const filterPosts = (text) => {
    const regex = new RegExp(text, 'i');
    const filteredPosts = defaultPosts.filter((post) =>
        regex.test(post.creator.username) ||
        regex.test(post.prompt) ||
        regex.test(post.tag)
      );
    setPosts(filteredPosts);
  }

  const delayedFilterPosts = debounce((text) => {
    filterPosts(text);
  }, 750);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    delayedFilterPosts(e.target.value);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
      setDefaultPosts(data);
    }

    fetchPosts();
  }, [])

  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
            Discover & Share
            <br className="max-md:hidden"/>
            <span className="orange_gradient text-center">AI Prompts</span>
        </h1>
        <p className="desc text-center">
            PromptSpace is an open-source AI prompting tool for modern world to discover, create, and share creative prompts
        </p>

        <section className='feed'>
          <form className='relative w-full flex-center'> 
            <input
              type='text'
              placeholder='Search for a prompt, tag, or username'
              value={searchText}
              onChange={handleSearchChange}
              className='search_input peer'
              required
            />
          </form>
          {searchText === '' ? (
            <PromptCardList
              data={defaultPosts}
              handleTagClick={(tag) => {
                setSearchText(tag);
                filterPosts(tag);
              }}
            />
          ) : (
            <PromptCardList
              data={posts}
              handleTagClick={(tag) => {
                setSearchText(tag);
                filterPosts(tag);
              }}
            />
          )}
        </section>
    </section>
  )
}

export default Home