---
title: Deploy an agent-based Linux Hybrid Runbook Worker in Automation
description: This article tells how to install an agent-based  Hybrid Runbook Worker to run runbooks on Linux-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 03/30/2023
ms.topic: conceptual 
---

# Deploy an agent-based Linux Hybrid Runbook Worker in Automation

> [!IMPORTANT]
>  Azure Automation Agent-based User Hybrid Runbook Worker (Windows and Linux) will retire on **31 August 2024** and wouldn't be supported after that date. You must complete migrating existing Agent-based User Hybrid Runbook Workers to Extension-based Workers before 31 August 2024. Moreover, starting **1 October 2023**, creating new Agent-based Hybrid Workers wouldn't be possible. [Learn more](migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md).

You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the Azure or non-Azure machine, including servers registered with [Azure Arc-enabled servers](../azure-arc/servers/overview.md). From the machine or server that's hosting the role, you can run runbooks directly it and against resources in the environment to manage those local resources.

The Linux Hybrid Runbook Worker executes runbooks as a special user that can be elevated for running commands that need elevation. Azure Automation stores and manages runbooks and then delivers them to one or more chosen machines. This article describes how to: install the Hybrid Runbook Worker on a Linux machine, remove the worker, and remove a Hybrid Runbook Worker group. For User Hybrid Runbook Workers, see also [Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md)

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

> [!NOTE]
> A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. If you install Extension based (V2) on a hybrid worker already running Agent based (V1), then you would see two entries of the Hybrid Runbook Worker in the group. One with Platform Extension based (V2) and the other Agent based (V1). [**Learn more**](./extension-based-hybrid-runbook-worker-install.md#migrate-an-existing-agent-based-to-extension-based-hybrid-workers).

## Prerequisites

Before you start, make sure that you've the following.

### A Log Analytics workspace

The Hybrid Runbook Worker role depends on an Azure Monitor Log Analytics workspace to install and configure the role. You can create it through [Azure Resource Manager](../azure-monitor/logs/resource-manager-workspace.md#create-a-log-analytics-workspace), through [PowerShell](../azure-monitor/logs/powershell-workspace-configuration.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../azure-monitor/logs/quick-create-workspace.md).

If you don't have an Azure Monitor Log Analytics workspace, review the [Azure Monitor Log design guidance](../azure-monitor/logs/workspace-design.md) before you create the workspace.

### Log Analytics agent

The Hybrid Runbook Worker role requires the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) for the supported Linux operating system. For servers or machines hosted outside of Azure, you can install the Log Analytics agent using [Azure Arc-enabled servers](../azure-arc/servers/overview.md). The agent is installed with certain service accounts that execute commands requiring root permissions. For more information, see [Service accounts](./automation-hrw-run-runbooks.md#service-accounts).

### Supported Linux operating systems

The Hybrid Runbook Worker feature supports the following distributions. All operating systems are assumed to be x64. x86 isn't supported for any operating system.

* Amazon Linux 2012.09 to 2015.09
* CentOS Linux 5, 6, 7, and 8
* Oracle Linux 6, 7, and 8
* Red Hat Enterprise Linux Server 5, 6, 7, and 8
* Debian GNU/Linux 6, 7, and 8
* SUSE Linux Enterprise Server 12, 15, and 15.1 (SUSE didn't release versions numbered 13 or 14) 
* Ubuntu

   **Linux OS** | **Name** |
  ---|--- |
  20.04 LTS | Focal Fossa 
  18.04 LTS | Bionic Beaver 
  16.04 LTS | Xenial Xerus   
  14.04 LTS | Trusty Tahr  

> [!IMPORTANT]
> Before enabling the Update Management feature, which depends on the system Hybrid Runbook Worker role, confirm the distributions it supports [here](update-management/operating-system-requirements.md).

### Minimum requirements

The minimum requirements for a Linux system and user Hybrid Runbook Worker are:

* Two cores
* 4 GB of RAM
* Port 443 (outbound)

| **Required package** | **Description** | **Minimum version**|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported)|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | Foreign function library for Python| Python 2.x or Python 3.x are required |
|PAM | Pluggable Authentication Modules|

| **Optional package** | **Description** | **Minimum version**|
|--------------------- | --------------------- | -------------------|
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. See [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) to learn how to install it. | 6.0.0 |

### Adding a machine to a Hybrid Runbook Worker group

You can add the worker machine to a Hybrid Runbook Worker group in one of your Automation accounts. For machines hosting the system Hybrid Runbook worker managed by Update Management, they can be added to a Hybrid Runbook Worker group. But you must use the same Automation account for both Update Management and the Hybrid Runbook Worker group membership.

> [!NOTE]
> Azure Automation [Update Management](./update-management/overview.md) automatically installs the system Hybrid Runbook Worker on an Azure or non-Azure machine that's enabled for Update Management. However, this worker is not registered with any Hybrid Runbook Worker groups in your Automation account. To run your runbooks on those machines, you need to add them to a Hybrid Runbook Worker group. Follow step 4 under the section [Install a Linux Hybrid Runbook Worker](#install-a-linux-hybrid-runbook-worker) to add it to a group.

## Supported Linux hardening

The following aren't yet supported:

* CIS

## Supported runbook types

Linux Hybrid Runbook Workers support a limited set of runbook types in Azure Automation, and they're described in the following table.

|Runbook type | Supported |
|-------------|-----------|
|Python 3 (preview)|Yes, required for these distros only: SUSE LES 15, RHEL 8, and CentOS 8|
|Python 2 |Yes, for any distro that doesn't require Python 3<sup>1</sup> |
|PowerShell |Yes<sup>2</sup> |
|PowerShell Workflow |No |
|Graphical |No |
|Graphical PowerShell Workflow |No |

<sup>1</sup>See [Supported Linux operating systems](#supported-linux-operating-systems).

<sup>2</sup>PowerShell runbooks require PowerShell Core to be installed on the Linux machine. See [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) to learn how to install it.

### Network configuration

For networking requirements for the Hybrid Runbook Worker, see [Configuring your network](automation-hybrid-runbook-worker.md#network-planning).

## Install a Linux Hybrid Runbook Worker

There are two methods to deploy a Hybrid Runbook Worker. You can import and run a runbook from the Runbook Gallery in the Azure portal, or you can manually run a series of PowerShell commands.

### Importing a runbook from the Runbook Gallery

The import procedure is described in detail in [Import runbooks from GitHub with the Azure portal](automation-runbook-gallery.md#import-runbooks-from-github-with-the-azure-portal). The name of the runbook to import is **Create Automation Linux HybridWorker**.

The runbook uses the following parameters.

| Parameter | Status | Description |
| ------- | ----- | ----------- |
| `Location` | Mandatory | The location for the Log Analytics workspace. |
| `ResourceGroupName` | Mandatory | The resource group for your Automation account. |
| `AccountName` | Mandatory | The Automation account name in which the Hybrid Run Worker will be registered. |
| `CreateLA` | Mandatory | If true, uses the value of `WorkspaceName` to create a Log Analytics workspace. If false, the value of `WorkspaceName` must refer to an existing workspace. |
| `LAlocation` | Optional | The location where the Log Analytics workspace will be created, or where it already exists. |
| `WorkspaceName` | Optional | The name of the Log Analytics workspace to be created or used. |
| `CreateVM` | Mandatory | If true, use the value of `VMName` as the name of a new VM. If false, use `VMName` to find and register existing VM. |
| `VMName` | Optional | The name of the virtual machine that's either created or registered, depending on the value of `CreateVM`. |
| `VMImage` | Optional | The name of the VM image to be created. |
| `VMlocation` | Optional | Location of the VM that's either created or registered. If this location isn't specified, the value of `LAlocation` is used. |
| `RegisterHW` | Mandatory | If true, register the VM as a hybrid worker. |
| `WorkerGroupName` | Mandatory | Name of the Hybrid Worker Group. |

### Manually run PowerShell commands

To install and configure a Linux Hybrid Runbook Worker, perform the following steps.

1. Enable the Azure Automation solution in your Log Analytics workspace by running the following command in an elevated PowerShell command prompt or in Cloud Shell in the [Azure portal](https://portal.azure.com):

    ```powershell
    Set-AzOperationalInsightsIntelligencePack -ResourceGroupName <resourceGroupName> -WorkspaceName <workspaceName> -IntelligencePackName "AzureAutomation" -Enabled $true
    ```

2. Deploy the Log Analytics agent to the target machine.

    - For Azure VMs, install the Log Analytics agent for Linux using the [virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md). The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace. You can use an Azure Resource Manager template, the Azure CLI, or Azure Policy to assign the [Deploy Log Analytics agent for *Linux* or *Windows* VMs](../governance/policy/samples/built-in-policies.md#monitoring) built-in policy definition. Once the agent is installed, the machine can be added to a Hybrid Runbook Worker group in your Automation account.

    - For non-Azure machines, you can install the Log Analytics agent using [Azure Arc-enabled servers](../azure-arc/servers/overview.md). Azure Arc-enabled servers support deploying the Log Analytics agent using the following methods:

      - Using the VM extensions framework.

        This feature in Azure Arc-enabled servers allows you to deploy the Log Analytics agent VM extension to a non-Azure Windows and/or Linux server. VM extensions can be managed using the following methods on your hybrid machines or servers managed by Azure Arc-enabled servers:

        - The [Azure portal](../azure-arc/servers/manage-vm-extensions-portal.md)
        - The [Azure CLI](../azure-arc/servers/manage-vm-extensions-cli.md)
        - [Azure PowerShell](../azure-arc/servers/manage-vm-extensions-powershell.md)
        - Azure [Resource Manager templates](../azure-arc/servers/manage-vm-extensions-template.md)

      - Using Azure Policy.

        Using this approach, you use the Azure Policy [Deploy Log Analytics agent to Linux or Microsoft Azure Arc machines](../governance/policy/samples/built-in-policies.md#monitoring) built-in policy definition to audit if the Arc-enabled server has the Log Analytics agent installed. If the agent isn't installed, it automatically deploys it using a remediation task. If you plan to monitor the machines with Azure Monitor for VMs, instead use the [Enable Azure Monitor for VMs](../governance/policy/samples/built-in-initiatives.md#monitoring) initiative to install and configure the Log Analytics agent.

      We recommend installing the Log Analytics agent for Windows or Linux using Azure Policy.

    > [!NOTE]
    > To manage the configuration of machines that support the Hybrid Runbook Worker role with Desired State Configuration (DSC), you must add the machines as DSC nodes.

    > [!NOTE]
    > The [nxautomation account](automation-runbook-execution.md#log-analytics-agent-for-linux) with the corresponding sudo permissions must be present during installation of the Linux Hybrid Worker. If you try to install the worker and the account is not present or doesn't have the appropriate permissions, the installation fails.

3. Verify agent is reporting to workspace.

    The Log Analytics agent for Linux connects machines to an Azure Monitor Log Analytics workspace. When you install the agent on your machine and connect it to your workspace, it automatically downloads the components that are required for the Hybrid Runbook Worker.

    When the agent has successfully connected to your Log Analytics workspace after a few minutes, you can run the following query to verify that it's sending heartbeat data to the workspace.

    ```kusto
    Heartbeat
    | where Category == "Direct Agent"
    | where TimeGenerated > ago(30m)
    ```

    In the search results, you should see heartbeat records for the machine, indicating that it's connected and reporting to the service. By default, every agent forwards a heartbeat record to its assigned workspace.

4. Run the following command to add the machine to a Hybrid Runbook Worker group, specifying the values for the parameters `-w`, `-k`, `-g`, and `-e`.

    You can get the information required for parameters `-k` and `-e` from the **Keys** page in your Automation account. Select **Keys** under the **Account settings** section from the left-hand side of the page.

    ![Manage Keys page](media/automation-hybrid-runbook-worker/elements-panel-keys.png)

    * For the `-e` parameter, copy the value for **URL**.

    * For the `-k` parameter, copy the value for **PRIMARY ACCESS KEY**.

    * For the `-g` parameter, specify the name of the Hybrid Runbook Worker group that the new Linux Hybrid Runbook worker should join. If this group already exists in the Automation account, the current machine is added to it. If this group doesn't exist, it's created with that name.

    * For the `-w` parameter, specify your Log Analytics workspace ID.

   ```bash
   sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/onboarding.py --register -w <logAnalyticsworkspaceId> -k <automationSharedKey> -g <hybridGroupName> -e <automationEndpoint>
   ```

5. Verify the deployment after the script is completed. From the **Hybrid Runbook Worker Groups** page in your Automation account, under the **User hybrid runbook workers group** tab, it shows the new or existing group and the number of members. If it's an existing group, the number of members is incremented. You can select the group from the list on the page, from the left-hand menu choose **Hybrid Workers**. On the **Hybrid Workers** page, you can see each member of the group listed.

    > [!NOTE]
    > If you are using the Log Analytics virtual machine extension for Linux for an Azure VM, we recommend setting `autoUpgradeMinorVersion` to `false` as auto-upgrading versions can cause issues with the Hybrid Runbook Worker. To learn how to upgrade the extension manually, see [Azure CLI deployment](../virtual-machines/extensions/oms-linux.md#azure-cli-deployment).

## Turn off signature validation

By default, Linux Hybrid Runbook Workers require signature validation. If you run an unsigned runbook against a worker, you see a `Signature validation failed` error. To turn off signature validation, run the following command. Replace the second parameter with your Log Analytics workspace ID.

```bash
sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --false <logAnalyticsworkspaceId>
```

## <a name="remove-linux-hybrid-runbook-worker"></a>Remove the Hybrid Runbook Worker

Run the following commands on agent-based Linux Hybrid Worker:

1. ```python
      sudo bash
   ```

1. ```python
      rm -r /home/nxautomation
   ```
1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.
1. Under **Hybrid worker group**, select **Hybrid Workers**.
1. Select the checkbox next to the machine(s) you want to delete from the hybrid worker group.
1. Select **Delete** to remove the agent-based Linux Hybrid Worker.


   > [!NOTE]
   > - This script doesn't remove the Log Analytics agent for Linux from the machine. It only removes the functionality and configuration of the Hybrid Runbook Worker role. 
   > - After you disable the Private Link in your Automation account, it might take up to 60 minutes to remove the Hybrid Runbook worker.
   > - After you remove the Hybrid Worker, the Hybrid Worker authentication certificate on the machine is valid for 45 minutes.


## Remove a Hybrid Worker group

To remove a Hybrid Runbook Worker group of Linux machines, you use the same steps as for a Windows hybrid worker group. See [Remove a Hybrid Worker group](automation-windows-hrw-install.md#remove-a-hybrid-worker-group).

## Manage Role permissions for Hybrid Worker Groups and Hybrid Workers

You can create custom Azure Automation roles and grant following permissions to Hybrid Worker Groups and Hybrid Workers. To learn more about how to create Azure Automation custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md)

**Actions** | **Description**
--- | ---
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/write | Creates a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete | Deletes a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/read | Reads a Hybrid Runbook Worker.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/delete| Deletes a Hybrid Runbook Worker.


## Check version of Hybrid Worker
To check the version of agent-based Linux Hybrid Runbook Worker, go to the following path:

`vi/opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/VERSION`

The file *VERSION* has the version number of Hybrid Runbook Worker. 

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues - Linux](troubleshoot/hybrid-runbook-worker.md#linux).
