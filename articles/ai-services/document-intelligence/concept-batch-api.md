---
title: Document Intelligence Batch API document processing support for analyzing documents in storage blobs.
titleSuffix: Azure AI services
description: The Batch API provides a simple interface to analyze documents with general, prebuilt, or custom models and returning the output results to your storage account.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 02/29/2024
ms.author: vikurpad
ms.custom:
monikerRange: '>=doc-intel-4.0.0'
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# Batch document processing support

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

Azure AI Document Intelligence is a cloud-based Azure AI service that enables you to build intelligent document processing solutions. Document Intelligence APIs analyze images, PDFs, and other document files to extract and detect various content, layout, style, and semantic elements.

## Getting started with the Batch API

The [Batch Analyze documents](https://westus.dev.cognitive.microsoft.com/docs/services/document-intelligence-api-2024-02-29-preview/operations/BatchAnalyzeDocuments) API is supported for all [Document Intelligence models](overview.md#document-analysis-models) and [supported languages](language-support-ocr.md).

The Batch Analyze operation enables you to send API requests asynchronously, using an HTTP `POST` request body to send your data and HTTP `GET` request query string to retrieve the status results. Submitting a document returns an **Operation-Location** header that contains the URL to poll for completion.

When an analysis request completes successfully, the response contains the elements described in the [model data extraction](concept-model-overview.md#model-data-extraction). The response JSON is described in the [analyze response](concept-analyze-document-response.md). Your processed documents are located in your Azure Blob Storage output container.

### Azure Blob Storage

The batch translation process requires an Azure Blob storage account with containers for your input documents and output results.

* **Input container (`containerUrl`)**. This container is where you upload your files for processing (required).
* **Output container (`resultContainerUrl`)**. This container is where your translated files are stored (required).

### Authentication

The `containerUrl`  and `resultContainerUrl` can be authenticated with a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs.

* Your source container `containerUrl` or blob must designate `read` and `list` access.
* Your target container or blob `resultContainerUrl` must designate `write` and `list` access.

### Request URL

**Send a POST request:**

```bash

  POST {your-document-intelligence-endpoint}/documentintelligence/documentModels/{modelId}:analyzeBatch?api-version=2024-02-29-preview

```

### Request headers

To call the Batch API via the REST, include the following header with each request:

|Header|Value| Condition  |
|---|:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Document Intelligence service key from the Azure portal.|&bullet; ***Required***|

### Request body

Each request can contain multiple documents and must contain a source and target container for each document.

|Query parameter| Description | Condition|
| --- | --- |---|
| **`azureBlobSource`** or **`azureBlobFileListSource`** | The source location URL for the input documents.<br>&bullet; The `azureBlobSource` property is used when specifying the location where all valid input files are processed.<br>&bullet; The `azureBlobFileListSource` property is used when only a few specific documents within a container or folder are to be processed | &bullet; ***One is Required***.<br>&bullet; ***Only one is allowed per request.***|
|**`containerUrl`** | Container location for the source documents.| ***Required***|
|**`prefix`** | Used with the `azureBlobSource` property to filter documents in the source path for processing. Often used to designate subfolders. Example: "FolderA".| ***Optional***|
| **`fileList`**| Used with the `azureBlobFileListSource` property to specify documents for analysis.| ***Required***|
| ***resultContainerUrl*** | The target location URL for the analyzed document results.|***Required***|
|***resultPrefix***| Used with the `resultContainerUrl` property to specify a specific folder to store your analyzed document results.|
|***overwriteExisting***| If a A boolean value to indicate if any existing documents should be overwritten or skilled. The values are `true` (overwrite) or `false` (default, skip). This property is only checked when the service is attempting to write the results. The number of pages processed is still counted for billing, including files that are skipped.|

### Sample requests

***Process all documents in a container***

```json
{
  "azureBlobSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "prefix": "trainingDocs/"
  },
  "resultContainerUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer?mySasToken",
  "resultPrefix": "trainingDocsResult/",
  "overwriteExisting": true
}
```

***Process specified documents in a container***

```json
{
  "azureBlobFileListSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "fileList": "myFileList.jsonl"
  },
  "resultContainerUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer?mySasToken",
  "resultPrefix": "trainingDocsResult/",
  "overwriteExisting": false
}
```

### Response

Upon successful completion:

* The successful `POST` method returns a `202 OK` response code indicating that the service created the batch request.
* The translated documents are located in your target container.
* The `POST` request also returns response headers including `Operation-Location`. The value of this header contains a `resultId` that can be queried to get the status of the asynchronous operation and retrieve the results using a `GET` request with your same resource subscription key.

***Operation-Location header***:

```http
Operation-Location: {your-endpoint} /documentintelligence/documentModels/{modelId}/analyzeBatchResults/{resultId}?api-version=2024-02-29-preview
```

***GET request***:

```bash
GET {your-endpoint}/documentintelligence/documentModels/{modelId}/analyzeBatchResults/{resultId}?api-version=2024-02-29-preview
```

The `GET` response body includes the following properties:

* **status**. `notStarted`, `running`, `completed`, or `failed`.

* `percentCompleted`. Estimated based on the number of processed documents.

* **result**. The aggregate `details` of all documents processed with their status: `succeededCount`, `skippedCount`, or `failedCount` for each file.

  * Documents that are skipped because the `resultUrl` already exists are listed with status=skipped without the corresponding `resultUrl`.

  * Documents that failed are listed with `status=failed` without a corresponding `resultUrl`.

* **error**. The error is only returned if there's an error with the request. If an individual document fails for some reason, the request can still complete successfully.

### Service limits

* The maximum number of documents that can be processed in a single batch request (including skipped documents) is **`10,000`**.

* `.ZIP` file format isn't supported for Batch Analyze operations.

### Custom models

* You can use the Batch API to prepare a dataset for labeling by processing all documents through the `Layout API` or you can prelabel your documents with a custom model.

* When using the Batch API to generate a training dataset for a custom model, set the request body `Batch Analyze` `resultContainerUrl` and `resultPrefix` values to match the Custom model training operation  `azureBlobSource` `containerUrl` value. For more information, *see* [Training a model](concept-custom-template.md#training-a-model).

### Cancel batch

The cancel operation is currently not supported and batch operations once submitted can't be canceled.

## Next steps

* Learn more about the [Analyze document API response](concept-analyze-document-response.md)
