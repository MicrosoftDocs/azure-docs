---
title: Batch document processing support gpt Document Intelligence (formerly Form Recognizer) to analyze documents in storage blobs.
titleSuffix: Azure AI services
description: The Batch API provides a simple interface to analyze documents with general models, prebuilt models or custom models and write the output back to the storage account.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 02/29/2024
ms.author: vikurpad
ms.custom:
monikerRange: '>=doc-intel-4.0.0'
---



# Batch document processing support

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

Azure AI Document Intelligence is a cloud-based Azure AI service that enables you to build intelligent document processing solutions. Document Intelligence APIs analyze images, PDFs, and other document files to extract and detect various content, layout, style, and semantic elements.

## Getting started with the Batch API

The [Batch Analyze documents](https://westus.dev.cognitive.microsoft.com/docs/services/document-intelligence-api-2024-02-29-preview/operations/BatchAnalyzeDocuments) operation enables you to send API requests asynchronously, using an HTTP `POST` request body to send your data and HTTP `GET` request query string to retrieve the processed data. Submitting a document returns an **Operation-Location** header that contains the URL to poll for completion. When an analysis request completes successfully, the response contains the elements described in the [model data extraction](concept-model-overview.md#model-data-extraction). The response JSON is described in the [analyze response](concept-analyze-document-response.md).

### Azure storage

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

Each request can contain multiple documents and must contain a source and target container for each document

|Query parameter| Description | Condition|
| --- | --- |---|
| **`azureBlobSource`** or **`azureBlobFileListSource`** | The source location URL for the input documents.<br>&bullet; The `azureBlobSource` property is used when specifying the location where all valid input files are processed.<br>&bullet; The `azureBlobFileListSource` property is used when only a few specific documents within a container or folder are to be processed | &bullet; ***One is Required***.<br>&bullet; ***Only one is allowed per request.***|
|**`containerUrl`** | Container location for the source documents.| ***Required***|
|**`prefix`** | Used with the `azureBlobSource` property to filter documents in the source path for processing. Often used to designate subfolders. Example: "FolderA".| ***Optional***|
| **`fileList`**| Used with the `azureBlobFileListSource` property to specify documents for analysis.| ***Required***|
| ***resultContainerUrl*** | The target location URL for the analyzed document results.|***Required***|
|***resultPrefix***| Used with the `resultContainerUrl` property to specify a specific folder to store your analyzed document results.|
|***overwriteExisting***| If a A boolean value to indicate if any existing documents should be overwritten or skilled. The values are `true` (overwrite) or `false` (default, skip). This property is only checked when the service is attempting to write the results. The number of pages processed will still be counted for billing including files that are skipped.

### Sample requests

**Process all documents in a container**

```json
{
  "azureBlobSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "prefix": "trainingDocs/"
  },

  "resultContainerUrl": {

   "containerUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer?mySasToken",
  "resultPrefix": "trainingDocsResult/"
  },
  "overwriteExisting": true
}
```

**Process specified documents in a container**

```json
{
  "azureBlobFileListSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "fileList": "myFileList.jsonl"
  },

  "resultContainerUrl":{ 
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer?mySasToken",
  "resultPrefix": "trainingDocsResult/"},
  
  "overwriteExisting": false
}
```

### Response

For each accepted batch API request, the service responds with a URL for a long running operation in the ```operation-location``` response header. Polling the URL gives you the status of the batch request.

The response body contains the folloing properties
*  Status - can be either ```notStarted```, ```running```, ```completed``` or ```failed```
* percentCompleted - an estimate based on the number of processed document
* createdDateTime - The timestamp the request was submitted
* lastUpdatedDateTime - When the status of the request was last updated
* result - the aggregate details of the files processed, skipped or failed and the details by by status for each file.
* error - The error is only returned if there is an error with the request. If a individual document fails for some reason, the request can still complete successfully.

The ```resultUrl``` within the ```result``` is constructed by combinign the ```resultContainerUrl```, ```resultPrefix```, when provided, the file name and the string ```ocr.json```.

### Cancel batch

The cancel operation is currently not supported and batch operations once submitted cannot be cancelled.

### Using the batch API to generate dataset for custom models

You can use the batch API to pepare a dataset for labeling by running all documents through the ```Layout API``` o you could pre-label documents with a custom model. When using the batch API to generate a training dataset for a custom model, set ```resultContainerUrl``` and ```resultPrefix``` to match ```azureBlobSource```.

## Limits

* Maximum number of files that can be processed in a single batch request is 10000.
* The maximum numner of pages for a single file remains unchanged.

## Next steps

* Learn more about the [response content](concept-analyze-document-response.md)

