---
title: Network File System 3.0 and Azure Data Lake Storage Gen2 (preview) | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with Azure Data Lake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 07/08/2020
ms.author: normesta
ms.reviewer: yzheng
---

# Network File System (NFS) 3.0 protocol support in Azure Data Lake Storage Gen2 (preview)

You can connect to data in Azure Data Lake Storage Gen2 by using the Network File System (NFS) 3.0 protocol. This means that you can interact with data in Azure Data Lake Storage by using familiar workflows without having to author custom code, or use unfamiliar tool sets. You can point existing applications and workloads that use the NFS 3.0 protocol to an Azure Data Lake Storage endpoint without having to modify them. 

> [!NOTE]
> NFS 3.0 protocol support is in public preview.
> Support is available for general-purpose v2 accounts in the following regions: US Central (EUAP), and US East 2 (EUAP) regions. 
> Support is available for BlockBlobStorage accounts in the following regions: US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast.

## Register NFS 3.0 protocol feature with your subscription

To get started, use PowerShell commands to register the `AllowNFSV3` feature with your subscription.

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
   Register-AzProviderFeature -FeatureName PremiumHns -ProviderNamespace Microsoft.Storage  
   ```

6. Register the resource provider by using the following command.
    
   ```powershell
   Register-AzProviderFeature -FeatureName PremiumHns -ProviderNamespace Microsoft.Storage  
   ```
   
## Verify that the feature is registered 

After you register the NFS 3.0 protocol feature with your subscription, the registration must be approved. This can take up to an hour. 

To verify that the feature is registered with your subscription, use the following commands.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowNFSV3
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName PremiumHns  
```

## Configure a storage account

You can use the NFS 3.0 protocol only with new storage accounts. You can't enable existing accounts.

NFS 3.0 protocol is supported in the following types of storage accounts:

- [general-purpose V2](../common/storage-account-create.md)
- [BlockBlobStorage](../blobs/storage-blob-create-account-block-blob.md)

For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md).

As you configure the account, choose these values:

|Setting |general-purpose v2 account |BlockBlobStorage account|
|----|---|----|
|Location|US Central (EUAP), US East 2 (EUAP)|US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast |
|Performance|Standard|Premium|
|Account kind|StorageV2 (general purpose vs2|BlockBlobStorage|
|Replication|Locally-redundant storage (LRS)|Locally-redundant storage (LRS)|
|Connectivity method|Public endpoint (selected networks) or Private endpoint.|Public endpoint (selected networks) or Private endpoint.|
|Secure transfer required|Disabled|Disabled|
|Hierarchical namespace|Enabled|Enabled|
|NFS V3|Enabled|Enabled|

You can accept the default value for all other settings.

## Create a container

In the current release, you can mount only containers. You can't mount individual directories that are inside of a container.

Create a container by using SDKs or tools.

|||

## Mount a container

## Features not yet supported

## Pricing

## See also






