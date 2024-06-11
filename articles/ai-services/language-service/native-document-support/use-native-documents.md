---
title: Native document support for Azure AI Language (preview)
titleSuffix: Azure AI services
description: How to use native document with Azure AI Languages Personally Identifiable Information and Summarization capabilities.
author: laujan
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 02/21/2024
ms.author: lajanuar
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# Native document support for Azure AI Language (preview)

> [!IMPORTANT]
>
> * Native document support is a gated preview. To request access to the native document support feature, complete and submit the [**Apply for access to Language Service previews**](https://aka.ms/gating-native-document) form.
>
> * Azure AI Language public preview releases provide early access to features that are in active development.
> * Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.

Azure AI Language is a cloud-based service that applies Natural Language Processing (NLP) features to text-based data. The native document support capability enables you to send API requests asynchronously, using an HTTP POST request body to send your data and HTTP GET request query string to retrieve the status results. Your processed documents are located in your Azure Blob Storage target container.

A native document refers to the file format used to create the original document such as Microsoft Word (docx) or a portable document file (pdf). Native document support eliminates the need for text preprocessing before using Azure AI Language resource capabilities. Currently, native document support is available for the following capabilities:

* [Personally Identifiable Information (PII)](../personally-identifiable-information/overview.md). The PII detection feature can identify, categorize, and redact sensitive information in unstructured text. The `PiiEntityRecognition` API supports native document processing.

* [Document summarization](../summarization/overview.md). Document summarization uses natural language processing to generate extractive (salient sentence extraction) or abstractive (contextual word extraction) summaries for documents. Both `AbstractiveSummarization` and `ExtractiveSummarization` APIs support native document processing.

## Supported document formats

 Applications use native file formats to create, save, or open native documents. Currently **PII** and **Document summarization** capabilities supports the following native document formats:

|File type|File extension|Description|
|---------|--------------|-----------|
|Text| `.txt`|An unformatted text document.|
|Adobe PDF| `.pdf`|A portable document file formatted document.|
|Microsoft Word| `.docx`|A Microsoft Word document file.|

## Input guidelines

***Supported file formats***

|Type|support and limitations|
|---|---|
|**PDFs**| Fully scanned PDFs aren't supported.|
|**Text within images**| Digital images with embedded text aren't supported.|
|**Digital tables**| Tables in scanned documents aren't supported.|

***Document Size***

|Attribute|Input limit|
|---|---|
|**Total number of documents per request** |**≤ 20**|
|**Total content size per request**| **≤ 1 MB**|

## Include native documents with an HTTP request

***Let's get started:***

* For this project, we use the cURL command line tool to make REST API calls.

    > [!NOTE]
    > The cURL package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the package version with the following commands:
    > Windows: `curl.exe -V`
    > macOS `curl -V`
    > Linux: `curl --version`

* If cURL isn't installed, here are installation links for your platform:

  * [Windows](https://curl.haxx.se/windows/).
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows).

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/). If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

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

Your Language resource needs granted access to your storage account before it can create, read, or delete blobs. There are two primary methods you can use to grant access to your storage data:

* [**Shared access signature (SAS) tokens**](shared-access-signatures.md). User delegation SAS tokens are secured with Microsoft Entra credentials. SAS tokens provide secure, delegated access to resources in your Azure storage account.

* [**Managed identity role-based access control (RBAC)**](managed-identities.md). Managed identities for Azure resources are service principals that create a Microsoft Entra identity and specific permissions for Azure managed resources.

For this project, we authenticate access to the `source location` and `target location` URLs with Shared Access Signature (SAS) tokens appended as query strings. Each token is assigned to a specific blob (file).

:::image type="content" source="media/sas-url-token.png" alt-text="Screenshot of a storage url with SAS token appended.":::

* Your **source** container or blob must designate **read** and **list** access.
* Your **target** container or blob must designate **write** and **list** access.

> [!TIP]
>
> Since we're processing a single file (blob), we recommend that you **delegate SAS access at the blob level**.

## Request headers and parameters

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your Language resource endpoint for accessing the API.        |
|`--header Content-Type: application/json`     | The content type for sending JSON data.          |
|`--header "Ocp-Apim-Subscription-Key:<key>`    | Specifies the Language resource key for accessing the API.        |
|`-data`     | The JSON file containing the data you want to pass with your request.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values. Try analyzing native documents by selecting the `Personally Identifiable Information (PII)` or `Document Summarization` code sample project:

### [Personally Identifiable Information (PII)](#tab/pii)

### PII Sample document

For this quickstart, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-pii.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl//Language/native-document-pii.pdf) for this project. The source language is English.

### Build the POST request

1. Using your preferred editor or IDE, create a new directory for your app named `native-document`.

1. Create a new json file called **pii-detection.json** in your **native-document** directory.

1. Copy and paste the following Personally Identifiable Information (PII) **request sample** into your `pii-detection.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance:

  ***Request sample***

```json
{
    "displayName": "Extracting Location & US Region",
    "analysisInput": {
        "documents": [
            {
                "language": "en-US",
                "id": "Output-excel-file",
                "source": {
                    "location": "{your-source-blob-with-SAS-URL}"
                },
                "target": {
                    "location": "{your-target-container-with-SAS-URL}"
                }
            } 
        ]
    },
    "tasks": [
        {
            "kind": "PiiEntityRecognition",
            "parameters":{
                "excludePiiCategories" : ["PersonType", "Category2", "Category3"],
                "redactionPolicy": "UseRedactionCharacterWithRefId" 
            }
        }
    ]
}
```

* The source `location` value is the SAS URL for the **source document (blob)**, not the source container SAS URL.

* The `redactionPolicy` possible values are `UseRedactionCharacterWithRefId` (default) or `UseEntityTypeName`. For more information, *see* [**PiiTask Parameters**](/rest/api/language/text-analysis-runtime/analyze-text?view=rest-language-2023-11-15-preview&tabs=HTTP#piitaskparameters&preserve-view=true).

### Run the POST request

1. Here's the preliminary structure of the POST request:

   ```bash
      POST {your-language-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview
   ```

1. Before you run the **POST** request, replace `{your-language-resource-endpoint}` and `{your-key}` with the values from your Azure portal Language service instance.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

    ***PowerShell***

    ```powershell
       cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@pii-detection.json"
    ```

    ***command prompt / terminal***

     ```bash
        curl -v -X POST "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@pii-detection.json"
     ```

1. Here's a sample response:

   ```http
   HTTP/1.1 202 Accepted
   Content-Length: 0
   operation-location: https://{your-language-resource-endpoint}/language/analyze-documents/jobs/f1cc29ff-9738-42ea-afa5-98d2d3cabf94?api-version=2023-11-15-preview
   apim-request-id: e7d6fa0c-0efd-416a-8b1e-1cd9287f5f81
   x-ms-region: West US 2
   Date: Thu, 25 Jan 2024 15:12:32 GMT
   ```

### POST response (jobId)

You receive a 202 (Success) response that includes a read-only Operation-Location header. The value of this header contains a **jobId** that can be queried to get the status of the asynchronous operation and retrieve the results using a **GET** request:

  :::image type="content" source="media/operation-location-result-id.png" alt-text="Screenshot showing the operation-location value in the POST response.":::

### Get analyze results (GET request)

1. After your successful **POST** request, poll the operation-location header returned in the POST request to view the processed data.

1. Here's the preliminary structure of the **GET** request:

   ```bash
     GET {your-language-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview
   ```

1. Before you run the command, make these changes:

    * Replace {**jobId**} with the Operation-Location header from the POST response.

    * Replace {**your-language-resource-endpoint**} and {**your-key**} with the values from your Language service instance in the Azure portal.

### Get request

```powershell
    cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" -i -X GET --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

```bash
    curl -v -X GET "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

#### Examine the response

You receive a 200 (Success) response with JSON output. The **status** field indicates the result of the operation. If the operation isn't complete, the value of **status** is "running" or "notStarted", and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

#### Sample response

```json
{
  "jobId": "f1cc29ff-9738-42ea-afa5-98d2d3cabf94",
  "lastUpdatedDateTime": "2024-01-24T13:17:58Z",
  "createdDateTime": "2024-01-24T13:17:47Z",
  "expirationDateTime": "2024-01-25T13:17:47Z",
  "status": "succeeded",
  "errors": [],
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "PiiEntityRecognitionLROResults",
        "lastUpdateDateTime": "2024-01-24T13:17:58.33934Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "id": "doc_0",
              "source": {
                "kind": "AzureBlob",
                "location": "https://myaccount.blob.core.windows.net/sample-input/input.pdf"
              },
              "targets": [
                {
                  "kind": "AzureBlob",
                  "location": "https://myaccount.blob.core.windows.net/sample-output/df6611a3-fe74-44f8-b8d4-58ac7491cb13/PiiEntityRecognition-0001/input.result.json"
                },
                {
                  "kind": "AzureBlob",
                  "location": "https://myaccount.blob.core.windows.net/sample-output/df6611a3-fe74-44f8-b8d4-58ac7491cb13/PiiEntityRecognition-0001/input.docx"
                }
              ],
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "2023-09-01"
        }
      }
    ]
  }
}
```

### [Document Summarization](#tab/summarization)

### Summarization sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.pdf) for this quickstart. The source language is English.

### Build the POST request

1. Using your preferred editor or IDE, create a new directory for your app named `native-document`.
1. Create a new json file called **document-summarization.json** in your **native-document** directory.

1. Copy and paste the Document Summarization **request sample** into your `document-summarization.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance:

  ***Request sample***

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
            "location":"{your-source-blob-SAS-URL}"
          },
          "targets":
            {
              "location":"{your-target-container-SAS-URL}",
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
   cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

  ***command prompt / terminal***

  ```bash
  curl -v -X POST "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

Here's a sample response:

   ```http
   HTTP/1.1 202 Accepted
   Content-Length: 0
   operation-location: https://{your-language-resource-endpoint}/language/analyze-documents/jobs/f1cc29ff-9738-42ea-afa5-98d2d3cabf94?api-version=2023-11-15-preview
   apim-request-id: e7d6fa0c-0efd-416a-8b1e-1cd9287f5f81
   x-ms-region: West US 2
   Date: Thu, 25 Jan 2024 15:12:32 GMT
   ```

### POST response (jobId)

You receive a 202 (Success) response that includes a read-only Operation-Location header. The value of this header contains a jobId that can be queried to get the status of the asynchronous operation and retrieve the results using a GET request:

  :::image type="content" source="media/operation-location-result-id.png" alt-text="Screenshot showing the operation-location value in the POST response.":::

### Get analyze results (GET request)

1. After your successful **POST** request, poll the operation-location header returned in the POST request to view the processed data.

1. Here's the structure of the **GET** request:

   ```http
   GET {cognitive-service-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview
   ```

1. Before you run the command, make these changes:

    * Replace {**jobId**} with the Operation-Location header from the POST response.

    * Replace {**your-language-resource-endpoint**} and {**your-key**} with the values from your Language service instance in the Azure portal.

### Get request

```powershell
    cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" -i -X GET --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

```bash
    curl -v -X GET "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

#### Examine the response

You receive a 200 (Success) response with JSON output. The **status** field indicates the result of the operation. If the operation isn't complete, the value of **status** is "running" or "notStarted", and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

#### Sample response

```json
{
  "jobId": "f1cc29ff-9738-42ea-afa5-98d2d3cabf94",
  "lastUpdatedDateTime": "2024-01-24T13:17:58Z",
  "createdDateTime": "2024-01-24T13:17:47Z",
  "expirationDateTime": "2024-01-25T13:17:47Z",
  "status": "succeeded",
  "errors": [],
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "ExtractiveSummarizationLROResults",
        "lastUpdateDateTime": "2024-01-24T13:17:58.33934Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "id": "doc_0",
              "source": {
                "kind": "AzureBlob",
                "location": "https://myaccount.blob.core.windows.net/sample-input/input.pdf"
              },
              "targets": [
                {
                  "kind": "AzureBlob",
                  "location": "https://myaccount.blob.core.windows.net/sample-output/df6611a3-fe74-44f8-b8d4-58ac7491cb13/ExtractiveSummarization-0001/input.result.json"
                }
              ],
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "2023-02-01-preview"
        }
      }
    ]
  }
}
```

---

***Upon successful completion***:

* The analyzed documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returned response headers including `Operation-Location` that provides a value used in subsequent GET requests.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [PII detection overview](../personally-identifiable-information/overview.md "Learn more about Personally Identifiable Information detection.") [Document Summarization overview](../summarization/overview.md "Learn more about automatic document summarization.")
