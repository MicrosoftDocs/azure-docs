---
title: include file
description: include file
author: eur
ms.reviewer: eur
ms.author: eric-urban
ms.service: azure-ai-studio
ms.topic: include
ms.date: 2/22/2024
ms.custom: include
---

Follow these steps to add your data to the playground to help the assistant answer questions about your products. You're not changing the deployed model itself. Your data is stored separately and securely in your Azure subscription. 

1. If you aren't already in the playground, select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. On the **Assistant setup** pane, select **Add your data (preview)** > **+ Add a data source**.

    :::image type="content" source="../media/tutorials/chat/add-your-data.png" alt-text="Screenshot of the chat playground with the option to add a data source visible." lightbox="../media/tutorials/chat/add-your-data.png":::

1. In the **Select or add data source** page that appears, select **Upload files** from the **Select data source** dropdown. 

    :::image type="content" source="../media/tutorials/chat/add-your-data-source.png" alt-text="Screenshot of the data source selection options." lightbox="../media/tutorials/chat/add-your-data-source.png":::

    > [!TIP]
    > For data source options and supported file types and formats, see [Azure OpenAI enterprise chat](/azure/ai-services/openai/concepts/use-your-data). 

1. Enter your data source details:

    :::image type="content" source="../media/tutorials/chat/add-your-data-source-details.png" alt-text="Screenshot of the resources and information required to upload files." lightbox="../media/tutorials/chat/add-your-data-source-details.png":::

    > [!NOTE]
    > Azure OpenAI needs both a storage resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 

    - **Subscription**: Select the Azure subscription that contains the Azure OpenAI resource you want to use.
    - **Storage resource**: Select the Azure Blob storage resource where you want to upload your files. 
    - **Data source**: Select an existing Azure AI Search index, Azure Storage container, or upload local files as the source we'll build the grounding data from. Your data is stored securely in your Azure subscription.
    - **Index name**: Select the Azure AI Search resource where the index used for grounding is created. A new search index with the provided name is generated after data ingestion is complete.

1. Select your Azure AI Search resource, and select the acknowledgment that connecting it incurs usage on your account. Then select **Next**.
1. On the **Upload files** pane, select **Browse for a file** and select the files you want to upload. Select the `product_info_11.md` file you downloaded or created earlier. See the [prerequisites](#prerequisites). If you want to upload more than one file, do so now. You won't be able to add more files later in the same playground session.
1. Select **Upload** to upload the file to your Azure Blob storage account. Then select **Next**.

   :::image type="content" source="../media/tutorials/chat/add-your-data-uploaded.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/tutorials/chat/add-your-data-uploaded.png":::

1. On the **Data management** pane under **Search type**, select **Keyword**. This setting helps determine how the model responds to requests. Then select **Next**.
    
    > [!NOTE]
    > If you had added vector search on the **Select or add data source** page, then more options would be available here for an additional cost. For more information, see [Azure OpenAI enterprise chat](/azure/ai-services/openai/concepts/use-your-data).
    
1. Review the details you entered, and select **Save and close**. You can now chat with the model and it uses information from your data to construct the response.

    :::image type="content" source="../media/tutorials/chat/add-your-data-review-finish.png" alt-text="Screenshot of the review and finish page for adding data." lightbox="../media/tutorials/chat/add-your-data-review-finish.png":::

1. Now on the **Assistant setup** pane, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

   :::image type="content" source="../media/tutorials/chat/add-your-data-ingestion-in-progress.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/tutorials/chat/add-your-data-ingestion-in-progress.png":::

1. You can now chat with the model asking the same question as before ("How much are the TrailWalker hiking shoes"), and this time it uses information from your data to construct the response. You can expand the **references** button to see the data that was used.

   :::image type="content" source="../media/tutorials/chat/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/tutorials/chat/chat-with-data.png":::
