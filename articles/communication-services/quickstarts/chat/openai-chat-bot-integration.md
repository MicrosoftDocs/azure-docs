---
title: Integrate an OpenAI bot with chat
titleSuffix: An Azure Communication Services article 
description: This article describes how to integrate an Azure OpenAI bot in a chat app using Azure Communication Service, Azure Bot Service, and Azure Web App Service. 
author: angellan
manager: potsang
services: azure-communication-services
ms.author: angellan
ms.date: 04/29/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Integrate an OpenAI bot with chat

This article demonstrates how to integrate a conversational OpenAI bot with an Azure Communication Services chat. The OpenAI chat bot uses [Microsoft Bot Framework](https://dev.botframework.com) integrated with [Semantic Kernel](https://github.com/microsoft/semantic-kernel). The OpenAI bot retrieves and summarizes responses from an internal knowledge base to answer user questions in natural language.

:::image type="content" source="./media/chat-azure-open-ai-architecture.png" alt-text="Azure OpenAI Architecture Diagram.":::

## Step 1: Deploy a Base Model with Azure AI Foundry

1. In the Azure AI Foundry portal, follow the [Create a project](/azure/ai-foundry/how-to/create-projects?tabs=ai-studio#create-a-project) article to create a new project. When prompted, create a new hub and accept all default settings.

1. Open your project, go to **Included capabilities**, select **Azure OpenAI Service**, and save both the API key and the service endpoint URL.

   :::image type="content" source="./media/azure-ai-foundry-overview.png" alt-text="Screenshot that shows the overview page of Azure AI Foundry portal.":::

1. In the left-hand menu, navigate to **My assets → Models + endpoints**. Then click **+ Deploy Model** and choose **Deploy base model**.

   :::image type="content" source="./media/azure-ai-foundry-model-deployment.png" alt-text="Screenshot of the Manage deployments of your models and services page showing the Deploy base model menu item selected.":::

1. Select **gpt-4o** and click **Confirm**.

   :::image type="content" source="./media/azure-ai-foundry-model-deployment-2.png" alt-text="Screenshot of the Select a model dialog box showing gpt-4o selected.":::

1. Enter a deployment name of your choice, then click **Connect and deploy**.

   :::image type="content" source="./media/azure-ai-foundry-model-deployment-3.png" alt-text="Screenshot of the Deploy gpt-4o dialog box showing gpt-4o as the Deployment name.":::

1. Once deployment completes, return to **Models + endpoints** to verify that your model is running. In this example, the deployed model is **gpt-4o**.

   :::image type="content" source="./media/azure-ai-foundry-model-deployment-4.png" alt-text="Screenshot of the Models and endpoints asset showing gtp-4o as the deployed model and related deployment info.":::

## Step 2: Create a Web App resource

1. In the Azure portal, select **Create a resource**. In the search box, enter **web app**. Select the **Web App** tile.
  
   :::image type="content" source="./media/web-app.png" alt-text="Screenshot that shows creating a web app resource in the Azure portal.":::

1. In **Create Web App**, select or enter details for the app, including the region where you want to deploy the app.
  
   :::image type="content" source="./media/azure-openai-demo-web-app-create-options.png" alt-text="Screenshot of the Create Web App page showing Project details and Instance details selected to create a web app deployment.":::

1. Select **Review + Create** to validate the deployment and review the deployment details. Then, select **Create**.

1. When the web app resource is created, copy the hostname URL shown in the resource details. The URL is part of the endpoint you create for the web app.
  
   :::image type="content" source="./media/web-app-endpoint.png" alt-text="Screenshot of the My-First-Bot-WebApp page showing the web app endpoint URL you need to copy for future use.":::

## Step 3: Create an Azure Bot Service resource

1. In the Azure portal, select **Create a resource**. In the search box, enter **bot**. Select the **Azure Bot** tile.
  
   :::image type="content" source="./media/bot-service-create-resource.png" alt-text="Screenshot of the Azure bot tile showing details needed to create an Azure bot service.":::

1. In **Create an Azure Bot**, select **Multi Tenant** as Type of App and **Create new Microsoft App ID"** as Creation Type.

1. Select **Review + Create** to validate the deployment and review the deployment details. Then, select **Create**.

1. [Get the bot app ID and create the password](/azure/bot-service/abs-quickstart). Record these values to use for later configurations.

## Step 4: Create a messaging endpoint for the bot

Azure Bot Service typically expects the Bot Application Web App Controller to expose an endpoint in the form `/api/messages`. The endpoint handles all messages sent to the bot.
Next, in the bot resource, create a web app messaging endpoint:

1. In Azure portal, go to your Azure Bot resource. From the resource menu, select **Configuration**.

1. In Configuration, for Messaging endpoint, paste the hostname URL of the web app you copied in the preceding section. Append the URL with `/api/messages`.

1. Select **Apply**.

:::image type="content" source="./media/smaller-bot-configure-with-endpoint.png" alt-text="Screenshot that shows how to create a bot messaging endpoint by using the web app hostname." lightbox="./media/bot-configure-with-endpoint.png":::

## Step 5: Create an Azure Communication Service Resource

1. In Azure portal, select **Create a resource**. In the search box, enter **communication services**. Select the **Communication Services** tile.
 
   :::image type="content" source="./media/communication-service.png" alt-text="Screenshot of the Communication Services tile showing the details you need to create an Azure Communication Services Resource.":::

1. In **Create an Azure Communication Service**, you can specify the subscription, the resource group, the name of the Communication Services resource, and the geography associated with the resource.

1. Select **Review + Create** to validate the deployment and review the deployment details. Then select **Create**.

1. Go to the resource. Select **Settings - Identities & User Access Tokens** > **Chat**, then click **Generate**. Save the **Identity** and **User Access Token** for future use.

   :::image type="content" source="./media/communication-services-resource-create-token-and-user.png" alt-text="Screenshot that shows how to create a Communication Services user id and access token":::

## Step 6: Enable the Communication Services Chat channel

When you have a Communication Services resource, you can set up a Communication Services channel in the bot resource. This process generates a Bot Azure Communication Services User ID for the bot.

1. In the Azure portal, go to your Azure Bot resource. In the resource menu, select **Channels**. In the list of available channels, select **Communication Services - Chat**.

   :::image type="content" source="./media/bot-communication-services-chat-channel.png" alt-text="Screenshot that shows opening the Communication Services Chat channel." lightbox="./media/bot-communication-services-chat-channel.png":::

1. Select **Connect** to see a list of Communication Services resources that are available in your subscription.

   :::image type="content" source="./media/smaller-bot-connect-communication-services-chat-channel.png" alt-text="Screenshot that shows how to connect a Communication Service resource to the bot." lightbox="./media/bot-connect-communication-services-chat-channel.png":::

1. In the **New Connection** pane, select the Communication Services chat resource, and then select **Apply**.

   :::image type="content" source="./media/smaller-bot-choose-resource.png" alt-text="Screenshot that shows how to save the selected Communication Service resource to create a new Communication Services user ID." lightbox="./media/bot-choose-resource.png":::

1. When the resource details are verified, a Bot Azure Communication Services User ID is shown in the **Bot Azure Communication Services Id** column. Save the ID for later use.

   :::image type="content" source="./media/smaller-communication-services-chat-channel-saved.png" alt-text="Screenshot that shows the new Communication Services user ID assigned to the bot." lightbox="./media/communication-services-chat-channel-saved.png":::

## Step 7: Deploy the web app

1. Open the `ChatBot` folder in the [Sample Repo](https://github.com/Azure/ai-solution-with-azurecommunicationchat) in Visual Studio Code (VS Code). Make sure to use VS Code because it supports Microsoft Entra ID in code deployment.

1. Replace the placeholders in the sample repo with actual values:

   1. In the `SemanticKernelService.cs` file, populate the values for variables `modelId`, `endpoint`, and `apiKey`.
   1. In the `appsettings.json` file, populate the values for variables `MicrosoftAppId` and `MicrosoftAppPassword` using the `bot app id` and the `bot password` you recorded in **Step 3**.

1. Install the Azure App Service extension in VS Code.

   :::image type="content" source="./media/install-app-service-extension.png" alt-text="Screenshot that shows how to install the app service extension." lightbox="./media/install-app-service-extension.png":::

1. Sign in to your Azure account in VS Code. To access the sign in panel, click the Azure icon from the Activity Bar on the side of the window.

1. Install the Azure App Service extension in VS Code.

   :::image type="content" source="./media/azure-sign-in.png" alt-text="Screenshot that shows how to sign in to your Azure account in VS Code." lightbox="./media/azure-sign-in.png":::

1. Build the project by running the following command in the root directory of the 'ChatBot' project.

   ```
   dotnet publish -c Release -o ./bin/Publish
   ```

This command generates the `bin` and `obj` folders.

1. To deploy the Web App, right-click on the new `/bin/Publish` folder and select **Deploy to Web App**.

   :::image type="content" source="./media/web-app-deploy.png" alt-text="Screenshot that shows how to choose the folder for deployment.":::

1. Choose the Azure App Service web app you want to deploy the application to. Confirm the deployment.

   :::image type="content" source="./media/web-app-deploy-2.png" alt-text="Screenshot that shows how to deploy the web app to Azure.":::

## Step 8: Run the demo

1. Follow the steps before "Get a chat thread client" in [Add Chat to your App](./get-started.md) to create a chat app and start a thread.

   Key notes:

   - You already created the Azure Communication Service resource in the portal, so you can directly use the `<Azure Communication Services endpoint>`, `<Access_ID>`, and `<Access_Token>` in your code.
   - When creating a thread, you need to create another `ChatParticipant` object, using the `Bot Azure Communication Services User ID` created in **Step 6: Enable the Communication Services Chat channel** as the `<Access_ID>` to represent the bot user.
   - Save the `Thread Id` for later use.

2. Open the UI Library composite: [Azure Communication Services Chat Thread UI - Join Existing Chat Thread](https://azure.github.io/communication-ui-library/?path=/story/composites-chatcomposite-join-existing-chat-thread--join-existing-chat-thread).

3. Provide the required information to join an existing Chat Thread.

   - Display name: You can choose the one you prefer.
   - User Identifier for user: the `<Access_ID>` saved in step **8.1**.
   - Valid token for user: the `<Access_Token>` saved in step **8.1**.
   - Azure Communication Services endpoint: the `<Azure Communication Services endpoint>` saved in step **8.1**.
   - Existing thread: the `Thread Id` saved in step **8.1**.

4. Ask the following questions in sequence:

   - **Questions 1:** My user ID is 110. I bought a laptop several days ago. Could you help to track the delivery?
   - **Question 2:** I requested a return for my Power Bank. Any updates?
   - **Question 3:** I bought Bluetooth Earphones 2 days ago, but they haven’t been shipped yet. Why?

OpenAI retrieves the data relevant to the semantics of the question and provides an answer based on available data.

## Trademarks

This project might contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).

Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.

Any use of third-party trademarks or logos are subject to those third-party's policies.

## Related articles

- [Add a bot to your chat app](./quickstart-botframework-integration.md).
- [Join Existing Chat Thread](https://azure.github.io/communication-ui-library/?path=/story/composites-chatcomposite-join-existing-chat-thread--join-existing-chat-thread) from Azure Communication Services Chat Thread UI Library.
