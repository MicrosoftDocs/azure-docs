---
title: "Quickstart: Azure AI Language Native document support preview"
titleSuffix: Azure AI services
description: "Learn to process native documents with the Language service preview REST APIs."
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

# Quickstart: Native document support (preview)

> [!IMPORTANT]
>
> * Azure AI Language public preview releases provide early access to features that are in active development.
> * Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.

Azure AI Language is a cloud-based service that applies Natural Language Processing (NLP) features to analyze text-based data.  Native document support extends the accepted plain text (.txt) input for the [Personally Identifiable Information (PII)](../personally-identifiable-information/overview.md) and [`Document Summarization`](../summarization/overview.md) features to include Word and PDF native documents.

Let's get started:

* For this project, we use the cURL command line tool to make REST API calls.

    > [!NOTE]
    > The cURL package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the package version with the following commands:
    > Windows: `curl.exe -V`.
    > macOS `curl -V`
    > Linux: `curl --version`

    If cURL isn't installed, here are installation links for your platform:

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

  1. **Resource Region**. Choose **Global** unless your business or application requires a specific region. If you're planning on using a [system-assigned managed identity (RBAC)](../concepts/role-based-access-control.md) for authentication, choose a **geographic** region like **West US**.

  1. **Name**. Enter the name you chose for your resource. The name you choose must be unique within Azure.

  1. **Pricing tier**. You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your resource successfully deploys, select **Go to resource**.

### Retrieve your key and language service endpoint

Requests to the Language service require a read-only key and custom endpoint to authenticate access.

1. If you created a new resource, after it deploys, select **Go to resource**. If you have an existing language service resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. You can copy and paste your **`key`** and your **`language service instance endpoint`** into the code samples to authenticate your request to the Language service. Only one key is necessary to make an API call.

## Create Azure Blob Storage containers

[**Create containers**](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) for source and target files.

* **Source container**. This container is where you upload your native files for analysis (required).
* **Target container**. This container is where your analyzed files are stored (required).

### **Authentication**

Your Language resource needs granted access to your storage account before it can create, read, or delete blobs. User delegation SAS tokens are secured with Microsoft Entra credentials. SAS tokens provide secure, delegated access to resources in your Azure storage account.

The `sourceUrl` and `targetUrl` are authenticated with Shared Access Signature (SAS) tokens appended as query strings. Tokens can be assigned to your container or specific blobs. *See* [**Create SAS tokens**](../../translator/document-translation/how-to-guides/create-sas-tokens.md).

:::image type="content" source="media/sas-url-token.png" alt-text="Screenshot of a storage url with SAS token appended.":::

* Your **source** container or blob must designate **read** and **list** access.
* Your **target** container or blob must designate **write** and **list** access.

> [!TIP]
>
> * When processing a **single** file (blob) in an operation, **delegate SAS access at the blob level**.
>
> * As an alternative to SAS tokens, you can use a system-assigned managed identity for [**Role-based access control**](../concepts/role-based-access-control.md) (managed identities) for authentication.

## Request headers and parameters

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your Language resource endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the Language resource key for accessing the API.        |
|`-d`     | The JSON file containing the data you want to pass with your request.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values. Try analyzing native documents by selecting the following `**Personally Identifiable Information (PII)**` or `**Document Summarization**`:

### [Personally Identifiable Information (PII)](#tab/pii)

#### PII Sample document

For this quickstart, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-pii.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl//Language/native-document-pii.pdf) for this project. The source language is English.

### Build the POST request

1. Using your preferred editor or IDE, create a new directory for your app named `native-document`.

1. Create a new json file called **pii-detection.json** in your **native-document** directory.

1. Copy and paste the following Personally Identifiable Information (PII) **request sample** into your `pii-detection.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance:

  `**Request sample**`

  ```json
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
          "targets":
            {
              "targetUrl":"{your-target-container-SAS-URL}",
            }
            }
        ]
    }
  }

  ```

### Run the POST request

1. Before you run the **POST** request, replace `{your-language-resource-endpoint}` and `{your-key}` with the values from your Azure portal Language service instance.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

    ***PowerShell***

    ```powershell
    cmd /c curl "{your-language-resource-endpoint}/language/:analyze-text?api-version=2023-04-01" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@pii-detection.json"
    ```

    ***command prompt / terminal***

    ```curl
    curl "{your-language-resource-endpoint}/language/analyze-text/jobs?api-version=2023-04-01" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@pii-detection.json"
    ```

### [Document Summarization](#tab/summarization)

### Summarization sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.pdf) for this quickstart. The source language is English.

### Build the POST request

1. Using your preferred editor or IDE, create a new directory for your app named `native-document`.
1. Create a new json file called **document-summarization.json** in your **native-document** directory.

1. Copy and paste the Document Summarization **request sample** into your `document-summarization.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance:

  `**Request sample**`

  ```json
  {
   "kind": "ExtractiveSummarization",
   "parameters": {
        "sentenceCount": 6
    },
   "analysisInput":{
        "documents":[
            {
          "source":{
            "sourceUrl":"{your-source-container-SAS-URL}"
          },
          "targets":
            {
              "targetUrl":"{your-target-container-SAS-URL}",
            }
            }
        ]
    }
  }
  ```

### Run the POST request

Before you run the **POST** request, replace `{your-language-resource-endpoint}` and `{your-key}` with the endpoint value from your Azure portal Language resource instance.

  > [!IMPORTANT]
  > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

  ***PowerShell***

  ```powershell
  cmd /c curl "{your-language-resource-endpoint}/language/analyze-text/jobs?api-version=2023-04-01" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

  ***command prompt / terminal***

  ```curl
  curl "{your-language-resource-endpoint}/language/analyze-text/jobs?api-version=2023-04-01" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

---

**Upon successful completion**:

* The analyzed documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next step

> [!div class="nextstepaction"]
> [**Try the Language Studio**](https://language.cognitive.azure.com/)
