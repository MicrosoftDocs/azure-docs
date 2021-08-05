---
title: Troubleshoot share connection failure during data copy to Azure Data Box
description: Describes how to identify network issues preventing share connections over SMB during data copy to an Azure Data Box.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 08/05/2021
ms.author: alkohli
---

# Troubleshoot share connection failure during data copy to Azure Data Box

This article describes what to do when you can't connect to an SMB share on your Azure Data Box device because of a network issue.

The most common reasons for being unable to connect to a share on your device are:

- [a domain issue](#check-for-a-domain-issue)
- [a group policy that's preventing a connection](#check-for-a-blocking-group-policy)

## Check for a domain issue

To find out whether a domain issue is preventing a share connection:

1. Start by making sure you have the right share password. On a Windows Server client/host computer, go to **Connect and copy** in the local web UI, and select **SMB** to find access credentials for the shares associated with your storage account. For detailed steps, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

1. When you access the share, enter the share password in one of the following formats:

    - `<device IP address>\<user name>`
    - `\<user name>`

    To access a share associated with your storage account from your client/host computer, open a command window. At the command prompt, type the following command. You'll be prompted for a password.

    `net use \\<IP address of the device>\<share name> /u:<IP address of the device>\<user name for the share>`

    For a procedure, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

## Check for a blocking group policy

Check whether a group policy on your client/host computer is preventing you from connecting to the share. If possible, move your client/host computer to an organizational unit (OU) that doesn't have any Group Policy objects (GPOs) applied.

To ensure that no group policies are preventing your access to shares on the Data Box:

* Ensure that your client/host computer is in its own OU for Active Directory.

* Make sure that no GPOs are applied to your client/host computer. You can block inheritance to ensure that the client/host computer (child node) doesn't automatically inherit any GPOs from the parent. For more information, see [block inheritance](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731076(v=ws.11)).

## Contact support

If there's no domain issue, and no group policies are blocking your share connection, [contact Microsoft support](data-box-disk-contact-microsoft-support.md) for more help.


## Next steps

- [Copy data via SMB](data-box-deploy-copy-data.md).
- [Troubleshoot data copy issues in Data Box](data-box-troubleshoot.md).