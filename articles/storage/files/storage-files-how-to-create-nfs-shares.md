---
title: Create an NFS share - Azure Files
description: Learn how to create an Azure file share that can be mounted using the Network File System protocol.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 09/15/2020
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions, devx-track-azurecli
---

# How to create an NFS share

Azure file shares are fully managed file shares that live in the cloud. They can be accessed using either the Server Message Block protocol or the Network File System (NFS) protocol. This article covers creating a file share that uses the NFS protocol. For more information on both protocols, see [Azure file share protocols](storage-files-compare-protocols.md).

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- Create a [FileStorage account](storage-how-to-create-premium-fileshare.md).

    > [!IMPORTANT]
    > NFS shares can only be accessed from trusted networks. Connections to your NFS share must originate from one of the following sources:

    - Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Register the NFS 4.1 protocol

If you're using the Azure PowerShell module or the Azure CLI, register your feature using the following commands:

### PowerShell

```azurepowershell
Connect-AzAccount
$context = Get-AzSubscription -SubscriptionId <yourSubscriptionIDHere>
Set-AzContext $context
Register-AzProviderFeature -FeatureName AllowNfsFileShares -ProviderNamespace Microsoft.Storage
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

### Azure CLI

```azurecli
az login
az feature register --name AllowNfsFileShares \
                    --namespace Microsoft.Storage \
                    --subscription <yourSubscriptionIDHere>
az provider register --namespace Microsoft.Storage
```

## Verify that the feature is registered

Registration approval can take up to an hour. To verify that the registration is complete, use the following commands:

### PowerShell

```azurepowershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowNfsFileShares
```

### Azure CLI

```azurecli
az feature show --name AllowNfsFileShares --namespace Microsoft.Storage --subscription <yourSubscriptionIDHere>
```

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

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/create-nfs-file-share.png" alt-text="Screenshot of file share creation blade":::

# [PowerShell](#tab/azure-powershell)

1. Ensure that the .NET framework is installed. See [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).
 
1. Verify that the version of PowerShell that have installed is `5.1` or higher by using the following command.    

   ```powershell
   echo $PSVersionTable.PSVersion.ToString() 
   ```
    
   To upgrade your version of PowerShell, see [Upgrading existing Windows PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-windows-powershell?view=powershell-6#upgrading-existing-windows-powershell)
    
1. Install the latest version of the PowershellGet module.

   ```powershell
   install-Module PowerShellGet –Repository PSGallery –Force  
   ```

1. Close, and then reopen the PowerShell console.

1. Install the **Az.Storage** preview module version **2.5.2-preview**.

   ```powershell
   Install-Module Az.Storage -Repository PsGallery -RequiredVersion 2.5.2-preview -AllowClobber -AllowPrerelease -Force  
   ```

   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.0.0)
   
1. To create a premium file share with the Azure PowerShell module, use the [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare) cmdlet.

> [!NOTE]
> Provisioned share sizes is specified by the share quota, file shares are billed on the provisioned size. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

  ```powershell
  New-AzRmStorageShare `
   -ResourceGroupName $resourceGroupName `
   -StorageAccountName $storageAccountName `
   -Name myshare `
   -EnabledProtocol NFS `
   -RootSquash RootSquash `
   -Context $storageAcct.Context
  ```

# [Azure CLI](#tab/azure-cli)

To create a premium file share with the Azure CLI, use the [az storage share create](/cli/azure/storage/share-rm) command.

> [!NOTE]
> Provisioned share sizes is specified by the share quota, file shares are billed on the provisioned size. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

```azurecli-interactive
az storage share-rm create \
    --storage-account $STORAGEACCT \
    --enabled-protocol NFS \
    --root-squash RootSquash \
    --name "myshare" 
```
---

## Next steps

Now that you've created an NFS share, to use it you have to mount it on your Linux client. For details, see [How to mount an NFS share](storage-files-how-to-mount-nfs-shares.md).

If you experience any issues, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).
