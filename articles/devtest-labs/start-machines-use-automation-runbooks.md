---
title: Define VM start order with Azure Automation
description: Learn how to start virtual machines in a specific order by using Azure Automation runbooks in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: devx-track-azurepowershell, UpdateFrequency2
---

# Define the startup order for DevTest Lab VMs with Azure Automation

This article explains how to start up DevTest Labs virtual machines (VMs) in a specific order by using a PowerShell runbook in Azure Automation. The PowerShell script uses tags on lab VMs, so you can change the startup order without having to change the script.

The DevTest Labs [autostart](devtest-lab-set-lab-policy.md#set-autostart) feature can configure lab VMs to start automatically at a specified time. However, sometimes you might want lab VMs to start in a specific sequence. For example, if a jumpbox VM in a lab is the access point to the other VMs, the jumpbox VM must start before the other VMs.

## Prerequisites

- [Create and apply a tag](devtest-lab-add-tag.md) called **StartupOrder** to all lab VMs with an appropriate startup value, 0 through 10. Designate any machines that don't need starting as -1.

- Create an Azure Automation account by following instructions in [Create a standalone Azure Automation account](../automation/automation-create-standalone-account.md). Choose the **Run As Accounts** option when you create the account.

## Create the PowerShell runbook

1. On the **Overview** page for the Automation Account, select **Runbooks** from the left menu.
1. On the **Runbooks** page, select **Create a runbook**.
1. Follow the instructions in [Create an Automation PowerShell runbook using managed identity](../automation/learn/powershell-runbook-managed-identity.md) to create a PowerShell runbook. Populate the runbook with the following PowerShell script.

## Prepare the PowerShell script

The following script takes the subscription name and the lab name as parameters. The script gets all the VMs in the lab and parses their tag information to create a list of VM names and their startup order. The script walks through the list in order and starts the VMs.

If there are multiple VMs in a specific order number, those VMs start asynchronously using PowerShell jobs. VMs that don't have a tag have their startup value set to 10 and start last by default. The script ignores any VMs that have tag values other than 0 through 10.

```powershell
#Requires -Version 3.0
#Requires -Module AzureRM.Resources

param
(
    [Parameter(Mandatory=$false, HelpMessage="Name of the subscription that has the lab")]
    [string] $SubscriptionName,

    [Parameter(Mandatory=$false, HelpMessage="Lab name")]
    [string] $LabName
)

# Connect and add the appropriate subscription
$Conn = Get-AutomationConnection -Name AzureRunAsConnection

Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationID $Conn.ApplicationId -Subscription $SubscriptionName -CertificateThumbprint $Conn.CertificateThumbprint

# Find the lab
$dtLab = Find-AzResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceNameEquals $LabName

# Get the VMs
$dtlAllVms = New-Object System.Collections.ArrayList
$AllVMs = Get-AzResource -ResourceId "$($dtLab.ResourceId)/virtualmachines" -ApiVersion 2016-05-15

# Get the StartupOrder tag. If missing, set to start up last (10).
ForEach ($vm in $AllVMs) {
    if ($vm.Tags) {
        if ($vm.Tags['StartupOrder']) {
            $startupValue = $vm.Tags['StartupOrder']
        } else {
            $startupValue = 10
        }
        } else {
            $startupValue = 10
        }
        $dtlAllVms.Add(@{$vm.Name = $startupValue}) > $null
}

# Setup for the async multiple vm start

# Save profile
$profilePath = Join-Path $env:Temp "profile.json"
If (Test-Path $profilePath){
    Remove-Item $profilePath
}
Save-AzContext -Path $profilePath

# Job to start VMs asynch
$startVMBlock = {
    Param($devTestLab,$vmToStart,$profilePath)
    Import-AzContext -Path ($profilePath)
    Invoke-AzResourceAction `
        -ResourceId "$($devTestLab.ResourceId)/virtualmachines/$vmToStart" `
        -Action Start `
        -Force
    Write-Output "Started: $vmToStart"
}

$current = 0
# Start in order from 0 to 10

While ($current -le 10) {
# Get the VMs in the current stage
    $tobeStarted = $null
    $tobeStarted = $dtlAllVms | Where-Object { $_.Values -eq $current}
    if ($tobeStarted.Count -eq 1) {
        # Run sync – jobs not necessary for a single VM
        $returnStatus = Invoke-AzResourceAction `
                -ResourceId "$($dtLab.ResourceId)/virtualmachines/$($tobeStarted.Keys)" `
                -Action Start `
                -Force
        Write-Output "$($tobeStarted.Keys) status: $($returnStatus.status)"
    } elseif ($tobeStarted.Count -gt 1) {
        # Start multiple VMs async
        $jobs = @()
        Write-Output "Start Jobs start: $(Get-Date)"
        
        # Jobs
        $jobs += Start-Job -ScriptBlock $startVMBlock -ArgumentList $dtLab, $($singlevm.Keys), $profilePath
        Write-Output "Start Jobs end: $(Get-Date)"
    }

    # Get results from all jobs
    if($jobs.Count -ne 0) {
        Write-Output "Receive Jobs start: $(Get-Date)"
        foreach ($job in $jobs){
            $jobResult = Receive-Job -Job $job -Wait | Write-Output
        }
        Remove-Job -Job $jobs -Force
    }
    else
    {
        Write-Output "Information: No jobs available"
    }
}
```

## Run the script

- To run this script daily, [create a schedule](../automation/shared-resources/schedules.md#create-a-schedule) in the Automation Account, and [link the schedule to the runbook](../automation/shared-resources/schedules.md#link-a-schedule-to-a-runbook).

- In an enterprise scenario that has several subscriptions with multiple labs, you can store the parameter information for different labs and subscriptions in a file. Pass the file to the script instead of passing the individual parameters.

- This example uses Azure Automation to run the PowerShell script, but you can also use other options, like a [build/release pipeline](use-devtest-labs-build-release-pipelines.md).

## Next steps

- [What is Azure Automation?](/azure/automation/automation-intro)
- [Start up lab virtual machines automatically](devtest-lab-auto-startup-vm.md)
- [Use command-line tools to start and stop Azure DevTest Labs virtual machines](use-command-line-start-stop-virtual-machines.md)