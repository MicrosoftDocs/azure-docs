---
title: Making HTTP requests
description: The query REST API allows you to execute the same queries you run in the Azure Log Analytics search experience, so that you can consume the results programmatically.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Making HTTP requests

The query REST API allows you to execute the same queries you run in the Azure Log Analytics search experience, so that you can consume the results programmatically. You can [learn more about Azure Log Analytics](https://docs.loganalytics.io/index) and how to form [queries](https://docs.loganalytics.io/docs/Language-Reference).

Let's take a look at an example query. Specifically, let's count the number AzureActivity events grouped by Category

```
    AzureActivity
    | summarize count() by Category
```

## Execute this query through the /query API

Once an Azure Active Directory (AAD) access token is obtained, you can make calls to the /query API using either GET or POST requests. We'll document the POST format here.

The POST body is JSON with two properties; `query`, which is an [analytics query](https://docs.loganalytics.io/docs/Language-Reference), and `timespan` which is an optional parameter specifying the timespan (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) duration format) to query over. If `timespan` is omitted, the query will run over all data.

For example, the above analytics query, looking over just the last 12 hours can be executed with the following HTTP request

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    
    Authorization: Bearer <access token>
    Content-Type: application/json
    
    {
      "query": "AzureActivity | summarize count() by Category",
      "timespan": "PT12H"
    }
```

Which has the following response

```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    
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
                        20839
                    ],
                    [
                        "Recommendation",
                        122
                    ],
                    [
                        "Alert",
                        64
                    ],
                    [
                        "ServiceHealth",
                        11
                    ]
                ]
            }
        ]
    }
```

The `tables` property is an array of tables representing the query result. Each table contains `name`, `columns` and `rows` properties.

The `name` property is the name of the table. The `columns` property is an array of objects describing the schema of each column and the `rows` property is an array of values where each item in the array represents a row in the result set.

In the above example, we can see the result contains two columns, `Category` and `count_`. The first column, `Category`, represents the value of the `Category` column in the `AzureActivity` table, and the second column, `count_` is count of the number of events in the `AzureActivity` table for the given Category value.
