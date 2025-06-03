---
title: RAG application with Azure OpenAI and Azure AI Search (.NET)
description: Learn how to quickly deploy a production-ready, document-aware AI chat application using .NET with Azure App Service, Azure OpenAI, and Azure AI Search with integrated vectorization and semantic ranking.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 05/19/2025
ms.custom:
  - devx-track-dotnet
  - devx-track-azurecli
  - build-2025
---

# Tutorial: Build a retrieval augmented generation app in Azure App Service with Azure OpenAI and Azure AI Search (.NET)

In this tutorial, you'll create a .NET retrieval augmented generation (RAG) application using .NET Blazor, Azure OpenAI, and Azure AI Search and deploy it to Azure App Service. This application demonstrates how to implement a chat interface that retrieves information from your own documents and leverages Azure AI services to provide accurate, contextually aware answers with proper citations. The solution uses managed identities for passwordless authentication between services. 

:::image type="content" source="media/tutorial-ai-openai-search-dotnet/chat-interface.png" alt-text="Screenshot showing the Blazor chat interface in introduction.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy a Blazor application that uses RAG pattern with Azure AI services.
> * Configure Azure OpenAI and Azure AI Search for hybrid search.
> * Upload and index documents for use in your AI-powered application.
> * Use managed identities for secure service-to-service communication.
> * Test your RAG implementation locally with production services.

## Architecture overview

[!INCLUDE [architecture-overview](includes/tutorial-ai-openai-search/architecture-overview.md)]

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/free/dotnet).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## 1. Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-rag-openai-ai-search-dotnet](https://github.com/Azure-Samples/app-service-rag-openai-ai-search-dotnet).

2. Select the **Code** button, select the **Codespaces** tab, and click **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured VS Code environment in your browser.

## 2. Deploy the sample architecture

[!INCLUDE [deploy-sample](includes/tutorial-ai-openai-search/deploy-sample.md)]

## 3. Upload documents and create a search index

[!INCLUDE [upload-files-create-index](includes/tutorial-ai-openai-search/upload-files-create-index.md)]

## 4. Test the application and deploy

If you prefer to test the application locally before or after deployment, you can run it directly from your Codespace:

1. In your Codespace terminal, get the AZD environment values:

    ```bash
    azd env get-values
    ```

1. Open *appsettings.Development.json*. Using the terminal output, update the values of `OpenAIEndpoint`, `SearchServiceUrl`, and `SearchIndexName`. 

2. Sign in to Azure with the Azure CLI:

    ```bash
    az login
    ```

    This allows the Azure Identity client library in the sample code to receive an authentication token for the logged in user.

3. Run the application locally:

   ```bash
   dotnet run
   ```

4. When you see **Your application running on port 5017 is available**, select **Open in Browser**.

1. Try asking a few questions in the chat interface. If you get a response, your application is connecting successfully to the Azure OpenAI resource.

2. Apply the new `SEARCH_INDEX_NAME` configuration in Azure and deploy the sample application code:

   ```bash
   azd up
   ```

## 5. Test the deployed RAG application

[!INCLUDE [test-deployed-app](includes/tutorial-ai-openai-search/test-deployed-app.md)]

## Clean up resources

When you're done with the application, you can delete all the resources to avoid incurring further costs:

```bash
azd down --purge
```

This command deletes all resources associated with your application.

## Frequently asked questions

- [How does the sample code retrieve citations from Azure OpenAI chat completions?](#how-does-the-sample-code-retrieve-citations-from-azure-openai-chat-completions)
- [What's the advantage of using managed identities in this solution?](#whats-the-advantage-of-using-managed-identities-in-this-solution)
- [How is the system-assigned managed identity used in this architecture and sample application?](#how-is-the-system-assigned-managed-identity-used-in-this-architecture-and-sample-application)
- [How is hybrid search with semantic ranker implemented in the sample application?](#how-is-hybrid-search-with-semantic-ranker-implemented-in-the-sample-application)
- [Why are all resources created in East US 2?](#why-are-all-resources-created-in-east-us-2)
- [Can I use my own OpenAI models instead of the ones provided by Azure?](#can-i-use-my-own-openai-models-instead-of-the-ones-provided-by-azure)
- [How can I improve the quality of responses?](#how-can-i-improve-the-quality-of-responses)

---

### How does the sample code retrieve citations from Azure OpenAI chat completions?

The sample retrieves citations by using the `AzureSearchChatDataSource()` as the data source for the chat client. When a chat completion is requested, the response includes a `Citations` object within the message context. The code extracts these citations as follows:

```csharp
var result = await _chatClient.CompleteChatAsync(messages, options);

var ctx = result.Value.GetMessageContext();

var response = new ChatResponse
{
    Content = result.Value.Content,
    Citations = ctx?.Citations
};

return response;
```

In the chat response, the content uses `[doc#]` notation to reference the corresponding citation in the list, allowing users to trace information back to the original source documents. For more information, see:

- [Azure OpenAI On Your Data API Reference](/azure/ai-services/openai/references/on-your-data)
- [Data source - Azure AI Search](/azure/ai-services/openai/references/azure-search)

---

### What's the advantage of using managed identities in this solution?

Managed identities eliminate the need to store credentials in your code or configuration. By using managed identities, the application can securely access Azure services like Azure OpenAI and Azure AI Search without managing secrets. This approach follows Zero Trust security principles and reduces the risk of credential exposure.

---

### How is the system-assigned managed identity used in this architecture and sample application?

The AZD deployment creates system-assigned managed identities for Azure App Service, Azure OpenAI, and Azure AI Search. It also makes respective role assignments for each of them (see the [main.bicep]() file). For information on the required role assignments, see [Network and access configuration for Azure OpenAI On Your Data](/azure/ai-services/openai/how-to/on-your-data-configuration#role-assignments).

In the sample application, the Azure SDKs use this managed identity to authenticate requests securely, without storing credentials or secrets anywhere. For example, the `AzureOpenAIClient` is initialized with `DefaultAzureCredential`, which uses the managed identity when running in Azure:

```csharp
_openAIClient = new AzureOpenAIClient(
    new Uri(_settings.OpenAIEndpoint),
    new DefaultAzureCredential()
);
```

Similarly, when configuring the data source for Azure AI Search, the managed identity is specified for authentication:

```csharp
options.AddDataSource(new AzureSearchChatDataSource()
{
    Endpoint = new Uri(_settings.SearchServiceUrl ?? throw new ArgumentNullException(nameof(_settings.SearchServiceUrl))),
    IndexName = _settings.SearchIndexName,
    Authentication = DataSourceAuthentication.FromSystemManagedIdentity(), // Use system-assigned managed identity
    // ...
});
```

This enables secure, passwordless communication between the Blazor app and Azure services, following best practices for Zero Trust security. Learn more about [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) and [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

---

### How is hybrid search with semantic ranker implemented in the sample application?

The sample application configures hybrid search with semantic ranking using the Azure.AI.Search.Documents SDK. In the backend, the data source is set up as follows:

```csharp
options.AddDataSource(new AzureSearchChatDataSource()
{
    // ...
    QueryType = DataSourceQueryType.VectorSemanticHybrid, // Combines vector search with keyword matching and semantic ranking
    VectorizationSource = DataSourceVectorizer.FromDeploymentName(_settings.OpenAIEmbeddingDeployment),
    SemanticConfiguration = _settings.SearchIndexName + "-semantic-configuration", // Build semantic configuration name from index name
});
```

This configuration enables the application to combine vector search (semantic similarity), keyword matching, and semantic ranking in a single query. The semantic ranker reorders the results to return the most relevant and contextually appropriate answers, which are then used by Azure OpenAI for generating responses.
The semantic configuration name is automatically defined by the integrated vectorization process. It uses the search index name as the prefix and appends `-semantic-configuration` as the suffix. This ensures that the semantic configuration is uniquely associated with the corresponding index and follows a consistent naming convention.

---

### Why are all resources created in East US 2?

The sample uses the **gpt-4o-mini** and **text-embedding-ada-002** models, both of which are available with the Standard deployment type in East US 2. These models are also chosen because they aren't scheduled for retirement soon, providing stability for the sample deployment. Model availability and deployment types can vary by region, so East US 2 is selected to ensure the sample works out of the box. If you want to use a different region or models, make sure to select models that are available for the same deployment type in the same region. When choosing your own models, check both their availability and retirement dates to avoid disruptions.

- Model availability: [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models)
- Model retirement dates: [Azure OpenAI Service model deprecations and retirements](/azure/ai-services/openai/concepts/model-retirements).

---

### Can I use my own OpenAI models instead of the ones provided by Azure?

This solution is designed to work with Azure OpenAI Service. While you could modify the code to use other OpenAI models, you would lose the integrated security features, managed identity support, and the seamless integration with Azure AI Search that this solution provides.

---

### How can I improve the quality of responses?

You can improve response quality by:
- Uploading higher quality, more relevant documents.
- Adjusting chunking strategies in the Azure AI Search indexing pipeline. However, you can't customize chunking with the integrated vectorization shown in this tutorial.
- Experimenting with different prompt templates in the application code.
- Fine-tuning the search with other properties in the [AzureSearchChatDataSource class](/dotnet/api/azure.ai.openai.chat.azuresearchchatdatasource).
- Using more specialized Azure OpenAI models for your specific domain.

## More resources

- [Explore hybrid search capabilities in Azure AI Search](/azure/search/hybrid-search-overview)
- [Use Azure OpenAI On Your Data](/azure/ai-services/openai/concepts/use-your-data)
- [.NET Client SDK for Azure OpenAI Service](/dotnet/api/overview/azure/ai.openai-readme)
