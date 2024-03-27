---
title: Use dynamic configuration in JavaScript
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for JavaScript
services: azure-app-configuration
author: eskibear
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: tutorial
ms.date: 03/27/2024
ms.custom: devx-track-js
ms.author: yanzh
#Customer intent: As a JavaScript developer, I want to dynamically update my app to use the latest configuration data in Azure App Configuration.
---
# Tutorial: Use dynamic configuration in JavaScript

The Azure App Configuration JavaScript provider includes built-in caching and refreshing capabilities. This tutorial shows how to enable dynamic configuration in JavaScript applications.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)

## Add key-values

Add the following key-value to your Azure App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value             | Label       | Content type       |
|----------------|-------------------|-------------|--------------------|
| *message*      | *Hello World!*    | Leave empty | Leave empty        |
| *sentinel*     | *1*               | Leave empty | Leave empty        |

> [!NOTE]
> A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your Azure App Configuration store, compared to monitoring all keys for changes.

## Console applications


In this tutorial, you'll create a Node.js console app and load data from your App Configuration store.

1. Create a new directory for the project named *dynamic-configuration*.

    ```console
    mkdir dynamic-configuration
    ```

1. Switch to the newly created *dynamic-configuration* directory.

    ```console
    cd dynamic-configuration
    ```

1. Install the Azure App Configuration provider by using the `npm install` command.

    ```console
    npm install @azure/app-configuration-provider
    ```

1. Create a new file called *app.js* in the *dynamic-configuration* directory and add the following code:

    ```javascript
    const sleepInMs = require("util").promisify(setTimeout);
    const { load } = require("@azure/app-configuration-provider");
    const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

    async function run() {
        // Connecting to Azure App Configuration using connection string
        const settings = await load(connectionString, {
            // Setting up to refresh when the sentinel key is changed
            refreshOptions: {
                enabled: true,
                watchedSettings: [{ key: "sentinel" }], // Watche for changes to the key "sentinel" and refreshes the configuration when it changes
                refreshIntervalInMs: 10 * 1000 // Default value is 30 seconds, shorted for this sample
            }
        });

        console.log("Using Azure portal or CLI, first update the `message` value, and then update the `sentinel` value in your App Configuration store.")

        while (true) {
            // Refreshing the configuration setting
            await settings.refresh();

            // Current value of message
            console.log(settings.get("message"));

            // Waiting before the next refresh
            await sleepInMs(5000);
        }
    }

    run().catch(console.error);
    ```

1. Run your script:

    ```console
    node app.js
    ```

1. Verify Output:

    ```console
    Using Azure portal or CLI, first update the `message` value, and then update the `sentinel` value in your App Configuration store.
    Hello World!
    ```
    It continues to print "Hello World!" in a new line every 5 seconds.

1. Update the following key-values to the Azure App Configuration store.

    | Key            | Value                     | Label       | Content type       |
    |----------------|---------------------------|-------------|--------------------|
    | *message*      | *Hello World Refreshed!*  | Leave empty | Leave empty        |
    | *sentinel*     | *2*                       | Leave empty | Leave empty        |

1. Once the values have been updated the updated value will print out when the refresh interval has passed.

    ```console
    Hello World Refreshed!
    ```