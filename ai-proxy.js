export default async (req, context) => {
  if(req.method !== "POST"){
    return new Response(JSON.stringify({error:"Method not allowed"}),{status:405})
  }
  const body = await req.json();
  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if(!apiKey){
    return new Response(JSON.stringify({error:"Missing API Key"}),{status:500})
  }
  try{
    const res = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user",content:body.prompt}],
        temperature:0.7
      })
    })
    const data = await res.json();
    return new Response(JSON.stringify(data),{
      headers:{"Content-Type":"application/json"}
    })
  }catch(e){
    return new Response(JSON.stringify({error:e.message}),{status:500})
  }
}
