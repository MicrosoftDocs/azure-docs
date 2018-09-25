---
title: Azure Key Vault throttling guidance
description: Key Vault throttling limits the number of concurrent calls to prevent overuse of resources.
services: key-vault
documentationcenter:
author: bryanla
manager: mbaldwin
tags:

ms.assetid: 9b7d065e-1979-4397-8298-eeba3aec4792
ms.service: key-vault
ms.workload: identity
ms.topic: conceptual
ms.date: 05/10/2018
ms.author: bryanla

---

# Azure Key Vault throttling guidance

Throttling is a process you initiate that limits the number of concurrent calls to the Azure service to prevent overuse of resources. Azure Key Vault (AKV) is designed to handle a high volume of requests. If an overwhelming number of requests occurs, throttling your client's requests helps maintain optimal performance and reliability of the AKV service.

Throttling limits vary based on the scenario. For example, if you are performing a large volume of writes, the possibility for throttling is higher than if you are only performing reads.

## How does Key Vault handle its limits?

Service limits in Key Vault are there to prevent misuse of resources and ensure quality of service for all of Key Vault’s clients. When a service threshold is exceeded, Key Vault limits any further requests from that client for a period of time. When this happens, Key Vault returns HTTP status code 429 (Too many requests), and the requests fail. Also, failed requests that return a 429 count towards the throttle limits tracked by Key Vault. 

If you have a valid business case for higher throttle limits, please contact us.


## How to throttle your app in response to service limits

The following are **best practices** for throttling your app:
- Reduce the number of operations per request.
- Reduce the frequency of requests.
- Avoid immediate retries. 
    - All requests accrue against your usage limits.

When you implement your app's error handling, use the HTTP error code 429 to detect the need for client-side throttling. If the request fails again with an HTTP 429 error code, you are still encountering an Azure service limit. Continue to use the recommended client-side throttling method, retrying the request until it succeeds.

### Recommended client-side throttling method

On HTTP error code 429, begin throttling your client using an exponential backoff approach:

1. Wait 1 second, retry request
2. If still throttled wait 2 seconds, retry request
3. If still throttled wait 4 seconds, retry request
4. If still throttled wait 8 seconds, retry request
5. If still throttled wait 16 seconds, retry request

At this point, you should not be getting HTTP 429 response codes.

## See also

For a deeper orientation of throttling on the Microsoft Cloud, see [Throttling Pattern](https://docs.microsoft.com/azure/architecture/patterns/throttling).

