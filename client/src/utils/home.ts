export function createPath(cPath: string): string{
    let ans = "";
    for(let char of cPath){
      if(char == "/"){
        ans += " ➤ ";
      }else{
        ans += char;
      }
    }
    return ans;
  }