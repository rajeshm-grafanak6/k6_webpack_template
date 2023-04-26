import http from "k6/http";
import { sleep, check, group } from "k6";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';


export function register() {
    let response;
    var register_payload = { 
        "username": "usernametest1@test.com",
        "first_name": "username",
        "last_name": "test1",
        "email": "usernametest1@test.com",
        "password": "password123"
    };
    group('register_new_user', () => {
        response = http.post(
                                `${globalThis.BACKEND_URL}/user/register/`, register_payload, { tags: {name: 'register_new_user'} }
                            );
    });

    check(response, {'status was 200': (res) => res.status === 200});

    sleep(randomIntBetween(globalThis.PAUSE_MIN, globalThis.PAUSE_MAX));
}


export function login() {
    let response;
    var login_payload = { 
        "username": "usernametest1@test.com",
        "password": "password123"
    };
    group('new_user_login', () => {
        response = http.post(
                                `${globalThis.BACKEND_URL}/auth/basic/login/`, login_payload, { tags: {name: 'new_user_login'} }
                            );
    });

    check(response, { 'status was 200': (res) => res.status === 200 });

    sleep(randomIntBetween(globalThis.PAUSE_MIN, globalThis.PAUSE_MAX));
}


export function logout() {
    let response;
    var login_payload = { 
        "username": "usernametest1@test.com",
        "password": "password123"
    };
    group('new_user_logout', () => {
        response = http.post(
                                `${globalThis.BACKEND_URL}/auth/cookie/logout/`, login_payload, { tags: {name: 'new_user_logout'} }
                            );
    });

    check(response, { 'status was 200': (res) => res.status === 200 });

    sleep(randomIntBetween(globalThis.PAUSE_MIN, globalThis.PAUSE_MAX));
}