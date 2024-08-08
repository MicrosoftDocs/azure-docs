---
title: include file
description: include file
author: eur
ms.reviewer: eur
ms.author: eric-urban
ms.service: azure-ai-studio
ms.topic: include
ms.date: 5/21/2024
ms.custom: include, build-2024
---

To complete this section, you need a local copy of product data. The [Azure-Samples/aistudio-python-quickstart-sample repository on GitHub](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data) contains sample retail customer and product information that's relevant for this tutorial scenario. Clone the repository or copy the files from [3-product-info](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data/3-product-info). 

> [!IMPORTANT]
> The **Add your data** feature in the Azure AI Studio playground doesn't support using a virtual network or private endpoint on the following resources:
> * Azure AI Search
> * Azure OpenAI
> * Storage resource 

Follow these steps to add your data in the chat playground to help the assistant answer questions about your products. You're not changing the deployed model itself. Your data is stored separately and securely in your Azure subscription.

1. Go to your project in [Azure AI Studio](https://ai.azure.com). 
1. Select **Playgrounds** > **Chat** from the left pane.
1. Select your deployed chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/tutorials/chat/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/tutorials/chat/playground-chat.png":::
 
1. On the left side of the chat playground, select **Add your data** > **+ Add a new data source**.

    :::image type="content" source="../media/tutorials/chat/add-your-data.png" alt-text="Screenshot of the chat playground with the option to add a data source visible." lightbox="../media/tutorials/chat/add-your-data.png":::

1. In the **Data source** dropdown, select **Upload files**. 

    :::image type="content" source="../media/tutorials/chat/add-your-data-source.png" alt-text="Screenshot of the data source selection options." lightbox="../media/tutorials/chat/add-your-data-source.png":::

1. Select **Upload** > **Upload files** to browse your local files. 

1. Select the files you want to upload. Select the product information files ([3-product-info](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data/3-product-info)) that you downloaded or created earlier. Add all of the files now. You won't be able to add more files later in the same playground session.

1. Select **Upload** to upload the file to your Azure Blob storage account. Then select **Next**.

   :::image type="content" source="../media/tutorials/chat/add-your-data-uploaded.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/tutorials/chat/add-your-data-uploaded.png":::

1. Select an Azure AI Search service. In this example we select **Connect other Azure AI Search resource** from the **Select Azure AI Search service** dropdown. If you don't have a search resource, you can create one by selecting **Create a new Azure AI Search resource**. Then return to this step to connect and select it.

    :::image type="content" source="../media/tutorials/chat/add-your-data-connect-search.png" alt-text="Screenshot of the search resource selection options." lightbox="../media/tutorials/chat/add-your-data-connect-search.png":::

1. Browse for your Azure AI Search service, and select **Add connection**. 

    :::image type="content" source="../media/tutorials/chat/add-your-data-connect-search-add.png" alt-text="Screenshot of the page to add a search service connection." lightbox="../media/tutorials/chat/add-your-data-connect-search-add.png":::

1. For the **Index name**, enter *product-info* and select **Next**.

1. On the **Search settings** page under **Vector settings**, deselect the **Add vector search to this search resource** checkbox. This setting helps determine how the model responds to requests. Then select **Next**.
    
    > [!NOTE]
    > If you add vector search, more options would be available here for an additional cost. 

1. Review your settings and select **Create**.

1. In the playground, you can see that your data ingestion is in progress. This process might take several minutes. Before proceeding, wait until you see the data source and index name in place of the status. 

   :::image type="content" source="../media/tutorials/chat/add-your-data-ingestion-in-progress.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/tutorials/chat/add-your-data-ingestion-in-progress.png":::

1. Enter a name for the playground configuration and select **Save** > **Save configuration**. All configuration items are saved by default. Items include deployment, system message, safety message, parameters, added data, examples, and variables. Saving a configuration with the same name will save over the previous version.

   :::image type="content" source="../media/tutorials/chat/playground-configuration-save.png" alt-text="Screenshot of the playground configuration name and Save button." lightbox="../media/tutorials/chat/playground-configuration-save.png":::

1. You can now chat with the model asking the same question as before ("How much are the TrailWalker hiking shoes"), and this time it uses information from your data to construct the response. You can expand the **references** button to see the data that was used.
