---
title: Security filters for trimming results
titleSuffix: Azure AI Search
description: Learn how to implement security privileges at the document level for Azure AI Search search results, using security filters and user identities.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 03/24/2023
---

# Security filters for trimming results in Azure AI Search

Azure AI Search doesn't provide document-level permissions and can't vary search results from within the same index by user permissions. As a workaround, you can create a filter that trims search results based on a string containing a group or user identity.

This article describes a pattern for security filtering that includes following steps:

> [!div class="checklist"]
> * Assemble source documents with the required content
> * Create a field for the principal identifiers 
> * Push the documents to the search index for indexing
> * Query the index with the `search.in` filter function

## About the security filter pattern

Although Azure AI Search doesn't integrate with security subsystems for access to content within an index, many customers who have document-level security requirements have found that filters can meet their needs.

In Azure AI Search, a security filter is a regular OData filter that includes or excludes a search result based on a matching value, except that in a security filter, the criteria is a string consisting of a security principal. There's no authentication or authorization through the security principal. The principal is just a string, used in a filter expression, to include or exclude a document from the search results.

There are several ways to achieve security filtering. One way is through a complicated disjunction of equality expressions: for example, `Id eq 'id1' or Id eq 'id2'`, and so forth. This approach is error-prone, difficult to maintain, and in cases where the list contains hundreds or thousands of values, slows down query response time by many seconds. 

A better solution is using the `search.in` function for security filters, as described in this article. If you use `search.in(Id, 'id1, id2, ...')` instead of an equality expression, you can expect subsecond response times.

## Prerequisites

* The field containing group or user identity must be a string with the "filterable" attribute. It should be a collection. It shouldn't allow nulls.

* Other fields in the same document should provide the content that's accessible to that group or user. In the following JSON documents, the "security_id" fields contain identities used in a security filter, and the name, salary, and marital status will be included if the identity of the caller matches the "security_id" of the document.

    ```json
    {  
        "Employee-1": {  
            "id": "100-1000-10-1-10000-1",
            "name": "Abram",   
            "salary": 75000,   
            "married": true,
            "security_id": "10011"
        },
        "Employee-2": {  
            "id": "200-2000-20-2-20000-2",
            "name": "Adams",   
            "salary": 75000,   
            "married": true,
            "security_id": "20022"
        } 
    }  
    ```

   >[!NOTE]
   > The process of retrieving the principal identifiers and injecting those strings into source documents that can be indexed by Azure AI Search isn't covered in this article. Refer to the documentation of your identity service provider for help with obtaining identifiers.

## Create security field

In the search index, within the field collection, you need one field that contains the group or user identity, similar to the fictitious "security_id" field in the previous example.

1. Add a security field as a `Collection(Edm.String)`. Make sure it has a `filterable` attribute set to `true` so that search results are filtered based on the access the user has. For example, if you set the `group_ids` field to `["group_id1, group_id2"]` for the document with `file_name` "secured_file_b", only users that belong to group IDs "group_id1" or "group_id2" have read access to the file.

   Set the field's `retrievable` attribute to `false` so that it isn't returned as part of the search request.

1. Indexes require a document key. The "file_id" field satisfies that requirement. Indexes should also contain searchable content. The "file_name" and "file_description" fields represent that in this example.  

   ```https
   POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2020-06-30
   {
        "name": "securedfiles",  
        "fields": [
            {"name": "file_id", "type": "Edm.String", "key": true, "searchable": false },
            {"name": "file_name", "type": "Edm.String", "searchable": true },
            {"name": "file_description", "type": "Edm.String", "searchable": true },
            {"name": "group_ids", "type": "Collection(Edm.String)", "filterable": true, "retrievable": false }
        ]
    }
   ```

## Push data into your index using the REST API
  
Issue an HTTP POST request to your index's URL endpoint. The body of the HTTP request is a JSON object containing the documents to be indexed:

```http
POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2020-06-30  
```

In the request body, specify the content of your documents:

```JSON
{
    "value": [
        {
            "@search.action": "upload",
            "file_id": "1",
            "file_name": "secured_file_a",
            "file_description": "File access is restricted to the Human Resources.",
            "group_ids": ["group_id1"]
        },
        {
            "@search.action": "upload",
            "file_id": "2",
            "file_name": "secured_file_b",
            "file_description": "File access is restricted to Human Resources and Recruiting.",
            "group_ids": ["group_id1", "group_id2"]
        },
        {
            "@search.action": "upload",
            "file_id": "3",
            "file_name": "secured_file_c",
            "file_description": "File access is restricted to Operations and Logistics.",
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

For more information on uploading documents, see [Add, Update, or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents).

## Apply the security filter in the query

In order to trim documents based on `group_ids` access, you should issue a search query with a `group_ids/any(g:search.in(g, 'group_id1, group_id2,...'))` filter, where 'group_id1, group_id2,...' are the groups to which the search request issuer belongs.

This filter matches all documents for which the `group_ids` field contains one of the given identifiers.
For full details on searching documents using Azure AI Search, you can read [Search Documents](/rest/api/searchservice/search-documents).

This sample shows how to set up query using a POST request.

Issue the HTTP POST request:

```http
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

## Next steps

This article described a pattern for filtering results based on user identity and the `search.in()` function. You can use this function to pass in principal identifiers for the requesting user to match against principal identifiers associated with each target document. When a search request is handled, the `search.in` function filters out search results for which none of the user's principals have read access. The principal identifiers can represent things like security groups, roles, or even the user's own identity.

For an alternative pattern based on Microsoft Entra ID, or to revisit other security features, see the following links.

* [Security filters for trimming results using Active Directory identities](search-security-trimming-for-azure-search-with-aad.md)
* [Security in Azure AI Search](search-security-overview.md)
