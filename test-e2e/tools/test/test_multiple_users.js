import fetch from 'node-fetch';
import request from 'supertest';
import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // 自己署名証明書の検証を回避

const agent = new https.Agent({  
    keepAlive: true,
    rejectUnauthorized: false // 自己署名証明書を受け入れる
});

// テスト番号
let testCounter = 1;

// テストユーザー数
const NUMBER_OF_USERS = 5;

function deleteUser(username) {
    return new Promise((resolve, reject) => {
        request('https://frontend')
            .delete(`/api/test/delete/${username}/`)
            .send({ username })
            .agent(agent)
            .expect(200) 
            .end((err, res) => {
                if (err && res.status !== 404) {
                    reject(err);
                } else if (err) {
                    console.log(`User ${username} does not exist`);
                    resolve(res);
                }
                console.log('User deletion successful:', res.body);
                resolve(res);
            });
    });
}

function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        request('https://frontend')
            .post('/api/players/register/')
            .send({ username, password })
            .agent(agent)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error('User registration failed with error:', err);
                    reject(err);
                } else {
                    console.log('User registration successful:', res.body);
                    resolve(res);
                }
            });
    });
}

async function loginUser(username, password) {
    const loginData = {
        username: username,
        password: password
    };
    const response = await fetch('https://frontend/api/players/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        throw new Error('Login failed with status: ' + response.status);
    }

    const data = await response.json();
    console.log('User logged in successfully:', username);
    return data;
}

async function logoutUser(accessToken) {
    const response = await fetch('https://frontend/api/players/logout/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
    }

    console.log('User logout successful');
}

let loggedInUsers = [];

describe('User Registration and Deletion Test', function() {
    this.timeout(100000);

    it(`Test #${testCounter} should register and delete the user`, async function() {
        await deleteUser('testuser');
        await registerUser('testuser', 'Testp@ssword1!');
        await deleteUser('testuser');
    });

    testCounter++;
    it(`Test #${testCounter} should login and logout the user`, async function() {
        const username = 'testuser';
        const password = 'Testp@ssword1!';
        
        await deleteUser(username);
        await registerUser(username, password);
        const loginData = await loginUser(username, password);
        await logoutUser(loginData.access_token);
        await deleteUser(username);
    });

    testCounter++;
    it(`Test #${testCounter} should register ${NUMBER_OF_USERS} users`, async function() {
        for (let i = 1; i <= NUMBER_OF_USERS; i++) {
            await registerUser(`testuser${i}`, 'Testp@ssword1!');
        }
    });

    testCounter++;
    it(`Test #${testCounter} should login ${NUMBER_OF_USERS} users`, async function() {
        for (let i = 1; i <= NUMBER_OF_USERS; i++) {
            try {
                const response = await loginUser(`testuser${i}`, 'Testp@ssword1!');
                if (response && response.access_token) {
                    loggedInUsers.push({ username: `testuser${i}`, accessToken: response.access_token });
                } else {
                    console.error(`Failed to login user testuser${i}, no access token received.`);
                }
            } catch (error) {
                console.error(`Failed to login user testuser${i}:`, error);
            }
        }
        console.log('All users logged in. Type "logout" to log out all users.');
    });

    testCounter++;
    it(`Test #${testCounter} should logout ${NUMBER_OF_USERS} users`, async function() {
        for (let user of loggedInUsers) {
            await logoutUser(user.accessToken);
        }
        console.log('All users logged out');
    });
    
    testCounter++;
    it(`Test #${testCounter} should delete ${NUMBER_OF_USERS} users`, async function() {
        for (let i = 1; i <= NUMBER_OF_USERS; i++) {
            await deleteUser(`testuser${i}`);
        }
        console.log('All users deleted');
    });
});