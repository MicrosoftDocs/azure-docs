---
title: Get started with Document Translation
description: "How to create a Document Translation service using C#, Go, Java, Node.js, or Python programming languages and the REST API"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
ms.devlang: csharp, golang, java, javascript, python
ms.custom: mode-other, devx-track-dotnet, devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-translator
---

# Get started with Document Translation

Document Translation is a cloud-based feature of the [Azure AI Translator](../../translator-overview.md) service that asynchronously translates whole documents in [supported languages](../../language-support.md) and various [file formats](../overview.md#supported-document-formats). In this quickstart, learn to use Document Translation with a programming language of your choice to translate a source document into a target language while preserving structure and text formatting.

## Prerequisites

> [!IMPORTANT]
>
> * Java and JavaScript Document Translation SDKs are currently available in **public preview**. Features, approaches and processes may change, prior to the general availability (GA) release, based on user feedback.
> * C# and Python SDKs are general availability (GA) releases ready for use in your production applications
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Azure AI services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Azure AI services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to [create containers](#create-azure-blob-storage-containers) in your Azure Blob Storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files are stored (required).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Azure AI services resource):

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

<!-- > [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Prerequisites) -->

### Retrieve your key and document translation endpoint

*Requests to the Translator service require a read-only key and custom endpoint to authenticate access. The custom domain endpoint is a URL formatted with your resource name, hostname, and Translator subdirectories and is available in the Azure portal.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. Copy and paste your **`key`** and **`document translation endpoint`** in a convenient location, such as *Microsoft Notepad*. Only one key is necessary to make an API call.

1. You paste your **`key`** and **`document translation endpoint`** into the code samples to authenticate your request to the Document Translation service.

    :::image type="content" source="../media/document-translation-key-endpoint.png" alt-text="Screenshot showing the get your key field in Azure portal.":::

<!-- > [!div class="nextstepaction"]
> [I ran into an issue retrieving my key and endpoint.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Retrieve-your-keys-and-endpoint) -->

## Create Azure Blob Storage containers

You need to [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) for source and target files.

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

<!-- > [!div class="nextstepaction"]
> [I ran into an issue creating blob storage containers with authentication.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?Pillar=Language&Product=Document-translation&Page=quickstart&Section=Create-blob-storage-containers) -->

### Sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx) for this quickstart. The source language is English.

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# programming](includes/rest-api/csharp.md)]
::: zone-end

:::zone pivot="programming-language-go"

[!INCLUDE [Go programming](includes/rest-api/go.md)]
::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java programming](includes/rest-api/java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS programming](includes/rest-api/javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python programming](includes/rest-api/python.md)]
::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API](includes/rest-api/rest-api.md)]
::: zone-end

That's it, congratulations! In this quickstart, you used Document Translation to translate a document while preserving it's original structure and data format.

## Next steps


