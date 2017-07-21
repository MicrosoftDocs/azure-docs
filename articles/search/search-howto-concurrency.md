---
title: How to manage concurrent writes to resources in Azure Search
description: Use optimistic concurrency to avoid mid-air collisions on updates or deletes to Azure Search indexes, indexers, data sources.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 07/20/2017
ms.author: heidist

---
# How to manage concurrency in Azure Search

In a multi-user development environment, we recommend adding concurrency controls to avoid accidental overwrites of the same object. Azure Search supports an *optimistic concurrency model*. There are no locks on an object, but when two developers update the same object version, only the first save prevails.

> [!Tip]
> Conceptual code in a [sample C# solution](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetETagsExplainer) explains how concurrency control works in Azure Search. The code creates conditions that invoke concurrency control. Reading the code is probably sufficient for most developers, but if you want to run it, edit appsettings.json to add the service name and an admin api-key. Given a service URL of `http://myservice.search.windows.net`, the service name is `myservice`.

## How it works

Optimistic concurrency is implemented through access condition checks in API calls writing to indexes, indexers, datasources, suggesters, and synonymMap resources. 

All resources have an [*entity tag (ETag)*](https://en.wikipedia.org/wiki/HTTP_ETag) that provides object version information. By checking the ETag first, you can avoid concurrent updates in a typical workflow (get, modify locally, update) by ensuring the server object's ETag matches your local copy. 

+ The REST API uses an [ETag](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the request header.
+ The .NET SDK sets the ETag through an accessCondition object, setting the [If-Match | If-Match-None header](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the resource. Any object inheriting from [IResourceWithETag (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.iresourcewithetag?view=azuresearch-3.0.2) has an accessCondition object.

If you implement concurrency management, version information changes with each resource update. Given two updates, the first one forces a new version, while the second one fails due to a version discrepancy, unless the updated resource is obtained first.

A version discrepancy returns either HTTP 412 for REST calls, or an accessCondition failure if using the .NET SDK. 

> [!Note]
> There is only one mechanism for concurrency. It's always used regardless of which API is used for resource updates. 

## Use cases

The following code snippets demonstrate the concept of accessCondition checks on update and delete index operations. If the check fails, the operation fails.

**Scenario 1: Fail an update if the index no longer exists**

The accessCondition checks for an existing ETag on an index named "test". If the ETag does not exist, the index does not exist, causing the delete operation to fail as a result. 

        Console.WriteLine("Deleting index...\n");
        serviceClient.Indexes.Delete("test", accessCondition: AccessCondition.GenerateIfExistsCondition());

**Scenario 2: Fail the update if the version changed underneath you**

The accessCondition checks for changes to the ETag on the local object to see if its identical to the server object. If the ETags are identical , the accessCondition is true and the index update succeeds. The following update succeeds if the ETag on the index is unchanged. 

        indexForClient2.Fields.Add(new Field("b", DataType.Boolean));

        serviceClient.Indexes.CreateOrUpdate(indexForClient2, accessCondition: AccessCondition.IfNotChanged(indexForClient2));


## Design pattern

A design pattern for implementing optimistic concurrency should include a loop that retries the access condition check, a test for the access condition, and optionally retrieving a updated object and retrying your changes on the revised version. 

This code snippet illustrates the addition of a synonymMap to an index that already exists. This code is from the [Synonym (preview) C# tutorial for Azure Search](https://docs.microsoft.com/azure/search/search-synonyms-tutorial-sdk). 

The snippet gets the "hotels" index, checks the object version on an update operation, throws an exception if the condition fails, and then retries the operation (up to three times), starting with index retrieval from the server.


        private static void EnableSynonymsInHotelsIndexSafely(SearchServiceClient serviceClient)
        {
            int MaxNumTries = 3;

            for (int i = 0; i < MaxNumTries; ++i)
            {
                try
                {
                    Index index = serviceClient.Indexes.Get("hotels");
                    index = AddSynonymMapsToFields(index);

                    // The IfNotChanged condition ensures that the index is updated only if the ETags match.
                    serviceClient.Indexes.CreateOrUpdate(index, accessCondition: AccessCondition.IfNotChanged(index));

                    Console.WriteLine("Updated the index successfully.\n");
                    break;
                }
                catch (CloudException e) when (e.IsAccessConditionFailed())
                {
                    Console.WriteLine($"Index update failed : {e.Message}. Attempt({i}/{MaxNumTries}).\n");
                }
            }
        }


## Next steps

Review the [synonyms C# sample](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms) for more context in how to safely update an existing index.

Try modifying either of the following samples to include ETags or AccessCondition objects.

+ [REST API sample on Github](https://github.com/Azure-Samples/search-rest-api-getting-started) 
+ [.NET SDK sample on Github](https://github.com/Azure-Samples/search-dotnet-getting-started). This solution includes the "DotNetEtagsExplainer" project containing the code presented in this article.

## See also

  [Common HTTP request and response headers](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search)    
  [HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes) 
  [Index operations (REST API)](https://docs.microsoft.com/\rest/api/searchservice/index-operations)