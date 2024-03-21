---
title: Synchronous translation REST API guide
description: "Synchronous translation HTTP REST API guide"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 02/12/2024
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
curl -i -X POST "{your-document-translation-endpoint}/translator/document:translate?sourceLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -H "Ocp-Apim-Subscription-Key:{your-key}"  -F "document={path-to-your-document-with-file-extension};type={ContentType}/{file-extension}" -F "glossary={path-to-your-glossary-with-file-extension};type={ContentType}/{file-extension}" -o "{path-to-output-file}"

```

## Request headers

To call the synchronous translation feature via the REST API, you need to include the following headers with each request. 

|Header|Value| Condition  |
|---|:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|&bullet; ***Required***|

## Request parameters

Query string parameters:

### Required parameters

|Query parameter | Description |
| --- | --- |
|**api-version** | _Required parameter_.<br>Version of the API requested by the client. Current value is `2023-11-01-preview`. |
|**targetLanguage**|_Required parameter_.<br>Specifies the language of the output document. The target language must be one of the supported languages included in the translation scope.|
|&bull; **document=**<br> &bull; **type=**|_Required parameters_.<br>&bull; Path to the file location for your source document and file format type.</br> &bull; Ex: **"document=@C:\Test\Test-file.txt;type=text/html**|
|**--output**|_Required parameter_.<br> &bull; File path for the target file location. Your translated file is printed to the output file.</br> &bull; Ex: **"C:\Test\Test-file-output.txt"**. The file extension should be the same as the source file.|

### Optional parameters

|Query parameter | Description |
| --- | --- |
|**sourceLanguage**|Specifies the language of the input document. If the `sourceLanguage` parameter isn't specified, automatic language detection is applied to determine the source language.|
|&bull; **glossary=**<br> &bull; **type=**|&bull; Path to the file location for your custom glossary and file format type.</br> &bull; Ex:**"glossary=@D:\Test\SDT\test-simple-glossary.csv;type=text/csv**|
|**allowFallback**|&bull; A boolean specifying that the service is allowed to fall back to a `generalnn` system when a custom system doesn't exist. Possible values are: `true` (default) or `false`. <br>&bull; `allowFallback=false` specifies that the translation should only use systems trained for the category specified  by the request.<br>&bull; If no system is found with the specific category, the request returns a 400 status code. <br>&bull; `allowFallback=true` specifies that the service is allowed to fall back to a `generalnn` system when a custom system doesn't exist.|

### Request Body

|Name |Description|Content Type|Condition|
|---|---|---|---|
|**document**| Source document to be translated.|Any one of the [supported document formats](../../language-support.md).|***Required***|
|**glossary**|Document containing a list of terms with definitions to use during the translation process.|Any one of the supported [glossary formats](get-supported-glossary-formats.md).|***Optional***|

## Next steps

> [!div class="nextstepaction"]
> [Try the synchronous batch translation quickstart](../quickstarts/synchronous-rest-api.md "Learn more about batch translation for multiple files.")
