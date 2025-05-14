---
title: RAG application with Azure OpenAI and Azure AI Search (.NET)
description: Learn how to build and deploy a Retrieval Augmented Generation (RAG) application using Blazor, Azure OpenAI, and Azure AI Search.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 05/19/2025
ms.custom: devx-track-dotnet, devx-track-azurecli
---

# Tutorial: Build a Retrieval Augmented Generation with Azure OpenAI and Azure AI Search (.NET)

In this tutorial, you'll create a .NET Retrieval Augmented Generation (RAG) application using .NET Blazor, Azure OpenAI, and Azure AI Search and deploy it to Azure App Service. This application demonstrates how to implement a chat interface that retrieves information from your own documents and leverages Azure AI services to provide accurate, contextually aware answers with proper citations. The solution uses managed identities for passwordless authentication between services. 

:::image type="content" source="media/tutorial-ai-openai-search-dotnet/chat-interface.png" alt-text="Screenshot showing the Blazor chat interface in introduction.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy a Blazor application that uses RAG pattern with Azure AI services.
> * Configure Azure OpenAI and Azure AI Search for hybrid search.
> * Upload and index documents for use in your AI-powered application.
> * Use managed identities for secure service-to-service communication.
> * Test your RAG implementation locally with production services.

## Architecture overview

Before you begin deployment, it's helpful to understand the architecture of the application you'll be building. The following diagram is from [Custom RAG pattern for Azure AI Search](/azure/search/retrieval-augmented-generation-overview?tabs=docs#custom-rag-pattern-for-azure-ai-search):

:::image type="content" source="media/tutorial-ai-openai-search-dotnet/architecture-diagram.png" alt-text="Architecture diagram showing a web app connecting to Azure OpenAI and Azure AI Search, with Storage as the data source":::

In this tutorial, the Blazer application in App Service takes care of both the app UX and the app server. However, it doesn't make a separate knowledge query to Azure AI Search. Instead, it tells Azure OpenAI to do the knowledge querying specifying Azure AI Search as a data source. This architecture offers several key advantages:

- **Integrated Vectorization**: Azure AI Search's integrated vectorization capabilities make it easy and quick to ingest all your documents for searching, without requiring more code for generating embeddings.
- **Simplified API Access**: By using Azure AI Search as a data source for Azure OpenAI completions, you get vector search functionality without having to generate embeddings for your queries. It's just one API call and Azure OpenAI handles everything.
- **Advanced Search Capabilities**: The integrated vectorization provides everything needed for advanced hybrid search with semantic reranking, which combines the strengths of keyword matching, vector similarity, and AI-powered ranking.
- **Complete Citation Support**: Responses automatically include citations to source documents, making information verifiable and traceable.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/free/dotnet).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## 1. Deploy the sample architecture from GitHub

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools pre-installed.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-rag-openai-ai-search-dotnet](https://github.com/Azure-Samples/app-service-rag-openai-ai-search-dotnet).

2. Select the **Code** button, select the **Codespaces** tab, and click **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured VS Code environment in your browser.

1. In the terminal, log into Azure using Azure Developer CLI:

   ```bash
   az auth login
   ```

   Follow the instructions to complete the authentication process.

4. Deploy the AZD template:

   ```bash
   azd up
   ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Enter a new environment name:     | Type a unique name. |
    |Select an Azure Subscription to use: | Select the subscription. |
    |Pick a resource group to use: | Select **Create a new resource group**. |
    |Select a location to create the resource group in:| Select any region. The resources will actually be created in **East US 2**.|
    |Enter a name for the new resource group:| Type **Enter**.|

6. Wait for the deployment to complete. This process will:
   - Create all required Azure resources.
   - Deploy the Blazor application to Azure App Service.
   - Configure secure service-to-service authentication using managed identities.
   - Set up the necessary role assignments for secure access between services.

   > [!NOTE]
   > To learn more about how managed identities work, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview) and [How to use managed identities with App Service](/azure/app-service/overview-managed-identity).

7. After successful deployment, you'll see a URL for your deployed application. Make note of this URL, but don't access it yet because you still need to set up the search index.

## 2. Upload documents and create a search index

Now that the infrastructure is deployed, you need to upload documents and create a search index that the application will use:

1. In the Azure portal, navigate to the storage account that was created by the deployment. The name will start with the environment name you provided earlier.

2. Select **Containers** from the left navigation menu and open the **documents** container.

3. Upload sample documents by clicking **Upload**. You can use the sample documents from the `sample-docs` folder in the repository, or your own PDF, Word, or text files.

   :::image type="content" source="media/tutorial-ai-openai-search-dotnet/storage-upload-files.png" alt-text="Screenshot showing how to upload documents to the storage container.":::

4. Navigate to your Azure AI Search service in the Azure portal.

5. Select **Import and vectorize data** to start the process of creating a search index.

   :::image type="content" source="media/tutorial-ai-openai-search-dotnet/ai-search-import-vectorize.png" alt-text="Screenshot showing the Import and vectorize data button in Azure AI Search.":::

6. In the **Connect to your data** step:
   - Select **Azure Blob Storage** as the Data Source.
   - Choose your storage account and the **documents** container.
   - Make sure **Authenticate using managed identity** is selected.
   - Select **Next**.

8. In the **Vectorize your text** step:
   - Select your Azure OpenAI service.
   - Choose **text-embedding-ada-002** as the embedding model. The AZD template already deployed this model for you.
   - Select **System assigned identity** for authentication.
   - Check the acknowledgment checkbox for additional costs.
   - Select **Next**.

   > [!TIP]
   > Learn more about [Vector search in Azure AI Search](/azure/search/vector-search-overview) and [Text embeddings in Azure OpenAI](/azure/ai-services/openai/concepts/models#embeddings-models).

9. In the **Vectorize and enrich your images** step:
   - Keep the default settings.
   - Select **Next**.

10. In the **Advanced settings** step:
    - Ensure **Enable semantic ranker** is selected.
    - (Optional) Select an indexing schedule. This is useful if you want to refresh your index regularly with the latest file changes.
    - Select **Next**.

11. In the **Review and create** step:
    - Copy the **Objects name prefix** value. It is your search index name.
    - Select **Create** to start the indexing process.

12. Wait for the indexing process to complete. This might take a few minutes depending on the size and number of your documents.

1. To test the data import, select **Start searching** and try a search query like *"Tell me about your company."* 

1. Back in your Codespace terminal, set the search index name as an AZD environment variable:

   ```bash
   azd env set SEARCH_INDEX_NAME <your-search-index-name>
   ```

   Replace `<your-search-index-name>` with the index name you copied previously.

## 3. Test the application and deploy

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

2. Redeploy the application to apply the configuration:

   ```bash
   azd up
   ```

3. This deployment will be faster since it only needs to update the application configuration.

## Test the RAG application

With the application fully deployed and configured, you can now test the RAG functionality:

1. Open the application URL provided at the end of the deployment.

2. You see a chat interface where you can enter questions about the content of your uploaded documents.

   :::image type="content" source="media/tutorial-ai-openai-search-dotnet/chat-interface.png" alt-text="Screenshot showing the Blazor chat interface.":::

3. Try asking questions that are specific to the content of your documents. For example, if you uploaded the documents in the *sample-docs* folder, you can try out these questions:

- How does Contoso use my personal data?
- How do you file a warranty claim?

4. Notice how the responses include citations that reference the source documents. These citations help users verify the accuracy of the information and find additional details in the source material.

   :::image type="content" source="media/tutorial-ai-openai-search-dotnet/citations.png" alt-text="Screenshot showing a response with citations to source documents.":::

5. Test the hybrid search capabilities by asking questions that might benefit from different search approaches:
   - Questions with specific terminology (good for keyword search).
   - Questions about concepts that might be described using different terms (good for vector search).
   - Complex questions that require understanding context (good for semantic ranking).

## Clean up resources

When you're done with the application, you can delete all the resources to avoid incurring further costs:

```bash
azd down --purge
```

This command will delete all resources associated with your application.

## Frequently asked questions

- [How does the sample code retrieve citations from Azure OpenAI chat completions?](#how-does-the-sample-code-retrieve-citations-from-azure-openai-chat-completions)
- [What's the advantage of using managed identities in this solution?](#whats-the-advantage-of-using-managed-identities-in-this-solution)
- [How is the system-assigned managed identity used in this architecture and sample application?](#how-is-the-system-assigned-managed-identity-used-in-this-architecture-and-sample-application)
- [How is hybrid search with semantic ranker implemented in the sample application?](#how-is-hybrid-search-with-semantic-ranker-implemented-in-the-sample-application)
- [Why are all resources created in East US 2?](#why-are-all-resources-created-in-east-us-2)
- [Can I use my own OpenAI models instead of the ones provided by Azure?](#can-i-use-my-own-openai-models-instead-of-the-ones-provided-by-azure)
- [How can I improve the quality of responses?](#how-can-i-improve-the-quality-of-responses)

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

In the chat response, the content uses `[doc#]` notation to reference the corresponding citation in the list, allowing users to trace information back to the original source documents.

### What's the advantage of using managed identities in this solution?

Managed identities eliminate the need to store credentials in your code or configuration. By using managed identities, the application can securely access Azure services like Azure OpenAI and Azure AI Search without managing secrets. This approach follows zero trust security principles and reduces the risk of credential exposure.

### How is the system-assigned managed identity used in this architecture and sample application?

The AZD deployment created the system-assigned managed identity for the Azure App Service resource, and also granted it access permissions to Azure OpenAI and Azure AI Search resources. In the sample application, the Azure SDKs use this managed identity to authenticate requests securely, without storing credentials or secrets in code or configuration. For example, the `AzureOpenAIClient` is initialized with `DefaultAzureCredential`, which uses the managed identity when running in Azure:

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

This enables secure, passwordless communication between the Blazor app and Azure services, following best practices for zero trust security. Learn more about [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) and [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

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

### Why are all resources created in East US 2?

The sample uses the **gpt-4o-mini** and **text-embedding-ada-002** models, both of which are available with the Standard deployment type in East US 2. These models are also chosen because they are not scheduled to expire in the near future, providing stability for the sample deployment. Model availability and deployment types can vary by region, so East US 2 is selected to ensure the sample works out of the box. If you want to use a different region or models, make sure to select models that are available for the same deployment type in the same region. When choosing your own models, check both their availability and expiration dates to avoid disruptions. You can review model availability and expiration information at [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models) and check for model retirements at [Azure OpenAI Service model deprecations and retirements](/azure/ai-services/openai/concepts/model-retirements).

### Can I use my own OpenAI models instead of the ones provided by Azure?

This solution is specifically designed to work with Azure OpenAI Service. While you could modify the code to use other OpenAI models, you would lose the integrated security features, managed identity support, and the seamless integration with Azure AI Search that this solution provides.

### How can I improve the quality of responses?

You can improve response quality by:
- Uploading higher quality, more relevant documents.
- Adjusting chunking strategies in the Azure AI Search indexing pipeline. However, you can't customize chunking with the integrated vectorization shown in this tutorial.
- Experimenting with different prompt templates in the application code.
- Fine-tuning the search with additional properties in the [AzureSearchChatDataSource class](/dotnet/api/azure.ai.openai.chat.azuresearchchatdatasource).
- Using more specialized Azure OpenAI models for your specific domain.

## More resources

- [Explore hybrid search capabilities in Azure AI Search](/azure/search/hybrid-search-overview).
- [Implement monitoring for your Azure App Service](/azure/app-service/web-sites-monitor).
- [Configure scaling for Azure App Service](/azure/app-service/manage-scale-up).
- [Use Azure OpenAI On Your Data](/azure/ai-services/openai/concepts/use-your-data)
- [.NET Client SDK for Azure OpenAI Service](/dotnet/api/overview/azure/ai.openai-readme)
