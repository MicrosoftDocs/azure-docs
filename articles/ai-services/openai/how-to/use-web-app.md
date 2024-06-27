---
title: 'Using the Azure OpenAI web app'
titleSuffix: Azure OpenAI
description: Use this article to learn about using the available web app to chat with Azure OpenAI models.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
author: aahill
ms.author: aahi
ms.date: 05/09/2024
recommendations: false
---


# Use the Azure OpenAI web app

Along with Azure OpenAI Studio, APIs and SDKs, you can also use the available standalone web app to interact with Azure OpenAI models using a graphical user interface, which you can deploy using either Azure OpenAI studio or a [manual deployment](https://github.com/microsoft/sample-app-aoai-chatGPT). 

![A screenshot of the web app interface.](../media/use-your-data/web-app.png)

## Important considerations

- Publishing creates an Azure App Service in your subscription. It might incur costs depending on the [pricing plan](https://azure.microsoft.com/pricing/details/app-service/windows/) you select. When you're done with your app, you can delete it from the Azure portal.
- gpt-4 vision-preview models are not supported.
- By default, the app will be deployed with the Microsoft identity provider already configured, restricting access to the app to members of your Azure tenant. To add or modify authentication:
    1. Go to the [Azure portal](https://portal.azure.com/#home) and search for the app name you specified during publishing. Select the web app, and go to the **Authentication** tab on the left navigation menu. Then select **Add an identity provider**. 
    
        :::image type="content" source="../media/quickstarts/web-app-authentication.png" alt-text="Screenshot of the authentication page in the Azure portal." lightbox="../media/quickstarts/web-app-authentication.png":::

    1. Select Microsoft as the identity provider. The default settings on this page will restrict the app to your tenant only, so you don't need to change anything else here. Then select **Add**
    
    Now users will be asked to sign in with their Microsoft Entra ID account to be able to access your app. You can follow a similar process to add another identity provider if you prefer. The app doesn't use the user's sign-in information in any other way other than verifying they are a member of your tenant.

## Web app customization

You can customize the app's frontend and backend logic. The app provides several [environment variables](https://github.com/microsoft/sample-app-aoai-chatGPT#common-customization-scenarios-eg-updating-the-default-chat-logo-and-headers) for common customization scenarios such as changing the icon in the app. See the source code for the web app, and more information on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT).

When customizing the app, we recommend:

- Resetting the chat session (clear chat) if the user changes any settings. Notify the user that their chat history will be lost.

- Clearly communicating how each setting you implement will affect the user experience.

- When you rotate API keys for your Azure OpenAI or Azure AI Search resource, be sure to update the app settings for each of your deployed apps to use the new keys.

Sample source code for the web app is available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT). Source code is provided "as is" and as a sample only. Customers are responsible for all customization and implementation of their web apps. 

## Updating the web app

> [!NOTE]
> After February 1, 2024, the web app requires the app startup command to be set to `python3 -m gunicorn app:app`. When updating an app that was published prior to February 1, 2024, you need to manually add the startup command from the **App Service Configuration** page.

We recommend pulling changes from the `main` branch for the web app's source code frequently to ensure you have the latest bug fixes, API version, and improvements. Additionally, the web app must be synchronized every time the API version being used is [retired](../api-version-deprecation.md#retiring-soon). 

Consider either clicking the **watch** or **star** buttons on the web app's [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT) repo to be notified about changes and updates to the source code.

**If you haven't customized the app:**
* You can follow the synchronization steps below

**If you've customized or changed the app's source code:**
* You will need to update your app's source code manually and redeploy it.
    * If your app is hosted on GitHub, push your code changes to your repo, and use the synchronization steps below.
    * If you're redeploying the app manually (for example Azure CLI), follow the steps for your deployment strategy.


### Synchronize the web app

1. If you've customized your app, update the app's source code.
1. Navigate to your web app in the [Azure portal](https://portal.azure.com/).
1. Select **Deployment center** in the navigation menu, under **Deployment**.
1. Select **Sync** at the top of the screen, and confirm that the app will be redeployed. 

    :::image type="content" source="../media/use-your-data/sync-app.png" alt-text="A screenshot of web app synchronization button on the Azure portal." lightbox="../media/use-your-data/sync-app.png":::


## Chat history

You can enable chat history for your users of the web app. When you enable the feature, your users will have access to their individual previous queries and responses. 

To enable chat history, deploy or redeploy your model as a web app using [Azure OpenAI Studio](https://oai.azure.com/portal).

:::image type="content" source="../media/use-your-data/enable-chat-history.png" alt-text="A screenshot of the chat history enablement button on Azure OpenAI studio." lightbox="../media/use-your-data/enable-chat-history.png":::

> [!IMPORTANT]
> Enabling chat history will create a [Cosmos DB](/azure/cosmos-db/introduction) instance in your resource group, and incur [additional charges](https://azure.microsoft.com/pricing/details/cosmos-db/autoscale-provisioned/) for the storage used. 

Once you've enabled chat history, your users will be able to show and hide it in the top right corner of the app. When the history is shown, they can rename, or delete conversations. As they're logged into the app, conversations will be automatically ordered from newest to oldest, and named based on the first query in the conversation. 

:::image type="content" source="../media/use-your-data/web-app-chat-history.png" alt-text="A screenshot of the chat history in the web app." lightbox="../media/use-your-data/web-app-chat-history.png":::

## Deleting your Cosmos DB instance

Deleting your web app does not delete your Cosmos DB instance automatically. To delete your Cosmos DB instance, along with all stored chats, you need to navigate to the associated resource in the [Azure portal](https://portal.azure.com) and delete it. If you delete the Cosmos DB resource but keep the chat history option enabled on the studio, your users will be notified of a connection error, but can continue to use the web app without access to the chat history.

## Next steps
* [Prompt engineering](../concepts/prompt-engineering.md)
* [Azure OpenAI on your data](../concepts/use-your-data.md)