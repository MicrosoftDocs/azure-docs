---
title: Security filters for trimming results
titleSuffix: Azure Cognitive Search
description: Security privileges at the document level for Azure Cognitive Search search results, using security filters and user identities.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/04/2020
---

# Security filters for trimming results in Azure Cognitive Search

You can apply security filters to trim search results in Azure Cognitive Search based on user identity. This search experience generally requires comparing the identity of whoever requests the search against a field containing the principles who have permissions to the document. When a match is found, the user or principal (such as a group or role) has access to that document.

One way to achieve security filtering is through a complicated disjunction of equality expressions: for example, `Id eq 'id1' or Id eq 'id2'`, and so forth. This approach is error-prone, difficult to maintain, and in cases where the list contains hundreds or thousands of values, slows down query response time by many seconds. 

A simpler and faster approach is through the `search.in` function. If you use `search.in(Id, 'id1, id2, ...')` instead of an equality expression, you can expect sub-second response times.

This article shows you how to accomplish security filtering using the following steps:
> [!div class="checklist"]
> * Create a field that contains the principal identifiers 
> * Push or update existing documents with the relevant principal identifiers
> * Issue a search request with `search.in` `filter`

>[!NOTE]
> The process of retrieving the principal identifiers is not covered in this document. You should get it from your identity service provider.

## Prerequisites

This article assumes you have an [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F), [Azure Cognitive Search service](https://docs.microsoft.com/azure/search/search-create-service-portal), and [Azure Cognitive Search Index](https://docs.microsoft.com/azure/search/search-create-index-portal).  

## Create security field

Your documents must include a field specifying which groups have access. This information becomes the filter criteria against which documents are selected or rejected from the result set returned to the issuer.
Let's assume that we have an index of secured files, and each file is accessible by a different set of users.
1. Add field `group_ids` (you can choose any name here) as a `Collection(Edm.String)`. Make sure the field has a `filterable` attribute set to `true` so that search results are filtered based on the access the user has. For example, if you set the `group_ids` field to `["group_id1, group_id2"]` for the document with `file_name` "secured_file_b", only users that belong to group ids "group_id1" or "group_id2" have read access to the file.
   Make sure the field's `retrievable` attribute is set to `false` so that it is not returned as part of the search request.
2. Also add `file_id` and `file_name` fields for the sake of this example.  

```JSON
{
    "name": "securedfiles",  
    "fields": [
        {"name": "file_id", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false},
        {"name": "file_name", "type": "Edm.String"},
        {"name": "group_ids", "type": "Collection(Edm.String)", "filterable": true, "retrievable": false}
    ]
}
```

## Pushing data into your index using the REST API
  
Issue an HTTP POST request to your index's URL endpoint. The body of the HTTP request is a JSON object containing the documents to be added:

```
POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2020-06-30  
Content-Type: application/json
api-key: [admin key]
```

In the request body, specify the content of your documents:

```JSON
{
    "value": [
        {
            "@search.action": "upload",
            "file_id": "1",
            "file_name": "secured_file_a",
            "group_ids": ["group_id1"]
        },
        {
            "@search.action": "upload",
            "file_id": "2",
            "file_name": "secured_file_b",
            "group_ids": ["group_id1", "group_id2"]
        },
        {
            "@search.action": "upload",
            "file_id": "3",
            "file_name": "secured_file_c",
            "group_ids": ["group_id5", "group_id6"]
        }
    ]
}
```

If you need to update an existing document with the list of groups, you can use the `merge` or `mergeOrUpload` action:

```JSON
{
    "value": [
        {
            "@search.action": "mergeOrUpload",
            "file_id": "3",
            "group_ids": ["group_id7", "group_id8", "group_id9"]
        }
    ]
}
```

For full details on adding or updating documents, you can read [Edit documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).
   
## Apply the security filter

In order to trim documents based on `group_ids` access, you should issue a search query with a `group_ids/any(g:search.in(g, 'group_id1, group_id2,...'))` filter, where 'group_id1, group_id2,...' are the groups to which the search request issuer belongs.
This filter matches all documents for which the `group_ids` field contains one of the given identifiers.
For full details on searching documents using Azure Cognitive Search, you can read [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents).
Note that this sample shows how to search documents using a POST request.

Issue the HTTP POST request:

```
POST https://[service name].search.windows.net/indexes/securedfiles/docs/search?api-version=2020-06-30
Content-Type: application/json  
api-key: [admin or query key]
```

Specify the filter in the request body:

```JSON
{
   "filter":"group_ids/any(g:search.in(g, 'group_id1, group_id2'))"  
}
```

You should get the documents back where `group_ids` contains either "group_id1" or "group_id2". In other words, you get the documents to which the request issuer has read access.

```JSON
{
 [
   {
    "@search.score":1.0,
     "file_id":"1",
     "file_name":"secured_file_a",
   },
   {
     "@search.score":1.0,
     "file_id":"2",
     "file_name":"secured_file_b"
   }
 ]
}
```
## Conclusion

This is how you can filter results based on user identity and Azure Cognitive Search `search.in()` function. You can use this function to pass in principle identifiers for the requesting user to match against principal identifiers associated with each target document. When a search request is handled, the `search.in` function filters out search results for which none of the user's principals have read access. The principal identifiers can represent things like security groups, roles, or even the user's own identity.
 
## See also

+ [Active Directory identity-based access control using Azure Cognitive Search filters](search-security-trimming-for-azure-search-with-aad.md)
+ [Filters in Azure Cognitive Search](search-filters.md)
+ [Data security and access control in Azure Cognitive Search operations](search-security-overview.md)