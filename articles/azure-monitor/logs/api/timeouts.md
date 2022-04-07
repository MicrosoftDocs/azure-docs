---
title: Timeouts
description: Query execution times can vary widely based on the complexity of the query, amount of data being analyzed, and the load on the system and workspace at the time of the query.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/28/2021
ms.topic: article
---
# Timeouts

Query execution times can vary widely based on:
- The complexity of the query
- The amount of data being analyzed
- The load on the system at the time of the query
- The load on the workspace at the time of the query

You may want to customize the timeout for the query. The default timeout is 3 minutes, and the maximum timeout is 10 minutes.

## Timeout request header

To set the timeout, use the `Prefer` header in the HTTP request, using the standard `wait` preference, see [here](https://tools.ietf.org/html/rfc7240#section-4.3) for details. The `Prefer` header puts an upper limit, in seconds, on how long the client will wait for the service to process the query.

## Response

If a query takes longer than the specified timeout (or default timeout, if unspecified), it will fail with a status code of 504 Gateway Timeout.

For example, the following request allows a maximum server timeout age of 30 seconds

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    Authorization: Bearer <access token>
    Prefer: wait=30
    
    {
        "query" : "Heartbeat | count"
    }
```
