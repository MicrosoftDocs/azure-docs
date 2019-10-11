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

Data in Azure Blob storage is often a variety of unstructured content such as images, long text, PDFs, and Office documents. By using the AI capabilities in Azure Search, you can understand and extract valuable information from blobs in a variety of ways. Examples of applying AI to blob content include:

+ Extract text from images using optical character recognition (OCR)
+ Produce a scene description or tags from a photo
+ Detect language and translate text into different languages
+ Process text with named entity recognition (NER) to find references to people, dates, places, or organizations 

While you might need just one of these AI capabilities, it’s common to combine multiple of them into the same pipeline (for example, extracting text from a scanned image and then finding all the dates and places referenced in it). 

AI enrichment creates new information, captured as text, stored in fields. Post-enrichment, you can access this information from a search index through full text search, or send enriched documents back to Azure storage to power new application experiences that include exploring data for discovery or analytics scenarios. 

In this article, we give you a roadmap for understanding how you can use AI enrichment to implement the entire process of transforming raw data in blobs, to queryable and searchable information in either a search index or a knowledge store.

## What is AI enrichment

AI enrichment is a capability of an indexing pipeline in Azure Search that integrates built-in AI from Cognitive Services or custom AI functions that you provide. Broadly, AI enrichment helps you implement end-to-end scenarios where you need to process blobs (both existing ones and new ones as they come in or are updated), crack open all file formats to extract images and/or text, add extract the desired information using various AI capabilities.

Inputs are your blobs, in one container, in Azure Blob storage. Blobs can be almost any kind of data. The content you have, plus the end goal you are trying to achieve, will inform your decisions about which skills to apply and in what order.

The pipeline architecture itself is based on the *indexer* feature, to which you can assign a *skillset*, which is a composition of one or more *skills* providing the AI. 

Output is always an Azure Search index, used for fast text search, retrieval, and exploration in client applications. Alternatively, for indexers that include a skillset, output can also be a *knowledge store* that projects enriched documents into Azure blobs or Azure tables for downstream analysis in tools like Power BI or in data science workloads.

## How to get started

You can start directly in your storage account portal page. Click **Add Azure Search** and create a new Azure Search service or select an existing one. If you already have an existing search service in the same subscription, clicking **Add Azure Search** opens the Import data wizard so that you can immediately step through indexing, enrichment, and index definition.

Once you add Azure Search to your storage account, you can follow the standard process to enrich data in any Azure data source, described step-by-step in [Create an AI enrichment pipeline using REST APIs](cognitive-search-tutorial-blob.md). 

In the following sections, we'll explore components and concepts, enrichment design, and key decisions you will make along the way.

### Use the blob indexer

AI enrichment is an indexing pipeline process, and in Azure Search, those pipelines are built over the *indexer* feature. An indexer is a data-source-aware subservice equipped with internal logic for sampling data, reading metadata data, retrieving data, and serializing data from native formats into JSON documents for subsequent import.

Blobs in Azure Storage are indexed using the Azure Search Blob storage indexer. You invoke this indexer by setting the type, and by providing connection information that includes a Azure Storage account and specifies a blob container. The blob indexer pulls from the entire container, unless you've previously organized blobs into a virtual directory that you then pass as a parameter.

An indexer does "document cracking", and after connecting to the data source, it's the first step in the pipeline. For blob data, this is where PDF, office docs, image, and other content types are detected. Document cracking with text extraction is no charge. Document cracking with image extraction is charged at rates you can find on the pricing page.

Although all documents will be cracked, enrichment only occurs if you explicitly provide the skills to do so. For example, if your pipeline consists exclusively of text analytics, any images in your container or documents will be ignored.

The Blob indexer comes with configuration parameters. You can learn more about them in [Indexing Documents in Azure Blob Storage](search-howto-indexing-azure-blob-storage.md).

### Choose skills

*Skills* are the individual components of AI processing that you can use standalone or in combination with other skills for sequential processing. Built-in skills are backed by Cognitive Services, with image analysis based on Computer Vision, and natural language processing based on Text Analytics. Custom skills are custom code, wrapped in an interface definition that allows for integration into the pipeline. In customer solutions, it's common practice to use both, with custom skills providing open-source, third-party, or first-party AI modules.

A skillset is a invoked after the document cracking phase makes content available to the pipeline. An indexer can consume exactly one skillset, but that skillset exists independently of an indexer so that you can reuse it in other scenarios.

Custom skills are more straight forward than they sound. If you have existing packages that provide pattern matching or classifcation models, the content you extract from blobs could be passed to these models for processing. Since AI enrichment is Azure-based, your model should be on Azure also. Some common hosting methodologies include Azure Functions or Containers.

Built-in skills backed by Cognitive Services require an attached Cognitive Services all-in-one subscription key that gives you access to the resource. An all-in-one key gives you image analysis, language detection, text translation, and text analytics. Other built-in skills are features of Azure Search and require no additional service or key. Text shaper, splitter, and merger are examples of helper skills that are sometimes necessary when designing the pipeline.

If you use only custom skills and built-in utility skills, there is no dependency or costs related to Cognitive Services.

### Order of operations

Now we've covered indexers, content extraction, and skills, we can take a closer look at pipeline mechanisms and order of operations.

A skillset is a composition of one or more skills. When multiple skills are involved, the skillset operates as sequential pipline, producing dependency graphs, where output from one skill becomes input to another. 

For example, given a large blob of unstructured text, a sample order of operations for text analytics might be as follows:

1. Use Text Splitter to break the blob into smaller parts.
1. Use Language Detection to determine if content is English or another language.
1. Use Text Translator to get all text into a common lnguage.
1. Run Entity Recognition, Key Phrase Extraction, or Sentiment Analysis on chunks of text. In this step, new fields are created and populated. Entities might be location, people, organization, dates. Key phrases are short combinations of words that appear to belong together. Sentiment score is a rating on continuum of negative (0) to positive (1) sentinment.
1. Use Text Merger to reconstitute the document from the smaller chunks..


### Output definition and use cases

An enriched document at the end of the pipeline differs from its original input version by the presence of additional fields containing new infomration that was extracted or generated during enrichment. As such, you can work with a combination of original and created values in several ways.

The output formations are a search index on Azure Search, or a knowledge store in Azure Storage.

In Azure Search, enriched documents are formatted in JSON and can be indexed in the same way all documents are indexed, with the benefits an indexer provides. Fields from enriched documents are mapped to an index schema. During indexing, the blob indexer refers to configuration parameters and settings to utilize any field mappings or change detection logic that you've specified. Post-indexing, when content is stored on Azure Search, you can build rich queries and filter expressions to understand your content.

In Azure Storage, a knowledge store has two manifestations: a blob container, or tables in Table storage. A blob container captures enriched documents in their entirety, which is useful if you want to feed into other processes. In contrast, Table storage can accommodate physical projections of enriched documents. You can create slices or layers of enriched documents that include or exclude specific parts. For analysis in Power BI, the tables in Azure Table storage become the data source for further visualization and exploration.

## Next steps

There’s a lot more you can do with AI enrichment to get the most out of your data in Azure Storage, including combining Cognitive Services in different ways, and authoring custom skills for cases where there’s no existing Cognitive Service for the scenario. You can learn more by following the links below.

> [!div class="nextstepaction"]
> [AI enrichment overview](cognitive-search-concept-intro.md) 
> [Create a skillset](cognitive-search-defining-skillset.md)
> [Map nodes in an annotation tree](cognitive-search-output-field-mapping.md)
