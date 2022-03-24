---
title: Managed identities for applications in Azure Spring Cloud
titleSuffix: Azure Spring Cloud Enterprise Tier
description: Home page for managed identities for applications.
author: N.A.
ms.author: jiec
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/24/2022
ms.custom: devx-track-java, devx-track-azurecli
zone_pivot_groups: spring-cloud-tier-selection
---

# Managed identities for applications in Azure Spring Cloud

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use system-assigned and user-assigned managed identities for applications in Azure Spring Cloud.

Managed identities for Azure resources provide an automatically managed identity in Azure Active Directory to an Azure resource such as your application in Azure Spring Cloud. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

## Feature status

| System-assigned | User-assigned |
| -               | -             |
| GA              | Preview       |

## Manage managed identity for an application
- For system-assigned, see [How to enable and disable system-assigned managed identity](./how-to-enable-system-assigned-managed-identity.md).
- For user-assigned, see [How to assign and remove user-assigned managed identities](./how-to-manage-user-assigned-managed-identities.md).

## Obtain tokens for Azure resources

An app can use its managed identity to get tokens to access other resources protected by Azure Active Directory, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You may need to [configure the target resource to allow access from your application](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). For example, if you request a token to access Key Vault, make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support)

Azure Spring Cloud shares the same endpoint for token acquisition with Azure Virtual Machine. We recommend using Java SDK or spring boot starters to acquire a token.  See [How to use VM token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) for various code and script examples and guidance on important topics such as handling token expiration and HTTP errors.

## Samples of connecting Azure services in app code
| Azure service   | tutorial |
|-|-|
| Key Vault       | [Tutorial: Use a managed identity to connect Key Vault to an Azure Spring Cloud app](./tutorial-managed-identities-key-vault) |
| Azure Functions | [Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Cloud app](./tutorial-managed-identities-functions) |
| Azure SQL       | [Use a managed identity to connect Azure SQL Database to an Azure Spring Cloud app](./connect-managed-identity-to-azure-sql) |


## Best practise when use managed identities
### Use system-assigned or user-assigned separately
- It's highly recommended to use them separately unless you have a valid use case to use both types of identities at the same time.
- Failure might happen in the following scenario: If an app was using system-assigned managed identity and the app gets the token without specify the client ID of that identity. It works fine until one day, one or more user-assigned managed identities are assigned to that app, then app may fail to get the correct token.


## Limitations
### Max number of user-assigned managed identity per app
See managed-identity for app in [Quotas and Service Plans for Azure Spring Cloud](./quotas.md).

### Not supported Azure services
The reason is there are multiple versions of tokens, see [Microsoft identity platform access tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens), applications in Azure Spring Cloud don't support services which only accept token for v2.0 or higher. We're working on the adding support for such services.

- [Azure Databricks](https://docs.microsoft.com/en-us/azure/databricks/scenarios/what-is-azure-databricks)
---

## Concept mapping

| Managed Identity Scope | Azure Active Directory Scope |
|-|-|
| Principal ID | Object ID |
| Client ID | Appliction ID |


## Next steps

* [Access Azure Key Vault with managed identities in Spring boot starter](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/azure-spring-boot-starter-keyvault-secrets/README.md#use-msi--managed-identities)
* [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
* [How to use managed identities with Java SDK](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
