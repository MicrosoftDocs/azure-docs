---
title: Enable Azure Monitor (preview) for a hybrid environment | Microsoft Docs
description: This article describes how you enable Azure Monitor for VMs for a hybrid cloud environment that contains one or more virtual machines.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/07/2019
ms.author: magoedte
---

# Enable Azure Monitor for VMs (preview) for a hybrid environment

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This article explains how to enable Azure Monitor for VMs (preview) for virtual machines or physical computers hosted in your datacenter or other cloud environment. At the end of this process, you will have successfully begun monitoring your virtual machines in your environment and learn if they are experiencing any performance or availability issues. 

Before you get started, be sure to review the [prerequisites](vminsights-enable-overview.md) and verify that your subscription and resources meet the requirements. Review the requirements and deployment methods for the [Log Analytics Linux and Windows agent](../../log-analytics/log-analytics-agent-overview.md).

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

>[!NOTE]
>The Azure Monitor for VMs Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports. The Map data is always transmitted by the Log Analytics agent to the Azure Monitor service, either directly or through the [Operations Management Suite gateway](../../azure-monitor/platform/gateway.md) if your IT security policies don't allow computers on the network to connect to the internet.

The steps to complete this task are summarized as follows:

1. Install Log Analytics agent for Windows or Linux. Before you install the agent, review the [Log Analytics agent overview](../platform/log-analytics-agent.md) article to understand system prerequisites and deployment methods.

2. Download and install the Azure Monitor for VMs Map Dependency agent for [Windows](https://aka.ms/dependencyagentwindows) or [Linux](https://aka.ms/dependencyagentlinux).

3. Enable the collection of performance counters.

4. Deploy Azure Monitor for VMs.

## Install the Dependency agent on Windows
You can install the Dependency agent manually on Windows computers by running `InstallDependencyAgent-Windows.exe`. If you run this executable file without any options, it starts a setup wizard that you can follow to install the agent interactively.

>[!NOTE]
>*Administrator* privileges are required to install or uninstall the agent.

The following table highlights the parameters that are supported by setup for the agent from the command line.

| Parameter | Description |
|:--|:--|
| /? | Returns a list of the command-line options. |
| /S | Performs a silent installation with no user interaction. |

For example, to run the installation program with the `/?` parameter, enter **InstallDependencyAgent-Windows.exe /?**.

Files for the Windows Dependency agent are installed in *C:\Program Files\Microsoft Dependency Agent* by default. If the Dependency agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\Microsoft Dependency Agent\logs*.

## Install the Dependency agent on Linux
The Dependency agent is installed on Linux servers from *InstallDependencyAgent-Linux64.bin*, a shell script with a self-extracting binary. You can run the file by using `sh` or add execute permissions to the file itself.

>[!NOTE]
> Root access is required to install or configure the agent.
>

| Parameter | Description |
|:--|:--|
| -help | Get a list of the command-line options. |
| -s | Perform a silent installation with no user prompts. |
| --check | Check permissions and the operating system, but don't install the agent. |

For example, to run the installation program with the `-help` parameter, enter **InstallDependencyAgent-Linux64.bin -help**.

Install the Linux Dependency agent as root by running the command `sh InstallDependencyAgent-Linux64.bin`.

If the Dependency agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is */var/opt/microsoft/dependency-agent/log*.

Files for the Dependency agent are placed in the following directories:

| Files | Location |
|:--|:--|
| Core files | /opt/microsoft/dependency-agent |
| Log files | /var/opt/microsoft/dependency-agent/log |
| Config files | /etc/opt/microsoft/dependency-agent/config |
| Service executable files | /opt/microsoft/dependency-agent/bin/microsoft-dependency-agent<br>/opt/microsoft/dependency-agent/bin/microsoft-dependency-agent-manager |
| Binary storage files | /var/opt/microsoft/dependency-agent/storage |

## Enable performance counters
If the Log Analytics workspace that's referenced by the solution isn't already configured to collect the performance counters required by the solution, you need to enable them. You can do so in one of two ways:
* Manually, as described in [Windows and Linux performance data sources in Log Analytics](../../azure-monitor/platform/data-sources-performance-counters.md)
* By downloading and running a PowerShell script that's available from the [Azure PowerShell Gallery](https://www.powershellgallery.com/packages/Enable-VMInsightsPerfCounters/1.1)

## Deploy Azure Monitor for VMs
This method includes a JSON template that specifies the configuration for enabling the solution components in your Log Analytics workspace.

If you don't know how to deploy resources by using a template, see:
* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)
* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

To use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.27 or later. To identify your version, run `az --version`. To install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Create and execute a template

1. Copy and paste the following JSON syntax into your file:

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
                        "name": "[concat('ServiceMap', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },

                        "plan": {
                            "name": "[concat('ServiceMap', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'ServiceMap')]",
                            "promotionCode": ""
                        }
                    },
                    {
                        "apiVersion": "2015-11-01-preview",
                        "location": "[parameters('WorkspaceLocation')]",
                        "name": "[concat('InfrastructureInsights', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },
                        "plan": {
                            "name": "[concat('InfrastructureInsights', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'InfrastructureInsights')]",
                            "promotionCode": ""
                        }
                    }
                ]
            }
        ]
    }
    ```

1. Save this file as *installsolutionsforvminsights.json* to a local folder.

1. Capture the values for *WorkspaceName*, *ResourceGroupName*, and *WorkspaceLocation*. The value for *WorkspaceName* is the name of your Log Analytics workspace. The value for *WorkspaceLocation* is the region the workspace is defined in.

1. You're ready to deploy this template by using the following PowerShell command:

    ```powershell
    New-AzResourceGroupDeployment -Name DeploySolutions -TemplateFile InstallSolutionsForVMInsights.json -ResourceGroupName ResourceGroupName> -WorkspaceName <WorkspaceName> -WorkspaceLocation <WorkspaceLocation - example: eastus>
    ```

    The configuration change can take a few minutes to finish. When it's finished, a message displays that's similar to the following and includes the result:

    ```powershell
    provisioningState       : Succeeded
    ```
   After you've enabled monitoring, it might take about 10 minutes before you can view the health state and metrics for the hybrid computer.

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.
 
- To learn how to use the Health feature, see [View Azure Monitor for VMs health](vminsights-health.md).
- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).