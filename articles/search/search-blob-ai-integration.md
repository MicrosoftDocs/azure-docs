---
title: Use AI to understand Blob data
titleSuffix: Azure Search
description: Add semantic, natural language processing and image analysis to Azure blobs using an AI enrichment pipeline in Azure Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: search
ms.topic: conceptual
ms.date: 10/09/2019
---

# Use AI to understand Blob data

Data in Azure Blob storage is often a variety of unstructured content such as images, long text, PDFs, and Office documents. You can use the AI capabilities in Azure to understand this content and extract valuable information from them. Examples include:

+ Extract text from images using optical character recognition (OCR)
+ Produce a scene description or tags from a photo
+ Detect language and translate text into different languages
+ Process text with named entity recognition (NER) to find references to people, dates, places, or organizations 

While you might need just one of these AI capabilities, it’s common to combine multiple of them into the same pipeline (for example, extracting text from a scanned image and then finding all the dates and places referenced in it). Post-enrichment, given the existence of new information, you’ll typically want to power application experiences with it that includes exploring data for discovery or analytics scenarios. 

In this article, we give you a roadmap for understanding how you can use AI enrichment to implement the entire process of transforming raw data in blobs to queryable and searchable information in a search index.

## What is AI enrichment

AI enrichment is a capability of an indexing pipeline in Azure Search that integrates built-in AI from Cognitive Services or custom AI functions that you provide. Broadly, AI enrichment helps you implement end-to-end scenarios where you need to process blobs (both existing ones and new ones as they come in or are updated), crack open all file formats to extract images and/or text, add extract the desired information using various AI capabilities.

Inputs are your blobs, in one container, in Azure Blob storage. Blobs can be almost any kind of data. The content you have, plus the end goal you are trying to achieve, will inform your decisions about which skills to apply and in what order.

The pipeline architecture itself is based on the *indexer* feature, to which you can assign a *skillset*, which is a composition of one or more *skills* providing the AI. 

Output is always an Azure Search index, used for fast text search, retrieval, and exploration in client applications. Alternatively, for indexers that include a skillset, output can also be a *knowledge store* that projects enriched documents into Azure blobs or Azure tables for downstream analysis in tools like Power BI or in data science workloads.

## How to get started

You can start directly in your storage account portal page. Click **Add Azure Search** and create a new Azure Search service or select an existing one. If you have an existing search service in the same subscription, clicking **Add Azure Search** opens the Import data wizard so that you can 

Once you started the process to add Azure Search to your storage account, you can follow the standard process to enrich data in any Azure data source, described step-by-step in Create an AI enrichment pipeline using cognitive skills in Azure Search. 

There’s a lot more you can do with AI enrichment to get the most out of your data in Azure Storage, including combining Cognitive Services in different ways, and authoring custom skills for cases where there’s no existing Cognitive Service for the scenario. You can learn more in What is “Cognitive Search” in Azure Search. 

## Next Steps
Learn more about the Azure Search Blob Indexer in the full [documentation](https://aka.ms/azsblobindexer).
