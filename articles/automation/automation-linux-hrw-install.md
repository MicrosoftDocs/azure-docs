---
title: Deploy a Linux Hybrid Runbook Worker in Azure Automation
description: This article tells how to install an Azure Automation Hybrid Runbook Worker to run runbooks on Linux-based computers in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 06/17/2020
ms.topic: conceptual
---
# Deploy a Linux Hybrid Runbook Worker

You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the computer that's hosting the role and against resources in the environment to manage those local resources. The Linux Hybrid Runbook Worker executes runbooks as a special user that can be elevated for running commands that need elevation. Azure Automation stores and manages runbooks and then delivers them to one or more designated computers. This article describes how to install the Hybrid Runbook Worker on a Linux machine, how to remove the worker, and how to remove a Hybrid Runbook Worker group.

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

## Supported Linux operating systems

The Hybrid Runbook Worker feature supports the following distributions:

* Amazon Linux 2012.09 to 2015.09 (x86/x64)
* CentOS Linux 5, 6, and 7 (x86/x64)
* Oracle Linux 5, 6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5, 6, and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 16.04 LTS, and 18.04 (x86/x64)
* SUSE Linux Enterprise Server 11 and 12 (x86/x64)

## Supported runbook types

Linux Hybrid Runbook Workers support a limited set of runbook types in Azure Automation, and they are described in the following table.

|Runbook type | Supported |
|-------------|-----------|
|Python 2 |Yes |
|PowerShell |Yes<sup>1</sup> |
|PowerShell Workflow |No |
|Graphical |No |
|Graphical PowerShell Workflow |No |

<sup>1</sup>PowerShell runbooks require PowerShell Core to be installed on the Linux machine. See [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) to learn how to install it.

## Deployment requirements

The minimum requirements for a Linux Hybrid Runbook Worker are:

* Two cores
* 4 GB of RAM
* Port 443 (outbound)

### Package requirements

| **Required package** | **Description** | **Minimum version**|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported)|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | Python 2.x is required |
|PAM | Pluggable Authentication Modules|
| **Optional package** | **Description** | **Minimum version**|
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. See [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) to learn how to install it. | 6.0.0 |

## Install a Linux Hybrid Runbook Worker

To install and configure a Linux Hybrid Runbook Worker, you can use one of the following methods.

* For Azure VMs, install the Log Analytics agent for Linux using the [virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md). The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace using an Azure Resource Manager template or the Azure CLI. Once the agent is installed, the VM can be added to a Hybrid Runbook Worker group in your Automation account.

* For non-Azure VMs, install the Log Analytics agent for Linux using the deployment options described in the [Connect Linux computers to Azure Monitor](../azure-monitor/platform/agent-linux.md) article. You can repeat this process for multiple computers to add multiple workers to your environment. Once the agent is installed, the VMs can be added to a Hybrid Runbook Worker group in your Automation account.

> [!NOTE]
> To manage the configuration of machines that support the Hybrid Runbook Worker role with Desired State Configuration (DSC), you must add the machines as DSC nodes.

Before continuing, review the following if you are planning to deploy the Hybrid Runbook Worker role on Azure or non-Azure VMs:

    * If you don't have an Azure Monitor Log Analytics workspace, review the [Azure Monitor Log design guidance](../azure-monitor/platform/design-logs-deployment.md) before you create the workspace.

    * If you have a workspace, but it is not linked to your Automation account, refer to step 1. 

    * If your Automation account is already linked to a workspace, refer to steps 2 and 3.

>[!NOTE]
> The [nxautomation account](automation-runbook-execution.md#log-analytics-agent-for-linux) with the corresponding sudo permissions must be present during installation of the Linux Hybrid Worker. If you try to install the worker and the account is not present or doesn’t have the appropriate permissions, the installation fails.

### Step 1 - Add an Azure Automation feature to the Log Analytics workspace

An Automation feature adds functionality for Azure Automation, including support for the Hybrid Runbook Worker. When you enable one of the Azure Automation features in your Log Analytics workspace, specifically [Update Management](automation-update-management.md) or [Change Tracking and Inventory](change-tracking.md), the worker components are automatically pushed to the agent computer.

For example, to add the Update Management feature to your workspace, run the following PowerShell cmdlet:

```powershell-interactive
Set-AzOperationalInsightsIntelligencePack -ResourceGroupName <logAnalyticsResourceGroup> -WorkspaceName <logAnalyticsWorkspaceName> -IntelligencePackName "AzureAutomation" -Enabled $true
```

1. Install the Log Analytics agent for Linux by running the following command. Replace \<WorkspaceID\> and \<WorkspaceKey\> with the appropriate values from your workspace.

   [!INCLUDE [log-analytics-agent-note](../../includes/log-analytics-agent-note.md)]

   ```bash
   wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <WorkspaceID> -s <WorkspaceKey>
   ```

1. Run the following command, changing the values for the parameters *-w*, *-k*, *-g*, and *-e*. For the *-g* parameter, replace the value with the name of the Hybrid Runbook Worker group that the new Linux Hybrid Runbook Worker should join. If the name doesn't exist in your Automation account, a new Hybrid Runbook Worker group is made with that name.

   ```bash
   sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/onboarding.py --register -w <LogAnalyticsworkspaceId> -k <AutomationSharedKey> -g <hybridgroupname> -e <automationendpoint>
   ```

1. After the command is completed, the Hybrid Worker Groups page in the Azure portal shows the new group and the number of members. If this is an existing group, the number of members is incremented. You can select the group from the list on the Hybrid Worker Groups page and select the **Hybrid Workers** tile. On the Hybrid Workers page, you see each member of the group listed.

> [!NOTE]
> If you are using the Azure Monitor virtual machine extension for Linux for an Azure VM we recommend setting `autoUpgradeMinorVersion` to false as auto-upgrading versions can cause issues the Hybrid Runbook Worker. To learn how to upgrade the extension manually, see [Azure CLI deployment](../virtual-machines/extensions/oms-linux.md#azure-cli-deployment).

## Turn off signature validation

By default, Linux Hybrid Runbook Workers require signature validation. If you run an unsigned runbook against a worker, you see a `Signature validation failed` error. To turn off signature validation, run the following command. Replace the second parameter with your Log Analytics workspace ID.

 ```bash
 sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --false <LogAnalyticsworkspaceId>
 ```

## <a name="remove-linux-hybrid-runbook-worker"></a>Remove the Hybrid Runbook Worker from an on-premises Linux computer

You can use the command `ls /var/opt/microsoft/omsagent` on the Hybrid Runbook Worker to get the workspace ID. A folder is created that is named with the workspace ID.

```bash
sudo python onboarding.py --deregister --endpoint="<URL>" --key="<PrimaryAccessKey>" --groupname="Example" --workspaceid="<workspaceId>"
```

> [!NOTE]
> This code doesn't remove the Log Analytics agent for Linux from the computer. It only removes the functionality and configuration of the Hybrid Runbook Worker role.

## Remove a Hybrid Worker group

To remove a Hybrid Runbook Worker group of Linux computers, you use the same steps as for a Windows hybrid worker group. See [Remove a Hybrid Worker group](automation-windows-hrw-install.md#remove-a-hybrid-worker-group).

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).
* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues - Linux](troubleshoot/hybrid-runbook-worker.md#linux).
