export const sortCheck=(sortX="desc-date")=>{
    const [direction, type]=sortX.split("-")
    const dir = direction==="desc"?-1:1;
    let sort
    switch (type) {
      case "date":
        sort={updatedAt:-dir};
        break; 
      case "likes":
        sort={numberOfLikes:dir};
        break; 
    }
    return sort
  }