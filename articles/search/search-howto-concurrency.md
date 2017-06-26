---
title: How to manage concurrent writes to resources in Azure Search
description: Use optimistic concurrency to avoid mid-air collisions on updates or deletes to indexes, indexers, data sources.
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
ms.date: 06/26/2017
ms.author: heidist

---
# How to manage concurrency in Azure Search

In a multi-user development environment, we recommend that you adopt coding practices to avoid unintentional overwrites on the same object. Azure Search supports an *optimistic concurrency model*. There are no locks on an object, but when two developers modify the same object, only the first save prevails. 

## How it works

Optimistic concurrency is implemented through access condition checks in API calls writing to index, indexer, datasource, suggester, and synonymMap resources. 

Resources have an [entity tag (ETag)](https://en.wikipedia.org/wiki/HTTP_ETag) that provides object version information. Assuming a standard workflow (get, modify locally, update), you can avoid concurrent updates of the same resource by checking its version first. 

+ The REST API uses an [ETag](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the request header.
+ The .NET SDK sets the Etag through its accessCondition object, used for setting the [If-Match of If-Match-None header](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the resource. Any object inheriting from [IResourceWithETag (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.iresourcewithetag?view=azuresearch-3.0.2) has an accessCondition object.

If you implement concurrency management, version information changes with each resource update. Given two concurrent updates, the first update forces a new object version. The second update fails based on version discrepancy, unless the updated resource is obtained first.

A version discrepancy returns either HTTP 412 for REST calls, or an accessCondition failure if using the .NET SDK. 

> [!Note]
> There is only one mechanism for concurrency. It's always used regardless of which API is used for resource updates. 

## Conceptual examples

The following code snippets demonstrate the concept of accessCondition checks on update and delete index operations. If the check fails, the operation fails.

**Scenario 1: Fail an update if the index no longer exists**

The accessCondition checks for an existing Etag on the index. If the ETag does not exist, the index object does not exist, and the update fails as a result. 

        var newIndex = new Index();
        newIndex.Name = "aNewIndex";
        newIndex.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(newIndex, accessCondition: AccessCondition.GenerateIfExistsCondition());

**Scenario 2: Update a specific version of the index**

The accessCondition checks for a corresponding ETag on the object definition and the local object. If the ETags do not match, the accessCondition fails and the index is not updated. The update succeeds only if the ETag on the index is unchanged. 

        var index = serviceClient.Indexes.Get("IndexName");
        index.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(index, accessCondition: AccessCondition.GenerateIfMatchCondition(index.ETag));

**Scenario 3: Delete an index only if it already exists**

This example is equivalent to scenario 1, but for a delete operation.

        serviceClient.Indexes.Delete("AnIndex", accessCondition: AccessCondition.GenerateIfExistsCondition()); 


**Scenario 4: Delete a specific version of the index**

This example deletes the index only if it matches the original version. If you are actively iterating over the same index structure, you can check the object version prior to writing changes.

         // Create an index and a variant
         var index2 = new Index();
         index2.Name = "secondIndex";
         var index3 = serviceClient.Indexes.Create(index2);

        // Delete fails because the ETag of index2 is no longer the same, per the creation of index3 based on index2
        serviceClient.Indexes.Delete(index2.Name, accessCondition:  AccessCondition.GenerateIfMatchCondition(index2.ETag)); 

        // Delete fails if the ETag of index3 is different from the ETag created with the object
        serviceClient.Indexes.Delete(index3.Name, accessCondition: AccessCondition.GenerateIfMatchCondition(index3.ETag)); 

## Design pattern

A design pattern for implementing optimistic concurrency should include testing for the access condition, communicating failures with an informative message, and optionally retrieving the updated object (risking an overwrite to your local object).

This code snippet illustrates an update to a synonymMap, created in the [Synonym (preview) C# tutorial for Azure Search](https://docs.microsoft.com/azure/search/search-synonyms-tutorial-sdk). This snippet checks for the object version, throws an exception if the check fails, and then gets the latest object before re-attempting the update.

        private static void AddNewSynonymsSafely(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            synonymMap.Synonyms = synonymMap.Synonyms + "\ninternet,wifi";

            // Simulate modifying the synonym map seperately
            AddNewSynonyms(serviceClient);
            
            // This request will fail, because the synonymMap has changed since it was last gotten.
            try
            {
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
            catch (CloudException e) when (e.IsAccessConditionFailed())
            {
                // If accessCondition fails, GET the latest version, re-apply the change, and update
                synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
                synonymMap.Synonyms = synonymMap.Synonyms + "\ninternet,wifi";
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
        }

        private static void AddNewSynonyms(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            synonymMap.Synonyms = synonymMap.Synonyms + "\nfive star=>luxury";
            serviceClient.SynonymMaps.CreateOrUpdate(synonymMap);
        }

## Next steps

Try modifying either of the following samples to include Etags or AccessCondition objects.

+ [.NET SDK sample on Github](https://github.com/Azure-Samples/search-dotnet-getting-started) 
+ [REST API sample on Github](https://github.com/Azure-Samples/search-rest-api-getting-started) 

## See also

 [Common HTTP request and response headers](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search)    
 [HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes) 