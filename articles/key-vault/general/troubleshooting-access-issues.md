---
title: Troubleshooting Azure key vault access policy issues
description: Troubleshooting Azure key vault access policy issues
author: sebansal
ms.author: sebansal
ms.date: 08/10/2020
ms.service: key-vault
ms.subservice: general
ms.topic: how-to

---
# Troubleshooting Azure key vault access policy issues

## Frequently asked questions

### How can I identify how and when key vaults are accessed?
After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. You can do this by enabling logging for Azure Key Vault, for step-by-step guide to enable logging, [read more](https://docs.microsoft.com/azure/key-vault/general/logging).

### How can I monitor vault availability, service latency periods or other performance metrics for key vault?
As you start to scale your service the number of requests sent to your key vault will rise. This has a potential to increase the latency of your requests and in extreme cases, cause your requests to be throttled which will impact the performance of your service. You can monitor key vault performance metrics and get alerted for specific thresholds, for step-by-step guide to configure monitoring, [read more](https://docs.microsoft.com/azure/key-vault/general/alert).

### How can I assign access control per key vault object? 
Per-secret/key/certificate access control feature's availability will be notified here, [read more](https://feedback.azure.com/forums/906355-azure-key-vault/suggestions/32213176-per-secret-key-certificate-access-control)

### How can I provide key vault authenticate using access control policy?
The simplest way to authenticate a cloud-based application to Key Vault is with a managed identity; see [use an App Service managed identity to access Azure Key Vault]( https://docs.microsoft.com/azure/key-vault/general/managed-identity) for details.
If you are creating an on-prem application, doing local development, or otherwise unable to use a managed identity, you can instead register a service principal manually and provide access to your key vault using an access control policy, [read more](https://docs.microsoft.com/azure/key-vault/general/group-permissions-for-apps).


### How can I give the AD group access to the key vault?
Give the AD group permissions to your key vault using the Azure CLI az keyvault set-policy command, or the Azure PowerShell Set-AzKeyVaultAccessPolicy cmdlet. For examples, review [give the application, Azure AD group, or user access to your key vault](https://docs.microsoft.com/azure/key-vault/general/group-permissions-for-apps#give-the-principal-access-to-your-key-vault).

The application also needs at least one Identity and Access Management (IAM) role assigned to the key vault. Otherwise it will not be able to login and will fail with insufficient rights to access the subscription. Azure AD Groups with Managed Identities may require up to 8hr to refresh token and become effective.

### How can I redeploy Key Vault with ARM template without deleting existing access policies?
Currently Key Vault ARM redopleyment will delete any access policy in Key Vault and replace them with access policy in ARM template. There is no incremental option for Key Vault access policies. To preserve access policies in Key Vault you need read existing access policies in Key Vault and populate ARM template with those policies to avoid any access outages.

### Recommended troubleshooting Steps for following error types
* HTTP 401: Unauthenticated Request - [Troubleshooting steps](https://docs.microsoft.com/azure/key-vault/general/rest-error-codes#http-401-unauthenticated-request)
* HTTP 403: Insufficient Permissions - [Troubleshooting steps](https://docs.microsoft.com/azure/key-vault/general/rest-error-codes#http-403-insufficient-permissions)
* HTTP 429: Too Many Requests - [Troubleshooting steps](https://docs.microsoft.com/azure/key-vault/general/rest-error-codes#http-429-too-many-requests)
* Check if you have delete access permission to key vault: [Key Vault Access Policies](https://docs.microsoft.com/azure/key-vault/general/group-permissions-for-apps)
* If you have problem with authenticate to key vault in code, use [Authentication SDK](https://azure.github.io/azure-sdk/posts/2020-02-25/defaultazurecredentials.html)

### What are the best practices I should implement when key vault is getting throttled?
Follow the best practices, documented [here](https://docs.microsoft.com/azure/key-vault/general/overview-throttling#how-to-throttle-your-app-in-response-to-service-limits)

## Next Steps

Learn how to troubleshoot key vault authentication errors. [Key Vault Troubleshooting Guide](https://docs.microsoft.com/azure/key-vault/general/rest-error-codes)
