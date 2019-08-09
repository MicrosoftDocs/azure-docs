---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 03/18/2019
ms.author: alkohli
---

|     Error code     |      Error description     |
|--------------------|--------------------------|
|    100             | The container or share name must be between 3 and 63 characters.|
|    101             | The container or share name must consist of only letters, numbers, or hyphens.|
|    102             | The container or share name must consist of only letters, numbers, or hyphens.|
|    103             | The blob or file name contains unsupported control characters.|
|    104             | The blob or file name contains illegal characters.|
|    105             | Blob or file name contains too many segments (each segment is separated by a slash -/).|
|    106             | The blob or file name is too long.|
|    107             | One of the segments in the blob or file name is too long. |
|    108             | The file size exceeds the maximum file size for upload.    |
|    109             | The blob or file is incorrectly aligned.  |
|    110             | The Unicode encoded file name or blob is not valid.|
|    111             | The name or the prefix of the file or blob is a reserved name that isn't supported (for example, COM1).|
|    2000            | An etag mismatch indicates that there is a conflict between a block blob in the cloud and on the device. To resolve this conflict, delete one of those files – either the version in the cloud or the version on the device.    |
|    2001            | An unexpected problem occurred while processing a file after the file was uploaded.    If you see this error, and the error persists for more than 24 hours, contact support. |
|    2002            | The file is already open in another process and can't be uploaded until the handle is closed.|
|    2003            | Couldn't open the file for upload. If you see this error, contact Microsoft Support.|
|    2004            | Couldn't connect to the container to upload data to it.|
|    2005            | Couldn't connect to the container because the account permissions are either wrong or out of date. Check your access.|
|    2006            | Couldn't upload data to the account as the account or share is disabled.|
|    2007            | Couldn't connect to the container because the account permissions are either wrong or out of date. Check your access.|
|    2008            | Couldn't add new data as the container is full. Check the Azure specifications for supported container sizes based on type. For example, Azure File only supports a maximum file size of 5 TB.|
|    2009            | Couldn't upload data because the container associated with the share doesn't exist.|    
|    2997            | An unexpected error occurred. This is a transient error that will resolve itself.|
|    2998            | An unexpected error occurred. The error may resolve itself but if it persists for more than 24 hours, contact Microsoft Support.|
|    16000           | Couldn't bring down this file.|
|    16001           | Couldn't bring down this file since it already exists on your local system.|
|    16002           |Couldn't refresh this file since it isn't fully uploaded.|

