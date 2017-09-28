---
title: "Security Trimming with Azure Search"
description: Implement security trimming using Azure Search filter.
ms.custom: ""
ms.date: "2017-07-08"
ms.prod: "azure"
ms.reviewer: ""
ms.service: "search"
ms.suite: ""
ms.tgt_pltfrm: ""
caps.latest.revision: 26
author: "Revitalbarletz"
ms.author: "revitalb"
manager: "jlembicz"
---

Often, you may want to filter documents returned in search results based on the user that issues the search. Implementing security trimming with filters might require comparing a field against a list of principals of the requesting user. If a document matches the filter, that means that the user or one of the principals to which they belong (groups, roles, etc.) has been granted access to that document.
One way to achieve that is by using a complicated disjunction of equality expressions, for example, `Id eq 'id1' or Id eq 'id2' or ....`.
In cases where the list contains hundreds or thousands of values, the response time is expected to be longer than a few seconds. In these scenarios, using the `search.in` function is highly recommended. If you use `search.in(Id, 'id1, id2, ...')` instead of `Id eq 'id1' or Id eq 'id2' or ...` you can expect a subsecond response time. 

This article shows you how to accomplish security trimming using the `search.in` function.
You can use this function to pass in principal identifiers for the requesting user to match against principal identifiers associated with each target document. When a search request is handled, the `search.in` function filters out search results for which none of the user's principals have read access. The principal identifiers can represent things like security groups, roles, or even the user's own identity.

## Prerequisites

This article assumes you have an [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F), [Azure Search service](https://docs.microsoft.com/azure/search/search-create-service-portal), and [Azure Search Index](https://docs.microsoft.com/azure/search/search-create-index-portal).  

## Create Security Field

To implement security trimming, your documents must include a field specifying which groups have access. This information becomes the filter criteria against which documents are selected or rejected from the result set returned to the issuer.
Let's assume that we have an index of secured files, and each file is accessible by a different set of users.
1. Add field `group_ids` as a `Collection(Edm.String)`. Make sure the field has a `filterable` attribute set to `true` so that search results are filtered based on the access the user has. For example, if you set the `group_ids` field to `["group_id1, group_id2"]` for the document with `file_name` "secured_file_b", only users that belong to group ids "group_id1" or "group_id2" have read access to the file.
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
POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2016-09-01
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
   
## Trimming documents based on user access

In order to trim documents based on `group_ids` access, you should issue a search query with a `group_ids/any(g:search.in(g, 'group_id1, group_id2,...'))` filter, where 'group_id1, group_id2,...' are the groups to which the search request issuer belongs.
This filter matches all documents for which the `group_ids` field contains one of the given identifiers.
For full details on searching documents using Azure Search, you can read [Search Documents](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents).
Note that this sample shows how to search documents using a POST request.

Issue the HTTP POST request:

```
POST https://[service name].search.windows.net/indexes/securedfiles/docs/search?api-version=[api-version]  
Content-Type: application/json  
api-key: [admin or query key]
```

Specify the filter in the request body:

```JSON
{
   "filter":"group_ids/any(p:search.in(p, 'group_id1, group_id2'))"  
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

This is how you can filter results based on user identity and Azure Search capabilities. 
