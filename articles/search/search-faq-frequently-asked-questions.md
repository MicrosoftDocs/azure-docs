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

Azure Search is typically a better choice if application requirements include support for multiple data sources, linguistic analysis, tuning, localization, or user-experience features such as typeahead, hit highlighting, and faceted navigation. 

### What is the difference between Azure Search and ElasticSearch?

Azure Search uses ElasticSearch internally for access to Apache Lucene full text search engine and for its extensibility mechanisms.  

Customers who choose Azure Search over an ElasticSearch deployment typically do so for these reasons: integration with other Microsoft assets (indexing and linguistic analysis), ease of management, ease of development. Built-in linguistic support for Microsoft's [natural language processors](https://docs.microsoft.com/rest/api/searchservice/language-support) and [built-in indexing](search-indexer-overview.md) of crawlable Azure data sources are key differentiators, as is the ability to slide resourcing levels up or down for fast responses to fluctuations in query or indexing volumes. [Scoring and tuning features](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) provides the means for influencing search rank scores beyond what the search engine alone can provide.

### Can I pause Azure Search service and stop billing?

You cannot pause the service. Computational and storage resources are allocated for your exclusive use when the service is created. It's not possible to release and reclaim those resources on-demand. Thus, billing is necessary to cover the costs of maintaining dedicated resources, even for services that are occasionally inactive. 

## Indexing Ops

### Backup and restore (or download and move) indexes or index snapshots?

Although you can [get an index definition](https://docs.microsoft.com/rest/api/searchservice/get-index), there is no index extraction, snapshot, or backup-restore feature for downloading a *populated* index running in the cloud to a local system, or to another Azure Search service. Indexes are built and populated from code that you write, and run only on Azure Search in the cloud. Typically, customers who want to move an index do so by editing their code to use a new endpoint, and then rerun indexing. If you want this feature, cast a vote on [User Voice](https://feedback.azure.com/forums/263029-azure-search/suggestions/8021610-backup-snapshot-of-index).

### Can I index from SQL database replicas 

(Applies to [Azure SQL Database indexers](https://docs.microsoft.com/azure/search/search-howto-connecting-azure-sql-database-to-azure-search-using-indexers)) There are no restrictions on the use of primary or secondary replicas as a data source when building an index from scratch. However, refreshing an index with incremental updates based on changed records (new or updated) requires access to the primary replica. This requirement comes from SQL Database, which guarantees change tracking on primary replicas only. If you try using secondary replicas for an index refresh workload, you are not guaranteed to get all the data.

## Search Ops

## Can I search across multiple indexes?

No, this operation is not supported. Search is always scoped to a single index.

### Why are there zero matches on terms I know to be valid?

The most common case is not knowing that each query type supports different search behaviors and levels of linguistic analyses. Full text search, which is the predominant workload, includes a language analysis phase that breaks terms down to root forms. This aspect of query parsing casts a broader net over possible matches, because inputs are converted into multiple forms.

If you invoke other query types (fuzzy search, proximity search, suggestions, among others), there is no linguistic analysis. Terms are added to the query tree as-is, which the engine uses to look for identical matches based on the exact terms it was given. This often results in fewer matches than you might be expecting.

### Why is the search rank a constant or equal score 1.0 for every hit?

By default, search results are scored based on the [statistical properties of matching terms](search-lucene-query-architecture#stage-4-scoring), and then returned in order of high to low. However, some query types (wildcard, prefix, regex) always contribute a constant score to the overall document score. This is by design. Azure Search imposes a constant score to allow matches found through query expansion to be included in the results, without affecting the ranking. 

For example, suppose an input of "tour*" in a wildcard search, with matches found on “tours”, “tourettes”, and “tourmaline”. Given the nature of these results, there is no way to reasonably infer which terms are more valuable than others. For this reason, we ignore term frequencies when scoring results in queries of types wildcard, prefix and regex. In a multi-part search request that includes partial and complete terms, results from the partial input are incorporated with a constant score to avoid bias towards potentially unexpected matches.

## Design patterns

### What is the best approach for implementing localized search?

Most customers create separate fields for different locales (languages), such as separate fields for English and French strings. Locale-specific fields make it possible to assign an appropriate analyzer (for example, assign the Microsoft French Analyzer to your French field). It also simplifies filtering. If you know a query is initiated on a fr-fr page, you could limit search results to this field, or create a [scoring profile](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) to give more weight to this field as opposed to the others.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [User Voice web site](https://feedback.azure.com/forums/263029-azure-search).

## See also

 [StackOverflow: Azure Search](https://stackoverflow.com/questions/tagged/azure-search)   

 