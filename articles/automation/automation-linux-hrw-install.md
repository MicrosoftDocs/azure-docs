---
title: Azure Automation Linux Hybrid Runbook Worker
description: This article provides information on installing an Azure Automation Hybrid Runbook Worker so you can run runbooks on Linux-based computers in your local datacenter or cloud environment.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 06/28/2018
ms.topic: conceptual
manager: carmonm
---
# Deploy a Linux Hybrid Runbook Worker

You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the computer that's hosting the role and against resources in the environment to manage those local resources. The Linux Hybrid Runbook Worker executes runbooks as a special user that can be elevated for running commands that need elevation. Runbooks are stored and managed in Azure Automation and then delivered to one or more designated computers.

This article describes how to install the Hybrid Runbook Worker on a Linux machine.

## Supported Linux operating systems

The Hybrid Runbook Worker feature supports the following distributions:

* Amazon Linux 2012.09 to 2015.09 (x86/x64)
* CentOS Linux 5, 6, and 7 (x86/x64)
* Oracle Linux 5, 6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5, 6, and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, and 16.04 LTS (x86/x64)
* SUSE Linux Enterprise Server 11 and 12 (x86/x64)

## Installing a Linux Hybrid Runbook Worker

To install and configure a Hybrid Runbook Worker on your Linux computer, you follow a straightforward process to manually install and configure the role. It requires enabling the **Automation Hybrid Worker** solution in your Azure Log Analytics workspace and then running a set of commands to register the computer as a worker and add it to a group.

The minimum requirements for a Linux Hybrid Runbook Worker are:

* Two cores
* 4 GB of RAM
* Port 443 (outbound)

### Package requirements

| **Required package** | **Description** | **Minimum version**|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | |
|PAM | Pluggable Authentication Modules|
| **Optional package** | **Description** | **Minimum version**|
| PowerShell Core | To run PowerShell runbooks, PowerShell needs to be installed, see [Installing PowerShell Core on Linux](/powershell/scripting/setup/installing-powershell-core-on-linux) to learn how to install it.  | 6.0.0 |

### Installation

Before you proceed, note the Log Analytics workspace that your Automation account is linked to. Also note the primary key for your Automation account. You can find both from the Azure portal by selecting your Automation account, selecting **Workspace** for the workspace ID, and selecting **Keys** for the primary key. For information on ports and addresses that you need for the Hybrid Runbook Worker, see [Configuring your network](automation-hybrid-runbook-worker.md#network-planning).

1. Enable the **Automation Hybrid Worker** solution in Azure by using one of the following methods:

   * Add the **Automation Hybrid Worker** solution to your subscription by using the procedure at [Add Azure Monitor logs solutions to your workspace](../log-analytics/log-analytics-add-solutions.md).
   * Run the following cmdlet:

        ```azurepowershell-interactive
         Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName  <ResourceGroupName> -WorkspaceName <WorkspaceName> -IntelligencePackName  "AzureAutomation" -Enabled $true
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

1. After the command is completed, the **Hybrid Worker Groups** page in the Azure portal shows the new group and the number of members. If this is an existing group, the number of members is incremented. You can select the group from the list on the **Hybrid Worker Groups** page and select the **Hybrid Workers** tile. On the **Hybrid Workers** page, you see each member of the group listed.

> [!NOTE]
> If you are using the Azure Monitor virtual machine extension for Linux for an Azure VM we recommend setting `autoUpgradeMinorVersion` to false as auto upgrading versions can cause issues the Hybrid Runbook Worker. To learn how to upgrade the extension manually, see [Azure CLI deployment
](../virtual-machines/extensions/oms-linux.md#azure-cli-deployment).

## Turning off signature validation

By default, Linux Hybrid Runbook Workers require signature validation. If you run an unsigned runbook against a worker, you see an error that says "Signature validation failed." To turn off signature validation, run the following command. Replace the second parameter with your log analytics workspace ID.

 ```bash
 sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --false <LogAnalyticsworkspaceId>
 ```

## Supported runbook types

Linux Hybrid Runbook Workers don't support the full set of runbook types in Azure Automation.

The following runbook types work on a Linux Hybrid Worker:

* Python 2
* PowerShell

  > [!NOTE]
  > PowerShell runbooks require PowerShell Core to be installed on the Linux machine. See [Installing PowerShell Core on Linux](/powershell/scripting/setup/installing-powershell-core-on-linux) to learn how to install it.

The following runbook types don't work on a Linux Hybrid Worker:

* PowerShell Workflow
* Graphical
* Graphical PowerShell Workflow

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).
* For instructions on how to remove Hybrid Runbook Workers, see [Remove Azure Automation Hybrid Runbook Workers](automation-hybrid-runbook-worker.md#remove-a-hybrid-runbook-worker).
* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshooting Linux Hybrid Runbook Workers](troubleshoot/hybrid-runbook-worker.md#linux)