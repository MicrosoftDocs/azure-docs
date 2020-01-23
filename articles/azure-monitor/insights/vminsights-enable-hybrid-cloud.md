---
title: Enable Azure Monitor (preview) for a hybrid environment | Microsoft Docs
description: This article describes how you enable Azure Monitor for VMs for a hybrid cloud environment that contains one or more virtual machines.
ms.service:  azure-monitor
ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/15/2019

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

>[!NOTE]
>The information described in this article for deploying the Dependency agent is also applicable to the [Service Map solution](service-map.md).  

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

## Installation script examples

To easily deploy the Dependency agent on many servers at once, the following script example is provided to download and install the Dependency agent on either Windows or Linux.

### PowerShell script for Windows

```powershell
Invoke-WebRequest "https://aka.ms/dependencyagentwindows" -OutFile InstallDependencyAgent-Windows.exe

.\InstallDependencyAgent-Windows.exe /S
```

### Shell script for Linux

```
wget --content-disposition https://aka.ms/dependencyagentlinux -O InstallDependencyAgent-Linux64.bin
sudo sh InstallDependencyAgent-Linux64.bin -s
```

## Desired State Configuration

To deploy the Dependency agent using Desired State Configuration (DSC), you can use the xPSDesiredStateConfiguration module with the following example code:

```powershell
configuration ServiceMap {

    Import-DscResource -ModuleName xPSDesiredStateConfiguration

    $DAPackageLocalPath = "C:\InstallDependencyAgent-Windows.exe"

    Node localhost
    {
        # Download and install the Dependency agent
        xRemoteFile DAPackage
        {
            Uri = "https://aka.ms/dependencyagentwindows"
            DestinationPath = $DAPackageLocalPath
        }

        xPackage DA
        {
            Ensure="Present"
            Name = "Dependency Agent"
            Path = $DAPackageLocalPath
            Arguments = '/S'
            ProductId = ""
            InstalledCheckRegKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\DependencyAgent"
            InstalledCheckRegValueName = "DisplayName"
            InstalledCheckRegValueData = "Dependency Agent"
            DependsOn = "[xRemoteFile]DAPackage"
        }
    }
}
```

## Enable performance counters

If the Log Analytics workspace that's referenced by the solution isn't already configured to collect the performance counters required by the solution, you need to enable them. You can do so in one of two ways:
* Manually, as described in [Windows and Linux performance data sources in Log Analytics](../../azure-monitor/platform/data-sources-performance-counters.md)
* By downloading and running a PowerShell script that's available from the [Azure PowerShell Gallery](https://www.powershellgallery.com/packages/Enable-VMInsightsPerfCounters/1.1)

## Deploy Azure Monitor for VMs

This method includes a JSON template that specifies the configuration for enabling the solution components in your Log Analytics workspace.

If you don't know how to deploy resources by using a template, see:
* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md)
* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/templates/deploy-cli.md)

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

## Troubleshooting

### VM doesn't appear on the map

If your Dependency agent installation succeeded, but you don't see your computer on the map, diagnose the problem by following these steps.

1. Is the Dependency agent installed successfully? You can validate this by checking to see if the service is installed and running.

    **Windows**: Look for the service named "Microsoft Dependency agent."

    **Linux**: Look for the running process "microsoft-dependency-agent."

2. Are you on the [Free pricing tier of Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-add-solutions)? The Free plan allows for up to five unique computers. Any subsequent computers won't show up on the map, even if the prior five are no longer sending data.

3. Is the computer sending log and perf data to Azure Monitor Logs? Perform the following query for your computer:

    ```Kusto
	Usage | where Computer == "computer-name" | summarize sum(Quantity), any(QuantityUnit) by DataType
    ```

    Did it return one or more results? Is the data recent? If so, your Log Analytics agent is operating correctly and communicating with the service. If not, check the agent on your server: [Log Analytics agent for Windows troubleshooting](../platform/agent-windows-troubleshoot.md) or [Log Analytics agent for Linux troubleshooting](../platform/agent-linux-troubleshoot.md).

#### Computer appears on the map but has no processes

If you see your server on the map, but it has no process or connection data, that indicates that the Dependency agent is installed and running, but the kernel driver didn't load.

Check the C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log file (Windows) or /var/opt/microsoft/dependency-agent/log/service.log file (Linux). The last lines of the file should indicate why the kernel didn't load. For example, the kernel might not be supported on Linux if you updated your kernel.


## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.

- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
