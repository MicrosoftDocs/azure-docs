---
title: Authenticating with an API key
description: To quickly explore the API without needing to use AAD authentication, we provide a demonstration workspace with sample data, which allows API key authentication.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Authenticating with an API key

To quickly explore the API without needing to use AAD authentication, we provide a demonstration workspace with sample data, which allows API key authentication.

To authenticate and run queries against the sample workspace, use `DEMO_WORKSPACE` as the {workspace-id} and pass in the API key `DEMO_KEY`.

The API key `DEMO_KEY` can be passed in three different ways, depending on whether you prefer to use the URL, a header, or basic authentication.

1.  **Custom header**: provide the API key in the custom header `X-Api-Key`
2.  **Query parameter**: provide the API key in the URL parameter `api_key`
3.  **Basic authentication**: provide the API key as either username or password. If you provide both, the API key must be in the username.

This example uses the Workspace ID and API key in the header:

```
    POST https://api.loganalytics.io/v1/workspaces/DEMO_WORKSPACE/query
    X-Api-Key: DEMO_KEY
    Content-Type: application/json
    
    {
        "query": "AzureActivity | summarize count() by Category"
    }
```

### Authentication errors

If either the Application ID or the API key are incorrect, the API service will return a [403](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) (Forbidden) error.
