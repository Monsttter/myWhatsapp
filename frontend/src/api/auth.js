const host= "https://mywhatsapp-ymha.onrender.com/api/auth";

export const register= async(formData)=>{
    const response= await fetch(host+"/register", {
        method: "POST",
        body: formData
    });
    return response;
}

export const login= async(credentials)=>{
    const response= await fetch(host+"/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return response;
}

export const fetchUser= async()=>{
    const response= await fetch(host+"/fetchuser",{
        headers:{
            "auth-token": localStorage.getItem("token")
        }
    });
    const data= await response.json();
    return data;
}

export const fetchConversations= async(credentials)=>{
    const response= await fetch(host+"/fetchconversations",{
        method: "POST",
        headers:{
          "auth-token": localStorage.getItem("token")
        }
      });
      const data= await response.json();
      return data;
}