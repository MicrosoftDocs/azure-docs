---
title: Change which key type secures your Azure managed disk
description: Change the encryption of managed disks from customer-managed keys to platform-managed keys | Azure portal, Azure CLI, or Azure PowerShell module.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 07/17/2023
ms.author: rogarana
---

# Switch from customer-managed keys to platform-managed keys

This article covers how to change the encryption type of an Azure managed disk from [customer-managed keys](disk-encryption.md#customer-managed-keys) to [platform-managed keys](disk-encryption.md#platform-managed-keys).

## Change encryption type

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal.
1. Select the disk you'd like to change the encryption type of.
1. Select **Encryption**.
1. For **Key management** select **Platform-managed key** and select save.

Your managed disk has successfully switched from being secured with your own customer-managed key to a platform-managed key.

# [Azure CLI](#tab/azure-cli)

Your existing disks must not be attached to a running VM in order for you to encrypt them using the following script:

```azurecli
rgName=yourResourceGroupName
diskName=yourDiskName
 
az disk update -n $diskName -g $rgName --encryption-type EncryptionAtRestWithPlatformKey
```

# [Azure PowerShell](#tab/azure-powershell)

Your existing disks must not be attached to a running VM in order for you to encrypt them using the following script:

```PowerShell
$rgName = "yourResourceGroupName"
$diskName = "yourDiskName"
 
New-AzDiskUpdateConfig -EncryptionType "EncryptionAtRestWithPlatformKey" | Update-AzDisk -ResourceGroupName $rgName -DiskName $diskName
```
---