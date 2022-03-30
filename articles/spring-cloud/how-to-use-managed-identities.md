---
title: Managed identities for applications in Azure Spring Cloud
titleSuffix: Azure Spring Cloud Enterprise Tier
description: Home page for managed identities for applications.
author: karlerickson
ms.author: jiec
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/31/2022
ms.custom: devx-track-java, devx-track-azurecli
zone_pivot_groups: spring-cloud-tier-selection
---

# Use managed identities for applications in Azure Spring Cloud

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use system-assigned and user-assigned managed identities for applications in Azure Spring Cloud.

Managed identities for Azure resources provide an automatically managed identity in Azure Active Directory (Azure AD) to an Azure resource such as your application in Azure Spring Cloud. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

## Feature status

| System-assigned | User-assigned |
| -               | -             |
| GA              | Preview       |

## Manage managed identity for an application

For system-assigned managed identities, see [How to enable and disable system-assigned managed identity](./how-to-enable-system-assigned-managed-identity.md).

For user-assigned managed identities, see [How to assign and remove user-assigned managed identities](./how-to-manage-user-assigned-managed-identities.md).

## Obtain tokens for Azure resources

An application can use its managed identity to get tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You may need to configure the target resource to allow access from your application. For more information, see [Assign a managed identity access to a resource by using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). For example, if you request a token to access Key Vault, be sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support.md).

Azure Spring Cloud shares the same endpoint for token acquisition with Azure Virtual Machines. We recommend using Java SDK or Spring Boot starters to acquire a token. For various code and script examples and guidance on important topics such as handling token expiration and HTTP errors, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

## Examples of connecting Azure services in application code

The following table provides links to articles that contain examples:

| Azure service   | tutorial                                                                                                                             |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Key Vault       | [Tutorial: Use a managed identity to connect Key Vault to an Azure Spring Cloud app](./tutorial-managed-identities-key-vault)        |
| Azure Functions | [Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Cloud app](./tutorial-managed-identities-functions) |
| Azure SQL       | [Use a managed identity to connect Azure SQL Database to an Azure Spring Cloud app](./connect-managed-identity-to-azure-sql)         |

## Best practices when using managed identities

We highly recommend that you use system-assigned and user-assigned managed identities separately unless you have a valid use case. If you use both kinds of managed identity together, failure might happen if an application is using system-assigned managed identity and the application gets the token without specifying the client ID of that identity. This scenario may work fine until one or more user-assigned managed identities are assigned to that application, then the application may fail to get the correct token.

## Limitations

### Maximum number of user-assigned managed identities per application

For the maximum number of user-assigned managed identities per application, see [Quotas and Service Plans for Azure Spring Cloud](./quotas.md).

### Not supported Azure services

The reason is there are multiple versions of tokens, see [Microsoft identity platform access tokens](../active-directory/develop/access-tokens.md), applications in Azure Spring Cloud don't support services which only accept tokens for v2.0 or higher. We're working on the adding support for such services.

- [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks)

---

## Concept mapping

The following table shows the mappings between concepts in Managed Identity scope and Azure AD scope:

| Managed Identity scope | Azure AD scope |
|------------------------|----------------|
| Principal ID           | Object ID      |
| Client ID              | Application ID |

## Next steps

- [Access Azure Key Vault with managed identities in Spring boot starter](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/azure-spring-boot-starter-keyvault-secrets/README.md#use-msi--managed-identities)
- [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
- [How to use managed identities with Java SDK](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
