---
title: Deploy a Linux Hybrid Runbook Worker in Azure Automation
description: This article tells how to install an Azure Automation Hybrid Runbook Worker to run runbooks on Linux-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 06/24/2020
ms.topic: conceptual
---
# Deploy a Linux Hybrid Runbook Worker

You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the machine that's hosting the role and against resources in the environment to manage those local resources. The Linux Hybrid Runbook Worker executes runbooks as a special user that can be elevated for running commands that need elevation. Azure Automation stores and manages runbooks and then delivers them to one or more designated machines. This article describes how to install the Hybrid Runbook Worker on a Linux machine, how to remove the worker, and how to remove a Hybrid Runbook Worker group.

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

## Prerequisites

Before you start, make sure that you have the following:

### A Log Analytics workspace

The Hybrid Runbook Worker role depends on an Azure Monitor Log Analytics workspace to install and configure the role. You can create it through [Azure Resource Manager](../azure-monitor/samples/resource-manager-workspace.md#create-a-log-analytics-workspace), through [PowerShell](../azure-monitor/scripts/powershell-sample-create-workspace.md?toc=/powershell/module/toc.json), or in the [Azure portal](../azure-monitor/learn/quick-create-workspace.md).

If you don't have an Azure Monitor Log Analytics workspace, review the [Azure Monitor Log design guidance](../azure-monitor/platform/design-logs-deployment.md) before you create the workspace.

If you have a workspace, but it is not linked to your Automation account, enabling an Automation feature adds functionality for Azure Automation, including support for the Hybrid Runbook Worker. When you enable one of the Azure Automation features in your Log Analytics workspace, specifically [Update Management](automation-update-management.md) or [Change Tracking and Inventory](change-tracking.md), the worker components are automatically pushed to the agent machine.

   To add the Update Management feature to your workspace, run the following PowerShell cmdlet:

    ```powershell-interactive
    Set-AzOperationalInsightsIntelligencePack -ResourceGroupName <logAnalyticsResourceGroup> -WorkspaceName <logAnalyticsWorkspaceName> -IntelligencePackName "Updates" -Enabled $true
    ```

   To add the Change Tracking and Inventory feature to your workspace, run the following PowerShell cmdlet:

    ```powershell-interactive
    Set-AzOperationalInsightsIntelligencePack -ResourceGroupName <logAnalyticsResourceGroup> -WorkspaceName <logAnalyticsWorkspaceName> -IntelligencePackName "ChangeTracking" -Enabled $true
    ```

### Log Analytics agent

The Hybrid Runbook Worker role requires the [Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md) for the supported Linux operating system.

### Supported Linux operating systems

The Hybrid Runbook Worker feature supports the following distributions:

* Amazon Linux 2012.09 to 2015.09 (x86/x64)
* CentOS Linux 5, 6, and 7 (x86/x64)
* Oracle Linux 5, 6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5, 6, and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 16.04 LTS, and 18.04 (x86/x64)
* SUSE Linux Enterprise Server 11 and 12 (x86/x64)

### Minimum requirements

The minimum requirements for a Linux Hybrid Runbook Worker are:

* Two cores
* 4 GB of RAM
* Port 443 (outbound)

| **Required package** | **Description** | **Minimum version**|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported)|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | Python 2.x is required |
|PAM | Pluggable Authentication Modules|
| **Optional package** | **Description** | **Minimum version**|
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. See [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) to learn how to install it. | 6.0.0 |

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

## Install a Linux Hybrid Runbook Worker

To install and configure a Linux Hybrid Runbook Worker, perform the following steps.

1. Deploy the Log Analytics agent to the target machine.

    * For Azure VMs, install the Log Analytics agent for Linux using the [virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md). The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace using an Azure Resource Manager template or the Azure CLI. Once the agent is installed, the VM can be added to a Hybrid Runbook Worker group in your Automation account.

    * For non-Azure VMs, install the Log Analytics agent for Linux using the deployment options described in the [Connect Linux computers to Azure Monitor](../azure-monitor/platform/agent-linux.md) article. You can repeat this process for multiple machines to add multiple workers to your environment. Once the agent is installed, the VMs can be added to a Hybrid Runbook Worker group in your Automation account.

    > [!NOTE]
    > To manage the configuration of machines that support the Hybrid Runbook Worker role with Desired State Configuration (DSC), you must add the machines as DSC nodes.

    > [!NOTE]
    > The [nxautomation account](automation-runbook-execution.md#log-analytics-agent-for-linux) with the corresponding sudo permissions must be present during installation of the Linux Hybrid Worker. If you try to install the worker and the account is not present or doesn’t have the appropriate permissions, the installation fails.

2. Verify agent is reporting to workspace.

    The Log Analytics agent for Linux connects machines to an Azure Monitor Log Analytics workspace. When you install the agent on your machine and connect it to your workspace, it automatically downloads the components that are required for the Hybrid Runbook Worker.

    When the agent has successfully connected to your Log Analytics workspace after a few minutes, you can run the following query to verify that it is sending heartbeat data to the workspace.

    ```kusto
    Heartbeat 
    | where Category == "Direct Agent"
    | where TimeGenerated > ago(30m)
    ```

    In the search results, you should see heartbeat records for the machine, indicating that it is connected and reporting to the service. By default, every agent forwards a heartbeat record to its assigned workspace.

3. Run the following command to add the machine to a Hybrid Runbook Worker group, specifying the values for the parameters `-w`, `-k`, `-g`, and `-e`.

    You can get the information required for parameters `-k` and `-e` from the **Keys** page in your Automation account. Select **Keys** under the **Account settings** section from the left-hand side of the page.

    ![Manage Keys page](media/automation-hybrid-runbook-worker/elements-panel-keys.png)

    * For the `-e` parameter, copy the value for **URL**.

    * For the `-k` parameter, copy the value for **PRIMARY ACCESS KEY**.

    * For the `-g` parameter, specify the name of the Hybrid Runbook Worker group that the new Linux Hybrid Runbook worker should join. If this group already exists in the Automation account, the current machine is added to it. If this group doesn't exist, it is created with that name.

    * For the `-w` parameter, specify your Log Analytics workspace ID.

   ```bash
   sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/onboarding.py --register -w <logAnalyticsworkspaceId> -k <automationSharedKey> -g <hybridGroupName> -e <automationEndpoint>
   ```

4. After the command is completed, the Hybrid Worker Groups page in your Automation account shows the new group and the number of members. If this is an existing group, the number of members is incremented. You can select the group from the list on the Hybrid Worker Groups page and select the **Hybrid Workers** tile. On the Hybrid Workers page, you see each member of the group listed.

    > [!NOTE]
    > If you are using the Log Analytics virtual machine extension for Linux for an Azure VM, we recommend setting `autoUpgradeMinorVersion` to `false` as auto-upgrading versions can cause issues with the Hybrid Runbook Worker. To learn how to upgrade the extension manually, see [Azure CLI deployment](../virtual-machines/extensions/oms-linux.md#azure-cli-deployment).

## Turn off signature validation

By default, Linux Hybrid Runbook Workers require signature validation. If you run an unsigned runbook against a worker, you see a `Signature validation failed` error. To turn off signature validation, run the following command. Replace the second parameter with your Log Analytics workspace ID.

 ```bash
 sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --false <logAnalyticsworkspaceId>
 ```

## <a name="remove-linux-hybrid-runbook-worker"></a>Remove the Hybrid Runbook Worker from an on-premises Linux machine

You can use the command `ls /var/opt/microsoft/omsagent` on the Hybrid Runbook Worker to get the workspace ID. A folder is created that is named with the workspace ID.

```bash
sudo python onboarding.py --deregister --endpoint="<URL>" --key="<PrimaryAccessKey>" --groupname="Example" --workspaceid="<workspaceId>"
```

> [!NOTE]
> This script doesn't remove the Log Analytics agent for Linux from the machine. It only removes the functionality and configuration of the Hybrid Runbook Worker role.

## Remove a Hybrid Worker group

To remove a Hybrid Runbook Worker group of Linux machines, you use the same steps as for a Windows hybrid worker group. See [Remove a Hybrid Worker group](automation-windows-hrw-install.md#remove-a-hybrid-worker-group).

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues - Linux](troubleshoot/hybrid-runbook-worker.md#linux).
