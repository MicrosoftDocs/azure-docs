---
title: Troubleshooting Linux update agent issues in Azure Automation
description: This article tells how to troubleshoot and resolve issues with the Linux Windows update agent in Update Management.
services: automation
ms.date: 11/01/2021
ms.topic: troubleshooting
ms.subservice: update-management
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

For Azure machines, select the **troubleshoot** link under the **Update Agent Readiness** column in the portal to open the Troubleshoot Update Agent page. For non-Azure machines, the link brings you to this article. To troubleshoot a non-Azure machine, see the instructions in the **Troubleshoot offline** section.

:::image type="content" source="../media/update-agent-issues-linux/vm-list.png" alt-text="Screenshot of VM list page.":::

> [!NOTE]
> The checks require the VM to be running. If the VM isn't running, **Start the VM** appears.

On the Troubleshoot Update Agent page, select **Run Checks** to start the troubleshooter. The troubleshooter uses [Run command](../../virtual-machines/linux/run-command.md) to run a script on the machine to verify the dependencies. When the troubleshooter is finished, it returns the result of the checks.

:::image type="content" source="../media/update-agent-issues-linux/troubleshoot-page.png" alt-text="Screenshot of Troubleshoot page.":::


When the checks are finished, the results are returned in the window. The check sections provide information on what each check is looking for.

:::image type="content" source="../media/update-agent-issues-linux/actionable-tasks-linux-inline.png" alt-text="Screenshot of Linux Troubleshooter." border="false" lightbox="../media/update-agent-issues-linux/actionable-tasks-linux-expanded.png":::


## Prerequisite checks

### Operating system

The operating system check verifies if the Hybrid Runbook Worker is running one of the [supported operating systems](../update-management/operating-system-requirements.md#supported-operating-systems).

### Dmidecode check

To verify if a VM is an Azure VM, check for Asset tag value using the below command:

```
sudo dmidecode
```

If the asset tag is different than 7783-7084-3265-9085-8269-3286-77, then reboot VM to initiate re-registration. 


## Monitoring agent service health checks

### Monitoring Agent

To fix this, install Azure Log Analytics Linux agent and ensure it communicates the required endpoints. For more information, see [Install Log Analytics agent on Linux computers](../../azure-monitor/agents/agent-linux.md).

This task checks if the folder is present - 

*/etc/opt/microsoft/omsagent/conf/omsadmin.conf*

### Monitoring Agent status
 
To fix this issue, you must start the OMS Agent service by using the following command: 

```
 sudo /opt/microsoft/omsagent/bin/service_control restart
```

To validate you can perform process check using the below command: 

```
process_name = "omsagent" 
ps aux | grep %s | grep -v grep" % (process_name) 
```

For more information, see [Troubleshoot issues with the Log Analytics agent for Linux](../../azure-monitor/agents/agent-linux-troubleshoot.md)


### Multihoming
This check determines if the agent is reporting to multiple workspaces. Update Management doesn't support multihoming.

To fix this issue, purge the OMS Agent completely and reinstall it with the [workspace linked with Update management](../../azure-monitor/agents/agent-linux-troubleshoot.md#purge-and-reinstall-the-linux-agent)


Validate that there are no more multihoming by checking the directories under this path:

 */var/opt/microsoft/omsagent*. 

As they are the directories of workspaces, the number of directories equals the number of workspaces on-boarded to OMSAgent.

### Hybrid Runbook Worker
To fix the issue, run the following command: 

```
sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py'
```

This command forces the omsconfig agent to talk to Azure Monitor and retrieve the latest configuration. 

Validate to check if the following two paths exists:

```
/opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/VERSION </br> /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/configuration.py
```

### Hybrid Runbook Worker status

This check makes sure the Hybrid Runbook Worker is running on the machine. The processes in the example below should be present if the Hybrid Runbook Worker is running correctly.
```
ps -ef | grep python
```

```
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

Update Management downloads Hybrid Runbook Worker packages from the operations endpoint. Therefore, if the Hybrid Runbook Worker is not running and the [operations endpoint](#operations-endpoint) check fails, the update can fail.

To fix this issue, run the following command:

```
sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py'
```

This command forces the omsconfig agent to talk to Azure Monitor and retrieve the latest configuration. 

If the issue still persists, run the [omsagent Log Collector tool](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/tools/LogCollector/OMS_Linux_Agent_Log_Collector.md)



## Connectivity checks

### Proxy enabled check

To fix the issue, either remove the proxy or make sure that the proxy address is able to access the [prerequisite URL](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory).

You can validate the task by running the below command:

```
HTTP_PROXY
```

### IMDS connectivity check

To fix this issue, allow access to IP **169.254.169.254**. For more information, see [Access Azure Instance Metadata Service](../../virtual-machines/windows/instance-metadata-service.md#azure-instance-metadata-service-windows)

After the network changes, you can either rerun the Troubleshooter or run the below commands to validate: 

```
 curl -H \"Metadata: true\" http://169.254.169.254/metadata/instance?api-version=2018-02-01
```

### General internet connectivity

This check makes sure that the machine has access to the internet and can be ignored if you have blocked internet and allowed only specific URLs. 

CURL on any http url.

### Registration endpoint

This check determines if the Hybrid Runbook Worker can properly communicate with Azure Automation in the Log Analytics workspace.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the registration endpoint. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning)

Fix this issue by allowing the prerequisite URLs. For more information, see [Update Management and Change Tracking and Inventory](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory)

Post the network changes you can either re-run the troubleshooter or CURL on provided jrds endpoint.

### Operations endpoint

This check determines if the Log Analytics agent can properly communicate with the Job Runtime Data Service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the Job Runtime Data Service. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

### Log Analytics endpoint 1

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

Fix this issue by allowing the [prerequisite URLs](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory).

Post making Network changes you can either rerun the Troubleshooter or
Curl on provided ODS endpoint.

### Log Analytics endpoint 2

This check verifies that your machine has access to the endpoints needed by the Log Analytics agent.

Fix this issue by allowing the [prerequisite URLs](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory).

Post making Network changes you can either rerun the Troubleshooter or
Curl on provided OMS endpoint


### Software repositories

Fix this issue by allowing the prerequisite Repo URL. For RHEL, see [here](../../virtual-machines/workloads/redhat/redhat-rhui.md#troubleshoot-connection-problems-to-azure-rhui).

Post making Network changes you can either rerun the Troubleshooter or

Curl on software repositories configured in package manager. 

Refreshing repos would help to confirm the communication. 

```
sudo apt-get check
sudo yum check-update
```
> [!NOTE]
> The check is available only in offline mode.

## <a name="troubleshoot-offline"></a>Troubleshoot offline

You can use the troubleshooter offline on a Hybrid Runbook Worker by running the script locally. The Python script, [UM_Linux_Troubleshooter_Offline.py](https://github.com/Azure/updatemanagement/blob/main/UM_Linux_Troubleshooter_Offline.py), can be found in GitHub.

 > [!NOTE]
 > The current version of the troubleshooter script does not support Ubuntu 20.04.


An example of the output of this script is shown in the following example:

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
