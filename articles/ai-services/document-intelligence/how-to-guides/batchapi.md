---
title: "How to use Batch API"
titleSuffix: Azure AI services
description: Learn how to use Batch APIs
author: ginle
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/22/2024
ms.author: lajanuar
---
# How to Use Batch API

Batch API helps user analyze a "batch" of documents in a bulk process instead of having to call `analyze` operation for each document. Here is a list of API calls you can use to batch analyze your set of documents and store the output analysis results.

## Pre-requisites

* An Azure subscription. 
* A [Document Intelligence](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) instance in the Azure portal. You can use the free pricing tier (`F0`) to try the service.
* An Azure Blob Storage container to store input files as well as output results.

## Calling Batch API

First, you need to specify the location of the document set, which would be your Azure Blob Storage container. This can be specified in either `azureBlobSource` or `azureBlobFileListSource`.

Second, you need to specify the location to which the batch analysis will be stored. This can be specified in `resultContainerUrl`. This can be a Blob Storage container that is the same as the input documents container, or a different one. If you would like to minimize potential chances of accidentally overwriting data, we recommend choosing a different container.

If you would like to keep the same container, set `resultContainerUrl` and `resultPrefix` to match your input `azureBlobSource`. For using same containers, we provide `overwriteExisting` field for you to decide to overwrite any files with the analysis result files or not.

You can call the Batch API through a `POST` call that specifies input and output locations, such as below:

```bash
POST /documentModels/{modelId}:analyzeBatch
{
  // Allow one of azureBlobSource or azureBlobFileListSource.
  "azureBlobSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "prefix": "trainingDocs/"
  },
  "azureBlobFileListSource": {
    "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
    "fileList": "myFileList.jsonl"
  },

  // Output location of analyze result files.
  "resultContainerUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer?mySasToken",
  "resultPrefix": "trainingDocsResult/",

  // If analyze result file exists, decide to overwrite the file or not
  "overwriteExisting": false
}

202 Accepted
Operation-Location: /documentModels/{modelId}/analyzeBatchResults/{resultId}
```

## Batch API results

After the Batch API operation has been executed, you need to retrieve the batch analysis results using a `GET` operation. This operation will fetch operation status information, operation completion percentage, and operation creation and update date/time.

```bash
GET /documentModels/{modelId}/analyzeBatchResults/{resultId}
200 OK

{
  "status": "running",      // notStarted, running, completed, failed
  "percentCompleted": 67,   // Estimated based on the number of processed documents
  "createdDateTime": "2021-09-24T13:00:46Z",
  "lastUpdatedDateTime": "2021-09-24T13:00:49Z",
```

When the status is `notStarted` or `running`, it means the batch analysis operation has not been initiated or has not been completed yet. Please wait until the operation has been completed for all documents.

When the status is `completed`, it indicates batch analysis operation has finished.

When the status is `failed`, it indicates the batch operation has failed. This will usually happen if there are overall issues with the request. Failures on individual files will be returned in the batch report response, even if all the files failed. For example, storage errors (ex. rotation of SAS token) will not halt the batch operation as a whole, so that user can access partial results via the batch report response.

For each document in the document set, there will be a status assigned, either `succeeded`, `failed`, or `skipped`. For each document, there will be two URLs provided to validate the results: `sourceUrl`, which is source blob storage container of succeeded input document, as well as `resultUrl`, which is constructed by combining `resultContainerUrl`, `resultPrefix`, the relative path of the source file, and `.ocr.json`.

Only files that have status as `succeeded` will have the property `resultUrl` generated in the response. This enables model training to detect file names that end with `.ocr.json` and identify them as the only files that can be used for training.

For a `succeeded` status, the details will look like below:

```bash
  "result": {
    "succeededCount": 3,
    "failedCount": 1,
    "skippedCount": 0,
    "details": [
      {
        // Succeeded.  See resultUrl for full result.
        "sourceUrl": "https://myStorageAccount.blob.core.windows.net/myContainer/trainingDocs/file1.pdf",
        "resultUrl": "https://myStorageAccount.blob.core.windows.net/myOutputContainer/trainingDocsResult/file1.pdf.ocr.json",
        "status": "succeeded"
      },
        ...
```

For a `failed` status, the details will look like below:

* Error will only be returned if there are errors in the overall batch request (ex. invalid `azureBlobSource`).
* Once the batch analysis operation has been started, individual document operation status will not affect the status of the overall batch job, even if all the files have the status `failed`.

```bash
    "result": {
    "succeededCount": 0,
    "failedCount": 2,
    "skippedCount": 2,
    "details": [
        "sourceUrl": "https://myStorageAccount.blob.core.windows.net/myContainer/trainingDocs/file2.jpg",
        "status": "failed",
        "error": {
            "code": "InvalidArgument",
            "message": "Invalid argument.",
            "innererror": {
              "code": "InvalidSasToken",
              "message": "The shared access signature (SAS) is invalid: {details}"
            }
        }
        ...
```

For a `skipped` status, the details will look like below:

```bash
    "result": {
    "succeededCount": 3,
    "failedCount": 0,
    "skippedCount": 2,
    "details": [
        ...
        "sourceUrl": "https://myStorageAccount.blob.core.windows.net/myContainer/trainingDocs/file4.jpg",
        "status": "skipped",
        "error": {
            "code": "OutputExists",
            "message": "Analysis skipped because result file {path} already exists."
        }
      ...
```

Based on the batch analysis results as above, you can identify which files have been successfully analyzed, and validate the analysis results by comparing the file in the `resultUrl` with the output file in the `resultContainerUrl`.

Note that we do not return the analysis results for individual files until the entire batch analysis for the whole input document set has completed. If you wish to track detailed progress beyond `percentCompleted`, you can monitor `*.ocr.json` files as they get written into the `resultContainerUrl`.
