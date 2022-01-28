---
title: SFTP support in Azure Blob Storage (preview) | Microsoft Docs
description: Blob storage now supports the SSH File Transfer Protocol (SFTP). 
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 11/15/2021
ms.custom: references_regions
ms.author: normesta
ms.reviewer: ylunagaria

---

# SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

Blob storage now supports the SSH File Transfer Protocol (SFTP). This support provides the ability to securely connect to Blob Storage accounts via an SFTP endpoint, allowing you to leverage SFTP for file access, file transfer, as well as file management.  

> [!IMPORTANT]
> SFTP support currently is in PREVIEW and is available in only [these regions](secure-file-transfer-protocol-support.md#regional-availability) and only when you set these [data redundancy options](secure-file-transfer-protocol-known-issues.md#data-redundancy-options).
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, complete [this form](https://forms.office.com/r/gZguN0j65Y) AND request to join via 'Preview features' in Azure portal.

Azure allows secure data transfer to Blob Storage accounts using Azure Blob service REST API, Azure SDKs, and tools such as AzCopy. However, legacy workloads often use traditional file transfer protocols such as SFTP. You could update custom applications to use the REST API and Azure SDKs, but only by making significant code changes.

Prior to the release of this feature, if you wanted to use SFTP to transfer data to Azure Blob Storage you would have to either purchase a third party product or orchestrate your own solution. You would have to create a virtual machine (VM) in Azure to host an SFTP server, and then figure out a way to move data into the storage account. 

Now, with SFTP support in Azure Blob Storage, you can enable an SFTP endpoint for Blob Storage accounts with a single setting. Then you can set up local user identities for authentication to transfer data securely without the need to do any additional work. 

This article describes SFTP support in Azure Blob Storage. To learn how to enable SFTP for your storage account, see [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP) (preview)](secure-file-transfer-protocol-support-how-to.md).

## SFTP and the hierarchical namespace

SFTP support requires blobs to be organized into on a hierarchical namespace. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized. The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. 

Different protocols extend from the hierarchical namespace. The SFTP is one of these available protocols.

> [!div class="mx-imgBorder"]
> ![hierarchical namespace](./media/secure-file-transfer-protocol-support/hierarchical-namespace-and-sftp-support.png)

## SFTP Permissions model

Azure Storage does not support shared access signature (SAS), or Azure Active directory (Azure AD) authentication for connecting SFTP clients. Instead, SFTP clients must use either a password or a Secure Shell (SSH) private key credential.

To grant access to a connecting client, the storage account must have an identity associated with that credential. That identity is called a local user. Local Users are a new form of identity management provided with SFTP support. You can add up 1000 local users to a storage account.

To set up access permissions, you will create a local user, and choose authentication methods. Then, for each container in your account, you can specify the level of access you want to give that user.
 
> [!NOTE]
> After your data is ingested into Azure Storage, you can use the full breadth of Azure storage security settings. While authorization mechanisms such as role-based access control (RBAC) and access control lists aren't supported as a means to authorize a connecting SFTP client, they can be used to authorize access via Azure tools (such Azure portal, Azure CLI, Azure PowerShell commands, and AzCopy) as well as Azure SDKS, and Azure REST APIs. 
> 
> To learn more, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md)

## Authentication methods

You can authenticate a connecting SFTP client by using a password or a Secure Shell (SSH) public-private keypair. You can configure both forms of authentication and let connecting clients choose which one to use. However, multifactor authentication, whereby both a valid password and a valid public-private key pair are required for successful authentication is not supported. 

#### Passwords

Passwords are generated for you. If you choose password authentication, then your password will be provided after you finish configuring a local user. Make sure to copy that password and save it in a location where you can find it later. You won't be able to retrieve that password from Azure again. If you lose the password, you will have to generate a new one. For security reasons, you can't set the password yourself.   

#### SSH key pairs

A public-private key pair is the most common form of authentication for Secure Shell (SSH). The private key is secret and is known only to you. The public key is stored in Azure. When an SSH client connects to the storage account, it sends a message with the private key and signature. Azure validates the message and checks that the user and key are recognized by the storage account. To learn more, see [Overview of SSH and keys](../../virtual-machines/linux/ssh-from-windows.md#).

If you choose to authenticate with private-public key pair, you can either generate one, use one already stored in Azure, or provide Azure the public key of an existing public-private key pair. 

## Container permissions

In the current release, you can specify only container-level permissions. Directory-level permissions are not supported. You can choose which containers you want to grant access to and what level of access you want to provide (Read, Write, List, Delete, and Create). Those permissions apply to all directories and subdirectories in the container. You can grant each local user access to as many as 100 containers. Container permissions can also be updated after creating a local user. The following table describes each permission in more detail.

| Permission | Permission code | Description |
|---|---|---|
| Read | r | <li>Read file contents</li> |
| Write | w | <li>Upload file</li><li>Create directory</li><li>Upload directories</li> |
| List | l | <li>List contents within container</li><li>List contents within directories</li> |
| Delete | d | <li>Delete files/directories</li> |
| Create | c | <li>Upload file if file doesn't exist</li><li>Create directory if it doesn't exist</li><li>Create directories</li>|

## Home directory

As you configure permissions, you have the option of setting a home directory for the local user. If no other container is specified in an SFTP connection request, then this is the directory that the user connects to by default. For example, consider the following request made by using [Open SSH](/windows-server/administration/openssh/openssh_overview). This request doesn't specify a container or directory name as part of the `sftp` command.

```powershell
sftp myaccount.myusername@myaccount.blob.core.windows.net
put logfile.txt
```

If you set the home directory of a user to `mycontainer/mydirectory`, then the client would connect to that directory. Then, the `logfile.txt` file would be uploaded to `mycontainer/mydirectory`. If you did not set the home directory, then the connection attempt would fail. Instead, connecting clients would have to specify a container along with the request and then use SFTP commands to navigate to the target directory before uploading a file. The following example shows this:

```powershell
sftp myaccount.mycontainer.myusername@myaccount.blob.core.windows.net
cd mydirectory
put logfile.txt  
```

## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Regional availability

SFTP support is available in the following regions: 

- North Central US
- East US 2
- Canada East
- Canada Central
- North Europe
- Australia East
- Switzerland North
- Germany West Central
- East Asia
- France Central
- West Europe

## Pricing and billing

> [!IMPORTANT]
> During the public preview, the use of SFTP does not incur any additional charges. However, the standard transaction, storage, and networking prices for the underlying Azure Data Lake Store Gen2 account still apply. SFTP might incur additional charges when the feature becomes generally available.  

Transaction and storage costs are based on factors such as storage account type and the endpoint that you use to transfer data to the storage account. To learn more, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md#understand-the-full-billing-model-for-azure-blob-storage).

## See also

- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP) (preview)](secure-file-transfer-protocol-support-how-to.md)
- [Known issues with SSH File Transfer Protocol (SFTP) in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
