---
title: Enable VM insights by using PowerShell
description: This article describes how to enable VM insights for Azure virtual machines or virtual machine scale sets by using Azure PowerShell.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
author: guywi-ms
ms.author: guywild
ms.date: 11/28/2023
---

# Enable VM insights by using PowerShell
This article describes how to enable VM insights on Azure virtual machines by using PowerShell. This procedure can be used for:

- Azure Virtual Machines
- Azure Virtual Machine Scale Sets

This script installs VM extensions for Log Analytics/Azure Monitoring Agent (AMA) and Dependency Agent if needed for VM Insights. If AMA is onboarded, a Data Collection Rule (DCR) and a User Assigned Managed Identity (UAMI) is also associated with the virtual machines and virtual machine scale sets. 

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

## Prerequisites

You need to:

- See [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor Agent.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported.


## PowerShell script

To enable VM insights for multiple VMs or virtual machine scale set, use the PowerShell script [Install-VMInsights.ps1](https://www.powershellgallery.com/packages/Install-VMInsights). The script is available from the Azure PowerShell Gallery. This script iterates through the virtual machines or virtual machine scale sets according to the parameters that you specify. The script can be used to enable VM insights for:

- Every virtual machine and virtual machine scale set in your subscription.
- The scoped resource group that's specified by `-ResourceGroup`.
- A single VM or virtual machine scale set that's specified by `-Name`.


Verify that you're using Az PowerShell module version 1.0.0 or later with `Enable-AzureRM` compatibility aliases enabled. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

For a list of the script's argument details and example usage, run `Get-Help`.

```powershell
Get-Help Install-VMInsights.ps1 -Detailed
```

Use the script to enable VM insights using Azure Monitoring Agent and  Dependency Agent, or Log Analytics Agent.



### [Azure Monitor Agent](#tab/AMA)

When you enable VM insights using Azure Monitor Agent, the script associates a Data Collection Rule (DCR) and a User Assigned Managed Identity (UAMI) to the VM/VMSS, and passes the UAMI settings to the Azure Monitor Agent extension.   

```powershell
Install-VMInsights.ps1 -SubscriptionId <SubscriptionId> `
[-ResourceGroup <ResourceGroup>] `
[-ProcessAndDependencies ] `
[-Name <MV or VMSS name>] `
-DcrResourceId <DataCollectionRuleResourceId> `
-UserAssignedManagedIdentityName <UserAssignedIdentityName> `
-UserAssignedManagedIdentityResourceGroup <UserAssignedIdentityResourceGroup> 

```

Required Arguments:   
 +   `-SubscriptionId <String>`  Azure subscription ID.  
 +   `-DcrResourceId <String> `  Data Collection Rule (DCR) Azure resource ID identifier. 
 +  `-UserAssignedManagedIdentityResourceGroup <String> `  Name of User Assigned Managed Identity (UAMI) resource group.   
 +   `-UserAssignedManagedIdentityName <String> `  Name of User Assigned Managed Identity (UAMI). 

Optional Arguments:   
 +   `-ProcessAndDependencies` Set this flag to onboard the Dependency Agent with Azure Monitoring Agent (AMA) settings.  If not specified, only Azure Monitoring Agent (AMA) will be onboarded.  
 + ` - Name <String>`   Name of the VM or VMSS to be onboarded. If not specified, all VMs and VMSS in the subscription or resource group will be onboarded.
 +    `- ResourceGroup <String>`  Name of the resource group containing the VM or VMSS to be onboarded. If not specified, all VMs and VMSS in the subscription will be onboarded.

Example:
```azurepowershell
Install-VMInsights.ps1  -SubscriptionId 12345678-abcd-abcd-1234-12345678 `
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
AzMon001  12345678-abcd-123…             MSI@9876                              AzMon001                              AzureCloud                           abcd1234-9876-abcd-1234-1234abcd5648

Getting list of VMs or VM Scale Sets matching specified criteria.
VMs and VMSS matching selection criteria :

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


### [Log Analytics Agent](#tab/LogAnalyticsAgent)

Use the following command to enable VM insights using Log Analytics Agent and Dependency Agent.


```powershell
$WorkspaceId = "<GUID>"
$WorkspaceKey = "<Key>"
$SubscriptionId = "<GUID>"

Install-VMInsights.ps1 -WorkspaceId $WorkspaceId `
-WorkspaceKey $WorkspaceKey `
-SubscriptionId $SubscriptionId `
-WorkspaceRegion <region>
```
The output has the following format:

```powershell 
Getting list of VMs or virtual machine scale sets matching criteria specified

VMs or virtual machine scale sets matching criteria:

db-ws-1 VM running
db-ws2012 VM running

This operation will install the Log Analytics and Dependency agent extensions on the previous two VMs or virtual machine scale sets.
VMs in a non-running state will be skipped.
Extension will not be reinstalled if already installed. Use -ReInstall if desired, for example, to update workspace.

Confirm
Continue?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y

db-ws-1 : Deploying DependencyAgentWindows with name DAExtension
db-ws-1 : Successfully deployed DependencyAgentWindows
db-ws-1 : Deploying MicrosoftMonitoringAgent with name MMAExtension
db-ws-1 : Successfully deployed MicrosoftMonitoringAgent
db-ws2012 : Deploying DependencyAgentWindows with name DAExtension
db-ws2012 : Successfully deployed DependencyAgentWindows
db-ws2012 : Deploying MicrosoftMonitoringAgent with name MMAExtension
db-ws2012 : Successfully deployed MicrosoftMonitoringAgent

Summary:

Already onboarded: (0)

Succeeded: (4)
db-ws-1 : Successfully deployed DependencyAgentWindows
db-ws-1 : Successfully deployed MicrosoftMonitoringAgent
db-ws2012 : Successfully deployed DependencyAgentWindows
db-ws2012 : Successfully deployed MicrosoftMonitoringAgent

Connected to different workspace: (0)

Not running - start VM to configure: (0)

Failed: (0)
```

---

Check your VM/VMSS in Azure portal to see if the extensions are installed or use the following command:

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
