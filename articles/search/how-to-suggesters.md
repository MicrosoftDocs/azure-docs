---
title: "Suggesters (Azure Search Service REST API) | Microsoft Docs"
description: Enables fields for type-ahead query actions, where suggested queries are composed of text from fields in an Azure Search index.
ms.date: "2017-07-17"
services: search
ms.service: search
ms.topic: "language-reference"

author: "Brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Suggesters

A **Suggester** is a construct supporting the "search-as-you-type" [Suggestions](suggestions.md) feature in Azure Search. Before you can call the Suggestions API, you must define a **suggester** to enable suggestions on specific fields.

Although a **suggester** has several properties, it is primarily a collection of fields for which you are enabling the Suggestions API. For example, a travel app might want to enable typeahead search on destinations, cities, and attractions. As such, all three fields would go in the field collection.

You can have only one **suggester** resource for each index (specifically, one **suggester** in the **suggesters** collection).

You can create a **suggester** at any time, but the impact on your index varies based on the fields. New fields added to a suggester as part of the same update are the least impactful in that no index rebuild is required. Adding existing fields, however, changes the field definition, necessitating a full rebuild of the index.

## Usage  

 **Suggesters** work best when used to suggest specific documents rather than loose terms or phrases. The best candidate fields are titles, names, and other relatively short phrases that can identify an item. Less effective are repetitive fields, such as categories and tags, or very long fields such as descriptions or comments fields.  

After a suggester is created, add the [Suggestions API](suggestions.md) in your query logic to invoke the feature.  

Properties that define a **suggester** include the following:  

|Property|Description|  
|--------------|-----------------|  
|`name`|The name of the **suggester**. You use the name of the **suggester** when calling the [Suggestions &#40;Azure Search Service REST API&#41;](suggestions.md).|  
|`searchMode`|The strategy used to search for candidate phrases. The only mode currently supported is `analyzingInfixMatching`, which performs flexible matching of phrases at the beginning or in the middle of sentences.|  
|`sourceFields`|A list of one or more fields that are the source of the content for suggestions. Only fields of type `Edm.String` and `Collection(Edm.String)` may be sources for suggestions. Only fields that don't have a custom language analyzer set can be used. |  

## Suggester example  
 A **suggester** is part of the index. Only one **suggester** can exist in the **suggesters** collection in the current version, alongside the **fields** collection and **scoringProfiles**.  

```  
{  
  "name": "hotels",  
  "fields": [  
     . . .   
   ],  
  "suggesters": [  
    {  
    "name": "sg",  
    "searchMode": "analyzingInfixMatching",  
    "sourceFields": ["hotelName", "category"]  
    }  
  ],  
  "scoringProfiles": [  
     . . .   
  ]  
}  

```  

## See also  
 [Create Index &#40;Azure Search Service REST API&#41;](create-index.md)   
 [Update Index &#40;Azure Search Service REST API&#41;](update-index.md)   
 [Suggestions &#40;Azure Search Service REST API&#41;](suggestions.md)   
 [Index operations &#40;Azure Search Service REST API&#41;](index-operations.md)   
 [Azure Search Service REST](index.md)   
 [Azure Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search?view=azure-dotnet)  
