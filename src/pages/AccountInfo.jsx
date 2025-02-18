import { supabase } from '../client'
import { useEffect, useState } from 'react';

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
    
    }
    const deleteUser = async (event) => {
    
    }
    const createUser = async (event) => {

    }
    
    const loginUser = async (event) => {

    }

    const logoutUser = () => {
        localStorage.removeItem('userid');
        window.location.reload();
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