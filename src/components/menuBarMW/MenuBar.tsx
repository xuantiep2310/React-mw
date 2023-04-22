import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
  children?: MenuItem[];
}

interface Props {
  items: MenuItem[];
}

// const activeItem = localStorage.getItem("activePriceboardTab");
// const activeItemChild = localStorage.getItem("activePriceboardTabMenu");

const MenuBar: React.FC<Props>  = ({items}) => {
  
  const activeItem = localStorage.getItem("activePriceboardTab");
  const activeItemChild = localStorage.getItem("activePriceboardTabMenu");
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
    const [activeMenuItemChild, setActiveMenuItemChild] = useState<string | null>(null);
    useEffect(() => {
      // Load active item from localStorage
      const activeItem = localStorage.getItem("activePriceboardTab");
      const activeItemChild = localStorage.getItem("activePriceboardTabMenu");
      console.log(activeItem)
      if (activeItem) {
        setActiveMenuItem(activeItem);
      }
      if (activeItemChild) {
        setActiveMenuItemChild(activeItemChild);
      }
    }, []);
  const handleItemClick = (path: string) => {
    
    setActiveMenuItem(path);
    localStorage.setItem("activePriceboardTab", path);
    console.log(path)
  };
  const handleItemChildClick = (path: string,name:string) => {
    setActiveMenuItemChild(path);
    localStorage.setItem("activePriceboardTabMenu", name);
    //localStorage.setItem("activePriceboardTab", path);
    console.log(path)
  };
  const renderMenuItemChild =(item:MenuItem) =>{
    //console.log(item)
    //console.log(Object.keys(item))
    return(
      <li  key={item.path}
      
      onClick={() => handleItemChildClick(item.path,item.name)}
      >
        <Link  to={item.path} 
        className={`${ activeMenuItemChild === item.path ? 'active' : ''} `}
         >
        {item.name}
        </Link>
      </li>
    )
  }
  const renderMenuItemChildS =(item:MenuItem,index:number) =>{
    return(
      <li  key={index}
      className={`${ index % 2 === 0 ? "float-left" : "float-right" }`}
      onClick={() => handleItemChildClick(item.path,item.name)}
      >
        <Link  to={item.path} 
        className={`${ activeMenuItemChild === item.path ? 'active' : ''} `}
         >
        {item.name}
        </Link>
      </li>
    )
  }
  const renderMenuItem = (item: MenuItem) => {
 
    // const isActive = item.path === activeItem;
    return (
      <div
        key={item.path}
        className={`group list-sub-menu ${ activeMenuItem === item.path ? 'active' : ''} `}

        onClick={() => handleItemClick(item.path)}
      >
        <span  className='text-13px' >{item.name}{ activeMenuItem === item.path ? activeItemChild?.replace("",": ") : ''}</span>
      {item.children && item.children.length <=9 ? (
          // <ul className={`${isActive ? "active" : ""} sub-menu`}>
            <ul className='absolute hidden text-black group-hover:block z-40 sub-menu'>
            {item.children?.map((child) => renderMenuItemChild(child))}
            
          </ul>
        ):(
        <div>
           <ul className='absolute hidden text-black group-hover:block z-40 sub-menu dropdown-menu-price'>
            {item.children?.map((child,index) => renderMenuItemChildS(child,index))}
            
          </ul>
        </div>
        )}
      </div>
    );
  };
    return <div className='flex menu-table'>{items.map((item) => renderMenuItem(item))}</div>;
}

export default MenuBar