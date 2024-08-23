---
title: Security filter pattern
titleSuffix: Azure AI Search
description: Learn how to implement security privileges at the document level for Azure AI Search search results, using security filters and user identities.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 06/20/2024
---

# Security filters for trimming results in Azure AI Search

Azure AI Search doesn't provide native document-level permissions and can't vary search results from within the same index by user permissions. As a workaround, you can create a filter that trims search results based on a string containing a group or user identity.

This article describes a pattern for security filtering having the following steps:

> [!div class="checklist"]
> * Assemble source documents with the required content
> * Create a field for the principal identifiers 
> * Push the documents to the search index for indexing
> * Query the index with the `search.in` filter function

It concludes with links to demos and examples that provide hands-on learning. We recommend reviewing this article first to understand the pattern.

## About the security filter pattern

Although Azure AI Search doesn't integrate with security subsystems for access to content within an index, many customers who have document-level security requirements find that filters can meet their needs.

In Azure AI Search, a security filter is a regular OData filter that includes or excludes a search result based on a string consisting of a security principal. There's no authentication or authorization through the security principal. The principal is just a string, used in a filter expression, to include or exclude a document from the search results.

There are several ways to achieve security filtering. One way is through a complicated disjunction of equality expressions: for example, `Id eq 'id1' or Id eq 'id2'`, and so forth. This approach is error-prone, difficult to maintain, and in cases where the list contains hundreds or thousands of values, slows down query response time by many seconds. 

A better solution is using the `search.in` function for security filters, as described in this article. If you use `search.in(Id, 'id1, id2, ...')` instead of an equality expression, you can expect subsecond response times.

## Prerequisites

* A string field containing a group or user identity, such as a Microsoft Entra object identifier.

* Other fields in the same document should provide the content that's accessible to that group or user. In the following JSON documents, the "security_id" fields contain identities used in a security filter, and the name, salary, and marital status are included if the identity of the caller matches the "security_id" of the document.

    ```json
    {  
        "Employee-1": {  
            "employee_id": "100-1000-10-1-10000-1",
            "name": "Abram",   
            "salary": 75000,   
            "married": true,
            "security_id": "alphanumeric-object-id-for-employee-1"
        },
        "Employee-2": {  
            "employee_id": "200-2000-20-2-20000-2",
            "name": "Adams",   
            "salary": 75000,   
            "married": true,
            "security_id": "alphanumeric-object-id-for-employee-2"
        } 
    }  
    ```

## Create security field

In the search index, within the fields collection, you need one field that contains the group or user identity, similar to the fictitious "security_id" field in the previous example.

1. Add a security field as a `Collection(Edm.String)`.

1. Set the field's `filterable` attribute set to `true`.

1. Set the field's `retrievable` attribute to `false` so that it isn't returned as part of the search request.

1. Indexes require a document key. The "file_id" field satisfies that requirement. 

1. Indexes should also contain searchable and retrievable content. The "file_name" and "file_description" fields represent that in this example.

   The following index schema satisfies the field requirements. Documents that you index on Azure AI Search should have values for all of these fields, including the "group_ids". For the document with `file_name` "secured_file_b", only users that belong to group IDs "group_id1" or "group_id2" have read access to the file.

   ```https
   POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2024-07-01
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

Populate your search index with documents that provide values for each field in the fields collection, including values for the security field. Azure AI Search doesn't provide APIs or features for populating the security field specifically. However, several of the examples listed at the end of this article explain techniques for populating this field.

In Azure AI Search, the approaches for loading data are:

* A single push or pull (indexer) operation that imports documents populated with all fields
* Multiple push or pull operations. As long as secondary import operations target the right document identifier, you can load fields individually through multiple imports.

The following example shows a single HTTP POST request to the docs collection of your index's URL endpoint (see [Documents - Index](/rest/api/searchservice/documents/)). The body of the HTTP request is a JSON rendering of the documents to be indexed:

```http
POST https://[search service].search.windows.net/indexes/securedfiles/docs/index?api-version=2024-07-01
{
    "value": [
        {
            "@search.action": "upload",
            "file_id": "1",
            "file_name": "secured_file_a",
            "file_description": "File access is restricted to Human Resources.",
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

## Apply the security filter in the query

In order to trim documents based on `group_ids` access, you should issue a search query with a `group_ids/any(g:search.in(g, 'group_id1, group_id2,...'))` filter, where 'group_id1, group_id2,...' are the groups to which the search request issuer belongs.

This filter matches all documents for which the `group_ids` field contains one of the given identifiers.
For full details on searching documents using Azure AI Search, you can read [Search Documents](/rest/api/searchservice/documents/search-post?).

This sample shows how to set up query using a POST request.

Issue the HTTP POST request, specifying the filter in the request body:

```http
POST https://[service name].search.windows.net/indexes/securedfiles/docs/search?api-version=2024-07-01

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

This article describes a pattern for filtering results based on user identity and the `search.in()` function. You can use this function to pass in principal identifiers for the requesting user to match against principal identifiers associated with each target document. When a search request is handled, the `search.in` function filters out search results for which none of the user's principals have read access. The principal identifiers can represent things like security groups, roles, or even the user's own identity.

For more examples, demos, and videos:

* [Get started with chat document security in Python](/azure/developer/python/get-started-app-chat-document-security-trim)
* [Set up optional sign in and document level access control (modifications to the AzureOpenAIDemo app)](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/docs/login_and_acl.md)
* [Video: Secure your Intelligent Applications with Microsoft Entra](https://build.microsoft.com/en-US/sessions/b5636ca7-64c2-493c-9b30-4a35852acfbe?source=/speakers/cc9b56a0-4af0-4b60-a2f3-8312c5b35ca2)
