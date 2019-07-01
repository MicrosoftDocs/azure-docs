---
title: Troubleshooting - Azure Automation Hybrid Runbook Workers
description: This article provides information troubleshooting Azure Automation Hybrid Runbook Workers
services: automation
ms.service: automation
ms.subservice: 
author: bobbytreed
ms.author: robreed
ms.date: 02/12/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Hybrid Runbook Workers

This article provides information on troubleshooting issues with Hybrid Runbook Workers.

## General

The Hybrid Runbook Worker depends on an agent to communicate with your Automation account to register the worker, receive runbook jobs, and report status. For Windows, this agent is the Microsoft Monitoring Agent. For Linux, it's the OMS Agent for Linux.

### <a name="runbook-execution-fails"></a>Scenario: Runbook execution fails

#### Issue

Runbook execution fails and you receive the following error:

```error
"The job action 'Activate' cannot be run, because the process stopped unexpectedly. The job action was attempted three times."
```

Your runbook is suspended shortly after it attempts to execute it three times. There are conditions, which may interrupt the runbook from completing. When this happens, the related error message may not include any additional information that tells you why.

#### Cause

The following are potential possible causes:

* The runbooks can't authenticate with local resources

* The hybrid worker is behind a proxy or firewall

* The runbooks can't authenticate with local resources

* The computer configured to run the Hybrid Runbook Worker feature does not meet the minimum hardware requirements.

#### Resolution

Verify the computer has outbound access to *.azure-automation.net on port 443.

Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before it is configured to host this feature. Runbooks and the background processes they use may cause the system to be over utilized and cause runbook job delays or timeouts.

Confirm the computer that will run the Hybrid Runbook Worker feature meets the minimum hardware requirements. If it does, monitor CPU and memory use to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows. If there's memory or CPU pressure, this may indicate the need to upgrade resources. You can also select a different compute resource that can support the minimum requirements and scale when workload demands indicate an increase is necessary.

Check the **Microsoft-SMA** event log for a corresponding event with description *Win32 Process Exited with code [4294967295]*. The cause of this error is you haven't configured authentication in your runbooks or specified the Run As credentials for the Hybrid worker group. Review [Runbook permissions](../automation-hrw-run-runbooks.md#runbook-permissions) to confirm you have correctly configured authentication for your runbooks.

### <a name="no-cert-found"></a>Scenario: No certificate was found in the certificate store on Hybrid Runbook Worker

#### Issue

A runbook running on a Hybrid Runbook Worker fails with the following error message:

```error
Connect-AzureRmAccount : No certificate was found in the certificate store with thumbprint 0000000000000000000000000000000000000000
At line:3 char:1
+ Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -Appl ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Connect-AzureRmAccount], ArgumentException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzureRmAccountCommand
```

#### Cause

This error occurs when you attempt to use a [Run As Account](../manage-runas-account.md) in a runbook that runs on a Hybrid Runbook Worker where the Run As Account certificate's not present. Hybrid Runbook Workers don't have the certificate asset locally by default, which is required by the Run As Account to function properly.

#### Resolution

If your Hybrid Runbook Worker is an Azure VM, you can use [Managed Identities for Azure Resources](../automation-hrw-run-runbooks.md#managed-identities-for-azure-resources) instead. This scenario allows you to authenticate to Azure resources using the managed identity of the Azure VM instead of the Run As Account, simplifying authentication. When the Hybrid Runbook Worker is an on-premises machine, you need to install the Run As Account certificate on the machine. To learn how to install the certificate, see the steps to run the [Export-RunAsCertificateToHybridWorker](../automation-hrw-run-runbooks.md#runas-script) runbook.

## Linux

The Linux Hybrid Runbook Worker depends on the OMS Agent for Linux to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, here are some possible causes for the error:

### <a name="oms-agent-not-running"></a>Scenario: The OMS Agent for Linux isn't running

#### Issue

The OMS Agent for Linux is not running

#### Cause

If the OMS Agent for Linux isn't running, it prevents the Linux Hybrid Runbook Worker from communicating with Azure Automation. The agent may not be running for various reasons.

#### Resolution

 Verify the agent is running by entering the following command: `ps -ef | grep python`. You should see output similar to the following, the python processes with **nxautomation** user account. If the Update Management or Azure Automation solutions aren't enabled, none of the following processes are running.

```bash
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

The following list shows the processes that are started for a Linux Hybrid Runbook Worker. They're all located in the `/var/opt/microsoft/omsagent/state/automationworker/` directory.


* **oms.conf** - This value is the worker manager process. It's started directly from DSC.

* **worker.conf** - This process is the Auto Registered Hybrid worker process, it's started by the worker manager. This process is used by Update Management and is transparent to the user. This process isn't present if the Update Management solution isn't enabled on the machine.

* **diy/worker.conf** - This process is the DIY hybrid worker process. The DIY hybrid worker process is used to execute user runbooks on the Hybrid Runbook Worker. It only differs from the Auto registered Hybrid worker process in the key detail that is uses a different configuration. This process isn't present if the Azure Automation solution is disabled, and the DIY Linux Hybrid Worker isn't registered.

If the OMS Agent for Linux isn't running, run the following command to start the service: `sudo /opt/microsoft/omsagent/bin/service_control restart`.

### <a name="class-does-not-exist"></a>Scenario: The specified class does not exist

If you see the error: **The specified class does not exist..** in the  `/var/opt/microsoft/omsconfig/omsconfig.log` then the OMS Agent for Linux needs to be updated. Run the following command to reinstall the OMS Agent:

```bash
wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <WorkspaceID> -s <WorkspaceKey>
```

## Windows

The Windows Hybrid Runbook Worker depends on the Microsoft Monitoring Agent to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, here are some possible causes for the error:

### <a name="mma-not-running"></a>Scenario: The Microsoft Monitoring Agent isn't running

#### Issue

The `healthservice` service isn't running on the Hybrid Runbook Worker machine.

#### Cause

If the Microsoft Monitoring Agent Windows service isn't running, this state prevents the Hybrid Runbook Worker from communicating with Azure Automation.

#### Resolution

Verify the agent is running by entering the following command in PowerShell: `Get-Service healthservice`. If the service is stopped, enter the following command in PowerShell to start the service: `Start-Service healthservice`.

### <a name="event-4502"></a> Event 4502 in Operations Manager log

#### Issue

In the **Application and Services Logs\Operations Manager** event log, you see event 4502  and EventMessage that contains **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent** with the following description: *The certificate presented by the service \<wsid\>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Please contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication. The article KB3126513 has additional troubleshooting information for connectivity issues.*

#### Cause

This issue can be caused by your proxy or network firewall blocking communication to Microsoft Azure. Verify the computer has outbound access to *.azure-automation.net on ports 443.

#### Resolution

Logs are stored locally on each hybrid worker at C:\ProgramData\Microsoft\System Center\Orchestrator\7.2\SMA\Sandboxes. You can check if there are any warning or error events in the **Application and Services Logs\Microsoft-SMA\Operations** and **Application and Services Logs\Operations Manager** event log that would indicate a connectivity or other issue that affects onboarding of the role to Azure Automation or issue while under normal operations.

[Runbook output and messages](../automation-runbook-output-and-messages.md) are sent to Azure Automation from hybrid workers just like runbook jobs that run in the cloud. You can also enable the Verbose and Progress streams the same way you would for other runbooks.

### <a name="corrupt-cache"></a> Hybrid Runbook Worker not reporting

#### Issue

Your Hybrid Runbook Worker machine is running but you don't see heartbeat data for the machine in the workspace.

The following example query shows the machines in a workspace and their last heartbeat:

```loganalytics
// Last heartbeat of each computer
Heartbeat 
| summarize arg_max(TimeGenerated, *) by Computer
```

#### Cause

This issue can be caused by a corrupt cache on the Hybrid Runbook Worker.

#### Resolution

To resolve this issue, sign in to the Hybrid Runbook Worker and run the following script. This script stops the Microsoft Monitoring Agent, removes its cache, and restarts the service. This action forces the Hybrid Runbook Worker to re-download its configuration from Azure Automation.

```powershell
Stop-Service -Name HealthService

Remove-Item -Path 'C:\Program Files\Microsoft Monitoring Agent\Agent\Health Service State' -Recurse

Start-Service -Name HealthService
```

### <a name="already-registered"></a>Scenario: You are unable to add a Hybrid Runbook Worker

#### Issue

You receive the following message when trying to add a Hybrid Runbook Worker using the `Add-HybridRunbookWorker` cmdlet.

```error
Machine is already registered
```

#### Cause

This can be caused if the machine is already registered with a different Automation Account or if you try to re-add the Hybrid Runbook Worker after removing it from a machine.

#### Resolution

To resolve this issue, remove the following registry key and restart the `HealthService` and try the `Add-HybridRunbookWorker` cmdlet again:

`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\HybridRunbookWorker`

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

