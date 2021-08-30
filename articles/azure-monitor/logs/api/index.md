---
title: Azure Log Analytics queries
description: Azure Log Analytics is a service that monitors your cloud and on-premises environments to maintain their availability, performance, and other aspects.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Azure Log Analytics queries

[Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics) is a service that monitors your cloud and on-premises environments to maintain their availability, performance, and other aspects. As part of the service, powerful interactive query capabilities are available that allow you to ask advanced questions specific to your data. While a comprehensive IDE is available to execute these queries, it is sometimes necessary to access the data programmatically. This website outlines the API that lets you do just that: programatically execute your Azure Log Analytics queries.

## Calling the API 101

For this quickstart, we will be querying the demo environment. This environment is set up to accept an API key, but some additional authention logic aside, the call to the API will be the same as shown here. You can query this demo environment using the Advanced Query Portal [here](https://portal.loganalytics.io/demo).

Calling the API is a straightforward procedure that consists of the following steps:

1.  Select the workspace
2.  Authenticate
3.  Write your query
4.  Call the API to run the query

## 1. Choose your workspace ID

For this quick start, we'll be using the demo workspace. For this workspace, the ID is `DEMO_WORKSPACE`.

You can find the ID of your own workspace through the Azure Portal where it's listed on the overview page for your Azure Log Analytics resource. You can find more details in section 1.3 of our [AAD tutorial](direct-api.md).

## 2. Obtain an authentication token

You will also need to authenticate to query the workspace. For the demo environment we have enabled API-key authentication using the API key `DEMO_KEY`.

For your own workspace, you will need to authenticate using Azure Active Directory to obtain an authentication token. Learn how to obtain and use this token [here](aad-setup.md).

## 3. Prepare your query

You can find more information about writing Azure Log Analytics queries on our [reference website](https://docs.loganalytics.io/docs/Language-Reference). There you'll also find tutorials, examples, and a full language reference\!

Write your query and make sure it executes without errors and returns results. For this quick start, we will be using a very simple query that will tell us the number of events we have logged for every type of Azure Activity category.

```
    AzureActivity 
    | summarize count() by Category
```

## 4. Run your query

You can find out more about how to execute queries against your workspace [here](request-format.md).

For this quick start, we will set up our request as follows:

```
    POST https://api.loganalytics.io/v1/workspaces/DEMO_WORKSPACE/query
    
    X-Api-Key: DEMO_KEY
    Content-Type: application/json
    
    {
        "query": "AzureActivity | summarize count() by Category"
    }
```

You will get this response

```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    
    {
      "tables": [
        {
          "name": "PrimaryResult",
          "columns": [
            { "name": "Category", "type": "string" },
            { "name": "count_", "type": "long" }
          ],
          "rows": [
            [ "Administrative", 20839 ],
              ...
            [ "ServiceHealth",  11    ]
          ]
        }
      ]
    }
```

For convenience, here is the request set up in cURL:

```
    curl -X POST 'https://api.loganalytics.io/v1/workspaces/DEMO_WORKSPACE/query' -d '{"query": "AzureActivity | summarize count() by Category"}' -H 'x-api-key: DEMO_KEY' -H 'Content-Type: application/json'
```

## Next steps

  - For a walkthrough of running queries against your own workspace using Azure Active Directory to authenticate, see our [Tutorials](tutorials.md).
  - For further API documentation and advanced topics, see the [Documentation section](overview.md).
  - For a complete reference of the API, see the [API Reference section](https://dev.loganalytics.io/reference).
