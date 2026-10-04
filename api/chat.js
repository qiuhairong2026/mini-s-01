export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({error:"Method not allowed"});
  }
  const apiKey = process.env.VOLC_API_KEY;
  if(!apiKey){
    return res.status(500).json({error:"环境密钥未配置"});
  }
  const {message}=req.body;
  try{
    const resp=await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body:JSON.stringify({
        model:"Doubao‑Seedance‑2.5",
        messages:[{"role":"user","content":message}],
        temperature:0.7
      })
    });
    const data=await resp.json();
    res.status(200).json(data);
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
