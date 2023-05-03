---
title: Get started with Document Translation
description: "How to create a Document Translation service using C#, Go, Java, Node.js, or Python programming languages and the REST API"
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 03/22/2023
ms.author: lajanuar
recommendations: false
ms.devlang: csharp, golang, java, javascript, python
ms.custom: mode-other
zone_pivot_groups: programming-languages-set-translator
---

# Get started with Document Translation

Document Translation is a cloud-based feature of the [Azure Translator](../../translator-overview.md) service that asynchronously translates whole documents in [supported languages](../../language-support.md) and various [file formats](../overview.md#supported-document-formats). In this quickstart, learn to use Document Translation with a programming language of your choice to translate a source document into a target language while preserving structure and text formatting.

## Prerequisites

> [!NOTE]
>
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Cognitive Services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to [create containers](#create-azure-blob-storage-containers) in your Azure blob storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files are stored (required).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

  **Complete the Translator project and instance details fields as follows:**

  1. **Subscription**. Select one of your available Azure subscriptions.

  1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.

  1. **Resource Region**. Choose **Global** unless your business or application requires a specific region. If you're planning on using a [system-assigned managed identity](../how-to-guides/create-use-managed-identities.md) for authentication, choose a **geographic** region like **West US**.

  1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.

     > [!NOTE]
     > Document Translation requires a custom domain endpoint. The value that you enter in the Name field will be the custom domain name parameter for your endpoint.

  1. **Pricing tier**. Document Translation isn't supported in the free tier. **Select Standard S1 to try the service**.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your resource has successfully deployed, select **Go to resource**.

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Prerequisites)

### Retrieve your key and document translation endpoint

*Requests to the Translator service require a read-only key and custom endpoint to authenticate access. The custom domain endpoint is a URL formatted with your resource name, hostname, and Translator subdirectories and is available in the Azure portal.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. Copy and paste your **`key`** and **`document translation endpoint`** in a convenient location, such as *Microsoft Notepad*. Only one key is necessary to make an API call.

1. You paste your **`key`** and **`document translation endpoint`** into the code samples to authenticate your request to the Document Translation service.

    :::image type="content" source="../media/document-translation-key-endpoint.png" alt-text="Screenshot showing the get your key field in Azure portal.":::

> [!div class="nextstepaction"]
> [I ran into an issue retrieving my key and endpoint.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Retrieve-your-keys-and-endpoint)

## Create Azure blob storage containers

You need to [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) for source and target files.

* **Source container**. This container is where you upload your files for translation (required).
* **Target container**. This container is where your translated files are stored (required).

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

> [!div class="nextstepaction"]
> [I ran into an issue creating blob storage containers with authentication.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Create-blob-storage-containers)

### Sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx) for this quickstart. The source language is English.

## HTTP request

A batch Document Translation request is submitted to your Translator service endpoint via a POST request. If successful, the POST method returns a `202 Accepted`  response code and the service creates a batch request. The translated documents are listed in your target container.

For detailed information regarding Azure Translator Service request limits, *see* [**Document Translation request limits**](../../request-limits.md#document-translation).

### Headers

The following headers are included with each Document Translation API request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure key for your Translator or Cognitive Services resource.|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|

### POST request body

* The POST request body is a JSON object named `inputs`.
* The `inputs` object contains both  `sourceURL` and `targetURL`  container addresses for your source and target language pairs.
* The `prefix` and `suffix` are case-sensitive strings to filter documents in the source path for translation. The `prefix` field is often used to delineate subfolders for translation. The `suffix` field is most often used for file extensions.
* A value for the  `glossaries`  field (optional) is applied when the document is being translated.
* The `targetUrl` for each target language must be unique.

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# programming](includes/csharp.md)]
::: zone-end

:::zone pivot="programming-language-go"

[!INCLUDE [Go programming](includes/go.md)]
::: zone-end

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

That's it, congratulations! In this quickstart, you used Document Translation to translate a document while preserving it's original structure and data format.

## Next steps

Learn more about Document Translation:

> [!div class="nextstepaction"]
>[Document Translation REST API guide](../reference/rest-api-guide.md) </br></br>[Language support](../../language-support.md)
