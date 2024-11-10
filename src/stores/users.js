import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/supabase";
export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMsg = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  // Function to validate email
  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  // Function to handle Login
  const handleLogin = async (credintials) => {
    const { email, password } = credintials;
    if (!password.length) {
      return (errorMsg.value = "Password must not be empty");
    }
    if (!validateEmail(email)) {
      return (errorMsg.value = "Pleaze Enter A valid Email");
    }
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      loading.value = false;
      errorMsg.value = error.message;
      return;
    }
    loading.value = false;
    await getUserData(email);
    console.log(await user.value);
  };

  // Function to handle SignUp
  const handleSignUp = async (credintials) => {
    const { email, password, username } = credintials;
    if (password.length < 6) {
      return (errorMsg.value = "Password must be at least 6 characters length");
    }
    if (username.length < 4) {
      return (errorMsg.value = "userName must be at least 4 characters length");
    }
    if (!validateEmail(email)) {
      return (errorMsg.value = "Pleaze Enter A valid Email");
    }
    loading.value = true;
    //Validate if User Already Exist
    // validate username existing
    //select according to condition where username = usermane and return one record not an array
    const userNameResponse = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();
    if (userNameResponse.data) {
      loading.value = false;
      return (errorMsg.value = "Username already exists");
    }
    errorMsg.value = "";

    //save email & password to Auth it only take this parameters
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    if (response.error) {
      loading.value = false;
      errorMsg.value = response.error.message;
      return;
    }
    //to save another parameters like name , age or extra data create new Table
    //to add or retrive data from a table in supabase use from method
    const { data, error } = await supabase
      .from("users")
      .insert({ username, email });

    if (error) {
      loading.value = false;
    } else {
      await getUserData(email);
      // console.log("User inserted:", user.value);
    }
    loading.value = false;
  };
  const getUserData = async (email) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();
    // console.log(data);
    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
      };
    }
  };
  const handleLogOut = async() => {
    // refresh token and clear everything
    await supabase.auth.signOut();
    user.value = null;
  };
  const getUser = async () => {
    loadingUser.value = true;
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      loadingUser.value = false;
      console.error("Error fetching user data:", error.message);
      return (user.value = null);
    } else {
      await getUserData(data.user.email);
      loadingUser.value = false;
      await console.log(user.value);
    }
  };

  return {
    user,
    handleLogin,
    handleSignUp,
    handleLogOut,
    getUser,
    errorMsg,
    loading,
    loadingUser,
  };
});
