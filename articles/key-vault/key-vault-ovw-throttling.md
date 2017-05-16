---
ms.assetid: 
title: Azure Key Vault throttling guidance | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 05/16/2017
---
# Azure Key Vault throttling guidance

Throttling is a process you initiate that limits the number of concurrent calls to the service to prevent overuse of resources. Azure Key Vault (AKV) is designed to handle a high volume of requests. If an overwhelming number of requests occurs, throttling your requests helps maintain optimal performance and reliability of the AKV service.

Throttling limits vary based on the scenario. For example, if you are performing a large volume of writes, the possibility for throttling is higher than if you are only performing reads.

## What happens when throttling occurs?

When a throttling threshold is exceeded, AKV limits any further requests from that client for a period of time. When throttling occurs, AKV returns HTTP status code 429 (Too many requests), and the requests fail. 

## Best practices to handle throttling

The following are best practices for handling throttling:
- Reduce the number of operations per request.
- Reduce the frequency of calls.
- Avoid immediate retries, because all requests accrue against your usage limits.

When you implement error handling, use the HTTP error code 429 to detect throttling. If the request fails again with a 429 error code, you are still being throttled. Continue to use the recommended throttling method and retry the request until it succeeds.

### Recommended throttling method

On HTTP error code 429, begin throttling, using an exponential backoff approach:

```

Wait 1 sec, retry request
    If still throttled wait 2 sec, retry request
        If still throttled wait 4 sec, retry request
            If still throttled wait 8 sec, retry request
                If still throttled wait 16 sec, retry request
At this point, you should not be getting any HTTP 429 response codes.

```


For a deeper orientation of throttling on the Microsoft Cloud, see [Throttling Pattern](https://docs.microsoft.com/azure/architecture/patterns/throttling).

