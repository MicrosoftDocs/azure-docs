---
ms.service: azure
ms.author: reburkea
author: reburkea
title: Microsoft Discovery Bookshelf & Knowledge Bases
description: Conceptual overview of Microsoft Discovery Bookshelf service and Knowledge Bases. 
ms.topic: concept-article
ms.date: 03/23/2026
---

# Microsoft Discovery Bookshelf
Microsoft Discovery includes the Bookshelf, a service that enables customers to convert their data into curated graphs known as Knowledge Bases (KBs). The key components of the Bookshelf service are the Bookshelf resource and Knowledge Bases within each Bookshelf. A Knowledge Base contains a vector database and knowledge graph of your indexed artifacts. KBs can be used by Discovery agents as grounding skills and queried by Discovery agents for various use cases, including answering questions, summarization, and reasoning.

## When to use the Bookshelf
The Bookshelf is best for reasoning over your curated, proprietary data. Knowledge Bases are especially effective when their scoped contents are thematically related and directly applicable to your Discovery workflow. For example, an Application-Specific Integrated Circuit (ASIC) design team could create a Knowledge Base with their project's hardware specifications, simulation result reports, and the latest relevant literature from the field. Querying this Knowledge Base during design workflows ensures Discovery's reasoning is grounded with previous engineering content and scientific literature. 

For using data in a tool call or otherwise directly using data in Discovery, creating a Knowledge Base is often not necessary. Similarly, to search over vast repositories of data or to find resources that might be relevant to your workflow, we suggest using Azure AI Search, SharePoint Search, or similar general purpose search tools. Once you have identified the data that is most relevant to your workflow, a Knowledge Base including this curated data can help ground your Discovery workflows and derive new insights in context.

## Features
At a high level, the Bookshelf works by converting diverse file formats to text, then generating a graphical representation of that text, which can be queried using natural language.

The Bookshelf uses an advanced technique developed by Microsoft Research called Graph Retrieval-Augmented Generation (GraphRAG) to transform customer data into graph-based representations and generate responses to queries. Unlike traditional RAG methods, GraphRAG-based algorithms not only create an indexed vector database of the source content but also constructs a knowledge graph that captures entity relationships within the data. Research from Microsoft demonstrates that GraphRAG delivers more accurate and comprehensive grounding information than standard RAG or vector-based techniques, leading to higher-quality responses.

### Indexing
Currently, the Bookshelf supports indexing unstructured (text-based) file formats stored in Azure Blob Storage. Supported file formats include:

* Text (.txt)
* PDF (.pdf)
* Word (.docx)
* PowerPoint (.pptx)
* Excel (.xlsx)
* Markdown
* XML
* HTML
* JSON
* CSV

The Bookshelf uses Azure AI Search Enrichment to process supported file formats. Images embedded in supported file formats are processed using Azure AI Search's built-in [Vision skill](/azure/ai-services/computer-vision/overview), which automatically generates alt-text for embedded images. See [Azure AI Search's documentation](/azure/search/cognitive-search-skill-document-intelligence-layout#supported-file-formats) for the full list of supported file formats.

The knowledge graph and vector database that results from indexing, collectively known as a Knowledge Base (KB), are stored in an Azure SQL DB in your subscription.

### Query
The Bookshelf provides the query function that can be invoked by any agent running on the Microsoft Discovery platform, including your own agent.

## Known limitations

### Unsupported file types 
Encrypted, password-protected, or sensitivity-labeled files aren't supported for indexing. Any unsupported file types are skipped during indexing.

### Cross-project sharing

Bookshelves can't be shared across projects. Each project must have its own dedicated Bookshelves and Knowledge Bases.

> [!NOTE]
> The ability to share Bookshelves across projects is a planned feature for future releases.

### One knowledge base per Bookshelf

Each Bookshelf can only contain one Knowledge Base. However, Projects can contain many Bookshelves.

> [!NOTE]
> The ability to create multiple Knowledge Bases within the same Bookshelf is a planned feature for future releases.

### Incremental indexing

Incremental indexing isn't currently supported. To update Knowledge Bases, you must delete them and re-index.

> [!NOTE]
> Incremental indexing is a planned feature for future releases.

### Scale 

The Bookshelf currently supports Small (<200 MB of text), Medium (<500 MB of text, default size), and Large (<1 GB of text)-sized deployments. For more information on supported index sizes and the resources required to support each size, see the Bookshelf creation How To guide.

### Best practices

The Bookshelf is an evolving feature. Over the course of future releases, we'll improve the costs and time associated with creating Bookshelf deployments and indexing and searching over KBs. We'll also support incremental indexing and we'll take advantage of newer GPT models for search. Currently, for the best performance and to minimize costs of re-deployment, re-indexing, re-enrichment, or search, we recommend the following best practices:

* Limit each Knowledge Base to Small or Medium (default)-sized deployments
* Ensure each KB's content is thematically coherent and directly applicable to your Discovery workflow. 
