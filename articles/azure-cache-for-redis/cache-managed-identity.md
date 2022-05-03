---
title: Managed identity for storage accounts
titleSuffix: Azure Cache for Redis
description: Learn to Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 03/10/2022
ms.author: franlanglois

---

# Managed identity for storage (Preview)

[Managed identities](../active-directory/managed-identities-azure-resources/overview.md) are a common tool used in Azure to help developers minimize the burden of managing secrets and login information. Managed identities are useful when Azure services connect to each other. Instead of managing authorization between each service, [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) can be used to provide a managed identity that makes the authentication process more streamlined and secure.

## Use managed identity with storage accounts

Presently, Azure Cache for Redis can use a managed identity to connect with a storage account, useful in two scenarios:

- [Data Persistence](cache-how-to-premium-persistence.md)--scheduled backups of data in your cache through an RDB or AOF file.

- [Import or Export](cache-how-to-import-export-data.md)--saving snapshots of cache data or importing data from a saved file.

Managed identity lets you simplify the process of securely connecting to your chosen storage account for these tasks.

   > [!NOTE]
   > This functionality does not yet support authentication for connecting to a cache instance.
   >

Azure Cache for Redis supports [both types of managed identity](../active-directory/managed-identities-azure-resources/overview.md):

- **System-assigned identity** is specific to the resource. In this case, the cache is the resource. When the cache is deleted, the identity is deleted.

- **User-assigned identity** is specific to a user, not the resource. It can be assigned to any resource that supports managed identity and remains even when you delete the cache.

Each type of managed identity has advantages, but in Azure Cache for Redis, the functionality is the same.

### Enable managed identity

Managed identity can be enabled either when you create a cache instance or after the cache has been created. During the creation of a cache, only a system-assigned identity can be assigned. Either identity type can be added to an existing cache.

### Prerequisites and limitations

To use managed identity, you must have a premium-tier cache.

## Create a new cache with managed identity using the portal

1. Sign into the [Azure portal](https://portal.azure.com/)

1. Create a new Azure Cache for Redis resource with a **Cache type** of any of the premium tiers. Complete **Basics** tab with all the required  information.
   > [!NOTE]
   > Managed identity functionality is only available in the Premium tier.
   >
   :::image type="content" source="media/cache-managed-identity/basics.png" alt-text="create a premium azure cache":::

1. Click the **Advanced** tab. Then, scroll down to **(PREVIEW) System assigned managed identity** and select **On**.

   :::image type="content" source="media/cache-managed-identity/system-assigned.png" alt-text="Advanced page of the form":::

1. Complete the creation process. Once the cache has been created and deployed, open it, and select the **(PREVIEW) Identity** tab under the **Settings** section on the left.

   :::image type="content" source="media/cache-managed-identity/identity-resource.png" alt-text="(Preview) Identity in the Resource menu":::
  
1. You see that a system-assigned **object ID** has been assigned to the cache **Identity**.
  
   :::image type="content" source="media/cache-managed-identity/user-assigned.png" alt-text="System assigned resource settings for identity":::

## Add system assigned identity to an existing cache

1. Navigate to your Azure Cache for Redis resource from the Azure portal. Select **(PREVIEW) Identity**  from the Resource menu on the left.
   > [!NOTE]
   > Managed identity functionality is only available in the Premium tier.
   >

1. To enable a system-assigned identity, select the **System assigned (preview)** tab, and select **On** under **Status**. Select **Save** to confirm.

   :::image type="content" source="media/cache-managed-identity/identity-save.png" alt-text="System assigned identity status is on":::

1. A dialog pops up saying that your cache will be registered with Azure Active Directory and that it can be granted permissions to access resources protected by Azure AD. Select **Yes**.

1. You see an **Object (principal) ID**, indicating that the identity has been assigned.

   :::image type="content" source="media/cache-managed-identity/user-assigned.png" alt-text="new Object principal ID shown for system assigned identity":::

## Add a user assigned identity to an existing cache

1. Navigate to your Azure Cache for Redis resource from the Azure portal. Select **(PREVIEW) Identity**  from the Resource menu on the left.
   > [!NOTE]
   > Managed identity functionality is only available in the Premium tier.
   >

1. To enable user assigned identity, select the **User assigned (preview)** tab and select **Add**.

   :::image type="content" source="media/cache-managed-identity/identity-add.png" alt-text="User assigned identity status is on":::

1. A sidebar pops up to allow you to select any available user-assigned identity to your subscription. Choose an identity and select **Add**. For more information on user assigned managed identities, see [manage user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).
   >[!Note]
   >You need to [create a user assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) in advance of this step.
   >
   :::image type="content" source="media/cache-managed-identity/choose-identity.png"  alt-text="new Object principal ID shown for user assigned identity":::

1. You see the user-assigned identity listed in the **User assigned (preview)** pane.

   :::image type="content" source="media/cache-managed-identity/identity-list.png"  alt-text="list of identity names":::

## Enable managed identity using the Azure CLI

Use the Azure CLI for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [az redis create](/cli/azure/redis?view=azure-cli-latest.md) or [az redis identity](/cli/azure/redis/identity?view=azure-cli-latest).

For example, to update a cache to use system-managed identity use the following CLI command:

```azurecli-interactive

az redis identity assign \--mi-system-assigned \--name MyCacheName \--resource-group MyResource Group
```

## Enable managed identity using Azure PowerShell

Use Azure PowerShell for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache?view=azps-7.1.0) or [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache?view=azps-7.1.0).

For example, to update a cache to use system-managed identity, use the following PowerShell command:

```powershell-interactive
Set-AzRedisCache -ResourceGroupName \"MyGroup\" -Name \"MyCache\" -IdentityType "SystemAssigned"
```

## Configure storage account to use managed identity

> [!IMPORTANT]
> Managed identity must be configured in the storage account before Azure Cache for Redis can access the account for persistence or import/export functionality. If this step is not done correctly, you see errors or no data written.

1. Create a new storage account or open an existing storage account that you would like to connect to your cache instance.

2. Open the **Access control (IAM)** from the Resource menu. Then, select **Add**, and **Add role assignment**.

   :::image type="content" source="media/cache-managed-identity/demo-storage.png"  alt-text="access control (iam) settings":::

3. Search for the **Storage Blob Data Contributor** on the Role pane. Select it and **Next**.

   :::image type="content" source="media/cache-managed-identity/role-assignment.png"  alt-text="add role assignment form with list of roles":::

4. Select the **Members** tab. Under **Assign access to** select **Managed Identity**, and select on **Select members**. A sidebar pops up on the right.

   :::image type="content" source="media/cache-managed-identity/select-members.png"  alt-text="add role assignment form with members pane":::

5. Use the drop-down under **Managed Identity** to choose either a **User-assigned managed identity** or a **System-assigned managed identity**. If you have many managed identities, you can search by name. Choose the managed identities you want and then **Select**. Then, **Review + assign** to confirm.

   :::image type="content" source="media/cache-managed-identity/review-assign.png"  alt-text="select managed identities form pop up":::

6. You can confirm if the identity has been assigned successfully by checking your storage account's role assignments under **Storage Blob Data Contributor**.

   :::image type="content" source="media/cache-managed-identity/blob-data.png"  alt-text="storag blob data contributor list":::

> [!NOTE]
> Adding an Azure Cache for Redis instance as a storage blog data contributor through system-assigned identity will conveniently add the cache instance to the [trusted services list](../storage/common/storage-network-security.md?tabs=azure-portal), making firewall exceptions easier to implement.

## Use managed identity to access a storage account

### Use managed identity with data persistence

1. Open the Azure Cache for Redis instance that has been assigned the Storage Blob Data Contributor role and go to the **Data persistence** on the Resource menu.

2. Change the **Authentication Method** to **(PREVIEW) Managed Identity** and select the storage account you configured above. select **Save**.

   :::image type="content" source="media/cache-managed-identity/data-persistence.png"  alt-text="data persistence pane with authentication method selected":::

   > [!IMPORTANT]
   > The identity defaults to the system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity is used.
   >

3. Data persistence backups can now be saved to the storage account using managed identity authentication.

   :::image type="content" source="media/cache-managed-identity/redis-persistence.png"  alt-text="export data in resource menu":::

### Use managed identity to import and export cache data

1. Open your Azure Cache for Redis instance that has been assigned the Storage Blob Data Contributor role and go to the **Import** or **Export** tab under **Administration**.

2. If importing data, choose the blob storage location that holds your chosen RDB file. If exporting data, type your desired blob name prefix and storage container. In both situations, you must use the storage account you've configured for managed identity access.

   :::image type="content" source="media/cache-managed-identity/export-data.png"  alt-text="export data from the resource menu":::

3. Under **Authentication Method**, choose **(PREVIEW) Managed Identity** and select **Import** or **Export**, respectively.

> [!NOTE]
> It will take a few minutes to import or export the data.
>

> [!IMPORTANt]
>If you see an export or import failure, double check that your storage account has been configured with your cache's system-assigned or user-assigned identity. The identity used will default to system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity is used.

## Next steps

- [Learn more](cache-overview.md#service-tiers) about Azure Cache for Redis features
- [What are managed identifies](../active-directory/managed-identities-azure-resources/overview.md)
