---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
ms.custom:
  - build-2025
---

Now that the infrastructure is deployed, you need to upload documents and create a search index that the application will use:

1. In the Azure portal, navigate to the storage account that was created by the deployment. The name will start with the environment name you provided earlier.

2. Select **Containers** from the left navigation menu and open the **documents** container.

3. Upload sample documents by clicking **Upload**. You can use the sample documents from the `sample-docs` folder in the repository, or your own PDF, Word, or text files.

   :::image type="content" source="../../media/tutorial-ai-openai-search-dotnet/storage-upload-files.png" alt-text="Screenshot showing how to upload documents to the storage container.":::

4. Navigate to your Azure AI Search service in the Azure portal.

5. Select **Import and vectorize data** to start the process of creating a search index.

   :::image type="content" source="../../media/tutorial-ai-openai-search-dotnet/ai-search-import-vectorize.png" alt-text="Screenshot showing the Import and vectorize data button in Azure AI Search.":::

6. In the **Connect to your data** step:
   - Select **Azure Blob Storage** as the Data Source.
   - Select **RAG**.
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

   Replace `<your-search-index-name>` with the index name you copied previously. AZD uses this variable in subsequent deployments to set the App Service app setting.

