---
title: Synchronous translation REST API guide
description: "Synchronous translation HTTP REST API guide"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 01/31/2024
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Synchronous translation REST API guide

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

Synchronously translate a single document.

## Request URL

`POST`:

```bash
{your-document-translation-endpoint}/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview

```

## Request headers

To call the synchronous translation feature via the REST API, you need to include the following headers with each request. 

Header|Value| Condition  |
|--- |:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|&bullet; ***Required***|
|**Ocp-Apim-Subscription-Region**|The region where your resource was created. |&bullet; ***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</br>&bullet; ***Optional*** when using a single-service global Translator Resource.|

## Request parameters

Query string parameters:

### Required parameters

|Query parameter | Description |
| --- | --- |
|**api-version** | _Required parameter_.<br>Version of the API requested by the client. Current value is `2023-11-01-preview`. |
|**targetLanguage**|_Required parameter_.<br>Specifies the language of the output document. The target language must be one of the supported languages included in the translation scope.|
|&bull; **document=**<br> &bull; **type=**|_Required parameters_.<br>&bull; Path to the file location for your source document and file format type.</br> &bull; Ex: **"document=@C:\Test\Test-file.txt;type=text/html**|
|**--output**|_Required parameter_.<br> &bull; Path to the target file location for the translated file.</br> &bull; Ex: **"C:\Test\Test-file-output.txt"**. The file extension should be the same as the source file.|

### Optional parameters

|Query parameter | Description |
| --- | --- |
|**sourceLanguage**|Specifies the language of the input document. If the `sourceLanguage` parameter isn't specified, automatic language detection is applied to determine the source language.|
|&bull; **glossary=**<br> &bull; **type=**|br>&bull; Path to the file location for your custom glossary and file format type.</br> &bull; Ex:**"glossary=@D:\Test\SDT\test-simple-glossary.csv;type=text/csv**|

## Next steps

> [!div class="nextstepaction"]
> [Try the synchronous batch translation quickstart](../quickstarts/synchronous-rest-api.md "Learn more about batch translation for multiple files.")
