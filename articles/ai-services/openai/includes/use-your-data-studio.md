---
title: 'Use your own data to generate text using Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to import and use your data in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 05/04/2023
recommendations: false
---

## Add your data using Azure OpenAI Studio

Navigate to [Azure OpenAI Studio](https://oai.azure.com/) and sign-in with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

1. Select the **Chat playground** tile.

    :::image type="content" source="../media/quickstarts/chat-playground-card.png" alt-text="A screenshot of the Azure OpenAI Studio landing page." lightbox="../media/quickstarts/chat-playground-card.png":::

1. On the **Assistant setup** tile, select **Add your data (preview)** > **+ Add a data source**.

    :::image type="content" source="../media/quickstarts/chatgpt-playground-add-your-data.png" alt-text="A screenshot showing the button for adding your data in Azure OpenAI Studio." lightbox="../media/quickstarts/chatgpt-playground-add-your-data.png":::

1. In the pane that appears, select **Upload files** under **Select data source**. Select **Upload files**. Azure OpenAI needs both a storage resource and a search resource to access and index your data.

    > [!TIP]
    > * For a list of supported data sources, see [Data source options](../concepts/use-your-data.md#data-source-options)
    > *  For documents and datasets with long text, we recommend using the available [data preparation script](../concepts/use-your-data.md#ingesting-your-data-into-azure-cognitive-search). 

    1. For Azure OpenAI to access your storage account, you will need to turn on [Cross-origin resource sharing (CORS)](https://go.microsoft.com/fwlink/?linkid=2237228). If CORS isn't already turned on for the Azure Blob storage resource, select **Turn on CORS**. 

    1. Select your Azure Cognitive Search resource, and select the acknowledgment that connecting it will incur usage on your account. Then select **Next**.

    :::image type="content" source="../media/quickstarts/add-your-data-source.png" alt-text="A screenshot showing options for selecting a data source in Azure OpenAI Studio." lightbox="../media/quickstarts/add-your-data-source.png":::


1. On the **Upload files** pane, select **Browse for a file** and select the files you want to upload. Then select **Upload files**. Then select **Next**.

1. Review the details you entered, and select **Save and close**. You can now chat with the model and it will use information from your data to construct the response.

> [!div class="nextstepaction"]
> [I ran into an issue adding my data.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Adding-data)


## Chat playground

Start exploring Azure OpenAI capabilities with a no-code approach through the chat playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. 

:::image type="content" source="../media/quickstarts/chat-playground.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/chat-playground.png":::

You can experiment with the configuration settings such as temperature and pre-response text to improve the performance of your task. You can read more about each parameter in the [REST API](../reference.md).

- Selecting the **Generate** button will send the entered text to the completions API and stream the results back to the text box.
- Select the **Undo** button to undo the prior generation call.
- Select the **Regenerate** button to complete an undo and generation call together.


[!INCLUDE [deploy-web-app](deploy-web-app.md)]


### Important considerations

- Publishing creates an Azure App Service in your subscription. It may incur costs depending on the 
[pricing plan](https://azure.microsoft.com/pricing/details/app-service/windows/) you select. When you're done with your app, you can delete it from the Azure portal.
- You can [customize](../concepts/use-your-data.md#using-the-web-app) the frontend and backend logic of the web app.
- By default, the app will only be accessible to you. To add authentication (for example, restrict access to the app to members of your Azure tenant):

    1. Go to the [Azure portal](https://portal.azure.com/#home) and search for the app name you specified during publishing. Select the web app, and go to the **Authentication** tab on the left navigation menu. Then select **Add an identity provider**. 
    
        :::image type="content" source="../media/quickstarts/web-app-authentication.png" alt-text="Screenshot of the authentication page in the Azure portal." lightbox="../media/quickstarts/web-app-authentication.png":::

    1. Select Microsoft as the identity provider. The default settings on this page will restrict the app to your tenant only, so you don't need to change anything else here. Then select **Add**
    
    Now users will be asked to sign in with their Azure Active Directory account to be able to access your app. You can follow a similar process to add another identity provider if you prefer. The app doesn't use the user's login information in any other way other than verifying they are a member of your tenant.
