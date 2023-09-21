---
title: Preserving file ACLs, attributes, and timestamps with Azure Data Box 
description: ACLs, timestamps, and attributes preserved during data copy via SMB to Azure Data Box. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 11/18/2022
ms.author: shaas
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box

Azure Data Box lets you preserve access control lists (ACLs), timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box via Server Message Block (SMB) to upload it to Azure Files. 

## Transferred metadata

ACLs, timestamps, and file attributes are the metadata that is transferred when the data from Data Box is uploaded to Azure Files. In this article, ACLs, timestamps, and file attributes are referred to collectively as *metadata*.

The metadata can be copied with Windows and Linux data copy tools. Metadata isn't preserved when transferring data to blob storage. Metadata is also not transferred when copying data over NFS. 

The subsequent sections of the article discuss in detail as to how the timestamps, file attributes, and ACLs are transferred when the data from Data Box is uploaded to Azure Files. 

[!INCLUDE [data-box-transferred-metadata](../../includes/data-box-transferred-metadata.md)]


## ACLs

<!--ACLs DEFINITION

**Transfer methods.** Support for ACLs transfer during a data copy varies with the file transfer protocol or service that you use. There are also some differences when you use a Windows client vs. a Linux client for the data copy.

- SMB transfers. When you [copy data over SMB](databox/data-box-deploy-copy-data.md), all the ACLs for directories and files that you copy to your Data Box over SMB are copied and transferred. Transfers include both discretionary ACLs (DACLs) and system ACLs (SACLs). If you're using a Linux client for an SMB transfer, only Windows NT ACLs are transferred.

- NFS transfers. ACLs aren't transferred when you [copy data over Network File System (NFS)](databox/data-box-deploy-copy-data-via-nfs.md).

- Data copy service - ACLs aren't transferred when you [copy data via the data copy service](data-box-deploy-copy-data-via-copy-service.md). The data copy service reads data directly from your shares and can't read ACLs.
 
**Default ACLs.** Even if your data copy tool does not copy ACLs, in Windows, the default ACLs on directories and files are transferred to Azure Files. The default ACLs aren't transferred in Linux.

The default ACLs have permissions for the built-in Administrator account, the SYSTEM account, and the SMB share user account that was used to mount and copy data in the Data Box.

The ACLs contain security descriptors with the following properties: ACLs, Owner, Group, SACL.

**Disabling ACLs transfer.** Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box.-->

Depending on the transfer method used and whether you're using a Windows or Linux client, some or all discretionary and default access control lists (ACLs) on files and folders may be transferred during the data copy to Azure Files.

Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).
 
> [!NOTE]
> Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

### ACLs transfer over SMB

During an [SMB file transfer](./data-box-deploy-copy-data.md), the following ACLs are transferred:

- Discretionary ACLs (DACLs) and system ACLs (SACLs) for directories and files that you copy to your Data Box.
- If you use a Linux client, only Windows NT ACLs are transferred.<!--Kyle asked: What are Windows NT ACLs.-->

### ACLs transfer over Data Copy Service

During a [data copy service file transfer](data-box-deploy-copy-data-via-copy-service.md), the following ACLs are transferred:

- Discretionary ACLs (DACLs) and system ACLs (SACLs) for directories and files that you copy to your Data Box.

To copy SACLs from your files, you must provide credentials for a user with **SeBackupPrivilege**. Users in the Administrators or Backup Operators group will have this privilege by default

If you do not have **SeBackupPrivilege**:
- You will not be able to copy SACLs for Azure Files copy service jobs.
- You may experience access issues and receive this error in the error log: *Could not read SACLs from share due to insufficient privileges*.

 For more information, learn more about [SeBackupPrivilege](/windows/win32/secauthz/privilege-constants). 

### ACLs transfer over NFS
 
ACLs (and metadata attributes) aren't transferred when you copy data over [NFS](data-box-deploy-copy-data-via-nfs.md).


### Default ACLs transfer

Even if your data copy tool doesn't copy ACLs, the default ACLs on directories and files are transferred to Azure Files when you use a Windows client. The default ACLs aren't transferred when you use a Linux client.

The following default ACLs are transferred:

- Account permissions:
  - Built-in Administrator account
  - SYSTEM account
  - SMB share user account used to mount and copy data in the Data Box

- Security descriptors with these properties: DACL, Owner, Group, SACL

[!INCLUDE [data-box-copy-data-and-metadata](../../includes/data-box-copy-data-and-metadata.md)]

## Next steps

- [Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)
