---
title: "Container: Translate document"
titleSuffix: Azure AI services
description: Understand the parameters, headers, and body request/response messages for the Azure AI Translator container translate document operation.
#services: cognitive-services
author: laujan
manager: nitinme

ms.service: azure-ai-translator
ms.topic: reference
ms.date: 04/29/2024
ms.author: lajanuar
---

# Container: Translate Documents (preview)

> [!IMPORTANT]
>
> * Azure AI Translator public preview releases provide early access to features that are in active development.
> * Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.

**Translate document with source language specified**.

## Request URL (using cURL)

`POST` request:

```bash
    POST "http://localhost:{port}/translator/document:translate?sourceLanguage={sourceLanguage}&targetLanguage={targetLanguage}&api-version={api-version}" -F "document=@{path-to-your-document-with-file-extension};type={ContentType}/{file-extension}" -o "{path-to-output-file-with-file-extension}"
```

Example:

```bash
curl -i -X POST "http://localhost:5000/translator/document:translate?sourceLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -F "document=@C:\Test\test-file.md;type=text/markdown" -o "C:\translation\translated-file.md"
```

## Synchronous request headers and parameters

Use synchronous translation processing to send a document as part of the HTTP request body and receive the translated document in the HTTP response.

|Query parameter&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|Description| Condition|
|---------|---------|----|
|`-X` or `--request` `POST`|The -X flag specifies the request method to access the API.|*Required* |
|`{endpoint}`  |The URL for your Document Translation resource endpoint|*Required* |
|`targetLanguage`|Specifies the language of the output document. The target language must be one of the supported languages included in the translation scope.|*Required* |
|`sourceLanguage`|Specifies the language of the input document. If the `sourceLanguage` parameter isn't specified, automatic language detection is applied to determine the source language. |*Optional*|
|`-H` or `--header` `"Ocp-Apim-Subscription-Key:{KEY}`    | Request header that specifies the Document Translation resource key authorizing access to the API.|*Required*|
|`-F` or `--form` |The filepath to the document that you want to include with your request. Only one source document is allowed.|*Required*|
|&bull; `document=`<br> &bull; `type={contentType}/fileExtension` |&bull; Path to the file location for your source document.</br> &bull; Content type and file extension.</br></br> Ex: **"document=@C:\Test\test-file.md;type=text/markdown"**|*Required*|
|`-o` or `--output`|The filepath to the response results.|*Required*|
|`-F` or `--form` |The filepath to an optional glossary to include with your request. The glossary requires a separate `--form` flag.|*Optional*|
| &bull; `glossary=`<br> &bull; `type={contentType}/fileExtension`|&bull; Path to the file location for your optional glossary file.</br> &bull; Content type and file extension.</br></br> Ex: **"glossary=@C:\Test\glossary-file.txt;type=text/plain**|*Optional*|

✔️ For more information on **`contentType`**, *see* [**Supported document formats**](../document-translation/overview.md#synchronous-supported-document-formats).

## Code sample: document translation

> [!NOTE]
>
> * Each sample runs on the `localhost` that you specified with the `docker compose up` command.
> * While your container is running, `localhost` points to the container itself.
> * You don't have to use `localhost:5000`. You can use any port that is not already in use in your host environment.

### Sample document

For this project, you need a source document to translate. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx) for and store it in the same folder as your `compose.yaml` file (`container-environment`). The file name is `document-translation-sample.docx` and the source language is English.

### Query Azure AI Translator endpoint (document)

Here's an example cURL HTTP request using localhost:5000:

```bash
curl -v "http://localhost:5000/translator/document:translate?sourceLanguage=en&targetLanguage=es&api-version=2023-11-01-preview" -F "document=@document-translation-sample-docx" -o "C:\translation\translated-file.md"
```

***Upon successful completion***:

* The translated document is returned with the response.
* The successful POST method returns a `200 OK` response code indicating that the service created the request.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about synchronous document translation](../document-translation/reference/rest-api-guide.md)
