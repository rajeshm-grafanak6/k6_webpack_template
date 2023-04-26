import { register, login, logout } from "../scripts/register.js"

export function Scenario2() {
    register();
    login();
    logout();
}