---
title: Enable VM insights by using PowerShell
description: This article describes how to enable VM insights for Azure virtual machines or virtual machine scale sets by using Azure PowerShell.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
author: guywi-ms
ms.author: guywild
ms.date: 05/20/2024
---

# Enable VM insights by using PowerShell
This article describes how to enable VM insights on Azure virtual machines by using PowerShell. This procedure can be used for:

- Azure Virtual Machines
- Azure Virtual Machine Scale Sets

This script installs VM extensions for Azure Monitoring Agent (AMA) and, if necessary, the Dependency Agent to enable VM Insights. If AMA is onboarded, a Data Collection Rule (DCR) and a User Assigned Managed Identity (UAMI) is also associated with the virtual machines and virtual machine scale sets.

> [!NOTE]
> Azure Monitor Agent is supported from version 1.10.1.

## Prerequisites

You need to:

- See [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor Agent.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported.
- To enable network isolation for Azure Monitor Agent, see [Enable network isolation for Azure Monitor Agent by using Private Link](../agents/azure-monitor-agent-private-link.md).


## PowerShell script

To enable VM insights for multiple VMs or virtual machine scale set, use the PowerShell script [Install-VMInsights.ps1](https://www.powershellgallery.com/packages/Install-VMInsights). The script is available from the Azure PowerShell Gallery. This script iterates through the virtual machines or virtual machine scale sets according to the parameters that you specify. The script can be used to enable VM insights for:

- Every virtual machine and virtual machine scale set in your subscription.
- The scoped resource groups specified by `-ResourceGroup`.
- A VM or virtual machine scale set specified by `-Name`.
 You can specify multiple resource groups, VMs, or scale sets by using wildcards.


Verify that you're using Az PowerShell module version 1.0.0 or later with `Enable-AzureRM` compatibility aliases enabled. Run `Get-Module -ListAvailable Az` to find the version. To upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, run `Connect-AzAccount` to create a connection with Azure.

For a list of the script's argument details and example usage, run `Get-Help`.

```powershell
Get-Help Install-VMInsights.ps1 -Detailed
```

Use the script to enable VM insights using Azure Monitoring Agent and Dependency Agent.

When you enable VM insights using Azure Monitor Agent, the script associates a Data Collection Rule (DCR) and a User Assigned Managed Identity (UAMI) to the VM/Virtual Machine Scale Set. The UAMI settings are passed to the Azure Monitor Agent extension.   

```powershell
Install-VMInsights.ps1 -SubscriptionId <SubscriptionId> `
[-ResourceGroup <ResourceGroup>] `
[-ProcessAndDependencies ] `
[-Name <VM or Virtual Machine Scale Set name>] `
-DcrResourceId <DataCollectionRuleResourceId> `
-UserAssignedManagedIdentityName <UserAssignedIdentityName> `
-UserAssignedManagedIdentityResourceGroup <UserAssignedIdentityResourceGroup> 

```

Required Arguments:   
+  `-SubscriptionId <String>`  Azure subscription ID.  
+  `-DcrResourceId <String> `  Data Collection Rule (DCR) Azure resource ID identifier. You can specify DCRs from different subscriptions to the VMs or virtual machine scale sets being enabled with Vm-Insights.
+  `-UserAssignedManagedIdentityResourceGroup <String> `  Name of User Assigned Managed Identity (UAMI) resource group.   
+  `-UserAssignedManagedIdentityName <String> `  Name of User Assigned Managed Identity (UAMI).  


Optional Arguments:   
+ `-ProcessAndDependencies` Set this flag to onboard the Dependency Agent with Azure Monitoring Agent (AMA) settings.  If not specified, only the Azure Monitoring Agent (AMA)  is onboarded.  
+ `-Name <String>` Name of the VM or Virtual Machine Scale Set to be onboarded. If not specified, all VMs and Virtual Machine Scale Set in the subscription or resource group are onboarded. Use wildcards to specify multiple VMs or Virtual Machine Scale Sets.
+ `-ResourceGroup <String>` Name of the resource group containing the VM or Virtual Machine Scale Set to be onboarded. If not specified, all VMs and Virtual Machine Scale Set in the subscription are onboarded. Use wildcards to specify multiple resource groups.
+ `-PolicyAssignmentName <String>` Only include VMs associated with this policy.   When the PolicyAssignmentName parameter is specified, the VMs part of the parameter SubscriptionId are considered. 
+ `-TriggerVmssManualVMUpdate [<SwitchParameter>]` Trigger the update of VM instances in a scale set whose upgrade policy is set to Manual. 
+ `-WhatIf [<SwitchParameter>]` Get info about expected effect of the commands in the script.         
+ `-Confirm [<SwitchParameter>]` Confirm each action in the script. 
+ `-Approve [<SwitchParameter>]` Provide the approval for the installation to start with no confirmation prompt for the listed VM's/Virtual Machine Scale Sets. 
 
The script supports wildcards for `-Name` and `-ResourceGroup`. For example, `-Name vm*` enables VM insights for all VMs and Virtual Machine Scale Sets that start with "vm". For more information, see [Wildcards in Windows PowerShell](/powershell/module/microsoft.powershell.core/about/about_wildcards). 

Example:
```azurepowershell
Install-VMInsights.ps1 -SubscriptionId 12345678-abcd-abcd-1234-12345678 `
-ResourceGroup rg-AMAPowershell  `
-ProcessAndDependencies  `
-Name vmAMAPowershellWindows `
-DcrResourceId /subscriptions/12345678-abcd-abcd-1234-12345678/resourceGroups/rg-AMAPowershell/providers/Microsoft.Insights/dataCollectionRules/MSVMI-ama-vmi-default-dcr `
-UserAssignedManagedIdentityName miamatest1  `
-UserAssignedManagedIdentityResourceGroup amapowershell
```

The output has the following format:

```powershell
Name                                     Account                               SubscriptionName                      Environment                          TenantId
----                                     -------                               ----------------                      -----------                          --------
AzMon001 12345678-abcd-123…              MSI@9876                              AzMon001                              AzureCloud                           abcd1234-9876-abcd-1234-1234abcd5648

Getting list of VMs or VM Scale Sets matching specified criteria.
VMs and Virtual Machine Scale Sets matching selection criteria :

ResourceGroup : rg-AMAPowershell
  vmAMAPowershellWindows


Confirm
Continue?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): 

(rg-AMAPowershell) : Assigning roles

(rg-AMAPowershell) vmAMAPowershellWindows : Assigning User Assigned Managed Identity edsMIAMATest
(rg-AMAPowershell) vmAMAPowershellWindows : Successfully assigned User Assigned Managed Identity edsMIAMATest
(rg-AMAPowershell) vmAMAPowershellWindows : Data Collection Rule Id /subscriptions/12345678-abcd-abcd-1234-12345678/resourceGroups/rg-AMAPowershell/providers/Microsoft.Insights/dataCollectionRules/MSVMI-ama-vmi-default-dcr already associated with the VM.
(rg-AMAPowershell) vmAMAPowershellWindows : Extension AzureMonitorWindowsAgent, type = Microsoft.Azure.Monitor.AzureMonitorWindowsAgent already installed. Provisioning State : Succeeded
(rg-AMAPowershell) vmAMAPowershellWindows : Installing/Updating extension AzureMonitorWindowsAgent, type = Microsoft.Azure.Monitor.AzureMonitorWindowsAgent
(rg-AMAPowershell) vmAMAPowershellWindows : Successfully installed/updated extension AzureMonitorWindowsAgent, type = Microsoft.Azure.Monitor.AzureMonitorWindowsAgent
(rg-AMAPowershell) vmAMAPowershellWindows : Installing/Updating extension DA-Extension, type = Microsoft.Azure.Monitoring.DependencyAgent.DependencyAgentWindows
(rg-AMAPowershell) vmAMAPowershellWindows : Successfully installed/updated extension DA-Extension, type = Microsoft.Azure.Monitoring.DependencyAgent.DependencyAgentWindows
(rg-AMAPowershell) vmAMAPowershellWindows : Successfully onboarded VM insights

Summary :
Total VM/VMSS to be processed : 1
Succeeded : 1
Skipped : 0
Failed : 0
VMSS Instance Upgrade Failures : 0
```    

Check your VM/Virtual Machine Scale Set in Azure portal to see if the extensions are installed or use the following command:

```powershell

az vm extension list --resource-group <resource group> --vm-name <VM name>  -o table 


Name                      ProvisioningState    Publisher                                   Version    AutoUpgradeMinorVersion
------------------------  -------------------  ------------------------------------------  ---------  -------------------------
AzureMonitorWindowsAgent  Succeeded            Microsoft.Azure.Monitor                     1.16       True
DA-Extension              Succeeded            Microsoft.Azure.Monitoring.DependencyAgent  9.10       True
```

## Next steps

* See [Use VM insights Map](vminsights-maps.md) to view discovered application dependencies.
* See [View Azure VM performance](vminsights-performance.md) to identify bottlenecks, overall utilization, and your VM's performance.
