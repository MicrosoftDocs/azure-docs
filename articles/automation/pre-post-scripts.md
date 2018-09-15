---
title: Configure pre and post scripts on your Update Management deployment in Azure
description: This article describes how to configure and manage pre and post scripts for update deployments
services: automation
ms.service: automation
ms.component: update-management
author: georgewallace
ms.author: gwallace
ms.date: 09/14/2018
ms.topic: conceptual
manager: carmonm
---
# Manage pre and post scripts

Pre and post scripts lets you run scripts before (pre-task) and after (post-task) an update deployment. These tasks can target any PowerShell runbook that is in your Automation Account. Pre and post scripts run in Azure and not the local machines.

## Passing parameters

When you configure pre and post scripts you can pass in parameters just like scheduling a runbook. Parameters are defined at the time of update deployment creation. In addition to your standard runbook parameters an additional parameter is provided. This parameter is **SoftwareUpdateConfigurationRunContext**. This parameter is a JSON string, and if you define the paramter in your pre or post script, it is automatically passed in by the update deployment. The parameter contains information about the update deployment. The following table shows you the properties that are provided in the variable:

### SoftwareUpdateConfigurationRunContext properties

|Property  |Description  |
|---------|---------|
|SoftwareUpdateConfigurationName     | The name of the Software Update Configuration        |
|SoftwareUpdateConfigurationRunId     | The unique id for the run.        |
|SoftwareUpdateConfigurationSettings     | A collection of properties related to the Software Update Configuration         |
|SoftwareUpdateConfigurationSettings.operatingSystem     | The operating systems targeted for the update deployment         |
|SoftwareUpdateConfigurationSettings.duration     | The duration of the update deployment run as `PT[n]H[n]M[n]S` as per ISO8601          |
|SoftwareUpdateConfigurationSettings.Windows     | A collection of properties related to Windows computers         |
|SoftwareUpdateConfigurationSettings.Windows.excludedKbNumbers     | A list of KBs that are excluded from the update deployment        |
|SoftwareUpdateConfigurationSettings.Windows.includedUpdateClassifications     | Update classifications selected for the update deployment        |
|SoftwareUpdateConfigurationSettings.Windows.rebootSetting     | Reboot settings for the update deployment        |
|azureVirtualMachines     | A list of resourceIds for the Azure VMs in the update deployment        |
|nonAzureComputerNames|A list of the Non-Azure computers FQDNs in the update deployment|

The following is an example of a JSON string passed in to the **SoftwareUpdateConfigurationRunContext** parameter:

```json
"SoftwareUpdateConfigurationRunContext":{
      "SoftwareUpdateConfigurationName":"sampleSUC",
      "SoftwareUpdateConfigurationRunId":"00000000-0000-0000-0000-000000000000",
      "SoftwareUpdateConfigurationSettings":{
         "operatingSystem":"Windows",
         "duration":"PT2H0M",
         "windows":{
            "excludedKbNumbers":[
               "168934",
               "168973"
            ],
            "includedUpdateClassifications":"Critical",
            "rebootSetting":"IfRequired"
         },
         "azureVirtualMachines":[
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresources/providers/Microsoft.Compute/virtualMachines/vm-01",
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresources/providers/Microsoft.Compute/virtualMachines/vm-02",
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresources/providers/Microsoft.Compute/virtualMachines/vm-03"
         ], 
         "nonAzureComputerNames":[
            "box1.contoso.com",
            "box2.contoso.com"
         ]
      }
   }
```

## Samples

Samples for pre and post tasks can be found at [insert GitHub link here](). The samples 

* UpdateManagement-TurnOnVms
* UpdateManagement-TurnOffVms
* StartLocalService
* StopLocalService

The samples are all based on the basic template that is defined below. This template can be used to create your own runbook to use with pre and post scripts. The necessary logic for authenticating with Azure as well as handling the `SoftwareUpdateConfigurationRunContext` parameter are included.

```powershell
<#
.SYNOPSIS
 Barebones script for Update Management Pre/Post

.DESCRIPTION
  This script is intended to be run as a part of Update Management Pre/Post scripts.
  It requires a RunAs account.

.PARAMETER SoftwareUpdateConfigurationRunContext
  This is a system variable which is automatically passed in by Update Management during a deployment.
#>

param(
    [string]$SoftwareUpdateConfigurationRunContext
)
#region BoilerplateAuthentication
#This requires a RunAs account
$ServicePrincipalConnection = Get-AutomationConnection -Name 'AzureRunAsConnection'

Add-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint

$AzureContext = Select-AzureRmSubscription -SubscriptionId $ServicePrincipalConnection.SubscriptionID
#endregion BoilerplateAuthentication

#If you wish to use the run context, it must be converted from JSON
$context = ConvertFrom-Json  $SoftwareUpdateConfigurationRunContext
#Access the properties of the SoftwareUpdateConfigurationRunContext
$vmIds = $context.SoftwareUpdateConfigurationSettings.AzureVirtualMachines
$runId = $context.SoftwareUpdateConfigurationRunId

Write-Output $context

#Example: How to create and write to a variable using the pre-script:
<#
#Create variable named after this run so it can be retrieved
New-AzureRmAutomationVariable -ResourceGroupName $ResourceGroup –AutomationAccountName $AutomationAccount –Name $runId -Value "" –Encrypted $false
#Set value of variable
Set-AutomationVariable –Name $runId -Value $vmIds
#>

#Example: How to retrieve information from a variable set during the pre-script
<#
$variable = Get-AutomationVariable -Name $runId
#>
```

## Interacting with local machines

Pre and post tasks run in Azure to they do not have access to the local machine. In order to interact with the local machines you must have the following:

* A Run As account
* Hybrid Runbook worker installed
* A runbook you want to run locally
* Parent runbook

```powershell
$ServicePrincipalConnection = Get-AutomationConnection -Name 'AzureRunAsConnection'

Add-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint

$AzureContext = Select-AzureRmSubscription -SubscriptionId $ServicePrincipalConnection.SubscriptionID

$resourceGroup = "DefaultResourceGroup-WCUS"
$aaName = "Automate-5c028ac2-6c43-4fd8-875c-6d059beb2ef5-WCUS"

$output = Start-AzureRmAutomationRunbook -Name "StartService" -ResourceGroupName $resourceGroup  -AutomationAccountName $aaName -RunOn "frontendDemoWorker"

$status = Get-AzureRmAutomationJob -Id $output.jobid -ResourceGroupName $resourceGroup  -AutomationAccountName $aaName
while ($status.status -ne "Completed")
{ 
    Start-Sleep -Seconds 5
    $status = Get-AzureRmAutomationJob -Id $output.jobid -ResourceGroupName $resourceGroup  -AutomationAccountName $aaName
}

$summary = Get-AzureRmAutomationJobOutput -Id $output.jobid -ResourceGroupName $resourceGroup  -AutomationAccountName $aaName

if ($summary.Type -eq "Error")
{
    Write-Error -Message $summary.Summary
}
```

## Next steps

Continue to the tutorial to learn how to manage updates for your Windows virtual machines.

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)