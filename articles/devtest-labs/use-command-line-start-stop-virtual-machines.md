---
title: Use commands to start and stop lab VMs
description: Use Azure PowerShell or Azure CLI command lines and scripts to start and stop Azure DevTest Labs virtual machines (VMs).
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/27/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli, UpdateFrequency2 
ms.devlang: azurecli

#customer intent: As a lab user, I want to use PowerShell or Azure CLI commands to start and stop VMs so I can support automated workflows and save costs.
---

# Use commands to start and stop DevTest Labs VMs

This article shows how you can use PowerShell or Azure CLI commands to script or automate start or stop for Azure DevTest Labs VMs. For example, you can use start or stop commands to:

- Test a three-tier application where the tiers need to start in a sequence.
- Turn off your VMs to save costs when they meet custom criteria.
- Start and stop a VM when a continuous integration and continuous delivery (CI/CD) workflow begins and finishes. For an example of this workflow, see [Run an image factory from Azure DevOps](image-factory-set-up-devops-lab.md).

>[!NOTE]
>You can also start, stop, or [restart](devtest-lab-restart-vm.md) DevTest Labs VMs by using the Azure portal. Lab admins can use the portal to configure [automatic startup](devtest-lab-auto-startup-vm.yml) and [automatic shutdown](devtest-lab-auto-shutdown.md) schedules and policies for lab VMs.

## Prerequisites

# [Azure PowerShell](#tab/PowerShell)

- Admin access to a [lab VM](devtest-lab-add-vm.md) in DevTest Labs.
- Access to Azure PowerShell. You can [use the Azure Cloud Shell PowerShell environment](/azure/cloud-shell/quickstart), or [install Azure PowerShell](/powershell/azure/install-azure-powershell) to use a physical or virtual machine. If necessary, run `Update-Module -Name Az` to update your installation.

# [Azure CLI](#tab/CLI)

- Admin access to a [lab VM](devtest-lab-add-vm.md) in DevTest Labs.
- Access to Azure CLI. You can [use the Azure Cloud Shell Bash environment](/azure/cloud-shell/quickstart), or [install Azure CLI](/cli/azure/install-azure-cli) to use a physical or virtual machine with a Bash or Windows environment.

---

## Start or stop a VM

# [Azure PowerShell](#tab/PowerShell)

The following PowerShell script starts or stops a VM in a lab by using the [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) PowerShell cmdlet. The `ResourceId` parameter is the fully qualified ID for the lab VM you want to start or stop. The `Action` parameter determines whether to start or stop the VM, depending on which action you need.

1. If you use Cloud Shell, make sure the **PowerShell** environment is selected.

1. Use the PowerShell [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet to sign in to your Azure account. If you have multiple Azure subscriptions, uncomment `Set-AzContext` and provide the `<SubscriptionId>` you want to use.

    ```powershell
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # Set-AzContext -SubscriptionId "<Subscription ID>"
    ```

1. Set variables by providing your own values for `<lab name>`, `<VM name>`, and whether to `Start` or `Stop` the VM.

    ```powershell
    $devTestLabName = "<lab name>"
    $vMToStart = "<VM name>"
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
        Write-Error "##[error] Failed to update DTL machine: $vMToStart, Action: $vmAction"
    }
    ```

# [Azure CLI](#tab/CLI)

The following script uses the Azure CLI [az lab vm start](/cli/azure/lab/vm#az-lab-vm-start) or [az lab vm stop](/cli/azure/lab/vm#az-lab-vm-stop) command to start or stop a lab VM.

To run the script locally, use the appropriate syntax depending on whether you have a Bash or Windows environment. In Cloud Shell, use the **Bash** environment and syntax.

1. Sign in to your Azure account. If you have multiple Azure subscriptions, uncomment the `az account set` line and provide a subscription ID to use.

   ```azurecli
   az login
   
   REM az account set --subscription <SubscriptionId>
   ```

1. If you don't know the name of the Azure resource group that contains your lab, find it by providing your `<lab name>` in the following query.

   ```azurecli
   az resource list --resource-type "Microsoft.DevTestLab/labs" --name "<lab name>" --query "[0].resourceGroup"
   ```

1. Set variables by providing values for `<SubscriptionId>`, `<resourceGroup>`, `<lab name>`, `<VM name>`, and whether to `Start` or `Stop` the VM.

   **Bash**

   ```azurecli
   SUBSCRIPTIONID=<SubscriptionId>
   RESOURCEGROUP=<resourceGroup>
   DEVTESTLABNAME=<lab name>
   VMNAME=<VM name>
   ACTION=<Start or Stop>
   ```

   **Windows**

   ```azurecli
   set SUBSCRIPTIONID=<SubscriptionId>
   set RESOURCEGROUP=<resourceGroup>
   set DEVTESTLABNAME=<lab name>
   set VMNAME=<VM name>
   set ACTION=<Start or Stop>
   ```

1. Run the following Azure CLI command to start or stop the VM, based on the value passed to `ACTION`.

   **Bash**

   ```azurecli
   az lab vm $ACTION --lab-name $DEVTESTLABNAME --name $VMNAME --resource-group $RESOURCEGROUP
   ```

   **Windows**

   ```azurecli
   az lab vm %ACTION% --lab-name %DEVTESTLABNAME% --name %VMNAME% --resource-group %RESOURCEGROUP%
   ```

---

## Related content

- [Azure CLI az lab reference](/cli/azure/lab)
- [PowerShell Az.DevTestLabs reference](/powershell/module/az.devtestlabs)
- [Define the startup order for DevTest Labs VMs](start-machines-use-automation-runbooks.md)
