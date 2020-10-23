---
title: Azure file share – failed to delete files from Azure file share
description: Identify and troubleshoot the failure to delete files from Azure File Share.
author: v-miegge
ms.topic: troubleshooting
ms.author: kartup
manager: dcscontentpm
ms.date: 10/25/2019
ms.service: storage
ms.subservice: files
services: storage
tags: ''
---

# Azure file share – failed to delete files from Azure file share

The failure to delete files from Azure File Share can have several symptoms:

**Symptom 1:**

Failed to delete a file in azure file share due to one of the two issues below:

* The file marked for delete
* The specified resource may be in use by an SMB client

**Symptom 2:**

Not enough quota is available to process this command

## Cause

Error 1816 occurs when you reach the upper limit of concurrent open handles allowed for a file, on the computer where the file share is being mounted. For more information, see the [Azure Storage performance and scalability checklist](https://docs.microsoft.com/azure/storage/blobs/storage-performance-checklist).

## Resolution

Reduce the number of concurrent open handles by closing some handles.

## Prerequisite

### Install the latest Azure PowerShell module

* [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps)

### Connect to Azure:

```
# Connect-AzAccount
```

### Select the subscription of the target storage account:

```
# Select-AzSubscription -subscriptionid "SubscriptionID"
```

### Create context for the target storage account:

```
$Context = New-AzStorageContext -StorageAccountName "StorageAccountName" -StorageAccountKey "StorageAccessKey"
```

### Get the current open handles of the file share:

```
# Get-AzStorageFileHandle -Context $Context -ShareName "FileShareName" -Recursive
```

## Example result:

|HandleId|Path|ClientIp|ClientPort|OpenTime|LastReconnectTime|FileId|ParentId|SessionId|
|---|---|---|---|---|---|---|---|---|
|259101229083|---|10.222.10.123|62758|2019-10-05|12:16:50Z|0|0|9507758546259807489|
|259101229131|---|10.222.10.123|62758|2019-10-05|12:36:20Z|0|0|9507758546259807489|
|259101229137|---|10.222.10.123|62758|2019-10-05|12:36:53Z|0|0|9507758546259807489|
|259101229136|New folder/test.zip|10.222.10.123|62758|2019-10-05|12:36:29Z|13835132822072852480|9223446803645464576|9507758546259807489|
|259101229135|test.zip|37.222.22.143|62758|2019-10-05|12:36:24Z|11529250230440558592|0|9507758546259807489|

### Close an open handle:

To close an open handle, use the following command:

```
# Close-AzStorageFileHandle -Context $Context -ShareName "FileShareName" -Path 'New folder/test.zip' -CloseAll
```

## Next steps

* [Troubleshoot Azure Files in Windows](storage-troubleshoot-windows-file-connection-problems.md)
* [Troubleshoot Azure Files in Linux](storage-troubleshoot-linux-file-connection-problems.md)
* [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md)