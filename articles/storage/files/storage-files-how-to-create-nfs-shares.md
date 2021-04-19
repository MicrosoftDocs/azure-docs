---
title: Create an NFS share - Azure Files (preview)
description: Learn how to create an Azure file share that can be mounted using the Network File System protocol.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 04/05/2021
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions, devx-track-azurecli
---

# How to create an NFS share
Azure file shares are fully managed file shares that live in the cloud. This article covers creating a file share that uses the NFS protocol. For more information on both protocols, see [Azure file share protocols](storage-files-compare-protocols.md).

## Limitations
[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability
[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites
- NFS shares can only be accessed from trusted networks. Connections to your NFS share must originate from one of the following sources:
    - Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Register the NFS 4.1 protocol
If you're using the Azure PowerShell module or the Azure CLI, register your feature using the following commands:

# [Portal](#tab/azure-portal)
Use either Azure PowerShell or Azure CLI to register the NFS 4.1 feature for Azure Files.

# [PowerShell](#tab/azure-powershell)
```azurepowershell
# Connect your PowerShell session to your Azure account, if you have not already done so.
Connect-AzAccount

# Set the actively selected subscription, if you have not already done so.
$subscriptionId = "<yourSubscriptionIDHere>"
$context = Get-AzSubscription -SubscriptionId $subscriptionId
Set-AzContext $context

# Register the NFS 4.1 feature with Azure Files to enable the preview.
Register-AzProviderFeature `
    -ProviderNamespace Microsoft.Storage `
    -FeatureName AllowNfsFileShares 
    
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

# [Azure CLI](#tab/azure-cli)
```azurecli
# Connect your Azure CLI to your Azure account, if you have not already done so.
az login

# Provide the subscription ID for the subscription where you would like to 
# register the feature
subscriptionId="<yourSubscriptionIDHere>"

az feature register \
    --name AllowNfsFileShares \
    --namespace Microsoft.Storage \
    --subscription $subscriptionId

az provider register \
    --namespace Microsoft.Storage
```

---

Registration approval can take up to an hour. To verify that the registration is complete, use the following commands:

# [Portal](#tab/azure-portal)
Use either Azure PowerShell or Azure CLI to check on the registration of the NFS 4.1 feature for Azure Files. 

# [PowerShell](#tab/azure-powershell)
```azurepowershell
Get-AzProviderFeature `
    -ProviderNamespace Microsoft.Storage `
    -FeatureName AllowNfsFileShares
```

# [Azure CLI](#tab/azure-cli)
```azurecli
az feature show \
    --name AllowNfsFileShares \
    --namespace Microsoft.Storage \
    --subscription $subscriptionId
```

---

## Create a FileStorage storage account
Currently, NFS 4.1 shares are only available as premium file shares. To deploy a premium file share with NFS 4.1 protocol support, you must first create a FileStorage storage account. A storage account is a top-level object in Azure that represents a shared pool of storage which can be used to deploy multiple Azure file shares.

# [Portal](#tab/azure-portal)
To create a FileStorage storage account, navigate to the Azure portal.

1. In the Azure portal, select **Storage Accounts** on the left menu.

    ![Azure portal main page select storage account.](media/storage-how-to-create-premium-fileshare/azure-portal-storage-accounts.png)

1. On the **Storage Accounts** window that appears, choose **Add**.
1. Select the subscription in which to create the storage account.
1. Select the resource group in which to create the storage account
1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only.
1. Select a location for your storage account, or use the default location.
1. For **Performance** select **Premium**.

    You must select **Premium** for **Fileshares** to be an available option in the **Account kind** dropdown.

1. For **Premium account type** choose **Fileshares**.

    :::image type="content" source="media/storage-how-to-create-file-share/files-create-smb-share-performance-premium.png" alt-text="Screenshot of premium performance selected.":::

1. Leave **Replication** set to its default value of **Locally-redundant storage (LRS)**.
1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.

Once your storage account resource has been created, navigate to it.

# [PowerShell](#tab/azure-powershell)
To create a FileStorage storage account, open up a PowerShell prompt and execute the following commands, remembering to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```powershell
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"
$location = "westus2"

$storageAccount = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -SkuName Premium_LRS `
    -Location $location `
    -Kind FileStorage
```

# [Azure CLI](#tab/azure-cli)
To create a FileStorage storage account, open up your terminal and execute the following commands, remembering to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```azurecli-interactive
resourceGroup="<resource-group>"
storageAccount="<storage-account>"
location="westus2"

az storage account create \
    --resource-group $resourceGroup \
    --name $storageAccount \
    --location $location \
    --sku Premium_LRS \
    --kind FileStorage
```
---

## Create an NFS share

# [Portal](#tab/azure-portal)

Now that you have created a FileStorage account and configured the networking, you can create an NFS file share. The process is similar to creating an SMB share, you select **NFS** instead of **SMB** when creating the share.

1. Navigate to your storage account and select **File shares**.
1. Select **+ File share** to create a new file share.
1. Name your file share, select a provisioned capacity.
1. For **Protocol** select **NFS (preview)**.
1. For **Root Squash** make a selection.

    - Root squash (default) - Access for the remote superuser (root) is mapped to UID (65534) and GID (65534).
    - No root squash - Remote superuser (root) receives access as root.
    - All squash - All user access is mapped to UID (65534) and GID (65534).
    
1. Select **Create**.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/files-nfs-create-share.png" alt-text="Screenshot of file share creation blade.":::

# [PowerShell](#tab/azure-powershell)

1. Ensure that the .NET framework is installed. See [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).
 
1. Verify that the version of PowerShell that have installed is `5.1` or higher by using the following command.    

   ```powershell
   echo $PSVersionTable.PSVersion.ToString() 
   ```
    
   To upgrade your version of PowerShell, see [Upgrading existing Windows PowerShell](/powershell/scripting/install/installing-windows-powershell#upgrading-existing-windows-powershell)
    
1. Install the latest version of the PowershellGet module.

   ```powershell
   install-Module PowerShellGet –Repository PSGallery –Force  
   ```

1. Close, and then reopen the PowerShell console.

1. Install the **Az.Storage** preview module version **2.5.2-preview**.

   ```powershell
   Install-Module Az.Storage -Repository PsGallery -RequiredVersion 2.5.2-preview -AllowClobber -AllowPrerelease -Force  
   ```

   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps)
   
1. To create a premium file share with the Azure PowerShell module, use the [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare) cmdlet.

    > [!NOTE]
    > Premium file shares are billed using a provisioned model. The provisioned size of the share is specified by `QuotaGiB` below. For more information, see [Understanding the provisioned model](understanding-billing.md#provisioned-model) and the [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

    ```powershell
    New-AzRmStorageShare `
        -StorageAccount $storageAccount `
        -Name myshare `
        -EnabledProtocol NFS `
        -RootSquash RootSquash `
        -QuotaGiB 1024
    ```

# [Azure CLI](#tab/azure-cli)
To create a premium file share with the Azure CLI, use the [az storage share create](/cli/azure/storage/share-rm) command.

> [!NOTE]
> Premium file shares are billed using a provisioned model. The provisioned size of the share is specified by `quota` below. For more information, see [Understanding the provisioned model](understanding-billing.md#provisioned-model) and the [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

```azurecli-interactive
az storage share-rm create \
    --resource-group $resourceGroup \
    --storage-account $storageAccount \
    --name "myshare" \
    --enabled-protocol NFS \
    --root-squash RootSquash \
    --quota 1024
```
---

## Next steps
Now that you've created an NFS share, to use it you have to mount it on your Linux client. For details, see [How to mount an NFS share](storage-files-how-to-mount-nfs-shares.md).

If you experience any issues, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).