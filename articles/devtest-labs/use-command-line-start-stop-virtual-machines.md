---
title: Use command lines to start and stop lab VMs
description: See how to use Azure PowerShell or Azure CLI command lines and scripts to start and stop Azure DevTest Labs virtual machines.
ms.topic: how-to
ms.date: 03/23/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Use command lines to start and stop DevTest Labs virtual machines

This article shows you how to start or stop Azure DevTest Labs virtual machines (VMs) by using Azure PowerShell or Azure CLI command lines and scripts.

You can start, stop, or [restart](devtest-lab-restart-vm.md) DevTest Labs VMs by using the Azure portal. You can configure [automatic startup](devtest-lab-auto-startup-vm.md) and [automatic shutdown](devtest-lab-auto-shutdown.md) schedules and policies for lab VMs.

You can also use Azure PowerShell or Azure CLI commands and scripts to automate starting and stopping lab VMs. Use these commands for situations like:

- Testing a three-tier application, where the tiers need to start in a sequence.
- Turning off VMs when they meet custom criteria, to save costs.
- Starting when a continuous integration and continuous delivery (CI/CD) workflow begins, and stopping when the workflow finishes. For an example, see [Run an image factory from Azure DevOps](image-factory-set-up-devops-lab.md).

## Prerequisites

- A lab VM in DevTest Labs.

- For Azure PowerShell, the [Az module](/powershell/azure/new-azureps-module-az) installed on your workstation. Make sure you have the latest version. If necessary, run `Update-Module -Name Az` to update the module.

- For Azure CLI, [Azure CLI installed](/cli/azure/install-azure-cli) on your workstation.

## Azure PowerShell script

The following PowerShell script starts or stops a VM in a lab by using [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction). The `ResourceId` parameter is the fully qualified ID for the lab VM you want to start or stop. The `Action` parameter determines whether to start or stop the VM, depending on which action you need.

1. From your workstation, use the PowerShell [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet to sign in to your Azure account. Follow the on-screen instructions.

   If you have multiple Azure subscriptions, uncomment the `Set-AzContext` line and fill in the `<Subscription ID>` you want to use.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # If you have multiple subscriptions, set the one to use
    # Set-AzContext -SubscriptionId "<Subscription ID>"
    ```

1. Provide values for the `<lab name>` and `<VM name>`, and enter which action you want for `<Start or Stop>`.

    ```powershell
    $devTestLabName = "<lab name>"
    $vMToStart = "<VM name>"
    
    # The action on the virtual machine (Start or Stop)
    $vmAction = "<Start or Stop>"
    ```

1. Start or stop the VM, based on the value you passed to `$vmAction`.

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

## Azure CLI script

The following script provides [Azure CLI](/cli/azure/get-started-with-azure-cli) commands for starting or stopping a lab VM. The variables in this script are for a Windows environment. Bash or other environments have slight variations.

1. Provide appropriate values for `<Subscription ID>`, `<lab name>`, `<VM name>`, and the `<Start or Stop>` action to take.

    ```azurecli
    set SUBSCIPTIONID=<Subscription ID>
    set DEVTESTLABNAME=<lab name>
    set VMNAME=<VM name>
    
    REM The action on the virtual machine (Start or Stop)
    set ACTION=<Start or Stop>
    ```

1. Sign in to your Azure subscription, and get the name of the resource group that contains the lab.

   If you have multiple Azure subscriptions, uncomment the `az account set` line to use the subscription ID you provided.

    ```azurecli
    az login
    
    REM If you have multiple subscriptions, set the one to use
    REM az account set --subscription %SUBSCIPTIONID%

    az resource list --resource-type "Microsoft.DevTestLab/labs" --name %DEVTESTLABNAME% --query "[0].resourceGroup"
    ```

1. Replace `<resourceGroup>` with the value you got from the previous step.

    ```azurecli
    set RESOURCEGROUP=<resourceGroup>
    ```

1. Run the command line to start or stop the VM, based on the value you passed to `ACTION`.

    ```azurecli
    az lab vm %ACTION% --lab-name %DEVTESTLABNAME% --name %VMNAME% --resource-group %RESOURCEGROUP%
    ```

## Next steps

- [Azure CLI az lab reference](/cli/azure/lab)
- [PowerShell Az.DevTestLabs reference](/powershell/module/az.devtestlabs)
- [Define the startup order for DevTest Lab VMs](start-machines-use-automation-runbooks.md)
