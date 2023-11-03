---
title: Managed identities for applications in Azure Spring Apps
titleSuffix: Azure Spring Apps Enterprise plan
description: Home page for managed identities for applications.
author: KarlErickson
ms.author: jiec
ms.service: spring-apps
ms.topic: how-to
ms.date: 04/15/2022
ms.custom: devx-track-java, event-tier1-build-2022, ignite-2022
zone_pivot_groups: spring-apps-tier-selection
---

# Use managed identities for applications in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use system-assigned and user-assigned managed identities for applications in Azure Spring Apps.

Managed identities for Azure resources provide an automatically managed identity in Microsoft Entra ID to an Azure resource such as your application in Azure Spring Apps. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

## Feature status

| System-assigned | User-assigned |
| -               | -             |
| GA              | GA            |

## Manage managed identity for an application

For system-assigned managed identities, see [How to enable and disable system-assigned managed identity](./how-to-enable-system-assigned-managed-identity.md).

For user-assigned managed identities, see [How to assign and remove user-assigned managed identities](./how-to-manage-user-assigned-managed-identities.md).

## Obtain tokens for Azure resources

An application can use its managed identity to get tokens to access other resources protected by Microsoft Entra ID, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You can configure the target resource to allow access from your application. For more information, see [Assign a managed identity access to a resource by using the Azure portal](/entra/identity/managed-identities-azure-resources/howto-assign-access-portal). For example, if you request a token to access Key Vault, be sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Microsoft Entra tokens, see [Azure services that support Microsoft Entra authentication](/entra/identity/managed-identities-azure-resources/services-id-authentication-support.

Azure Spring Apps shares the same endpoint for token acquisition with Azure Virtual Machines. We recommend using Java SDK or Spring Boot starters to acquire a token. For various code and script examples, as well as guidance on important topics like handling token expiration and HTTP errors, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

## Examples of connecting Azure services in application code

The following table provides links to articles that contain examples:

| Azure service   | tutorial                                                                                                                              |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Key Vault       | [Tutorial: Use a managed identity to connect Key Vault to an Azure Spring Apps app](tutorial-managed-identities-key-vault.md)        |
| Azure Functions | [Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Apps app](tutorial-managed-identities-functions.md) |
| Azure SQL       | [Use a managed identity to connect Azure SQL Database to an Azure Spring Apps app](connect-managed-identity-to-azure-sql.md)         |

## Best practices when using managed identities

We highly recommend that you use system-assigned and user-assigned managed identities separately unless you have a valid use case. If you use both kinds of managed identity together, failure might happen if an application is using system-assigned managed identity and the application gets the token without specifying the client ID of that identity. This scenario might work fine until one or more user-assigned managed identities are assigned to that application, then the application might fail to get the correct token.

## Limitations

### Maximum number of user-assigned managed identities per application

For the maximum number of user-assigned managed identities per application, see [Quotas and Service Plans for Azure Spring Apps](./quotas.md).

---

## Concept mapping

The following table shows the mappings between concepts in Managed Identity scope and Microsoft Entra scope:

| Managed Identity scope | Microsoft Entra scope |
|------------------------|----------------|
| Principal ID           | Object ID      |
| Client ID              | Application ID |

## Next steps

- [Learn more about managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)
- [How to use managed identities with Java SDK](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
