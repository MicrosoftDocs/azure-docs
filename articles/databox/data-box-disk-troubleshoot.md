---
title: Azure Data Box Disk troubleshooting | Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 04/2/2019
ms.author: alkohli
---
# Troubleshoot issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes the workflows used to troubleshoot any issues you see when you deploy this solution. 

This article includes the following sections:

- Download diagnostic logs
- Query activity logs
- Data Box Disk Unlock tool errors
- Data Box Disk Split Copy tool errors

## Download diagnostic logs

If there are any errors during the data copy process, then the portal displays a path to the folder where the diagnostics logs are located. 

The diagnostics logs can be:
- Error logs
- Verbose logs  

To navigate to the path for copy log, go to the storage account associated with your Data Box order. 

1.	Go to **General > Order details** and make a note of the storage account associated with your order.
 

2.	Go to **All resources** and search for the storage account identified in the previous step. Select and click the storage account.

    ![Copy logs 1](./media/data-box-disk-troubleshoot/data-box-disk-copy-logs1.png)

3.	Go to **Blob service > Browse blobs** and look for the blob corresponding to the storage account. Go to **diagnosticslogcontainer > waies**. 

    ![Copy logs 2](./media/data-box-disk-troubleshoot/data-box-disk-copy-logs2.png)

    You should see both the error logs and the verbose logs for data copy. Select and click each file and then download a local copy.

## Query Activity logs

Use the activity logs to find an error when troubleshooting or to monitor how a user in your organization modified a resource. Through activity logs, you can determine:

- What operations were taken on the resources in your subscription.
- Who initiated the operation. 
- When the operation occurred.
- The status of the operation.
- The values of other properties that might help you research the operation.

The activity log contains all write operations (such as PUT, POST, DELETE) performed on your resources but not the read operations (such as GET). 

Activity logs are retained for 90 days. You can query for any range of dates, as long as the starting date is not more than 90 days in the past. You can also filter by one of the built-in queries in Insights. For instance, click error and then select and click specific failures to understand the root cause.

## Data Box Disk Unlock tool errors


| Error message/Tool behavior      | Recommendations                                                                                               |
|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| None<br><br>Data Box Disk unlock tool crashes.                                                                            | BitLocker not installed. Ensure that the host computer that is running the Data Box Disk unlock tool has BitLocker installed.                                                                            |
| The current .NET Framework is not supported. The supported versions are 4.5 and later.<br><br>Tool exits with a message.  | .NET 4.5 is not installed. Install .NET 4.5 or later on the host computer that runs the Data Box Disk unlock tool.                                                                            |
| Could not unlock or verify any volumes. Contact Microsoft Support.  <br><br>The tool fails to unlock or verify any locked drive. | The tool could not unlock any of the locked drives with the supplied passkey. Contact Microsoft Support for next steps.                                                |
| Following volumes are unlocked and verified. <br>Volume drive letters: E:<br>Could not unlock any volumes with the following passkeys: werwerqomnf, qwerwerqwdfda <br><br>The tool unlocks some drives and lists the successful and failed drive letters.| Partially succeeded. Could not unlock some of the drives with the supplied passkey. Contact Microsoft Support for next steps. |
| Could not find locked volumes. Verify disk received from Microsoft is connected properly and is in locked state.          | The tool fails to find any locked drives. Either the drives are already unlocked or not detected. Ensure that the drives are connected and are locked.                                                           |
| Fatal error: Invalid parameter<br>Parameter name: invalid_arg<br>USAGE:<br>DataBoxDiskUnlock /PassKeys:<passkey_list_separated_by_semicolon><br><br>Example: DataBoxDiskUnlock /PassKeys:passkey1;passkey2;passkey3<br>Example: DataBoxDiskUnlock /SystemCheck<br>Example: DataBoxDiskUnlock /Help<br><br>/PassKeys:       Get this passkey from Azure DataBox Disk order. The passkey unlocks your disks.<br>/Help:           This option provides help on cmdlet usage and examples.<br>/SystemCheck:    This option checks if your system meets the requirements to run the tool.<br><br>Press any key to exit. | Invalid parameter entered. The only allowed parameters are /SystemCheck, /PassKey, and /Help.                                                                            |

## Data Box Disk Split Copy tool errors

|Error message/Warnings  |Recommendations |
|---------|---------|
|[Info] Retrieving bitlocker password for volume: m <br>[Error] Exception caught while retrieving bitlocker key for volume m:<br> Sequence contains no elements.|This error is thrown if the destination Data Box Disk are offline. <br> Use `diskmgmt.msc` tool to online disks.|
|[Error] Exception thrown: WMI operation failed:<br> Method=UnlockWithNumericalPassword, ReturnValue=2150694965, <br>Win32Message=The format of the recovery password provided is invalid. <br>BitLocker recovery passwords are 48 digits. <br>Verify that the recovery password is in the correct format and then try again.|Use Data Box Disk Unlock tool to first unlock the disks and retry the command. For more information, go to <li> [Unlock Data Box Disk for Windows clients](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client). </li><li> [Unlock Data Box Disk for Linux clients.](data-box-disk-deploy-set-up.md#unlock-disks-on-linux-client) </li>|
|[Error] Exception thrown: A DriveManifest.xml file exists on the target drive. <br> This indicates the target drive may have been prepared with a different journal file. <br>To add more data to the same drive, use the previous journal file. To delete existing data and reuse target drive for a new import job, delete the DriveManifest.xml on the drive. Rerun this command with a new journal file.| This error is received when you attempt to use the same set of drives for multiple import session. <br> Use one set of drives only for one split and copy session only.|
|[Error] Exception thrown: CopySessionId importdata-sept-test-1 refers to a previous copy session and cannot be reused for a new copy session.|This error is reported when trying to use the same job name for a new job as a previous successfully completed job.<br> Assign a unique name for your new job.|
|[Info] Destination file or directory name exceeds the NTFS length limit. |This message is reported when the destination file was renamed because of long file path.<br> Modify the disposition option in `config.json` file to control this behavior.|
|[Error] Exception thrown: Bad JSON escape sequence. |This message is reported when the config.json has format that is not valid. <br> Validate your `config.json` using [JSONlint](https://jsonlint.com/) before you save the file.|

## Deployment issues for Linux

This section details some of the top issues faced during deployment of Data Box Disk when using a Linux client for data copy.

### Issue: Drive getting mounted as read-only
 
**Cause** 

This could be due to an unclean file system. 

Remounting a drive as read-write does not work with Data Box Disks. This scenario is not supported with drives decrypted by dislocker. You may have successfully remounted the device using the following command:

    `# mount -o remount, rw /mnt/DataBoxDisk/mountVol1`

Though the remounting was successful, the data will not persist.

**Resolution**

If you have easy access to a Windows system, take the following steps:

1. [Unlock the disks on your Windows system](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client).
2. Use `fsutil` to unmount the volume on Windows. Run this command as an administrator in PowerShell or Command Prompt window.
    
   ```
   fsutil volume dismount <driveletter>:-
   ```
3. Shut down the system while the drive is connected. This flushes any outstanding writes to the drive and closes the drive gracefully.
4. Remove the drive and connect it to your Linux system.
5. Unlock the drive on the Linux system and continue data copy.
6. Write a dummy file to validate read-write access. Unmount and remount to validate data persistence. This should work after `fsutil` unmount.
7. Continue with the data copy.

If you do not have access to a Windows system, take the following steps on your Linux system:

1. Install the `ntfsprogs` package for the ntfsfix utility.
2. Unmount the mount points provided for the drive by the unlock tool. The number of mount points will vary for drives.

    ```
    unmount /mnt/DataBoxDisk/mountVol1
    ```

3. Run `ntfsfix` on the corresponding path. The highlighted number should be same as Step 2.

    ```
    ntfsfix /mnt/DataBoxDisk/bitlockerVol1/dislocker-file
    ```

4. Run the following command to remove the hibernation metadata that may cause the mount issue.

    ```
    ntfs-3g -o remove_hiberfile /mnt/DataBoxDisk/bitlockerVol1/dislocker-file /mnt/DataBoxDisk/mountVol1
    ```

5. Do a clean unmount.

    ```
    ./DataBoxDiskUnlock_x86_64 /unmount
    ```

6. Do a clean unlock and mount.
7. Test the mount point by writing a file.
8. Unmount and remount to validate the file persistence.
9. Continue with the data copy.
 
### Issue: Error with data not persisting after copy
 
**Cause** 

If you see that your drive does not have data after it was unmounted (though data was copied to it), then it is possible that you remounted a drive as read-write after the drive was mounted as read-only.

**Resolution**
 
If that is the case, see the resolution for [drives getting mounted as read-only](#issue-drive-getting-mounted-as-read-only).

If that was not the case, copy the logs from the folder that has the Data Box Disk Unlock tool and [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).

## Deployment issues for Windows

This section details some of the top issues faced during deployment of Data Box Disk when using a Windows client for data copy

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

- Learn how to [Manage Data Box Disk via Azure portal](data-box-portal-ui-admin.md).
