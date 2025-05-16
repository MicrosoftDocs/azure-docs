---
title: Quickstart for using chat completion configuration in a .NET app
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your .NET application using Azure App Configuration.
services: azure-app-configuration
author: mgichohi
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.date: 4/19/2025
ms.author: mgichohi
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Use chat completion configuration in a .NET console app

In this quickstart you will create a .NET console app with dynamic configuration enabled that retrieves and updates chat completion settings without requiring application restarts.

## Prerequisites

- Complete the tutorial to [Create a chat completion configuration](./howto-chat-completion-config.md#create-a-chat-completion-configuration).
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download)

## Create a console app

1. Create a new folder for your project.

1. In the new folder, run the following command to create a new .NET console app project:
    ```bash
    dotnet new console
    ```

1. Install the  required Nuget packages in your project:

    ```bash
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Microsoft.Extensions.Configuration.Binder
    dotnet add package Azure.Identity
    dotnet add package Azure.AI.OpenAI --prerelease
    ```

1. Run the following command to restore packages for your project:
    ```bash
    dotnet restore
    ```

1. Open the _Program.cs_, and add the following namespaces at the top of the file:

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Azure.Identity;
    using Azure.AI.OpenAI;
    using OpenAI.Chat;

    ```

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the _Program.cs_ file.

    You can connect to App Configuration using **Microsoft Entra ID (recommended)**, or a connection string. In this example, you use Microsoft Entra ID, the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to enable your application to access App Configuration by assigning the **App Configuration Data Reader** role to the identity represented by `DefaultAzureCredential`.

    ```csharp
    var credential = new DefaultAzureCredential();

    IConfigurationRefresher _refresher = null;

    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");

            options.Connect(new Uri(endpoint), credential)
                    .Select("ChatLLM*")
                    .ConfigureRefresh(refresh =>
                    {
                        refresh.RegisterAll()
                               .SetRefreshInterval(TimeSpan.FromSeconds(10));
                    });

                _refresher = options.GetRefresher();
        }).Build();

    string modelEndpoint = configuration.GetSection("ChatLLM:Endpoint").Value;
    ```

1. Define the `ModelConfiguration` class in _Program.cs_ file:

    ```csharp
    public class ModelConfiguration
    {
        public string Model { get; set; }

        public float Temperature { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }

        public List<Message> Messages { get; set; }
    }

    public class Message
    {
        public string Role { get; set; }
        public string Content { get; set; }
    }
    ```

1. Create an instance of the `AzureOpenAIClient`. Use the existing instance of `DefaultAzureCredential` you created in the previous step to authenticate to your Azure OpenAI resource. Assign your identity the [Cognitive Services OpenAI User](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) role or [Cognitive Services OpenAI Contributor](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-contributor) role. For detailed steps, see [Role-based access control for Azure OpenAI service](/azure/ai-services/openai/how-to/role-based-access-control). Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    // Initialize the AzureOpenAIClient
    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(modelEndpoint), credential);
    ```

1. Alternatively, you can authenticate to your Azure OpenAI resource using an API key stored as a Key Vault reference in App Configuration with the key name "ChatLLM:ApiKey". Ensure to [grant your app access to Key Vault](./use-key-vault-references-dotnet-core.md#grant-your-app-access-to-key-vault). To read the Key Vault reference, update your configuration builder code in _Program.cs_ as follows:

    ```csharp
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");

            options.Connect(new Uri(endpoint), credential)
                .Select("ChatLLM*")
                .ConfigureKeyVault(keyVaultOptions =>
                {
                    keyVaultOptions.SetCredential(credential);
                })
                .ConfigureRefresh(refresh =>
                {
                    refresh.RegisterAll()
                            .SetRefreshInterval(TimeSpan.FromSeconds(10));
                });

                _refresher = options.GetRefresher();
        }).Build();

    string apiKey = configuration["ChatLLM:ApiKey"];

    // Initialize the AzureOpenAIClient with API key
    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(modelEndpoint), new AzureKeyCredential(apiKey));

    ```

1. Next, update the existing code in _Program.cs_ file to configure the chat completion options:

    ```csharp
    ...
    ChatClient chatClient = client.GetChatClient(modelConfig.Model);

    // Configure chat completion options
    ChatCompletionOptions options = new ChatCompletionOptions
    {
        Temperature = modelConfig.Temperature,
        MaxOutputTokenCount = modelConfig.MaxTokens,
        TopP = modelConfig.TopP
    };
    ```

1. Update the _Program.cs_ file to add a helper method `GetChatMessages` to process chat messages:

    ```csharp
    // Helper method to convert configuration messages to chat API format
    IEnumerable<ChatMessage> GetChatMessages(ModelConfiguration model)
    {
        var chatMessages = new List<ChatMessage>();

        foreach (Message message in model.Messages)
        {
            switch (message.Role)
            {
                case "system":
                    chatMessages.Add(ChatMessage.CreateSystemMessage(message.Content));
                    break;
                case "user":
                    chatMessages.Add(ChatMessage.CreateUserMessage(message.Content));
                    break;
            }
        }

        return chatMessages;
    }
    ```

1. Update the code in the _Program.cs_ file to call the helper method `GetChatMessages` and pass the ChatMessages to the `CompleteChatAsync` method:
    ```csharp
    ...

    // CompleteChatAsync method generates a completion for the given chat
    IEnumerable<ChatMessage> messages = GetChatMessages(modelConfig);

    ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

    Console.WriteLine("-------------------Model response--------------------------");
    Console.WriteLine(completion.Content[0].Text);
    Console.WriteLine("-----------------------------------------------------------");

    Console.ReadLine();
    Console.Clear();
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
            await _refresher.RefreshAsync();

            // Existing code
            //
            
            Console.WriteLine("-------------------Model response--------------------------");
            Console.WriteLine(completion.Content[0].Text);
            Console.WriteLine("-----------------------------------------------------------");

            Console.ReadLine();
            Console.Clear();
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

    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");

            options.Connect(new Uri(endpoint), credential)
                .Select("ChatLLM*")
                .ConfigureRefresh(refresh =>
                {
                    refresh.RegisterAll()
                            .SetRefreshInterval(TimeSpan.FromSeconds(10));
                });

            _refresher = options.GetRefresher();

        }).Build();

    string modelEndpoint = configuration.GetSection("ChatLLM:Endpoint").Value;

    // Initialize the AzureOpenAIClient
    AzureOpenAIClient client = new AzureOpenAIClient(new Uri(modelEndpoint), credential);

    while (true)
    {
        if (_refresher != null)
        {
            await _refresher.RefreshAsync();

            var modelConfig = configuration.GetSection("ChatLLM:Model").Get<ModelConfiguration>();
        
            ChatClient chatClient = client.GetChatClient(modelConfig.Model);

            // Configure chat completion options
            ChatCompletionOptions options = new ChatCompletionOptions
            {
                Temperature = modelConfig.Temperature,
                MaxOutputTokenCount = modelConfig.MaxTokens,
                TopP = modelConfig.TopP
            };

            IEnumerable<ChatMessage> messages = GetChatMessages(modelConfig);

            ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

            Console.WriteLine("-------------------Model response--------------------------");
            Console.WriteLine(completion.Content[0].Text);
            Console.WriteLine("-----------------------------------------------------------");

            Console.ReadLine();
            Console.Clear();
        }
    }

    IEnumerable<ChatMessage> GetChatMessages(ModelConfiguration model)
    {
        var chatMessages = new List<ChatMessage>();

        foreach (Message message in model.Messages)
        {
            switch (message.Role)
            {
                case "system":
                    chatMessages.Add(ChatMessage.CreateSystemMessage(message.Content));
                    break;
                case "user":
                    chatMessages.Add(ChatMessage.CreateUserMessage(message.Content));
                    break;
            }
        }

        return chatMessages;
    }

    public class ModelConfiguration
    {
        public string Model { get; set; }

        public float Temperature { get; set; }

        [ConfigurationKeyName("max_tokens")]
        public int MaxTokens { get; set; }

        [ConfigurationKeyName("top_p")]
        public float TopP { get; set; }

        public List<Message> Messages { get; set; }
    }

    public class Message
    {
        public string Role { get; set; }
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
    ``` bash
    dotnet build
    dotnet run
    ```

    You should see the following output:

    ```Output
    -------------------Model response--------------------------
    Of course! How can I assist you today?
    -----------------------------------------------------------

    ```

1. In Azure portal, select the App Configuration store instance that you created. From the **Operations** menu, select **Configuration explorer** and select the **ChatLLM:Model** key. Update the value of the Messages property:
    - For the first message:
        - Role: **system**
        - Content: "You are a historian who always speaks with a pirate accent".
    - Add a second message:
        - Role: **user**
        - Content: "Tell me about the Roman empire in 20 words"

1. Press the Enter key to trigger a refresh and you should see the updated value in the Command Prompt or Powershell window:

    ```Output
    -------------------Model response--------------------------
    Arrr, the Roman Empire be a mighty force, spanin' lands far 'n wide, with legions, emperors, roads, and grand gladiator games!
    -----------------------------------------------------------
    ```