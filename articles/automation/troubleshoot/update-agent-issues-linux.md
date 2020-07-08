---
title: Troubleshooting Linux update agent issues in Azure Automation
description: This article tells how to troubleshoot and resolve issues with the Linux Windows update agent in Update Management.
services: automation
author: mgoedtel
ms.author: magoedte
ms.date: 12/03/2019
ms.topic: conceptual
ms.service: automation
ms.subservice: update-management
manager: carmonm
---

# Troubleshoot Linux update agent issues

There can be many reasons why your machine isn't showing up as ready (healthy) in Update Management. You can check the health of a Linux Hybrid Runbook Worker agent to determine the underlying problem. The following are the three readiness states for a machine:

* Ready: The Hybrid Runbook Worker is deployed and was last seen less than one hour ago.
* Disconnected: The Hybrid Runbook Worker is deployed and was last seen over one hour ago.
* Not configured: The Hybrid Runbook Worker isn't found or hasn't finished deployment.

> [!NOTE]
> There can be a slight delay between what the Azure portal shows and the current state of a machine.

This article discusses how to run the troubleshooter for Azure machines from the Azure portal and non-Azure machines in the [offline scenario](#troubleshoot-offline). 

> [!NOTE]
> The troubleshooter script currently doesn't route traffic through a proxy server if one is configured.

## Start the troubleshooter

For Azure machines, select the **troubleshoot** link under the **Update Agent Readiness** column in the portal to open the Troubleshoot Update Agent page. For non-Azure machines, the link brings you to this article. To troubleshoot a non-Azure machine, see the instructions in the "Troubleshoot offline" section.

![VM list page](../media/update-agent-issues-linux/vm-list.png)

> [!NOTE]
> The checks require the VM to be running. If the VM isn't running, **Start the VM** appears.

On the Troubleshoot Update Agent page, select **Run Checks** to start the troubleshooter. The troubleshooter uses [Run command](../../virtual-machines/linux/run-command.md) to run a script on the machine to verify the dependencies. When the troubleshooter is finished, it returns the result of the checks.

![Troubleshoot page](../media/update-agent-issues-linux/troubleshoot-page.png)

When the checks are finished, the results are returned in the window. The check sections provide information on what each check is looking for.

![Update agent checks page](../media/update-agent-issues-linux/update-agent-checks.png)

## Prerequisite checks

### Operating system

The operating system check verifies if the Hybrid Runbook Worker is running one of the following operating systems.

|Operating system  |Notes  |
|---------|---------|
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data, which CentOS doesn't have out of the box.         |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS, 16.04 LTS, and 18.04 LTS (x86/x64)      |Linux agents must have access to an update repository.         |

## Monitoring agent service health checks

### Log Analytics agent

This check ensures that the Log Analytics agent for Linux is installed. For instructions on how to install it, see [Install the agent for Linux](../../azure-monitor/learn/quick-collect-linux-computer.md#install-the-agent-for-linux).

### Log Analytics agent status

This check ensures that the Log Analytics agent for Linux is running. If the agent isn't running, you can run the following command to attempt to restart it. For more information on troubleshooting the agent, see [Linux - Troubleshoot Hybrid Runbook Worker issues](hybrid-runbook-worker.md#linux).

```bash
sudo /opt/microsoft/omsagent/bin/service_control restart
```

### Multihoming

This check determines if the agent is reporting to multiple workspaces. Update Management doesn't support multihoming.

### Hybrid Runbook Worker

This check verifies if the Log Analytics agent for Linux has the Hybrid Runbook Worker package. This package is required for Update Management to work. To learn more, see [Log Analytics agent for Linux isn't running](hybrid-runbook-worker.md#oms-agent-not-running).

Update Management downloads Hybrid Runbook Worker packages from the operations endpoint. Therefore, if the Hybrid Runbook Worker is not running and the [operations endpoint](#operations-endpoint) check fails, the update can fail.

### Hybrid Runbook Worker status

This check makes sure the Hybrid Runbook Worker is running on the machine. The processes in the example below should be present if the Hybrid Runbook Worker is running correctly.


```bash
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

## Connectivity checks

### General internet connectivity

This check makes sure that the machine has access to the internet.

### Registration endpoint

This check determines if the Hybrid Runbook Worker can properly communicate with Azure Automation in the Log Analytics workspace.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the registration endpoint. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

### Operations endpoint

This check determines if the Log Analytics agent can properly communicate with the Job Runtime Data Service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the Job Runtime Data Service. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

### Log Analytics endpoint 1

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

### Log Analytics endpoint 2

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

### Log Analytics endpoint 3

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

## <a name="troubleshoot-offline"></a>Troubleshoot offline

You can use the troubleshooter offline on a Hybrid Runbook Worker by running the script locally. The Python script, [update_mgmt_health_check.py](https://gallery.technet.microsoft.com/scriptcenter/Troubleshooting-utility-3bcbefe6), can be found in Script Center. An example of the output of this script is shown in the following example:

```output
Debug: Machine Information:   Static hostname: LinuxVM2
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 00000000000000000000000000000000
           Boot ID: 00000000000000000000000000000000
    Virtualization: microsoft
  Operating System: Ubuntu 16.04.5 LTS
            Kernel: Linux 4.15.0-1025-azure
      Architecture: x86-64


Passed: Operating system version is supported

Passed: Microsoft Monitoring agent is installed

Debug: omsadmin.conf file contents:
        WORKSPACE_ID=00000000-0000-0000-0000-000000000000
        AGENT_GUID=00000000-0000-0000-0000-000000000000
        LOG_FACILITY=local0
        CERTIFICATE_UPDATE_ENDPOINT=https://00000000-0000-0000-0000-000000000000.oms.opinsights.azure.com/ConfigurationService.Svc/RenewCertificate
        URL_TLD=opinsights.azure.com
        DSC_ENDPOINT=https://scus-agentservice-prod-1.azure-automation.net/Accou            nts/00000000-0000-0000-0000-000000000000/Nodes\(AgentId='00000000-0000-0000-0000-000000000000'\)
        OMS_ENDPOINT=https://00000000-0000-0000-0000-000000000000.ods.opinsights            .azure.com/OperationalData.svc/PostJsonDataItems
        AZURE_RESOURCE_ID=/subscriptions/00000000-0000-0000-0000-000000000000/re            sourcegroups/myresourcegroup/providers/microsoft.compute/virtualmachines/linuxvm            2
        OMSCLOUD_ID=0000-0000-0000-0000-0000-0000-00
        UUID=00000000-0000-0000-0000-000000000000


Passed: Microsoft Monitoring agent is running

Passed: Machine registered with log analytics workspace:['00000000-0000-0000-0000-000000000000']

Passed: Hybrid worker package is present

Passed: Hybrid worker is running

Passed: Machine is connected to internet

Passed: TCP test for {scus-agentservice-prod-1.azure-automation.net} (port 443)             succeeded

Passed: TCP test for {eus2-jobruntimedata-prod-su1.azure-automation.net} (port 4            43) succeeded

Passed: TCP test for {00000000-0000-0000-0000-000000000000.ods.opinsights.azure.            com} (port 443) succeeded

Passed: TCP test for {00000000-0000-0000-0000-000000000000.oms.opinsights.azure.            com} (port 443) succeeded

Passed: TCP test for {ods.systemcenteradvisor.com} (port 443) succeeded

```

## Next steps

[Troubleshoot Hybrid Runbook Worker issues](hybrid-runbook-worker.md).
