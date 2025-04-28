---
title: Quickstart for adding chat completion configuration to Python apps
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your Python application using Azure App Configuration.
services: azure-app-configuration
author: mgichohi-ms
ms.service: azure-app-configuration
ms.devlang: python
ms.custom: devx-track-python, mode-other
ms.topic: quickstart
ms.tgt_pltfrm: Python
ms.date: 4/19/2025
ms.author: mgichohi
---

## Quickstart: Add chat completion configuration to a Python app

In this quickstart, you will use the [Azure App Configuration Python provider client library](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider) in a python application to centralize the storage and management of your chat completion configuration.

## Prerequisites

- An Azure account with an active subscription - [Create one for free](https://azure.microsoft.com/free/)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)
- [Azure OpenAI access](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#how-do-i-get-access-to-azure-openai)

# Create a python app

1. Create a new directory for the project named *app-config-chat-completion*:

    ```console
    mkdir app-config-chat-completion
    ```

1. Switch to the newly created *app-config-chat-completion* directory:

    ```console
    cd app-config-chat-completion
    ```

1. Install the required packages:

    ```console
    pip install azure-appconfiguration-provider
    pip install azure-identity
    pip install openai
    ```

1. Create a new file called *app.py* in the *app-config-chat-completion* directory and import the required packages:

    ```py
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
    from openai import AzureOpenAI 
    import os
    ```

1. Connect to your App Configuration store by calling the `load` method in the `app.py` file.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
    from openai import AzureOpenAI 
    import os

    endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT")

    # Connect to Azure App Configuration using Microsoft Entra ID.
    credential = DefaultAzureCredential()
    config = load(endpoint=endpoint, credential=credential)

    model = config["ChatLLM"]
    model_endpoint = config["ChatLLM:Endpoint"]
    api_version = config["ChatLLM:ApiVersion"]

    print(f"Hello am your AI assistant powered by Azure App Configuration ({model['model']})")
    ```
    
    ### [Connection string](#tab/connection-string)
    ```python
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    import os

    connection_string = os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING")

    # Connect to Azure App Configuration using a connection string.
    config = load(connection_string=connection_string)

    model = config["ChatLLM"]
    model_endpoint = config["ChatLLM:Endpoint"]
    api_version = config["ChatLLM:ApiVersion"]

    print(f"Hello, I am your AI assistant powered by Azure App Configuration ({model['model']})")
    ```
    
1. Create an instance of the `AzureOpenAI` client. Use the existing instance of `DefaultAzureCredential` we created in the previous step to authenticate to your Azure OpenAI resource. Assign your credential the [Cognitive Services OpenAI User](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) or [Cognitive Services OpenAI Contributor](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-contributor). For detailed steps, see [Role-based access control for Azure OpenAI service](../azure/ai-services/openai/how-to/role-based-access-control). Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    # Existing code to connect to your App Configuration store
    # ...

    # Use existing instance of credential created in the previous step
    # The get_bearer_token_provider returns a callback that provides a bearer token
    token_provider = get_bearer_token_provider(
        credential,
        "https://cognitiveservices.azure.com/.default"  
    )

    # Initialize Azure OpenAI Service client
    client = AzureOpenAI(
        azure_ad_token_provider = token_provider,
        azure_endpoint = model_endpoint,
        api_version = api_version
    )
    ```

1. Next we'll update the existing code in _app.py_ file to configure the chat completion options based on the settings from App Configuration:

    ```python
    # Existing code

    # Initialize Azure OpenAI Service client
    client = AzureOpenAI(
        azure_ad_token_provider = token_provider,
        azure_endpoint = model_endpoint,
        api_version = api_version
    )

    completion = client.chat.completions.create(
        model = model['model'],
        messages = model['messages'],
        max_tokens = model['max_tokens'],
        temperature = model['temperature'],
        top_p = model['top_p']
    )
    
    print("------------------Model response--------------------------")
    print(completion.choices[0].message.content)
    print("----------------------------------------------------------")
    ```

1. After completing the previous steps, your _app.py_ file should now contain the complete implementation as shown below:

    ```python
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
    from openai import AzureOpenAI
    import os

    endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT")
    
    # Connect to Azure App Configuration using Microsoft Entra ID.
    credential = DefaultAzureCredential()
    config = load(endpoint=endpoint, credential=credential)

    model = config["ChatLLM"]
    model_endpoint = config["ChatLLM:Endpoint"]
    api_version = config["ChatLLM:ApiVersion"]

    print(f"Hello, I am your AI assistant powered by Azure App Configuration ({model['model']})")

    # Use existing instance of credential created in the previous step
    # The get_bearer_token_provider returns a callback that provides a bearer token
    token_provider = get_bearer_token_provider(
        credential,
        "https://cognitiveservices.azure.com/.default"  
    )

    # Initialize Azure OpenAI Service client
    client = AzureOpenAI(
        azure_ad_token_provider = token_provider,
        azure_endpoint = model_endpoint,
        api_version = api_version
    )

    completion = client.chat.completions.create(
        model = model['model'],
        messages = model['messages'],
        max_tokens = model['max_tokens'],
        temperature = model['temperature'],
        top_p = model['top_p']
    )

    print("------------------Model response--------------------------")
    print(completion.choices[0].message.content)
    print("----------------------------------------------------------")
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
    export AZURE_APPCONFIG_ENDPOINT ='<endpoint-of-your-app-configuration-store>'
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
    ```bash
    python app.py
    ```
    You should see the following output:

    ```Output
    Hello, I am your AI assistant powered by Azure App Configuration (gpt-4o)
    ------------------Model response--------------------------
    Azure App Configuration is a managed service for centralizing and managing application settings and feature flags across cloud environments.
    ----------------------------------------------------------
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]