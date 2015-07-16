<properties 
    pageTitle="Efficiently use Listing APIs in Microsoft Azure Storage Client Library for C++ | Microsoft Azure" 
    description="Learn how to use the “Listing APIs” in Microsoft Azure Storage Client Library for C++ efficiently." 
    documentationCenter=".net" 
    services="storage"
    authors="tamram" 
    manager="adinah" 
    editor=""/>
<tags 
    ms.service="storage" 
    ms.workload="storage" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="07/15/2015" 
    ms.author="tamram"/>
#Efficiently use Listing APIs in Microsoft Azure Storage Client Library for C++

This article describes how to use the “Listing APIs” in Microsoft Azure Storage Client Library for C++ efficiently.

>[AZURE.NOTE] This guide targets the Azure Storage Client Library for C++ version 1.0.0 and above which is available via [NuGet](http://www.nuget.org/packages/wastorage) or [GitHub](https://github.com/Azure/azure-storage-cpp).

There are a number of methods in Storage Client Library to either list or query storage services to return an indeterminate number of resources. This article describes the following scenarios:
-	List containers in an account
-	List blobs in a container or virtual blob directory
-	List queues in an account
-	List tables in an account
-	Query entities in a table

Each of these Listing APIs is presented in several overloads for different scenarios.

##Async vs. sync
Because Storage C++ SDK is built on top of [C++ REST library (Project Casablanca)](http://casablanca.codeplex.com/), we inherently support asynchronous operations by using [pplx::task](http://microsoft.github.io/cpprestsdk/classpplx_1_1task.html), for example:

	pplx::task<list_blob_item_segment> list_blobs_segmented_async(continuation_token& token) const;

and synchronous operations are wrappers of asynchronous ones:

	list_blob_item_segment list_blobs_segmented(const continuation_token& token) const
	{
	    return list_blobs_segmented_async(token).get();
	}

If you are working with multiple threading applications or services, we recommend that you use the async APIs directly instead of creating a thread to call the sync APIs, which significantly impacts your performance.

##Segmented listing
All of the Listing APIs have a “segmented version” overload.
The large scale of storage resources requires segmented listing. For example, you can have over a million blobs in an Azure blob container or over a billion entities in an Azure Table. These are not theoretical numbers but real usage cases that we received from our customers.

It is therefore impossible to list all objects in one response. Instead, the response of a segmented listing includes:
-	*_segment, which contains a limited number of results returned for this API call 
-	continuation_token, which is passed into the next Listing API call to get results from the end of this segment

Taking list_blobs for example, a typical code of listing all blobs in a blob container should be like the following code snippet. The code is available in our [samples](https://github.com/Azure/azure-storage-cpp/blob/master/Microsoft.WindowsAzure.Storage/samples/BlobsGettingStarted/Application.cpp):

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
	        process_diretory(it->as_directory());
	    }
	}
	
	    token = segment.continuation_token();
	}
	while (!token.empty());

There are a few things worth noting here:

-	The number of results returned in a segment can be controlled by the parameter max_results in the overload of each API, for example:
	
		list_blob_item_segment list_blobs_segmented(const utility::string_t& prefix, bool use_flat_blob_listing, blob_listing_details::values includes, int max_results, const continuation_token& token, const blob_request_options& options, operation_context context)

Without specifying the max_results parameter, a default maximum value is applied.
-	A query against a table service might return no record or fewer records than the ‘max_results’ parameter that you specified even if the continuation token is not empty. One reason could be that the query cannot be completed in five seconds. As long as the continuation token is not empty, the query should continue, and the code should not assume the size of segment results.

The recommended coding pattern for most scenarios is segmented listing, which provides explicit progress of listing or querying, and how the service responds to each request. Particularly for C++ applications or services, lower-level control of the listing progress could help control memory and performance, which are critical to C++ applications or services.

##Greedy listing

C++ SDK used to have non-segmented Listing APIs for tables and queues in versions up to Storage C++ SDK 0.5.0 Preview, as in the following example:

	std::vector<cloud_table> list_tables(const utility::string_t& prefix) const;
	std::vector<table_entity> execute_query(const table_query& query) const;
	std::vector<cloud_queue> list_queues() const;

These methods were implemented as wrappers of segmented APIs. For each response of segmented listing, the code appended the results to a vector and returned all results after the full containers were scanned.

This approach might work when the storage account or table contains a small number of objects. However, gradually, with the growth of the objects, you can imagine that the memory used could grow without limit because all results remained in memory, and one listing operation can take a very long time, during which the caller would have no information about its progress. 

These kinds of greedy Listing APIs in the SDK do not exist in other languages, C# or Java, or the JavaScript Node.js environment. To explicitly avoid the potential issues of using these greedy APIs, we removed them in version 0.6.0 Preview.

If your code is calling these greedy APIs:

	std::vector<azure::storage::table_entity> entities = table.execute_query(query);
	for (auto it = entities.cbegin(); it != entities.cend(); ++it)
	{
	    process_entity(*it);
	}

By using segmented listing APIs, the code should be:

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

By specifying the max_results parameter of the segment, you can balance between the numbers of requests and memory usage to meet performance considerations for your application.

Additionally, if you’re using segmented Listing APIs but store the data in a local collection in a “greedy” style, we also strongly recommend that you refactor your code to handle storing data in a local collection carefully under a large scale.

##Lazy listing
Although greedy listing raised potential issues, it is convenient if there are not too many objects in the container.

If you’re also using C# or Oracle Java SDKs, you should be familiar with the 

Enumerable programming model, which indicates a lazy-style listing—the data at a certain offset is only fetched if the certain offset is required. In C++, the iterator-based template also provides a similar approach.

Regarding the Listing APIs that we discussed in this post, a typical lazy Listing API, with taking list_blobs as an example, looks like this:

	list_blob_item_iterator list_blobs() const;

Then a typical code snippet that uses the lazy listing pattern could look like this:

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

Note that lazy listing is only available in synchronous mode.

Compared with greedy listing, lazy listing would only fetch the data when necessary. Underneath, it fetches the data from the storage service only when the next iterator moves into next segment. Therefore, the memory usage is controlled with a bounded size, and the moving of an iterator is fast.

Lazy Listing APIs are added into Storage C++ SDK in version 1.0.0, which is also the version with General Availability. 

##Conclusion

In this article, we discussed the different overloads of Listing APIs for various objects in Storage C++ SDK. To summarize:
-	Async APIs are strongly recommended under multiple threading scenarios.
-	Segmented listing is recommended for most scenarios.
-	Lazy listing is provided in the SDK as a convenient wrapper in synchronous scenarios.
-	Greedy listing is not recommended and removed from the SDK.

##Next steps

For more information about Azure Storage and Client Library for C++, see the following resources.

-	[How to use Blob Storage from C++](storage-c-plus-plus-how-to-use-blobs.md)
-	[How to use Table Storage from C++](storage-c-plus-plus-how-to-use-tables.md)
-	[How to use Queue Storage from C++](storage-c-plus-plus-how-to-use-queues.md)
-	[Azure Storage Client Library for C++ API documentation.](http://azure.github.io/azure-storage-cpp/)
-	[Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
-	[Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
