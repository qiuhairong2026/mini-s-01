export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({msg:"只允许POST"});
  const { message } = req.body;
  const AK = process.env.VOLC_AK;
  const EP_ID = process.env.VOLC_EP_ID;
  if(!AK||!EP_ID) return res.json({success:false,msg:"环境变量未配置"});

  const body = {
    model:EP_ID,
    messages:[{role:"user",content:message}],
    temperature:0.7
  };

  try{
    const resp = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${AK}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    });
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "无返回";
    res.json({success:true,reply});
  }catch(err){
    res.json({success:false,msg:"接口异常"});
  }
}
