---
title: Mount Azure Blob Storage by using the NFS 3.0 protocol
titleSuffix: Azure Storage
description: Learn how to mount a container in Blob Storage from an Azure virtual machine (VM) or a client that runs on-premises by using the NFS 3.0 protocol.
author: normesta

ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 02/14/2023
ms.author: normesta
ms.reviewer: yzheng
---

# Mount Blob Storage by using the Network File System (NFS) 3.0 protocol

This article provides guidance on how to mount a container in Azure Blob Storage from a Linux-based Azure virtual machine (VM) or a Linux system that runs on-premises by using the Network File System (NFS) 3.0 protocol. To learn more about NFS 3.0 protocol support in Blob Storage, see [Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-support.md).

## Step 1: Create an Azure virtual network 

Your storage account must be contained within a virtual network. A virtual network enables clients to connect securely to your storage account. To learn more about Azure Virtual Network, and how to create a virtual network, see the [Virtual Network documentation](../../virtual-network/index.yml).

> [!NOTE]
> Clients in the same virtual network can mount containers in your account. You can also mount a container from a client that runs in an on-premises network, but you'll have to first connect your on-premises network to your virtual network. See [Supported network connections](network-file-system-protocol-support.md#supported-network-connections).

## Step 2: Configure network security

Currently, the only way to secure the data in your storage account is by using a virtual network and other network security settings. Any other tools used to secure data, including account key authorization, Azure Active Directory (Azure AD) security, and access control lists (ACLs), are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them.

To secure the data in your account, see these recommendations: [Network security recommendations for Blob storage](security-recommendations.md#networking).

> [!IMPORTANT]
> The NFS 3.0 protocol uses ports 111 and 2048. If you're connecting from an on-premises network, make sure that your client allows outgoing communication through those ports. If you have granted access to specific VNets, make sure that any network security groups associated with those VNets don't contain security rules that block incoming communication through those ports.

## Step 3: Create and configure a storage account

To mount a container by using NFS 3.0, you must create a storage account. You can't enable existing accounts.

The NFS 3.0 protocol is supported for standard general-purpose v2 storage accounts and for premium block blob storage accounts. For more information on these types of storage accounts, see [Storage account overview](../common/storage-account-overview.md).

To configure the account, choose these values:

|Setting | Premium performance | Standard performance
|----|---|---|
|Location|All available regions |All available regions
|Performance|Premium| Standard
|Account kind|BlockBlobStorage| General-purpose V2
|Replication|Locally-redundant storage (LRS), Zone-redundant storage (ZRS)| Locally-redundant storage (LRS), Zone-redundant storage (ZRS)
|Connectivity method|Public endpoint (selected networks) or Private endpoint |Public endpoint (selected networks) or Private endpoint
|Hierarchical namespace|Enabled|Enabled
|NFS V3|Enabled |Enabled

You can accept the default values for all other settings.

## Step 4: Create a container

Create a container in your storage account by using any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|[Azure portal](https://portal.azure.com)|[.NET](data-lake-storage-directory-file-acl-dotnet.md#create-a-container)|
|[AzCopy](../common/storage-use-azcopy-v10.md#transfer-data)|[Java](data-lake-storage-directory-file-acl-java.md)|
|[PowerShell](data-lake-storage-directory-file-acl-powershell.md#create-a-container)|[Python](data-lake-storage-directory-file-acl-python.md#create-a-container)|
|[Azure CLI](data-lake-storage-directory-file-acl-cli.md#create-a-container)|[JavaScript](data-lake-storage-directory-file-acl-javascript.md)|
||[REST](/rest/api/storageservices/create-container)|

> [!NOTE]
> By default, the root squash option of a new container is **No Root Squash**. But you can change that to **Root Squash** or **All Squash**. For information about these squash options, see your operating system documentation.

The following image shows the squash options as they appear in the Azure portal.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows squash options in the Azure portal.](./media/network-file-system-protocol-how-to/squash-options-azure-portal.png)

## Step 5: Mount the container

Create a directory on your Linux system, and then mount the container in the storage account.

1. On your Linux system, create a directory:

   ```
   mkdir -p /nfsdata
   ```

2. Mount the container by using one of the following methods. In both methods, replace the `<storage-account-name>` placeholder with the name of your storage account, and replace `<container-name>` with the name of your container.

   - To have the share mounted automatically on reboot:

     1. Create an entry in the /etc/fstab file by adding the following line:
  
        ```
        <storage-account-name>.blob.core.windows.net:/<storage-account-name>/<container-name>  /nfsdata    nfs defaults,sec=sys,vers=3,nolock,proto=tcp,nofail    0 0
        ```

     1. Run the following command to immediately process the /etc/fstab entries and attempt to mount the preceding path:
 
        ```
        mount /nfsdata
        ```
        
   - For a temporary mount that doesn't persist across reboots, run the following command: 
    
     ```
     mount -o sec=sys,vers=3,nolock,proto=tcp <storage-account-name>.blob.core.windows.net:/<storage-account-name>/<container-name>  /nfsdata
     ```

## Resolve common errors

|Error | Cause/resolution|
|---|---|
|`Access denied by server while mounting`|Ensure that your client is running within a supported subnet. See [Supported network locations](network-file-system-protocol-support.md#supported-network-connections).|
|`No such file or directory`| Make sure to type, rather than copy and paste, the mount command and its parameters directly into the terminal. If you copy and paste any part of this command into the terminal from another application, hidden characters in the pasted information might cause this error to appear. This error also might appear if the account isn't enabled for NFS 3.0.|
|`Permission denied`| The default mode of a newly created NFS 3.0 container is 0750. Non-root users don't have access to the volume. If access from non-root users is required, root users must change the mode to 0755. Sample command: `sudo chmod 0755 /nfsdata`|
|`EINVAL ("Invalid argument"`) |This error can appear when a client attempts to:<li>Write to a blob that was created from a blob endpoint.<li>Delete a blob that has a snapshot or is in a container that has an active WORM (write once, read many) policy.|
|`EROFS ("Read-only file system"`) |This error can appear when a client attempts to:<li>Write to a blob or delete a blob that has an active lease.<li>Write to a blob or delete a blob in a container that has an active WORM policy. |
|`NFS3ERR_IO/EIO ("Input/output error"`) |This error can appear when a client attempts to read, write, or set attributes on blobs that are stored in the archive access tier. |
|`OperationNotSupportedOnSymLink` error| This error can be returned during a write operation via a Blob Storage or Azure Data Lake Storage Gen2 API. Using these APIs to write or delete symbolic links that are created by using NFS 3.0 is not allowed. Make sure to use the NFS 3.0 endpoint to work with symbolic links. |
|`mount: /nfsdata: bad option;`| Install the NFS helper program by using `sudo apt install nfs-common`.|
|`Connection Timed Out`| Make sure that client allows outgoing communication through ports 111 and 2048. The NFS 3.0 protocol uses these ports. Makes sure to mount the storage account by using the Blob service endpoint and not the Data Lake Storage endpoint. |

## See also

- [Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-support.md)
- [Known issues with Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-known-issues.md)
