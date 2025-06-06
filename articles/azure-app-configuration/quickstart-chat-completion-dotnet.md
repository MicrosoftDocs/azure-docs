---
title: Quickstart for using chat completion configuration in a .NET app
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your .NET application using Azure App Configuration.
services: azure-app-configuration
author: MaryanneNjeri
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.date: 4/19/2025
ms.author: mgichohi
ms.collection: ce-skilling-ai-copilot
---

# Use chat completion configuration in a .NET console app

In this guide, you build an AI chat application and iterate on the prompt using chat completion configuration dynamically loaded from Azure App Configuration.

## Prerequisites

- Complete the tutorial to [Create a chat completion configuration](./howto-chat-completion-config.md#create-a-chat-completion-configuration).
- [The latest .NET SDK](https://dotnet.microsoft.com/download)

## Create a console app

1. Create a new folder for your project. In the new folder, run the following command to create a new .NET console app project:

    ```dotnetcli
    dotnet new console
    ```

1. Install the following NuGet packages in your project:

    ```dotnetcli
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Microsoft.Extensions.Configuration.Binder
    dotnet add package Azure.Identity
    dotnet add package Azure.AI.OpenAI --prerelease
    ```

1. Open the _Program.cs_ file, and add the following namespaces at the top of the file:

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Azure.Identity;
    using Azure.AI.OpenAI;
    using OpenAI.Chat;
    ```

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the _Program.cs_ file.

    You can connect to App Configuration using either Microsoft Entra ID (recommended) or a connection string. In this example, you use Microsoft Entra ID with `DefaultAzureCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign the **App Configuration Data Reader** role to the identity represented by `DefaultAzureCredential`. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    var credential = new DefaultAzureCredential();

    IConfigurationRefresher _refresher = null;

    // Connect to Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");

            options.Connect(new Uri(endpoint), credential)
                   // Load all keys that start with `ChatApp:` and have no label.
                   .Select("ChatApp:*")
                   // Reload configuration if any selected key-values have changed.
                   // Use the default refresh interval of 30 seconds. It can be overridden via AzureAppConfigurationRefreshOptions.SetRefreshInterval.
                   .ConfigureRefresh(refresh =>
                   {
                       refresh.RegisterAll();
                   });

                _refresher = options.GetRefresher();
        }).Build();
    ```

1. Create an instance of the `AzureOpenAIClient` to connect to your Azure OpenAI resource. You can use either Microsoft Entra ID or API key for authentication.

    To access your Azure OpenAI resource with Microsoft Entra ID, you use `DefaultAzureCredential`. Assign the **Cognitive Services OpenAI User** role to the identity represented by `DefaultAzureCredential`. For detailed steps, refer to the [Role-based access control for Azure OpenAI service](/azure/ai-services/openai/how-to/role-based-access-control) guide. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    // Initialize the AzureOpenAIClient
    var openAIEndpoint = configuration["ChatApp:AzureOpenAI:Endpoint"];
    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(openAIEndpoint), credential);
    ```

    To access your Azure OpenAI resource with an API key, add the following code:

    ```csharp
    // Initialize the AzureOpenAIClient
    var apiKey = configuration["ChatApp:AzureOpenAI:ApiKey"];
    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(openAIEndpoint), new AzureKeyCredential(apiKey));
    ```

    If the key _ChatApp:AzureOpenAI:ApiKey_ is a Key Vault reference in App Configuration, make sure to add the following code snippet to the `AddAzureAppConfiguration` call and [grant your app access to Key Vault](./use-key-vault-references-dotnet-core.md#grant-your-app-access-to-key-vault).

    ```cshrap
    options.ConfigureKeyVault(keyVaultOptions =>
    {
        keyVaultOptions.SetCredential(credential);
    });
    ```

1. Define the `ModelConfiguration` class in _Program.cs_ file:

    ```csharp
    public class ModelConfiguration
    {
        [ConfigurationKeyName("model")]
        public string Model { get; set; }

        [ConfigurationKeyName("temperature")]
        public float Temperature { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }

        [ConfigurationKeyName("messages")]
        public List<Message> Messages { get; set; }
    }

    public class Message
    {
        [ConfigurationKeyName("role")]
        public string Role { get; set; }

        [ConfigurationKeyName("content")]
        public string Content { get; set; }
    }
    ```

1. Next, update the existing code in _Program.cs_ file to configure the chat completion options:

    ```csharp
    ...
    var modelConfiguration = configuration.GetSection("ChatApp:Model").Get<ModelConfiguration>();

    ChatClient chatClient = client.GetChatClient(modelConfiguration.Model);

    // Configure chat completion options
    ChatCompletionOptions options = new ChatCompletionOptions
    {
        Temperature = modelConfiguration.Temperature,
        MaxOutputTokenCount = modelConfiguration.MaxTokens,
        TopP = modelConfiguration.TopP
    };

    foreach (var message in modelConfiguration.Messages)
    {
        Console.WriteLine($"{message.Role}: {message.Content}");
    }
    ```

1. Update the _Program.cs_ file to add a helper method `GetChatMessages` to process chat messages:

    ```csharp
    // Helper method to convert configuration messages to chat API format
    IEnumerable<ChatMessage> GetChatMessages(ModelConfiguration modelConfiguration)
    {
        return modelConfiguration.Messages.Select<Message, ChatMessage>(message => message.Role switch
        {
            "system" => ChatMessage.CreateSystemMessage(message.Content),
            "user" => ChatMessage.CreateUserMessage(message.Content),
            "assistant" => ChatMessage.CreateAssistantMessage(message.Content)
        });
    }
    ```

1. Update the code in the _Program.cs_ file to call the helper method `GetChatMessages` and pass the ChatMessages to the `CompleteChatAsync` method:
    ```csharp
    ...

    // CompleteChatAsync method generates a completion for the given chat
    IEnumerable<ChatMessage> messages = GetChatMessages(modelConfiguration);

    ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

    Console.WriteLine($"AI response: {completion.Content[0].Text}");

    Console.WriteLine("Press Enter to continue...");
    Console.ReadLine();
    ...
    ```

1. Update the code in _Program.cs_ to refresh data from Azure App Configuration by calling `RefreshAsync()`:

    ```csharp
    ...
    // Existing code to initialize the AzureOpenAIClient
    //
    
    while (true)
    {
        if (_refresher != null)
        {
            // Refresh the configuration from Azure App Configuration
            await _refresher.RefreshAsync();

            // Existing code
            //
            
            Console.WriteLine($"AI response: {completion.Content[0].Text}");

            Console.WriteLine("Press Enter to continue...");
            Console.ReadLine();
        }
    }
    ```

1. After completing the previous steps, your _Program.cs_ file should now contain the complete implementation as shown below:

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Azure.Identity;
    using Azure.AI.OpenAI;
    using OpenAI.Chat;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;

    var credential = new DefaultAzureCredential();

    IConfigurationRefresher _refresher = null;

    // Connect to Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");

            options.Connect(new Uri(endpoint), credential)
                // Load all keys that start with `ChatApp:*` and have no label.
                .Select("ChatApp:*")
                // Reload configuration if any selected key-values have changed.
                // Use the default refresh interval of 30 seconds. It can be overridden via AzureAppConfigurationRefreshOptions.SetRefreshInterval.
                .ConfigureRefresh(refresh =>
                {
                    refresh.RegisterAll();
                });

            _refresher = options.GetRefresher();
        }).Build();

    // Initialize the AzureOpenAIClient
    var openAIEndpoint = configuration["ChatApp:AzureOpenAI:Endpoint"];

    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(openAIEndpoint), credential);

    while (true)
    {
        if (_refresher != null)
        {
            // Refresh the configuration from Azure App Configuration
            await _refresher.RefreshAsync();

            var modelConfiguration = configuration.GetSection("ChatApp:Model").Get<ModelConfiguration>();

            ChatClient chatClient = client.GetChatClient(modelConfiguration.Model);

            // Configure chat completion options
            ChatCompletionOptions options = new ChatCompletionOptions
            {
                Temperature = modelConfiguration.Temperature,
                MaxOutputTokenCount = modelConfiguration.MaxTokens,
                TopP = modelConfiguration.TopP
            };

            foreach (var message in modelConfiguration.Messages)
            {
                Console.WriteLine($"{message.Role}: {message.Content}");
            }

            // CompleteChatAsync method generates a completion for the given chat
            IEnumerable<ChatMessage> messages = GetChatMessages(modelConfiguration);

            ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

            Console.WriteLine($"AI response: {completion.Content[0].Text}");

            Console.WriteLine("Press Enter to continue...");
            Console.ReadLine();
        }
    }

    // Helper method to convert configuration messages to chat API format
    IEnumerable<ChatMessage> GetChatMessages(ModelConfiguration modelConfiguration)
    {
        return modelConfiguration.Messages.Select<Message, ChatMessage>(message => message.Role switch
        {
            "system" => ChatMessage.CreateSystemMessage(message.Content),
            "user" => ChatMessage.CreateUserMessage(message.Content),
            "assistant" => ChatMessage.CreateAssistantMessage(message.Content)
        });
    }

    public class ModelConfiguration
    {
        [ConfigurationKeyName("model")]
        public string Model { get; set; }

        [ConfigurationKeyName("temperature")]
        public float Temperature { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }

        [ConfigurationKeyName("messages")]
        public List<Message> Messages { get; set; }
    }

    public class Message
    {
        [ConfigurationKeyName("role")]
        public string Role { get; set; }

        [ConfigurationKeyName("content")]
        public string Content { get; set; }
    }
    ```

## Build and run the app locally

1. Set the environment variable named **AZURE_APPCONFIGURATION_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIGURATION_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:
    ```pwsh
    $Env:AZURE_APPCONFIGURATION_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux run the following command:
    ```
    export AZURE_APPCONFIGURATION_ENDPOINT ='<endpoint-of-your-app-configuration-store>'
    ```

1. After the environment variable is properly set, run the following command to run and build your app locally:
    ```dotnetcli
    dotnet build
    dotnet run
    ```

    You should see the following output:

    ```Output
    system: You are a helpful assistant.
    user: What is the capital of France ?
    AI response: The capital of France is **Paris**.
    Press Enter to continue...

    ```

1. In Azure portal, select the App Configuration store instance that you created. From the **Operations** menu, select **Configuration explorer** and select the **ChatLLM:Model** key. Update the value of the Messages property:
        - Role: **system**
        - Content: "You are a cheerful tour guide".

1. Press the Enter key to trigger a refresh and you should see the updated value in the Command Prompt or Powershell window:

    ```Output
    system: You are a cheerful tour guide
    user: What is the capital of France ?
    AI response: Oh là là! The capital of France is the magnificent **Paris**!
    Known as the "City of Light" (*La Ville Lumière*), it's famous for its romantic ambiance,
    iconic landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral,
    as well as its delicious pastries and charming cafés.
    Have you ever been, or is it on your travel bucket list? 😊✨
    Press Enter to continue...
    ```