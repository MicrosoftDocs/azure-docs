---
title: Request format
description: The query endpoint is a RESTful HTTPS API that supports POST and GET methods.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Request format

The query endpoint is a RESTful HTTPS API that supports `POST` and `GET` methods.

The URL has the following form

```
    https://api.loganalytics.io/{api-version}/workspaces/{workspace-id}/query?[{parameters}]
```

where the components of the URL are:

1.  **api-version**: URL segment with the API version to use, e.g. `v1`, as defined [here](api-version.md)
2.  **workspace-id**: URL segment with the Workspace ID of your Log Analytics workspace
3.  **parameters**: Query string parameters detailing the query to execute

To describe the query to execute, there are two parameters.

1.  **query**: (required) the Log Analytics [query](https://docs.loganalytics.io/docs/Language-Reference) to execute.
2.  **timespan**: (optional) the timespan (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) duration format) in which to run the query. If this parameter is not specified, the query will run over all data.

Depending on the HTTP method invoked, the above two parameters will be specified on either the query string or in the request body.

## GET /query

When the HTTP method executed is `GET`, the parameter `query` MUST be specified as a query string parameter. The `timespan` parameter MAY be specified on the query string. For example, to count AzureActivity events by Category, the following call can be made

```
    GET https://api.loganalytics.io/v1/workspaces/{workspace-id}/query?query=AzureActivity%20|%20summarize%20count()%20by%20Category
    Authorization: Bearer <access token>
```

## POST /query

When the HTTP method executed is `POST` the request must include the header `Content-Type: application/json` and the body MUST be valid JSON. The `query` parameter MUST be specified as a property in the JSON body. The `timespan` parameter MAY be specified on either the query string or in the JSON body. If specified in both the query string and the JSON body, the resulting timespan will be the intersection of the two values. For example, to count AzureActivity events by Category, the following call can be made

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    
    Authorization: Bearer <access token>
    Content-Type: application/json
    
    {
      "query": "AzureActivity | summarize count() by Category"
    }
```

Response:

```
    {
        "tables": [
            {
                "name": "PrimaryResult",
                "columns": [
                    {
                        "name": "Category",
                        "type": "string"
                    },
                    {
                        "name": "count_",
                        "type": "long"
                    }
                ],
                "rows": [
                    [
                        "Administrative",
                        492080
                    ],
                    [
                        "Autoscale",
                        12138
                    ],
                    [
                        "Recommendation",
                        14
                    ],
                    [
                        "ServiceHealth",
                        96
                    ],
                    [
                        "Security",
                        2
                    ]
                ]
            }
        ]
    }
```
