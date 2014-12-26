<properties title="Search Service: workflow for developers" pageTitle="Search Service: workflow for developers" description="Search Service: workflow for developers" metaKeywords="" services="" solutions="" documentationCenter="" authors="Heidist" manager="mblythe" videoId="" scriptId="" />

<tags ms.service="azure-search" ms.devlang="" ms.workload="search" ms.topic="article"  ms.tgt_pltfrm="" ms.date="09/23/2014" ms.author="heidist" />

# Azure Search: development workflow

[WACOM.INCLUDE [This article uses the Azure Preview portal](../includes/preview-portal-note.md)]

This article provides a roadmap and a few best practices for creating and maintaining the Search service and its indexes. 

We assume that you have already provisioned the service. If you haven’t done that yet, see [Get started with Azure Search](../search-get-started/) for further instruction.

+ [Step 1: Create the index](#sub-1)
+ [Step 2: Add documents](#sub-2)
+ [Step 3: Query an index](#sub-3)
+ [Step 4: Update or delete indexes and documents](#sub-4)
+ [Storage design considerations](#sub-5)


<h2 id="sub-1">Step 1: Create the index</h2>

Queries target a search index that contains search data and attributes. As such, your first step after provisioning the service is to define the index schema in JSON format, and execute an HTTPS PUT request to create the index in the service. 

Indexes are constructed by your application code. There are no built-in tools or editors to help you define an index in a user interface. Examples that demonstrate various ways of constructing the index include [Create your first search solution using Azure Search](../search-create-first-solution/), where the schema is specified in the Program.cs file, and [Get started with scoring profiles in Azure Search](../search-get-started-scoring-profiles) that provides the index in a standalone JSON schema file. To learn more about creating the index, see [Create Index (Azure Search API)](http://msdn.microsoft.com/en-us/library/dn798941.aspx) on MSDN.

<h2 id="sub-2">Step 2: Add documents</h2>

Once the search index is created, you can add documents to the index by POSTing them in JSON format. Each document must have a unique key and a collection of fields containing searchable and non-searchable data. Document data is represented as a set of key/value pairs for each field.

We recommend adding documents in batches to improve throughput. You can batch up to 1,000 documents, assuming an average document size of about 1-2KB.

There is an overall status code for the POST request. Status codes are either HTTP 200 (Success) or HTTP 207 (Multi-Status) if there is combination of successful and failed documents. In addition to the status code for the POST request, Azure Search maintains a status field for each document. Given a batch upload, you need a way to get per-document status that indicates whether the insert succeeded or failed for each document. The status field provides that information. It will be set to false if the document failed to load.

Under heavy load, it's not uncommon to have some upload failures. Should this occur, the overall status code is 207, indicating a partial success, and the documents that failed indexing will have the 'status' property set to false.

> [AZURE.NOTE] When the service receives documents, they are queued up for indexing and may not be immediately included in search results. When not under a heavy load, documents are typically indexed within a few seconds.


<h2 id="sub-3">Step 3: Query an index</h2>

Once documents have been indexed, you can execute search queries. You can query one index at a time, using either OData or a simple query syntax:

+	[OData expression syntax for Azure Search](http://msdn.microsoft.com/en-us/library/dn798921.aspx)
+	[Simple query syntax in Azure Search](http://msdn.microsoft.com/en-us/library/dn798920.aspx)

<h2 id="sub-4">Step 4: Update or delete indexes and documents</h2>

Optionally, you can make schema changes to the search index, update or delete documents from within the index, and delete indexes.

When updating an index, you can combine multiple actions (insert, merge, delete) into the same batch, eliminating the need for multiple round trips. Currently Azure Search does not support partial updates (HTTP PATCH), so if you need to update an index, you must resend the index definition.

<h2 id="sub-5">Storage design considerations</h2>

Azure Search uses internal storage for the indexes and documents used in search operations. Text analysis and index parsing is dependent on having all searchable fields and associated attributes readily available.

Not all fields in a document will be searchable. For example, if your application is an online catalog for music or videos, we recommend storing binary files in Azure BLOB service or some other storage format. The binary files themselves are not searchable, hence there is no need to persist them in Azure Search storage. Although you should store images, videos, and audio files in other services or locations, you should include a field that references the URL to the file location. This way, you can return the external data as part of your search results. 

For more information about creating indexes or documents, see the [Azure Search Rest API](http://msdn.microsoft.com/en-us/library/dn798935.aspx).


<!--Anchors-->
[Step 1: Create the index]: #sub-1
[Step 2: Add documents]: #sub-2
[Step 3: Query an index]: #sub-3
[Step 4: Update or delete indexes and documents]: #sub-4
[Choosing a document store]: #sub-5


<!--Image references-->

<!--Link references-->
[Get started with Azure Search]: ../search-get-started/
[Manage your search service on Microsoft Azure]: ../search-manage/
[Create your first search solution using Azure Search]: ../search-create-first-solution/

