---
title: Prevent object replication across Azure Active Directory tenants
titleSuffix: Azure Storage
description: Prevent cross-tenant object replication
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/31/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Prevent object replication across Azure Active Directory tenants 

Object replication asynchronously copies block blobs from a container in one storage account to a container in another storage account. When you configure an object replication policy, you specify the source account and container and the destination account and container. After the policy is configured, Azure Storage automatically copies the results of create, update, and delete operations on a source object to the destination object. For more information about object replication in Azure Storage, see [Object replication for block blobs](object-replication-overview.md).

By default, an authorized user is permitted to configure an object replication policy where the source account is in one Azure Active Directory (Azure AD) tenant, and the destination account is in a different tenant. If your security policies require that you restrict object replication to storage accounts that reside within the same tenant only, you can disallow the creation of policies where the source and destination accounts are in different tenants.

This article describes how to use a DRAG (Detection-Remediation-Audit-Governance) framework to continuously manage whether cross-tenant object replication is permitted for your storage accounts.

For more information on how to configure object replication policies, see [Configure object replication for block blobs](object-replication-configure.md).

## Remediate cross-tenant object replication

To prevent object replication across Azure AD tenants, set the **AllowCrossTenantReplication** property for the storage account to **false**. If a storage account does not currently participate in any cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* prevents future configuration of cross-tenant object replication policies with this storage account as the source or destination. However, if a storage account currently participates in one or more cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* is not permitted.

The **AllowCrossTenantReplication** property is not set by default for a new storage account and does not return a value until you explicitly set it. The storage account can participate in object replication policies across tenants when the property value is **null** or when it is **true**.

# [Azure portal](#tab/portal)

To disallow cross-tenant object replication for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Allow shared key access** to **Disabled**.

    :::image type="content" source="media/shared-key-authorization-prevent/shared-key-access-portal.png" alt-text="Screenshot showing how to disallow Shared Key access for account":::

# [PowerShell](#tab/azure-powershell)

To disallow cross-tenant object replication for a storage account with PowerShell, install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 3.10.0??? or later. Next, configure the **AllowCrossTenantReplication** property for a new or existing storage account.

The following example shows how to disallow cross-tenant object replication for an existing storage account with PowerShell. Remember to replace the placeholder values in brackets with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -AllowCrossTenantReplication $false
```

# [Azure CLI](#tab/azure-cli)

To disallow cross-tenant object replication for a storage account with Azure CLI, install Azure CLI version 2.20.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowCrossTenantReplication** property for a new or existing storage account.

The following example shows how to disallow access with Shared Key for an existing storage account with Azure CLI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allow-cross-tenant-replication false
```

---

After you disallow cross-tenant replication, attempting to configure a cross-tenant policy with the storage account as the source or destination will fail with error code 403 (Forbidden). Azure Storage an returns error indicating that cross-tenant object replication is not permitted for the storage account.

The **AllowCrossTenantReplication** property is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).

## See also

- [Object replication for block blobs](object-replication-overview.md)
- [Configure object replication for block blobs](object-replication-configure.md)