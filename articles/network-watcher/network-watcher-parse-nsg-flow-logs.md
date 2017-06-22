---
title: Parsing NSG flow logs | Microsoft Docs
description: This article shows how to parse NSG flow logs
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor:

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 06/22/2017
ms.author: gwallace
---

# Parsing NSG flow logs

NSG flow logs are stored in a storage account in block blobs. While logs are generated every hour, the logs are being consistantly updated.  This article takes you through how to read the latest events in a NSG flow log.

The following PowerShell sets up the variables needed to query the NSG flow log blob and create a blocklist.

```powershell
# The SubscriptionID to use
$subscriptionId = "147A22E9-2356-4E56-B3DE-1F5842AE4A3B"

# Resource group that contains the Network Security Group
$resourceGroupName = "TESTAG"

# The name of the Network Security Group
$nsgName = "WEBTESTNSG-3P5SRLJYUZXHO"

# The date and time for the log to be queried, logs are stored in hour intervals.
[datetime]$logtime = "06/16/2017 20:00"

# The storage account name that contains the NSG logs
$storageAccountName = "webtestvhd3p5srljyuzxho" 

# The storage account key to access the NSG logs
$StorageAccountKey = "q5Mxi5ZMK/N88spLOfu9djfSyXTDue5S9D/bZPCt+mXxB5MbCLbdY+flaf+uLvDFDKMASvq4kqIC2rEJ5xAm5Q=="

# Setup a new storage context to be used to query the logs
$ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey

# Container name used by NSG flow logs
$ContainerName = "insights-logs-networksecuritygroupflowevent"

# Name of the blob that contains the NSG flow log
$BlobName = "resourceId=/SUBSCRIPTIONS/${subscriptionId}/RESOURCEGROUPS/${resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/${nsgName}/y=$($logtime.Year)/m=$(($logtime).ToString("MM"))/d=$(($logtime).ToString("dd"))/h=$(($logtime).ToString("HH"))/m=00/PT1H.json"

# Gets the storage blog
$Blob = Get-AzureStorageBlob -Context $ctx -Container $ContainerName -Blob $BlobName

# Gets the block blog of type 'Microsoft.WindowsAzure.Storage.Blob.CloudBlob' from the storage blob
$CloudBlockBlob = [Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob] $Blob.ICloudBlob

# Stores the block list in a variable from the block blob.
$blockList = $CloudBlockBlob.DownloadBlockList()
```

The `$blockList` variable returns a list of the blocks in the blob. Each block blob will contain at least 2 blocks.  The first block is of length `21`, this is the opening brackets of the json log. The other block will be the closing brackets and will always be a length of `9`.  As you can see the example log below has 7 entries in it, each being an individual entry. All new entries in the log will be added to the end right before the final block.

```
Name                                         Length Committed
----                                         ------ ---------
ZDk5MTk5N2FkNGE0MmY5MTk5ZWViYjA0YmZhODRhYzY=     21      True
NzQxNDA5MTRhNDUzMGI2M2Y1MDMyOWZlN2QwNDZiYzQ=   2685      True
ODdjM2UyMWY3NzFhZTU3MmVlMmU5MDNlOWEwNWE3YWY=   2586      True
ZDU2MjA3OGQ2ZDU3MjczMWQ4MTRmYWNhYjAzOGJkMTg=   2688      True
ZmM3ZWJjMGQ0ZDA1ODJlOWMyODhlOWE3MDI1MGJhMTc=   2775      True
ZGVkYTc4MzQzNjEyMzlmZWE5MmRiNjc1OWE5OTc0OTQ=   2676      True
ZmY2MjUzYTIwYWIyOGU1OTA2ZDY1OWYzNmY2NmU4ZTY=   2777      True
Mzk1YzQwM2U0ZWY1ZDRhOWFlMTNhYjQ3OGVhYmUzNjk=   2675      True
ZjAyZTliYWE3OTI1YWZmYjFmMWI0MjJhNzMxZTI4MDM=      9      True
```

Next we need to read the blocklists to get the data.

```powershell
$maxvalue = ($blocklist | measure Length -Maximum).Maximum
$lastreadindex = ""
$valuearray = @()
$index = 0

for($i=0; $i -lt $blocklist.count; $i++)
{
$downloadArray = New-Object -TypeName byte[] -ArgumentList $maxvalue

$CloudBlockBlob.DownloadRangeToByteArray($downloadArray,0,$index+3,$($blockList[$i].Length-1)) | Out-Null

$index = $index + $blockList[$i].Length

$value = [System.Text.Encoding]::ASCII.GetString($downloadArray)
$valuearray += $value
$lastreadindex = $index
}
```