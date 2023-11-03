---
author: msangapu-msft
ms.service: app-service
ms.topic: include
ms.date: 08/24/2023
ms.author: msangapu
---

> [!NOTE]
> Azure Key Vault support for Azure Storage is in preview.
>

Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud. This guide shows how to mount Azure Storage Files as a network share in Windows code (noncontainer) in App Service. Only [Azure Files Shares](../../../storage/files/storage-how-to-use-files-portal.md) and [Premium Files Shares](../../../storage/files/storage-how-to-create-file-share.md) are supported. Azure Storage is nondefault storage for App Service and billed separately.

The benefits of custom-mounted storage include:
- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application logs to Azure File shares.  
- Share content across multiple apps or with other Azure services.

The following features are supported for Windows code:

- Secured access to storage accounts with key vault, [private endpoints](../../../storage/common/storage-private-endpoints.md) and [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](../../overview-vnet-integration.md) is used).
- Azure Files (read/write).
- Up to five mount points per app.
- Mount Azure Storage file shares using "/mounts/`<path-name>`".

Here are the three options to mount Azure storage to your app:

| Mounting option | Usage |
|--------------------------|-------------|
|Basic|Choose this option when mounting storage using the Azure portal. You can use the basic option as long as the storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md). In this case, the portal gets and stores the access key for you.|
|Access Key|If you plan to mount storage using the Azure CLI, you need to obtain an access key. Choose this option storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md).|
|Key Vault|Also use this option when you plan to mount storage using the Azure CLI, which requires the access key. Choose this option when using Azure Key Vault to securely store and retrieve access keys. [Azure Key Vault](../../../key-vault/general/overview.md) has the benefits of storing application secrets centrally and securely with the ability to monitor, administer, and integrate with other Azure services like Azure App Service.|

## Prerequisites

### [Basic](#tab/basic)

- [An existing Windows code app in App Service](../../quickstart-dotnetcore.md).
- [Create Azure file share](../../../storage/files/storage-how-to-use-files-portal.md).
- [Upload files to Azure File share](../../../storage/files/storage-how-to-create-file-share.md).

### [Access Key](#tab/access-key)

- [An existing Windows code app in App Service](../../quickstart-dotnetcore.md).
- [Create Azure file share](../../../storage/files/storage-how-to-use-files-portal.md).
- [Upload files to Azure File share](../../../storage/files/storage-how-to-create-file-share.md).

### [Key Vault](#tab/key-vault)

- [An existing Windows code app in App Service](../../quickstart-dotnetcore.md).
- [Create Azure file share](../../../storage/files/storage-how-to-use-files-portal.md).
- [Upload files to Azure File share](../../../storage/files/storage-how-to-create-file-share.md).
- An [Azure Key Vault](../../../key-vault/general/overview.md) instance using the [vault access policy](../../../key-vault/general/assign-access-policy.md?WT.mc_id=Portal-Microsoft_Azure_KeyVault&tabs=azure-portal) and a [secret](../../../key-vault/secrets/quick-create-portal.md), which is required to configure the Key Vault with Azure Storage.

---

## Limitations

- [Storage firewall](../../../storage/common/storage-network-security.md) is supported only through [private endpoints](../../../storage/common/storage-private-endpoints.md) and [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](../../overview-vnet-integration.md) is used).
- Azure blobs aren't supported when configuring Azure storage mounts for Windows code apps deployed to App Service.
- FTP/FTPS access to mounted storage isn't supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Mapping `/mounts`, `mounts/foo/bar`, `/`, and `/mounts/foo.bar/` to custom-mounted storage isn't supported (you can only use /mounts/pathname for mounting custom storage to your web app.)
- Storage mounts aren't included in [backups](../../manage-backup.md). Be sure to follow best practices to back up Azure Storage accounts.
- With VNET integration on your app, the mounted drive uses an RFC1918 IP address and not an IP address from your VNET.

## Prepare for mounting

### [Basic](#tab/basic)

No extra steps are required because the portal gets and stores the access key for you. 

### [Access Key](#tab/access-key)

You need to obtain the access key from your storage account. <!--link or instructions? -->

### [Key Vault](#tab/key-vault)

Before you can mount storage using Key Vault access, you need to get the Key Vault secret and add it as an application setting in your app.  

1. In the portal, browse to your Key Vault secret and copy the **Secret Identifier** into your clipboard.
:::image type="content" source="../../media/configure-azure-storage/key-vault-secret-identifier.png" alt-text="Screenshot of Key Vault secret identifier":::

1. Back in your app, follow the [key vault reference](../../app-service-key-vault-references.md#source-app-settings-from-key-vault) to create an [**application setting**](../../configure-common.md#configure-app-settings) using the **Secret Identifier**.

    Example app setting value: `@Microsoft.KeyVault(SecretUri=https://mykeyvault.vault.azure.net/secrets/mykeyvaultsecret/1192426x947d4e37843e14rf3937dcc3)`

Now you're ready to use Key Vault to access your storage account.

---

## Mount storage to Windows code

# [Azure portal](#tab/portal/basic)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Basic** if the storage account isn't using [private endpoints](../../../storage/common/storage-private-endpoints.md) or [Azure Key Vault](../../../key-vault/general/overview.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. It must contain an Azure Files share. |
    | **Share name** | Files share to mount. |
    | **Storage access** | Select **Key vault reference** for Azure Key Vault. Otherwise, select **Manual input** |
    | **Access key** (Advanced only) | [Access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside your app service that you want to mount. Only `/mounts/pathname` is supported.|
    | **Application settings**| Select the app setting that's configured with the Azure Key Vault secret.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure portal](#tab/portal/access-key)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.
 
    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select  **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Storage access** | Select **Manual input**. |
    | **Access key** | Enter the [access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure portal](#tab/portal/key-vault)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Basic**. if the storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Storage access** | Select **Key vault reference**. |
    | **Application settings**| Select the existing app setting that's configured with the Azure Key Vault secret.|
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

1. [Grant your app access to the Key Vault](../../app-service-key-vault-references.md?#grant-your-app-access-to-a-key-vault) to access the storage mount.
 

# [Azure CLI](#tab/cli/basic)

Using Azure CLI to mount storage requires you to provide the storage access key.

# [Azure CLI](#tab/cli/access-key)

Use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command. For example:

```azurecli-interactive
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

Verify your storage is mounted by running the following command:

```azurecli-interactive
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

# [Azure CLI](#tab/cli/key-vault)

Mounting storage with Key Vault access isn't currently supported by the Azure CLI. Use the portal instead.

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to be restarted. 

## Best practices

- Azure Storage mounts can be configured as a virtual directory to serve static content. To configure the virtual directory, in the left navigation click **Configuration** > **Path Mappings** > **New Virtual Application or Directory**. Set the **Physical path** to the **Mount path** defined on the Azure Storage mount.

- To avoid latency issues, place the app and the Azure Storage account in the same region. If you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../../../storage/common/storage-network-security.md) when the app and Azure Storage account are in the same region, then these IP restrictions aren't honored.

- In the Azure Storage account, avoid [regenerating the access key](../../../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Azure App Services stores Azure storage account key. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the [scalability and performance targets for Files](../../../storage/files/storage-files-scale-targets.md).

- If your app [scales to multiple instances](../../../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It isn't recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- If you [initiate a storage failover](../../../storage/common/storage-initiate-account-failover.md) when the storage account is mounted to the app, the mount won't connect until the app is restarted or the storage mount is removed and readded.

- When VNET integration is used, ensure app setting, `WEBSITE_CONTENTOVERVNET` is set to `1` and the following ports are open:
    - Azure Files: 80 and 445

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See [the scalability and performance targets for Files](../../../storage/files/storage-files-scale-targets.md)

## Next steps

- [Migrate .NET apps to Azure App Service](../../app-service-asp-net-migration.md).