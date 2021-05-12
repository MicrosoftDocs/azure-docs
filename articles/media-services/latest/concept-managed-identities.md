---
title: Managed identities
description: Media Services can be used with Azure Managed Identities.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 05/11/2021
ms.author: inhenkel
---

# Managed identities

A common challenge for developers is the management of secrets and credentials to secure communication between different services. On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure Active Directory (Azure AD) tokens.

There are three scenarios where Managed Identities can be used with Media Services:

- Granting a Media Services account access to Key Vault to enable Customer Managed Keys
- Granting a Media Services account access to storage accounts to allow Media Services to bypass Azure Storage Network ACLs
- Allowing other services (for example, VMs or Azure Functions) to access Media Services

In the first two scenarios, the Managed Identity is used to grant the Media Services account access to other services.  In the third scenario, the service has a Managed Identity which is used to access Media Services.

:::image type="content" source="media/diagrams/managed-identities-scenario-comparison.svg" alt-text="Managed Identities Scenario Comparison":::

> [!NOTE]
> These scenarios can be combined. You could create Managed Identities for both the Media Services account (for example, to access customer managed keys) and the Azure Functions resource to access to Media Services account.

## Further reading

For more information about customer managed keys and Key Vault, see [Bring your own key (customer-managed keys) with Media Services](concept-use-customer-managed-keys-byok.md)

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).

## Tutorials and How Tos

These tutorials include both of the scenarios mentioned above.
- [CLI: Encrypt data into a Media Services account using a key in Key Vault](security-encrypt-data-managed-identity-how-to-cli.md)
<!-- - [CLI: Allow Media Services to access a storage account that is configured to block requests from unknown IP addresses]()
- [CLI: Use Azure Functions to access my Media Services account]()-->
- [PORTAL: Use the Azure portal to use customer-managed keys or BYOK with Media Services](security-customer-managed-keys-portal-tutorial.md)
- [POSTMAN/REST: Use customer-managed keys or BYOK with Media Services REST API](security-customer-managed-keys-rest-postman-tutorial.md).
