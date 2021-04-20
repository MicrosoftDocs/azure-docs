---
title: Troubleshoot issues on your Azure Data Box, Azure Data Box Heavy
description: Describes how to troubleshoot issues when data is uploaded from an Azure Data Box or Azure Data Box Heavy device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 04/19/2021
ms.author: alkohli
---

# Troubleshoot issues for data uploads on Azure Data Box and Azure Data Box Heavy

This article describes how to troubleshoot data copy errors that may occur when data is uploaded to the datacenter from an Azure Data Box or Azure Data Box Heavy device. The article includes a list of customer configuration errors that you must review and release before a data copy will complete.

The information in this article does not apply to export orders created for Data Box.<!--Verify: Do any data export errors require customer review and sign-off?-->

## Troubleshoot customer configuration errors

If some types of customer configuration error occur while data is uploaded from an Data Box or Data Box Heavy device, the data copy pauses, and you're notified to review the errors and choose whether to continue the upload.

The notification appears in the local web UI, as shown below. You should review the errors in the copy log carefully, and then either select **Proceed** to complete data copy job or **Cancel** to cancel the order. The copy log is saved to the storage account for the import order.

![Copy completed with errors notification in local web UI](media/data-box-troubleshoot-data-upload/copy-completed-with-errors-01.png)

You can't fix these errors during this phase of the order process, but you can review the log and decide whether it's best to proceed with this order or start a new order. For example, if two or three files fail to upload, you could proceed with the order and later transfer the missing files over the network. On the other hand, if, say, one-third of the files fail to upload for unknown reasons, you'll need to cancel the upload, investigate, and start a new import order after resolving the issues.

If you proceed, the data will be secure erased from the Data Box after the upload is completed.

If you don't respond to the notification for XX days, you'll receive another notification. After XX days, the order is automatically completed.

#### Handling of other errors

The copy log may contain other errors that do not require review:

- If invalid container, share, file, or blob names are in the data<!--What about directories? Seem to be a special case.-->, the object is renamed, and the log will contain "copy with warning" entry with the old and new names.

- If the data in the upload is larger than can be supported without Large File Shares (LFS), Support will<!--may?--> ask the customer to enable LFS and set the higher quota limit on the shares that need it.<!--Is a LFS error logged or handled strictly through a Support call?-->

## Error classes

The errors logged during a Data Box and Data Box Heavy data upload are summarized as follows:<!--What columns should the table include? 1) Is a list of error codes/names available? Is it feasible to list each error in the table, with a link to the error entry? 2) Are public-facing error descriptions available? 3) If the table only contains customer config errors, users can't take action on the errors at this point. Should the table (or entry) include resolution info for later? 4) What about error categories - from the user's perspective?-->

| Error category*        | Description        | Recommended action    |
|----------------------------------------------|---------|--------------------------------------|
| Container or share names | The container or share names do not follow the Azure naming rules.  |Download the error lists. <br> Rename the containers or shares. [Learn more](#container-or-share-name-errors).  |
<!--| Container or share size limit | The total data in containers or shares exceeds the Azure limit.   |Download the error lists. <br> Reduce the overall data in the container or share. [Learn more](#container-or-share-size-limit-errors).|
| Object or file size limit | The object or files in containers or shares exceeds the Azure limit.|Download the error lists. <br> Reduce the file size in the container or share. [Learn more](#object-or-file-size-limit-errors). |    
| Data or file type | The data format or the file type is not supported. |Download the error lists. <br> For page blobs or managed disks, ensure the data is 512-bytes aligned and copied to the pre-created folders. [Learn more](#data-or-file-type-errors). |
| Non-critical blob or file errors  | The blob or file names do not follow the Azure naming rules or the file type is not supported. | These blob or files may not be copied or the names may be changed. [Learn how to fix these errors](#non-critical-blob-or-file-errors). |-->

\* TBD: Anything to note about the error categories?


## EXAMPLE CATEGORY - Container or share name errors

These are errors related to container and share names.

### EXAMPLE ERROR ENTRY - ERROR_CONTAINER_OR_SHARE_NAME_LENGTH

**Error description:** The container or share name must be between 3 and 63 characters. 

**Suggested resolution:** The folder under the Data Box or Data Box Heavy share(SMB/NFS) to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the device local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box or Data Box Heavy share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).

## Next steps

- TO BE UPDATED: Learn about the [Data Box Blob storage system requirements](data-box-system-requirements-rest.md).