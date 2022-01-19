---
title: Managed Identity
titleSuffix: Azure Cache for Redis
description: Learn to Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: franlanglois
---

# Managed identity with Azure Cache for Redis (Preview)

[Managed identities](/azure/active-directory/managed-identities-azure-resources/overview) are a common tool used in Azure to help developers minimize the burden of managing secrets and login information. This is particularly useful when Azure services connect to each other. Instead of managing authorization between each service, [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) can be used to provide a managed identity that makes the authentication process more streamlined and secure.

## Managed identity with storage accounts

<!-- Can't repeat the same heading -->

Azure Cache for Redis can use managed identity to connect with a storage account. This is useful in two scenarios:

- [Data Persistence](cache-how-to-premium-persistence.md) -- scheduled backups of data in your cache through a RDB or AOF file.

- [Import or Export](cache-how-to-import-export-data.md) -- saving snapshots of cache data or importing data from a saved file.

By using managed identity functionality, the process of securely connecting to your chosen storage account for these tasks can be simplified.

   > [!NOTE]
   > This functionality does not yet support authentication for connecting to a cache instance.
   >

Azure Cache for Redis supports [both types of managed identity](/azure/active-directory/managed-identities-azure-resources/overview):

- **System-assigned identity** is specific to the resource. In this case, the cache is the resource. When the cache is deleted, the identity is deleted.

- **User-assigned identity** is specific to a user, not the resource. It can be assigned to any resource that supports managed identity and remains even when you delete the cache.

Each type of managed identity has advantages, but the end functionality in Azure Cache for Redis is the same.
<!-- not sure what this means -->

### Prerequisites & Limitations

To use managed identity, you must have a premium-tier cache.
<!-- maybe we could be consistent with references to Premium tier. -->

## Enable managed identity

Managed identity can be enabled either when you create a cache instance or after the cache has been created. During the creation of a cache, only a system-assigned identity can be assigned. Either identity type can be added to an existing cache.

### Create a new cache with managed identity using the portal

<!-- we might want to use an include file if this is the same as other places -->

1. Sign into the [Azure portal](https://portal.azure.com/)

2. Create a new Azure Cache for Redis instance and fill out the basic information.

   :::image type="content" source="media/cache-managed-identity/basics.png" alt-text="alt text 1":::

   > [!NOTE]
   > Managed identity functionality is only available in the Premium tier.
   >

3. In the **advanced** tab, scroll down to the section titled **(PREVIEW) System assigned managed identity** and select **On**.

   :::image type="content" source="media/cache-managed-identity/system-assigned.png" alt-text="alt text 3":::

4. Complete the creation process. Once the cache has been created, open it, and select the **(PREVIEW) Identity** tab under the **Settings** section on the left.

  :::image type="content" source="media/cache-managed-identity/identity-resource.png" alt-text="alt text 4":::
  
5. You see that a **system-assigned** **identity** has been assigned to the cache instance.
  
  :::image type="content" source="media/cache-managed-identity/user-assigned.png" alt-text="alt text 5":::

### Update an existing cache to use managed identity using the portal

1. Sign into the [Azure portal](https://portal.azure.com/).

2. Navigate to your Azure Cache for Redis account. Open the **(PREVIEW) Identity** tab under the **Settings** section on the left.

  :::image type="content" source="media/cache-managed-identity/identity-resource.png" alt-text="alt text 4b":::

>[!NOTE]
>Managed identity functionality is only available in the Premium tier.

#### System Assigned Identity

1. To enable **system-assigned identity**, select the **System assigned (preview)** tab, and select **On** under **Status**. Click **Save** to confirm. A dialog will pop up saying that your cache will be registered with Azure Active Directory and that it can be granted permissions to access resources protected by Azure AD. Select **Yes**.

   :::image type="content" source="media/cache-managed-identity/identity-save.png" alt-text="alt text 7":::

2. You see an Object (principal) ID, indicating that the identity has been assigned.

   :::image type="content" source="media/cache-managed-identity/user-assigned.png" alt-text="alt text 9":::

#### User assigned identity

1. To enable **user-assigned identity**, select the **User assigned (preview)** tab and click **Add**.

   :::image type="content" source="media/cache-managed-identity/identity-add.png" alt-text="alt text 10":::

2. A sidebar will pop up to allow you to select a user-assigned identity available to your subscription. Select your chosen user-assigned identity and select **Add**

   :::image type="content" source="media/cache-managed-identity/choose-identity.png"  alt-text="alt text 12":::

   >[!Note]
   >You need to [create a user assigned identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp) in advance of this step.
   >

3. You will see the user-assigned identity listed in the **User assigned (preview)** tab.

   :::image type="content" source="media/cache-managed-identity/identity-list.png"  alt-text="alt text 14":::

### Enable managed identity using the Azure CLI

Use the Azure CLI for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [az redis create](/cli/azure/redis?view=azure-cli-latest.md) or [az redis identity](/cli/azure/redis/identity?view=azure-cli-latest).

For example, to update a cache to use system-managed identity use the following CLI command:

```powershell-interactive
az redis identity assign \--mi-system-assigned \--name MyCacheName \--resource-group MyResource Group
```

### Enable managed identity using Azure PowerShell

Use Azure PowerShell for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache?view=azps-7.1.0) or [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache?view=azps-7.1.0).

For example, to update a cache to use system-managed identity, use the following PowerShell command:

```azurecli-interactive
Set-AzRedisCache -ResourceGroupName \"MyGroup\" -Name \"MyCache\" -IdentityType "SystemAssigned"
```

## Configure storage account to use managed identity

> [!IMPORTANT]
> Managed identity must be configured in the storage account before Azure Cache for Redis can access the account for persistence or import/export functionality. If this step is not done correctly, you see errors or no data written.

1. Create a new storage account or open an existing storage account that you would like to connect to your cache instance.

2. Open the **Access control (IAM)** tab, click on **Add**, and select **Add role assignment**.

   :::image type="content" source="media/cache-managed-identity/demostorage.png"  alt-text="alt text 15":::

3. Search for the **Storage Blob Data Contributor** role, select it, and click **Next**.

   :::image type="content" source="media/cache-managed-identity/role-assignment.png"  alt-text="alt text 17":::

4. Under **Assign access to** select **Managed Identity**, and click on **Select members**. A sidebar pops up on the right.

   :::image type="content" source="media/cache-managed-identity/select-members.png"  alt-text="alt text 19":::

5. Use the drop down under **Managed Identity** to choose either a **User-assigned managed identity** or a **System-assigned managed identity**. If you have many managed identities, you can search by name. Select the managed identities of your choice and click **Select**, and then **Review + assign** to confirm.

   :::image type="content" source="media/cache-managed-identity/review-assign.png"  alt-text="alt text 21":::

6. You can confirm if the identity has been assigned successfully by checking your storage account's role assignments under "Storage Blob Data Contributor"

   :::image type="content" source="media/cache-managed-identity/blob-data.png"  alt-text="alt text 24a":::

> [!NOTE]
> Adding an Azure Cache for Redis instance as a storage blog data contributor through system-assigned identity will conveniently add the cache instance to the [trusted services list](/azure/storage/common/storage-network-security?tabs=azure-portal), making firewall exceptions easier to implement.

## Use Managed Identity to access a storage account

### Use managed identity with data persistence

1. Open your Azure Cache for Redis instance which has been assigned the Storage Blob Data Contributor role and go to the **Data persistence** tab under **Settings**.

2. Change the **Authentication Method** to **(PREVIEW) Managed Identity** and select the storage account you configured above. Click **Save**.

   :::image type="content" source="media/cache-managed-identity/data-persistence.png"  alt-text="alt text 24b":::

   > !IMPORTANT
   > The identity defaults to the system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity is used.
   >

3. Data persistence backups can now be saved to the storage account using managed identity authentication.

   :::image type="content" source="media/cache-managed-identity/redis-persistence.png"  alt-text="alt text 25":::

### Use Managed identity to import and export cache data

1. Open your Azure Cache for Redis instance which has been assigned the Storage Blob Data Contributor role and go to the **Import** or **Export** tab under **Administration**.

2. If importing data, choose the blob storage location that holds your chosen RDB file. If exporting data, enter your desired blob name prefix and storage container. In both situations, you must use the storage account you've configured for managed identity access.

   :::image type="content" source="media/cache-managed-identity/export-data.png"  alt-text="alt text 26":::

3. Under **Authentication Method**, choose **(PREVIEW) Managed Identity** and select **Import** or **Export**, respectively.

> [!NOTE]
> It will take a few minutes to import or export the data.
>

> [!IMPORTANt]
>If you see an export or import failure, double check that your storage account has been configured with your cache's system-assigned or user-assigned identity. The identity used will default to system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity is used.

## Next Steps

[Learn more](cache-overview.md#service-tiers) about Azure Cache for Redis features
