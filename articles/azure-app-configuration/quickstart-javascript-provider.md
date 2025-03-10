---
title: Quickstart for using Azure App Configuration with JavaScript apps
description: In this quickstart, create a Node.js app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: quickstart
ms.custom: quickstart, mode-other, devx-track-js
ms.date: 11/07/2024
ms.author: zhiyuanliang
#Customer intent: As a JavaScript developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Node.js console app with Azure App Configuration

In this quickstart, you use Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration JavaScript provider client library](https://github.com/Azure/AppConfiguration-JavaScriptProvider).

App Configuration provider for JavaScript is built on top of the [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration) and is designed to be easier to use with richer features.
It enables access to key-values in App Configuration as a `Map` object.
It offers features like configuration composition from multiple labels, key prefix trimming, automatic resolution of Key Vault references, and many more.
As an example, this tutorial shows how to use the JavaScript provider in a Node.js app.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)

## Add key-values

Add the following key-values to the App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value                                  | Content type       |
|----------------|----------------------------------------|--------------------|
| *message*      | *Message from Azure App Configuration* | Leave empty        |
| *app.greeting* | *Hello World*                          | Leave empty        |
| *app.json*     | *{"myKey":"myValue"}*                  | *application/json* |

## Create a Node.js console app

In this tutorial, you create a Node.js console app and load data from your App Configuration store.

1. Create a new directory for the project named *app-configuration-quickstart*.

    ```console
    mkdir app-configuration-quickstart
    ```

1. Switch to the newly created *app-configuration-quickstart* directory.

    ```console
    cd app-configuration-quickstart
    ```

1. Install the Azure App Configuration provider by using the `npm install` command.

    ```console
    npm install @azure/app-configuration-provider
    ```

## Connect to an App Configuration store

The following examples demonstrate how to retrieve configuration data from Azure App Configuration and utilize it in your application.
By default, the key-values are loaded as a `Map` object, allowing you to access each key-value using its full key name.
However, if your application uses configuration objects, you can use the `constructConfigurationObject` helper API that creates a configuration object based on the key-values loaded from Azure App Configuration.

Create a file named *app.js* in the *app-configuration-quickstart* directory and copy the code from each sample.

### Sample 1: Load key-values with default selector

In this sample, you connect to Azure App Configuration and load key-values without specifying advanced options.
By default, it loads all key-values with no label.
You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

``` javascript
const { load } = require("@azure/app-configuration-provider");
const { DefaultAzureCredential } = require("@azure/identity");
const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
const credential = new DefaultAzureCredential(); // For more information, see https://learn.microsoft.com/azure/developer/javascript/sdk/credential-chains#use-defaultazurecredential-for-flexibility

async function run() {
    console.log("Sample 1: Load key-values with default selector");

    // Connect to Azure App Configuration using a token credential and load all key-values with null label.
    const settings = await load(endpoint, credential);

    console.log("---Consume configuration as a Map---");
    // Find the key "message" and print its value.
    console.log('settings.get("message"):', settings.get("message"));           // settings.get("message"): Message from Azure App Configuration
    // Find the key "app.greeting" and print its value.
    console.log('settings.get("app.greeting"):', settings.get("app.greeting")); // settings.get("app.greeting"): Hello World
    // Find the key "app.json" whose value is an object.
    console.log('settings.get("app.json"):', settings.get("app.json"));         // settings.get("app.json"): { myKey: 'myValue' }

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values, by default "." is used to separate hierarchical keys.
    const config = settings.constructConfigurationObject();
    // Use dot-notation to access configuration
    console.log("config.message:", config.message);             // config.message: Message from Azure App Configuration
    console.log("config.app.greeting:", config.app.greeting);   // config.app.greeting: Hello World
    console.log("config.app.json:", config.app.json);           // config.app.json: { myKey: 'myValue' }
}

run().catch(console.error);
```

### [Connection string](#tab/connection-string)

``` javascript
const { load } = require("@azure/app-configuration-provider");
const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

async function run() {
    console.log("Sample 1: Load key-values with default selector");

    // Connect to Azure App Configuration using a connection string and load all key-values with null label.
    const settings = await load(connectionString);

    console.log("---Consume configuration as a Map---");
    // Find the key "message" and print its value.
    console.log('settings.get("message"):', settings.get("message"));           // settings.get("message"): Message from Azure App Configuration
    // Find the key "app.greeting" and print its value.
    console.log('settings.get("app.greeting"):', settings.get("app.greeting")); // settings.get("app.greeting"): Hello World
    // Find the key "app.json" whose value is an object.
    console.log('settings.get("app.json"):', settings.get("app.json"));         // settings.get("app.json"): { myKey: 'myValue' }

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values, by default "." is used to separate hierarchical keys.
    const config = settings.constructConfigurationObject();
    // Use dot-notation to access configuration
    console.log("config.message:", config.message);             // config.message: Message from Azure App Configuration
    console.log("config.app.greeting:", config.app.greeting);   // config.app.greeting: Hello World
    console.log("config.app.json:", config.app.json);           // config.app.json: { myKey: 'myValue' }
}

run().catch(console.error);
```

---

### Sample 2: Load specific key-values using selectors

In this sample, you load a subset of key-values by specifying the `selectors` option.
Only keys starting with "app." are loaded.
Note that you can specify multiple selectors based on your needs, each with `keyFilter` and `labelFilter` properties.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

``` javascript
const { load } = require("@azure/app-configuration-provider");
const { DefaultAzureCredential } = require("@azure/identity");
const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
const credential = new DefaultAzureCredential(); // For more information, see https://learn.microsoft.com/azure/developer/javascript/sdk/credential-chains#use-defaultazurecredential-for-flexibility

async function run() {
    console.log("Sample 2: Load specific key-values using selectors");

    // Load a subset of keys starting with "app." prefix.
    const settings = await load(endpoint, credential, {
        selectors: [{
            keyFilter: "app.*"
        }],
    });

    console.log("---Consume configuration as a Map---");
    // The key "message" is not loaded as it does not start with "app."
    console.log('settings.has("message"):', settings.has("message"));           // settings.has("message"): false
    // The key "app.greeting" is loaded
    console.log('settings.has("app.greeting"):', settings.has("app.greeting")); // settings.has("app.greeting"): true
    // The key "app.json" is loaded
    console.log('settings.has("app.json"):', settings.has("app.json"));         // settings.has("app.json"): true

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values
    const config = settings.constructConfigurationObject({ separator: "." });
    // Use dot-notation to access configuration
    console.log("config.message:", config.message);         // config.message: undefined
    console.log("config.app.greeting:", config.app.greeting);   // config.app.greeting: Hello World
    console.log("config.app.json:", config.app.json);           // config.app.json: { myKey: 'myValue' }
}

run().catch(console.error);
```

### [Connection string](#tab/connection-string)

``` javascript
const { load } = require("@azure/app-configuration-provider");
const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

async function run() {
    console.log("Sample 2: Load specific key-values using selectors");

    // Load a subset of keys starting with "app." prefix.
    const settings = await load(connectionString, {
        selectors: [{
            keyFilter: "app.*"
        }],
    });

    console.log("---Consume configuration as a Map---");
    // The key "message" is not loaded as it does not start with "app."
    console.log('settings.has("message"):', settings.has("message"));           // settings.has("message"): false
    // The key "app.greeting" is loaded
    console.log('settings.has("app.greeting"):', settings.has("app.greeting")); // settings.has("app.greeting"): true
    // The key "app.json" is loaded
    console.log('settings.has("app.json"):', settings.has("app.json"));         // settings.has("app.json"): true

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values
    const config = settings.constructConfigurationObject({ separator: "." });
    // Use dot-notation to access configuration
    console.log("config.message:", config.message);         // config.message: undefined
    console.log("config.app.greeting:", config.app.greeting);   // config.app.greeting: Hello World
    console.log("config.app.json:", config.app.json);           // config.app.json: { myKey: 'myValue' }
}

run().catch(console.error);
```

---

### Sample 3: Load key-values and trim prefix from keys

In this sample, you load key-values with an option `trimKeyPrefixes`.
After key-values are loaded, the prefix "app." is trimmed from all keys.
This is useful when you want to load configurations that are specific to your application by filtering to a certain key prefix, but you don't want your code to carry the prefix every time it accesses the configuration.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

``` javascript
const { load } = require("@azure/app-configuration-provider");
const { DefaultAzureCredential } = require("@azure/identity");
const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
const credential = new DefaultAzureCredential(); // For more information, see https://learn.microsoft.com/azure/developer/javascript/sdk/credential-chains#use-defaultazurecredential-for-flexibility

async function run() {
    console.log("Sample 3: Load key-values and trim prefix from keys");

    // Load all key-values with no label, and trim "app." prefix from all keys.
    const settings = await load(endpoint, credential, {
        selectors: [{
            keyFilter: "app.*"
        }],
        trimKeyPrefixes: ["app."]
    });

    console.log("---Consume configuration as a Map---");
    // The original key "app.greeting" is trimmed as "greeting".
    console.log('settings.get("greeting"):', settings.get("greeting")); // settings.get("greeting"): Hello World
    // The original key "app.json" is trimmed as "json".
    console.log('settings.get("json"):', settings.get("json"));         // settings.get("json"): { myKey: 'myValue' }

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values with trimmed keys.
    const config = settings.constructConfigurationObject();
    // Use dot-notation to access configuration
    console.log("config.greeting:", config.greeting);   // config.greeting: Hello World
    console.log("config.json:", config.json);           // config.json: { myKey: 'myValue' }
}

run()

```

### [Connection string](#tab/connection-string)

``` javascript
const { load } = require("@azure/app-configuration-provider");
const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

async function run() {
    console.log("Sample 3: Load key-values and trim prefix from keys");

    // Load all key-values with no label, and trim "app." prefix from all keys.
    const settings = await load(connectionString, {
        selectors: [{
            keyFilter: "app.*"
        }],
        trimKeyPrefixes: ["app."]
    });

    console.log("---Consume configuration as a Map---");
    // The original key "app.greeting" is trimmed as "greeting".
    console.log('settings.get("greeting"):', settings.get("greeting")); // settings.get("greeting"): Hello World
    // The original key "app.json" is trimmed as "json".
    console.log('settings.get("json"):', settings.get("json"));         // settings.get("json"): { myKey: 'myValue' }

    console.log("---Consume configuration as an object---");
    // Construct configuration object from loaded key-values with trimmed keys.
    const config = settings.constructConfigurationObject();
    // Use dot-notation to access configuration
    console.log("config.greeting:", config.greeting);   // config.greeting: Hello World
    console.log("config.json:", config.json);           // config.json: { myKey: 'myValue' }
}

run().catch(console.error);
```

---

## Run the application

1. Set the environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

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

    ### [Connection string](#tab/connection-string)
    Set the environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access keys* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```

   If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```
    
    ---

1. After the environment variable is properly set, run the following command to run the app locally:

    ```bash
    node app.js
    ```

    You should see the following output for each sample:

    **Sample 1**

    ```Output
    Sample 1: Load key-values with default selector
    ---Consume configuration as a Map---
    settings.get("message"): Message from Azure App Configuration
    settings.get("app.greeting"): Hello World
    settings.get("app.json"): { myKey: 'myValue' }
    ---Consume configuration as an object---
    config.message: Message from Azure App Configuration
    config.app.greeting: Hello World
    config.app.json: { myKey: 'myValue' }
    ```

    **Sample 2**

    ```Output
    Sample 2: Load specific key-values using selectors
    ---Consume configuration as a Map---
    settings.has("message"): false
    settings.has("app.greeting"): true
    settings.has("app.json"): true
    ---Consume configuration as an object---
    config.message: undefined
    config.app.greeting: Hello World
    config.app.json: { myKey: 'myValue' }
    ```

    **Sample 3**

    ```Output
    Sample 3: Load key-values and trim prefix from keys
    ---Consume configuration as a Map---
    settings.get("greeting"): Hello World
    settings.get("json"): { myKey: 'myValue' }
    ---Consume configuration as an object---
    config.greeting: Hello World
    config.json: { myKey: 'myValue' }
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values using the App Configuration JavaScript provider in a Node.js app. To learn how to configure your app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-javascript.md)

For the full feature rundown of the JavaScript configuration provider library, continue to the following document.

> [!div class="nextstepaction"]
> [JavaScript configuration provider](./reference-javascript-provider.md)