---
title: Create and use a glossary with Document Translation
description: How to create and use a glossary with Document Translation.
ms.topic: how-to
ms.service: azure-ai-translator
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 07/18/2023
---

# Use glossaries with Document Translation

A glossary is a list of terms with definitions that you create for the Document Translation service to use during the translation process. Currently, the glossary feature supports one-to-one source-to-target language translation. Common use cases for glossaries include:

* **Context-specific terminology**. Create a glossary that designates specific meanings for your unique context.

* **No translation**. For example, you can restrict Document Translation from translating product name brands by using a glossary with the same source and target text.

* **Specified translations for ambiguous words**. Choose a specific translation for poly&#8203;semantic words.

## Create, upload, and use a glossary file

1. **Create your glossary file.** Create a file in a supported format (preferably tab-separated values) that contains all the terms and phrases you want to use in your translation.

   To check if your file format is supported, *see* [Get supported glossary formats](../reference/get-supported-glossary-formats.md).

    The following English-source glossary contains words that can have different meanings depending upon the context in which they're used. The glossary provides the expected translation for each word in the file to help ensure accuracy.

   For instance, when the word `Bank` appears in a financial document, it should be translated to reflect its financial meaning. If the word `Bank` appears in a geographical document, it may refer to shore to reflect its topographical meaning. Similarly, the word `Crane` can refer to either a bird or machine.

   ***Example glossary .tsv file: English-to-French***

   ```tsv
      Bank     Banque
      Card     Carte
      Crane    Grue
      Office   Office
      Tiger    Tiger
      US       United States
   ```

1. **Upload your glossary to Azure storage**. To complete this step, you need an [Azure Blob Storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount) with [containers](/azure/storage/blobs/storage-quickstart-blobs-portal?branch=main#create-a-container) to store and organize your blob data within your storage account.

1. **Specify your glossary in the translation request.** Include the **`glossary URL`**, **`format`**, and **`version`** in your **`POST`** request:

      :::code language="json" source="../../../../../cognitive-services-rest-samples/curl/Translator/translate-with-glossary.json" range="1-23" highlight="13-14":::

   > [!NOTE]
   > The example used an enabled [**system-assigned managed identity**](create-use-managed-identities.md#enable-a-system-assigned-managed-identity) with a [**Storage Blob Data Contributor**](create-use-managed-identities.md#grant-storage-account-access-for-your-translator-resource) role assignment for authorization. For more information, *see* [**Managed identities for Document Translation**](./create-use-managed-identities.md).

### Case sensitivity

By default, Azure AI Translator service API is **case-sensitive**, meaning that it matches terms in the source text based on case.

* **Partial sentence application**. When your glossary is applied to **part of a sentence**, the Document Translation API checks whether the glossary term matches the case in the source text. If the casing doesn't match, the glossary isn't applied.

* **Complete sentence application**. When your glossary is applied to a **complete sentence**, the service becomes **case-insensitive**. It matches the glossary term regardless of its case in the source text. This provision applies the correct results for use cases involving idioms and quotes.

## Next steps

Try the Document Translation how-to guide to asynchronously translate whole documents using a programming language of your choice:

> [!div class="nextstepaction"]
> [Use Document Translation REST APIs](use-rest-api-programmatically.md)
