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

When you create a Media Services account, you must associate it with a storage account. Media Services can access that storage account using system authentication or Managed Identity authentication. Media Services validates that the Media Services account and the storage account are in the same subscription and it validates that the user adding the association has access the storage account with Azure Resource Manager RBAC.

>[!NOTE]
>Trusted storage is only available in the API, and is not currently enabled in the Azure portal.

## Trusted storage with a firewall

However, if you want to use a firewall to secure your storage account and enable trusted storage, [Managed Identities](concept-managed-identities.md) authentication is the preferred option. It allows Media Services to access the storage account that has been configured with a firewall or a VNet restriction through trusted storage access.

## Tutorial

You can learn more about enabling trusted storage with the [Media Services trusted storage](security-trusted-storage-rest-tutorial.md) tutorial.

> [!NOTE]
> You need to grant the AMS Managed Identity Storage Blob Data Contributor access in order for Media Services to be able to read and write to the storage account.  Granting the generic Contributor role won’t work as it doesn’t enable the correct permissions on the data plane.

## Further reading

To understand the methods of creating trusted storage with Managed Identities, read [Managed Identities and Media Services](concept-managed-identities.md).

For more information about Trusted Microsoft Services, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md#trusted-microsoft-services).

## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).
