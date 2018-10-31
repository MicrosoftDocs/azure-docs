---
title: Troubleshooting - Azure Automation Hybrid Runbook Workers
description: This article provides information troubleshooting Azure Automation Hybrid Runbook Workers
services: automation
ms.service: automation
ms.component: 
author: georgewallace
ms.author: gwallace
ms.date: 06/19/2018
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Hybrid Runbook Workers

This article provides information on troubleshooting issues with Hybrid Runbook Workers.

## General

The Hybrid Runbook Worker depends on an agent to communicate with your Automation account to register the worker, receive runbook jobs, and report status. For Windows, this agent is the Microsoft Monitoring Agent. For Linux, it is the OMS Agent for Linux.

### <a name="runbook-execution-fails"></a>Scenario: Runbook execution fails

#### Issue

Runbook execution fails and you receive the following error:

```
"The job action 'Activate' cannot be run, because the process stopped unexpectedly. The job action was attempted three times."
```

Your runbook is suspended shortly after attempting to execute it three times. There are conditions, which may interrupt the runbook from completing successfully and the related error message does not include any additional information indicating why.

#### Cause

The following are potential possible causes:

* The runbooks can't authenticate with local resources

* The hybrid worker is behind a proxy or firewall

* The runbooks can't authenticate with local resources

* The computer designated to run the Hybrid Runbook Worker feature meets the minimum hardware requirements.

#### Resolution

Verify the computer has outbound access to *.azure-automation.net on port 443.

Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before designating it to host this feature. Otherwise, depending on the resource utilization of other background processes and contention caused by runbooks during execution, the computer becomes over utilized and cause runbook job delays or timeouts.

Confirm the computer designated to run the Hybrid Runbook Worker feature meets the minimum hardware requirements. If it does, monitor CPU and memory utilization to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows. If there is memory or CPU pressure, this may indicate the need to upgrade or add additional processors, or increase memory to address the resource bottleneck and resolve the error. Alternatively, select a different compute resource that can support the minimum requirements and scale when workload demands indicate an increase is necessary.

Check the **Microsoft-SMA** event log for a corresponding event with description *Win32 Process Exited with code [4294967295]*. The cause of this error is you haven't configured authentication in your runbooks or specified the Run As credentials for the Hybrid worker group. Review [Runbook permissions](../automation-hrw-run-runbooks.md#runbook-permissions) to confirm you have correctly configured authentication for your runbooks.

## Linux

The Linux Hybrid Runbook Worker depends on the OMS Agent for Linux to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, here are some possible causes for the error:

### <a name="oms-agent-not-running"></a>Scenario: The OMS Agent for Linux is not running

If the OMS Agent for Linux is not running, this prevents the Linux Hybrid Runbook Worker from communicating with Azure Automation. Verify the agent is running by entering the following command: `ps -ef | grep python`. You should see output similar to the following, the python processes with **nxautomation** user account. If the Update Management or Azure Automation solutions are not enabled, none of the following processes are running.

```bash
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

The following list shows the processes that are started for a Linux Hybrid Runbook Worker. They are all located in the `/var/opt/microsoft/omsagent/state/automationworker/` directory.

* **oms.conf** - This is the worker manager process, this is started directly from DSC.

* **worker.conf** - This process is the Auto Registered Hybrid worker process, it is started by the worker manager. This process is used by Update Management and is transparent to the user. This process is not present if the Update Management solution is not enabled on the machine.

* **diy/worker.conf** - This process is the DIY hybrid worker process. The DIY hybrid worker process is used to execute user runbooks on the Hybrid Runbook Worker. It only differs from the Auto registered Hybrid worker process in the key detail that is uses a different configuration. This process is not present if the Azure Automation solution is not enabled, and the DIY Linux Hybrid Worker is not registered.

If the OMS Agent for Linux is not running, run the following command to start the service: `sudo /opt/microsoft/omsagent/bin/service_control restart`.

### <a name="class-does-not-exist"></a>Scenario: The specified class does not exist

If you see the error: **The specified class does not exist..** in the  `/var/opt/microsoft/omsconfig/omsconfig.log` then the OMS Agent for Linux needs to be updated. Run the following command to reinstall the OMS Agent:

```bash
wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <WorkspaceID> -s <WorkspaceKey>
```

## Windows

The Windows Hybrid Runbook Worker depends on the Microsoft Monitoring Agent to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, here are some possible causes for the error:

### <a name="mma-not-running"></a>Scenario: The Microsoft Monitoring Agent is not running

#### Issue

The `healthservice` service is not running on the Hybrid Runbook Worker machine.

#### Cause

If the Microsoft Monitoring Agent Windows service is not running, this prevents the Hybrid Runbook Worker from communicating with Azure Automation.

#### Resolution

Verify the agent is running by entering the following command in PowerShell: `Get-Service healthservice`. If the service is stopped, enter the following command in PowerShell to start the service: `Start-Service healthservice`.

### <a name="event-4502"></a> Event 4502 in Operations Manager log

#### Issue

In the **Application and Services Logs\Operations Manager** event log, you see event 4502  and EventMessage containing **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent** with the following description: *The certificate presented by the service \<wsid\>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Please contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication. The article KB3126513 has additional troubleshooting information for connectivity issues.*

#### Cause

This can be caused by your proxy or network firewall blocking communication to Microsoft Azure. Verify the computer has outbound access to *.azure-automation.net on ports 443.

#### Resolution

Logs are stored locally on each hybrid worker at C:\ProgramData\Microsoft\System Center\Orchestrator\7.2\SMA\Sandboxes. You can check if there are any warning or error events written to the **Application and Services Logs\Microsoft-SMA\Operations** and **Application and Services Logs\Operations Manager** event log that would indicate a connectivity or other issue affecting onboarding of the role to Azure Automation or issue while performing normal operations.

[Runbook output and messages](../automation-runbook-output-and-messages.md) are sent to Azure Automation from hybrid workers just like runbook jobs run in the cloud. You can also enable the Verbose and Progress streams the same way you would for other runbooks.

## Next steps

If you did not see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
