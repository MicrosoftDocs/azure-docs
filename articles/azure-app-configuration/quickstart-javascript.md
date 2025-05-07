---
title: Using Azure App Configuration in JavaScript apps with the Azure SDK for JavaScript | Microsoft Docs
description: This document shows examples of how to use the Azure SDK for JavaScript to access key-values in Azure App Configuration.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: sample
ms.custom: mode-other, devx-track-js
ms.date: 02/20/2025
ms.author: malev
#Customer intent: As a JavaScript developer, I want to manage all my app settings in one place.
---
# Create a Node.js app with the Azure SDK for JavaScript

This document shows examples of how to use the [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/appconfiguration/app-configuration) to access key-values in Azure App Configuration.

>[!IMPORTANT]
> App Configuration offers a JavaScript provider library that is built on top of the JavaScript SDK and is designed to be easier to use with richer features. It enables configuration settings to be used like a Map object, and offers other features like configuration composition from multiple labels, key name trimming, and automatic resolution of Key Vault references. Go to the [JavaScript quickstart](./quickstart-javascript-provider.md) to learn more.

## Prerequisites

- An Azure account with an active subscription - [Create one for free](https://azure.microsoft.com/free/)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)

## Create a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key | Value |
|---|---|
| TestApp:Settings:Message | Data from Azure App Configuration |

## Setting up the Node.js app

1. In this tutorial, you'll create a new directory for the project named *app-configuration-example*.

    ```console
    mkdir app-configuration-example
    ```

1. Switch to the newly created *app-configuration-example* directory.

    ```console
    cd app-configuration-example
    ```

1. Install the Azure App Configuration client library by using the `npm install` command.

    ```console
    npm install @azure/app-configuration
    ```

1. Create a new file called *app-configuration-example.js* in the *app-configuration-example* directory and add the following code:

    ```javascript
    const { AppConfigurationClient } = require("@azure/app-configuration");

    async function run() {
      console.log("Azure App Configuration - JavaScript example");
      // Example code goes here
    }

    run().catch(console.error);
    ```

> [!NOTE]
> The code snippets in this example will help you get started with the App Configuration client library for JavaScript. For your application, you should also consider handling exceptions according to your needs. To learn more about exception handling, please refer to our [JavaScript SDK documentation](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration).

## Code samples

The sample code snippets in this section show you how to perform common operations with the App Configuration client library for JavaScript. Add these code snippets to the body of `run` function in *app-configuration-example.js* file you created earlier.

> [!NOTE]
> The App Configuration client library refers to a key-value object as `ConfigurationSetting`. Therefore, in this article, the **key-values** in App Configuration store will be referred to as **configuration settings**.

Learn below how to:

- [Connect to an App Configuration store](#connect-to-an-app-configuration-store)
- [Get a configuration setting](#get-a-configuration-setting)
- [Add a configuration setting](#add-a-configuration-setting)
- [Get a list of configuration settings](#get-a-list-of-configuration-settings)
- [Lock a configuration setting](#lock-a-configuration-setting)
- [Unlock a configuration setting](#unlock-a-configuration-setting)
- [Update a configuration setting](#update-a-configuration-setting)
- [Delete a configuration setting](#delete-a-configuration-setting)

### Connect to an App Configuration store

The following code snippet creates an instance of **AppConfigurationClient**. You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { AppConfigurationClient } = require("@azure/app-configuration");

const client = new AppConfigurationClient(
  process.env.AZURE_APPCONFIG_ENDPOINT,
  new DefaultAzureCredential()
);
```

### [Connection string](#tab/connection-string)

```javascript
const { AppConfigurationClient } = require("@azure/app-configuration");

const connection_string = process.env.AZURE_APPCONFIG_CONNECTION_STRING;
const client = new AppConfigurationClient(connection_string);
```
---

### Get a configuration setting

The following code snippet retrieves a configuration setting by `key` name.

```javascript
    const retrievedConfigSetting = await client.getConfigurationSetting({
        key: "TestApp:Settings:Message"
    });
    console.log("\nRetrieved configuration setting:");
    console.log(`Key: ${retrievedConfigSetting.key}, Value: ${retrievedConfigSetting.value}`);
```

### Add a configuration setting

The following code snippet creates a `ConfigurationSetting` object with `key` and `value` fields and invokes the `addConfigurationSetting` method.
This method will throw an exception if you try to add a configuration setting that already exists in your store. If you want to avoid this exception, the [setConfigurationSetting](#update-a-configuration-setting) method can be used instead.

```javascript
    const configSetting = {
        key:"TestApp:Settings:NewSetting",
        value:"New setting value"
    };
    const addedConfigSetting = await client.addConfigurationSetting(configSetting);
    console.log("\nAdded configuration setting:");
    console.log(`Key: ${addedConfigSetting.key}, Value: ${addedConfigSetting.value}`);
```

### Get a list of configuration settings

The following code snippet retrieves a list of configuration settings. The `keyFilter` and `labelFilter` arguments can be provided to filter key-values based on `key` and `label` respectively. For more information on filtering, see how to [query configuration settings](./concept-key-value.md#query-key-values).

```javascript
    const filteredSettingsList = client.listConfigurationSettings({
        keyFilter: "TestApp*"
    });
    console.log("\nRetrieved list of configuration settings:");
    for await (const filteredSetting of filteredSettingsList) {
        console.log(`Key: ${filteredSetting.key}, Value: ${filteredSetting.value}`);
    }
```

### Lock a configuration setting

The lock status of a key-value in App Configuration is denoted by the `readOnly` attribute of the `ConfigurationSetting` object. If `readOnly` is `true`, the setting is locked. The `setReadOnly` method can be invoked with `true` as the second argument to lock the configuration setting.

```javascript
    const lockedConfigSetting = await client.setReadOnly(addedConfigSetting, true /** readOnly */);
    console.log(`\nRead-only status for ${lockedConfigSetting.key}: ${lockedConfigSetting.isReadOnly}`);
```

### Unlock a configuration setting

If the `readOnly` attribute of a `ConfigurationSetting` is `false`, the setting is unlocked. The `setReadOnly` method can be invoked with `false` as the second argument to unlock the configuration setting.

```javascript
    const unlockedConfigSetting = await client.setReadOnly(lockedConfigSetting, false /** readOnly */);
    console.log(`\nRead-only status for ${unlockedConfigSetting.key}: ${unlockedConfigSetting.isReadOnly}`);
```

### Update a configuration setting

The `setConfigurationSetting` method can be used to update an existing setting or create a new setting. The following code snippet changes the value of an existing configuration setting.

```javascript
    addedConfigSetting.value = "Value has been updated!";
    const updatedConfigSetting = await client.setConfigurationSetting(addedConfigSetting);
    console.log("\nUpdated configuration setting:");
    console.log(`Key: ${updatedConfigSetting.key}, Value: ${updatedConfigSetting.value}`);
```

### Delete a configuration setting

The following code snippet deletes a configuration setting by `key` name.

```javascript
    const deletedConfigSetting = await client.deleteConfigurationSetting({
        key: "TestApp:Settings:NewSetting"
    });
    console.log("\nDeleted configuration setting:");
    console.log(`Key: ${deletedConfigSetting.key}, Value: ${deletedConfigSetting.value}`);
```

## Run the app

In this example, you created a Node.js app that uses the Azure App Configuration client library to retrieve a configuration setting created through the Azure portal, add a new setting, retrieve a list of existing settings, lock and unlock a setting, update a setting, and finally delete a setting.

At this point, your *app-configuration-example.js* file should have the following code:

### [Microsoft Entra ID (recommended)](#tab/entra-id)

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { AppConfigurationClient } = require("@azure/app-configuration");

async function run() {
    console.log("Azure App Configuration - JavaScript example");

    const client = new AppConfigurationClient(
        process.env.AZURE_APPCONFIG_ENDPOINT,
        new DefaultAzureCredential()
    );

    const retrievedConfigSetting = await client.getConfigurationSetting({
        key: "TestApp:Settings:Message"
    });
    console.log("\nRetrieved configuration setting:");
    console.log(`Key: ${retrievedConfigSetting.key}, Value: ${retrievedConfigSetting.value}`);

    const configSetting = {
        key: "TestApp:Settings:NewSetting",
        value: "New setting value"
    };
    const addedConfigSetting = await client.addConfigurationSetting(configSetting);
    console.log("Added configuration setting:");
    console.log(`Key: ${addedConfigSetting.key}, Value: ${addedConfigSetting.value}`);

    const filteredSettingsList = client.listConfigurationSettings({
        keyFilter: "TestApp*"
    });
    console.log("Retrieved list of configuration settings:");
    for await (const filteredSetting of filteredSettingsList) {
        console.log(`Key: ${filteredSetting.key}, Value: ${filteredSetting.value}`);
    }

    const lockedConfigSetting = await client.setReadOnly(addedConfigSetting, true /** readOnly */);
    console.log(`Read-only status for ${lockedConfigSetting.key}: ${lockedConfigSetting.isReadOnly}`);

    const unlockedConfigSetting = await client.setReadOnly(lockedConfigSetting, false /** readOnly */);
    console.log(`Read-only status for ${unlockedConfigSetting.key}: ${unlockedConfigSetting.isReadOnly}`);

    addedConfigSetting.value = "Value has been updated!";
    const updatedConfigSetting = await client.setConfigurationSetting(addedConfigSetting);
    console.log("Updated configuration setting:");
    console.log(`Key: ${updatedConfigSetting.key}, Value: ${updatedConfigSetting.value}`);

    const deletedConfigSetting = await client.deleteConfigurationSetting({
        key: "TestApp:Settings:NewSetting"
    });
    console.log("Deleted configuration setting:");
    console.log(`Key: ${deletedConfigSetting.key}, Value: ${deletedConfigSetting.value}`);
}

run().catch(console.error);
```

### [Connection string](#tab/connection-string)

```javascript
const { AppConfigurationClient } = require("@azure/app-configuration");

async function run() {
    console.log("Azure App Configuration - JavaScript example");

    const connection_string = process.env.AZURE_APPCONFIG_CONNECTION_STRING;
    const client = new AppConfigurationClient(connection_string);

    const retrievedConfigSetting = await client.getConfigurationSetting({
        key: "TestApp:Settings:Message"
    });
    console.log("\nRetrieved configuration setting:");
    console.log(`Key: ${retrievedConfigSetting.key}, Value: ${retrievedConfigSetting.value}`);

    const configSetting = {
        key: "TestApp:Settings:NewSetting",
        value: "New setting value"
    };
    const addedConfigSetting = await client.addConfigurationSetting(configSetting);
    console.log("Added configuration setting:");
    console.log(`Key: ${addedConfigSetting.key}, Value: ${addedConfigSetting.value}`);

    const filteredSettingsList = client.listConfigurationSettings({
        keyFilter: "TestApp*"
    });
    console.log("Retrieved list of configuration settings:");
    for await (const filteredSetting of filteredSettingsList) {
        console.log(`Key: ${filteredSetting.key}, Value: ${filteredSetting.value}`);
    }

    const lockedConfigSetting = await client.setReadOnly(addedConfigSetting, true /** readOnly */);
    console.log(`Read-only status for ${lockedConfigSetting.key}: ${lockedConfigSetting.isReadOnly}`);

    const unlockedConfigSetting = await client.setReadOnly(lockedConfigSetting, false /** readOnly */);
    console.log(`Read-only status for ${unlockedConfigSetting.key}: ${unlockedConfigSetting.isReadOnly}`);

    addedConfigSetting.value = "Value has been updated!";
    const updatedConfigSetting = await client.setConfigurationSetting(addedConfigSetting);
    console.log("Updated configuration setting:");
    console.log(`Key: ${updatedConfigSetting.key}, Value: ${updatedConfigSetting.value}`);

    const deletedConfigSetting = await client.deleteConfigurationSetting({
        key: "TestApp:Settings:NewSetting"
    });
    console.log("Deleted configuration setting:");
    console.log(`Key: ${deletedConfigSetting.key}, Value: ${deletedConfigSetting.value}`);
}

run().catch(console.error);
```
---

## Configure an environment variable

1. Configure an environment variable using Microsoft Entra ID (recommended) or a connection string.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    Set an environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the **Overview** of your store in the Azure portal.
    
    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:
    
    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "endpoint-of-your-app-configuration-store"
    ```
    
    If you use PowerShell, run the following command:
    
    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "endpoint-of-your-app-configuration-store"
    ```
    
    If you use macOS or Linux, run the following command:
    
    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```
    
    ### [Connection string](#tab/connection-string)
    
    Set an environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under **Access keys** of your store in the Azure portal.
    
    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:
    
    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```
    
    If you use PowerShell, run the following command:
    
    ```powershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```
    
    If you use macOS or Linux, run the following command:
    
    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. In your console window, navigate to the directory containing the *app-configuration-example.js* file and execute the following command to run the app:

    ```console
    node app.js
    ```
    
    You should see the following output:
    
    ```output
    Azure App Configuration - JavaScript example
    
    Retrieved configuration setting:
    Key: TestApp:Settings:Message, Value: Data from Azure App Configuration
    
    Added configuration setting:
    Key: TestApp:Settings:NewSetting, Value: New setting value
    
    Retrieved list of configuration settings:
    Key: TestApp:Settings:Message, Value: Data from Azure App Configuration
    Key: TestApp:Settings:NewSetting, Value: New setting value
    
    Read-only status for TestApp:Settings:NewSetting: true
    
    Read-only status for TestApp:Settings:NewSetting: false
    
    Updated configuration setting:
    Key: TestApp:Settings:NewSetting, Value: Value has been updated!
    
    Deleted configuration setting:
    Key: TestApp:Settings:NewSetting, Value: Value has been updated!
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

This guide showed you how to use the Azure SDK for JavaScript to access key-values in Azure App Configuration.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration client library samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration/samples/v1/javascript)

To learn how to use Azure App Configuration with JavaScript apps, go to:

> [!div class="nextstepaction"]
> [Create a JavaScript app with Azure App Configuration](./quickstart-javascript-provider.md)
