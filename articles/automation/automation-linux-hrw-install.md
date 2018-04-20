---
title: Azure Automation Linux Hybrid Runbook Worker
description: This article provides information on installing an Azure Automation Hybrid Runbook Worker that allows you to run runbooks on Linux-based computers in your local datacenter or cloud environment.
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 04/17/2018
ms.topic: article
manager: carmonm
---
# How to deploy a Linux Hybrid Runbook Worker

The Hybrid Runbook Worker feature of Azure Automation allows you to run runbooks directly on the computer hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more designated computers. This article decribes how to install the Hybrid Runbook Worker on a Linux machine.

## Supported Linux Operating Systems

The following is a list of Linux distrobutions that are supported.

* Amazon Linux 2012.09 --> 2015.09 (x86/x64)
* CentOS Linux 5,6, and 7 (x86/x64)
* Oracle Linux 5,6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5,6 and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 16.04 LTS (x86/x64)
* SUSE Linux Enteprise Server 11 and 12 (x86/x64)

## Installing Linux Hybrid Runbook Worker

To install and configure a Hybrid Runbook Worker on your Linux computer, you follow a straight forward process to manually install and configure the role. It requires enabling the **Automation Hybrid Worker** solution in your Log Analytics workspace and then running a set of commands to register the computer as a worker and add it to a new or existing group.

Before you proceed, you need to note the Log Analytics workspace your Automation account is linked to and also the primary key for your Automation account. You can find both from the portal by selecting your Automation account, and selecting **Workspace** for the Workspace ID, and selecting **Keys** for the primary key. For information on ports and addresses that are needed for the Hybrid Runbook Worker, see [Configuring your network](automation-hybrid-runbook-worker.md#network-planning).

1. Enable the "Automation Hybrid Worker" solution in Azure. This can be done by either:

   1. Add the **Automation Hybrid Worker** solution to your subscription using the procedure at [Add Log Analytics management solutions to your workspace](../log-analytics/log-analytics-add-solutions.md).
   1. Run the following cmdlet:

        ```powershell-interactive
         $null = Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName  <ResourceGroupName> -WorkspaceName <WorkspaceName> -IntelligencePackName  "AzureAutomation" -Enabled $true
        ```

1. Install the OMS agent for Linux by running the following command, replacing \<WorkspaceID\> and \<WorkspaceKey\> with the appropriate values from your workspace.

   ```bash
   wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <WorkspaceID> -s <WorkspaceKey>
   ```

1. Run the following command, changing the values for parameters *-w*, *-k*, *-g*, and *-e*. For the *-g* parameter, replace the value with the name of the Hybrid Runbook Worker group that the new Linux Hybrid Runbook Worker should join. If the name does not exist already in your Automation account, a new Hybrid Runbook Worker group is made with that name.

   ```bash
   sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/onboarding.py --register -w <LogAnalyticsworkspaceId> -k <AutomationSharedKey> -g <hybridgroupname> -e <automationendpoint>
   ```

1. After the command is complete, the Hybrid Worker Groups page in the Azure portal will show the new group and number of members or if an existing group, the number of members is incremented. You can select the group from the list on the **Hybrid Worker Groups** page and select the **Hybrid Workers** tile. On the **Hybrid Workers** page, you see each member of the group listed.

## Turning off signature validation

By default, Linux Hybrid Runbook Workers require signature validation. If you run an unsigned runbook against a worker, you see an error containing "Signature validation failed". To turn off signature validation, run the following command, replacing the second parameter with your Log Analytics workspace ID:

 ```bash
 sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --false <LogAnalyticsworkspaceId>
 ```

## Privileges

The Linux Hybrid Runbook Worker executes runbooks as a special user which can be elevated for running commands that need elevation.

## Supported runbook types

Linux Hybrid Runbook Workers do not support the full set of runbook types that are found within Azure automation.

The following runbook types work on a Linux Hybrid Worker:

* Python 2
* PowerShell

The following runbook types do not work on a Linux Hybrid Worker:

* PowerShell Workflow
* Graphical
* Graphical PowerShell Workflow

## Next steps

* Review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.
* For instructions on how to remove Hybrid Runbook Workers, see [Remove Azure Automation Hybrid Runbook Workers](automation-remove-hrw.md)
