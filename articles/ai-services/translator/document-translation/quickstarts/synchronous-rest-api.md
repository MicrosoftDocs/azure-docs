---
title: Get started with synchronous translation
description: "How to translate documents synchronously using the REST API"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 01/23/2024
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Get started with synchronous translation

Document Translation is a cloud-based machine translation feature of the [Azure AI Translator](../../translator-overview.md) service.  You can translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format.

Synchronous translation supports immediate-response processing of single-page files. The synchronous translation process doesn't require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.

***Let's get started.***

## Prerequisites

You need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* Once you have your Azure subscription, create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * You need the key and endpoint from the resource to connect your application to the Translator service. You paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page.

    :::image type="content" source="../media/document-translation-key-endpoint.png" alt-text="Screenshot to document translation key and endpoint location in the Azure portal.":::

* For this project, we use the cURL command line tool to make REST API calls.

    > [!NOTE]
    > The cURL package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the package version with the following commands:
    > Windows: `curl.exe -V`.
    > macOS `curl -V`
    > Linux: `curl --version`

* If cURL isn't installed, here are installation links for your platform:

  * [Windows](https://curl.haxx.se/windows/).
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows).

    :::image type="content" source="../../media/quickstarts/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

    > [!NOTE]
    >
    > * For this quickstart we recommend that you use a Translator text single-service global resource.
    > * With a single-service global resource you'll include one authorization header (**Ocp-Apim-Subscription-key**) with the REST API request. The value for Ocp-Apim-Subscription-key is your Azure secret key for your Translator Text subscription.
    > * If you choose to use an Azure AI multi-service or regional Translator resource, two authentication headers will be required: (**Ocp-Api-Subscription-Key** and **Ocp-Apim-Subscription-Region**). The value for Ocp-Apim-Subscription-Region is the region associated with your subscription.

## Headers and parameters

To call the synchronous translation feature via the [REST API](../reference/synchronous-rest-api-guide.md), you need to include the following headers with each request. Don't worry, we include the headers for you in the sample code.

|Query parameter&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|Description| Condition|
|---------|---------|----|
|`-X POST`|The -X flag specifies the request method to access the API.|&bullet; ***Required*** |
|`{endpoint}`  |The URL for your Document Translation resource endpoint|&bullet; ***Required*** |
|`targetLanguage`|Specifies the language of the output document. The target language must be one of the supported languages included in the translation scope.|&bullet; ***Required*** |
|`--header "Ocp-Apim-Subscription-Key:{KEY}`    | Specifies the Document Translation resource key authorizing access to the API.|&bullet; ***Required***|
|`--header "Ocp-Apim-Subscription-Region:{REGION}"`|The region where your resource was created. |&bullet; ***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</br></br>&bullet; ***Optional*** when using a single-service global Translator Resource.|
|&bull; `document=`<br> &bull; `type=`|&bull; Path to the file location for your source document and file format type.</br> &bull; Ex: **"document=@C:\Test\Test-file.txt;type=text/html**|&bullet; ***Required***|
|`--form` |The filepath to the document that you want to pass with your request.|&bullet; ***Required***|
|`--form` |The filepath to an optional glossary to pass with your request. The glossary requires a separate `--form` flag.|&bullet; ***Optional***|
|`--output`|The filepath to the response results.|&bullet; ***Required***|

## Build and run the POST request

1. For this project, you need a **sample document**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) for this quickstart. The source language is English.

1. Before you run the **POST** request, replace `{your-document-translation-endpoint}` and `{your-key}` with the values from your Azure portal Language service instance.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

   ***command prompt / terminal (regional endpoint)***

    ```bash

    curl -i -X POST "{your-document-translation-endpoint}/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -H "Ocp-Apim-Subscription-Key:{your-key}" -H "Ocp-Apim-Subscription-Region: {your-region}" --form "document={path-to-your-document-with-file-extension};type=text/{file-extension}" -form "glossary={path-to-your-glossary-with-file-extension};type=text/{file-extension}" --output "{path-to-output-file}"
    ```

    ***PowerShell (global endpoint)***

    ```powershell
    cmd /c curl "{your-document-translation-endpoint}/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -i -X POST  --header "Ocp-Apim-Subscription-Key: {your-key}" -H "Ocp-Apim-Subscription-Region: {your-region}" --form "{path-to-your-document-with-file-extension};type=text/{file-extension}" --output "{path-to-output-file}
    ```

***Upon successful completion***:

* The translated document is returned with the response.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the request.

That's it, congratulations! You just learned to synchronously translate a document using the Azure AI Translator service.

## Next steps

> [!div class="nextstepaction"]
> [Asynchronous batch translation](asynchronous-rest-api.md "Learn more about batch translation for multiple files.")
