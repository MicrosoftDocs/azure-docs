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

You can start directly in your storage account portal page. Click **Add Azure Search** and create a new Azure Search service or select an existing one. If you already have an existing search service in the same subscription, clicking **Add Azure Search** opens the Import data wizard so that you can immediately step through indexing, enrichment, and index definition.

Once you add Azure Search to your storage account, you can follow the standard process to enrich data in any Azure data source, described step-by-step in [Create an AI enrichment pipeline using REST APIs](cognitive-search-tutorial-blob.md). 

In the following sections, we'll explore components and concepts, enrichment design, and key decisions you will make along the way.

## Use the blob indexer

Azure Search indexers are source-specific, with internal logic for sampling data, reading metadata data, retrieving data, serializing data from native formats into JSON documents that can be imported into an Azure Search index.

The indexer for Azure Blob storage is specified by setting the type, and by always using a data source object that connects to an Azure Storage account and a blob container. The blob indexer pulls from the entire container, unless you've previously organized blobs into a virtual directory that you then pass as a parameter.

An indexer does document cracking, and after connecting to the data source, it's the first step in the pipeline. For blob data, this is where PDF, office docs, image, and other content types are detected. As a developer, you should have a solid grasp of the content you can plan to enrich. Understanding your data is necessary for choosing skills, for example whether files need to be split or analyzed, but also for estimating the costs of enrichment.

+ Document cracking with text extraction is no charge
+ Document cracking with image extraction is charged

Although all documents will be cracked, enrichment only occurs if you explicitly provide the skills to do so. For example, if your pipeline consists exclusively of text analytics, any images in your container or documents will be ignored.

The Blob indexer comes with configuration parameters. You can learn more about them in [Indexing Documents in Azure Blob Storage](search-howto-indexing-azure-blob-storage.md).

## Choosing skills

AI enrichment is synonymous with skills and skillsets. An indexer can consume exactly one skillset, but that skillset exists independently of an indexer so that you can reuse it in other scenarios.

A skillset is a invoked after document cracking makes content available to the pipeline, and it consists of either built-in skills or custom skills that you create and wrap in an interface definition that allows for inclusion in a skillset. It's common practice to use both, with custom skills providing open-source, third-party, or first-party AI modules.

Built-in skills consists of AI backed by Cognitive Services, as well as "helper" skills that are not associated with Cognitive Services. 

+ AI-based skills from Cognitive Services require an attached Cognitive Services all-in-one subscription key that gives you access to the backend resource. These include all image analysis, language detection, text translation, and text analytics.
+ Helper skills are features of Azure Search. Text shaper, splitter, and merger are examples. 

If you use only custom skills and utility skills, there is no dependency on Cognitive Services.

## Order of operations

A skillset is a composition of one or more skills. When multiple skills are involved, the skillset produces a dependency graph, where output from one skill becomes input to another. 

A common order of operations for text analytics might be as follows:

1. Text split
1. Detect language
1. Translate text, extract entitites or key phrases, score sentiment
1. Text merge

## Map skills and nodes

TBD

## Output definition

TBD

## How to use enriched documents

TBD

## Next steps

There’s a lot more you can do with AI enrichment to get the most out of your data in Azure Storage, including combining Cognitive Services in different ways, and authoring custom skills for cases where there’s no existing Cognitive Service for the scenario. You can learn more by following the links below.

> [!div class="nextstepaction"]
> [AI enrichment overview](cognitive-search-concept-intro.md) 
> [Create a skillset](cognitive-search-defining-skillset.md)
> [Map nodes in an annotation tree](cognitive-search-output-field-mapping.md)
