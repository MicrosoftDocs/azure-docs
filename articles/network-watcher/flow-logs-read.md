---
title: Read flow logs
titleSuffix: Azure Network Watcher
description: Learn how to use a PowerShell script to parse flow logs that are created hourly and updated every few minutes in Azure Network Watcher.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/24/2024
ms.custom: devx-track-azurepowershell

#CustomerIntent: As an Azure administrator, I want to read my flow logs using a PowerShell script so I can see the latest data.
---

# Read flow logs

In this article, you learn how to selectively read portions of Azure Network Watcher flow logs using PowerShell without having to parse the entire log. Flow logs are stored in a storage account in block blobs. Each log is a separate block blob that is generated every hour and updated with the latest data every few minutes. Using the script provided in this article, you can read the latest data from the flow logs without having to download the entire log.

The concepts discussed in this article aren't limited to the PowerShell and are applicable to all languages supported by the Azure Storage APIs.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- PowerShell installed on your machine. For more information, see [Install PowerShell on Windows, Linux, and macOS](/powershell/scripting/install/installing-powershell). This article requires the Az PowerShell module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell). To find the installed version, run `Get-Module -ListAvailable Az`. 

- Flow logs in a region or more. For more information, see [Create network security group flow logs](nsg-flow-logs-portal.md#create-a-flow-log) or [Create virtual network flow logs](vnet-flow-logs-portal.md#create-a-flow-log).

- Necessary RBAC permissions for the subscriptions of flow logs and storage account. For more information, see [Network Watcher RBAC permissions](required-rbac-permissions.md).

## Retrieve the blocklist

# [**Network security group flow logs**](#tab/nsg)

The following PowerShell script sets up the variables needed to query the network security group flow log blob and list the blocks within the [CloudBlockBlob](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob) block blob. Update the script to contain valid values for your environment.

```powershell
function Get-NSGFlowLogCloudBlockBlob {
    [CmdletBinding()]
    param (
        [string] [Parameter(Mandatory=$true)] $subscriptionId,
        [string] [Parameter(Mandatory=$true)] $NSGResourceGroupName,
        [string] [Parameter(Mandatory=$true)] $NSGName,
        [string] [Parameter(Mandatory=$true)] $storageAccountName,
        [string] [Parameter(Mandatory=$true)] $storageAccountResourceGroup,
        [string] [Parameter(Mandatory=$true)] $macAddress,
        [datetime] [Parameter(Mandatory=$true)] $logTime
    )

    process {
        # Retrieve the primary storage account key to access the network security group logs
        $StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $storageAccountResourceGroup -Name $storageAccountName).Value[0]

        # Setup a new storage context to be used to query the logs
        $ctx = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey

        # Container name used by network security group flow logs
        $ContainerName = "insights-logs-networksecuritygroupflowevent"

        # Name of the blob that contains the network security group flow log
        $BlobName = "resourceId=/SUBSCRIPTIONS/${subscriptionId}/RESOURCEGROUPS/${NSGResourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/${NSGName}/y=$($logTime.Year)/m=$(($logTime).ToString("MM"))/d=$(($logTime).ToString("dd"))/h=$(($logTime).ToString("HH"))/m=00/macAddress=$($macAddress)/PT1H.json"

        # Gets the storage blog
        $Blob = Get-AzStorageBlob -Context $ctx -Container $ContainerName -Blob $BlobName

        # Gets the block blog of type 'Microsoft.Azure.Storage.Blob.CloudBlob' from the storage blob
        $CloudBlockBlob = [Microsoft.Azure.Storage.Blob.CloudBlockBlob] $Blob.ICloudBlob

        #Return the Cloud Block Blob
        $CloudBlockBlob
    }
}

function Get-NSGFlowLogBlockList  {
    [CmdletBinding()]
    param (
        [Microsoft.Azure.Storage.Blob.CloudBlockBlob] [Parameter(Mandatory=$true)] $CloudBlockBlob
    )
    process {
        # Stores the block list in a variable from the block blob.
        $blockList = $CloudBlockBlob.DownloadBlockListAsync()

        # Return the Block List
        $blockList
    }
}


$CloudBlockBlob = Get-NSGFlowLogCloudBlockBlob -subscriptionId "yourSubscriptionId" -NSGResourceGroupName "FLOWLOGSVALIDATIONWESTCENTRALUS" -NSGName "V2VALIDATIONVM-NSG" -storageAccountName "yourStorageAccountName" -storageAccountResourceGroup "ml-rg" -macAddress "000D3AF87856" -logTime "11/11/2018 03:00" 

$blockList = Get-NSGFlowLogBlockList -CloudBlockBlob $CloudBlockBlob
```

# [**Virtual network flow logs**](#tab/vnet)

The following PowerShell script sets up the variables needed to query the virtual network flow log blob and list the blocks within the [CloudBlockBlob](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob) block blob. Update the script to contain valid values for your environment.

```powershell
function Get-VNetFlowLogCloudBlockBlob {
    [CmdletBinding()]
    param (
        [string] [Parameter(Mandatory=$true)] $subscriptionId,
        [string] [Parameter(Mandatory=$true)] $region,
        [string] [Parameter(Mandatory=$true)] $VNetFlowLogName,
        [string] [Parameter(Mandatory=$true)] $storageAccountName,
        [string] [Parameter(Mandatory=$true)] $storageAccountResourceGroup,
        [string] [Parameter(Mandatory=$true)] $macAddress,
        [datetime] [Parameter(Mandatory=$true)] $logTime
    )

    process {
        # Retrieve the primary storage account key to access the virtual network flow logs
        $StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $storageAccountResourceGroup -Name $storageAccountName).Value[0]

        # Setup a new storage context to be used to query the logs
        $ctx = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $StorageAccountKey

        # Container name used by virtual network flow logs
        $ContainerName = "insights-logs-flowlogflowevent"

        # Name of the blob that contains the virtual network flow log
        $BlobName = "flowLogResourceID=/$($subscriptionId.ToUpper())_NETWORKWATCHERRG/NETWORKWATCHER_$($region.ToUpper())_$($VNetFlowLogName.ToUpper())/y=$($logTime.Year)/m=$(($logTime).ToString("MM"))/d=$(($logTime).ToString("dd"))/h=$(($logTime).ToString("HH"))/m=00/macAddress=$($macAddress)/PT1H.json"

        # Gets the storage blog
        $Blob = Get-AzStorageBlob -Context $ctx -Container $ContainerName -Blob $BlobName

        # Gets the block blog of type 'Microsoft.Azure.Storage.Blob.CloudBlob' from the storage blob
        $CloudBlockBlob = [Microsoft.Azure.Storage.Blob.CloudBlockBlob] $Blob.ICloudBlob

        #Return the Cloud Block Blob
        $CloudBlockBlob
    }
}

function Get-VNetFlowLogBlockList  {
    [CmdletBinding()]
    param (
        [Microsoft.Azure.Storage.Blob.CloudBlockBlob] [Parameter(Mandatory=$true)] $CloudBlockBlob
    )
    process {
        # Stores the block list in a variable from the block blob.
        $blockList = $CloudBlockBlob.DownloadBlockListAsync()

        # Return the Block List
        $blockList
    }
}

$CloudBlockBlob = Get-VNetFlowLogCloudBlockBlob -subscriptionId "yourSubscriptionId" -region "yourVNetFlowLogRegion" -VNetFlowLogName "yourVNetFlowLogName" -storageAccountName "yourStorageAccountName" -storageAccountResourceGroup "yourStorageAccountRG" -macAddress "0022485D8CF8" -logTime "07/09/2023 03:00" 

$blockList = Get-VNetFlowLogBlockList -CloudBlockBlob $CloudBlockBlob
```

---

The `$blockList` variable returns a list of the blocks in the blob. Each block blob contains at least two blocks. The first block has a length of 12 bytes and contains the opening brackets of the JSON log. The other block is the closing brackets and has a length of 2 bytes. The following example log has seven individual entries in it. All new entries in the log are added to the end right before the final block.

```
Name                                         Length Committed
----                                         ------ ---------
ZDk5MTk5N2FkNGE0MmY5MTk5ZWViYjA0YmZhODRhYzY=     12      True
NzQxNDA5MTRhNDUzMGI2M2Y1MDMyOWZlN2QwNDZiYzQ=   2685      True
ODdjM2UyMWY3NzFhZTU3MmVlMmU5MDNlOWEwNWE3YWY=   2586      True
ZDU2MjA3OGQ2ZDU3MjczMWQ4MTRmYWNhYjAzOGJkMTg=   2688      True
ZmM3ZWJjMGQ0ZDA1ODJlOWMyODhlOWE3MDI1MGJhMTc=   2775      True
ZGVkYTc4MzQzNjEyMzlmZWE5MmRiNjc1OWE5OTc0OTQ=   2676      True
ZmY2MjUzYTIwYWIyOGU1OTA2ZDY1OWYzNmY2NmU4ZTY=   2777      True
Mzk1YzQwM2U0ZWY1ZDRhOWFlMTNhYjQ3OGVhYmUzNjk=   2675      True
ZjAyZTliYWE3OTI1YWZmYjFmMWI0MjJhNzMxZTI4MDM=      2      True
```


## Read the block blob

In this section, you read the `$blocklist` variable to retrieve the data. In the following example, we iterate through the blocklist to read the bytes from each block and store them in an array. Use the [DownloadRangeToByteArray](/dotnet/api/microsoft.azure.storage.blob.cloudblob.downloadrangetobytearray) method to retrieve the data.

# [**Network security group flow logs**](#tab/nsg)

```powershell
function Get-NSGFlowLogReadBlock  {
    [CmdletBinding()]
    param (
        [System.Array] [Parameter(Mandatory=$true)] $blockList,
        [Microsoft.Azure.Storage.Blob.CloudBlockBlob] [Parameter(Mandatory=$true)] $CloudBlockBlob

    )
    # Set the size of the byte array to the largest block
    $maxvalue = ($blocklist | measure Length -Maximum).Maximum

    # Create an array to store values in
    $valuearray = @()

    # Define the starting index to track the current block being read
    $index = 0

    # Loop through each block in the block list
    for($i=0; $i -lt $blocklist.count; $i++)
    {
        # Create a byte array object to story the bytes from the block
        $downloadArray = New-Object -TypeName byte[] -ArgumentList $maxvalue

        # Download the data into the ByteArray, starting with the current index, for the number of bytes in the current block. Index is increased by 3 when reading to remove preceding comma.
        $CloudBlockBlob.DownloadRangeToByteArray($downloadArray,0,$index, $($blockList[$i].Length)) | Out-Null

        # Increment the index by adding the current block length to the previous index
        $index = $index + $blockList[$i].Length

        # Retrieve the string from the byte array

        $value = [System.Text.Encoding]::ASCII.GetString($downloadArray)

        # Add the log entry to the value array
        $valuearray += $value
    }
    #Return the Array
    $valuearray
}
$valuearray = Get-NSGFlowLogReadBlock -blockList $blockList -CloudBlockBlob $CloudBlockBlob
```

# [**Virtual network flow logs**](#tab/vnet)

```powershell
function Get-VNetFlowLogReadBlock  {
    [CmdletBinding()]
    param (
        [System.Array] [Parameter(Mandatory=$true)] $blockList,
        [Microsoft.Azure.Storage.Blob.CloudBlockBlob] [Parameter(Mandatory=$true)] $CloudBlockBlob

    )
    $blocklistResult = $blockList.Result
    
    # Set the size of the byte array to the largest block
    $maxvalue = ($blocklistResult | Measure-Object Length -Maximum).Maximum
    Write-Host "Max value is ${maxvalue}"

    # Create an array to store values in
    $valuearray = @()

    # Define the starting index to track the current block being read
    $index = 0

    # Loop through each block in the block list
    for($i=0; $i -lt $blocklistResult.count; $i++)
    {
        # Create a byte array object to story the bytes from the block
        $downloadArray = New-Object -TypeName byte[] -ArgumentList $maxvalue

        # Download the data into the ByteArray, starting with the current index, for the number of bytes in the current block. Index is increased by 3 when reading to remove preceding comma.
        $CloudBlockBlob.DownloadRangeToByteArray($downloadArray,0,$index, $($blockListResult[$i].Length)) | Out-Null

        # Increment the index by adding the current block length to the previous index
        $index = $index + $blockListResult[$i].Length

        # Retrieve the string from the byte array

        $value = [System.Text.Encoding]::ASCII.GetString($downloadArray)

        # Add the log entry to the value array
        $valuearray += $value
    }
    #Return the Array
    $valuearray
}

$valuearray = Get-VNetFlowLogReadBlock -blockList $blockList -CloudBlockBlob $CloudBlockBlob
```

---

The `$valuearray` array contains now the string value of each block. To verify the entry, get the second to the last value from the array by running `$valuearray[$valuearray.Length-2]`. You don't need the last value because it's the closing bracket.

The results of this value are shown in the following example:

# [**Network security group flow logs**](#tab/nsg)

```json
{
	"records": [
		{
			"time": "2017-06-16T20:59:43.7340000Z",
			"systemId": "abcdef01-2345-6789-0abc-def012345678",
			"category": "NetworkSecurityGroupFlowEvent",
			"resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MYNSG",
			"operationName": "NetworkSecurityGroupFlowEvents",
			"properties": {
				"Version": 1,
				"flows": [
					{
						"rule": "DefaultRule_AllowInternetOutBound",
						"flows": [
							{
								"mac": "000D3A18077E",
								"flowTuples": [
									"1497646722,10.0.0.4,168.62.32.14,44904,443,T,O,A",
									"1497646722,10.0.0.4,52.240.48.24,45218,443,T,O,A",
									"1497646725,10.0.0.4,168.62.32.14,44910,443,T,O,A",
									"1497646725,10.0.0.4,52.240.48.24,45224,443,T,O,A",
									"1497646728,10.0.0.4,168.62.32.14,44916,443,T,O,A",
									"1497646728,10.0.0.4,52.240.48.24,45230,443,T,O,A",
									"1497646732,10.0.0.4,168.62.32.14,44922,443,T,O,A",
									"1497646732,10.0.0.4,52.240.48.24,45236,443,T,O,A"
								]
							}
						]
					},
					{
						"rule": "DefaultRule_DenyAllInBound",
						"flows": []
					},
					{
						"rule": "UserRule_ssh-rule",
						"flows": []
					},
					{
						"rule": "UserRule_web-rule",
						"flows": [
							{
								"mac": "000D3A18077E",
								"flowTuples": [
									"1497646738,13.82.225.93,10.0.0.4,1180,80,T,I,A",
									"1497646750,13.82.225.93,10.0.0.4,1184,80,T,I,A",
									"1497646768,13.82.225.93,10.0.0.4,1181,80,T,I,A",
									"1497646780,13.82.225.93,10.0.0.4,1336,80,T,I,A"
								]
							}
						]
					}
				]
			}
		}
	]
}
```

# [**Virtual network flow logs**](#tab/vnet)

```json
{
    "time": "2023-07-09T03:59:30.2837112Z",
    "flowLogVersion": 4,
    "flowLogGUID": "abcdef01-2345-6789-0abc-def012345678",
    "macAddress": "0022485D8CF8",
    "category": "FlowLogFlowEvent",
    "flowLogResourceID": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_EASTUS/FLOWLOGS/MYVNET-MYRESOURCEGROUP-FLOWLOG",
    "targetResourceID": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet",
    "operationName": "FlowLogFlowEvent",
    "flowRecords": {
        "flows": [
            {
                "aclID": "00000000-1234-abcd-ef00-c1c2c3c4c5c6",
                "flowGroups": [
                    {
                        "rule": "BlockHighRiskTCPPortsFromInternet",
                        "flowTuples": [
                            "1688875131557,45.119.212.87,192.168.0.4,53018,3389,6,I,D,NX,0,0,0,0"
                        ]
                    },
                    {
                        "rule": "Internet",
                        "flowTuples": [
                            "1688875103311,35.203.210.145,192.168.0.4,56688,52113,6,I,D,NX,0,0,0,0",
                            "1688875119073,162.216.150.87,192.168.0.4,50111,9920,6,I,D,NX,0,0,0,0",
                            "1688875119910,205.210.31.253,192.168.0.4,54699,1801,6,I,D,NX,0,0,0,0",
                            "1688875121510,35.203.210.49,192.168.0.4,49250,33013,6,I,D,NX,0,0,0,0",
                            "1688875121684,162.216.149.206,192.168.0.4,49776,1290,6,I,D,NX,0,0,0,0",
                            "1688875124012,91.148.190.134,192.168.0.4,57963,40544,6,I,D,NX,0,0,0,0",
                            "1688875138568,35.203.211.204,192.168.0.4,51309,46956,6,I,D,NX,0,0,0,0",
                            "1688875142490,205.210.31.18,192.168.0.4,54140,30303,6,I,D,NX,0,0,0,0",
                            "1688875147864,194.26.135.247,192.168.0.4,53583,20232,6,I,D,NX,0,0,0,0"
                        ]
                    }
                ]
            }
        ]
    }
}
```

---

## Related content

- [Traffic analytics overview](./traffic-analytics.md)
- [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json)
- [Azure Blob storage bindings for Azure Functions overview](../azure-functions/functions-bindings-storage-blob.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json)
