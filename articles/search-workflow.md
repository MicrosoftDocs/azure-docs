<properties title="Search Service: workflow for developers" pageTitle="Search Service: workflow for developers" description="Search Service: workflow for developers" metaKeywords="" services="" solutions="" documentationCenter="" authors="heidist" videoId="" scriptId="" />

# Azure Search: development workflow

[WACOM.INCLUDE [This article uses the Azure Preview portal](../includes/preview-portal-note.md)]

This article provides a roadmap and a few best practices for creating and maintaining the search service and its indexes. 

We assume that you have already provisioned the service. If you haven’t done that yet, see [Configure search in the Azure Preview Portal]() to get started.

+ [Step 1: Create the index](#sub-1)
+ [Step 2: Add documents](#sub-2)
+ [Step 3: Query an index](#sub-3)
+ [Step 4: Update or delete indexes and documents](#sub-4)
+ [Choosing a document store](#sub-5)


## Step 1: Create the index

Queries (at least non-system queries) target a search index that contains search data and attributes. In this step, you define the index schema in JSON format and execute an HTTPS PUT request to have this index created. 

Indexes are typically created in your local development environment. There are no built-in tools or editors for index definition. For more information about creating the index, see [Create Index (Azure Search API)](http://msdn.microsoft.com/en-us/library/dn798941.aspx)) on MSDN.

## Step 2: Add documents

Once the search index is created, you can add documents to the index by POSTing them in JSON format. Alternatively, you can use a PUT request. Each document must have a unique key. Document data is represented as a set of key/value pairs.

We recommend adding documents in batches to improve throughput. You can batch up to 10,000 documents, assuming an average document size of about 1-2KB.

There is an overall status code for the POST or PUT request.  Status codes are either HTTP 200 (Success) or HTTP 207. In addition to the status code for the HTTP request, Azure Search maintains a status property for each document. Given a batch upload, you need a way to get per-document status that indicates whether the insert succeeded or failed for each document. The status property provides that information. It will be set to false if the document failed to load.

Under heavy load, it's not uncommon to have some upload failures. Should this occur, the overall status code is 207, indicating a partial success, and the documents that failed indexing will have the 'status' property set to false.

> [WACOM.NOTE] When the service receives documents, they are queued up for indexing and may not be immediately included in search results. When not under a heavy load, documents are typically indexed within a few seconds.


## Step 3: Query an index

Once documents have been indexed, you can execute search queries. You can query one index at a time. You can use Odata or a simple query syntax:

+	[OData expression syntax for Azure Search](http://msdn.microsoft.com/en-us/library/dn798921.aspx)
+	[Simple query syntax in Azure Search](http://msdn.microsoft.com/en-us/library/dn798920.aspx)

## Step 4: Update or delete indexes and documents

Optionally, you can make schema changes to the search index, update or delete documents from within the index, and delete indexes.

When updating an index, you can combine multiple actions (insert, merge, delete) into the same batch, eliminating the need for multiple round trips. Currently Azure Search does not support partial updates (HTTP PATCH), so if you need to update an index, you must send the entire index definition again.

## Choosing a document store

When designing your search application, one of the more important decisions involves document storage. Although there is a growing trend to use search as data storage, we generally discourage the practice for these reasons: 

+	If your application requirements include field arrays (for example, where a customer name consists of first, last, and middle names), use a different document store. Azure Search doesn’t support fields of this type. In some cases, you might be able to use the Collection field type, but a document database is typically a better choice. 

+	Indexing can take longer if it has to compete for system resources engaged in continuous query operations.

The design pattern that is most typical for Azure Search is to use an external data store for documents, and store the index with the Search service. If your data changes rapidly, an important requirement is execute incremental changes as quickly as possible, which often means storing documents separately in a cache.

As a counterpoint, if your application workloads consist of more reads than writes, using a search service as the data store can be a viable solution. If you consider this approach, we strongly recommend using alternative storage, such as Azure BLOB storage, for images or video files. A storage-only service will be naturally more cost effective than one that both stores and processes requests.


<!--Anchors-->
[Step 1: Create the index]: #sub-1
[Step 2: Add documents]: #sub-2
[Step 3: Query an index]: #sub-3
[Step 4: Update or delete indexes and documents]: #sub-4
[Choosing a document store]: #sub-5


<!--Image references-->

<!--Link references-->
[Configure search in the Azure Preview Portal]: ../search-configure/
[Manage your search service on Microsoft Azure]: ../search-manage/
[Create your first azure search solution]: ../search-create-first-solution/
