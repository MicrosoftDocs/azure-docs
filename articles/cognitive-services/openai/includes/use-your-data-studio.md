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

## Add your data using Azure AI studio

Navigate to [Azure AI studio](https://oai.azure.com/) and sign-in with credentials that have access to your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure AI studio landing page navigate further to explore examples for prompt completion, manage your deployments and models, and find learning resources such as documentation and community forums. 

1. Select the **Chat playground** tile.

    :::image type="content" source="../media/quickstarts/chatgpt-playground.png" alt-text="A screenshot of the Azure AI studio landing page." lightbox="../media/quickstarts/chatgpt-playground.png":::

1. In the chat playground, select the **Add your data** panel. Then select **+ Add a data source**.

    :::image type="content" source="../media/quickstarts/chatgpt-playground-add-your-data.png" alt-text="A screenshot showing the button for adding your data in Azure AI studio." lightbox="../media/quickstarts/chatgpt-playground-add-your-data.png":::

1. In the pane that appears, select **Upload files** under **Select data source**. Select your Azure blob storage account. 

    1. For Azure OpenAI to access your storage account, you will need to turn on [Cross-origin resource sharing (CORS)](https://go.microsoft.com/fwlink/?linkid=2237228) for your account. To do this, select **Turn on CORS**.

    1. Select your Azure Cognitive Search resource, and select the acknowledgment that connecting it will incur usage on your account. Then select **Next**.

    :::image type="content" source="../media/quickstarts/add-your-data-source.png" alt-text="A screenshot showing options for selecting a data source in Azure AI studio." lightbox="../media/quickstarts/add-your-data-source.png":::


1. On the **Upload files** pane, select **Browse for a file** and select the files you want to upload. Then select **Upload files**. Then select **Next**.

    > [!NOTE]
    > The supported file formats for local index creation are: `.txt`, `.md`, `.html`, `.pdf`, `.docx`, and `.pptx`.

1. In the **data management**, select **Next**. Later, if you store your data in an Azure Cognitive Search index, you can optionally add a [semantic search configuration](/azure/search/semantic-how-to-query-request) for improved response quality. 

1. Review the details you entered, and select **Save and close**. You can now chat with the model and it will use 
information from your data to construct the response.

<!-- Add a feedback button here that says "I had trouble adding my data." -->

## Chat playground

Start exploring Azure OpenAI capabilities with a no-code approach through the chat playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. 

:::image type="content" source="../media/quickstarts/chat-playground.png" alt-text="Screenshot of the playground page of the Azure AI studio with sections highlighted." lightbox="../media/quickstarts/chat-playground.png":::

You can experiment with the configuration settings such as temperature and pre-response text to improve the performance of your task. You can read more about each parameter in the [REST API](../reference.md).

- Selecting the **Generate** button will send the entered text to the completions API and stream the results back to the text box.
- Select the **Undo** button to undo the prior generation call.
- Select the **Regenerate** button to complete an undo and generation call together.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

In the chat playground you can also view Python and curl code samples prefilled according to your selected settings. Just select **View code** next to the examples dropdown. You can write an application to complete the same task with the OpenAI Python SDK, curl, or other REST API client.

## Publish a web app

> [!TIP]
> This web app can be used without using your data with Azure OpenAI. 

Once you're satisfied with the experience in the Studio, you can publish a web app directly from the 
Studio by selecting the **Publish** button. 

:::image type="content" source="../media/quickstarts/chatgpt-playground-publish-web-app.png" alt-text="A screenshot showing the button to publish a web app in Azure AI studio." lightbox="../media/quickstarts/chatgpt-playground-publish-web-app.png":::

The first time you publish a web app, you should select **Create a new web app**. Choose a name for the app, which will 
become part of the app URL. For example, `https://<appname>.azurewebsites.net`. 

Select your subscription, resource group, location, and pricing plan for the published app. To 
update an existing app, select **Publish to an existing web app** and choose the name of your previous 
app from the dropdown menu.

> [!WARNING]
> The web app you create is publicly accessible by default. Read below for information on adding authentication to your web app.

<!-- Add a feedback button here that says "I had trouble publishing a web app." -->

### Important considerations

* Publishing creates an Azure App Service in your subscription. It may incur costs depending on the 
pricing plan you select. When you're done with your app, you can delete it from the Azure portal.

* By default, the app will be published with a fully accessible, public URL. To add authentication (for example, restrict access to the 
app to members of your Azure tenant:

    1. Go to the [Azure portal](https://portal.azure.com/#home) and search for the app name you specified during publishing. Select the web app, and go to the **Authentication** tab on the left navigation menu. Then select **Add an identity provider**.
    
        :::image type="content" source="../media/quickstarts/web-app-authentication.png" alt-text="A screenshot showing the authentication tab for web apps in the Azure portal." lightbox="../media/quickstarts/web-app-authentication.png":::

    1. Select Microsoft as the identity provider. The default settings on this page will restrict the 
app to your tenant only, so you don't need to change anything else here. Then select **Add**

Now users will be asked to sign in with their Azure Active Directory account to be able to access your app. You can follow a similar process to add another identity provider if you prefer. The app doesn't use the user's login information in any other way other 
than verifying they are a member of your tenant.

