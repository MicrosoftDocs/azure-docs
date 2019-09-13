---
title: Azure Data Box Disk troubleshooting data copy issues| Microsoft Docs 
description: Describes how to troubleshoot issues seen during data copy in Azure Data Box Disk using logs.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 06/13/2019
ms.author: alkohli
---

# Troubleshoot data copy issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes how to troubleshoot any issues you see when copying the data to disks. The article also covers issues when using the split copy tool.


## Data copy issues when using a Linux system

This section details some of the top issues faced when using a Linux client to copy data to disks.

### Issue: Drive getting mounted as read-only
 
**Cause** 

This could be due to an unclean file system.

Remounting a drive as read-write does not work with Data Box Disks. This scenario is not supported with drives decrypted by dislocker. You may have successfully remounted the device using the following command:

    `# mount -o remount, rw /mnt/DataBoxDisk/mountVol1`

Though the remounting was successful, the data will not persist.

**Resolution**

Take the following steps on your Linux system:

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


## Data Box Disk Split Copy tool errors

The issues seen when using a Split Copy tool to split the data over multiple disks are summarized in the following table.

|Error message/Warnings |Recommendations |
|---------|---------|
|[Info] Retrieving BitLocker password for volume: m <br>[Error] Exception caught while retrieving BitLocker key for volume m:<br> Sequence contains no elements.|This error is thrown if the destination Data Box Disk are offline. <br> Use `diskmgmt.msc` tool to online disks.|
|[Error] Exception thrown: WMI operation failed:<br> Method=UnlockWithNumericalPassword, ReturnValue=2150694965, <br>Win32Message=The format of the recovery password provided is invalid. <br>BitLocker recovery passwords are 48 digits. <br>Verify that the recovery password is in the correct format and then try again.|Use Data Box Disk Unlock tool to first unlock the disks and retry the command. For more information, go to <li> [Unlock Data Box Disk for Windows clients](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client). </li><li> [Unlock Data Box Disk for Linux clients.](data-box-disk-deploy-set-up.md#unlock-disks-on-linux-client) </li>|
|[Error] Exception thrown: A DriveManifest.xml file exists on the target drive. <br> This indicates the target drive may have been prepared with a different journal file. <br>To add more data to the same drive, use the previous journal file. To delete existing data and reuse target drive for a new import job, delete the *DriveManifest.xml* on the drive. Rerun this command with a new journal file.| This error is received when you attempt to use the same set of drives for multiple import session. <br> Use one set of drives only for one split and copy session only.|
|[Error] Exception thrown: CopySessionId importdata-sept-test-1 refers to a previous copy session and cannot be reused for a new copy session.|This error is reported when trying to use the same job name for a new job as a previous successfully completed job.<br> Assign a unique name for your new job.|
|[Info] Destination file or directory name exceeds the NTFS length limit. |This message is reported when the destination file was renamed because of long file path.<br> Modify the disposition option in `config.json` file to control this behavior.|
|[Error] Exception thrown: Bad JSON escape sequence. |This message is reported when the config.json has format that is not valid. <br> Validate your `config.json` using [JSONlint](https://jsonlint.com/) before you save the file.|


## Next steps

- Learn how to [troubleshoot validation tool issues](data-box-disk-troubleshoot.md).
