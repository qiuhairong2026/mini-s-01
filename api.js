const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
// 跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if(req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post('/api/ai-proxy', async (req, res) => {
  const apiKey = process.env.VOLC_API_KEY;
  const endpointId = process.env.VOLC_ENDPOINT_ID;
  if(!apiKey || !endpointId){
    return res.status(500).send("缺少环境变量密钥");
  }
  try{
    const body = req.body;
    const result = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body:JSON.stringify({
        model:endpointId,
        messages:body.messages,
        stream: !!body.stream,
        temperature: body.temperature??0.7
      })
    });
    if(body.stream){
      res.setHeader('Content-Type','text/event-stream');
      result.body.pipe(res);
    }else{
      const data = await result.json();
      res.json(data);
    }
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

// 静态页面托管
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{
  console.log(`running on port ${PORT}`);
})
