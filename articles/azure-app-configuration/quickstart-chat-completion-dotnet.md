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
ms.update-cycle: 180-days
ms.author: mgichohi
ms.collection: ce-skilling-ai-copilot
---

# Use chat completion configuration in a .NET console app

In this guide, you build an AI chat application and iterate on the prompt using chat completion configuration dynamically loaded from Azure App Configuration. Full [sample source code](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore/ChatApp) available.

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
    dotnet add package Azure.AI.OpenAI
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
    TokenCredential credential = new DefaultAzureCredential();
    IConfigurationRefresher refresher = null;

    // Load configuration from Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT") ??
                throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIGURATION_ENDPOINT' is not set or is empty."));
            options.Connect(endpoint, credential)
                // Load all keys that start with "ChatApp:" and have no label.
                .Select("ChatApp:*")
                // Reload configuration if any selected key-values have changed.
                // Use the default refresh interval of 30 seconds. It can be overridden via refreshOptions.SetRefreshInterval.
                .ConfigureRefresh(refreshOptions =>
                {
                    refreshOptions.RegisterAll();
                });

            refresher = options.GetRefresher();
        })
        .Build();
    ```

1. Create an instance of the `AzureOpenAIClient` to connect to your Azure OpenAI resource. You can use either Microsoft Entra ID or API key for authentication.

    To access your Azure OpenAI resource with Microsoft Entra ID, you use `DefaultAzureCredential`. Assign the **Cognitive Services OpenAI User** role to the identity represented by `DefaultAzureCredential`. For detailed steps, refer to the [Role-based access control for Azure OpenAI service](/azure/ai-services/openai/how-to/role-based-access-control) guide. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    // Retrieve the OpenAI connection information from the configuration
    Uri openaiEndpoint = new(configuration["ChatApp:AzureOpenAI:Endpoint"]);
    string deploymentName = configuration["ChatApp:AzureOpenAI:DeploymentName"];

    // Initialize the AzureOpenAIClient
    AzureOpenAIClient azureClient = new(openaiEndpoint, credential);
    // Create a chat client
    ChatClient chatClient = azureClient.GetChatClient(deploymentName);
    ```

    To access your Azure OpenAI resource with an API key, add the following code:

    ```csharp
    // Initialize the AzureOpenAIClient
    var apiKey = configuration["ChatApp:AzureOpenAI:ApiKey"];
    AzureOpenAIClient client = new(openAIEndpoint, new AzureKeyCredential(apiKey));
    ```

    If the key _ChatApp:AzureOpenAI:ApiKey_ is a Key Vault reference in App Configuration, make sure to add the following code snippet to the `AddAzureAppConfiguration` call and [grant your app access to Key Vault](./use-key-vault-references-dotnet-core.md#grant-your-app-access-to-key-vault).

    ```csharp
    options.ConfigureKeyVault(keyVaultOptions =>
    {
        keyVaultOptions.SetCredential(credential);
    });
    ```

1. Define the `ChatCompletionConfiguration` class in _Program.cs_ file:

    ```csharp
    internal class ChatCompletionConfiguration
    {
        [ConfigurationKeyName("model")]
        public string? Model { get; set; }

        [ConfigurationKeyName("messages")]
        public List<Message>? Messages { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("temperature")]
        public float Temperature { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }
    }

    internal class Message
    {
        [ConfigurationKeyName("role")]
        public required string Role { get; set; }

        [ConfigurationKeyName("content")]
        public string? Content { get; set; }
    }
    ```

1. Update the _Program.cs_ file to add a helper method `GetChatMessages` to process chat messages:

    ```csharp
    // Helper method to convert configuration messages to ChatMessage objects
    static IEnumerable<ChatMessage> GetChatMessages(ChatCompletionConfiguration chatCompletionConfiguration)
    {
        return chatCompletionConfiguration.Messages.Select<Message, ChatMessage>(message => message.Role switch
        {
            "system" => ChatMessage.CreateSystemMessage(message.Content),
            "user" => ChatMessage.CreateUserMessage(message.Content),
            "assistant" => ChatMessage.CreateAssistantMessage(message.Content),
            _ => throw new ArgumentException($"Unknown role: {message.Role}", nameof(message.Role))
        });
    }
    ```

1. Next, update the existing code in the _Program.cs_ file to refresh the configuration from Azure App Configuration, apply the latest AI configuration values to the chat completion settings, and retrieve a response from the AI model.

    ```csharp
    while (true)
    {
        // Get user input
        Console.Write("You: ");
        string? userInput = Console.ReadLine();

        // Exit if user input is empty
        if (string.IsNullOrEmpty(userInput))
        {
            Console.WriteLine("Exiting chat. Goodbye!");
            break;
        }

        // Refresh the configuration from Azure App Configuration
        await refresher.RefreshAsync();

        // Configure chat completion with AI configuration
        var chatCompletionConfiguration = configuration.GetSection("ChatApp:ChatCompletion").Get<ChatCompletionConfiguration>();

        var requestOptions = new ChatCompletionOptions()
        {
            MaxOutputTokenCount = chatCompletionConfiguration.MaxTokens,
            Temperature = chatCompletionConfiguration.Temperature,
            TopP = chatCompletionConfiguration.TopP
        };

        chatConversation.Add(ChatMessage.CreateUserMessage(userInput));

        // Get latest system message from AI configuration
        var chatMessages = new List<ChatMessage>(GetChatMessages(chatCompletionConfiguration));
        chatMessages.AddRange(chatConversation);

        // Get AI response and add it to chat conversation
        var response = await chatClient.CompleteChatAsync(chatMessages, requestOptions);
        string aiResponse = response.Value.Content[0].Text;

        Console.WriteLine($"AI: {aiResponse}");
        chatConversation.Add(ChatMessage.CreateAssistantMessage(aiResponse));

        Console.WriteLine();
    }
    ```

1. After completing the previous steps, your _Program.cs_ file should now contain the complete implementation as shown below:

    ```csharp
    using Azure.AI.OpenAI;
    using Azure.Identity;
    using Azure.Core;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using OpenAI.Chat;

    TokenCredential credential = new DefaultAzureCredential();
    IConfigurationRefresher refresher = null;

    // Load configuration from Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT") ??
                throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIGURATION_ENDPOINT' is not set or is empty."));
            options.Connect(endpoint, credential)
                // Load all keys that start with "ChatApp:" and have no label.
                .Select("ChatApp:*")
                // Reload configuration if any selected key-values have changed.
                // Use the default refresh interval of 30 seconds. It can be overridden via refreshOptions.SetRefreshInterval.
                .ConfigureRefresh(refreshOptions =>
                {
                    refreshOptions.RegisterAll();
                });

            refresher = options.GetRefresher();
        })
        .Build();

    // Retrieve the OpenAI connection information from the configuration
    Uri openaiEndpoint = new(configuration["ChatApp:AzureOpenAI:Endpoint"]);
    string deploymentName = configuration["ChatApp:AzureOpenAI:DeploymentName"];

    // Create a chat client
    AzureOpenAIClient azureClient = new(openaiEndpoint, credential);
    ChatClient chatClient = azureClient.GetChatClient(deploymentName);

    // Initialize chat conversation
    var chatConversation = new List<ChatMessage>();
    Console.WriteLine("Chat started! What's on your mind?");

    while (true)
    {
        // Get user input
        Console.Write("You: ");
        string? userInput = Console.ReadLine();

        // Exit if user input is empty
        if (string.IsNullOrEmpty(userInput))
        {
            Console.WriteLine("Exiting chat. Goodbye!");
            break;
        }

        // Refresh the configuration from Azure App Configuration
        await refresher.RefreshAsync();

        // Configure chat completion with AI configuration
        var chatCompletionConfiguration = configuration.GetSection("ChatApp:ChatCompletion").Get<ChatCompletionConfiguration>();
        var requestOptions = new ChatCompletionOptions()
        {
            MaxOutputTokenCount = chatCompletionConfiguration.MaxTokens,
            Temperature = chatCompletionConfiguration.Temperature,
            TopP = chatCompletionConfiguration.TopP
        };

        chatConversation.Add(ChatMessage.CreateUserMessage(userInput));

        // Get latest system message from AI configuration
        var chatMessages = new List<ChatMessage>(GetChatMessages(chatCompletionConfiguration));
        chatMessages.AddRange(chatConversation);

        // Get AI response and add it to chat conversation
        var response = await chatClient.CompleteChatAsync(chatMessages, requestOptions);
        string aiResponse = response.Value.Content[0].Text;

        Console.WriteLine($"AI: {aiResponse}");
        chatConversation.Add(ChatMessage.CreateAssistantMessage(aiResponse));

        Console.WriteLine();
    }

    // Helper method to convert configuration messages to ChatMessage objects
    static IEnumerable<ChatMessage> GetChatMessages(ChatCompletionConfiguration chatCompletionConfiguration)
    {
        return chatCompletionConfiguration.Messages.Select<Message, ChatMessage>(message => message.Role switch
        {
            "system" => ChatMessage.CreateSystemMessage(message.Content),
            "user" => ChatMessage.CreateUserMessage(message.Content),
            "assistant" => ChatMessage.CreateAssistantMessage(message.Content),
            _ => throw new ArgumentException($"Unknown role: {message.Role}", nameof(message.Role))
        });
    }

    internal class ChatCompletionConfiguration
    {
        [ConfigurationKeyName("model")]
        public string? Model { get; set; }

        [ConfigurationKeyName("messages")]
        public List<Message>? Messages { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("temperature")]
        public float Temperature { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }
    }

    internal class Message
    {
        [ConfigurationKeyName("role")]
        public required string Role { get; set; }

        [ConfigurationKeyName("content")]
        public string? Content { get; set; }
    }
    ```

## Build and run the app

1. Set the environment variable named **AZURE_APPCONFIGURATION_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIGURATION_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:
    ```powershell
    $Env:AZURE_APPCONFIGURATION_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux run the following command:
    ```bash
    export AZURE_APPCONFIGURATION_ENDPOINT ='<endpoint-of-your-app-configuration-store>'
    ```

1.  After the environment variable is properly set, run the following command to build and run your app.
    ```dotnetcli
    dotnet run
    ```

    You should see the following output:

    ```Output
    Chat started! What's on your mind?
    ```

1. In Azure portal, select the App Configuration store instance that you created. From the **Operations** menu, select **Configuration explorer** and select the **ChatApp:ChatCompletion** key. Update the value of the Messages property:
    - Role: **system**
    - Content: "You are a pirate and your name is Eddy."

1. Type your message when prompted with "You:". Be sure to wait a few moments for the refresh interval to elapse, and then press the Enter key to see the updated AI response in the output.

    ```Output
    Chat started! What's on your mind?
    You: Hello, what is your name ?
    AI: Ahoy, matey! Me name be Captain Eddy, the most fearsome pirate to ever sail the seven seas! What be yer name, landlubber?
    ```