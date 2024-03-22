---
title: Create a Document Intelligence (formerly Form Recognizer) resource
titleSuffix: Azure AI services
description: Create a Document Intelligence resource in the Azure portal
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: bemabonsu
---


# Create a Document Intelligence resource

::: moniker range="<=doc-intel-4.0.0"
 [!INCLUDE [applies to v4.0 v3.1 v3.0 v2.1](includes/applies-to-v40-v31-v30-v21.md)]
::: moniker-end

Azure AI Document Intelligence is a cloud-based [Azure AI service](../../ai-services/index.yml) that uses machine-learning models to extract key-value pairs, text, and tables from your documents. In this article, learn how to create a Document Intelligence resource in the Azure portal.

## Visit the Azure portal

The Azure portal is a single platform you can use to create and manage Azure services.

Let's get started:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** from the Azure home page.

1. Search for and choose **Document Intelligence** from the search bar.

1. Select the **Create** button.

## Create a resource

1. Next, you're going to fill out the **Create Document Intelligence** fields with the following values:

    * **Subscription**. Select your current subscription.
    * **Resource group**. The [Azure resource group](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group) that contains your resource. You can create a new group or add it to a pre-existing group.
    * **Region**. Select your local region.
    * **Name**. Enter a name for your resource. We recommend using a descriptive name, for example *YourNameFormRecognizer*.
    * **Pricing tier**. The cost of your resource depends on the pricing tier you choose and your usage. For more information, see [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

1. Select **Review + Create**.

    :::image type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-two.png" alt-text="Still image showing the correct values for creating Document Intelligence resource.":::

1. Azure will run a quick validation check, after a few seconds you should see a green banner that says **Validation Passed**.

1. Once the validation banner appears, select the **Create** button from the bottom-left corner.

1. After you select create, you'll be redirected to a new page that says **Deployment in progress**. After a few seconds, you'll see a message that says, **Your deployment is complete**.

## Get Endpoint URL and keys

1. Once you receive the *deployment is complete* message, select the **Go to resource** button.

1. Copy the key and endpoint values from your Document Intelligence resource paste them in a convenient location, such as *Microsoft Notepad*. You need the key and endpoint values to connect your application to the Document Intelligence API.

1. If your overview page doesn't have the keys and endpoint visible, you can select the **Keys and Endpoint** button, on the left navigation bar, and retrieve them there.

    :::image border="true" type="content" source="media/containers/keys-and-endpoint.png" alt-text="Still photo showing how to access resource key and endpoint URL":::

That's it! You're now ready to start automating data extraction using Azure AI Document Intelligence.

## Next steps

* Try the [Document Intelligence Studio](concept-document-intelligence-studio.md), an online tool for visually exploring, understanding, and integrating features from the Document Intelligence service into your applications.

* Complete a Document Intelligence quickstart and get started creating a document processing app in the development language of your choice:

  * [C#](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)
  * [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)
  * [Java](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)
  * [JavaScript](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)
