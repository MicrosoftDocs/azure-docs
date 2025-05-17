---
title: Chatbot with Azure OpenAI (.NET)
description: Learn how to build and deploy a Blazor web app to Azure App Service that connects to Azure OpenAI using managed identity.
author: cephalin
ms.author: cephalin
ms.date: 05/19/2025
ms.topic: tutorial
ms.custom: devx-track-dotnet, linux-related-content
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (.NET)

In this tutorial, you'll build an intelligent AI application by integrating Azure OpenAI with a Java Spring Boot application and deploying it to Azure App Service. You'll create a simple "TLDR generator" with Semantic Kernel [function invocation](/semantic-kernel/concepts/ai-services/chat-completion/function-calling/function-invocation?pivots=programming-language-java), which defines a function with a prompt, and then invoke the function in your code, even with input variables.

:::image type="content" source="media/tutorial-ai-openai-chatbot-dotnet/tldr-generator.png" alt-text="Screenshot showing chatbot running in Azure App Service.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure OpenAI resource and deploy a language model
> * Build a Blazor application that uses Semantic Kernel with Azure OpenAI
> * Deploy the application to Azure App Service
> * Implement passwordless authentication both in the development environment and in Azure

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [GitHub account](https://github.com/join) for using GitHub Codespaces

## 1. Create an Azure OpenAI resource

[!INCLUDE [tutorial-ai-openai-chatbot/create-openai-resource](includes/tutorial-ai-openai-chatbot/create-openai-resource.md)]

## 2. Create and set up a Blazor web app

In this section, you'll create a new Blazor web application using the .NET CLI.

1. In your Codespace terminal, create a new Blazor app and try running it for the first time.

    ```bash
    dotnet new blazor -o .
    dotnet run
    ```
  
    You should see a notification in GitHub Codespaces indicating that the app is available at a specific port. Select "Open in browser" to launch the app in a new browser tab.

2. Back in the Codesapce terminal, stop the app with Ctrl+C.

3. Install the required NuGet packages for working with Azure OpenAI:

    ```bash
    dotnet add package Microsoft.SemanticKernel
    dotnet add package Microsoft.SemanticKernel.Connectors.OpenAI
    dotnet add package Azure.Identity
    ```

4. Update the `Components/Pages/Home.razor` file to add OpenAI integration. Replace its contents with the following code:

    ```csharp
    @page "/"
    @rendermode InteractiveServer
    @using Microsoft.SemanticKernel
    @using Microsoft.SemanticKernel.Connectors.OpenAI
    @using Azure.Identity
    @inject Microsoft.Extensions.Configuration.IConfiguration _config
  
    <PageTitle>TLDR Generator</PageTitle>
  
    <h3>TLDR Generator</h3> 
    <input class="col-sm-4" @bind="newQuery" ton class="btn btn-primary" @onclick="SemanticKernelClient">Generate</button>
  
    <br <br <h4>Server response:</h4> <p>@serverResponse</p>
  
    @code {
      private string? newQuery;
      private string? serverResponse;
  
      private async Task SemanticKernelClient()
      {
        // Create the kernel builder
        var builder = Kernel.CreateBuilder();
        
        // Add Azure OpenAI chat completion using DefaultAzureCredential
        builder.Services.AddAzureOpenAIChatCompletion(
          deploymentName: "gpt-4o-mini",
          endpoint: _config["AZURE_OPENAI_ENDPOINT"]!,
          credentials: new DefaultAzureCredential()
        );
  
        // Build the kernel
        var kernel = builder.Build();
  
        // Create a summarization function, which takes one input
        var prompt = @"{{$input}}
  
        Give a one-line TLDR summary using the user's prompt. Don't answer any question.";
  
        var summarize = kernel.CreateFunctionFromPrompt(
          prompt, 
          executionSettings: new OpenAIPromptExecutionSettings 
          { 
            MaxTokens = 100
          }
        );
  
        // Invoke the function with the input query
        var result = await kernel.InvokeAsync(summarize, new() { ["input"] = newQuery });
  
        serverResponse = result.ToString();
  
      }
    }
    ```

5. In the terminal, retrieve your OpenAI endpoint:

    ```bash
    az cognitiveservices account show \
      --name $OPENAI_SERVICE_NAME \
      --resource-group $RESOURCE_GROUP \
      --query properties.endpoint \
      --output tsv
    ```

7. Run the app again by adding `AZURE_OPENAI_ENDPOINT` with its value from the CLI output:

   ```bash
   AZURE_OPENAI_ENDPOINT=<output-from-previous-cli-command> dotnet run
   ```

8. Select **Open in browser**to launch the app in a new browser tab.

9. Test your application by copying a paragraph of text from anywhere into the textbox and selecting "**Generate**. You should receive a response from Azure OpenAI. 

The application uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), which automatically uses your Azure CLI signed in user for token authentication. Later in this tutorial, you'll deploy your Blazor app to Azure App Service and configure it to securely connect to your Azure OpenAI resource using managed identity. The same `DefaultAzureCredential` in your code can detect the managed identity and use it for authentication. No extra code is needed.

## 3. Deploy to Azure App Service and configure OpenAI connection

Now that your app works locally, let's deploy it to Azure App Service and set up a service connection to Azure OpenAI using managed identity.

1. First, deploy your app to Azure App Service using the Azure CLI command `az webapp up`. This command creates a new web app and deploys your code to it:

    ```bash
    az webapp up \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --name $APPSERVICE_NAME \
      --plan $APPSERVICE_NAME \
      --sku B1 \
      --os-type Linux \
      --track-status false
    ```

   This command might take a few minutes to complete. It creates a new web app in the same resource group as your OpenAI resource.

2. After the app is deployed, create a service connection between your web app and the Azure OpenAI resource using managed identity:

    ```bash
    az webapp connection create cognitiveservices \
      --resource-group $RESOURCE_GROUP \
      --name $APPSERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP \
      --account $OPENAI_SERVICE_NAME
      --connection azure-openai \
      --system-identity
    ```

   This command creates a connection between your web app and the Azure OpenAI resource by: 

    - Generating system-assigned managed identity for the web app.
    - Adding the Cognitive Services OpenAI Contributor role to the managed identity for the Azure OpenAI resource.
    - Adding the `AZURE_OPENAI_ENDPOINT` app setting to your web app.

    Your app is now deployed and connected to Azure OpenAI with managed identity. Note that is it accessing the `AZURE_OPENAI_ENDPOINT` app setting through the [IConfiguration](/dotnet/api/microsoft.extensions.configuration.iconfiguration) injection.

3. Open the deployed web app in the browser. Find the URL of the deployed web app in the terminal output. Open your web browser and navigate to it.

    ```azurecli
    az webapp browse
    ```    

4. Test your application by copying a paragraph of text from anywhere into the textbox and selecting "**Generate**. 

    :::image type="content" source="media/tutorial-ai-openai-chatbot-dotnet/tldr-generator.png" alt-text="Screenshot showing chatbot running in Azure App Service.":::

## Frequently asked questions

### What if I want to connect to OpenAI instead of Azure OpenAI?

To connect to OpenAI instead, use the following code:

```csharp
builder.Services.AddOpenAIChatCompletion(
  modelId: "<model-id-hosted-in-openai>",
  apiKey: "<openai-api-key>"
);
```

For more information, see [OpenAI API authentication](https://platform.openai.com/docs/api-reference/authentication).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

### Can I connect to Azure OpenAI with an API key instead?

Yes, you can connect to Azure OpenAI using an API key instead of managed identity. This approach is supported by the Azure OpenAI SDKs and Semantic Kernel. For details on using API keys with Semantic Kernel in C#, see the [Semantic Kernel C# Quickstart](/semantic-kernel/get-started/quick-start-guide?pivots=programming-language-csharp).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

### How does DefaultAzureCredential work in this tutorial?

The `DefaultAzureCredential` simplifies authentication by automatically selecting the best available authentication method:

- **During local development**: After you run `az login`, it uses your local Azure CLI credentials.
- **When deployed to Azure App Service**: It uses the app's managed identity for secure, passwordless authentication.

This approach lets your code run securely and seamlessly in both local and cloud environments without modification.

## More resources

- [Tutorial: Build a Retrieval Augmented Generation with Azure OpenAI and Azure AI Search (.NET)](tutorial-ai-openai-search-dotnet.md)
- [Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (ASP.NET Core)](tutorial-ai-slm-dotnet.md)
- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource)
- [Learn more about Semantic Kernel](/semantic-kernel/overview)
- [Learn more about managed identity in App Service](overview-managed-identity.md)
