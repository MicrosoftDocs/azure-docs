---
title: What is Document Translation?
description: An overview of the cloud-based batch Document Translation service and process.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 01/22/2024
ms.author: lajanuar
ms.custom: references_regions
recommendations: false
---

# What is Document Translation?

Document Translation is a cloud-based feature of the [Azure AI Translator](../translator-overview.md) machine translation service that enable you to translate documents using our REST APIs and SDKs. The Document translation API enable you to translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format. Document Translation supports two translation operations:

* [Asynchronous](asynchronous-translation.md) document translation supports batch processing of multiple documents and files. The asynchronous translation process requires an Azure Blob storage account with containers for your source and translated documents.

  The following table highlights **asynchronous** document translation key features:

  | Feature | Description |
  | ---------| -------------|
  |**Translate large files**| Translate whole documents asynchronously.|
  |**Translate numerous files**|Translate multiple files across all supported languages and dialects while preserving document structure and data format.|
  |**Preserve source file presentation**| Translate files while preserving the original layout and format.|
  |**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
  |**Apply custom glossaries**|Translate documents using custom glossaries.|
  |**Automatically detect document language**|Let the Document Translation service determine the language of the document.|
  |**Translate documents with content in multiple languages**|Use the autodetect feature to translate documents with content in multiple languages into your target language.|

  For more information, see [Asynchronous document translation](asynchronous-translation.md)

* [Synchronous](synchronous-translation.md) document translation supports real-time processing of single-page files. The synchronous translation process does not require an Azure Blob storage account. The final response is returned directly to the calling client.

  The following table highlights **synchronous** document translation key features:

  |Feature | Description |
  | ---------| -------------|
  |**Translate single-page files**| The synchronous request accepts only a single document as input.|
  |**Preserve source file presentation**| Translate files while preserving the original layout and format.|
  |**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
  |**Apply custom glossaries**|Translate documents using custom glossaries.|
  |**Automatically detect document language**|Let the Document Translation service determine the language of the document.|

  For more information, see [Synchronous document translation](synchronous-translation.md)




## Data residency

Document Translation data residency depends on the Azure region where your Translator resource was created:

* Translator resources **created** in any region in Europe (except Switzerland) are **processed** at data center in North Europe and West Europe.
* Translator resources **created** in any region in Switzerland are **processed** at data center in Switzerland North and Switzerland West
* Translator resources **created** in any region in Asia Pacific or Australia are **processed** at data center in Southeast Asia and Australia East.
* Translator resource **created** in all other regions including Global, North America, and South America are **processed** at data center in East US and West US 2.

### Document Translation data residency

✔️ Feature: **Document Translation**</br>
✔️ Service endpoint:  **Custom:** &#8198;&#8198;&#8198; **`<name-of-your-resource.cognitiveservices.azure.com/translator/text/batch/v1.1`**

|Resource region| Request processing data center |
|----------------------------------|-----------------------|
|**Any region within Europe (except Switzerland)**| Europe — North Europe &bull; West Europe|
|**Switzerland**|Switzerland — Switzerland North &bull; Switzerland West|
|**Any region within Asia Pacific and Australia**| Asia — Southeast Asia &bull; Australia East|
|**All other regions including Global, North America, and South America**  | US — East US &bull; West US 2|

## Next steps

> [!div class="nextstepaction"]
> [Get Started with Document Translation](./quickstarts/document-translation-rest-api.md)
