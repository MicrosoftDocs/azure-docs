---
title: Deploy a web app for chat on your data in the Azure AI Studio playground
titleSuffix: Azure AI Studio
description: Use this article to deploy a web app for chat on your data in the Azure AI Studio playground.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: tutorial
ms.date: 10/1/2023
ms.author: eur
---

# Tutorial: Deploy a web app for chat on your data

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you deploy a chat web app that uses your own data with an Azure OpenAI Service model.

You upload your local data files to Azure Blob storage and create an Azure AI Search index. Your data source is used to help ground the model with specific data. Grounding means that the model uses your data to help it understand the context of your question. You're not changing the deployed model itself. Your data is stored separately and securely in your Azure subscription. For more information, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data). 

The steps in this tutorial are:

1. Deploy and test a chat model without your data
1. Add your data
1. Test the model with your data
1. Deploy your web app


## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../../ai-services/openai/how-to/create-resource.md).

- You need at least one file to upload that contains example data. To complete this tutorial, use the product information samples from the [Azure/aistudio-copilot-sample repository on GitHub](https://github.com/Azure/aistudio-copilot-sample/tree/main/data). Specifically, the [product_info_11.md](https://github.com/Azure/aistudio-copilot-sample/blob/main/data/3-product-info/product_info_11.md) contains product information about the TrailWalker hiking shoes that's relevant for this tutorial example. You can download the file or copy its contents to a file named `product_info_11.md` on your local computer.

## Deploy and test a chat model without your data

Follow these steps to deploy a chat model and test it without your data. 

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio) with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource. You should be on the Azure AI Studio **Home** page.
1. Select **Build** from the top menu and then select **Deployments** > **Create**.
    
    :::image type="content" source="../media/tutorials/chat-web-app/deploy-create.png" alt-text="Screenshot of the deployments page without deployments." lightbox="../media/tutorials/chat-web-app/deploy-create.png":::

1. On the **Select a model** page, select the model you want to deploy from the **Model** dropdown. For example, select **gpt-35-turbo-16k**. Then select **Confirm**.

    :::image type="content" source="../media/tutorials/chat-web-app/deploy-gpt-35-turbo-16k.png" alt-text="Screenshot of the model selection page." lightbox="../media/tutorials/chat-web-app/deploy-gpt-35-turbo-16k.png":::

1. On the **Deploy model** page, enter a name for your deployment, and then select **Deploy**. After the deployment is created, you see the deployment details page. Details include the date you created the deployment and the created date and version of the model you deployed.
1. On the deployment details page from the previous step, select **Test in playground**.

    :::image type="content" source="../media/tutorials/chat-web-app/deploy-gpt-35-turbo-16k-details.png" alt-text="Screenshot of the GPT chat deployment details." lightbox="../media/tutorials/chat-web-app/deploy-gpt-35-turbo-16k-details.png":::

1. In the playground, make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/tutorials/chat-web-app/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/tutorials/chat-web-app/playground-chat.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You're an AI assistant that helps people find information." You can tailor the prompt for your scenario. 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "How much are the TrailWalker hiking shoes", and then select the right arrow icon to send.

    :::image type="content" source="../media/tutorials/chat-web-app/chat-without-data.png" alt-text="Screenshot of the first chat question without grounding data." lightbox="../media/tutorials/chat-web-app/chat-without-data.png":::

1. The assistant replies that it doesn't know the answer. This is because the model doesn't have access to product information about the TrailWalker hiking shoes. 

    :::image type="content" source="../media/tutorials/chat-web-app/assistant-reply-not-grounded.png" alt-text="Screenshot of the assistant's reply without grounding data." lightbox="../media/tutorials/chat-web-app/assistant-reply-not-grounded.png":::

In the next section, you'll add your data to the model to help it answer questions about your products.

## Add your data

Follow these steps to add your data to the playground to help the assistant answer questions about your products. You're not changing the deployed model itself. Your data is stored separately and securely in your Azure subscription. 

1. If you aren't already in the playground, select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. On the **Assistant setup** pane, select **Add your data (preview)** > **+ Add a data source**.

    :::image type="content" source="../media/tutorials/chat-web-app/add-your-data.png" alt-text="Screenshot of the chat playground with the option to add a data source visible." lightbox="../media/tutorials/chat-web-app/add-your-data.png":::

1. In the **Select or add data source** page that appears, select **Upload files** from the **Select data source** dropdown. 

    :::image type="content" source="../media/tutorials/chat-web-app/add-your-data-source.png" alt-text="Screenshot of the data source selection options." lightbox="../media/tutorials/chat-web-app/add-your-data-source.png":::

    > [!TIP]
    > For data source options and supported file types and formats, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data). 

1. Enter your data source details:

    :::image type="content" source="../media/tutorials/chat-web-app/add-your-data-source-details.png" alt-text="Screenshot of the resources and information required to upload files." lightbox="../media/tutorials/chat-web-app/add-your-data-source-details.png":::

    > [!NOTE]
    > Azure OpenAI needs both a storage resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 

    - **Subscription**: Select the Azure subscription that contains the Azure OpenAI resource you want to use.
    - **Storage resource**: Select the Azure Blob storage resource where you want to upload your files. 
    - **Data source**: Select an existing Azure AI Search index, Azure Storage container, or upload local files as the source we'll build the grounding data from. Your data is stored securely in your Azure subscription.
    - **Index name**: Select the Azure AI Search resource where the index used for grounding is created. A new search index with the provided name is generated after data ingestion is complete.

1. Select your Azure AI Search resource, and select the acknowledgment that connecting it incurs usage on your account. Then select **Next**.
1. On the **Upload files** pane, select **Browse for a file** and select the files you want to upload. Select the `product_info_11.md` file you downloaded or created earlier. See the [prerequisites](#prerequisites). If you want to upload more than one file, do so now. You won't be able to add more files later in the same playground session.
1. Select **Upload** to upload the file to your Azure Blob storage account. Then select **Next**.

   :::image type="content" source="../media/tutorials/chat-web-app/add-your-data-uploaded.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/tutorials/chat-web-app/add-your-data-uploaded.png":::

1. On the **Data management** pane under **Search type**, select **Keyword**. This setting helps determine how the model responds to requests. Then select **Next**.
    
    > [!NOTE]
    > If you had added vector search on the **Select or add data source** page, then more options would be available here for an additional cost. For more information, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data).
    
1. Review the details you entered, and select **Save and close**. You can now chat with the model and it uses information from your data to construct the response.

    :::image type="content" source="../media/tutorials/chat-web-app/add-your-data-review-finish.png" alt-text="Screenshot of the review and finish page for adding data." lightbox="../media/tutorials/chat-web-app/add-your-data-review-finish.png":::

1. Now on the **Assistant setup** pane, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

   :::image type="content" source="../media/tutorials/chat-web-app/add-your-data-ingestion-in-progress.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/tutorials/chat-web-app/add-your-data-ingestion-in-progress.png":::

1. You can now chat with the model asking the same question as before ("How much are the TrailWalker hiking shoes"), and this time it uses information from your data to construct the response. You can expand the **references** button to see the data that was used.

   :::image type="content" source="../media/tutorials/chat-web-app/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/tutorials/chat-web-app/chat-with-data.png":::

### Remarks about adding your data

Although it's beyond the scope of this tutorial, to understand more about how the model uses your data, you can export the playground setup to prompt flow. 

:::image type="content" source="../media/tutorials/chat-web-app/prompt-flow-open.png" alt-text="Screenshot of the chat playground with the open in prompt flow button in view." lightbox="../media/tutorials/chat-web-app/prompt-flow-open.png":::

Following through from there you can see the graphical representation of how the model uses your data to construct the response. For more information about prompt flow, see [prompt flow](../how-to/prompt-flow.md).

## Deploy your web app

Once you're satisfied with the experience in Azure AI Studio, you can deploy the model as a standalone web application. 

### Find your resource group in the Azure portal

In this tutorial, your web app is deployed to the same resource group as your Azure AI resource. Later you configure authentication for the web app in the Azure portal.

Follow these steps to navigate from Azure AI Studio to your resource group in the Azure portal:

1. In Azure AI Studio, select **Manage** from the top menu and then select **Details**. If you have multiple Azure AI resources, select the one you want to use in order to see its details.
1. In the **Resource configuration** pane, select the resource group name to open the resource group in the Azure portal. In this example, the resource group is named `rg-docsazureairesource`.

    :::image type="content" source="../media/tutorials/chat-web-app/resource-group-manage-page.png" alt-text="Screenshot of the resource group in the Azure AI Studio." lightbox="../media/tutorials/chat-web-app/resource-group-manage-page.png":::

1. You should now be in the Azure portal, viewing the contents of the resource group where you deployed the Azure AI resource.

    :::image type="content" source="../media/tutorials/chat-web-app/resource-group-azure-portal.png" alt-text="Screenshot of the resource group in the Azure portal." lightbox="../media/tutorials/chat-web-app/resource-group-azure-portal.png":::

    Keep this page open in a browser tab - you return to it later.


### Deploy the web app

Publishing creates an Azure App Service in your subscription. It might incur costs depending on the [pricing plan](https://azure.microsoft.com/pricing/details/app-service/windows/) you select. When you're done with your app, you can delete it from the Azure portal.

To deploy the web app:

1. Complete the steps in the previous section to [add your data](#add-your-data) to the playground. 

    > [!NOTE]
    > You can deploy a web app with or without your own data, but at least you need a deployed model as described in [deploy and test a chat model without your data](#deploy-and-test-a-chat-model-without-your-data).

1. Select **Deploy** > **A new web app**.

    :::image type="content" source="../media/tutorials/chat-web-app/deploy-web-app.png" alt-text="Screenshot of the deploy new web app button." lightbox="../media/tutorials/chat-web-app/deploy-web-app.png":::

1. On the **Deploy to a web app** page, enter the following details:
    - **Name**: A unique name for your web app.
    - **Subscription**: Your Azure subscription.
    - **Resource group**: Select a resource group in which to deploy the web app. You can use the same resource group as the Azure AI resource.
    - **Location**: Select a location in which to deploy the web app. You can use the same location as the Azure AI resource.
    - **Pricing plan**: Choose a pricing plan for the web app.
    - **Enable chat history in the web app**: For the tutorial, make sure this box isn't selected.
    - **I acknowledge that web apps will incur usage to my account**: Selected

1. Wait for the app to be deployed, which might take a few minutes. 

    :::image type="content" source="../media/tutorials/chat-web-app/deploy-web-app-in-progress.png" alt-text="Screenshot of the playground with notification that the web app deployment is in progress." lightbox="../media/tutorials/chat-web-app/deploy-web-app-in-progress.png":::

1. When it's ready, the **Launch** button is enabled on the toolbar. But don't launch the app yet and don't close the **Playground** page - you return to it later.

### Configure web app authentication

By default, the web app will only be accessible to you. In this tutorial, you add authentication to restrict access to the app to members of your Azure tenant. Users are asked to sign in with their Microsoft Entra account to be able to access your app. You can follow a similar process to add another identity provider if you prefer. The app doesn't use the user's sign in information in any other way other than verifying they're a member of your tenant.

1. Return to the browser tab containing the Azure portal (or re-open the [Azure portal](https://portal.azure.com?azure-portal=true) in a new browser tab) and view the contents of the resource group where you deployed the Azure AI resource and web app (you might need to refresh the view the see the web app).

1. Select the **App Service** resource from the list of resources in the resource group.

1. From the collapsible left menu under **Settings**, select **Authentication**. 

    :::image type="content" source="../media/tutorials/chat-web-app/azure-portal-app-service.png" alt-text="Screenshot of web app authentication menu item under settings in the Azure portal." lightbox="../media/tutorials/chat-web-app/azure-portal-app-service.png":::

1. Add an identity provider with the following settings:
    - **Identity provider**: Select Microsoft as the identity provider. The default settings on this page restrict the app to your tenant only, so you don't need to change anything else here. 
    - **Tenant type**: Workforce
    - **App registration**: Create a new app registration
    - **Name**: *The name of your web app service*
    - **Supported account types**: Current tenant - Single tenant
    - **Restrict access**: Requires authentication
    - **Unauthenticated requests**: HTTP 302 Found redirect - recommended for websites

### Use the web app

You're almost there! Now you can test the web app.

1. Wait 10 minutes or so for the authentication settings to take effect.
1. Return to the browser tab containing the **Playground** page in Azure AI Studio.
1. Select **Launch** to launch the deployed web app. If prompted, accept the permissions request.

    *If the authentication settings haven't yet taken effect, close the browser tab for your web app and return to the **Playground** page in Azure AI Studio. Then wait a little longer and try again.*

1. In your web app, you can ask the same question as before ("How much are the TrailWalker hiking shoes"), and this time it uses information from your data to construct the response. You can expand the **references** button to see the data that was used.

   :::image type="content" source="../media/tutorials/chat-web-app/chat-with-data-web-app.png" alt-text="Screenshot of the chat experience via the deployed web app." lightbox="../media/tutorials/chat-web-app/chat-with-data-web-app.png":::

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this tutorial if they're no longer needed. You can delete a resource group or individual resources Azure portal or Azure CLI. For more information, see:

- [Azure portal](https://portal.azure.com?azure-portal=true)
- [Azure CLI](/cli/azure)

## Next steps

* Learn more about what you can do in the [Azure AI Studio](../what-is-ai-studio.md).
* Get answers to frequently asked questions in the [Azure AI FAQ article](../what-is-ai-studio.md).
