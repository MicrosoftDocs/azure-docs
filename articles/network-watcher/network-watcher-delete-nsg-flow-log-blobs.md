---
title: Delete storage blobs for network security group flow logs in Azure Network Watcher | Microsoft Docs
description: This article explains how to delete the network security group flow log storage blobs that are outside their retention policy period in Azure Network Watcher.
services: network-watcher
documentationcenter: na
author: damendo
manager: 
editor: 
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 08/16/2019
ms.author: damendo

---

# Delete network security group flow log storage blobs in Network Watcher

This article describes how to manually delete network security group (NSG) flow logs storage blobs that have a non-zero retention policy using an Azure PowerShell script.

[Network security group flow logs](network-watcher-nsg-flow-logging-overview.md) are a feature of Network Watcher that allows you to view information about ingress and egress IP traffic through an NSG. Flow logs are stored within a storage account and are maintained based on the value set for the retention policy. You can set log retention policy from one day to 2,147,483,647 days. If a retention policy is not set, the logs are maintained forever.

Retention policies on NSG flow logs were recently turned off. As a result, you can no longer use retention policies for Network Watcher NSG flow logs to automatically delete the logs from Blob storage. You must now run a PowerShell script to manually delete the flow logs from your storage account as described in this article.

## Delete NSG flow logs from storage account using an Azure PowerShell script
 
1. Download and save the following script to the current working directory or relevant path folders. 

```powershell
# This powershell script deletes all NSG flow log blobs that should not be retained anymore as per configured retention policy.
# While configuring NSG flow logs on Azure portal, the user configures the retention period of NSG flow log blobs in
# their storage account (in days).
# This script reads all blobs and deletes blobs that are not to be retained (outside retention window)
# if the retention days are zero; all blobs are retained forever and hence no blobs are deleted.
#
#

param (
        [string] [Parameter(Mandatory=$true)]  $SubscriptionId,
        [string] [Parameter(Mandatory=$true)]  $Location,
        [switch] [Parameter(Mandatory=$false)] $Confirm
    )

Login-AzAccount

$SubId = Get-AzSubscription| Where-Object {$_.Id.contains($SubscriptionId.ToLower())}

if ($SubId.Count -eq 0)
{
    Write-Error 'The SubscriptionId does not exist' -ErrorAction Stop
}

Set-AzContext -SubscriptionId $SubscriptionId

$NsgList = Get-AzNetworkSecurityGroup | Where-Object {$_.Location -eq $Location}
$NW = Get-AzNetworkWatcher | Where-Object {$_.Location -eq $Location}

$FlowLogsList = @()
foreach ($Nsg in $NsgList)
{
    # Query Flow Log Status which are enabled
    $NsgFlowLog = Get-AzNetworkWatcherFlowLogStatus -NetworkWatcher $NW -TargetResourceId $Nsg.Id | Where-Object {$_.Enabled -eq "True"}
    if ($NsgFlowLog.Count -gt 0)
    {
        $FlowLogsList +=  $NsgFlowLog
        Write-Output ('Enabled NSG found: ' +  $NsgFlowLog.TargetResourceId)
    }
}

foreach ($Psflowlog in $FlowLogsList)
{
    $RetentionDays = $Psflowlog.RetentionPolicy.Days
    if ($RetentionDays -le 0)
    {
        continue
    }

    $Strings = $Psflowlog.StorageId -split '/'
    $RGName = $Strings[4]
    $StorageAccountName = $Strings[-1]

    $Key = (Get-AzStorageAccountKey -ResourceGroupName $RGName -Name $StorageAccountName).Value[1]
    $StorageAccount = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $Key

    $ContainerName = 'insights-logs-networksecuritygroupflowevent'  
    $BLobsList = Get-AzStorageBlob -Container $ContainerName -Context $StorageAccount.Context

    $TargetBLobsList = $BLobsList | Where-Object {$_.Name.contains($Psflowlog.TargetResourceId.ToUpper())}

    $RetentionDate = Get-Date
    $RetentionDate = $RetentionDate.AddDays(-1*$RetentionDays)
    $RetentionDateInUTC = $RetentionDate.ToUniversalTime()

    foreach ($Blob in $TargetBLobsList)
    {
        $BlobLastModifietedDTinUTC = [datetime]$Blob.LastModified.UtcDateTime

        if ($BlobLastModifietedDTinUTC -ge  $RetentionDateInUTC)
        {
            Write-Output ($Blob.Name + '===>' + $BlobLastModifietedDTinUTC  + ' ===> RETAINED')
            continue
        }

        if ($Confirm)
        {
            Write-Output (Blob to be deleted: $Blob.Name)
            $Confirmation = Read-Host "Are you sure you want to remove this blob (Y/N)?"
        }

        if ((-not $Confirm) -or ($Confirmation -eq 'Y'))
        {
            Write-Output ($Blob.Name + '===>' + $BlobLastModifietedDTinUTC  + ' ===> DELETED')
            Remove-AzStorageBlob -Container $container_name -Context $storage_account.Context -Blob $Blob.Name
        }
        else
        {
            Write-Output ($Blob.Name + '===>' + $BlobLastModifietedDTinUTC  + ' ===> RETAINED')
        }
    }
}

Write-Output ('Retention policy for all NSGs evaluated and completed successfully')

```
2. Enter the following parameters in the script as needed:
    1. SubscriptionId [Mandatory]: The subscription ID from where you would like to delete NSG Flow Log blobs.
    2. Location [Mandatory]: The _location string_ of the region of the NSGs for which you would like to delete NSG Flow Log blobs. You can view this information on the Azure portal or from the [list here](https://github.com/Azure/azure-extensions-cli/blob/beb3d3fe984cfa9c7798cb11a274c5337968cbc5/regions.go#L23).
    3. Confirm [Optional]: Pass the confirm flag if you want to manually confirm the deletion of each storage blob.
3. Run the saved script as shown in the following example, where the script file was saved as **Delete-NsgFlowLogsBlobs.ps1**:
     ```
    .\Delete-NsgFlowLogsBlobs.ps1 -SubscriptionId "99999999-9999-9999-9999-999999999999" -Location  "eastus2euap" -Confirm
    ```
## Next steps
- To learn more about NSG logging, see [Azure Monitor logs for network security groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

