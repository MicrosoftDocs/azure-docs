---
title: "Batch API concepts"
titleSuffix: Azure AI services
description: Learn how to use Batch APIs
author: ginle
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/22/2024
ms.author: lajanuar
---
# Batch API

## What is Batch API?

Batch API allows a large volume or a set of documents - such as a stack of invoices or a collection of loan documents - to be processed together. Traditionally, without Batch API you would send each of those documents for analysis one at a time, and keep track of the individual request ID's for the analysis operation to be completed. If we process such set of documents by analyzing each document one at a time, it will require multiple long-running operations on the client side that need to be managed separately - which can be time-consuming and cumbersome. Therefore, we introduce Batch API to process multiple documents "in a batch" to simplify developer experience and improve service efficiency for our users.

## Capabilities

* User can specify the desired input and output locations. All batch analysis results are stored directly in the user-provided storage. Setting output location to the same storage as the input location writes the batch analysis results next to the original documents, which can enable custom model/classifier training.
* Batch API allows skipping of documents with already pre-computed results. This enables additional documents to be added for the analysis operation.
* Upon completion, the operation result lists all of the individual documents processed with their status, such as `succeeded`, `skipped`, or `failed`.

For more information on how to use Batch API, check out the how-to guide.

## Limits

These are the current limits to Batch API:

* Maximum number of documents processed per single batch analyze request (including skipped documents) is 10,000 documents.
    * This limit prevent clients from consuming excessive memory when processing large amounts of documents.
    * Clients can use `azureBlobFileListSource` to break larger requests into smaller ones. For more details on `azureBlobFileListSource`, check How-to Guide for Batch API.
* After 24 hours have passed since the batch analyze operation, the operation results will be deleted. The analysis results would have been stored in customer's storage.

## Pricing

Currently for the preview version, all Batch API usage is charged on the **pay-as-you-go** tier. Support for commitment tiers will be available later. For more information on the different prices for pay-as-you-go tier by document analysis types (i.e. Read, Prebuilt extraction, Custom extraction), check our [service pricing page](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/).