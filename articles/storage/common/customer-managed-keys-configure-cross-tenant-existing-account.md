---
title: Configure cross-tenant customer-managed keys for an existing storage account
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys for an existing storage account by using the Azure portal, PowerShell, or Azure CLI. Customer-managed keys are stored in an Azure key vault.
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

# Configure cross-tenant customer-managed keys for an existing storage account

Intro

[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## See also

- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md)