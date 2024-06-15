import { useState } from "react"
import { Button, Input } from "rsuite"

export const Home = () => {

    const [auth, setAuth] = useState({ login: "", password: "" })

    const Submit = (e) => {
        e.preventDefault()
        if (JSON.stringify(auth) === JSON.stringify({ login: "admin", password: "12345" })) {
            alert("Ff")
            location.href = "/Tables"
        } else {
            alert("gee")
        }

    }

    return <div>

        <form onSubmit={Submit}>
            <Input required value={auth.login} onChange={(v, e) => setAuth({ ...auth, login: v })} />
            <Input required value={auth.password} onChange={(v, e) => setAuth({ ...auth, password: v })} />
            <Button type="submit">f</Button>
        </form>

    </div>
}