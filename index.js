const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const port = 5580;

//생성할 데이터 포맷
class objMaker {
  constructor(nickname, age, date) {
    this.nickname = nickname
    this.age = age
    this.date = date
  }
}

http.createServer( (req,res)=> {
      //기본요청처리 인풋페이지 보여줌
      if(req.method === "GET") {
          fs.readFile('./index.html' ,'utf8' ,function(error, data) {
          res.writeHead(200, {'Content-Type' : 'text/html'});
          res.end(data);
        });
      }
      //post 로 입력받은 값 처리 
      if(req.method === "POST") {
          //쿼리스트링 받을 변수 선언
          let target = ""
          //데이터가 제출되면 실행될 함수 
          req.on("data",(chunk)=> {
            // console.log(chunk)
            // console.log(qs.parse(chunk.toString()))
            target = qs.parse(chunk.toString())

            //날짜처리에 필요한 변수 선언
            let today = new Date()
            //년
            let year = today.getFullYear()
            //월 : 월 은 0부터 시작하므로 1더하기
            let month = today.getMonth()+1
            //일
            let day = today.getDate()     
            //파일명으로 사용할 생성날짜 
            let YMD = year+"-"+month+"-"+day

            //객체데이터 생성
            let value = new objMaker(target.nickname, target.age, today.toString())
            // console.log(value)

            res.writeHead(200, {'Content-Type' : 'text/html'});
            fs.writeFile(`./${YMD}.json`,JSON.stringify(value,null,2),(err) =>{
              if(err) throw err;
            })
            fs.readFile('./main.html' ,'utf8' ,function(error, data) {
            res.end(data);
          })
        });
      }
      }).listen(port, function() {
        console.log('server is running >>>')
      })