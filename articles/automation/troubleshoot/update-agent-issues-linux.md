---
title: Understand the Linux agent check results in Azure Update Management
description: Learn how to troubleshoot issues with the Update Management agent.
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 10/25/2018
ms.topic: conceptual
ms.service: automation
ms.component: update-management
manager: carmonm
---

# Understand the Linux agent check results in Update Management

There may be many reasons your Non-Azure machine is not showing **Ready** in Update Management. In Update Management, you can check the health of a Hybrid Worker agent to determine the underlying problem. This article discusses how to run the troubleshooter from the Azure portal and in offline scenarios.

## Start the troubleshooter

By clicking the **Troubleshoot** link under the **Update Agent Readiness** column in the portal, you launch the **Troubleshoot Update Agent** page. This page shows you problems with the agent and a link to this article to assist you in troubleshooting your issues.

![vm list page](../media/update-agent-issues-linux/vm-list.png)

> [!NOTE]
> The checks require the VM to be running. If the VM is not running you are presented with a button to **Start the VM**.

On the **Troubleshoot Update Agent** page, click **Run Checks**, to start the troubleshooter. The troubleshooter uses [Run command](../../virtual-machines/linux/run-command.md) to run a script on the machine to verify the dependencies that the agent has. When the troubleshooter is complete, it returns the result of the checks.

![Troubleshoot page](../media/update-agent-issues-linux/troubleshoot-page.png)

When complete, the results are returned in the window. The [check sections](#pre-requisistes-checks) provide information on what each check is looking for.

![Update agent checks page](../media/update-agent-issues-linux/update-agent-checks.png)

## Prerequisite checks

### Operating system

The OS check, verifies if the Hybrid Runbook Worker is running one of the following Operating Systems:

|Operating system  |Notes  |
|---------|---------|
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data which CentOS does not have out of the box.         |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS, 16.04 LTS, and 18.04 LTS (x86/x64)      |Linux agents must have access to an update repository.         |

## Monitoring agent service health checks

### OMS agent

This checks ensures that the OMS Agent for Linux is installed. For instructions on how to install it, see [Install the agent for Linux](../../log-analytics/log-analytics-quick-collect-linux-computer.md#install-the-agent-for-linux).

### OMS Agent status

This check ensures that the OMS Agent for Linux is running. If the agent is not running you can run the following command to attempt to restart it. For additional information on troubleshooting the agent, see [Linux Hybrid Runbook worker troubleshooting](hybrid-runbook-worker.md#linux)

```bash
sudo /opt/microsoft/omsagent/bin/service_control restart
```

### Multihoming

This check determines if the agent is reporting to multiple workspaces. Multi-homing is not supported by Update Management.

### Hybrid Runbook Worker

This checks to ensure the OMS Agent for Linux has the Hybrid Runbook Worker package. This package is required for Update Management to work.

### Hybrid Runbook Worker status

This check makes sure the Hybrid Runbook Worker is running on the machine. The following processes should be present if the Hybrid Runbook Worker is running correctly. To learn more, see [troubleshooting the OMS Agent for Linux](hybrid-runbook-worker.md#oms-agent-not-running).

```bash
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

## Connectivity checks

### General internet connectivity

This check makes sure that the machine has access to the internet. Update Management requires access to the internet to macke 

### Registration endpoint

This check determines if the agent can properly communicate with the agent service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the registration endpoint. For a list of addresses and ports to open, see [Network planning for Hybrid Workers](../automation-hybrid-runbook-worker.md#network-planning)

### Operations endpoint

This check determines if the agent can properly communicate with the Job Runtime Data Service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the Job Runtime Data Service. For a list of addresses and ports to open, see [Network planning for Hybrid Workers](../automation-hybrid-runbook-worker.md#network-planning)

### Log Analytics endpoint 1

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

### Log Analytics endpoint 2

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

### Log Analytics endpoint 3

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

## Troubleshoot offline

You can use the troubleshooter offline on a Hybrid Runbook Worker by running the script locally. The script, [scriptname](https://www.powershellgallery.com/packages/Troubleshoot-WindowsUpdateAgentRegistration) can be found on the PowerShell Gallery. An example of the output of this script is shown in the following example:

```output

```

## Next steps

To troubleshoot additional issues with your Hybrid Runbook Workers, see [Troubleshoot - Hybrid Runbook Workers](hybrid-runbook-worker.md)
