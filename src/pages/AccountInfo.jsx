import { supabase } from '../client'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AccountInfo = () => {
    const userId = localStorage.getItem('userid');
    const [userInfo, setUserInfo] = useState({userid: '', displayname: '', pfp: '', bio: '' });
    // updates UserInfo on change
    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserInfo( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    // Fetch user info from the database if userID exists
    useEffect(() => {
        if (userId) {
            const fetchUserInfo = async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('displayname, pfp, bio')
                    .eq('userid', userId)
                    .single();
                if (data) {
                    setUserInfo({ ...data, userid: userId });
                } else {
                    console.error('Error fetching user info:', error);
                }
            };

            fetchUserInfo();
        }
    }, [userId]);

    const updateUser = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from('users')
            .update({ displayname: userInfo.displayname, pfp: userInfo.pfp, bio: userInfo.bio })
            .eq('userid', userId);
        if (error) {
            console.error('Error updating user info:', error);
        } else {
            window.location = "/";   
        }
    }
    const deleteUser = async (event) => {
        event.preventDefault();

        const confirmDelete = window.confirm("Are you sure you want to delete your account? Your posts and comments can still be seen, but your details will be removed.");
        if (confirmDelete) {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('userid', userId);
            if (error) {
                console.error('Error updating user info:', error);
            } else {
                localStorage.removeItem('userid');
                window.location = "/";   
            }
        }
    }
    const createUser = async (event) => {
        event.preventDefault();

        const newUserId = uuidv4();
        const { error } = await supabase
            .from('users')
            .insert({ userid: newUserId, displayname: userInfo.displayname, pfp: userInfo.pfp, bio: userInfo.bio });
        
        if (error) {
            console.error('Error creating user:', error);
        } else {
            localStorage.setItem('userid', newUserId);
            window.location = "/";
        }

    }
    
    const loginUser = async (event) => {
        event.preventDefault();

        const { data, error } = await supabase
            .from('users')
            .select('userid')
            .eq('userid', userInfo.userid)
            .single();
        
        if (error || !data) {
            console.error('User not found:', error);
            return;
        } else{
            localStorage.setItem('userid', userInfo.userid);
            window.location = "/";
        }
    }

    const logoutUser = () => {
        localStorage.removeItem('userid');
        window.location = "/";
    };

    if (userId) {
        // Show form for updating user info
        return (
            <div>
                <h2>Update Account Info</h2>
                <form>
                    <label>
                        User ID:
                        <input type="text" name="userid" value={userId} disabled />  
                        <p><small>Remember this value, as you will need it for future logins!</small></p>                      
                    </label>
                    <label>
                        Display Name:
                        <input type="text" name="displayname" value={userInfo.displayname} onChange={handleChange} />
                    </label>
                    <label>
                        Profile Picture URL:
                        <input type="text" name="pfp" value={userInfo.pfp} onChange={handleChange} />
                    </label>
                    <label>
                        Bio:
                        <textarea name="bio" value={userInfo.bio} onChange={handleChange}></textarea>
                    </label>
                    <button type="submit" onClick={updateUser}> Update</button>
                </form>
                <h3>Other options:</h3>
                <button onClick={logoutUser}>Logout</button>
                <button onClick={deleteUser} id="delete" >Delete Account</button>
            </div>
        );
    } else {
        // Show form for either logging in with existing uuid, or create new account
        // todo
        return (
            <div>
                <h2>Login or Create Account</h2>
                <form>
                    <label>
                        Existing UUID:
                        <input type="text" name="userid" onChange={handleChange} />
                    </label>
                    <button type="submit" onClick={loginUser}>Login</button>
                </form>
                <h3>Or</h3>
                <form>
                    <label>
                        Display Name:
                        <input type="text" name="displayname" onChange={handleChange}/>
                        <p><small>The name people will see you as.</small></p>   
                    </label>
                    <label>
                        Profile Picture URL:
                        <input type="text" name="pfp" onChange={handleChange} />
                        <p><small>An image that perfectly describes you.</small></p>
                    </label>
                    <label>
                        Bio:
                        <textarea name="bio" onChange={handleChange} ></textarea>
                        <p><small>Tell us about yourself!</small></p>   
                    </label>
                    <button type="submit" onClick={createUser}>Create Account</button>
                </form>
            </div>
        );
    }

}


// Users table:
// id (int) auto generated
// created_at (timestamp) auto generated
// userid (uuid) auto generated
// displayname (text)
// pfp (text) image url
// bio (text)
export default AccountInfo