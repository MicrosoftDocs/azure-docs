---
title: "Quickstart: Azure AI Language Native document support"
titleSuffix: Azure AI services
description: "Learn to process native documents with the Language service REST APIs."
author: laujan
manager: nitinme
ms.service: azure-ai-language
ms.topic: quickstart
ms.date: 01/16/2024
ms.author: lajanuar
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Quickstart: Native document support

Azure AI Language is a cloud-based service that applies Natural Language Processing (NLP) features to analyze text-based data.  Native document support extends the accepted plain text (.txt) input for the [Personally Identifiable Information (PII)](../personally-identifiable-information/overview.md) and [Document Summarization](../summarization/overview.md) features to include Word and PDF native document eliminating the need for text extraction preprocessing. In this quickstart demonstrates Personally Identifiable Information (PII) and Summarization processing for documents.

Let's get started:

* For this project, we use the cURL command line tool to make REST API calls.

    > [!NOTE]
    > The cURL package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the package version with the following commands:
    > Windows: `curl.exe -V`.
    > macOS `curl -V`
    > Linux: `curl --version`

    If you don't have cURL installed, here are links for your platform:

  * [Windows](https://curl.haxx.se/windows/).
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows).

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to [create containers](#create-azure-blob-storage-containers) in your Azure Blob Storage account for your source and target files:

  * **Source container**. This container is where you upload your native files for analysis (required).
  * **Target container**. This container is where your analyzed files are stored (required).

* A [**single-service Language resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) (**not** a multi-service Azure AI services resource):

  **Complete the Language resource project and instance details fields as follows:**

  1. **Subscription**. Select one of your available Azure subscriptions.

  1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.

  1. **Resource Region**. Choose **Global** unless your business or application requires a specific region. If you're planning on using a [system-assigned managed identity](../how-to-guides/create-use-managed-identities.md) for authentication, choose a **geographic** region like **West US**.

  1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.

  1. **Pricing tier**. You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your resource has successfully deployed, select **Go to resource**.

### Retrieve your key and language service endpoint

Requests to the Language service require a read-only key and custom endpoint to authenticate access.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing language service resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. Copy and paste your **`key`** and **`language service endpoint`** in a convenient location, such as *Microsoft Notepad*. Only one key is necessary to make an API call.

1. Paste your **`key`** and **`language service endpoint`** into the code samples to authenticate your request to the Language service.

## Create Azure Blob Storage containers

It is required that you [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) for source and target files.

* **Source container**. This container is where you upload your native files for analysis (required).
* **Target container**. This container is where your analyzed files are stored (required).

### **Authentication**

You must grant the Language Service resource access to your storage account before it can create, read, or delete blobs. User delegation SAS tokens are secured with Microsoft Entra credentials. SAS tokens provide secure, delegated access to resources in your Azure storage account.

The `sourceUrl` and `targetUrl` must include a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs. *See* [**Create SAS tokens for Language service process**](../how-to-guides/create-sas-tokens.md).

:::image type="content" source="media/sas-url-token.png" alt-text="Screenshot of a storage url with SAS token appended.":::

* Your **source** container or blob must have designated  **read** and **list** access.
* Your **target** container or blob must have designated  **write** and **list** access.

> [!TIP]
>
> * Since you're translating a **single** file (blob) in an operation, **delegate SAS access at the blob level**.
>
> * As an alternative to SAS tokens, you can use a system-assigned managed identity for [**Role-based access control**](../concepts/role-based-access-control.md) (managed identities) for authentication.

## Request headers

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your Language resource endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the Language resource key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

### [Personally Identifiable Information (PII)](#tab/pii)

### Sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/Language/native-document-pii.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl//Language/native-document-pii.pdf) for this quickstart. The source language is English.

## Personally Identifying Information (PII) detection

```bash
curl -i -X POST https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key:<your-language-resource-key>" \
-d \
'
{
    "kind": "PiiEntityRecognition",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
          "source":{
            "sourceUrl":"{your-source-container-SAS-URL}"
          },
          "targets":[
            {
              "targetUrl":"{your-target-container-SAS-URL}",
            }
        ]
    }
}
'
```

### [Document Summarization](#tab/summarization)

### Sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.pdf) for this quickstart. The source language is English.

## Document summarization

### Document extractive summarization example

The following example will get you started with document extractive summarization:

1. Copy the command below into a text editor. The BASH example uses the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character instead.

```bash
curl -i -X POST $LANGUAGE_ENDPOINT/language/analyze-text/jobs?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d \
' 
{
  "displayName": "Document ext Summarization Task Example",
  "inputs":[
        {
          "source":{
            "sourceUrl":"{your-source-container-SAS-URL}"
          },
          "targets":[
            {
              "targetUrl":"{your-target-container-SAS-URL}",
            }
          ]
        }
      ]
    },
  "tasks": [
    {
      "kind": "ExtractiveSummarization",
      "taskName": "Document Extractive Summarization Task 1",
      "parameters": {
        "sentenceCount": 6
      }
    }
  ]
}
'
```

---

### Build and run the POST request

> [!NOTE]
>
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Language resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.

To call the API, you need the following information:

Before you run the **POST** request, replace `{your-source-container-SAS-URL}` and `{your-key}` with the endpoint value from your Azure portal Language instance.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

Upon successful completion:

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.
