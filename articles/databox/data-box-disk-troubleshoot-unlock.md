---
title: Azure Data Box Disk troubleshooting disk unlocking issues | Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 06/14/2019
ms.author: alkohli
---
# Troubleshoot disk unlocking issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes the workflows used to troubleshoot any issues when using the unlock tool. 


<!--## Query activity logs

Use the activity logs to find who unlocked and accessed the disks. Your Data Box Disk arrive on your premises in a locked state. You can use the device credentials available in the Azure portal for your order to unlock them.  

To figure out who accessed the **Device credentials** blade, you can query the Activity logs.  Any action that involves accessing **Device details > Credentials** blade is logged into the activity logs as `ListCredentials` action.

![Query Activity logs](media/data-box-logs/query-activity-log-1.png)-->


## Data Box Disk Unlock tool errors


| Error message/Tool behavior      | Recommendations                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| The current .NET Framework is not supported. The supported versions are 4.5 and later.<br><br>Tool exits with a message.  | .NET 4.5 is not installed. Install .NET 4.5 or later on the host computer that runs the Data Box Disk unlock tool.                                                                            |
| Could not unlock or verify any volumes. Contact Microsoft Support.  <br><br>The tool fails to unlock or verify any locked drive. | The tool could not unlock any of the locked drives with the supplied passkey. Contact Microsoft Support for next steps.                                                |
| Following volumes are unlocked and verified. <br>Volume drive letters: E:<br>Could not unlock any volumes with the following passkeys: werwerqomnf, qwerwerqwdfda <br><br>The tool unlocks some drives and lists the successful and failed drive letters.| Partially succeeded. Could not unlock some of the drives with the supplied passkey. Contact Microsoft Support for next steps. |
| Could not find locked volumes. Verify disk received from Microsoft is connected properly and is in locked state.          | The tool fails to find any locked drives. Either the drives are already unlocked or not detected. Ensure that the drives are connected and are locked.                                                           |
| Fatal error: Invalid parameter<br>Parameter name: invalid_arg<br>USAGE:<br>DataBoxDiskUnlock /PassKeys:<passkey_list_separated_by_semicolon><br><br>Example: DataBoxDiskUnlock /PassKeys:passkey1;passkey2;passkey3<br>Example: DataBoxDiskUnlock /SystemCheck<br>Example: DataBoxDiskUnlock /Help<br><br>/PassKeys:       Get this passkey from Azure DataBox Disk order. The passkey unlocks your disks.<br>/Help:           This option provides help on cmdlet usage and examples.<br>/SystemCheck:    This option checks if your system meets the requirements to run the tool.<br><br>Press any key to exit. | Invalid parameter entered. The only allowed parameters are /SystemCheck, /PassKey, and /Help.|


## Unlock issues for disks when using a Windows client

This section details some of the top issues faced during deployment of Data Box Disk when using a Windows client for data copy.

### Issue: Could not unlock drive from BitLocker
 
**Cause** 

You have used the password in the BitLocker dialog and trying to unlock the disk via the BitLocker unlock drives dialog. This would not work.

**Resolution**

To unlock the Data Box Disks, you need to use the Data Box Disk Unlock tool and provide the password from the Azure portal. For more information, go to [Tutorial: Unpack, connect, and unlock Azure Data Box Disk](data-box-disk-deploy-set-up.md#connect-to-disks-and-get-the-passkey).
 
### Issue: Could not unlock or verify some volumes. Contact Microsoft Support.
 
**Cause**

You may see the following error in the error log and are not able to unlock or verify some volumes.

`Exception System.IO.FileNotFoundException: Could not load file or assembly 'Microsoft.Management.Infrastructure, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies. The system cannot find the file specified.`
 
This indicates that you are likely missing the appropriate version of Windows PowerShell on your Windows client.

**Resolution**

You can install [Windows PowerShell v 5.0](https://www.microsoft.com/download/details.aspx?id=54616) and retry the operation.
 
If you are still not able to unlock the volumes, copy the logs from the folder that has the Data Box Disk Unlock tool and [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).

## Next steps

- Learn how to [troubleshoot validation issues](data-box-disk-troubleshoot.md).
