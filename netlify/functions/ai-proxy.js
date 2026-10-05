exports.handler = async (event) => {
  const apiKey = process.env.VOLC_API_KEY;
  const endpointId = process.env.VOLC_ENDPOINT_ID;
  if(!apiKey || !endpointId){
    return {statusCode:500,body:JSON.stringify({error:"环境变量未配置"})};
  }
  try{
    const res = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body:event.body
    });
    const data = await res.json();
    return {
      statusCode:200,
      headers:{"Access-Control-Allow-Origin":"*"},
      body:JSON.stringify(data)
    }
  }catch(err){
    return {statusCode:500,body:JSON.stringify({error:err.message})};
  }
};
