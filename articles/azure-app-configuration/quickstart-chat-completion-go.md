---
title: Quickstart for using chat completion configuration in a Go app
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your Go application using Azure App Configuration.
services: azure-app-configuration
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.custom: devx-track-go, mode-other
ms.topic: quickstart
ms.tgt_pltfrm: Go
ms.date: 11/21/2025
ms.update-cycle: 180-days
ms.author: linglingye
ms.collection: ce-skilling-ai-copilot
---

# Use chat completion configuration in a Go console app

In this guide, you build an AI chat application and iterate on the prompt using chat completion configuration dynamically loaded from Azure App Configuration. 

The full sample source code is available in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/Go/ChatApp).

## Prerequisites

- Complete the tutorial to [Create a chat completion configuration](./howto-chat-completion-config.md#create-a-chat-completion-configuration).
- Go 1.21 or later. [Install Go](https://golang.org/doc/install).

## Create a console app

1. Create a new directory for your project and navigate to it:

    ```bash
    mkdir chatapp-quickstart
    cd chatapp-quickstart
    ```

1. Initialize a new Go module:

    ```bash
    go mod init chatapp-quickstart
    ```

1. Install the required Go packages:

    ```bash
    go get github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/openai/openai-go
    ```

1. Create a file named `main.go` and add the following import statements:

    ```golang
    package main

    import (
        "bufio"
        "context"
        "fmt"
        "log"
        "os"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        openai "github.com/openai/openai-go"
        "github.com/openai/openai-go/azure"
    )
    ```

1. Define the configuration structures and create a global credential variable:

    ```golang
    type AIConfig struct {
        ChatCompletion ChatCompletion
        AzureOpenAI    AzureOpenAI
    }

    type ChatCompletion struct {
        Model       string    `json:"model"`
        Messages    []Message `json:"messages"`
        MaxTokens   int64     `json:"max_tokens"`
        Temperature float64   `json:"temperature"`
        TopP        float64   `json:"top_p"`
    }

    type AzureOpenAI struct {
        Endpoint   string
        APIVersion string
        APIKey     string
    }

    type Message struct {
        Role    string `json:"role"`
        Content string `json:"content"`
    }

    var aiConfig AIConfig
    var tokenCredential, _ = azidentity.NewDefaultAzureCredential(nil)
    ```

1. Create a function to load configuration from Azure App Configuration. 

    You can connect to App Configuration using either Microsoft Entra ID (recommended) or a connection string. In this example, you use Microsoft Entra ID with `DefaultAzureCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign the **App Configuration Data Reader** role to the identity represented by `DefaultAzureCredential`. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```golang
    // Load configuration from Azure App Configuration
    func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
        endpoint := os.Getenv("AZURE_APPCONFIGURATION_ENDPOINT")
        if endpoint == "" {
            return nil, fmt.Errorf("AZURE_APPCONFIGURATION_ENDPOINT environment variable is not set")
        }

        authOptions := azureappconfiguration.AuthenticationOptions{
            Endpoint:   endpoint,
            Credential: tokenCredential,
        }

        options := &azureappconfiguration.Options{
            Selectors: []azureappconfiguration.Selector{
                // Load all keys that start with "ChatApp:" and have no label
                {
                    KeyFilter: "ChatApp:*",
                },
            },
            TrimKeyPrefixes: []string{"ChatApp:"},
            // Reload configuration if any selected key-values have changed.
            // Use the default refresh interval of 30 seconds. It can be overridden via RefreshOptions.Interval
            RefreshOptions: azureappconfiguration.KeyValueRefreshOptions{
                Enabled:  true,
            },
            KeyVaultOptions: azureappconfiguration.KeyVaultOptions{
                Credential: tokenCredential,
            },
        }

        return azureappconfiguration.Load(ctx, authOptions, options)
    }
    ```

1. Create the main function that configures chat completion with AI configuration and registers a callback to refresh AI configuration on changes.

    ```golang
    func main() {
        configProvider, err := loadAzureAppConfiguration(context.Background())
        if err != nil {
            log.Fatal("Error loading Azure App Configuration:", err)
        }

        // Configure chat completion with AI configuration
        configProvider.Unmarshal(&aiConfig, &azureappconfiguration.ConstructionOptions{Separator: ":"})

        // Register a callback to refresh AI configuration on changes
        configProvider.OnRefreshSuccess(func() {
            configProvider.Unmarshal(&aiConfig, &azureappconfiguration.ConstructionOptions{Separator: ":"})
        })
    }
    ```

1. Create an instance of the `AzureOpenAIClient` to connect to your Azure OpenAI resource. You can use either Microsoft Entra ID or API key for authentication.

    To access your Azure OpenAI resource with Microsoft Entra ID, you use `DefaultAzureCredential`. Assign the **Cognitive Services OpenAI User** role to the identity represented by `DefaultAzureCredential`. For detailed steps, refer to the [Role-based access control for Azure OpenAI service](/azure/ai-services/openai/how-to/role-based-access-control) guide. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```golang
    openAIClient := openai.NewClient(azure.WithEndpoint(aiConfig.AzureOpenAI.Endpoint, aiConfig.AzureOpenAI.APIVersion), azure.WithTokenCredential(tokenCredential))
    ```

    To access your Azure OpenAI resource with an API key, add the following code. If the key _ChatApp:AzureOpenAI:ApiKey_ is a Key Vault reference in App Configuration, make sure to [grant your app access to Key Vault](./use-key-vault-references-dotnet-core.md#grant-your-app-access-to-key-vault).

    ```golang
    openAIClient := openai.NewClient(azure.WithAPIKey(aiConfig.AzureOpenAI.APIKey), azure.WithEndpoint(aiConfig.AzureOpenAI.Endpoint, aiConfig.AzureOpenAI.APIVersion))
    ```

1. Create a function to get AI responses from the OpenAI client:

    ```golang
    func getAIResponse(openAIClient openai.Client, chatConversation []openai.ChatCompletionMessageParamUnion) (string, error) {
        var completionMessages []openai.ChatCompletionMessageParamUnion

        for _, msg := range aiConfig.ChatCompletion.Messages {
            switch msg.Role {
            case "system":
                completionMessages = append(completionMessages, openai.SystemMessage(msg.Content))
            case "user":
                completionMessages = append(completionMessages, openai.UserMessage(msg.Content))
            case "assistant":
                completionMessages = append(completionMessages, openai.AssistantMessage(msg.Content))
            }
        }

        // Add the chat conversation history
        completionMessages = append(completionMessages, chatConversation...)

        // Create chat completion parameters
        params := openai.ChatCompletionNewParams{
            Messages:    completionMessages,
            Model:       aiConfig.ChatCompletion.Model,
            MaxTokens:   openai.Int(aiConfig.ChatCompletion.MaxTokens),
            Temperature: openai.Float(aiConfig.ChatCompletion.Temperature),
            TopP:        openai.Float(aiConfig.ChatCompletion.TopP),
        }

        if completion, err := openAIClient.Chat.Completions.New(context.Background(), params); err != nil {
            return "", err
        } else {
            return completion.Choices[0].Message.Content, nil
        }
    }
    ```

1. Next, update the main function to add the chat loop:

    ```golang
    func main() {
        // ...Existing code...

        // Initialize chat conversation
        var chatConversation []openai.ChatCompletionMessageParamUnion
        fmt.Println("Chat started! What's on your mind?")
        reader := bufio.NewReader(os.Stdin)

        for {
            // Refresh the configuration from Azure App Configuration
            configProvider.Refresh(context.Background())

            // Get user input
            fmt.Print("You: ")
            userInput, _ := reader.ReadString('\n')

            // Exit if user input is empty
            if userInput == "" {
                fmt.Println("Exiting Chat. Goodbye!")
                break
            }

            // Add user message to chat conversation
            chatConversation = append(chatConversation, openai.UserMessage(userInput))

            // Get AI response and add it to chat conversation
            response, _ := getAIResponse(openAIClient, chatConversation)
            fmt.Printf("AI: %s\n", response)
            chatConversation = append(chatConversation, openai.AssistantMessage(response))

            fmt.Println()
        }
    }
    ```

1. After completing the previous steps, your `main.go` file should now contain the complete implementation as shown below:

    ```golang
    package main

    import (
        "bufio"
        "context"
        "fmt"
        "log"
        "os"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        openai "github.com/openai/openai-go"
        "github.com/openai/openai-go/azure"
    )

    type AIConfig struct {
        ChatCompletion ChatCompletion
        AzureOpenAI    AzureOpenAI
    }

    type ChatCompletion struct {
        Model       string    `json:"model"`
        Messages    []Message `json:"messages"`
        MaxTokens   int64     `json:"max_tokens"`
        Temperature float64   `json:"temperature"`
        TopP        float64   `json:"top_p"`
    }

    type AzureOpenAI struct {
        Endpoint   string
        APIVersion string
        APIKey     string
    }

    type Message struct {
        Role    string `json:"role"`
        Content string `json:"content"`
    }

    var aiConfig AIConfig
    var tokenCredential, _ = azidentity.NewDefaultAzureCredential(nil)

    func main() {
        configProvider, err := loadAzureAppConfiguration(context.Background())
        if err != nil {
            log.Fatal("Error loading Azure App Configuration:", err)
        }

        // Configure chat completion with AI configuration
        configProvider.Unmarshal(&aiConfig, &azureappconfiguration.ConstructionOptions{Separator: ":"})

        // Register a callback to refresh AI configuration on changes
        configProvider.OnRefreshSuccess(func() {
            configProvider.Unmarshal(&aiConfig, &azureappconfiguration.ConstructionOptions{Separator: ":"})
        })

        // Create a chat client using API key if available, otherwise use the DefaultAzureCredential
        var openAIClient openai.Client
        if aiConfig.AzureOpenAI.APIKey != "" {
            openAIClient = openai.NewClient(azure.WithAPIKey(aiConfig.AzureOpenAI.APIKey), azure.WithEndpoint(aiConfig.AzureOpenAI.Endpoint, aiConfig.AzureOpenAI.APIVersion))
        } else {
            openAIClient = openai.NewClient(azure.WithEndpoint(aiConfig.AzureOpenAI.Endpoint, aiConfig.AzureOpenAI.APIVersion), azure.WithTokenCredential(tokenCredential))
        }

        // Initialize chat conversation
        var chatConversation []openai.ChatCompletionMessageParamUnion
        fmt.Println("Chat started! What's on your mind?")
        reader := bufio.NewReader(os.Stdin)

        for {
            // Refresh the configuration from Azure App Configuration
            configProvider.Refresh(context.Background())

            // Get user input
            fmt.Print("You: ")
            userInput, _ := reader.ReadString('\n')

            // Exit if user input is empty
            if userInput == "" {
                fmt.Println("Exiting Chat. Goodbye!")
                break
            }

            // Add user message to chat conversation
            chatConversation = append(chatConversation, openai.UserMessage(userInput))

            // Get AI response and add it to chat conversation
            response, _ := getAIResponse(openAIClient, chatConversation)
            fmt.Printf("AI: %s\n", response)
            chatConversation = append(chatConversation, openai.AssistantMessage(response))

            fmt.Println()
        }
    }

    // Load configuration from Azure App Configuration
    func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
        endpoint := os.Getenv("AZURE_APPCONFIGURATION_ENDPOINT")
        if endpoint == "" {
            return nil, fmt.Errorf("AZURE_APPCONFIGURATION_ENDPOINT environment variable is not set")
        }

        authOptions := azureappconfiguration.AuthenticationOptions{
            Endpoint:   endpoint,
            Credential: tokenCredential,
        }

        options := &azureappconfiguration.Options{
            Selectors: []azureappconfiguration.Selector{
                // Load all keys that start with "ChatApp:" and have no label
                {
                    KeyFilter: "ChatApp:*",
                },
            },
            TrimKeyPrefixes: []string{"ChatApp:"},
            // Reload configuration if any selected key-values have changed.
            // Use the default refresh interval of 30 seconds. It can be overridden via RefreshOptions.Interval
            RefreshOptions: azureappconfiguration.KeyValueRefreshOptions{
                Enabled:  true,
            },
            KeyVaultOptions: azureappconfiguration.KeyVaultOptions{
                Credential: tokenCredential,
            },
        }

        return azureappconfiguration.Load(ctx, authOptions, options)
    }

    func getAIResponse(openAIClient openai.Client, chatConversation []openai.ChatCompletionMessageParamUnion) (string, error) {
        var completionMessages []openai.ChatCompletionMessageParamUnion

        for _, msg := range aiConfig.ChatCompletion.Messages {
            switch msg.Role {
            case "system":
                completionMessages = append(completionMessages, openai.SystemMessage(msg.Content))
            case "user":
                completionMessages = append(completionMessages, openai.UserMessage(msg.Content))
            case "assistant":
                completionMessages = append(completionMessages, openai.AssistantMessage(msg.Content))
            }
        }

        // Add the chat conversation history
        completionMessages = append(completionMessages, chatConversation...)

        // Create chat completion parameters
        params := openai.ChatCompletionNewParams{
            Messages:    completionMessages,
            Model:       aiConfig.ChatCompletion.Model,
            MaxTokens:   openai.Int(aiConfig.ChatCompletion.MaxTokens),
            Temperature: openai.Float(aiConfig.ChatCompletion.Temperature),
            TopP:        openai.Float(aiConfig.ChatCompletion.TopP),
        }

        if completion, err := openAIClient.Chat.Completions.New(context.Background(), params); err != nil {
            return "", err
        } else {
            return completion.Choices[0].Message.Content, nil
        }
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
    export AZURE_APPCONFIGURATION_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

1. After the environment variable is properly set, run the following commands to build and run your app:
    ```bash
    go mod tidy
    go run main.go
    ```

1. Type the message "What is your name?" when prompted with "You:" and then press the Enter key.

    ```Output
    Chat started! What's on your mind?
    You: What is your name?
    AI: I'm your helpful assistant! I don't have a personal name, but you can call me whatever you'd like. 
    😊 Do you have a name in mind?
    ```

1. In Azure portal, select the App Configuration store instance that you created. From the **Operations** menu, select **Configuration explorer** and select the **ChatApp:ChatCompletion** key. Update the value of the Messages property:
    - Role: **system**
    - Content: "You are a pirate and your name is Eddy."

1. Type the same message when prompted with "You:". Be sure to wait a few moments for the refresh interval to elapse, and then press the Enter key to see the updated AI response in the output.

    ```Output
    Chat started! What's on your mind?
    You: What is your name?
    AI: I'm your helpful assistant! I don't have a personal name, but you can call me whatever you'd like. 
    😊 Do you have a name in mind?

    You: What is your name?
    AI: Arrr, matey! Me name be Eddy, the most fearsome pirate to ever sail the seven seas!
    What be yer name, landlubber? 
    ```
