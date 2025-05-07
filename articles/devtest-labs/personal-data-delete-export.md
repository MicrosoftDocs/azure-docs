---
title: How to delete and export personal data
description: Learn how to delete and export personal data from the Azure DevLast Labs service to support your obligations under the General Data Protection Regulation (GDPR). 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.custom: UpdateFrequency2
---

# Export or delete personal data from Azure DevTest Labs
This article provides steps for deleting and exporting personal data from the Azure DevTest Labs service. 

## What personal data does DevTest Labs collect?
DevTest Labs collects two main pieces of personal data from the user. They are: user email address and user object ID. This information is critical for the service to provide in-service features to lab admins and lab users.

### User email address
DevTest Labs uses the user email address to send auto shutdown email notifications to lab users. The email notifies users of their machine being shut down. The users can either postpone or skip the shutdown if they wish to do so. You configure the email address at the lab level or at the VM level.

## Why do we need this personal data?
The DevTest Labs service uses the personal data for operational purposes. This data is critical for the service to deliver key features. If you set a retention policy on the user email address, lab users do not receive timely auto shutdown email notifications after their email address is deleted from our system. Therefore, this data needs to be retained for as long as the user's resource is active in the Lab.

## How can I have the system forget my personal data?
As a lab user, you can delete your personal by deleting the corresponding resource in the Lab. The DevTest Labs service anonymizes the deleted personal data 30 days after it's deleted by the user.

For example, if you delete your VM, or remove your email address, the DevTest Labs service anonymizes this data 30 days after the resource is deleted. The 30-day retention policy after deletion ensures that DevTest Labs provides an accurate month-over-month cost projection to the lab admin.

## How can I request an export on my personal data?
You can export personal and lab usage data by using Azure PowerShell. DevTest Labs exports the data as a csv file with the date and time of the export requested in the name.

### Azure PowerShell

```powershell
Param (
    [Parameter (Mandatory=$true, HelpMessage="The resource group name of the storage account")]
[string] $resourceGroupName,
	
	[Parameter (Mandatory=$true, HelpMessage="The subscription id of the storage account and DTL")]    
[string] $subscriptionId,

    [Parameter (Mandatory=$true, HelpMessage="The storage account name")]
[string] $storageAccountName,

    [Parameter (Mandatory=$true, HelpMessage="Expire time of the SAS Token")]
[string] $expiryTime,

    [Parameter (Mandatory=$true, HelpMessage="Date to pull data from")][string] $startTime,

    [Parameter (Mandatory=$true, HelpMessage="Name of the lab to export")]
[string] $labName,

    [Parameter (Mandatory=$true, HelpMessage="The desired SKU")]
[string] $desiredSKU,

    [Parameter (Mandatory=$true, HelpMessage="Protocol for SAS token generation")]
[string] $protocol,

    [Parameter (Mandatory=$true, HelpMessage="Permissions given for SAS token")]
[string] $permissions

# Log in 
Connect-AzAccount -UseDeviceAuthentication
 
# Set your subscription
Set-AzContext -SubscriptionId $subscriptionId
 
 
# Create a resource group and storage account
  New-AzStorageAccount -ResourceGroupName $resourceGroupName `
                     -Name $storageAccountName `
                     -Location $location `
                     -SkuName $desiredSKU
 
# Get storage account context
$storageAccountContext = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -AccountName $storageAccountName
$storageAccountKeys = Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName
 
$Ctx = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKeys[0].Value

# Create blob container
$containerName = "exportlabresources"
New-AzStorageContainer -Name $containerName `
                       -Context $Ctx `
                       -Permission Off

# Get SAS token
$sasToken = New-AzStorageContainerSASToken `
-Context $Ctx `
-Name $containerName `
-StartTime (Get-Date) `
-ExpiryTime $expiryTime `
-Permission $permissions `
-Protocol $protocol

# Make blob endpoint
$blobEndpointWithSas = $storageAccountContext.Context.BlobEndPoint + $containerName+ "?" + $sasToken

# Invoke Export Job
$actionParameters = @{
    'blobStorageAbsoluteSasUri' = $blobEndpointWithSas    
}

$actionParameters.Add('usageStartDate', $startdate.Date.ToString())
 
$resourceId = "/subscriptions/" + $subscriptionId + "/resourceGroups/" + $resourceGroupName + "/providers/Microsoft.DevTestLab/labs/" + $labName + "/"
 
$result = Invoke-AzureRmResourceAction -Action 'ExportResourceUsage' -ResourceId $resourceId -Parameters $actionParameters -Force

```

The key components in the previous sample are:

- The Invoke-AzureRmResourceAction command.

    ```
  Invoke-AzureRmResourceAction -Action 'ExportResourceUsage' -ResourceId $resourceId -Parameters $actionParameters -Force
    ```
- Two action parameters
  - **blobStorageAbsoluteSasUri** - The storage account URI with the Shared Access Signature (SAS) token. In the PowerShell script, this value could be passed in instead of the storage key.
  - **usageStartDate** - The beginning date to pull data, with the end date being the current date on which the action is executed. The granularity is at the day level, so even if you add time information, it will be ignored.
    
## Next steps
See the following article: 

- [Set policies for a lab](devtest-lab-set-lab-policy.md)
