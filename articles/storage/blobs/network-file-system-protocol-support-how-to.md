---
title: Mount Azure Blob storage by using the NFS 3.0 protocol (preview) | Microsoft Docs
description: Learn how to mount a container in Blob storage from an Azure Virtual Machine (VM) or a client that runs on-premises by using the NFS 3.0 protocol.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 08/04/2020
ms.author: normesta
ms.reviewer: yzheng
ms.custom: references_regions
---

# Mount Blob storage by using the Network File System (NFS) 3.0 protocol (preview)

You can mount a container in Blob storage from a Linux-based Azure Virtual Machine (VM) or a Linux system that runs on-premises by using the NFS 3.0 protocol. This article provides step-by-step guidance. To learn more about NFS 3.0 protocol support in Blob storage, see [Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)](network-file-system-protocol-support.md).

## Step 1: Register the NFS 3.0 protocol feature with your subscription

# [PowerShell](#tab/azure-powershell)

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

5. Register the resource provider by using the following command.
    
   ```powershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.Storage   
   ```
   
# [Azure CLI](#tab/azure-cli)

1. Open a Terminal window.

2. Sign in to your Azure subscription with the `az login` command and follow the on-screen directions.

   ```azurecli-interactive
   az login
   ```
   
3. Register the `AllowNFSV3` feature by using the following command.

   ```azurecli-interactive
   az feature register --namespace Microsoft.Storage --name AllowNFSV3 --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

4. Register the resource provider by using the following command.
    
   ```azurecli-interactive
   az provider register -n Microsoft.Storage --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

---

## Step 2: Verify that the feature is registered 

Registration approval can take up to an hour. To verify that the registration is complete, use the following commands.

# [PowerShell](#tab/azure-powershell)

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowNFSV3
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az feature show --namespace Microsoft.Storage --name AllowNFSV3 --subscription <subscription-id>
```

Replace the `<subscription-id>` placeholder value with the ID of your subscription.

---

## Step 3: Create an Azure Virtual Network (VNet)

Your storage account must be contained within a VNet. A VNet enables clients to securely connect to your storage account. To learn more about VNet, and how to create one, see the [Virtual Network documentation](../../virtual-network/index.yml).

> [!NOTE]
> Clients in the same VNet can mount containers in your account. You can also mount a container from a client that runs in an on-premises network, but you'll have to first connect your on-premises network to your VNet. See [Supported network connections](network-file-system-protocol-support.md#supported-network-connections).

## Step 4: Configure network security

The only way to secure the data in your account is by using a VNet and other network security settings. Any other tool used to secure data including account key authorization, Azure Active Directory (AD) security, and access control lists (ACLs) are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them.

To secure the data in your account, see these recommendations: [Network security recommendations for Blob storage](security-recommendations.md#networking).

## Step 5: Create and configure a storage account

To mount a container by using NFS 3.0, You must create a storage account **after** you register the feature with your subscription. You can't enable accounts that existed before you registered the feature.

In the preview release of this feature, NFS 3.0 protocol is supported for standard general-purpose v2 storage accounts and for premium block blob storage accounts. For more information on these types of storage accounts, see [Storage account overview](../common/storage-account-overview.md).

As you configure the account, choose these values:

|Setting | Premium performance | Standard performance  
|----|---|---|
|Location|All available regions |One of the following regions: Australia East, Korea Central, East US, and South Central US   
|Performance|Premium| Standard
|Account kind|BlockBlobStorage| General-purpose V2
|Replication|Locally-redundant storage (LRS)| Locally-redundant storage (LRS)
|Connectivity method|Public endpoint (selected networks) or Private endpoint |Public endpoint (selected networks) or Private endpoint
|Secure transfer required|Disabled|Disabled
|Hierarchical namespace|Enabled|Enabled
|NFS V3|Enabled |Enabled 

You can accept the default values for all other settings. 

## Step 6: Create a container

Create a container in your storage account by using any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|[Azure portal](https://portal.azure.com)|[.NET](data-lake-storage-directory-file-acl-dotnet.md#create-a-container)|
|[AzCopy](../common/storage-use-azcopy-v10.md#transfer-data)|[Java](data-lake-storage-directory-file-acl-java.md)|
|[PowerShell](data-lake-storage-directory-file-acl-powershell.md#create-a-container)|[Python](data-lake-storage-directory-file-acl-python.md#create-a-container)|
|[Azure CLI](data-lake-storage-directory-file-acl-cli.md#create-a-container)|[JavaScript](data-lake-storage-directory-file-acl-javascript.md)|
||[REST](/rest/api/storageservices/create-container)|

## Step 7: Mount the container

Create a directory on your Linux system, and then mount a container in the storage account.

1. On a Linux system, create a directory.

   ```
   mkdir -p /mnt/test
   ```

2. Mount a container by using the following command.

   ```
   mount -o sec=sys,vers=3,nolock,proto=tcp <storage-account-name>.blob.core.windows.net:/<storage-account-name>/<container-name>  /mnt/test
   ```

   - Replace the `<storage-account-name>` placeholder that appears in this command with the name of your storage account.  

   - Replace the `<container-name>` placeholder with the name of your container.

---

## Resolve common issues

|Issue / error | Resolution|
|---|---|
|`Access denied by server while mounting`|Ensure that your client is running within a supported subnet. See the [Supported network locations](network-file-system-protocol-support.md#supported-network-connections).|
|`No such file or directory`| Ensure sure that the container that you're mounting was created after you verified that the feature was registered. See [Step 2: Verify that the feature is registered](#step-2-verify-that-the-feature-is-registered).Also, make sure to type the mount command and it's parameters directly into the terminal. If you copy and paste any part of this command into the terminal from another application, hidden characters in the pasted information might cause this error to appear.|

## See also

[Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)](network-file-system-protocol-support.md)
