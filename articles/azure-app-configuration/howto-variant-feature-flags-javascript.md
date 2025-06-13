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

    const appConfigEndpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
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

    function startServer() {
        // Use a middleware to refresh the configuration before each request
        server.use((req, res, next) => {
            appConfig.refresh();
            next();
        });
        server.use(express.json());
        // Serve static index.html from the current folder
        server.use(express.static("."));

        // This API returns the different greeting messages based on the segment the user belongs to.
        // It evaluates a variant feature flag based on user context. The greeting message is retrieved from the variant configuration.
        server.get("/api/getGreetingMessage", async (req, res) => {
            const { userId, groups } = req.query;
            const variant = await featureManager.getVariant("Greeting", { userId: userId, groups: groups ? groups.split(",") : [] });
            res.status(200).send({ message: variant?.configuration });
        });

        server.post("/api/like", (req, res) => {
            const { UserId } = req.body;
            if (UserId === undefined) {
                return res.status(400).send({ error: "UserId is required" });
            }
            // Here you would typically emit a 'like' event to compare variants.
            res.status(200).send();
        });

        const port = "8080";
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
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
    ```

1. Create a new file named *index.html* and add the following code:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Quote of the Day</title>
    <style>
        .heart-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-size: 24px;
        }

        .heart-button:hover {
        background-color: #F0F0F0;
        }
    </style>
    </head>
    <body>
    <div style="display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f4f4;">
        <header style="background-color: white; border-bottom: 1px solid #eaeaea; display: flex; justify-content: space-between; align-items: center; font-family: 'Arial', sans-serif; font-size: 16px;">
        <div style="font-size: 1.25em; color: black;">QuoteOfTheDay</div>
        </header>

        <main style="display: flex; justify-content: center; align-items: center; flex-grow: 1;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 700px; position: relative; text-align: left;">
            <div id="quote-content">
            <h2 id="greeting">Quote of the Day</h2>
            <blockquote style="font-size: 2em; font-style: italic; color: #4EC2F7; margin: 0 0 20px 0; line-height: 1.4;">
                <p>"You cannot change what you are, only what you do."</p>
                <footer style="font-size: 0.55em; color: black; font-family: 'Arial', sans-serif; font-style: normal; font-weight: bold;">— Philip Pullman</footer>
            </blockquote>
            <div style="position: absolute; top: 10px; right: 10px; display: flex;">
                <button class="heart-button" id="like-button">
                <span id="heart-icon" style="color: #ccc">♥</span>
                </button>
            </div>
            </div>
            <div id="loading" style="display: none;">
            <p>Loading</p>
            </div>
        </div>
        </main>
    </div>

    <script>
        // extract URL parameters to simulate user login
        document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentUser = urlParams.get('userId') || '';
        let liked = false;
        
        const greetingElement = document.getElementById('greeting');
        const heartIcon = document.getElementById('heart-icon');
        const likeButton = document.getElementById('like-button');
        const quoteContent = document.getElementById('quote-content');
        const loadingElement = document.getElementById('loading');

        async function init() {
            quoteContent.style.display = 'none';
            loadingElement.style.display = 'block';
            
            const response = await fetch(`/api/getGreetingMessage?userId=${currentUser}`, { 
            method: "GET"
            });
            const result = await response.json();
            greetingElement.textContent = result.message || "";
            quoteContent.style.display = 'block';
            loadingElement.style.display = 'none';
        }

        likeButton.addEventListener('click', async function() {
            if (!liked) {
            const response = await fetch("/api/like", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ UserId: currentUser }),
            });
            }
            liked = !liked;
            heartIcon.style.color = liked ? 'red' : '#ccc';
        });

        init();
        });
    </script>
    </body>
    </html>
    ```

    For simplicity, the example extracts the `userId` from URL query parameters (e.g., `?userId=UserA`) to simulate different user identities.

## Run the application

1. Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

1. Run the application.

    ```bash
    node server.js
    ```

1. Open your browser and navigate to `localhost:8080`. You should see the default view of the app that doesn't have any greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/default-variant.png" alt-text="Screenshot of the Quote of the day app, showing no greeting message for the user.":::

1. You can use `userId` query parameter in the url to specify the user id. Visit `localhost:8080/?userId=UserA` and you see a long greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/long-variant.png" alt-text="Screenshot of the Quote of the day app, showing long greeting message for the user.":::

1. Try different user IDs to see how the variant feature flag changes the greeting message for different segments of users. Visit `localhost:8080/?userId=UserB` and you see a shorter greeting message.

    :::image type="content" source="media/howto-variant-feature-flags-javascript/simple-variant.png" alt-text="Screenshot of the Quote of the day app, showing simple greeting message for the user.":::

## Next steps

For the full feature rundown of the JavaScript feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [JavaScript Feature Management](./feature-management-javascript-reference.md)
