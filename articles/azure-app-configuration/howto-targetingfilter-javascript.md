---
title: Roll out features to targeted audiences in a Node.js app
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences in a Node.js application.
ms.service: azure-app-configuration
ms.devlang: javascript
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 06/17/2025
---

# Roll out features to targeted audiences in a Node.js application

In this guide, you'll use the targeting filter to roll out a feature to targeted audiences for your Node.js application. For more information about the targeting filter, see [Roll out features to targeted audiences](./howto-targetingfilter.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A feature flag with targeting filter. [Create the feature flag](./howto-targetingfilter.md).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule).

## Create a web application with a feature flag

In this section, you create a web application that uses the *Beta* feature flag to control the access to the beta version of the page.

### Initial project setup

1. Create a folder called `targeting-filter-tutorial` and initialize the project.

    ```bash
    mkdir targeting-filter-tutorial
    cd targeting-filter-tutorial
    npm init -y
    ```

1. Install the following packages.

    ```bash
    npm install @azure/app-configuration-provider
    npm install @microsoft/feature-management
    npm install express
    ```

### Add App Configuration provider

You will load the feature flag you created in the prerequisites from Azure App Configuration and create a `FeatureManager` to manage the feature flag.

1. Create a new file named *app.js* and add the following code.

    ```js
    const express = require("express");
    const server = express();
    const port = "8080";

    const appConfigEndpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
    const { DefaultAzureCredential } = require("@azure/identity");
    const { load } = require("@azure/app-configuration-provider");

    let appConfig;
    let featureManager;

    async function initializeConfig() {
        appConfig = await load(appConfigEndpoint, new DefaultAzureCredential(), {
            featureFlagOptions: {
                enabled: true,
                refresh: {
                    enabled: true
                }
            }
        });

        featureManager = new FeatureManager(new ConfigurationMapFeatureFlagProvider(appConfig));
    }
    ```

### Use the feature flag

1. Add the following code to the *app.js* file. You add a middleware to refresh configuration and configure the route handler. The server will serve different contents based on whether the **Beta** feature flag is enabled.

    ```js
    // Use a middleware to refresh the configuration before each request.
    server.use((req, res, next) => {
        appConfig.refresh();
        next();
    });

    server.get("/", async (req, res) => {
        const isBetaEnabled = await featureManager.isEnabled("Beta");
        const [title, message] = isBetaEnabled 
            ? ["Beta Page", "This is a beta page."]
            : ["Home Page", "Welcome."];
        
        res.send(
            `<!DOCTYPE html>
            <html>
                <head><title>${title}</title></head>
                <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
                    <h1 style="text-align: center; font-size: 5rem;">${message}</h1>
                </body>
            </html>`
        );
    });
    ```

1. Complete the application. It will initialize the configuration and then start the express server.

    ```js
    initializeConfig()
        .then(() => {
            // Start the express server.
            server.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}`);
            });
        })
        .catch((error) => {
            console.error("Failed to load configuration:", error);
            process.exit(1);
        });
    ```

## Enable targeting for the web application

A targeting context is required for feature evaluation with targeting. To explicitly specify the targeting context for each feature evaluation, you can pass targeting context as a parameter to the `featureManager.isEnabled` call.

```js
const isBetaEnabled = await featureManager.isEnabled("Beta", { userId: "UserA", groups: ["Group1"] });
```

In the web application, the targeting context can also be provided as an ambient context by implementing the [ITargetingContextAccessor](./feature-management-javascript-reference.md#itargetingcontextaccessor) interface. Ambient targeting context means the targeting information is automatically retrieved from the environment (like the current HTTP request) without explicitly passing it to each `featureManager.isEnabled()` call.

We will use ambient targeting context as an example in this tutorial.

1. Add the following code after the express server declaration

    ```js
    const express = require("express");
    const server = express();
    const port = 8080

    const { AsyncLocalStorage } = require("async_hooks");
    const requestAccessor = new AsyncLocalStorage();
    // Use a middleware to store request context.
    server.use((req, res, next) => {
        // Store the request in AsyncLocalStorage for this request chain.
        requestAccessor.run(req, () => {
            next();
        });
    });

    // Create a targeting context accessor that retrieves user data from the current request.
    const targetingContextAccessor = {
        getTargetingContext: () => {
            // Get the current request from AsyncLocalStorage.
            const request = requestAccessor.getStore();
            if (!request) {
                return undefined;
            }
            const { userId, groups } = request.query;
            return {
                userId: userId,
                groups: groups ? groups.split(",") : [] 
            };
        }
    };
    // Existing code ...
    ```

    For demonstration purposes, in this tutorial, you extract user information from the query string of the request URL. In a real-world application, user information is typically obtained through authentication mechanisms.

    For more information, go to [Using AsyncLocalStorage for request context](./feature-management-javascript-reference.md#using-asynclocalstorage-for-request-context).

1. When constructing the `FeatureManager`, pass the targeting context accessor to the `FeatureManagerOptions`.

    ```js
    featureManager = new FeatureManager(featureFlagProvider, {
        targetingContextAccessor: targetingContextAccessor
    });
    ```

Your complete application code should look like the following:

```js
const express = require("express");
const server = express();
const port = 8080;

const { AsyncLocalStorage } = require("async_hooks");
const requestAccessor = new AsyncLocalStorage();
// Use a middleware to store request context
server.use((req, res, next) => {
    // Store the request in AsyncLocalStorage for this request chain
    requestAccessor.run(req, () => {
        next();
    });
});

// Create a targeting context accessor that retrieves user data from the current request
const targetingContextAccessor = {
    getTargetingContext: () => {
        // Get the current request from AsyncLocalStorage
        const request = requestAccessor.getStore();
        if (!request) {
            return undefined;
        }
        const { userId, groups } = request.query;
        return {
            userId: userId,
            groups: groups ? groups.split(",") : [] 
        };
    }
};

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
                enabled: true
            }
        }
    });

    featureManager = new FeatureManager(new ConfigurationMapFeatureFlagProvider(appConfig), {
        targetingContextAccessor: targetingContextAccessor
    });
}

// Use a middleware to refresh the configuration before each request
server.use((req, res, next) => {
    appConfig.refresh();
    next();
});

server.get("/", async (req, res) => {
    const isBetaEnabled = await featureManager.isEnabled("Beta");
    const [title, message] = isBetaEnabled 
        ? ["Beta Page", "This is a beta page."]
        : ["Home Page", "Welcome."];
    
    res.send(
        `<!DOCTYPE html>
        <html>
            <head><title>${title}</title></head>
            <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
                <h1 style="text-align: center; font-size: 5rem;">${message}</h1>
            </body>
        </html>`
    );
});

// Initialize the configuration and start the server
initializeConfig()
    .then(() => {
        // Start the express server.
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to load configuration:", error);
        process.exit(1);
    });
```


## Targeting filter in action

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
    node app.js
    ```

1. Open your browser and navigate to `localhost:8080`. You should see the default view of the app.

    :::image type="content" source="media/howto-targetingfilter-javascript/beta-disabled.png" alt-text="Screenshot of the app, showing the default greeting message.":::

1. Use `userId` query parameter in the url to specify the user ID. Visit `localhost:8080/?userId=test@contoso.com`. You see the beta page, because `test@contoso.com` is specified as a targeted user.

    :::image type="content" source="media/howto-targetingfilter-javascript/beta-enabled.png" alt-text="Screenshot of the app, showing the beta page.":::

1. Visit `localhost:8080/?userId=testuser@contoso.com`. You cannot see the beta page, because `testuser@contoso.com` is specified as an excluded user..

    :::image type="content" source="media/howto-targetingfilter-javascript/beta-not-targeted.png" alt-text="Screenshot of the app, showing the default content.":::

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter-aspnet-core.md)

For the full feature rundown of the JavaScript feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-javascript-reference.md)