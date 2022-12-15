---
title: Get started with Document Translation
description: "How to create a Document Translation service using C#, Go, Java, Node.js, or Python programming languages and the REST API"
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 12/06/2022
ms.author: lajanuar
recommendations: false
ms.devlang: csharp, golang, java, javascript, python
ms.custom: mode-other
zone_pivot_groups: programming-languages-set-translator
---

# Get started with Document Translation *

 In this article, you'll learn to use Document Translation with HTTP REST API methods. Document Translation is a cloud-based feature of the [Azure Translator](../../translator-overview.md) service.  The Document Translation API enables the translation of whole documents while preserving source document structure and text formatting.

## Prerequisites

> [!NOTE]
>
> * In most instances, when you create a Cognitive Service resource in the Azure portal, you have the option to create a multi-service key or a single-service key. However, Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Cognitive Services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account.

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

  **Complete the Translator project and instance details fields as follows:**

  1. **Subscription**. Select one of your available Azure subscriptions.

  1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.

  1. **Resource Region**. Choose **Global** unless your business or application requires a specific region. If you're planning on using a [system-assigned managed identity](managed-identity.md) for authentication, choose a **non-global** region.

  1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.

     > [!NOTE]
     > Document Translation requires a custom domain endpoint. The value that you enter in the Name field will be the custom domain name parameter for your endpoint.

  1. **Pricing tier**. Document Translation isn't supported in the free tier. Select Standard S1 to try the service.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your resource has successfully deployed, select **Go to resource**.

## Your custom domain name and key

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You won't use the endpoint found on your Azure portal resource *Keys and Endpoint* page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

### What is the custom domain endpoint?

The custom domain endpoint is a URL formatted with your resource name, hostname, and Translator subdirectories:

```http
https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0
```

### Find your custom domain name

The **NAME-OF-YOUR-RESOURCE** (also called *custom domain name*) parameter is the value that you entered in the **Name** field when you created your Translator resource.

:::image type="content" source="../../media/instance-details.png" alt-text="Image of the Azure portal, create resource, instant details, name field.":::

### Get your key

Requests to the Translator service require a read-only key for authenticating access.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.
1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.
1. Copy and paste your key in a convenient location, such as *Microsoft Notepad*.
1. You'll paste it into the code below to authenticate your request to the Document Translation service.

:::image type="content" source="../../media/translator-keys.png" alt-text="Image of the get your key field in Azure portal.":::

## Create Azure blob storage containers

You'll need to  [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) for source and target files.

* **Source container**. This container is where you upload your files for translation (required).
* **Target container**. This container is where your translated files will be stored (required).

### **Required authentication**

The `sourceUrl` , `targetUrl` , and optional `glossaryUrl`  must include a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs. *See* [**Create SAS tokens for Document Translation process**](../how-to-guides/create-sas-tokens.md).

* Your **source** container or blob must have designated  **read** and **list** access.
* Your **target** container or blob must have designated  **write** and **list** access.
* Your **glossary** blob must have designated  **read** and **list** access.

> [!TIP]
>
> * If you're translating **multiple** files (blobs) in an operation, **delegate SAS access at the  container level**.
> * If you're translating a **single** file (blob) in an operation, **delegate SAS access at the blob level**.
> * As an alternative to SAS tokens, you can use a [**system-assigned managed identity**](../how-to-guides/create-use-managed-identities.md) for authentication.

## HTTP requests

A batch Document Translation request is submitted to your Translator service endpoint via a POST request. If successful, the POST method returns a `202 Accepted`  response code and the batch request is created by the service. The translated documents will be listed in your target container.

### HTTP headers

The following headers are included with each Document Translation API request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure key for your Translator or Cognitive Services resource.|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|

### POST request body properties

* The POST request URL is POST `https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0/batches`
* The POST request body is a JSON object named `inputs`.
* The `inputs` object contains both  `sourceURL` and `targetURL`  container addresses for your source and target language pairs.
* The `prefix` and `suffix` are case-sensitive strings to filter documents in the source path for translation. The `prefix` field is often used to delineate subfolders for translation. The `suffix` field is most often used for file extensions.
* A value for the  `glossaries`  field (optional) is applied when the document is being translated.
* The `targetUrl` for each target language must be unique.

>[!NOTE]
> If a file with the same name already exists in the destination, the job will fail.

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# programming](includes/csharp.md)]
::: zone-end

:::zone pivot="programming-language-go"

[!INCLUDE [Go programming](includes/go.md)]
::: zone-end

:: zone pivot="programming-language-rest-api"

::: zone pivot="programming-language-java"

[!INCLUDE [Java programming](includes/java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS programming](includes/javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python programming](includes/python.md)]
::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API](includes/rest-api.md)]
::: zone-end

