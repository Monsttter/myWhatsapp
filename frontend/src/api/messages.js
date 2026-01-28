const host= "https://mywhatsapp-ymha.onrender.com/api/messages";

export const fetchMessages= async(conversationId)=>{
    const response= await fetch(`${host}/fetchmessages/${conversationId}`,{
    method: "GET",
    headers: {
        "auth-token": localStorage.getItem("token")
    }
    });
    const data= await response.json();
    // console.log(data);
    return data;
}

export const saveFile= async(formData)=>{
    const response= await fetch(`${host}/saveFile`,{
        method: "POST",
        headers: {
        "auth-token": localStorage.getItem("token")
        },
        body: formData
    });
    return response;
}

export const addPersonInGroup= async(conversationId, email)=>{
    await fetch(`${host}/addperson/${conversationId}`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify({email})
      })
}

export const createConversation= async(email)=>{
    const response= await fetch(host + "/createconversation", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify({email})
      })
      const data= await response.json();
      return data;
}

export const createGroup= async(groupName)=>{
    const response= await fetch(host + "/creategroup", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify({groupName})
      })
      const data= await response.json();
      return data;
}