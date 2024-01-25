---
title: Get started with synchronous document translation
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

# Get started with synchronous document translation

Document Translation is a cloud-based machine translation feature of the [Azure AI Translator](../../translator-overview.md) service.  You can translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format.

Synchronous document translation supports immediate-response processing of single-page files. The synchronous translation process doesn't require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.

***Let's get started.***

## Prerequisites

You need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* Once you have your Azure subscription, create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * You need the key and endpoint from the resource to connect your application to the Translator service. You paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page:

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

## Headers

To call the synchronous document translation feature via the [REST API](../reference/synchronous-rest-api-guide.md), you need to include the following headers with each request. Don't worry, we include the headers for you in the sample code.

|parameter  |Description  | Condition|
|---------|---------|-----|
|`-X POST <endpoint>`     | Specifies your Language resource endpoint for accessing the API.|&bullet; ***Required***|
|`--header "Ocp-Apim-Subscription-Key:<key>`    | Specifies the Language resource key for accessing the API.|&bullet; ***Required***|
|`--header "Ocp-Apim-Subscription-Region:<region>"`|The region where your resource was created. |&bullet; ***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</br>&bullet; ***Optional*** when using a single-service global Translator Resource.|
|`--data`     | The JSON file containing the data you want to pass with your request including an **optional** glossary.|&bullet; ***Required***|

## Build and run the POST request

1. For this project, you need a **sample document**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) for this quickstart. The source language is English.

1. Before you run the **POST** request, replace `{your-language-resource-endpoint}` and `{your-key}` with the values from your Azure portal Language service instance.

> [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

    ***PowerShell***

    ```powershell
    cmd /c curl "{your-language-resource-endpoint}/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -i -X POST  --header "Ocp-Apim-Subscription-Key: {your-key}" --data "{path-to-your-document-with-file-extension};type=text/{file-extension}" --output "{path-to-output-file}
    ```

    ***command prompt / terminal***

    ```bash

    curl  "{your-language-resource-endpoint}/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview" -i -X POST -H "Ocp-Apim-Subscription-Key:{your-key}" -H "Ocp-Apim-Subscription-Region: {your-region}" --data "path-to-your-document-with-file-extension};type=text/{file-extension}" -data "glossary={path-to-your-glossary-with-file-extension};type=text/{file-extension}" --output "{path-to-output-file}"
    like 1
    ```

   Here's a closer look at each cURL value  in a sample HTTP calls:

   ***Global resource with glossary***

    * curl "https://global.document.microsofttranslator.com/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview"

    * -i -X POST

    * -H "Ocp-Apim-Subscription-Key: <KEY>"

    * -H "Ocp-Apim-Subscription-Region: <REGION>"

    * -data "document=@C:\Test\Test-file.txt;type=text/html"

    *  -data "glossary=@C:\Test\SDT\test-simple-glossary.csv;type=text/csv"

    * --output "C:\Test\Test-file-output.txt"

***Regional resource with glossary***

    * curl "https://regional.document.microsofttranslator.com/document:translate?fromLanguage=en&targetLanguage=hi&api-version=2023-11-01-preview"

    * -i -X POST

    * -H "Ocp-Apim-Subscription-Key: <KEY>"

    * -data "document=@C:\Test\Test-file.txt;type=text/html"

    *  -data "glossary=@C:\Test\SDT\test-simple-glossary.csv;type=text/csv"

    * --output "C:\Test\Test-file-output.txt"

***Upon successful completion***:

* The translated document is returned with the response.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the request.

## Next steps

> [!div class="nextstepaction"]
> [Asynchronous batch translation](async-translation-rest-api.md "Learn more about batch translation for multiple files.")