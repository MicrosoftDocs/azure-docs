---
title: Use command-line tools to start and stop VMs
description: Learn how to use command-line tools to start and stop virtual machines in Azure DevTest Labs. 
ms.topic: how-to
ms.date: 10/22/2021 
ms.custom: devx-track-azurepowershell
---

# Use command-line tools to start and stop Azure DevTest Labs virtual machines

This article shows you how to start or stop a lab virtual machines in Azure DevTest Labs. You can create Azure PowerShell or Azure CLI scripts to automate these operations. 

## Prerequisites
- If using PowerShell, you'll need the [Az Module](/powershell/azure/new-azureps-module-az) installed on your workstation. Ensure you have the latest version. If necessary, run `Update-Module -Name Az`.

- If wanting to use Azure CLI and you haven't yet installed it, see [Install the Azure CLI](/cli/azure/install-azure-cli).

- A virtual machine in a DevTest Labs lab.

## Overview

Azure DevTest Labs provides a way to create fast, easy, and lean dev/test environments. Labs allow you to manage cost, quickly create VMs, and minimize waste. You can use the features in the Azure portal to automatically start and stop VMs at specific times. However, you may want to automate the starting and stopping of VMs from scripts. Here are some situations in which running these tasks by using scripts would be helpful.

- When using a three-tier application as part of a test environment and the tiers need to be started in a sequence. 
- To turn off a VM when a custom criteria is met to save money. 
- As a task within a continuous integration and continuous delivery workflow to start at the beginning, and then stop the VMs when the process is complete. An example of this workflow would be the custom image factory with Azure DevTest Labs.  

## Azure PowerShell

The following PowerShell script can start or stop a VM in a lab. [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) is the primary focus for this script. The **ResourceId** parameter is the fully qualified resource ID for the VM in the lab. The **Action** parameter is where the **Start** or **Stop** options are set depending on what is needed.

1. From your workstation, sign in to your Azure subscription with the PowerShell [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the on-screen directions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # If you have multiple subscriptions, set the one to use
    # Set-AzContext -SubscriptionId "<SUBSCRIPTIONID>"
    ```

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $devTestLabName = "yourlabname"
    $vMToStart = "vmname"
    
    # The action on the virtual machine (Start or Stop)
    $vmAction = "Start"
    ```

1. Start or stop the VM based on the value you passed to `$vmAction`.

    ```powershell
    # Get the lab information
    $devTestLab = Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceName $devTestLabName
    
    # Start or stop the VM and return a succeeded or failed status
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

The [Azure CLI](/cli/azure/get-started-with-azure-cli) is another way to automate the starting and stopping of DevTest Labs VMs. The following script gives you commands for starting and stopping a VM in a lab. The use of variables in this section is based on a Windows environment. Slight variations will be needed for bash or other environments.

1. Replace `SubscriptionID`, `yourlabname`, `yourVM`, and `action` with the appropriate values. Then execute the script.

    ```azurecli
    set SUBSCIPTIONID=SubscriptionID
    set DEVTESTLABNAME=yourlabname
    set VMNAME=yourVM
    
    REM The action on the virtual machine (Start or Stop)
    set ACTION=action
    ```

1. Sign in to your Azure subscription and get the name of the resource group that contains the lab.

    ```azurecli
    az login
    
    REM If you have multiple subscriptions, set the one to use
    REM az account set --subscription %SUBSCIPTIONID%

    az resource list --resource-type "Microsoft.DevTestLab/labs" --name %DEVTESTLABNAME% --query "[0].resourceGroup"
    ```

1. Replace `resourceGroup` with the value obtained from the prior step. Then execute the script.

    ```azurecli
    set RESOURCEGROUP=resourceGroup
    ```

1. Start or stop the VM based on the value you passed to `ACTION`.

    ```azurecli
    az lab vm %ACTION% --lab-name %DEVTESTLABNAME% --name %VMNAME% --resource-group %RESOURCEGROUP%
    ```

## Next steps

See the following article for using the Azure portal to do these operations: [Restart a VM](devtest-lab-restart-vm.md).
