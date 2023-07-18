---
title: "Document Translation C#/.NET or Python client library"
titleSuffix: Azure AI services
description: Use the Translator C#/.NET or Python client library (SDK) for cloud-based batch document translation service and process
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.custom: build-2023, devx-track-dotnet, devx-track-python
ms.topic: reference
ms.date: 07/18/2023
ms.author: lajanuar
zone_pivot_groups: programming-languages-document-sdk
---

# Document Translation client-library SDKs
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD001 -->

Document Translation is a cloud-based feature of the [Azure AI Translator](../../translator-overview.md) service that asynchronously translates whole documents in [supported languages](../../language-support.md) and various [file formats](../overview.md#supported-document-formats). In this quickstart, learn to use Document Translation with a programming language of your choice to translate a source document into a target language while preserving structure and text formatting.

> [!IMPORTANT]
>
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Azure AI services (multi-service) resource.
>
> * Document Translation is supported in paid tiers. The Language Studio only supports the S1 or D3 instance tiers. We suggest that you select Standard S1 to try Document Translation.  *See* [Azure AI services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).

## Prerequisites

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Azure AI services resource). If you're planning on using the Document Translation feature with [managed identity authorization](../how-to-guides/create-use-managed-identities.md), choose a geographic region such as **East US**. Select the **Standard S1 or D3** or pricing tier.

* An [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your Azure Blob Storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files are stored (required).

### Storage container authorization

You can choose one of the following options to authorize access to your Translator resource.

**✔️ Managed Identity**. A managed identity is a service principal that creates an Azure Active Directory (Azure AD) identity and specific permissions for an Azure managed resource. Managed identities enable you to run your Translator application without having to embed credentials in your code. Managed identities are a safer way to grant access to storage data and replace the requirement for you to include shared access signature tokens (SAS) with your source and target URLs.

To learn more, *see* [Managed identities for Document Translation](../how-to-guides/create-use-managed-identities.md).

  :::image type="content" source="../media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

**✔️ Shared Access Signature (SAS)**.  A shared access signature is a URL that grants restricted access for a specified period of time to your Translator service. To use this method, you need to create Shared Access Signature (SAS) tokens for your source and target containers. The `sourceUrl`  and `targetUrl` must include a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs. 

* Your **source** container or blob must have designated  **read** and **list** access.
* Your **target** container or blob must have designated  **write** and **list** access.

To learn more, *see* [**Create SAS tokens**](../how-to-guides/create-sas-tokens.md).

  :::image type="content" source="../media/sas-url-token.png" alt-text="Screenshot of a resource URI with a SAS token.":::

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# programming](includes/sdk/csharp.md)]
::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python programming](includes/sdk/python.md)]
::: zone-end

### Next step

> [!div class="nextstepaction"]
> [**Learn more about Document Translation operations**](../reference/rest-api-guide.md)
