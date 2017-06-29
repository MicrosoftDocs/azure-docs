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

In a multi-user development environment, we recommend adding concurrency controls to avoid unintentional overwrites of the same object. Azure Search supports an *optimistic concurrency model*. There are no locks on an object, but when two developers modify the same object, only the first save prevails. 

## How it works

Optimistic concurrency is implemented through access condition checks in API calls writing to indexes, indexers, datasources, suggesters, and synonymMap resources. 

All resources have an [entity tag (ETag)](https://en.wikipedia.org/wiki/HTTP_ETag) that provides object version information. By checking the ETag first, you can avoid concurrent updates in a typical workflow (get, modify locally, update). 

+ The REST API uses an [ETag](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the request header.
+ The .NET SDK sets the ETag through an accessCondition object, setting the [If-Match | If-Match-None header](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the resource. Any object inheriting from [IResourceWithETag (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.iresourcewithetag?view=azuresearch-3.0.2) has an accessCondition object.

If you implement concurrency management, version information changes with each resource update. Given two updates, the first one forces a new version, while the second one fails due to a version discrepancy, unless the updated resource is obtained first.

A version discrepancy returns either HTTP 412 for REST calls, or an accessCondition failure if using the .NET SDK. 

> [!Note]
> There is only one mechanism for concurrency. It's always used regardless of which API is used for resource updates. 

## Conceptual examples

The following code snippets demonstrate the concept of accessCondition checks on update and delete index operations. If the check fails, the operation fails.

**Scenario 1: Fail an update if the index no longer exists**

The accessCondition checks for an existing ETag on the index. If the ETag does not exist, the index object does not exist, causing the update to fail as a result. 

        var newIndex = new Index();
        newIndex.Name = "aNewIndex";
        newIndex.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(newIndex, accessCondition: AccessCondition.GenerateIfExistsCondition());

**Scenario 2: Fail the update if the version changed underneath you**

The accessCondition checks for a corresponding ETag on the object definition and the local object. If the ETags do not match, the accessCondition fails and the index is not updated. The following update succeeds only if the ETag on the index is unchanged. 

        var index = serviceClient.Indexes.Get("IndexName");
        index.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(index, accessCondition: AccessCondition.GenerateIfMatchCondition(index.ETag));


## Design pattern

A design pattern for implementing optimistic concurrency should include a loop that retries the accessCondition check, a test for the access condition, and optionally retrieving a updated object and applying your changes to the revised version.

This code snippet illustrates an update to a synonymMap, created in the [Synonym (preview) C# tutorial for Azure Search](https://docs.microsoft.com/azure/search/search-synonyms-tutorial-sdk). This snippet checks for the object version, throws an exception if the check fails, and then gets the latest synonymMap before re-attempting the update.

        private static void AddNewSynonymsSafely(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            synonymMap.Synonyms = synonymMap.Synonyms + "\ninternet,wifi";
            
            // This request fails if the synonymMap has changed on the server.
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


## Next steps

Try modifying either of the following samples to include ETags or AccessCondition objects.

+ [.NET SDK sample on Github](https://github.com/Azure-Samples/search-dotnet-getting-started) 
+ [REST API sample on Github](https://github.com/Azure-Samples/search-rest-api-getting-started) 

## See also

  [Common HTTP request and response headers](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search)    
  [HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes) 
  [Index operations (REST API)](https://docs.microsoft.com/\rest/api/searchservice/index-operations)