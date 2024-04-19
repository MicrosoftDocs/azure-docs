---
title: Use dynamic configuration in JavaScript
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for JavaScript.
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

Data from App Configuration can be loaded and consumed as a Map or an object.
For more information, see the [quickstart](./quickstart-javascript-provider.md).
The Azure App Configuration JavaScript provider supports caching and refreshing configuration dynamically without app restart.
This tutorial shows how to enable dynamic configuration in JavaScript applications.

In this tutorial, you learn how to set up your JavaScript app to update its configuration in response to changes in an App Configuration store.

## Prerequisites

- Finish the quickstart [Create a JavaScript app with Azure App Configuration](./quickstart-javascript-provider.md).

## Add key-values

Add the following key-value to your Azure App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value             | Label       | Content type       |
|----------------|-------------------|-------------|--------------------|
| *message*      | *Hello World!*    | Leave empty | Leave empty        |
| *sentinel*     | *1*               | Leave empty | Leave empty        |

> [!NOTE]
> A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your Azure App Configuration store, compared to monitoring all keys for changes.

## Reload data from App Configuration

The following examples show how to use refreshable configuration values in console applications.
The refresh behavior is configured by `refreshOptions` parameter when calling `load` function.
The loaded configuration is updated when a change is detected on the server.

1. Open the file *app.js* and update the `load` function. Add a `refreshOptions` parameter to enable the refresh and configure refresh options. By default, a refresh interval of 30 seconds is used, but you can override it with the `refreshIntervalInMs` property.

    ### [Use configuration as Map](#tab/configuration-map)

    ```javascript
    // Connecting to Azure App Configuration using connection string
    const settings = await load(connectionString, {
        // Setting up to refresh when the sentinel key is changed
        refreshOptions: {
            enabled: true,
            watchedSettings: [{ key: "sentinel" }] // Watch for changes to the key "sentinel" and refreshes the configuration when it changes
        }
    });
    ```

    ### [Use configuration as object](#tab/configuration-object)

    The configuration object is constructed by calling `constructConfigurationObject` function.
    To ensure an up-to-date configuration, update the configuration object in the `onRefresh` callback triggered whenever a configuration change is detected and the configuration is updated.

    ```javascript
    // Connecting to Azure App Configuration using connection string
    const settings = await load(connectionString, {
        // Setting up to refresh when the sentinel key is changed
        refreshOptions: {
            enabled: true,
            watchedSettings: [{ key: "sentinel" }] // Watch for changes to the key "sentinel" and refreshes the configuration when it changes
        }
    });

    // Constructing configuration object
    let config = settings.constructConfigurationObject();

    // Setting up callback to ensure `config` object is updated once configuration is changed.
    settings.onRefresh(() => {
        config = settings.constructConfigurationObject();
    });

    ```
    ---

1. Add the following code to poll configuration changes of watched key-values every 5 seconds.

    ### [Use configuration as Map](#tab/configuration-map)

    ```javascript
    // Polling for configuration changes every 5 seconds
    while (true) {
        await sleepInMs(5000); // Waiting before the next refresh
        await settings.refresh(); // Refreshing the configuration setting
        console.log(settings.get("message")); // Consume current value of message from a Map
    }
    ```

    ### [Use configuration as object](#tab/configuration-object)

    ```javascript
    // Polling for configuration changes every 5 seconds
    while (true) {
        await sleepInMs(5000); // Waiting before the next refresh
        await settings.refresh(); // Refreshing the configuration setting
        console.log(config.message); // Consume current value of message from an object
    }
    ```

    ---

1. Now the file *app.js* should look like the following code snippet:

    ### [Use configuration as Map](#tab/configuration-map)

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
                watchedSettings: [{ key: "sentinel" }] // Watch for changes to the key "sentinel" and refreshes the configuration when it changes
            }
        });

        // Polling for configuration changes every 5 seconds
        while (true) {
            await sleepInMs(5000); // Waiting before the next refresh
            await settings.refresh(); // Refreshing the configuration setting
            console.log(settings.get("message")); // Consume current value of message from a Map
        }
    }

    run().catch(console.error);
    ```
    ### [Use configuration as object](#tab/configuration-object)

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
                watchedSettings: [{ key: "sentinel" }] // Watch for changes to the key "sentinel" and refreshes the configuration when it changes
            }
        });

        // Constructing configuration object
        let config = settings.constructConfigurationObject();

        // Setting up callback to ensure `config` object is updated once configuration is changed.
        settings.onRefresh(() => {
            config = settings.constructConfigurationObject();
        });

        // Polling for configuration changes every 5 seconds
        while (true) {
            await sleepInMs(5000); // Waiting before the next refresh
            await settings.refresh(); // Refreshing the configuration setting
            console.log(config.message); // Consume current value of message from an object
        }
    }

    run().catch(console.error);
    ```

    ---

## Run the application

1. Run your script:

    ```console
    node app.js
    ```

1. Verify Output:

    ```console
    Hello World!
    ```
    It continues to print "Hello World!" in a new line every 5 seconds.

1. Update the following key-values to the Azure App Configuration store. Update value of the key `message` first and then `sentinel`.

    | Key            | Value                     | Label       | Content type       |
    |----------------|---------------------------|-------------|--------------------|
    | *message*      | *Hello World - Updated!*  | Leave empty | Leave empty        |
    | *sentinel*     | *2*                       | Leave empty | Leave empty        |

1. Once the values are updated, the updated value is printed after the refresh interval.

    ```console
    Hello World - Updated!
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your JavaScript app to dynamically refresh configuration settings from Azure App Configuration. To learn how to use an Azure managed identity to streamline the access to Azure App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
