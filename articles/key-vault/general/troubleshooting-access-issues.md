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

After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. You can do monitoring by enabling logging for Azure Key Vault, for step-by-step guide to enable logging, [read more](https://docs.microsoft.com/azure/key-vault/general/logging).

### How can I monitor vault availability, service latency periods or other performance metrics for key vault?

As you start to scale your service, the number of requests sent to your key vault will rise. Such demand has a potential to increase the latency of your requests and in extreme cases, cause your requests to be throttled which will impact the performance of your service. You can monitor key vault performance metrics and get alerted for specific thresholds, for step-by-step guide to configure monitoring, [read more](https://docs.microsoft.com/azure/key-vault/general/alert).

### I am not able to modify access policy, how can it be enabled?
The user needs to have sufficient AAD permissions to modify access policy. In this case, the user would need to have higher contributor role.

### I am seeing 'Unkwown Policy' error. What does that mean?
There are two different possibilities of seeing access policy in Unknown section:
* There might be a previous user who had access and for some reason that user does not exist.
* If access policy is added via powershell and the access policy is added for the application objectid instead of the service priciple

### How can I assign access control per key vault object? 

Per-secret/key/certificate access control feature's availability will be notified here, [read more](https://feedback.azure.com/forums/906355-azure-key-vault/suggestions/32213176-per-secret-key-certificate-access-control)

### How can I provide key vault authenticate using access control policy?

The simplest way to authenticate a cloud-based application to Key Vault is with a managed identity; see [Authenticate to Azure Key Vault](authentication.md) for details.
If you are creating an on-prem application, doing local development, or otherwise unable to use a managed identity, you can instead register a service principal manually and provide access to your key vault using an access control policy. See [Assign an access control policy](assign-access-policy-portal.md).

### How can I give the AD group access to the key vault?

Give the AD group permissions to your key vault using the Azure CLI `az keyvault set-policy` command, or the Azure PowerShell Set-AzKeyVaultAccessPolicy cmdlet. See [Assign an access policy - CLI](assign-access-policy-cli.md) and [Assign an access policy - PowerShell](assign-access-policy-powershell.md).

The application also needs at least one Identity and Access Management (IAM) role assigned to the key vault. Otherwise it will not be able to login and will fail with insufficient rights to access the subscription. Azure AD Groups with Managed Identities may require up to eight hours to refresh tokens and become effective.

### How can I redeploy Key Vault with ARM template without deleting existing access policies?

Currently Key Vault redeployment deletes any access policy in Key Vault and replace them with access policy in ARM template. There is no incremental option for Key Vault access policies. To preserve access policies in Key Vault, you need to read existing access policies in Key Vault and populate ARM template with those policies to avoid any access outages.

Another option that can help for this scenario is using RBAC roles as an alternative to access policies. With RBAC, you can re-deploy the key vault without specifying the policy again. You can read more this solution [here](https://docs.microsoft.com/azure/key-vault/general/rbac-guide).

Another option that can help for this scenario is using RBAC roles as an alternative to access policies. With RBAC, you can re-deploy the key vault without specifying the policy again. You can read more this solution [here](https://docs.microsoft.com/azure/key-vault/general/rbac-guide).

### Recommended troubleshooting Steps for following error types

* HTTP 401: Unauthenticated Request - [Troubleshooting steps](rest-error-codes.md#http-401-unauthenticated-request)
* HTTP 403: Insufficient Permissions - [Troubleshooting steps](rest-error-codes.md#http-403-insufficient-permissions)
* HTTP 429: Too Many Requests - [Troubleshooting steps](rest-error-codes.md#http-429-too-many-requests)
* Check if you have delete access permission to key vault: See [Assign an access policy - CLI](assign-access-policy-cli.md), [Assign an access policy - PowerShell](assign-access-policy-powershell.md), or [Assign an access policy - Portal](assign-access-policy-portal.md).
* If you have problem with authenticate to key vault in code, use [Authentication SDK](https://azure.github.io/azure-sdk/posts/2020-02-25/defaultazurecredentials.html)

### What are the best practices I should implement when key vault is getting throttled?
Follow the best practices, documented [here](overview-throttling.md#how-to-throttle-your-app-in-response-to-service-limits)

## Next Steps

Learn how to troubleshoot key vault authentication errors: [Key Vault Troubleshooting Guide](rest-error-codes.md).
