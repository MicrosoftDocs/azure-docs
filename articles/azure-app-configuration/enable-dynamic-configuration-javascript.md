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

In this tutorial, you learn how to enable dynamic configuration in your JavaScript applications.
The example in this tutorial builds on the sample application introduced in the JavaScript quickstart.
Before you continue, finish [Create a JavaScript app with Azure App Configuration](./quickstart-javascript-provider.md).

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
Choose the following instructions based on how your application consumes configuration data loaded from App Configuration, either as a `Map` or a configuration object.

1. Open the file *app.js* and update the `load` function. Add a `refreshOptions` parameter to enable the refresh and configure refresh options. The loaded configuration will be updated when a change is detected on the server. By default, a refresh interval of 30 seconds is used, but you can override it with the `refreshIntervalInMs` property.

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

1. Setting up `refreshOptions` alone won't automatically refresh the configuration. You need to call the `refresh` method to trigger a refresh. This design prevents unnecessary requests to App Configuration when your application is idle. You should include the `refresh` call where your application activity occurs. This is known as **activity-driven configuration refresh**. For example, you can call `refresh` when processing an incoming message or an order, or inside an iteration where you perform a complex task. Alternatively, you can use a timer if your application is always active. In this example, `refresh` is called in a loop for demonstration purposes. Even if the `refresh` call fails for any reason, your application will continue to use the cached configuration. Another attempt will be made when the configured refresh interval has passed and the `refresh` call is triggered by your application activity. Calling `refresh` is a no-op before the configured refresh interval elapses, so its performance impact is minimal even if it's called frequently.

    Add the following code to poll configuration changes of watched key-values.

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
