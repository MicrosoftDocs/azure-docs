---
title: SFTP support for Azure Blob Storage
titleSuffix: Azure Storage
description: Blob storage now supports the SSH File Transfer Protocol (SFTP). 
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 04/03/2023
ms.custom: references_regions
ms.author: normesta
ms.reviewer: ylunagaria
---

# SSH File Transfer Protocol (SFTP) support for Azure Blob Storage

Blob storage now supports the SSH File Transfer Protocol (SFTP). This support lets you securely connect to Blob Storage via an SFTP endpoint, allowing you to use SFTP for file access, file transfer, and file management. 


Here's a video that tells you more about it.

> [!VIDEO https://www.youtube-nocookie.com/embed/5cSo3GqSTWY]

Azure allows secure data transfer to Blob Storage accounts using Azure Blob service REST API, Azure SDKs, and tools such as AzCopy. However, legacy workloads often use traditional file transfer protocols such as SFTP. You could update custom applications to use the REST API and Azure SDKs, but only by making significant code changes.

Prior to the release of this feature, if you wanted to use SFTP to transfer data to Azure Blob Storage you would have to either purchase a third party product or orchestrate your own solution. For custom solutions, you would have to create virtual machines (VMs) in Azure to host an SFTP server, and then update, patch, manage, scale, and maintain a complex architecture.

Now, with SFTP support for Azure Blob Storage, you can enable an SFTP endpoint for Blob Storage accounts with a single click. Then you can set up local user identities for authentication to connect to your storage account with SFTP via port 22. 

This article describes SFTP support for Azure Blob Storage. To learn how to enable SFTP for your storage account, see [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md).

> [!Note]
> SFTP is a platform level service, so port 22 will be open even if the account option is disabled. If SFTP access is not configured then all requests will receive a disconnect from the service.

## SFTP and the hierarchical namespace

SFTP support requires hierarchical namespace to be enabled. Hierarchical namespace organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized. The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. 

Different protocols are supported by the hierarchical namespace. SFTP is one of these available protocols. The following image shows storage access via multiple protocols and REST APIs. For easier reading, this image uses the term Gen2 REST to refer to the Azure Data Lake Storage Gen2 REST API.

> [!div class="mx-imgBorder"]
> ![hierarchical namespace](./media/secure-file-transfer-protocol-support/hierarchical-namespace-and-sftp-support.png)

## SFTP permission model

Azure Blob Storage doesn't support Azure Active Directory (Azure AD) authentication or authorization via SFTP. Instead, SFTP utilizes a new form of identity management called _local users_. 

Local users must use either a password or a Secure Shell (SSH) private key credential for authentication. You can have a maximum of 1000 local users for a storage account.

To set up access permissions, you'll create a local user, and choose authentication methods. Then, for each container in your account, you can specify the level of access you want to give that user.
 
> [!CAUTION]
> Local users do not interoperate with other Azure Storage permission models such as RBAC (role based access control), ABAC (attribute based access control), and ACLs (access control lists). 
>
> For example, Jeff has read only permission (can be controlled via RBAC, ABAC, or ACLs) via their Azure AD identity for file _foo.txt_ stored in container _con1_. If Jeff is accessing the storage account via NFS (when not mounted as root/superuser), Blob REST, or Data Lake Storage Gen2 REST, these permissions will be enforced. However, if Jeff also has a local user identity with delete permission for data in container _con1_, they can delete _foo.txt_ via SFTP using the local user identity.

For SFTP enabled storage accounts, you can use the full breadth of Azure Blob Storage security settings, to authenticate and authorize users accessing Blob Storage via Azure portal, Azure CLI, Azure PowerShell commands, AzCopy, as well as Azure SDKs, and Azure REST APIs. To learn more, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

## Authentication methods

You can authenticate local users connecting via SFTP by using a password or a Secure Shell (SSH) public-private keypair. You can configure both forms of authentication and let connecting local users choose which one to use. However, multifactor authentication, whereby both a valid password and a valid public-private key pair are required for successful authentication isn't supported. 

#### Passwords

You can't set custom passwords, rather Azure generates one for you. If you choose password authentication, then your password will be provided after you finish configuring a local user. Make sure to copy that password and save it in a location where you can find it later. You won't be able to retrieve that password from Azure again. If you lose the password, you'll have to generate a new one. For security reasons, you can't set the password yourself.   

#### SSH key pairs

A public-private key pair is the most common form of authentication for Secure Shell (SSH). The private key is secret and should be known only to the local user. The public key is stored in Azure. When an SSH client connects to the storage account using a local user identity, it sends a message with the public key and signature. Azure validates the message and checks that the user and key are recognized by the storage account. To learn more, see [Overview of SSH and keys](../../virtual-machines/linux/ssh-from-windows.md#).

If you choose to authenticate with private-public key pair, you can either generate one, use one already stored in Azure, or provide Azure the public key of an existing public-private key pair. You can have a maximum of 10 public keys per local user.

## Container permissions

In the current release, you can specify only container-level permissions. Directory-level permissions aren't supported. You can choose which containers you want to grant access to and what level of access you want to provide (Read, Write, List, Delete, and Create). Those permissions apply to all directories and subdirectories in the container. You can grant each local user access to as many as 100 containers. Container permissions can also be updated after creating a local user. The following table describes each permission in more detail.

| Permission | Symbol | Description |
|---|---|---|
| Read | r | <li>Read file content</li> |
| Write | w | <li>Upload file</li><li>Create directory</li><li>Upload directory</li> |
| List | l | <li>List content within container</li><li>List content within directory</li> |
| Delete | d | <li>Delete file/directory</li> |
| Create | c | <li>Upload file if file doesn't exist</li><li>Create directory if directory doesn't exist</li> |

When performing write operations on blobs in sub directories, Read permission is required to open the directory and access blob properties.

## Home directory

As you configure permissions, you have the option of setting a home directory for the local user. If no other container is specified in an SFTP connection request, then the home directory is the directory that the user connects to by default. For example, consider the following request made by using [Open SSH](/windows-server/administration/openssh/openssh_overview). This request doesn't specify a container or directory name as part of the `sftp` command.

```powershell
sftp myaccount.myusername@myaccount.blob.core.windows.net
put logfile.txt
```

If you set the home directory of a user to `mycontainer/mydirectory`, then they would connect to that directory. Then, the `logfile.txt` file would be uploaded to `mycontainer/mydirectory`. If you didn't set the home directory, then the connection attempt would fail. Instead, connecting users would have to specify a container along with the request and then use SFTP commands to navigate to the target directory before uploading a file. The following example shows this:

```powershell
sftp myaccount.mycontainer.myusername@myaccount.blob.core.windows.net
cd mydirectory
put logfile.txt  
```

> [!Note]
> Home directory is only the initial directory that the connecting local user is placed in. Local users can navigate to any other path in the container they are connected to if they have the appropriate container permissions.

## Supported algorithms

You can use many different SFTP clients to securely connect and then transfer files. Connecting clients must use algorithms specified in table below. 

| Type | Algorithm |
|--|--|
| Host key <sup>1</sup> | rsa-sha2-256 <sup>2</sup><br>rsa-sha2-512 <sup>2</sup><br>ecdsa-sha2-nistp256<br>ecdsa-sha2-nistp384 |
| Key exchange |ecdh-sha2-nistp384<br>ecdh-sha2-nistp256<br>diffie-hellman-group14-sha256<br>diffie-hellman-group16-sha512<br>diffie-hellman-group-exchange-sha256|
| Ciphers/encryption |aes128-gcm@openssh.com<br>aes256-gcm@openssh.com<br>aes128-ctr<br>aes192-ctr<br>aes256-ctr|
| Integrity/MAC |hmac-sha2-256<br>hmac-sha2-512<br>hmac-sha2-256-etm@openssh.com<br>hmac-sha2-512-etm@openssh.com|
| Public key |ssh-rsa <sup>2</sup><br>rsa-sha2-256<br>rsa-sha2-512<br>ecdsa-sha2-nistp256<br>ecdsa-sha2-nistp384|

<sup>1</sup>    Host keys are published [here](secure-file-transfer-protocol-host-keys.md).
<sup>2</sup>    RSA keys must be minimum 2048 bits in length.

SFTP support for Azure Blob Storage currently limits its cryptographic algorithm support based on security considerations. We strongly recommend that customers utilize [Microsoft Security Development Lifecycle (SDL) approved algorithms](/security/sdl/cryptographic-recommendations) to securely access their data.

At this time, in accordance with the Microsoft Security SDL, we don't plan on supporting the following: `ssh-dss`, `diffie-hellman-group14-sha1`, `diffie-hellman-group1-sha1`, `hmac-sha1`, `hmac-sha1-96`. Algorithm support is subject to change in the future.

## Connecting with SFTP

To get started, enable SFTP support, create a local user, and assign permissions for that local user. Then, you can use any SFTP client to securely connect and then transfer files. For step-by-step guidance, see [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md).

### Known supported clients

The following clients have compatible algorithm support with SFTP for Azure Blob Storage. See [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md) if you're having trouble connecting. This list isn't exhaustive and may change over time.

- AsyncSSH 2.1.0+
- Axway
- Cyberduck 7.8.2+
- edtFTPjPRO 7.0.0+
- FileZilla 3.53.0+
- libssh 0.9.5+
- Maverick Legacy 1.7.15+
- Moveit 12.7
- OpenSSH 7.4+
- paramiko 2.8.1+
- phpseclib 1.0.13+
- PuTTY 0.74+
- QualysML 12.3.41.1+
- RebexSSH 5.0.7119.0+
- Salesforce
- ssh2js 0.1.20+
- sshj 0.27.0+
- SSH.NET 2020.0.0+
- WinSCP 5.10+
- Workday
- XFB.Gateway
- JSCH 0.1.54+
- curl 7.85.0+
- AIX<sup>1</sup>

<sup>1</sup>    Must set `AllowPKCS12KeystoreAutoOpen` option to `no`.

## Limitations and known issues

See the [limitations and known issues article](secure-file-transfer-protocol-known-issues.md) for a complete list of limitations and issues with SFTP support for Azure Blob Storage.

## Pricing and billing

Enabling the SFTP endpoint has an hourly cost. For the latest pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

> [!TIP]
> To avoid passive charges, consider enabling SFTP only when you are actively using it to transfer data. For guidance about how to enable and then disable SFTP support, see [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md). 

Transaction, storage, and networking prices for the underlying storage account apply. All SFTP transactions get converted to Read, Write or Other transactions on your storage accounts. This includes all SFTP commands and API calls. To learn more, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md#understand-the-full-billing-model-for-azure-blob-storage).

## See also

- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
