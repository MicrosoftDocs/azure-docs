---
title: Reset Skills (api-version=2019-050-06-Preview)
titleSuffix: Azure Cognitive Search
description: Preview REST API used for incremental enrichment when you need whole or partial reprocessing of a skillset.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/09/2020
---
# Reset Skills (api-version=2019-05-06-Preview)

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no portal or .NET SDK support at this time.

The **Reset Skills** request specifies which skills to process on the next indexer run. For indexers that have caching enabled, you can explicitly request processing for skill updates that the indexer cannot detect. For example, if you make external changes, such as revisions to a custom skill, you can use this API to rerun the skill. Outputs, such as a knowledge store or search index, are refreshed using reusable data from the cache and new content per the updated skill.

You can reset an existing [skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) using an HTTP PUT, specifying the name of the skillset to update on the request URI. You must use **api-version=2019-05-06-Preview** on the request.

```http  
PUT https://[servicename].search.windows.net/skillsets/[skillset name]/resetskills?api-version=2019-05-06-Preview
api-key: [admin key]
Content-Type: application/json
```  

Alternatively, use POST and put the indexer name in the body of the request:

```http
POST https://[service name].search.windows.net/indexers/resetskills?api-version=[api-version]  
api-key: [admin key]  
```  

## Request headers  

 The following table describes the required and optional request headers.  

|Request Header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set this to `application/json`|  
|*api-key:*|Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Reset Skillset** request must include an `api-key` header set to your admin key (as opposed to a query key).|  

You also need the service name to construct the request URL. You can get both the service name and `api-key` from your service Overview page in the Azure portal. See [Create an Azure Cognitive Search service](https://docs.microsoft.com/azure/search/search-create-service-portal) for page navigation help.  

## Request body syntax  

The body of the request is an array of skill names.

```json
{   
	"skillNames" : ["<SKILL-1>", "SKILL-n"]
}  
```

## Response  

Status Code: 204 No Content for a successful response. 

## See also

+ [Search REST APIs](https://docs.microsoft.com/rest/api/searchservice)
+ [HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes)  
+ [AI enrichment overview](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro)
+ [Configure caching and incremental enrichment](search-howto-incremental-index.md)
+ [Incremental enrichment](cognitive-search-incremental-indexing-conceptual.md)