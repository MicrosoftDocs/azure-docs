---
title: Get started with synchronous document translation
description: "How to translate documents synchronously using the REST API"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 01/23/2024
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Get started with synchronous document translation

Document Translation is a cloud-based machine translation feature of the [Azure AI Translator](../../translator-overview.md) service.  You can translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format.

Synchronous document translation supports immediate-response processing of single-page files. The synchronous translation process doesn't require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.

Let's get started.

## Prerequisites

You need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* Once you have your Azure subscription, create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * You need the key and endpoint from the resource to connect your application to the Translator service. You paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page:

    :::image type="content" source="../../media/quickstarts/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

    > [!NOTE]
    >
    > * For this quickstart we recommend that you use a Translator text single-service global resource.
    > * With a single-service global resource you'll include one authorization header (**Ocp-Apim-Subscription-key**) with the REST API request. The value for Ocp-Apim-Subscription-key is your Azure secret key for your Translator Text subscription.
    > * If you choose to use an Azure AI multi-service or regional Translator resource, two authentication headers will be required: (**Ocp-Api-Subscription-Key** and **Ocp-Apim-Subscription-Region**). The value for Ocp-Apim-Subscription-Region is the region associated with your subscription.

## Headers

To call the synchronous document translation feature via the [REST API](../reference/synchronous-rest-api-guide.md), you need to include the following headers with each request. Don't worry, we include the headers for you in the sample code for each programming language.

Header|Value| Condition  |
|--- |:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|&bullet; ***Required***|
|**Ocp-Apim-Subscription-Region**|The region where your resource was created. |&bullet; ***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</br>&bullet; ***Optional*** when using a single-service global Translator Resource.
|**Content-Type**|The content type of the payload. The accepted value is **application/json** or **charset=UTF-8**.|&bullet; **Required**|

