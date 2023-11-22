---
title: Quickstart for using Azure App Configuration with JavaScript apps | Microsoft Docs
description: In this quickstart, create a Node.js app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: quickstart
ms.custom: quickstart, mode-other, devx-track-js
ms.date: 03/20/2023
ms.author: malev
#Customer intent: As a JavaScript developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a JavaScript app with Azure App Configuration

In this quickstart, you will use Azure App Configuration to centralize storage and management of application settings using the [App Configuration client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/appconfiguration/app-configuration/README.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key | Value |
|---|---|
| TestApp:Settings:Message | Data from Azure App Configuration |

## Setting up the Node.js app

1. In this tutorial, you'll create a new directory for the project named *app-configuration-quickstart*.

    ```console
    mkdir app-configuration-quickstart
    ```

1. Switch to the newly created *app-configuration-quickstart* directory.

    ```console
    cd app-configuration-quickstart
    ```

1. Install the Azure App Configuration client library by using the `npm install` command.

    ```console
    npm install @azure/app-configuration
    ```

1. Create a new file called *app.js* in the *app-configuration-quickstart* directory and add the following code:

   ```javascript
   const appConfig = require("@azure/app-configuration");
   ```

## Configure your connection string

1. Set an environment variable named **AZURE_APP_CONFIG_CONNECTION_STRING**, and set it to the access key to your App Configuration store. At the command line, run the following command:

    ### [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    $Env:AZURE_APP_CONFIG_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```

    ### [Command line](#tab/command-line)

    ```cmd
    setx AZURE_APP_CONFIG_CONNECTION_STRING "connection-string-of-your-app-configuration-store"
    ```

    ### [macOS](#tab/macOS)
    ```console
    export AZURE_APP_CONFIG_CONNECTION_STRING='connection-string-of-your-app-configuration-store'
    ```

    ---

2. Restart the command prompt to allow the change to take effect. Print out the value of the environment variable to validate that it is set properly.

## Connect to an App Configuration store

The following code snippet creates an instance of **AppConfigurationClient** using the connection string stored in your environment variables.

```javascript
const connection_string = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
const client = new appConfig.AppConfigurationClient(connection_string);
```

## Get a configuration setting

The following code snippet retrieves a configuration setting by `key` name. The key shown in this example was created in the previous steps of this article.

```javascript
async function run() {
  
  let retrievedSetting = await client.getConfigurationSetting({
    key: "TestApp:Settings:Message"
  });

  console.log("Retrieved value:", retrievedSetting.value);
}

run().catch((err) => console.log("ERROR:", err));
```

## Build and run the app locally

1. Run the following command to run the Node.js app:

   ```powershell
   node app.js
   ```
1. You should see the following output at the command prompt:

   ```powershell
   Retrieved value: Data from Azure App Configuration
   ```
## Clean up resources


[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values from a Node.js app.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration client library samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration/samples/v1/javascript)
