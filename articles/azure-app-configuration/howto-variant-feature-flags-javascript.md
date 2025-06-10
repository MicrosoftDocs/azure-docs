---
title: 'Use variant feature flags in a Node.js application'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to use variant feature flags in a Node.js application
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my Node.js application.
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/06/2025
---

# Tutorial: Use variant feature flags in a Node.js application

In this tutorial, you use a variant feature flag to manage experiences for different user segments in an example application, *Quote of the Day*. You utilize the variant feature flag created in [Use variant feature flags](./howto-variant-feature-flags.md). Before proceeding, ensure you create the variant feature flag named *Greeting* in your App Configuration store.

## Prerequisites

* [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule).
* Follow the [Use variant feature flags](./howto-variant-feature-flags.md) tutorial and create the variant feature flag named *Greeting*.

## Create a Node.js application

1. Create a folder called `quote-of-the-day` and initialize the project.

    ```bash
    mkdir quote-of-the-day
    cd quote-of-the-day
    npm init -y
    ```

1. Install the following packages.

    ```bash
    npm install @azure/app-configuration-provider
    npm install @microsoft/feature-management
    npm install express
    ```

1. Create a new file named *server.js* and add the following code.

    ```js
    const express = require("express");
    const server = express();

    const { DefaultAzureCredential } = require("@azure/identity");
    const { load } = require("@azure/app-configuration-provider");
    const { FeatureManager, ConfigurationMapFeatureFlagProvider } = require("@microsoft/feature-management");
    let appConfig;
    let featureManager;
    async function initializeConfig() {
        appConfig = await load(appConfigEndpoint, new DefaultAzureCredential(), {
            featureFlagOptions: {
                enabled: true,
                refresh: {
                    enabled: true,
                    refreshIntervalInMs: 10_000
                }
            }
        });

        const featureFlagProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
        featureManager = new FeatureManager(featureFlagProvider);
    }

    // Initialize the configuration and start the server
    initializeConfig()
        .then(() => {
            startServer();
        })
        .catch((error) => {
            console.error("Failed to load configuration:", error);
            process.exit(1);
        });

    function startServer() {
        // Use a middleware to refresh the configuration before each request
        server.use((req, res, next) => {
            appConfig.refresh();
            next();
        });
        server.use(express.json());
        // Serve static index.html from the "client/dist" directory
        server.use(express.static("client/dist"));

        server.get("/api/getGreetingMessage", async (req, res) => {
            const { userId, groups } = req.query;
            const variant = await featureManager.getVariant("Greeting", { userId: userId, groups: groups ? groups.split(",") : [] });
            res.status(200).send({
                message: variant?.configuration
            });
        });

        server.post("/api/like", (req, res) => {
            const { UserId } = req.body;
            if (UserId === undefined) {
                return res.status(400).send({ error: "UserId is required" });
            }
            // Here you would typically log the like event to a database or analytics service to conduct an experimentation.
            res.status(200).send({ message: "Like event logged successfully" });
        });

        const port = "8080";
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }

    ```

    This file contains the backend logic for your application, including configuration loading, feature flag management, and API endpoints.

## Implement the front end application

1. Create a React application using `vite`. During the creation, select `React` and `JavaScript`.


    ```bash
    npm create vite@latest client
    ```

    This creates a modern React app in the `client` directory.

1. Switch to the *client* folder and install the required dependencies

    ```bash
    cd client
    npm install
    npm install react-router-dom
    npm install react-icons
    ```

1. Update the *index.css* file.

    ```css
    body {
    margin: 0;
    font-family: 'Georgia', serif;
    }

    .quote-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f4f4;
    }

    .navbar {
    background-color: white;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    align-items: center;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    }

    .navbar-left {
    display: flex;
    align-items: center;
    margin-left: 40px;
    }

    .logo {
    font-size: 1.25em;
    text-decoration: none;
    color: black;
    margin-right: 20px;
    }

    .navbar-left nav a {
    margin-right: 20px;
    text-decoration: none;
    color: black;
    font-weight: 500;
    font-family: 'Arial', sans-serif;
    }

    .navbar-right a {
    margin-left: 20px;
    text-decoration: none;
    color: black;
    font-weight: 500;
    font-family: 'Arial', sans-serif;
    }

    .quote-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    }

    .quote-card {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    position: relative;
    text-align: left;
    }

    .quote-card h2 {
    font-weight: normal;
    }

    .quote-card blockquote {
    font-size: 2em;
    font-family: 'Georgia', serif;
    font-style: italic;
    color: #4EC2F7;
    margin: 0 0 20px 0;
    line-height: 1.4;
    text-align: left;
    }

    .quote-card footer {
    font-size: 0.55em;
    color: black;
    font-family: 'Arial', sans-serif;
    font-style: normal;
    text-align: left;
    font-weight: bold;
    }

    .vote-container {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 0em;
    }

    .heart-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    font-size: 24px;
    }

    .heart-button:hover {
    background-color: #F0F0F0;
    }

    .heart-button:focus {
    outline: none;
    box-shadow: none;
    }

    h2 {
    margin-bottom: 20px;
    color: #333;
    }

    footer {
    background-color: white;
    padding-top: 10px;
    text-align: center;
    border-top: 1px solid #eaeaea;
    }

    footer a {
    color: #4EC2F7;
    text-decoration: none;
    }
    ```

1. Create a new file named *Home.jsx*.

    ```jsx
    import { useState, useEffect } from "react";
    import { useLocation } from "react-router-dom";
    import { FaHeart, FaRegHeart } from "react-icons/fa";

    function Home() {
        const location = useLocation();
        const params = new URLSearchParams(location.search);
        const currentUser = params.get("userId");
        const [liked, setLiked] = useState(false);
        const [message, setMessage] = useState(undefined);

        useEffect(() => {
            const init = async () => {
                const response = await fetch(`/api/getGreetingMessage?userId=${currentUser ?? ""}`, { 
                    method: "GET"
                });
                if (response.ok) {
                    const result = await response.json();
                    setMessage(result.message ?? "Quote of the Day"); // default message is "Quote of the Day"
                } 
                else {
                    console.error("Failed to get greeting message.");
                }
                setLiked(false);
            };
            init();
        }, []);

        const handleClick = async () => {
            if (!liked) {
                const response = await fetch("/api/like", { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ UserId: currentUser ?? "" }),
                });

                if (response.ok) {
                console.log("Like the quote successfully.");
                } else {
                console.error("Failed to like the quote.");
                }
            }
            setLiked(!liked);
        };

        return (
            <div className="quote-page">
                <header className="navbar">
                    <div className="navbar-left">
                        <div className="logo">QuoteOfTheDay</div>
                    </div>
                </header>

                <main className="quote-container">
                    <div className="quote-card">
                    { message != undefined ?
                        ( 
                        <>
                        <h2>
                            <>{message}</>
                        </h2>
                        <blockquote>
                            <p>"You cannot change what you are, only what you do."</p>
                            <footer>— Philip Pullman</footer>
                        </blockquote>
                        <div className="vote-container">
                            <button className="heart-button" onClick={handleClick}>
                            {liked ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        </div>
                        </> 
                        ) 
                        : <p>Loading</p>       
                    }
                    </div>
                </main>
            </div>
        );
    }

    export default Home;
    ```

1. Update the *App.jsx* file.

    ```jsx
    import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
    import Home from "./Home";

    function App() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        );
    }

    export default App;
    ```

1. In the *client* folder, run the following command to compile your React app and outputs static files to `client/dist`.

    ```bash
    npm run build
    ```

1. Go back to the root folder and launch the backend.


    ```bash
    node server.js
    ```

1. Open your browser and visit `localhost:8080/` to see the app running. You should see the default greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/default-variant.png" alt-text="Screenshot of the Quote of the day app, showing no greeting message for the user.":::

1. You can use `userId` query parameter in the url to specify the user id. Visit `localhost:8080/?userId=UserA` and you see a long greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/long-variant.png" alt-text="Screenshot of the Quote of the day app, showing long greeting message for the user.":::

1. Try different user IDs to see how the variant feature flag changes the greeting message for different segments of users. Visit `localhost:8080/?userId=UserB` and you see a shorter greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/simple-variant.png" alt-text="Screenshot of the Quote of the day app, showing simple greeting message for the user.":::

## Next steps

For the full feature rundown of the JavaScript feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [JavaScript Feature Management](./feature-management-javascript-reference.md)
