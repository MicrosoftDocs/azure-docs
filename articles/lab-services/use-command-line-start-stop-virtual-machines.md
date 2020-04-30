---
title: Use command-line tools to start and stop VMs Azure DevTest Labs
description: Learn how to use command-line tools to start and stop virtual machines in Azure DevTest Labs. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2020
ms.author: spelluru

---

# Use command-line tools to start and stop Azure DevTest Labs virtual machines
This article shows you how to use Azure PowerShell or Azure CLI to start or stop virtual machines in a lab in Azure DevTest Labs. You can create PowerShell/CLI scripts to automate these operations. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview
Azure DevTest Labs is a way to create fast, easy, and lean dev/test environments. It allows you to manage cost, quickly provision VMs, and minimize waste.  There are built-in features in the Azure portal that allow you to configure VMs in a lab to automatically start and stop at specific times. 

However, in some scenarios, you may want to automate starting and stopping of VMs from PowerShell/CLI scripts. It gives you some flexibility with starting and stopping individual machines at any time instead of at specific times. Here are some of the situations in which running these tasks by using scripts would be helpful.

- When using a 3-tier application as part of a test environment, the tiers need to be started in a sequence. 
- Turn off a VM when a custom criteria is met to save money. 
- Use it as a task within a CI/CD workflow to start at the beginning of the flow, use the VMs as build machines, test machines, or infrastructure, then stop the VMs when the process is complete. An example of this would be the custom image factory with Azure DevTest Labs.  

## Azure PowerShell

> [!NOTE]
> The following script uses the Azure PowerShell Az module. 

The following PowerShell script starts a VM in a lab. [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction?view=azps-1.7.0) is the primary focus for this script. The **ResourceId** parameter is the fully qualified resource ID for the VM in the lab. The **Action** parameter is where the **Start** or **Stop** options are set depending on what is needed.

```powershell
# The id of the subscription
$subscriptionId = "111111-11111-11111-1111111"

# The name of the lab
$devTestLabName = "yourlabname"

# The name of the virtual machine to be started
$vMToStart = "vmname"

# The action on the virtual machine (Start or Stop)
$vmAction = "Start"

# Select the Azure subscription
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the lab information
$devTestLab = Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceName $devTestLabName

# Start the VM and return a succeeded or failed status
$returnStatus = Invoke-AzResourceAction `
                    -ResourceId "$($devTestLab.ResourceId)/virtualmachines/$vMToStart" `
                    -Action $vmAction `
                    -Force

if ($returnStatus.Status -eq 'Succeeded') {
    Write-Output "##[section] Successfully updated DTL machine: $vMToStart, Action: $vmAction"
}
else {
    Write-Error "##[error]Failed to update DTL machine: $vMToStart, Action: $vmAction"
}
```


## Azure CLI
The [Azure CLI](/cli/azure/get-started-with-azure-cli?view=azure-cli-latest) is another way to automate the starting and stopping of DevTest Labs VMs. Azure CLI can be [installed](/cli/azure/install-azure-cli?view=azure-cli-latest) on different operating systems. The following script gives you commands for starting and stopping a VM in a lab. 

```azurecli
# Sign in to Azure
az login 

## Get the name of the resource group that contains the lab
az resource list --resource-type "Microsoft.DevTestLab/labs" --name "yourlabname" --query "[0].resourceGroup" 

## Start the VM
az lab vm start --lab-name yourlabname --name vmname --resource-group labResourceGroupName

## Stop the VM
az lab vm stop --lab-name yourlabname --name vmname --resource-group labResourceGroupName
```


## Next steps
See the following article for using the Azure portal to do these operations: [Restart a VM](devtest-lab-restart-vm.md).
