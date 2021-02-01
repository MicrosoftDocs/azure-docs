---
title: Trusted storage for Media Services
description: Managed Identities authentication allows Media Services to access the storage account that has been configured with a firewall or a VNet restriction through trusted storage access.
keywords: trusted storage, managed identities
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 1/29/2020
ms.author: inhenkel
---

# Trusted storage for Media Services

When you create a Media Services account, you must associate it with a storage account. Media Services can access that storage account using system authentication. Media Services validates that the Media Services account and the storage account are in the same subscription and it validates that the user adding the association has access the storage account with Azure Resource Manager RBAC.

However, if you want to use a firewall to secure your storage account and enable trusted storage, you must use [Managed Identities](concept-managed-identities.md) authentication. It allows Media Services to access the storage account that has been configured with a firewall or a VNet restriction through trusted storage access.

To understand the methods of creating trusted storage with Managed Identities, read [Managed Identities and Media Services](concept-managed-identities.md).

For more information about customer managed keys and Key Vault, see [Bring your own key (customer-managed keys) with Media Services](concept-use-customer-managed-keys-byok.md)

For more information about Trusted Microsoft Services, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md#trusted-microsoft-services).

## Tutorials

These tutorials include both of the scenarios mentioned above.

- [Use the Azure portal to use customer-managed keys or BYOK with Media Services](tutorial-byok-portal.md)
- [Use customer-managed keys or BYOK with Media Services REST API](tutorial-byok-postman.md).

## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).