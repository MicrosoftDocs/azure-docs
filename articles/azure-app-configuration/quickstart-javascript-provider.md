---
title: Quickstart for using Azure App Configuration with JavaScript apps | Microsoft Docs
description: In this quickstart, create a Node.js app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: eskibear
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: quickstart
ms.custom: quickstart, mode-other, devx-track-js
ms.date: 10/12/2023
ms.author: yanzh
#Customer intent: As a JavaScript developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a JavaScript app with Azure App Configuration

In this quickstart, you will use Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration JavaScript provider client library](https://github.com/Azure/AppConfiguration-JavaScriptProvider).

The JavaScript App Configuration provider is a library running on top of the [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration), helping JavaScript developers easily consume the App Configuration service. It enables configuration settings to be used like a Map.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)

## Add a key-value

Add the following key-values to the App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value                                  | Content type       |
|----------------|----------------------------------------|--------------------|
| *message*      | *Message from Azure App Configuration* | Leave empty        |
| *app.greeting* | *Hello World*                          | Leave empty        |
| *app.json*     | *{"myKey":"myValue"}*                  | *application/json* |

## Setting up the Node.js app

1. In this tutorial, you'll create a new directory for the project named *app-configuration-quickstart*.

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

1. Create a new file called *app.js* in the *app-configuration-quickstart* directory and add the following code:

    ```javascript
    const { load } = require("@azure/app-configuration-provider");
    const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

    async function run() {
        let settings;

        // Sample 1: Connect to Azure App Configuration using a connection string and load all key-values with null label.
        settings = await load(connectionString);

        // Find the key "message" and print its value.
        console.log(settings.get("message"));  // Output: Message from Azure App Configuration

        // Find the key "json" as an object, and print its property "myKey".
        const jsonObject = settings.get("app.json");
        console.log(jsonObject.myKey);  // Output: myValue

        // Sample 2: Load all key-values with null label and trim "app." prefix from all keys.
        settings = await load(connectionString, {
          trimKeyPrefixes: ["app."]
        });

        // From the keys with trimmed prefixes, find a key with "greeting" and print its value.
        console.log(settings.get("greeting")); // Output: Hello World

        // Sample 3: Load all keys starting with "app." prefix and null label.
        settings = await load(connectionString, {
          selectors: [{
            keyFilter: "app.*"
          }],
        });

        // Print true or false indicating whether a setting is loaded.
        console.log(settings.has("message")); // Output: false
        console.log(settings.has("app.greeting")); // Output: true
        console.log(settings.has("app.json")); // Output: true
    }

    run().catch(console.error);
    ```

## Run the application locally

1. Set an environment variable named **AZURE_APPCONFIG_CONNECTION_STRING**, and set it to the connection string of your App Configuration store. At the command line, run the following command:

    ### [Windows command prompt](#tab/windowscommandprompt)

    To build and run the app locally using the Windows command prompt, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "app-configuration-store-connection-string"
    ```

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```azurepowershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "<app-configuration-store-connection-string>"
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```console
    export AZURE_APPCONFIG_CONNECTION_STRING='<app-configuration-store-connection-string>'
    ```

    ### [Linux](#tab/linux)

    If you use Linux, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```console
    export AZURE_APPCONFIG_CONNECTION_STRING='<app-configuration-store-connection-string>'
   ```

1. Print out the value of the environment variable to validate that it is set properly with the command below.

    ### [Windows command prompt](#tab/windowscommandprompt)

    Using the Windows command prompt, restart the command prompt to allow the change to take effect and run the following command:

    ```cmd
    echo %AZURE_APPCONFIG_CONNECTION_STRING%
    ```

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command:

    ```console
    echo "$AZURE_APPCONFIG_CONNECTION_STRING"
    ```

    ### [Linux](#tab/linux)

    If you use Linux, run the following command:

    ```console
    echo "$AZURE_APPCONFIG_CONNECTION_STRING"
    ```

1. After the build successfully completes, run the following command to run the app locally:

    ```bash
    node app.js
    ```

    You should see the following output:

    ```Output
    Message from Azure App Configuration
    myValue
    Hello World
    false
    true
    true
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values using the App Configuration Javascript provider in a Node.js app.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration JavaScript provider](https://github.com/Azure/AppConfiguration-JavaScriptProvider/tree/main/examples)
