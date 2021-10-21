---
title: Secure File Transfer protocol support in Azure Blob Storage (preview) | Microsoft Docs
description: Blob storage now supports the Secure File Transfer (SFTP) protocol. 
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 08/31/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)

Blob storage now supports the Secure File Transfer (SFTP) protocol. You can use an SFTP client to securely connect to an Azure Storage account, and then upload and download files.

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: North US, Central US, East US, Canada, West Europe, North Europe, Australia, Switzerland, Germany West Central, and East Asia.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

For step-by-step guidance, see [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](secure-file-transfer-protocol-support-how-to.md).


## Direct connections to Azure Storage

If you wanted to use SFTP before, you had to deploy and manage SFTP as an IaaS resource and then have to then move those files somehow to blob storage.
This feature gives you a file transfer endpoint without the need to create any VMs or manage any infrastructure. 

SFTP for Blob Storage provides managed support for file transfers into and out of Azure and will eliminate the need to host third-party SFTP providers or spin up a VM to host an SFTP server. Users will now be able to connect to their SFTP enabled storage account endpoint to securely transfer files and data.  

## Existing tools, workflows, and processes unchanged

- We have tools to enable you to transport files encrypted in transit, but SFTP lets you use all of your existing tooling, scripts and custom apps that use SFTP to securely transfer. Once in storage, data is encrypted at rest. 
- If you have workflows that require customers to share out files securely, you can point those workflows to your Azure storage endpoints and not change existing tools or workflows. You change only the endpoint that they use.
- No need for code changes to existing applications which can be a barrier to adoption.
- Most indoor IP cameras are wireless cameras support FTP uploading. A few popular brands are: D-Link, Foscam, Wansview, Reolink, TRENDnet, HikVision, Axis, etc. 
- secure transfer mechanism between financial institutions and our service for delivery of customer transaction data.  So, SFTP is a requirement for us. - ExpensePath, inc.
- WTW is in the financial services space and we still leverage SFTP with thousands of our clients on a regular basis to transfer data between organizations.
- If you're operating in an industry that has requirements to use SFTP or your organization feels like it's too risky to adopt and install a new toolset such AzCopy, this feature enables you to continue meeting those requirements and established practices.
- Data ingestion will become easier from legacy systems like Mainframes which is still used in traditional industries like banking and finance services.
Unstructured data such as pdf jpeg and text files on FTP servers can be moved to Azure storage using SFTP transfer.

## SFTP and the hierarchical namespace

Traditional Blob Storage organizes files in a flat structure. However, SFTP protocol support requires blobs to be organized into on a hierarchical namespace. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Unlike a flat structure, A hierarchical namespace allows operations like folder renames and deletes to be performed in a single atomic operation, which with a flat namespace requires a number of operations proportionate to the number of objects in the structure. 

Different protocols extend from the hierarchical namespace. The SFTP protocol is one of the these available protocols. 

## Permissions model

Azure Storage does not yet support shared access signature (SAS), or Azure Active directory (Azure AD) authentication for connecting SFTP clients. Instead, SFTP clients must use either a password or a secure shell (SSH) private key credential. To grant access to a connecting client, the storage account must have an identity associated with that credential. That identity is called a *local user*. Local Users are a new form of identity management provided with SFTP for Blob Storage. Create and configure users within your SFTP-enabled storage account and grant access to one or more root containers. You can add up 1000 of them per storage account. 

To set up access permissions, you'll create a *local user*, specify an authentication method, and then specify what level of access you want that user to have on one or more containers. This section describes each component of the SFTP permissions model. For step-by-step guidance, see [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](secure-file-transfer-protocol-support-how-to.md).

> [!NOTE]
> After your data is ingested into Azure Storage, you can use the full breadth of of the security model. While authorization mechanisms such as role based access control (RBAC) and access control lists aren't supported as a means to authorize a connecting SFTP client, they can be used to authorize access via Azure tools (such Azure portal, Azure CLI, Azure PowerShell commands, and AzCopy) as well as Azure SDKS, and Azure REST APIs. To learn more, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md)

### Authentication methods

You can authenticate a connecting SFTP client by using a password or a secure shell (SSH) private key credential. You can set up a local user with both forms of authentication and let connecting clients choose which one to use. Multi-factor authentication, whereby both a valid password and a valid public and private key pair are required for successful authentication is not supported. 

##### Passwords

Passwords are generated for you. If you choose password authentication, then your password will appear in a dialog box after you finish configuring a local user. You can copy that password and save it in a location where you can find it later. You won't be able to retrieve that password from Azure again. Therefore, if you lose that password, you'll have to generated a new one. For security reasons, you can't set the password yourself.   

##### SSH key pairs

A public and private key pair is the most common form of authentication for Secure Shell (SSH). The private key is secret and is known only to you. The public key is stored in Azure. When an SSH client connects to the storage account, it sends a message with the public key and signature. Azure validates the message, and checks that the user and key are recognized by the storage account. To learn more, see [Overview of SSH and keys](/azure/virtual-machines/linux/ssh-from-windows##overview-of-ssh-and-keys).

If you choose to use a private and public key pair, you can either generate one, use one already stored in Azure, or provide Azure with the public key of an existing private public key pair. For guidance on each option, see [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](secure-file-transfer-protocol-support-how-to.md).

### Container permissions

In the current release, you can specify only container-level permissions. Directory-level permissions are not yet supported. You can choose which containers you want to grant access to and what level of access you want to provide. Those permissions apply to all directories and subdirectories in the container. The following table describes each access level:

|Permission    | Description |
|---|---|
| Read | Read files |
| Write | Write files|
| List | List contents | 
| Delete | Delete files |
| Create | Add new files |

You can grant a local user access to as many as 100 containers. 

### Home directory

As you configure permissions, you have the option of setting a *home directory* for the local user. This is the directory that is used by default in an SFTP request if no other directory is specified in the request. For example, consider the following example request made by using [Open SSH](/windows-server/administration/openssh/openssh_overview). This request doesn't specify a container or directory name.

```powershell
sftp myaccount.myusername@myaccount.blob.core.windows.net
put logfile.txt
```

If you set the home directory of a user to `mycontainer/mydirectory`, then the `logfile.txt` file would be uploaded to `mycontainer/mydirectory`. If you did not set the home directory, then the connection attempt would fail. Instead, connecting clients would have to specify a container or directory along with the request. The following example show this:

```powershell
sftp myaccount.mycontainer.mydirectory.myusername@myaccount.blob.core.windows.net
```

## Monitor use from SFTP clients

Account metrics such as transactions and capacity are available. Filter these logs by operations to see SFTP activity. SFTP_Connect will show the number of connections. Changefeed support for SFTP enabled accounts is expected in Q4 CY21 and is expected to include the connected users for some events. You can monitor connection activity by using Change feed. 

## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Pricing

See the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page for data storage and transaction costs. 

## See also

- [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](network-file-system-protocol-support-how-to.md)
- [Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)