---
title: How to create a Form Recognizer resource
titleSuffix: Azure Applied AI Services
description: Create a Form Recognizer resource in the Azure portal
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 08/22/2022
ms.author: bemabonsu
recommendations: false
#Customer intent: I want to learn how to use create a Form Recognizer service in the Azure portal.
---

# Create a Form Recognizer resource

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) that uses machine-learning models to extract key-value pairs, text, and tables from your documents. Here, you'll learn how to create a Form Recognizer resource in the Azure portal.

## Visit the Azure portal

The Azure portal is a single platform you can use to create and manage Azure services.

Let's get started:

1. Navigate to the Azure portal home page: [Azure home page](https://portal.azure.com/#home).

1. Select **Create a resource** from the Azure home page.

1. Search for and choose **Form Recognizer** from the search bar.

1. Select the **Create** button.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-one.gif" alt-text="Gif showing how to create a Form Recognizer resource.":::

## Create a resource

1. Next, you're going to fill out the **Create Form Recognizer** fields with the following values:

    * **Subscription**. Select your current subscription.
    * **Resource group**. The [Azure resource group](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group) that will contain your resource. You can create a new group or add it to a pre-existing group.
    * **Region**. Select your local region.
    * **Name**. Enter a name for your resource. We recommend using a descriptive name, for example *YourNameFormRecognizer*.
    * **Pricing tier**. The cost of your resource depends on the pricing tier you choose and your usage. For more information, see [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

1. Select **Review + Create**.

    :::image type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-two.png" alt-text="Still image showing the correct values for creating Form Recognizer resource.":::

1. Azure will run a quick validation check, after a few seconds you should see a green banner that says **Validation Passed**.

1. Once the validation banner appears, select the **Create** button from the bottom-left corner.

1. After you select create, you'll be redirected to a new page that says **Deployment in progress**. After a few seconds, you'll see a message that says, **Your deployment is complete**.

:::image type="content" source="media/logic-apps-tutorial/form-recognizer-validation.gif" alt-text="GIF showing the Azure portal validation process.":::

## Get Endpoint URL and keys

1. Once you receive the *deployment is complete* message, select the **Go to resource** button.

1. Copy the key and endpoint values from your Form Recognizer resource paste them in a convenient location, such as *Microsoft Notepad*. You'll need the key and endpoint values to connect your application to the Form Recognizer API.

1. If your overview page doesn't have the keys and endpoint visible, you can select the **Keys and Endpoint** button, on the left navigation bar, and retrieve them there.

    :::image border="true" type="content" source="media/containers/keys-and-endpoint.png" alt-text="Still photo showing how to access resource key and endpoint URL":::

That's it! You're now ready to start automating data extraction using Azure Form Recognizer.

## Next steps

* Try the [Form Recognizer Studio](concept-form-recognizer-studio.md), an online tool for visually exploring, understanding, and integrating features from the Form Recognizer service into your applications.

* Complete a Form Recognizer quickstart and get started creating a document processing app in the development language of your choice:

  * [C#](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)
  * [Python](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)
  * [Java](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)
  * [JavaScript](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)