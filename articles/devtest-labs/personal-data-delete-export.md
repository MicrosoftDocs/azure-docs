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

**Setting email at the lab:**

![Setting email at the lab level](./media/personal-data-delete-export/lab-user-email.png)

**Setting email at the VM:**

![Setting email at the VM level](./media/personal-data-delete-export/vm-user-email.png)

## Why do we need this personal data?
The DevTest Labs service uses the personal data for operational purposes. This data is critical for the service to deliver key features. If you set a retention policy on the user email address, lab users do not receive timely auto shutdown email notifications after their email address is deleted from our system. Therefore, this data needs to be retained for as long as the user's resource is active in the Lab.

## How can I have the system to forget my personal data?
As a lab user, if you like to have this personal data deleted, you can do so by deleting the corresponding resource in the Lab. The DevTest Labs service anonymizes the deleted personal data 30 days after it's deleted by the user.

For example, If you delete your VM, or removed your email address, the DevTest Labs service anonymizes this data 30 days after the resource is deleted. The 30-day retention policy after deletion is to make sure that we provide an accurate month-over-month cost projection to the lab admin.

## How can I request an export on my personal data?
You can export personal and lab usage data by using the Azure PowerShell. The data will be exported as a csv file with the date and time of the export requested in the name.

### Azure PowerShell

```powershell
Param (
    [Parameter (Mandatory=$true, HelpMessage="The storage account name where to store usage data")]
    [string] $storageAccountName,

    [Parameter (Mandatory=$true, HelpMessage="The storage account key")]
    [string] $storageKey,

    [Parameter (Mandatory=$true, HelpMessage="The DevTest Lab name to get usage data from")]
    [string] $labName,

    [Parameter (Mandatory=$true, HelpMessage="The DevTest Lab subscription")]
    [string] $labSubscription
    )

#Login
Login-AzureRmAccount

# Set the subscription for the lab
Get-AzureRmSubscription -SubscriptionId $labSubscription  | Select-AzureRmSubscription

# DTL will create this container in the storage when invoking the action, cannot be changed currently
$containerName = "labresourceusage"

# Get the storage context
$Ctx = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageKey 
$SasToken = New-AzureStorageAccountSASToken -Service Blob, File -ResourceType Container, Service, Object -Permission rwdlacup -Protocol HttpsOnly -Context $Ctx

# Generate the storage blob uri
$blobUri = $Ctx.BlobEndPoint + $SasToken

# blobStorageAbsoluteSasUri and usageStartDate are required
$actionParameters = @{
    'blobStorageAbsoluteSasUri' = $blobUri    
}

$startdate = (Get-Date).AddDays(-7)

$actionParameters.Add('usageStartDate', $startdate.Date.ToString())

# Get the lab resource group
$resourceGroupName = (Find-AzureRmResource -ResourceType 'Microsoft.DevTestLab/labs' | Where-Object { $_.Name -eq $labName}).ResourceGroupName
    
# Create the lab resource id
$resourceId = "/subscriptions/" + $labSubscription + "/resourceGroups/" + $resourceGroupName + "/providers/Microsoft.DevTestLab/labs/" + $labName + "/"

# !!!!!!! this is the new resource action to get the usage data.
$result = Invoke-AzureRmResourceAction -Action 'exportLabResourceUsage' -ResourceId $resourceId -Parameters $actionParameters -Force
 
# Finish up cleanly
if ($result.Status -eq "Succeeded") {
    Write-Output "Telemetry successfully downloaded for " $labName
    return 0
}
else
{
    Write-Output "Failed to download lab: " + $labName
    Write-Error $result.toString()
    return -1
}
```

The key components in the above sample are:

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
