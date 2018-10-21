---
title: Configure pre and post scripts on your Update Management deployment in Azure (Preview)
description: This article describes how to configure and manage pre and post scripts for update deployments
services: automation
ms.service: automation
ms.component: update-management
author: georgewallace
ms.author: gwallace
ms.date: 09/18/2018
ms.topic: conceptual
manager: carmonm 
---
# Manage pre and post scripts (Preview)

Pre and post scripts let you run PowerShell runbooks in your Automation Account before (pre-task) and after (post-task) an update deployment. Pre and post scripts run in the Azure context and not locally. Pre scripts run at the beginnin of the update deployment. Post scripts run at the end of the deployment and after any reboots that are configured.

## Runbook requirements

For a runbook to be used as a pre or post script, the runbook needs to be imported into your automation account and published. To learn more about this process, see [Publishing a runbook](automation-creating-importing-runbook.md#publishing-a-runbook).

## Using a pre/post script

To use a pre and or post script in an Update Deployment, simply start by creating an Update Deployment. Select **Pre-scripts + Post Scripts (Preview)**. This opens the **Select Pre-scripts + Post-scripts** page.  

![Select scripts](./media/pre-post-scripts/select-scripts.png)

Select the script you want to use, in this example, you used the **UpdateManagement-TurnOnVms** runbook. When you select the runbook the **Configure Script** page opens, provide values for the parameters, and choose **Pre-Script**. Click **OK** when done.

![Configure script](./media/pre-post-scripts/configure-script.png)

Repeat this process for the **UpdateManagement-TurnOffVms** script. But when choosing the **Script type**, choose **Post-Script**.

The **Selected items** section now shows both your scripts selected and on is a pre-script and the other is a post-script.

![Selected items](./media/pre-post-scripts/selected-items.png)

Finish configuring your Update Deployment.

When your Update Deployment is complete, you can go to **Update deployments** to view the results. As you can see the status of the pre-script and post-script are provided.

![Update results](./media/pre-post-scripts/update-results.png)

By clicking into the update deployment run you are provided additional details to the pre and post scripts. A link to the script source at the time of the run is provided.

![Deployment run results](./media/pre-post-scripts/deployment-run.png)

## Passing parameters

When you configure pre and post scripts you can pass in parameters just like scheduling a runbook. Parameters are defined at the time of update deployment creation. In addition to your standard runbook parameters an additional parameter is provided. This parameter is **SoftwareUpdateConfigurationRunContext**. This parameter is a JSON string, and if you define the parameter in your pre or post script, it is automatically passed in by the update deployment. The parameter contains information about the update deployment which is a subset of information returned by the [SoftwareUpdateconfigurations API](/rest/api/automation/softwareupdateconfigurations/getbyname#updateconfiguration) The following table shows you the properties that are provided in the variable:

### SoftwareUpdateConfigurationRunContext properties

|Property  |Description  |
|---------|---------|
|SoftwareUpdateConfigurationName     | The name of the Software Update Configuration        |
|SoftwareUpdateConfigurationRunId     | The unique id for the run.        |
|SoftwareUpdateConfigurationSettings     | A collection of properties related to the Software Update Configuration         |
|SoftwareUpdateConfigurationSettings.operatingSystem     | The operating systems targeted for the update deployment         |
|SoftwareUpdateConfigurationSettings.duration     | The maximum duration of the update deployment run as `PT[n]H[n]M[n]S` as per ISO8601, also called the "maintenance window"          |
|SoftwareUpdateConfigurationSettings.Windows     | A collection of properties related to Windows computers         |
|SoftwareUpdateConfigurationSettings.Windows.excludedKbNumbers     | A list of KBs that are excluded from the update deployment        |
|SoftwareUpdateConfigurationSettings.Windows.includedUpdateClassifications     | Update classifications selected for the update deployment        |
|SoftwareUpdateConfigurationSettings.Windows.rebootSetting     | Reboot settings for the update deployment        |
|azureVirtualMachines     | A list of resourceIds for the Azure VMs in the update deployment        |
|nonAzureComputerNames|A list of the Non-Azure computers FQDNs in the update deployment|

The following is an example of a JSON string passed in to the **SoftwareUpdateConfigurationRunContext** parameter:

```json
"SoftwareUpdateConfigurationRunContext":{
      "SoftwareUpdateConfigurationName":"sampleConfiguration",
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

A full example with all properties can be found at: [Software Update Configurations - Get By Name](/rest/api/automation/softwareupdateconfigurations/getbyname#examples)

> [!NOTE]
> Computers added to a deployment using [Dynamic groups (preview)](automation-update-management.md#using-dynamic-groups) are not currently part of the **SoftwareUpdateConfigurationRunContext** parameter.

## Samples

Samples for pre and post scripts can be found in the [Script Center Gallery](https://gallery.technet.microsoft.com/scriptcenter/site/search?f%5B0%5D.Type=RootCategory&f%5B0%5D.Value=WindowsAzure&f%5B0%5D.Text=Windows%20Azure&f%5B1%5D.Type=SubCategory&f%5B1%5D.Value=WindowsAzure_automation&f%5B1%5D.Text=Automation&f%5B2%5D.Type=SearchText&f%5B2%5D.Value=update%20management&f%5B3%5D.Type=Tag&f%5B3%5D.Value=Patching&f%5B3%5D.Text=Patching&f%5B4%5D.Type=ProgrammingLanguage&f%5B4%5D.Value=PowerShell&f%5B4%5D.Text=PowerShell), or imported through the Azure portal. To import them through the portal, in your Automation Account, under **Process Automation**, select **Runbooks Gallery**. Use **Update Management** for the filter.

![Gallery list](./media/pre-post-scripts/runbook-gallery.png)

Or you can search for them by their script name as seen in the following list:

* Update Management - Turn On VMs
* Update Management - Turn Off VMs
* Update Management - Run Script Locally
* Update Management - Template for Pre/Post Scripts
* Update Management - Run Script with Run Command

> [!IMPORTANT]
> After you import the runbooks, you must **Publish** them before they can be used. To do that find the runbook in your Automation Account, select **Edit**, and click **Publish**.

The samples are all based on the basic template that is defined in the following example. This template can be used to create your own runbook to use with pre and post scripts. The necessary logic for authenticating with Azure as well as handling the `SoftwareUpdateConfigurationRunContext` parameter are included.

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

## Interacting with Non-Azure machines

Pre and post tasks run in the Azure context and do not have access to Non-Azure machines. In order to interact with the Non-Azure machines you must have the following:

* A Run As account
* Hybrid Runbook Worker installed on the machine
* A runbook you want to run locally
* Parent runbook

To interact with Non-Azure machines a parent runbook is ran in the Azure context. This runbook calls a child runbook with the [Start-AzureRmAutomationRunbook](/powershell/module/azurerm.automation/start-azurermautomationrunbook) cmdlet. You must specify the `-RunOn` parameter and provide the name of the Hybrid Runbook Worker for the script to run on.

```powershell
$ServicePrincipalConnection = Get-AutomationConnection -Name 'AzureRunAsConnection'

Add-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint

$AzureContext = Select-AzureRmSubscription -SubscriptionId $ServicePrincipalConnection.SubscriptionID

$resourceGroup = "AzureAutomationResourceGroup"
$aaName = "AzureAutomationAccountName"

$output = Start-AzureRmAutomationRunbook -Name "StartService" -ResourceGroupName $resourceGroup  -AutomationAccountName $aaName -RunOn "hybridWorker"

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

## Known issues

* You cannot pass objects or arrays to parameters when using pre and post scripts. The runbook will fail.
* Runbooks that are not published are displayed as selectable when choosing a pre or post script. Only runbooks that are published should be chosen as un-published runbooks can not be invoked and will fail.
* Computers added to a deployment using [Dynamic groups (preview)](automation-update-management.md#using-dynamic-groups) are not currently part of the **SoftwareUpdateConfigurationRunContext** parameter that is passed into pre and post scripts.

## Next steps

Continue to the tutorial to learn how to manage updates for your Windows virtual machines.

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)