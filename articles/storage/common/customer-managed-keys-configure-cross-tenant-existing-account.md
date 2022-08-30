---
title: Configure cross-tenant customer-managed keys for an existing storage account (preview)
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys in an Azure key vault that resides in a different tenant than the tenant where the storage account resides (preview). Customer-managed keys allow a service provider to encrypt the customer's data using an encryption key that is managed by the service provider's customer and that is not accessible to the service provider.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/29/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure cross-tenant customer-managed keys for an existing storage account (preview)

Intro

> [!IMPORTANT]
> Using cross-tenant customer-managed keys with Azure Storage encryption is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## See also

- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md)