---
title: "Batch API"
titleSuffix: Azure AI services
description: Learn how to use Batch APIs
author: ginle
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/22/2024
ms.author: lajanuar
---
# Batch API

## What is Batch API?
Batch API allows a set of documents, instead of a single document, to be processed simultaneously. For example, a stack of invoices or a collection of loan documents. If we process such set of documents by calling `:analyze` for each document, it requires tracking multiple long-running operations on the client side, and can often trigger TPS limits. Therefore, we introduce Batch API to process multiple documents "in a batch" to simplify developer experience and improve service efficiency for our users.



## Capabilities 

## Limits 
* Maximum number of documents processed per batch analyze request (including skipped documents) is 10,000.
    * This prevents internal services from running out of memory when generating the batch report.
    
Reference limits
Document AI: 5000 files
Speech batch transcription: 1000 files
Internally, we can consider limiting the number of pages processed in parallel per resource to improve fairness.
Although the actual analysis results will be stored in customer storage, we will still delete the operation result after 24 hours since we expect most batch operations to complete in 2 hours.
## Pricing

# How to Use Batch API

## Pre-requisites

* An Azure subscription. 
* A [Document Intelligence](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) instance in the Azure portal. You can use the free pricing tier (`F0`) to try the service.
* An Azure Blob Storage container to store input files as well as output results.

## Calling the batch API
## Checking for completion
## Validating the results