---
title: Managed HSM throttling guidance
description: Managed HSM throttling limits the number of concurrent calls to prevent overuse of resources.
services: key-vault
author: msmbaldwin
manager: rkarlin

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: mbaldwin

---

# Managed HSM throttling guidance

Throttling is a process that limits the number of concurrent calls to an Azure service to prevent overuse of resources. Managed HSM is designed to handle a high volume of requests. If an overwhelming number of requests occurs, throttling your client's requests helps maintain optimal performance and reliability of the service.

Throttling limits vary based on the scenario. For example, if you are performing a large volume of writes, the possibility for throttling is higher than if you are only performing reads.

## How does Managed HSM handle its limits?

Service limits prevent misuse of resources and ensure quality of service for all clients. When a service threshold is exceeded, further requests from that client are limited for a period of time. The request returns HTTP status code 429 (Too many requests), and the request fails. Failed requests that return a 429 count towards the tracked throttle limits. 

Managed HSM has the limits specified in [service limits](service-limits.md). To maximize throughput rates, the following are recommended guidelines/best practices:
1. Ensure you have throttling in place.  Client must honor exponential back-off policies for 429's and ensure you are doing retries as per the guidance below.
3. Encrypt, wrap, and verify public-key operations can be performed with no access to Managed HSM, which not only reduces risk of throttling, but also improves reliability (as long as you properly cache the public key material).
4. If you use Managed HSM to store credentials for a service, check if that service supports AAD Authentication to authenticate directly. This reduces the load on Managed HSM, improves reliability and simplifies your code since it can now use the AAD token. Many services have moved to using AAD Auth. See the current list at [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-managed-identities-for-azure-resources).
5. Consider staggering your load/deployment over a longer period of time to stay under the current RPS limits.

If you have a valid business case for higher throttle limits, please contact us.

## How to throttle your app in response to service limits

The following are **best practices** you should implement when your service is throttled:
- Reduce the number of operations per request.
- Reduce the frequency of requests.
- Avoid immediate retries. 
    - All requests accrue against your usage limits.

When you implement your app's error handling, use the HTTP error code 429 to detect the need for client-side throttling. If the request fails again with an HTTP 429 error code, you are still encountering an Azure service limit. Continue to use the recommended client-side throttling method, retrying the request until it succeeds.

Code that implements exponential backoff is shown below. 
```
SecretClientOptions options = new SecretClientOptions()
    {
        Retry =
        {
            Delay= TimeSpan.FromSeconds(2),
            MaxDelay = TimeSpan.FromSeconds(16),
            MaxRetries = 5,
            Mode = RetryMode.Exponential
         }
    };
    var client = new SecretClient(new Uri(https://keyVaultName.vault.azure.net"), new DefaultAzureCredential(),options);
                                 
    //Retrieve Secret
    secret = client.GetSecret(secretName);
```


Using this code in a client C# application is straightforward. 

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

