---
title: Frequently Asked Questions (FAQ) about Azure Search | Microsoft Docs
description: Get answers to common questions about Microsoft Azure Search Service
services: search
author: HeidiSteen
manager: jhubbard

ms.service: search
ms.technology: search
ms.topic: article
ms.date: 08/01/2017
ms.author: heidist
---

# Azure Search - Frequently Asked Questions (FAQ)
 
 Find answers to commonly asked questions about concepts, code, and scenarios related to Azure Search.

## Platform

### How is Azure Search different from full text search in my DBMS?

Azure Search is typically a better choice if application requirements include support for multiple data sources, [linguistic analysis](https://docs.microsoft.com/rest/api/searchservice/language-support), [custom analysis](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search), localization, search result controls through [scoring profiles](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index), or user-experience features such as typeahead, hit highlighting, and faceted navigation. 

### What is the difference between Azure Search and Elasticsearch?

When comparing search technologies, customers frequently ask for specifics on how Azure Search compares with Elasticsearch, given that Azure Search uses Elasticsearch internally. Azure Search chose Elasticsearch as an internal component for efficient access to the Apache Lucene full text search engine, for its infrastructure supporting distributed and scaleable workloads, and for its extensibility mechanisms.  

Customers who choose Azure Search over Elasticsearch typically do so because we've made a key task easier or we have built-in support for other Microsoft technologies:

+ Linguistic analysis in Azure Search can leverage Microsoft's [natural language processors](https://docs.microsoft.com/rest/api/searchservice/language-support).  
+ [Built-in indexers](search-indexer-overview.md) crawl a variety of Azure data sources for initial and incremental indexing.
+ Distributed workloads at scale is a fundamental strength of Elasticsearch. This task is greatly simplified in Azure Search through PowerShell script or portal slider controls, allowing for a rapid response to fluctuations in query or indexing volumes.  
+ [Scoring and tuning features](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) provide the means for influencing search rank scores beyond what the search engine alone can provide. 

### Can I pause Azure Search service and stop billing?

You cannot pause the service. Computational and storage resources are allocated for your exclusive use when the service is created. It's not possible to release and reclaim those resources on-demand. 

## Indexing Ops

### Backup and restore (or download and move) indexes or index snapshots?

Although you can [get an index definition](https://docs.microsoft.com/rest/api/searchservice/get-index), there is no index extraction, snapshot, or backup-restore feature for downloading a *populated* index running in the cloud to a local system, or moving it to another Azure Search service. 

Indexes are built and populated from code that you write, and run only on Azure Search in the cloud. Typically, customers who want to move an index do so by editing their code to use a new endpoint, and then rerun indexing. If you want the ability to take a snapshot or backup an index, cast a vote on [User Voice](https://feedback.azure.com/forums/263029-azure-search/suggestions/8021610-backup-snapshot-of-index).

### Can I index from SQL database replicas 

(Applies to [Azure SQL Database indexers](https://docs.microsoft.com/azure/search/search-howto-connecting-azure-sql-database-to-azure-search-using-indexers)) There are no restrictions on the use of primary or secondary replicas as a data source when building an index from scratch. However, refreshing an index with incremental updates based on changed records requires the primary replica. This requirement comes from SQL Database, which guarantees change tracking on primary replicas only. If you try using secondary replicas for an index refresh workload, there is no guarantee you will get all of the data.

## Search Ops

### Can I search across multiple indexes?

No, this operation is not supported. Search is always scoped to a single index.

### Can I restrict search corpus acceess by user identity?

Azure Search does not have a role-based security model for per-user data access. Authentication is either full rights or read-only at the service level. Some customers have implemented solutions based on [`$filter` search parameter](https://docs.microsoft.com/rest/api/searchservice/search-documents), but it is a workaround at best. If you want this feature, cast a vote on [User Voice](https://feedback.azure.com/forums/263029-azure-search/category/86074-security).

### Why are there zero matches on terms I know to be valid?

The most common case is not knowing that each query type supports different search behaviors and levels of linguistic analyses. Full text search, which is the predominant workload, includes a language analysis phase that breaks terms down to root forms. This aspect of query parsing casts a broader net over possible matches, because inputs are converted into multiple forms.

If you invoke [other query types](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) (fuzzy search, proximity search, suggestions, among others), there is no linguistic analysis. Terms are added to the query tree as-is, which the engine uses to look for identical matches based on the exact terms it was given. This often results in fewer matches than you might be expecting.

### Why is the search rank a constant or equal score of 1.0 for every hit?

By default, search results are scored based on the [statistical properties of matching terms](search-lucene-query-architecture.md#stage-4-scoring), and ordered high to low in the result set. However, some query types (wildcard, prefix, regex) always contribute a constant score to the overall document score. This is by design. Azure Search imposes a constant score to allow matches found through query expansion to be included in the results, without affecting the ranking. 

For example, suppose an input of "tour*" in a wildcard search, with matches found on “tours”, “tourettes”, and “tourmaline”. Given the nature of these results, there is no way to reasonably infer which terms are more valuable than others. For this reason, we ignore term frequencies when scoring results in queries of types wildcard, prefix and regex. In a multi-part search request that includes partial and complete terms, results from the partial input are incorporated with a constant score to avoid bias towards potentially unexpected matches.

## Design patterns

### What is the best approach for implementing localized search?

Most customers choose separate fields over a collection when it comes to supporting different locales (languages) in the same index. Locale-specific fields make it possible to assign an appropriate analyzer. For example, assigning the Microsoft French Analyzer to a field storing French strings. It also simplifies filtering. If you know a query is initiated on a fr-fr page, you could limit search results to this field, or create a [scoring profile](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) to give more weight to this field as opposed to the others.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [User Voice web site](https://feedback.azure.com/forums/263029-azure-search).

## See also

 [StackOverflow: Azure Search](https://stackoverflow.com/questions/tagged/azure-search)   
 [How full text search works in Azure Search](search-lucene-query-architecture.md)
 [What is Azure Search?](search-what-is-azure-search.md)

 