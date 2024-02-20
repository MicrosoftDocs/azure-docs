---
title: Document Intelligence (formerly Form Recognizer) Batch API to analyze documents in storage blob
titleSuffix: Azure AI services
description: Batch API provides a simple interface to analayze documents with general models, prebuilt models or custom models and write the output back to the storage account. 
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 02/17/2024
ms.author: vikurpad
ms.custom:
monikerRange: '>=doc-intel-4.0.0'
---



# Batch API

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png) 

Use the Batch API when you have a collection of documents to analyze. With the Batch API, you only need to make a single request to process all the documents you need. With the Batch API, you can specify the files to be processed, the model to use and the location oof where the results are saved.

## Getting started with the batch API

The Document Intelligence APIs analyze images, PDFs, and other document files to extract and detect various content, layout, style, and semantic elements. The analyze operation is an async API. Submitting a document returns an **Operation-Location** header that contains the URL to poll for completion. When an analysis request completes successfully, the response contains the elements described in the [model data extraction](concept-model-overview.md#model-data-extraction). The response JSON is described in the [analyze response](concept-analyze-document-response).

The batch API simplifies the process when analyzing a large volume of documents. With the async API, you currently submit each input document in a request and poll for completion of that request to then wrrite the results to the detination location. With the batch API, you submit a single request for all input documents, you can construct the batch request at the container level, individual folder level or provide a list of files to be processed.

The output from the batch API is written to a storage container you specify in the input request.

### Constructing a batch API request

A valid request contains the following elements:
* The location of the input documents
* The destination for where the results are saved
* A boolean value to indicate if any existing documents should be overwritten or not

#### Input location

The batch API only supports Azure blob storage for reading and saving files. You specifty the input location with
* ```azureBlobSource``` used when specifying a location where all valid input files are processed. The ```azureBlobSource``` property contains two  properties
    * ```containerUrl``` The SAS URL to the container were the files are contained. The SAS token requires ```list``` and ```read``` permissions.
    * ```prefix``` Optionally, you can provide a prefix if the files to be processed are within a specif folder.
* ```azureBlobFileListSource``` used when only a few specific documents within a container or folder are to be processed. The ```azureBlobFileListSource``` property contains two properties
    * ```containerUrl``` The SAS URL to the container were the files are contained. The SAS token requires ```list``` and ```read``` permissions.
    * ```fileList``` A list of files to be processed in JSONL notation.

Each request can contain either the azureBlobSource or the azureBlobFileListSource property, not both.

The sample below is the contents of a fileList.

```json
{"file": "Adatum Corporation.pdf"}
{"file": "Contoso.pdf"}
```

#### Output location

Specify the output location with the ```resultContainerUrl```. The SAS token for the container should include ```write``` and ```add``` permissions.

#### Overwrite files

If the analyze result exists, the result will be overwritten when ```overwriteExisting``` is set to true or the file is skipped when ```overwriteExisting``` is set to false, which is also the default value. This is only checked when the ervice is attempting to write the results and the pages processed will still be counted for billing if the file is skipped.

### Sample request

Sample request with the blog source option

```json
{
    "azureBlobSource": {
        "containerUrl": "https://{storageaccount}.blob.core.windows.net/{container}?{SAS Token}",
        "prefix": "{folder name to filter list of blobs}"
    },
    "resultContainerUrl": "https://{storageaccount}.blob.core.windows.net/{output container}?{SAS Token}",
    "resultPrefix": "{folder name to save output}/",
    "overwriteExisting": false
}
```

Sample request with the file list option

```json
{
    "azureBlobFileListSource": {
        "containerUrl": "https://{storageaccount}.blob.core.windows.net/{container}?{SAS Token}",
        "fileList": "{jsonl file name in the container}"
    },
    "resultContainerUrl": "https://{storageaccount}.blob.core.windows.net/{output container}?{SAS Token}",
    "resultPrefix": "{folder name to save output}/",
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

