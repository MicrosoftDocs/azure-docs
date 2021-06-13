---
title: Azure Key Vault throttling guidance
description: Key Vault throttling limits the number of concurrent calls to prevent overuse of resources.
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: mbaldwin

---

# Azure Key Vault throttling guidance

Throttling is a process you initiate that limits the number of concurrent calls to the Azure service to prevent overuse of resources. Azure Key Vault (AKV) is designed to handle a high volume of requests. If an overwhelming number of requests occurs, throttling your client's requests helps maintain optimal performance and reliability of the AKV service.

Throttling limits vary based on the scenario. For example, if you are performing a large volume of writes, the possibility for throttling is higher than if you are only performing reads.

## How does Key Vault handle its limits?

Service limits in Key Vault prevent misuse of resources and ensure quality of service for all of Key Vault's clients. When a service threshold is exceeded, Key Vault limits any further requests from that client for a period of time, returns HTTP status code 429 (Too many requests), and the request fails. Failed requests that return a 429 do not count towards the throttle limits tracked by Key Vault. 

Key Vault was originally designed to be used to store and retrieve your secrets at deployment time.  The world has evolved, and Key Vault is being used at run-time to store and retrieve secrets, and often apps and services want to use Key Vault like a database.  Current limits do not support high throughput rates.

Key Vault was originally created with the limits specified in [Azure Key Vault service limits](service-limits.md).  To maximize your Key Vault through put rates, here are some recommended guidelines/best practices for maximizing your throughput:
1. Ensure you have throttling in place.  Client must honor exponential back-off policies for 429's and ensure you are doing retries as per the guidance below.
1. Divide your Key Vault traffic amongst multiple vaults and different regions.   Use a separate vault for each security/availability domain.   If you have five apps, each in two regions, then we recommend 10 vaults each containing the secrets unique to app and region.  A subscription-wide limit for all transaction types is five times the individual key vault limit. For example, HSM-other transactions per subscription are limited to 5,000 transactions in 10 seconds per subscription. Consider caching the secret within your service or app to also reduce the RPS directly to key vault and/or handle burst based traffic.  You can also divide your traffic amongst different regions to minimize latency and use a different subscription/vault.  Do not send more than the subscription limit to the Key Vault service in a single Azure region.
1. Cache the secrets you retrieve from Azure Key Vault in memory, and reuse from memory whenever possible.  Re-read from Azure Key Vault only when the cached copy stops working (e.g. because it got rotated at the source). 
1. Key Vault is designed for your own services secrets.   If you are storing your customers' secrets (especially for high-throughput key storage scenarios), consider putting the keys in a database or storage account with encryption, and storing just the master key in Azure Key Vault.
1. Encrypt, wrap, and verify  public-key operations can be performed with no access to Key Vault, which not only reduces risk of throttling, but also improves reliability (as long as you properly cache the public key material).
1. If you use Key Vault to store credentials for a service, check if that service supports Azure AD Authentication to authenticate directly. This reduces the load on Key Vault, improves reliability and simplifies your code since Key Vault can now use the Azure AD token.  Many services have moved to using Azure AD Auth.  See the current list at [Services that support managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-managed-identities-for-azure-resources).
1. Consider staggering your load/deployment over a longer period of time to stay under the current RPS limits.
1. If your app comprises multiple nodes that need to read the same secret(s), then consider using a fan out pattern, where one entity reads the secret from Key Vault, and fans out to all nodes.   Cache the retrieved secrets only in memory.
If you find that the above still does not meet your needs, please fill out the below table and contact us to determine what additional capacity can be added (example put below for illustrative purposes only).

| Vault name | Vault Region | Object type (Secret, Key, or Cert) | Operation(s)* | Key Type | Key Length or Curve | HSM key?| Steady state RPS needed | Peak RPS needed |
|--|--|--|--|--|--|--|--|--|
| https://mykeyvault.vault.azure.net/ | | Key | Sign | EC | P-256 | No | 200 | 1000 |

\* For a full list of possible values, see [Azure Key Vault operations](/rest/api/keyvault/key-operations).

If additional capacity is approved, please note the following as result of the capacity increases:
1. Data consistency model changes. Once a vault is allow listed with additional throughput capacity, the Key Vault service data consistency guarantee changes (necessary to meet higher volume RPS since the underlying Azure Storage service cannot keep up).  In a nutshell:
  1. **Without allow listing**: The Key Vault service will reflect the results of a write operation (eg. SecretSet, CreateKey) immediately in subsequent calls (eg. SecretGet, KeySign).
  1. **With allow listing**: The Key Vault service will reflect the results of a write operation (eg. SecretSet, CreateKey) within 60 seconds in subsequent calls (eg. SecretGet, KeySign).
1. Client code must honor back-off policy for 429 retries. The client code calling the Key Vault service must not immediately retry Key Vault requests when it receives a 429 response code.  The Azure Key Vault throttling guidance published here recommends applying exponential backoff when receiving a 429 Http response code.

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
    var client = new SecretClient(new Uri("https://keyVaultName.vault.azure.net"), new DefaultAzureCredential(),options);
                                 
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

For a deeper orientation of throttling on the Microsoft Cloud, see [Throttling Pattern](/azure/architecture/patterns/throttling).
