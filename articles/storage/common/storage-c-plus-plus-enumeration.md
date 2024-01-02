---
title: List Azure Storage resources with C++ client library
description: Learn how to use the listing APIs in Microsoft Azure Storage Client Library for C++ to enumerate containers, blobs, queues, tables, and entities.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 01/23/2017
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.reviewer: dineshm
---

# List Azure Storage resources in C++

Listing operations are key to many development scenarios with Azure Storage. This article describes how to most efficiently enumerate objects in Azure Storage using the listing APIs provided in the Microsoft Azure Storage Client Library for C++.

> [!NOTE]
> This guide targets the Azure Storage Client Library for C++ version 2.x, which is available via [NuGet](https://www.nuget.org/packages/wastorage) or [GitHub](https://github.com/Azure/azure-storage-cpp).

The Storage Client Library provides a variety of methods to list or query objects in Azure Storage. This article addresses the following scenarios:

- List containers in an account
- List blobs in a container or virtual blob directory
- List queues in an account
- List tables in an account
- Query entities in a table

Each of these methods is shown using different overloads for different scenarios.

## Asynchronous versus synchronous

Because the Storage Client Library for C++ is built on top of the [C++ REST library](https://github.com/Microsoft/cpprestsdk), we inherently support asynchronous operations by using [pplx::task](https://microsoft.github.io/cpprestsdk/classpplx_1_1task.html). For example:

```cpp
pplx::task<list_blob_item_segment> list_blobs_segmented_async(continuation_token& token) const;
```

Synchronous operations wrap the corresponding asynchronous operations:

```cpp
list_blob_item_segment list_blobs_segmented(const continuation_token& token) const
{
    return list_blobs_segmented_async(token).get();
}
```

If you are working with multiple threading applications or services, we recommend that you use the async APIs directly instead of creating a thread to call the sync APIs, which significantly impacts your performance.

## Segmented listing

The scale of cloud storage requires segmented listing. For example, you can have over a million blobs in an Azure blob container or over a billion entities in an Azure Table. These are not theoretical numbers, but real customer usage cases.

It is therefore impractical to list all objects in a single response. Instead, you can list objects using paging. Each of the listing APIs has a *segmented* overload.

The response for a segmented listing operation includes:

- *_segment*, which contains the set of results returned for a single call to the listing API.
- *continuation_token*, which is passed to the next call in order to get the next page of results. When there are no more results to return, the continuation token is null.

For example, a typical call to list all blobs in a container may look like the following code snippet. The code is available in our [samples](https://github.com/Azure/azure-storage-cpp/blob/master/Microsoft.WindowsAzure.Storage/samples/BlobsGettingStarted.cpp):

```cpp
// List blobs in the blob container
azure::storage::continuation_token token;
do
{
    azure::storage::list_blob_item_segment segment = container.list_blobs_segmented(token);
    for (auto it = segment.results().cbegin(); it != segment.results().cend(); ++it)
{
    if (it->is_blob())
    {
        process_blob(it->as_blob());
    }
    else
    {
        process_directory(it->as_directory());
    }
}

    token = segment.continuation_token();
}
while (!token.empty());
```

Note that the number of results returned in a page can be controlled by the parameter *max_results* in the overload of each API, for example:

```cpp
list_blob_item_segment list_blobs_segmented(const utility::string_t& prefix, bool use_flat_blob_listing,
    blob_listing_details::values includes, int max_results, const continuation_token& token,
    const blob_request_options& options, operation_context context)
```

If you do not specify the *max_results* parameter, the default maximum value of up to 5000 results is returned in a single page.

Also note that a query against Azure Table storage may return no records, or fewer records than the value of the *max_results* parameter that you specified, even if the continuation token is not empty. One reason might be that the query could not complete in five seconds. As long as the continuation token is not empty, the query should continue, and your code should not assume the size of segment results.

The recommended coding pattern for most scenarios is segmented listing, which provides explicit progress of listing or querying, and how the service responds to each request. Particularly for C++ applications or services, lower-level control of the listing progress may help control memory and performance.

## Greedy listing

Earlier versions of the Storage Client Library for C++ (versions 0.5.0 Preview and earlier) included non-segmented listing APIs for tables and queues, as in the following example:

```cpp
std::vector<cloud_table> list_tables(const utility::string_t& prefix) const;
std::vector<table_entity> execute_query(const table_query& query) const;
std::vector<cloud_queue> list_queues() const;
```

These methods were implemented as wrappers of segmented APIs. For each response of segmented listing, the code appended the results to a vector and returned all results after the full containers were scanned.

This approach might work when the storage account or table contains a small number of objects. However, with an increase in the number of objects, the memory required could increase without limit, because all results remained in memory. One listing operation can take a very long time, during which the caller had no information about its progress.

These greedy listing APIs in the SDK do not exist in C#, Java, or the JavaScript Node.js environment. To avoid the potential issues of using these greedy APIs, we removed them in version 0.6.0 Preview.

If your code is calling these greedy APIs:

```cpp
std::vector<azure::storage::table_entity> entities = table.execute_query(query);
for (auto it = entities.cbegin(); it != entities.cend(); ++it)
{
    process_entity(*it);
}
```

Then you should modify your code to use the segmented listing APIs:

```cpp
azure::storage::continuation_token token;
do
{
    azure::storage::table_query_segment segment = table.execute_query_segmented(query, token);
    for (auto it = segment.results().cbegin(); it != segment.results().cend(); ++it)
    {
        process_entity(*it);
    }

    token = segment.continuation_token();
} while (!token.empty());
```

By specifying the *max_results* parameter of the segment, you can balance between the numbers of requests and memory usage to meet performance considerations for your application.

Additionally, if you're using segmented listing APIs, but store the data in a local collection in a "greedy" style, we also strongly recommend that you refactor your code to handle storing data in a local collection carefully at scale.

## Lazy listing

Although greedy listing raised potential issues, it is convenient if there are not too many objects in the container.

If you're also using C# or Oracle Java SDKs, you should be familiar with the Enumerable programming model, which offers a lazy-style listing, where the data at a certain offset is only fetched if it is required. In C++, the iterator-based template also provides a similar approach.

A typical lazy listing API, using **list_blobs** as an example, looks like this:

```cpp
list_blob_item_iterator list_blobs() const;
```

A typical code snippet that uses the lazy listing pattern might look like this:

```cpp
// List blobs in the blob container
azure::storage::list_blob_item_iterator end_of_results;
for (auto it = container.list_blobs(); it != end_of_results; ++it)
{
    if (it->is_blob())
    {
        process_blob(it->as_blob());
    }
    else
    {
        process_directory(it->as_directory());
    }
}
```

Note that lazy listing is only available in synchronous mode.

Compared with greedy listing, lazy listing fetches data only when necessary. Under the covers, it fetches data from Azure Storage only when the next iterator moves into next segment. Therefore, memory usage is controlled with a bounded size, and the operation is fast.

Lazy listing APIs are included in the Storage Client Library for C++ in version 2.2.0.

## Conclusion

In this article, we discussed different overloads for listing APIs for various objects in the Storage Client Library for C++ . To summarize:

- Async APIs are strongly recommended under multiple threading scenarios.
- Segmented listing is recommended for most scenarios.
- Lazy listing is provided in the library as a convenient wrapper in synchronous scenarios.
- Greedy listing is not recommended and has been removed from the library.

## Next steps

For more information about Azure Storage and Client Library for C++, see the following resources.

- [How to use Blob Storage from C++](../blobs/quickstart-blobs-c-plus-plus.md)
- [How to use Table Storage from C++](../../cosmos-db/table-storage-how-to-use-c-plus.md)
- [How to use Queue Storage from C++](../queues/storage-c-plus-plus-how-to-use-queues.md)
- [Azure Storage Client Library for C++ API documentation.](https://azure.github.io/azure-storage-cpp/)
- [Azure Storage Team Blog](/archive/blogs/windowsazurestorage/)
- [Azure Storage Documentation](../index.yml)