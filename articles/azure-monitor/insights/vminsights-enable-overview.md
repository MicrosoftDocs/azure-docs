---
title: Enable Azure Monitor for VMs overview
description: Learn how to deploy and configure Azure Monitor for VMs. Find out the system requirements.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/29/2020

---

# Enable Azure Monitor for VMs overview
This article provides an overview of the options available to enable Azure Monitor on your virtual machines (VM) and virtual machines scale sets (VMSS). It also describes application dependencies that run on VMs in Azure, on-premises, or hosted in another cloud environment.  

## Onboarding options
The following table describes the Azure Monitor for VMs by using one of the methods described in this table:

| Method |  Description |
|:---|:---|
[Azure portal](vminsights-enable-single-vm.md) | Onboard a single VM or VMSS from its menu in the Azure portal. |
| [Azure Policy](vminsights-enable-at-scale-policy.md) | Automatically onboard VMs or VMMSs as they are created by using Azure Policy and built-in policy definitions. |
| [Resource Manager template](vminsights-enable-at-scale-powershell.md) | Onboard multiple VMs or VMMSs across a specified subscription or resource group using Azure Resource Manager templates. Deploy the template using the Azure portal, Azure Powershell, or Azure CLI. |
| [Hybrid cloud](vminsights-enable-hybrid-cloud.md) | Onboard VMs or physical computers that are hosted in your datacenter or other cloud environments. |


## Prerequisites

>[!NOTE]
>The information described in this section is also applicable to the [Service Map solution](service-map.md).  

### Create Log Analytics workspace
Azure Monitor for VMs requires a Log Analytics workspace to store the data it collects. If you don't have a Log Analytics workspace, you should create one before onboarding any VMs, although you also have the opportunity to create a new workspace when you onboard a single VM or VMSS using the Azure portal.

You can create a Log Analytics workspace using any of the following methods:

* [Azure CLI](../../azure-monitor/learn/quick-create-workspace-cli.md)
* [PowerShell](../../azure-monitor/learn/quick-create-workspace-posh.md)
* [Azure portal](../../azure-monitor/learn/quick-create-workspace.md)
* [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md)

Azure Monitor for VMs supports Log Analytics workspaces in the following regions:

>[!NOTE]
>You can monitor Azure VMs in any region. The VMs themselves aren't limited to the regions supported by the Log Analytics workspace.


- West Central US
- West US
- West US 2
- South Central US
- East US
- East US2
- Central US
- North Central US
- US Gov Va
- Canada Central
- UK South
- North Europe
- West Europe
- East Asia
- Southeast Asia
- Central India
- Japan East
- Australia East
- Australia Southeast


### Configure Log Analytics workspace
The workspace requires the *VMInsights* solution to be installed before any agents can be onboarded. You can use any of the the following methods to configure the workspace.

* Onboard a single VM or VMSS using the Azure portal. If the workspace you select doesn't have the VMInsights solution, it will be installed whether you select an exsiting or new workspace.
* On the Azure Monitor for VMs [**Policy Coverage**](vminsights-enable-at-scale-policy.md#manage-policy-coverage-feature-overview) page, select **Configure Workspace**. 
* Use the following Resource Manager template.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "WorkspaceName": {
                "type": "string"
            },
            "WorkspaceLocation": {
                "type": "string"
            }
        },
        "resources": [
            {
                "apiVersion": "2017-03-15-preview",
                "type": "Microsoft.OperationalInsights/workspaces",
                "name": "[parameters('WorkspaceName')]",
                "location": "[parameters('WorkspaceLocation')]",
                "resources": [
                    {
                        "apiVersion": "2015-11-01-preview",
                        "location": "[parameters('WorkspaceLocation')]",
                        "name": "[concat('VMInsights', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },

                        "plan": {
                            "name": "[concat('VMInsights', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'VMInsights')]",
                            "promotionCode": ""
                        }
                    }
                ]
            }
        ]
    }
    ```



## Agents
Azure Monitor for VMs requires the following agents on each virtual machine that it monitors. These agents are both installed 

- Log Analytics 

### Log Analytics agent


### Microsoft Dependency agent
The Dependency agent discovers details about processes running on the virtual machine and external process dependencies. The Map feature in Azure Monitor for VMs depends on this data. The Dependency agent relies on the Log Analytics agent to deliver this information to Azure Monitor.

Whether you enable Azure Monitor for VMs for a single Azure VM or you use the at-scale deployment method, use the Azure VM Dependency agent extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) or [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) to install the agent as part of the experience.

>[!NOTE]
>The following information described in this section is also applicable to the [Service Map solution](service-map.md).  

In a hybrid environment, you can download and install the Dependency agent manually or using an automated method.

The following table describes the connected sources that the Map feature supports in a hybrid environment.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Along with the [Log Analytics agent for Windows](../../azure-monitor/platform/log-analytics-agent.md), Windows agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| Linux agents | Yes | Along with the [Log Analytics agent for Linux](../../azure-monitor/platform/log-analytics-agent.md), Linux agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| System Center Operations Manager management group | No | |

You can download the Dependency agent from these locations:

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.10.4.10090 | B4E1FF9C1E5CD254AA709AEF9723A81F04EC0763C327567C582CE99C0C5A0BAE  |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.10.4.10090 | A56E310D297CE3B343AE8F4A6F72980F1C3173862D6169F1C713C2CA09660A9F |




## Management packs

When Azure Monitor for VMs is enabled and configured with a Log Analytics workspace, a management pack is forwarded to all the Windows computers reporting to that workspace. If you have [integrated your System Center Operations Manager management group](../../azure-monitor/platform/om-agents.md) with the Log Analytics workspace, the Service Map management pack is deployed from the management group to the Windows computers reporting to the management group.  

The management pack is named *Microsoft.IntelligencePacks.ApplicationDependencyMonitor*. Its written to `%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\` folder. The data source that the management pack uses is `%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll`.

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to improve the quality, security, and integrity of the service. 

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

Now that you've enabled monitoring for your VM, monitoring information is available for analysis in Azure Monitor for VMs.

## Next steps

To learn how to use the Performance monitoring feature, see [View Azure Monitor for VMs Performance](vminsights-performance.md). To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).
