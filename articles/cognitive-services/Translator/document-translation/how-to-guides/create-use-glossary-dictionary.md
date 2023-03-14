---
title: Create and use glossary (custom dictionary) with Document Translation
description: How to create and use a glossary (custom dictionary) with Document Translation.
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 03/14/2023
---

# Create and use a glossary with Document Translation

A glossary is a custom dictionary that you create for the Document Translation service to use during the translation process. Currently, the glossary feature supports one-to-one (not one-to-many language) source-to-target language translation. Common use cases for glossaries include:

* **Domain-specific terminology**. Create a glossary that designates specific meanings for your unique context.

* **Name brand preservation**. Restrict Document Translation from translating product name brands by using a glossary with the same source and target text.

* **Specify translation for words with several meanings**. Choose a specific translation for poly&#8203;semantic words.

## Case sensitivity

By default, Azure Cognitive Services Translator service API is **case-sensitive**, meaning that it matches terms in the source text based on case.

#### Partial sentence application

When your glossary is applied to **part of a sentence**, the Document Translation API checks whether the glossary term matches the case in the source text. If the casing doesn't match, the glossary isn't applied.

#### Complete sentence application

When your glossary is applied to a **complete sentence**, the service becomes **case-insensitive**. It matches the glossary term regardless of its case in the source text. This provision applies the correct results for use cases involving idioms and quotes.

## Create, upload, and use a glossary file

1. **Create your glossary file.** Create a file in a supported format that contains all the terms and phrases you want to use in your translation.

   * You can check to see if your format is supported using the [Get supported glossary formats](../reference/get-supported-glossary-formats.md).

   * To follow, is a sample REST API call using PowerShell. To use the sample, update `your-document-translation-key` and `your-document-translation-endpoint` with values from the Azure portal. Only one key is necessary to make an API call.

      ***Get supported glossary formats request***

       ```powershell
      @"
      $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
      $headers.Add("Ocp-Apim-Subscription-Key", "your-document-translation-key")

      $response = Invoke-RestMethod 'your-document-translation-endpoint/translator/text/batch/v1.0/glossaries/formats' -Method 'GET' -Headers $headers
      $response | ConvertTo-Json
      "@
       ```

   In the following English-source glossary, the words can have different meanings depending upon the context in which they're used. The glossary provides translations for each word in the file to help ensure accurate translations.

   For instance, when the word `Bank` appears in a financial document, it would be translated as `Banque` to reflect its financial meaning. If the word `Bank` appears in a geography document, it might be translated as `land beside a river` to reflect its topographical meaning. Similarly, the word `Crane` can refer to either a `bird` or a `machine`.

   ***Example glossary file tab-separated values (.tsv)***

   :::image type="content" source="../media/tsv-file.png" alt-text="Example of a TSV formatted glossary file formatted":::

1. **Upload your glossary to Azure storage**. To complete this step, you need an [Azure Blob Storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount) with [containers](/azure/storage/blobs/storage-quickstart-blobs-portal?branch=main#create-a-container) to store and organize your blob data within your storage account.

1. **Specify your glossary in the translation request.** Include the **`glossary URL`**, **`format`**, and **`version`** in your **`POST`** request:

   :::code language="json" source="translate-with-glossary.json" range="1-23" highlight="13-15":::

## Next steps

Try the Document Translation how-to guide to asynchronously translate whole documents using a programming language of your choice:

> [!div class="nextstepaction"]
> [Use Document Translation REST APIs](use-rest-api-programmatically.md)
