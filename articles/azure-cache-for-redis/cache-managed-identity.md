---
title: Managed identity for storage accounts
description: Learn to Azure Cache for Redis
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2024
ms.topic: conceptual
ms.date: 04/21/2025
appliesto:
  - ✅ Azure Cache for Redis
---

# Managed identity for storage accounts

A [managed identity](/entra/identity/managed-identities-azure-resources/overview) helps Azure services connect to each other by making authentication more streamlined and secure. Instead of managing authorization between the services, a managed identity uses [Microsoft Entra ID](/entra/fundamentals/whatis) to provide authentication. This article describes how to use managed identity to connect Azure Cache for Redis caches to Azure Storage accounts.

A managed identity lets you simplify the process of securely connecting to an Azure Storage account for the following Azure Redis scenarios:

- [Data persistence](cache-how-to-premium-persistence.md) to back up the data in your cache.
- [Import or export](cache-how-to-import-export-data.md) to save snapshots of cache data or import data from a saved file.

>[!NOTE]
>Only the Azure Redis data persistence and import-export features use managed identity. These features are available only in Azure Redis Premium tier, so managed identity is available only in Azure Redis Premium tier.

Azure Cache for Redis supports both *system-assigned* and *user-assigned* managed identities. Each type of managed identity has advantages, but the functionality is the same in Azure Cache for Redis.

- **System-assigned identity** is specific to the cache resource. If the cache is deleted, the identity is deleted.
- **User-assigned identity** is specific to a user. You can assign this identity to any resource, such as a storage account, that supports managed identity. This assignment remains even if you delete the specific cache resource.

Configuring managed identity for Azure Redis Premium data persistence or import-export features consists of several parts:

- [Enable the managed identity](#enable-managed-identity) in the Azure Redis cache.
- [Configure the Azure Storage account](#configure-the-storage-account-to-use-managed-identity) to use the managed identity.
- Configure the [data persistence](#use-managed-identity-with-data-persistence) or [import-export](#use-managed-identity-to-import-and-export-cache-data) features to use the managed identity.

All the parts must be completed correctly before Azure Redis data persistence or import-export can access the storage account. Otherwise, you see errors or no data written.

## Scope of availability

|Tier     | Basic, Standard  | Premium  |Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Available  | Yes         | Yes        |  No  |

## Prerequisites

- Ability to create and configure a Premium-tier Azure Redis cache and an Azure Storage account in an Azure subscription.
- To assign a user-assigned managed identity: A [managed identity created](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) in the same Azure subscription as the Azure Redis cache and Storage account.

## Enable managed identity

You can enable managed identity for your Azure Redis cache by using the Azure portal, Azure CLI, or Azure PowerShell. You can enable managed identity when you create a cache instance, or afterwards.

### Enable managed identity in the Azure portal

During cache creation, you can assign only system-assigned managed identity. You can add either system-assigned or a user-assigned identity to an existing cache.

#### Create a new cache with managed identity

1. In the [Azure portal](https://portal.azure.com), choose to [create an Azure Cache for Redis cache](). On the **Basics** tab, select **Premium** for the **Cache SKU**, and complete the rest of the required information.

   :::image type="content" source="media/cache-managed-identity/basics.png" alt-text="Screenshot of creating a Premium cache.":::

1. Select the **Advanced** tab, and under **System assigned managed identity**, set **Status** to **On**.

   :::image type="content" source="media/cache-managed-identity/system-assigned.png" alt-text="Screenshot that shows setting System assigned managed identity to On.":::

1. Complete the cache creation process.

1. Once the cache is deployed, go to the cache page and select **Identity** under **Settings** in the left navigation menu. Verify that an **Object (principal) ID** appears on the **System assigned** tab of the **Identity** page.

   :::image type="content" source="media/cache-managed-identity/identity-resource.png" alt-text="Screenshot showing Identity in the Resource menu.":::
  
#### Add system-assigned identity to an existing cache

1. On the Azure portal page for your Azure Redis Premium cache, select **Identity** under **Settings** in the left navigation menu.

1. On the **System assigned** tab, set **Status** to **On**, and then select **Save**.

   :::image type="content" source="media/cache-managed-identity/identity-save.png" alt-text="Screenshot showing System Assigned selected and Status is on.":::

1. Respond **Yes** to the **Enable system assigned managed identity** prompt.

1. Once the identity is assigned, verify that an **Object (principal) ID** appears on the **System assigned** tab of the **Identity** page.

   :::image type="content" source="media/cache-managed-identity/identity-resource.png" alt-text="Screenshot showing the Object (principal) ID.":::

#### Add a user-assigned identity to an existing cache

1. On the Azure portal page for your Azure Redis Premium cache, select **Identity** under **Settings** in the left navigation menu.

1. Select the **User assigned** tab, and then select **Add**.

   :::image type="content" source="media/cache-managed-identity/identity-add.png" alt-text="User assigned identity status is on.":::

1. On the **Add user assigned managed identity** screen, select a managed identity from your subscription, and select **Add**. For more information on user assigned managed identities, see [manage user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

   :::image type="content" source="media/cache-managed-identity/choose-identity.png"  alt-text="Screenshot showing a user-assigned managed identity.":::

1. Once the user-assigned identity is added, verify that it appears on the **User assigned** tab of the **Identity** page.

   :::image type="content" source="media/cache-managed-identity/identity-list.png"  alt-text="Screenshot showing the user-assigned identity on the Identity page.":::

### Enable managed identity using Azure CLI

You can use the Azure CLI for creating a new cache with managed identity by using [az redis create](/cli/azure/redis?view=azure-cli-latest.md&preserve-view=true). You can update an existing cache to use managed identity by using [az redis identity](/cli/azure/redis/identity?view=azure-cli-latest&preserve-view=true).

For example, to update a cache to use system-managed identity, use the following Azure CLI command:

```azurecli-interactive

az redis identity assign \--mi-system-assigned \--name MyCacheName \--resource-group MyResource Group
```

### Enable managed identity using Azure PowerShell

You can use Azure PowerShell for creating a new cache with managed identity by using [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache). You can update an existing cache to use managed identity by using [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache).

For example, to update a cache to use system-managed identity, use the following Azure PowerShell command:

```powershell-interactive
Set-AzRedisCache -ResourceGroupName \"MyGroup\" -Name \"MyCache\" -IdentityType "SystemAssigned"
```

## Configure the storage account to use managed identity

1. In the Azure portal, create a new storage account or open an existing storage account that you want to connect to your cache instance.

1. Select **Access control (IAM)** from the left navigation menu.

1. On the **Access control (IAM)** page, select **Add** > **Add role assignment**.

   :::image type="content" source="media/cache-managed-identity/demo-storage.png"  alt-text="Screenshot showing the Access Control (IAM) settings.":::

1. On the **Role** tab of the **Add Role Assignment** page, search for and select **Storage Blob Data Contributor**, and then select **Next**.

   :::image type="content" source="media/cache-managed-identity/role-assignment.png"  alt-text="Screenshot showing Add role assignment form with list of roles.":::

1. On the **Members** tab, for **Assign access to**, select **Managed Identity**, and then select **Select members**.

   :::image type="content" source="media/cache-managed-identity/select-members.png"  alt-text="Screenshot showing add role assignment form with members pane.":::

1. In the **Select managed identities** pane, select the dropdown arrow under **Managed identity** to see all your available user-assigned and system-assigned managed identities. If you have many managed identities, you can search for the one you want. Choose the managed identities you want, and then select **Select**.

   :::image type="content" source="media/cache-managed-identity/user-assigned.png"  alt-text="Screenshot showing add Select managed identities pane.":::

1. On the **Add role assignment** page, select **Review + assign**, and then select **Review + assign** again to confirm.

   :::image type="content" source="media/cache-managed-identity/review-assign.png"  alt-text="Screenshot showing Managed Identity form with managed identities assigned.":::

1. On the storage account's **Access control (IAM)** page, select **View** under **View access to this resource**, and then search for **Storage Blob Data Contributor** on the **Role Assignments** tab to verify that the managed identities are added.

   :::image type="content" source="media/cache-managed-identity/blob-data.png"  alt-text="Screenshot of Storage Blob Data Contributor list.":::

>[!IMPORTANT]
>For export to work with a storage account with firewall exceptions, you must:
>
>- Add the Azure Redis cache as a **Storage Blob Data Contributor** through system-assigned identity, and
>- On the storage account **Networking** page, select [Allow Azure services on the trusted services list to access this storage account](/azure/storage/common/storage-network-security#grant-access-to-trusted-azure-services).
>
>If you don't use managed identity and instead authorize a storage account with a key, having firewall exceptions on the storage account breaks the persistence process and the import-export processes.

## Use managed identity with data persistence

1. On the Azure portal page for your Azure Redis Premium cache that has the **Storage Blob Data Contributor** role, select **Data persistence** under **Settings** in the left navigation menu.

1. Ensure that **Authentication Method** is set to **Managed Identity**.

   >[!IMPORTANT]
   >The selection defaults to the system-assigned identity if enabled. Otherwise, it uses the first listed user-assigned identity.

1. Under **Storage Account**, select the storage account you configured to use managed identity, if not already selected, and select **Save** if necessary.

   :::image type="content" source="media/cache-managed-identity/data-persistence.png"  alt-text="Screenshot showing data persistence pane with authentication method selected.":::

You can now save data persistence backups to the storage account using managed identity authentication.

## Use managed identity to import and export cache data

1. On the Azure portal page for your Azure Redis Premium cache that has the **Storage Blob Data Contributor** role, select **Import data** or **Export data** under **Administration** in the left navigation menu.
1. On the **Import data** or **Export data** screen, select **Managed Identity** for **Authentication Method**.

1. To import data, on the **Import data** screen, select **Choose Blob(s)** next to **RDB File(s)**. Select your Redis Database (RDB) file or files from the blob storage location, and select **Select**.

1. To export data, on the **Export data** screen, enter a **Blob name prefix**, and then select **Choose Storage Container** next to **Export output**. Select or create a container to hold the exported data, and select **Select**.

   :::image type="content" source="media/cache-managed-identity/export-data.png"  alt-text="Screenshot showing Managed Identity selected.":::

1. On the **Import data** or **Export data** screen, select **Import** or **Export** respectively.

   >[!NOTE]
   >It takes a few minutes to import or export the data.

>[!IMPORTANT]
>If you see an export or import failure, double check that your storage account has been configured with your cache's system-assigned or user-assigned identity. The identity used defaults to system-assigned identity if enabled. Otherwise, it uses the first listed user-assigned identity.

## Related content

- [Learn more](cache-overview.md#service-tiers) about Azure Cache for Redis features.
- [What are managed identities?](/entra/identity/managed-identities-azure-resources/overview)
