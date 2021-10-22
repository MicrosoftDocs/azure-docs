---
title: Secure File Transfer protocol support in Azure Blob Storage (preview) | Microsoft Docs
description: Blob storage now supports the Secure File Transfer Protocol (SFTP). 
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 10/21/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Secure File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

Blob storage now supports the Secure File Transfer (SFTP) protocol. You can use an SFTP client to securely connect to the Blob Storage endpoint of your Azure Storage account, and then upload and download files. 

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: North US, Central US, East US, Canada, West Europe, North Europe, Australia, Switzerland, Germany West Central, and East Asia.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

All Azure-based data data transfer tools such as the AzCopy, the Azure Az PowerShell module, and the Azure CLI transfer data securely to Azure Blob Storage. However, they require you to move away from familiar third party tools that you might already be using to transfer data. You could update custom applications to use Azure REST and Azure SDKs, but only by making significant code changes. 

Prior to the release of this feature, if you wanted to use SFTP to transfer data to Azure Blob Storage you'd have to orchestrate this in creative ways. For example, you might have created a virtual machine (VM) in Azure to host an SFTP server, and then you figured out a way to move data from that server to a storage account. Now, you can connect an SFTP client directly to an Azure Storage endpoint in an Azure Storage account, and then transfer data securely without the need to do any other work.

This article describes SFTP support in Azure Blob Storage. If you want to get started right away, see [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](secure-file-transfer-protocol-support-how-to.md) for step-by-step guidance.

## SFTP and the hierarchical namespace

Traditional Blob Storage organizes files in a flat structure. However, SFTP protocol support requires blobs to be organized into on a hierarchical namespace. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Unlike a flat structure, A hierarchical namespace allows operations like folder renames and deletes to be performed in a single atomic operation. A flat namespace requires many operations proportionate to the number of objects in the structure. 

Different protocols extend from the hierarchical namespace. The SFTP protocol is one of these available protocols. 

## SFTP Permissions model

Azure Storage does not yet support shared access signature (SAS), or Azure Active directory (Azure AD) authentication for connecting SFTP clients. Instead, SFTP clients must use either a password or a secure shell (SSH) private key credential. 

To grant access to a connecting client, the storage account must have an identity associated with that credential. That identity is called a *local user*. Local Users are a new form of identity management provided with SFTP for Blob Storage. You can add up 1000 local users to a storage account. 

To set up access permissions, you'll create a local user, and specify an authentication method. Then, for each container in your account, you'll specify the level of access you want to give that user. 

> [!NOTE]
> After your data is ingested into Azure Storage, you can use the full breadth of Azure storage security settings. While authorization mechanisms such as role based access control (RBAC) and access control lists aren't supported as a means to authorize a connecting SFTP client, they can be used to authorize access via Azure tools (such Azure portal, Azure CLI, Azure PowerShell commands, and AzCopy) as well as Azure SDKS, and Azure REST APIs. 
> 
> To learn more, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md)

## Authentication methods

You can authenticate a connecting SFTP client by using a password or a secure shell (SSH) private key credential. You don't have to choose between them. You can configure both forms of authentication, and let connecting clients choose which one to use. Multifactor authentication, whereby both a valid password and a valid public and private key pair are required for successful authentication is not supported. 

#### Passwords

Passwords are generated for you. If you choose password authentication, then your password will appear in a dialog box after you finish configuring a local user. Make sure to copy that password and save it in a location where you can find it later. You won't be able to retrieve that password from Azure again. Therefore, if you lose that password, you'll have to generate a new one. For security reasons, you can't set the password yourself.   

#### SSH key pairs

A public and private key pair is the most common form of authentication for Secure Shell (SSH). The private key is secret, and is known only to you. The public key is stored in Azure. When an SSH client connects to the storage account, it sends a message with the public key and signature. Azure validates the message, and checks that the user and key are recognized by the storage account. To learn more, see [Overview of SSH and keys](/azure/virtual-machines/linux/ssh-from-windows##overview-of-ssh-and-keys).

If you choose to use a private and public key pair, you can either generate one, use one already stored in Azure, or provide Azure with the public key of an existing private public key pair. 

## Container permissions

In the current release, you can specify only container-level permissions. Directory-level permissions are not yet supported. You can choose which containers you want to grant access to and what level of access you want to provide (Read, Write, List, Delete, and Create). Those permissions apply to all directories and subdirectories in the container. You can grant a local user access to as many as 100 containers. 

## Home directory

As you configure permissions, you have the option of setting a *home directory* for the local user. If no other directory is specified in an SFTP request, this is the directory that is used by default. For example, consider the following example request made by using [Open SSH](/windows-server/administration/openssh/openssh_overview). This request doesn't specify a container or directory name.

```powershell
sftp myaccount.myusername@myaccount.blob.core.windows.net
put logfile.txt
```

If you set the home directory of a user to `mycontainer/mydirectory`, then the `logfile.txt` file would be uploaded to `mycontainer/mydirectory`. If you did not set the home directory, then the connection attempt would fail. Instead, connecting clients would have to specify a container along with the request and then use sftp commands to change to the target directory before uploading a file. The following example shows this:

```powershell
sftp myaccount.mycontainer.myusername@myaccount.blob.core.windows.net
cd mydirectory
put logfile.txt  
```

## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Pricing

See the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page for data storage and transaction costs. 

## See also

- [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](network-file-system-protocol-support-how-to.md)
- [Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)