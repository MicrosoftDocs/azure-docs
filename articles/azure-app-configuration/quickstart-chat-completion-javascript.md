---
title: Quickstart for adding chat completion configuration to Javascript apps
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your Javascript application using Azure App Configuration.
services: azure-app-configuration
author: mgichohi-ms
ms.service: azure-app-configuration
ms.devlang: javascript
ms.custom: devx-track-javascript, mode-other
ms.topic: quickstart
ms.tgt_pltfrm: Javascript
ms.date: 4/19/2025
ms.author: mgichohi
---

## Quickstart: Add chat completion configuration to a Node.js console app

In this quickstart, you will use the [Azure App Configuration JavaScript provider client library](https://github.com/Azure/AppConfiguration-JavaScriptProvider) in a Node js console application to centralize the storage and management of your chat completion configuration.

## Prerequisites

- An Azure account with an active subscription - [Create one for free](https://azure.microsoft.com/free/)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule). For information about installing Node.js either directly on Windows or using the Windows Subsystem for Linux (WSL), see [Get started with Node.js](/windows/dev-environment/javascript/nodejs-overview)
- [Azure OpenAI access](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#how-do-i-get-access-to-azure-openai)

## Create a Node.js console app

1. Create a new directory for the project named *app-config-chat-completion*:

    ```console
    mkdir app-config-chat-completion
    ```

1. Switch to the newly created *app-config-chat-completion* directory:

    ```console
    cd app-config-chat-completion
    ```

1. Install the required npm packages:

    ```console
    npm install @azure/app-configuration-provider
    npm install openai @azure/openai
    npm install --save @azure/identity
    ```

1. Create a file named app.js in the *app-config-chat-completion* directory and import the required packages:
    ```javascript
    const { load } = require("@azure/app-configuration-provider");
    const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity");
    const { AzureOpenAI } = require("openai");

    const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
    ```

1. Connect to your App Configuration store by calling the `load` method in the `app.js` file.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```javascript
    const { load } = require("@azure/app-configuration-provider");
    const { DefaultAzureCredential, getBearerTokenProvider  } = require("@azure/identity");
    const { AzureOpenAI } = require("openai");

    const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
    
    async function run() {
        const credential = new DefaultAzureCredential();

        // Connect to Azure App Configuration using Microsoft Entra ID.
        const settings = await load(endpoint, credential);

        const model = settings.get("ChatLLM");
        const modelEndpoint = settings.get("ChatLLM:Endpoint");
        const apiVersion = settings.get("ChatLLM:ApiVersion");

        console.log(`Hello, am your AI assistant powered by Azure App Configuration (${model["model"]})`);
    }
    ```

    ### [Connection string](#tab/connection-string)
    ```javascript
    const { load } = require("@azure/app-configuration-provider");
    const { AzureOpenAI } = require("openai");

    const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

    async function run() {
        // Connect to Azure App Configuration using a connection string.
        const settings = await load(connectionString);

        const model = settings.get("ChatLLM");
        const modelEndpoint = settings.get("ChatLLM:Endpoint");
        const apiVersion = settings.get("ChatLLM:ApiVersion");

        console.log(`Hello, am your AI assistant powered by Azure App Configuration (${model["model"]})`);
    }
    ```
    ---

1. Create an instance of the `AzureOpenAI` client. Use the existing instance of `DefaultAzureCredential` we created in the previous step to authenticate to your Azure OpenAI resource. Assign your credential the [Cognitive Services OpenAI User](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) or [Cognitive Services OpenAI Contributor](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-contributor). For detailed steps, see [Role-based access control for Azure OpenAI service](../azure/ai-services/openai/how-to/role-based-access-control). Be sure to allow sufficient time for the permission to propagate before running your application.

    ```javascript
    // Existing code to connect to your App configuration store
    //...

    // Use existing instance of credential, created in the previous step
    // The getBearerTokenProvider returns a callback that provides a bearer token
    const azureADTokenProvider = getBearerTokenProvider(credential, "https://cognitiveservices.azure.com/.default");

    // Initialize AzureOpenAI client
    const client = new AzureOpenAI({
        azureADTokenProvider: azureADTokenProvider,
        endpoint: modelEndpoint,
        deployment: model["model"],
        apiVersion: apiVersion
    });
    ```

1. Next will update the existing code in _app.js_ file to configure the chat completion options:
    ```javascript
    // Existing code to initialize the AzureOpenAIClient
    const client = new AzureOpenAI({
        azureADTokenProvider: azureADTokenProvider,
        endpoint: modelEndpoint,
        deployment: model["model"],
        apiVersion: apiVersion
    });

    // Configure chat completion options
    const result = await client.chat.completions.create({
        messages: model["messages"],
        max_tokens: model["max_tokens"],
        temperature: model["temperature"],
        top_p: model["top_p"]
    });

    console.log("--------------------Model response------------------------");
    console.log(result.choices[0].message.content);
    console.log("----------------------------------------------------------");
    ```

1. After completing the previous steps, your _app.js_file should now contain the complete implementation as shown below:

    ```javascript
    const { load } = require("@azure/app-configuration-provider");
    const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity");
    const { AzureOpenAI } = require("openai");

    const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;

    async function run(){
        const credential = new DefaultAzureCredential();

        // Connect to Azure App Configuration using Microsoft Entra ID.
        const settings = await load(endpoint, credential);

        const model = settings.get("ChatLLM");
        const modelEndpoint = settings.get("ChatLLM:Endpoint");
        const apiVersion = settings.get("ChatLLM:ApiVersion");

        console.log(`Hello, am your AI assistant powered by Azure App Configuration (${model["model"]})`);

        // Use existing instance of credential, created in the previous step
        // The getBearerTokenProvider returns a callback that provides a bearer token
        const azureADTokenProvider = getBearerTokenProvider(credential, "https://cognitiveservices.azure.com/.default");

        // Initialize AzureOpenAI client
        const client = new AzureOpenAI({
            azureADTokenProvider: azureADTokenProvider,
            endpoint: modelEndpoint,
            deployment: model["model"],
            apiVersion: apiVersion
        });

        // Configure chat completion options
        const result = await client.chat.completions.create({
            messages: model["messages"],
            max_tokens: model["max_tokens"],
            temperature: model["temperature"],
            top_p: model["top_p"]
        });

        console.log("--------------------Model response------------------------");
        console.log(result.choices[0].message.content);
        console.log("----------------------------------------------------------");
    }

    run().catch(console.error);
    ```

## Build and run the app locally

1. Set the environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```
    If you use PowerShell, run the following command:
    ```pwsh
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```
    If you use macOS or Linux run the following command:
    ```
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```
    
    ### [Connection string](#tab/connection-string)
    Set the environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access keys* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```pwsh
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. After the environment variable is properly set, run the following command to run the app locally:
    ``` bash
    node app.js
    ```

    You should see the following output:

    ```Output
    Hello, am your AI assistant powered by Azure App Configuration (gpt-4o)

    --------------------Model response------------------------
    Azure App Configuration is a managed service for centralizing and managing application settings and feature flags across cloud and on-premises environments.
    ----------------------------------------------------------
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]