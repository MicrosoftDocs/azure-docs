---
title: Preserving file ACLs, attributes, and timestamps with Azure Data Box Disk
description: ACLs, timestamps, and attributes preserved during data copy to Azure Data Box. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 11/18/2022
ms.author: alkohli
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box Disk

Azure Data Box Disk lets you preserve access control lists (ACLs), timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box to upload it to Azure Files. 

## Transferred metadata

ACLs, timestamps, and file attributes are the metadata that is transferred when the data from Data Box Disk is uploaded to Azure Files. In this article, ACLs, timestamps, and file attributes are referred to collectively as *metadata*.

The metadata can be copied with Windows data copy tools. Metadata isn't preserved when transferring data to blob storage.

The subsequent sections of the article discuss in detail as to how the timestamps, file attributes, and ACLs are transferred when the data from Data Box Disk is uploaded to Azure Files. 

[!INCLUDE [data-box-transferred-metadata](../../includes/data-box-transferred-metadata.md)]

## ACLs

<!--ACLs DEFINITION

**Transfer methods.** Support for ACLs transfer during a data copy varies with the file transfer protocol or service that you use. There are also some differences when you use a Windows client vs. a Linux client for the data copy.
 
**Default ACLs.** Even if your data copy tool does not copy ACLs, in Windows, the default ACLs on directories and files are transferred to Azure Files. The default ACLs aren't transferred in Linux.

The default ACLs have permissions for the built-in Administrator account, the SYSTEM account, and the SMB share user account that was used to mount and copy data in the Data Box.

The ACLs contain security descriptors with the following properties: ACLs, Owner, Group, SACL.
-->

Depending on the transfer method used and whether you're using a Windows or Linux client, some or all discretionary and default access control lists (ACLs) on files and folders may be transferred during the data copy to Azure Files.
 
> [!NOTE]
> Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

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
