export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({error:"Method not allowed"}),{status:405})
  }
  const {message}=await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if(!apiKey){
    return new Response(JSON.stringify({error:"API密钥未配置"}),{status:500})
  }
  try{
    const res=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${apiKey}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user",content:message}]
      })
    })
    const data=await res.json();
    return new Response(JSON.stringify(data),{
      headers:{"Content-Type":"application/json"}
    })
  }catch(e){
    return new Response(JSON.stringify({error:e.message}),{status:500})
  }
}
