import React from "react"
import { ReactDOM } from "react-dom/client"

const root = ReactDOM.createRoot(document.getElementById("app"))

const d = () => {

    const text = "Hello"

    return <div>
        <h1>{text}</h1>
    </div>

}

root.render(

    <React.StrictMode>
        {d()}
    </React.StrictMode>
)


