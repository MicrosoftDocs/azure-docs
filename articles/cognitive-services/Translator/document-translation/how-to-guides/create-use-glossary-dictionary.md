---
title: Create and use glossary (custom dictionary) with Document Translation
description: How to create and use a glossary (custom dictionary) with Document Translation.
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 03/13/2023
---

# Create and use a glossary with Document Translation

A glossary is a custom dictionary that you create for the Document Translation service to use during the translation process. Common use cases for glossaries include:

* **Domain-specific terminology**. Designate specific meanings for your unique context.

* **Name brand preservation**. Restrict Document Translation from translating product name brands by using a glossary with the same source and target text.

* **Specify translation for words with several meanings**. Choose a specific translation for polysemantic words.

## Create, upload, and use a glossary file

1. Create a file in a supported format that contains all the terms and phrases you want to use in your translation. You can check to see if your format is supported using the [Get supported glossary formats](../reference/get-supported-glossary-formats.md). The following is a sample REST API call using PowerShell. Update `your-document-translation-key` and `your-document-translation-endpoint` with values from the Azure portal. Only one key is necessary to make an API call.:

   :::image type="content" source="../media/key-endpoint.png" alt-text="Screenshot showing the key and endpoint fields in the Azure portal.":::

   ***Get supported glossary formats request***

    ```powershell
   @"
   $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
   $headers.Add("Ocp-Apim-Subscription-Key", "your-document-translation-key")

   $response = Invoke-RestMethod 'your-document-translation-endpoint/translator/text/batch/v1.0/glossaries/formats' -Method 'GET' -Headers $headers
   $response | ConvertTo-Json
   "@
    ```

   ***Example glossary file tab-separated values (.tsv)***

   :::image type="content" source="../media/tsv-file.png" alt-text="Example of a TSV formatted glossary file formatted":::

In this English-source glossary, the words can have different meanings depending upon the context in which they are used. The glossary provides translations for each word in the file to help ensure accurate translations.

For instance, if the word "Bank" appears in a financial document, it would be translated as "Banque" to reflect its financial meaning. If the word "Bank" appears in a geography document, it might be translated as "land beside a river" to reflect its geographic meaning. Similarly, the word "Crane" can refer to either a bird or a machine.

1. Next, Upload your glossary: upload your glossary to your Azure Blob Storage account. 
