---
title: Azure Monitor Agent support in Connection Monitor in Azure | Microsoft Docs
description: Learn how to use Azure Monitor Agent with Connection Monitor to monitor network communication in a distributed environment.
services: network-watcher
documentationcenter: na
author: mjha
manager: vinigam
editor: ''
tags: azure-resource-manager

ms.service: network-watcher
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/04/2021
ms.author: mjha
ms.custom: mvc
#Customer intent: I need to monitor communication between one endpoint and another using Azure Monitor Agent with Connection Monitor. 
---

# Monitor Network Connectivity using Azure Monitor Agent with Connection Monitor (Private Preview)

Connection Monitor now supports Azure Monitor Agent extension, thus eliminating the dependency on the legacy Log Analytics agent. 
With Azure Monitor Agent, we aim to serve a single agent that will consolidate all the features necessary to address all connectivity logs and metrics data collection needs across Azure and On-premises machines as compared to running various monitoring agents. 
Azure Monitor Agent provides enhanced security and performance capabilities, effective cost savings with efficient data collection & ease of troubleshooting with simpler management of data collection with respect to Log Analytics agent. Learn more about [Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-overview.md).

![Diagram showing how Connection Monitor interacts with Azure VMs, non-Azure hosts, endpoints, and data storage locations.](./media/connection-monitor-2-preview/hero-graphic-new.png)

This article provides detailed instructions and guidance for installing the Azure Monitor Agent and using it for connectivity monitoring with Connection Monitor. It also explains how to enable Azure ARC for on-premises endpoints for faster and smoother troubleshooting. 
To start using Connection Monitor for monitoring, do the following:
* Install monitoring agents
* Create a connection monitor
* Analyze monitoring data and set alerts
* Diagnose issues in your network

The following sections provide details for the steps involving the installation of Azure Monitor Agent. 
Rest of the details can be found in the existing document of [Connection Monitor](./connection-monitor-overview.md)

## Installing monitoring agents for Azure and Non-Azure resources

Connection Monitor relies on lightweight executable files to run connectivity checks. It supports connectivity checks from both Azure environments and on-premises environments. The executable file that you use depends on whether your VM is hosted on Azure or on-premises.

### Agents for Azure virtual machines and scale sets

Refer [here](./connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets) to learn how to install agents for Azure virtual machines and scale sets

### Agents for On-premises machines

To make Connection Monitor recognize your on-premises machines as sources for monitoring 
* Enable your hybrid endpoints to [ARC Enabled Servers](../azure-arc/overview.md)
	1. To connect hybrid machines, you install the [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) on each machine.
	2. This agent does not deliver any other functionality, and it doesn't replace the Azure Monitor Agent. The Azure Connected Machine agent simply enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud providers. 

*Install the [Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-overview.md) to enable the Network Watcher extension.
	1. The agent collects monitoring logs and data from the hybrid sources and delivers it to Azure Monitor

#### Installing Azure Connected Machine agent to enable ARC 

Before proceeding be sure to review the [prerequisites](../azure-arc/servers/prerequisites.md") and verify that your subscription and resources meet the requirements.

##### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Deploying the Connected Machine agent on a machine requires that you have administrator permissions to install and configure the agent. On Linux this is done by using the root account, and on Windows, with an account that is a member of the Local Administrators group.
* The Microsoft.HybridCompute, Microsoft.GuestConfiguration, and Microsoft.HybridConnectivity resource providers must be registered on your subscription. You can [register these resource providers ahead of time](../azure-arc/servers/prerequisites.md#azure-resource-providers), or while completing the steps in this quickstart.
* Before you get started, be sure to review the [agent prerequisites](../prerequisites.md) and verify the following:
  * Your target machine is running a supported [operating system](../azure-arc/servers/prerequisites.md#supported-operating-systems).
  * Your account has the [required Azure built-in roles](../azure-arc/servers/prerequisites.md#required-permissions).
  * Ensure the machine is in a [supported region](../azure-arc/server/overview.md#supported-regions).
  * Confirm that the Linux hostname or Windows computer name doesn't use a [reserved word or trademark](../azure-resource-manager/templates/error-reserved-resource-name.md).
  * If the machine connects through a firewall or proxy server to communicate over the Internet, make sure the URLs [listed](../azure-arc/server/network-requirements.md#urls) are not blocked.

##### Generate installation script

Use the Azure portal to create a script that automates the agent download and installation, and establishes the connection with Azure Arc.

1. Launch the Azure Arc service in the Azure portal by searching for and selecting **Servers - Azure Arc**.

   :::image type="content" source="./media/connection-monitor-2-preview/enable-arc-server.png" alt-text="Search for Azure Arc-enabled servers in the Azure portal.":::

1. On the **Servers - Azure Arc** page, select **Add** near the upper left.

1. On the next page, from the **Add a single server** tile, select **Generate script**.

1. Review the information on the **Prerequisites** page, then select **Next**.

1. On the **Resource details** page, provide the following:

   1. Select the subscription and resource group where you want the machine to be managed within Azure.
   1. For **Region**, choose the Azure region in which the server's metadata will be stored.
   1. For **Operating system**, select the operating system of the server you want to connect.
   1. For **Connectivity method**, choose how the Azure Connected Machine agent should connect to the internet. If you select **Proxy server**, enter the proxy server IP address or the name and port number that the machine will use in the format `http://<proxyURL>:<proxyport>`.
   1. Select **Next**.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards. Then select **Next**.

1. On the **Download and run script** page, select the **Register** button to register the required resource providers in your subscription, if you haven't already done so.

1. In the **Download or copy the following script** section, review the script. If you want to make any changes, use the **Previous** button to go back and update your selections. Otherwise, select **Download** to save the script file.

###### Install the agent using the script

Now that you've generated the script, the next step is to run it on the server that you want to onboard to Azure Arc. The script will download the Connected Machine agent from the Microsoft Download Center, install the agent on the server, create the Azure Arc-enabled server resource, and associate it with the agent.

Follow the steps below for the operating system of your server.

###### Windows agent

1. Log in to the server.

1. Open an elevated 64-bit PowerShell command prompt.

1. Change to the folder or share that you copied the script to, then execute it on the server by running the `./OnboardingScript.ps1` script.

###### Linux agent

1. To install the Linux agent on the target machine that can directly communicate to Azure, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh
    ```

1. Alternately, if the target machine communicates through a proxy server, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
    ```

###### Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://aka.ms/hybridmachineportal).

:::image type="content" source="./media/connection-monitor-2-preview/confirm-arc-enable.png" alt-text="A successful machine connection" border="false":::

##### Connect hybrid machines to Azure by using PowerShell

For servers enabled with Azure Arc, you can take manual steps mentioned above to enable them for one or more Windows or Linux machines in your environment. Alternatively, you can use the PowerShell cmdlet Connect-AzConnectedMachine to download the Connected Machine agent, install the agent, and register the machine with Azure Arc. The cmdlet downloads the Windows agent package (Windows Installer) from the Microsoft Download Center, and the Linux agent package from the Microsoft package repository.
Refer to the linked document to discover the required steps to install the [ARC agent via Powershell](../azure-arc/servers/onboard-powershell.md)

##### Connect hybrid machines to Azure from Windows Admin Center

You can enable Azure Arc-enabled servers for one or more Windows machines in your environment by performing a set of steps manually, as mentioned above. Or you can use Windows Admin Center to deploy the Connected Machine agent and register your on-premises servers without having to perform any steps outside of this tool. Refer to the linked document to discover the steps to [install ARC agent via Windows Admin Centre](../azure-arc/servers/onboard-windows-admin-center.md)

#### Installing Azure Monitor Agent 

The Azure Monitor agent is implemented as an Azure VM extension with the details in the following table. It can be installed using any of the methods to install virtual machine extensions including those described in this article. Refer to [Azure Monitor overview](../azure-monitor/agents/azure-monitor-agent-overview.md) to learn more. 
The following section covers installing Azure Monitor Agent on Arc Enabled Servers using Powershell and Azure CLI. Refer to [Manage the Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-manage.md) to learn the rest.

##### Using PowerShell
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using the PowerShell command for adding a virtual machine extension. 

###### Install on Azure Arc-enabled servers
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

###### Uninstall on Azure Arc-enabled servers
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

###### Upgrade on Azure Arc-enabled servers

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

The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade (preview)](../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#enabling-automatic-extension-upgrade-preview) feature, using the following PowerShell commands.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AMAWindows -EnableAutomaticUpgrade
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AMALinux -EnableAutomaticUpgrade
```
---

##### Using Azure CLI

You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using the Azure CLI command for adding a virtual machine extension.

###### Install on Azure Arc-enabled servers
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

###### Uninstall on Azure Arc-enabled servers
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

###### Upgrade on Azure Arc-enabled servers
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

The **recommendation** is to enable automatic update of the agent by enabling the [Automatic Extension Upgrade (preview)](../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#enabling-automatic-extension-upgrade-preview) feature, using the following PowerShell commands.
# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension update --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension update --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
```
---

#### Enabling Network Watcher Agent 

To make Connection Monitor recognize your Azure Arc enabled on-premises machines with Azure Monitor Agent extension as monitoring sources, install the Network Watcher Agent virtual machine extension on them. This extension is also known as the Network Watcher extension. 
Refer [here](./connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets) to learn how to install the Network Watcher extension on your Azure ARC enabled servers with Azure Monitor Agent extension installed. 

#### Coexistence with other agents

The Azure Monitor agent can coexist (run side by side on the same machine) with the legacy Log Analytics agents so that you can continue to use their existing functionality during evaluation or migration. While this allows you to begin transition given the limitations, you must review the below points carefully:
* Be careful in collecting duplicate data because it could skew query results and affect downstream features like alerts, dashboards or workbooks. For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data. As such, ensure you're not collecting the same data from both agents. If you are, ensure they're collecting from different machines or going to separate destinations.
* Besides data duplication, this would also generate more charges for data ingestion and retention.
* Running two telemetry agents on the same machine would result in double the resource consumption, including but not limited to CPU, memory, storage space and network bandwidth

#### Create connection monitor 

After the successful installation of monitoring agents, proceed to [Creation a Connection Monitor](./connection-monitor-overview.md#create-a-connection-monitor). 
Upon the successful creation of Connection Monitor, analyze monitoring data and set alerts. Diagnose issues in your connection monitor and your network. 

Refer to the existing document of [Connection Monitor](./connection-monitor-overview.md) to proceed further with network connectivity monitoring of your Azure and Non-Azure set-ups. 







