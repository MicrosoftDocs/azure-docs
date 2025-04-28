---
title: Quickstart for adding chat completion configuration to .NET apps
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your .NET application using Azure App Configuration.
services: azure-app-configuration
author: mgichohi-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.date: 4/19/2025
ms.author: mgichohi
---

## Quickstart: Add chat completion configuration to a .NET console

In this quickstart, you will use the [Azure App Configuration .NET provider](https://github.com/Azure/AppConfiguration-DotnetProvider) in a .NET console application to centralize the storage and management of your chat completion configuration.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Azure OpenAI access](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#how-do-i-get-access-to-azure-openai)
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download)

## Create a console app

You can use  the .NET command-line interface(CLI) to create a new .NET console app project. The advantage of using the .NET CLI over Visual Studio is that it's available across the Windows, macOS and Linux platforms.

1. Create a new directory for the project named *app-config-chat-completion*:

    ```console
    mkdir app-config-chat-completion
    ```
1. Switch to the newly created *app-config-chat-completion* directory:

    ```console
    cd app-config-chat-completion
    ```

1. Run the following command to create a new .NET console app project:
    ```bash
    dotnet new console
    ```

1. Install the  required Nuget packages in your project:

    ```bash
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Azure.Identity

    # Install the Azure OpenAI client library
    dotnet add package Azure.AI.OpenAI --prerelease
    ```

1. Run the following command to restore packages for your project:
    ```bash
    dotnet restore
    ```

1. Open the _Program.cs_, and add the following namespaces at the top of the file:

    ```csharp
        using Microsoft.Extensions.Configuration;
        using Azure.Identity;
        using Azure.AI.OpenAI;
        using OpenAI.Chat;
    ```

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the _Program.cs_ file.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
        var credential = new DefaultAzureCredential();

        IConfiguration configuration = new ConfigurationBuilder()
            .AddAzureAppConfiguration(options =>
            {
                string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIG_ENDPOINT");

                options.Connect(new Uri(endpoint), credential);
            }).Build();`

        var model = configuration.GetSection("ChatLLM")["model"];
        string modelEndpoint = configuration.GetSection("ChatLLM:Endpoint").Value;

        Console.WriteLine($"Hello, I am your AI assistant powered by Azure App Configuration ({model})");
    ```

    ### [Connection string](#tab/connection-string)
    ```csharp
        IConfiguration configuration = new ConfigurationBuilder()
            .AddAzureAppConfiguration(Environment.GetEnvironmentVariable("ConnectionString"));
        
        var model = configuration.GetSection("ChatLLM")["model"];
        string modelEndpoint = configuration.GetSection("ChatLLM:Endpoint").Value;

        Console.WriteLine($"Hello, I am your AI assistant powered by Azure App Configuration ({model})");
    ```
    ---

1. Create an instance of the `AzureOpenAIClient`. Use the existing instance of `DefaultAzureCredential` we created in the previous step to authenticate to your Azure OpenAI resource. Assign your credential the [Cognitive Services OpenAI User](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) or [Cognitive Services OpenAI Contributor](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-contributor). For detailed steps, see [Role-based access control for Azure OpenAI service](../azure/ai-services/openai/how-to/role-based-access-control). Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
        // Existing code to connect to your App configuration store
        // ...

        // Initialize the AzureOpenAIClient
        AzureOpenAIClient client = new AzureOpenAIClient(new Uri(modelEndpoint), credential);
        ChatClient chatClient = client.GetChatClient(model);

    ```

1. Next will update the existing code in _Program.cs_ file to configure the chat completion options:
    ```csharp
        ...
        // Existing code to initialize the AzureOpenAIClient

        // Configure chat completion options
        ChatCompletionOptions options = new ChatCompletionOptions
        {
            Temperature = float.Parse(configuration.GetSection("ChatLLM")["temperature"]),
            MaxOutputTokenCount = int.Parse(configuration.GetSection("ChatLLM")["max_tokens"]),
            TopP = float.Parse(configuration.GetSection("ChatLLM")["top_p"])
        };
        
    ```

1. Update the _Program.cs_ file to add a helper method `GetChatMessages` to process chat messages:
    ```csharp
        // Helper method to convert configuration messages to chat API format
        IEnumerable<ChatMessage> GetChatMessages()
        {
            var chatMessages = new List<ChatMessage>();

            foreach (IConfiguration configuration in configuration.GetSection("ChatLLM:messages").GetChildren())
            {
                switch (configuration["role"])
                {
                    case "system":
                        chatMessages.Add(ChatMessage.CreateSystemMessage(configuration["content"]));
                        break;
                    case "user":
                        chatMessages.Add(ChatMessage.CreateUserMessage(configuration["content"]));
                        break;
                }
            }

            return chatMessages;
        }
    ```

1. Update the code in the _Program.cs_ file to call the helper method `GetChatMessages` and pass the ChatMessages to the `CompleteChatAsync` method:
    ```csharp
        ...
        // Existing code to configure chat completion options
        //
        IEnumerable<ChatMessage> messages = GetChatMessages();

        // CompleteChatAsync method generates a completion for the given chat
        ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

        Console.WriteLine("-------------------Model response--------------------------");
        Console.WriteLine(completion.Content[0].Text);
        Console.WriteLine("-----------------------------------------------------------");
        ...
    ```

1. After completing the previous steps, your _Program.cs_ file should now contain the complete implementation as shown below:
    ```c#
        using Microsoft.Extensions.Configuration;
        using Azure.Identity;
        using Azure.AI.OpenAI;
        using OpenAI.Chat;

        var credential = new DefaultAzureCredential();

        IConfiguration configuration = new ConfigurationBuilder()
            .AddAzureAppConfiguration(options =>
            {
                string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIG_ENDPOINT");

                options.Connect(new Uri(endpoint), credential);

            }).Build();

        var model = configuration.GetSection("ChatLLM")["model"];
        string modelEndpoint = configuration.GetSection("ChatLLM:Endpoint").Value;

        // Initialize the AzureOpenAIClient
        AzureOpenAIClient client = new AzureOpenAIClient(new Uri(modelEndpoint), credential);
        ChatClient chatClient = client.GetChatClient(model);

        // Configure chat completion options
        ChatCompletionOptions options = new ChatCompletionOptions
        {
            Temperature = float.Parse(configuration.GetSection("ChatLLM")["temperature"]),
            MaxOutputTokenCount = int.Parse(configuration.GetSection("ChatLLM")["max_tokens"]),
            TopP = float.Parse(configuration.GetSection("ChatLLM")["top_p"])
        };
            
        IEnumerable<ChatMessage> messages = GetChatMessages();

        ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);
        Console.WriteLine($"Hello, I am your AI assistant powered by Azure App Configuration ({model})");

        Console.WriteLine("-------------------Model response--------------------------");
        Console.WriteLine(completion.Content[0].Text);
        Console.WriteLine("-----------------------------------------------------------");

        IEnumerable<ChatMessage> GetChatMessages()
        {
            var chatMessages = new List<ChatMessage>();

            foreach (IConfiguration configuration in configuration.GetSection("ChatLLM:messages").GetChildren())
            {
                switch (configuration["role"])
                {
                    case "system":
                        chatMessages.Add(ChatMessage.CreateSystemMessage(configuration["content"]));
                        break;
                    case "user":
                        chatMessages.Add(ChatMessage.CreateUserMessage(configuration["content"]));
                        break;
                }
            }

            return chatMessages;
        }
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

1. After the environment variable is properly set, run the following command to run and build your app locally:
    ``` bash
    dotnet build
    dotnet run
    ```

    You should see the following output:

    ```Output
    Hello, I am your AI assistant powered by Azure App Configuration (gpt-4o)

    -------------------Model response--------------------------
    Azure App Configuration is a managed service for centralizing and managing application settings and feature flags across cloud environments.
    -----------------------------------------------------------
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]