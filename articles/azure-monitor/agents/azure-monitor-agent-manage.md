---
title: Manage the Azure Monitor agent
description: Options for managing the Azure Monitor agent (AMA) on Azure virtual machines and Azure Arc-enabled servers.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/27/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Manage the Azure Monitor agent
This article provides the different options currently available to install, uninstall and update the [Azure Monitor agent](azure-monitor-agent-overview.md). This agent extension can be installed on Azure virtual machines, scale sets and Azure Arc-enabled servers. It also lists the options to create [associations with data collection rules](data-collection-rule-azure-monitor-agent.md) that define which data the agent should collect.

## Virtual machine extension details
The Azure Monitor agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. It can be installed using any of the methods to install virtual machine extensions including those described in this article.

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | 1.0 | 1.5 |

## Extension versions
WE strongly recommended to update to generally available versions listed as follows instead of using preview or intermediate versions.

| Release Date | Release notes | Windows | Linux |
|:---|:---|:---|:---|:---|
| June 2021 | General availability announced. <ul><li>All features except metrics destination now generally available</li><li>Production quality, security and compliance</li><li>Availability in all public regions</li><li>Performance and scale improvements for higher EPS</li></ul> [Learn more](https://azure.microsoft.com/updates/azure-monitor-agent-and-data-collection-rules-now-generally-available/) | 1.0.12.0 | 1.9.1.0 |
| July 2021 | <ul><li>Support for direct proxies</li><li>Support for Log Analytics gateway</li></ul> [Learn more](https://azure.microsoft.com/updates/general-availability-azure-monitor-agent-and-data-collection-rules-now-support-direct-proxies-and-log-analytics-gateway/) | 1.1.1.0 | 1.10.5.0 |
| August 2021 | Fixed issue allowing Azure Monitor Metrics as the only destination | 1.1.2.0 | 1.10.9.0<sup>Hotfix</sup> |
| September 2021 | <ul><li>Fixed issue causing data loss on restarting the agent</li><li>Fixed issue for Arc Windows servers</li></ul> | 1.1.3.2<sup>Hotfix</sup> | 1.12.2.0 <sup>1</sup> |  
| December 2021 | <ul><li>Fixed issues impacting Linux Arc-enabled servers</li><li>'Heartbeat' table > 'Category' column reports "Azure Monitor Agent" in Log Analytics for Windows</li></ul>  | 1.1.4.0 | 1.14.7.0<sup>2</sup> |
| January 2021 | <ul><li>Syslog RFC compliance for Linux</li><li>Fixed issue for Linux perf counters not flowing on restart</li><ul> | Not available yet | 1.15.2.0<sup>Hotfix</sup> |

<sup>Hotfix</sup> Do not use AMA Linux versions v1.10.7, v1.15.1 and AMA Windows v1.1.3.1. Please use hotfixed versions listed above.  
<sup>1</sup> Known issue: No data collected from Linux Arc-enabled servers  
<sup>2</sup> Known issue: Linux performance counters data stops flowing on restarting/rebooting the machine(s)


## Prerequisites
The following prerequisites must be met prior to installing the Azure Monitor agent.

- For installing the agent on physical servers and virtual machines hosted *outside* of Azure (i.e. on-premises), you must [install the Azure Arc agent](../../azure-arc/servers/agent-overview.md#installation-and-configuration) first (at no added cost)
- [Managed system identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) must be enabled on Azure virtual machines. This is not required for Azure Arc-enabled servers. The system identity will be enabled automatically if the agent is installed via [creating and assigning a data collection rule using the Azure portal](data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal).
- The [AzureResourceManager service tag](../../virtual-network/service-tags-overview.md) must be enabled on the virtual network for the virtual machine.
- The virtual machine must have access to the following HTTPS endpoints:
  - *.ods.opinsights.azure.com
  - *.ingest.monitor.azure.com
  - *.control.monitor.azure.com


## Using the Azure portal

### Install
To install the Azure Monitor agent using the Azure portal, follow the process to [create a data collection rule](data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) in the Azure portal. This not only creates the rule, but it also associates it to the selected resources and installs the Azure Monitor agent on them if not already installed.

### Uninstall
To uninstall the Azure Monitor agent using the Azure portal, navigate to your virtual machine, scale set or Arc-enabled server, select the **Extensions** tab and click on **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that pops up, click **Uninstall**.

### Update
To perform a **one time update** of the agent, you must first uninstall the existing agent version and then install the new version as described above.  
The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature. Navigate to your virtual machine or scale set, select the **Extensions** tab and click on **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that pops up, click **Enable automatic upgrade**.

## Using Resource Manager template

### Install
You can use Resource Manager templates to install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers and to create an association with data collection rules. You must create any data collection rule prior to creating the association.

Get sample templates for installing the agent and creating the association from the following: 

- [Template to install Azure Monitor agent (Azure and Azure Arc)](../agents/resource-manager-agent.md#azure-monitor-agent) 
- [Template to create association with data collection rule](./resource-manager-data-collection-rules.md)

Install the templates using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md) such as the following commands.

# [PowerShell](#tab/ARMAgentPowerShell)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
# [CLI](#tab/ARMAgentCLI)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
---

## Using PowerShell
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using the PowerShell command for adding a virtual machine extension. 

### Install on Azure virtual machines
Use the following PowerShell commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/PowerShellWindows)
```powershell
Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number>
```
# [Linux](#tab/PowerShellLinux)
```powershell
Set-AzVMExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number>
```
---

### Uninstall on Azure virtual machines
Use the following PowerShell commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/PowerShellWindows)
```powershell
Remove-AzVMExtension -Name AMAWindows -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
```
# [Linux](#tab/PowerShellLinux)
```powershell
Remove-AzVMExtension -Name AMALinux -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
```
---

### Update on Azure virtual machines
To perform a **one time update** of the agent, you must first uninstall the existing agent version and then install the new version as described above.  
The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature, using the following PowerShell commands.
# [Windows](#tab/PowerShellWindows)
```powershell
Set-AzVMExtension -ExtensionName AMAWindows -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorWindowsAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
```
# [Linux](#tab/PowerShellLinux)
```powershell
Set-AzVMExtension -ExtensionName AMALinux -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorLinuxAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
```
--- 
   

### Install on Azure Arc-enabled servers
Use the following PowerShell commands to install the Azure Monitor agent on Azure Arc-enabled servers.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
New-AzConnectedMachineExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
New-AzConnectedMachineExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
---

### Uninstall on Azure Arc-enabled servers
Use the following PowerShell commands to install the Azure Monitor agent on Azure Arc-enabled servers.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AMAWindows
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AMALinux
```
---

### Upgrade on Azure Arc-enabled servers
To perform a **one time** upgrade of the agent, use the following PowerShell commands:

# [Windows](#tab/PowerShellWindowsArc)
```powershell
$target = @{"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent" = @{"targetVersion"=<target-version-number>}}
Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
$target = @{"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent" = @{"targetVersion"=<target-version-number>}}
Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
```
---

The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade (preview)](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#enabling-automatic-extension-upgrade-preview) feature, using the following PowerShell commands.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AMAWindows -EnableAutomaticUpgrade
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AMALinux -EnableAutomaticUpgrade
```
---


## Using Azure CLI
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using the Azure CLI command for adding a virtual machine extension. 

### Install on Azure virtual machines
Use the following CLI commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id>
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id>
```
---

### Uninstall on Azure virtual machines
Use the following CLI commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> -name AzureMonitorWindowsAgent
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> -name AzureMonitorLinuxAgent
```
---

### Update on Azure virtual machines
To perform a **one time update** of the agent, you must first uninstall the existing agent version and then install the new version as described above.  
The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature, using the following CLI commands.
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension set -name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension set -name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
---


### Install on Azure Arc-enabled servers
Use the following CLI commands to install the Azure Monitor agent onAzure Azure Arc-enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
---

### Uninstall on Azure Arc-enabled servers
Use the following CLI commands to install the Azure Monitor agent onAzure Azure Arc-enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension delete --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension delete --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
```
---

### Upgrade on Azure Arc-enabled servers
To perform a **one time upgrade** of the agent, use the following CLI commands:
# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
---

The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade (preview)](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#enabling-automatic-extension-upgrade-preview) feature, using the following PowerShell commands.
# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension update --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension update --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
---


## Using Azure Policy
Use the following policies and policy initiatives to automatically install the agent and associate it with a data collection rule, every time you create a virtual machine.

### Built-in policy initiatives
[View prerequisites for agent installation](azure-monitor-agent-manage.md#prerequisites). 

Policy initiatives for Windows and Linux virtual machines consist of individual policies that:

- Install the Azure Monitor agent extension on the virtual machine.
- Create and deploy the association to link the virtual machine to a data collection rule.

![Partial screenshot from the Azure Policy Definitions page showing two built-in policy initiatives for configuring the Azure Monitor agent.](media/azure-monitor-agent-install/built-in-ama-dcr-initiatives.png)  

### Built-in policies 
You can choose to use the individual policies from their respective policy initiatives, based on your needs. For example, if you only want to automatically install the agent, use the first policy from the initiative as shown in the following example.  

![Partial screenshot from the Azure Policy Definitions page showing policies contained within the initiative for configuring the Azure Monitor agent.](media/azure-monitor-agent-install/built-in-ama-dcr-policy.png)  

### Remediation
The initiatives or policies will apply to each virtual machine as it's created. A [remediation task](../../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to *existing resources*, so you can configure the Azure Monitor agent for any resources that were already created. 

When you create the assignment by using the Azure portal, you have the option of creating a remediation task at the same time. See [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md) for details on the remediation.

![Screenshot that shows initiative remediation for the Azure Monitor agent.](media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png)

## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
