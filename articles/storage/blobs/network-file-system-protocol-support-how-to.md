---
title: Mount Blob storage on Linux using the NFS 3.0 protocol (preview) | Microsoft Docs
description: Learn how to mount a container in Blob storage from a Linux-based Azure Virtual Machine (VM) or a Linux system that runs on-premises by using the NFS 3.0 protocol.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: normesta
ms.reviewer: yzheng
ms.custom: references_regions
---

# Mount Blob storage on Linux using the Network File System (NFS) 3.0 protocol (preview)

You can mount a container in Blob storage from a Linux-based Azure Virtual Machine (VM) or a Linux system that runs on-premises by using the NFS 3.0 protocol. This article provides step-by-step guidance. To learn more about NFS 3.0 protocol support in Blob storage, see [Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)](network-file-system-protocol-support.md).

> [!NOTE]
> NFS 3.0 protocol support in Azure Blob storage is in public preview.
>
> In general-purpose v2 accounts, support is available in the following regions: US Central (EUAP), and US East 2 (EUAP) regions. 
>
> For BlockBlobStorage accounts, support is available in the following regions: US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast.

## Step 1: Register the NFS 3.0 protocol feature with your subscription

1. Open a PowerShell command window. 

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```
   
   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

4. Register the `AllowNFSV3` feature by using the following command.

   ```powershell
   Register-AzProviderFeature -FeatureName AllowNFSV3 -ProviderNamespace Microsoft.Storage 
   ```

5. If you plan to access a BlockBlobStorage account by using NFS 3.0 protocol, then register the `PremiumHns` feature by using the following command as well.

   ```powershell
   Register-AzProviderFeature -FeatureName -ProviderNamespace Microsoft.Storage  
   ```

6. Register the resource provider by using the following command.
    
   ```powershell
   Register-AzProviderFeature -FeatureName PremiumHns -ProviderNamespace Microsoft.Storage  
   ```

## Step 2: Verify that the feature is registered 

Registration approval can take up to an hour. To verify that the registration is complete, use the following commands.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowNFSV3
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName PremiumHns  
```

## Step 3: Create an Azure Virtual Network (VNet)

Your storage account must be contained within a VNet. To learn more about VNet, and how to create one, see the [Virtual Network documentation](https://docs.microsoft.com/azure/virtual-network/).

> [!NOTE]
> Clients in the same VNet can mount containers in your account. You can also mount a container from a client that runs in an on-premises network, but you'll have to first connect your on-premises network to your VNet. See [Supported network connections](network-file-system-protocol-support.md#supported-network-connections).

## Step 4: Configure network security

The only way to secure your data is by using network security settings. Any other tool used to secure data including account key authorization, Azure Active Directory (AD) security, and POSIX access control lists (ACLs) are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them.

To secure the data in your account, see these recommendations: [Network security recommendations for Blob storage](security-recommendations.md#networking).


## Step 5: Create and configure a storage account

To mount a container by using NFS 3.0, You must create a storage account **after** you register the feature with your subscription. You can't enable accounts that existed before you registered the feature. 

NFS 3.0 protocol is supported in the following types of storage accounts:

- [BlockBlobStorage](../blobs/storage-blob-create-account-block-blob.md) (Premium performance)
- [general-purpose V2](../common/storage-account-create.md) (Standard performance)


For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md).

As you configure the account, choose these values:

|Setting |BlockBlobStorage account|general-purpose v2 account|
|----|---|----|
|Location|One of the following regions: US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast |One of the following regions: US Central (EUAP), US East 2 (EUAP)|
|Performance|Premium|Standard|
|Account kind|BlockBlobStorage|StorageV2 (general purpose v2|
|Replication|Locally-redundant storage (LRS)|Locally-redundant storage (LRS)|
|Connectivity method|Public endpoint (selected networks) or Private endpoint.|Public endpoint (selected networks) or Private endpoint.|
|Secure transfer required|Disabled|Disabled|
|Hierarchical namespace|Enabled|Enabled|
|NFS V3|Enabled|Enabled|

You can accept the default values for all other settings. 

## Step 6: Create a container

Create a container in your storage account by using any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|[Azure Storage Explorer](data-lake-storage-explorer.md#create-a-container)|[.NET](data-lake-storage-directory-file-acl-dotnet.md#create-a-container)|
|[AzCopy](../common/storage-use-azcopy-blobs.md#create-a-container)|[Java](data-lake-storage-directory-file-acl-java.md#create-a-container)|
|[PowerShell](data-lake-storage-directory-file-acl-powershell.md#create-a-container)|[Python](data-lake-storage-directory-file-acl-python.md#create-a-container)|
|[Azure CLI](data-lake-storage-directory-file-acl-cli.md#create-a-container)|[JavaScript](data-lake-storage-directory-file-acl-javascript.md)|
||[REST](https://docs.microsoft.com/rest/api/storageservices/create-container)|

## Step 7: Mount the container

On a Linux system, you can mount a container by using the following command.

```
mount -o sec=sys,vers=3,nolock,proto=tcp <storage-account-name>.blob.core.windows.net:/<storage-account-name>/<container-name>  /mnt/test
```

- Replace the `<storage-account-name>` placeholder that appears in this command with the name of your storage account.  

- Replace the `<container-name>` placeholder with the name of your container.

If you receive the error "`Access denied by server while mounting`", ensure that your client is running within a supported subnet. See the [Supported network locations](network-file-system-protocol-support.md#supported-network-connections).

If you receive the error "`No such file or directory`", make sure that the container that you're mounting was created after you verified that the feature was registered. See [Step 2: Verify that the feature is registered](#step-2-verify-that-the-feature-is-registered).

## See also

[Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)](network-file-system-protocol-support.md)







