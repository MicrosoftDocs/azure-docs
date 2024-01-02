---
title: Troubleshoot agent-based Hybrid Runbook Worker issues in Azure Automation
description: This article tells how to troubleshoot and resolve issues that arise with Azure Automation agent-based Hybrid Runbook Workers.
services: automation
ms.date: 09/17/2023
ms.topic: troubleshooting 
ms.custom: devx-track-linux, has-azure-ad-ps-ref
---

# Troubleshoot agent-based Hybrid Runbook Worker issues in Automation

> [!IMPORTANT]
>  Azure Automation Agent-based User Hybrid Runbook Worker (Windows and Linux) will retire on **31 August 2024** and wouldn't be supported after that date. You must complete migrating existing Agent-based User Hybrid Runbook Workers to Extension-based Workers before 31 August 2024. Moreover, starting **1 November 2023**, creating new Agent-based Hybrid Workers wouldn't be possible. [Learn more](../migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md)

This article provides information on troubleshooting and resolving issues with Azure Automation agent-based Hybrid Runbook Workers. For troubleshooting extension-based workers, see [Troubleshoot extension-based Hybrid Runbook Worker issues in Automation](./extension-based-hybrid-runbook-worker.md). For general information, see [Hybrid Runbook Worker overview](../automation-hybrid-runbook-worker.md).

## General

The Hybrid Runbook Worker depends on an agent to communicate with your Azure Automation account to register the worker, receive runbook jobs, and report status. For Windows, this agent is the Log Analytics agent for Windows. For Linux, it's the Log Analytics agent for Linux.


### Unable to update Az modules while using the Hybrid Worker

#### Issue

The Hybrid Runbook Worker jobs failed as it was unable to import Az modules.

#### Resolution

As a workaround, you can follow these steps:

1. Go to the folder : C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\7.3.1722.0\HybridAgent
1. Edit the file with the name *Orchestrator.Sandbox.exe.config*
1. Add the following lines inside the `<assemblyBinding>` tags:
```xml
<dependentAssembly>
  <assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" culture="neutral" />
  <bindingRedirect oldVersion="0.0.0.0-13.0.0.0" newVersion="13.0.0.0" />
</dependentAssembly>
```

> [!NOTE]
> The workaround replaces the file with the original if you restart MMA/server either by enabling solution or patching. For both these scenarios, we recommend that you replace the contents.


### <a name="runbook-execution-fails"></a>Scenario: Runbook execution fails

#### Issue

Runbook execution fails, and you receive the following error message:

`The job action 'Activate' cannot be run, because the process stopped unexpectedly. The job action was attempted three times.`

Your runbook is suspended shortly after it attempts to execute three times. There are conditions that can interrupt the runbook from completing. The related error message might not include any additional information.

#### Cause

The following are possible causes:

* The runbooks can't authenticate with local resources.
* The hybrid worker is behind a proxy or firewall.
* The computer configured to run the Hybrid Runbook Worker doesn't meet the minimum hardware requirements.

#### Resolution

Verify that the computer has outbound access to **\*.azure-automation.net** on port 443.

Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before the worker is configured to host this feature. Runbooks and the background process they use might cause the system to be overused and cause runbook job delays or timeouts.

Confirm the computer to run the Hybrid Runbook Worker feature meets the minimum hardware requirements. If it does, monitor CPU and memory use to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows. Any memory or CPU pressure can indicate the need to upgrade resources. You can also select a different compute resource that supports the minimum requirements and scale when workload demands indicate an increase is necessary.

Check the **Microsoft-SMA** event log for a corresponding event with the description `Win32 Process Exited with code [4294967295]`. The cause of this error is that you haven't configured authentication in your runbooks or specified the Run As credentials for the Hybrid Runbook Worker group. Review runbook permissions in [Running runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md) to confirm that you've correctly configured authentication for your runbooks.

### Scenario: Runbooks fail with gateway error

#### Issue

The Hybrid Runbook Worker jobs failed to refresh when communicating through a Log Analytics Gateway server and the error returned is similar to: `Spool operation id does not exist (spool ID): see attachment for job details and exact exception messages.`

#### Resolution

Verify the Log Analytics Gateway server is online and is accessible from the machine hosting the Hybrid Runbook Worker role. For additional troubleshooting information, see [Troubleshoot Log Analytics Gateway](../../azure-monitor/agents/gateway.md#troubleshooting).


### Scenario: Job failed to start as the Hybrid Worker was not available when the scheduled job started

#### Issue
Job fails to start on a Hybrid Worker and you see the following error:

*Failed to start, as hybrid worker was not available when scheduled job started, the hybrid worker was last active at mm/dd/yyyy*.

#### Cause
This error can occur due to the following reasons:
- The machines doesn't exist anymore.
- The machine is turned off and is unreachable.
- The machine has a network connectivity issue.
- The Hybrid Runbook Worker extension has been uninstalled from the machine.

#### Resolution
- Ensure that the machine exists, and Hybrid Runbook Worker extension is installed on it. The Hybrid Worker should be healthy and should give a heartbeat. Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor [HybridWorkerPing](../../azure-monitor/essentials/metrics-supported.md#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 

### Scenario: Job was suspended as it exceeded the job limit for a Hybrid Worker

#### Issue
Job gets suspended with the following error message:

*Job was suspended as it exceeded the job limit for a Hybrid Worker. Add more Hybrid Workers to the Hybrid Worker group to overcome this issue.*

#### Cause
Jobs might get suspended due to any of the following reasons:
- Each active Hybrid Worker in the group will poll for jobs every 30 seconds to see if any jobs are available. The Worker picks jobs on a first-come, first-serve basis. Depending on when a job was pushed, whichever Hybrid Worker within the Hybrid Worker Group pings the Automation service first picks up the job. A single hybrid worker can generally pick up four jobs per ping (that is, every 30 seconds). If your rate of pushing jobs is higher than four per 30 seconds and no other Worker picks up the job, the job might get suspended. 
- Hybrid Worker might not be polling as expected every 30 seconds. This could happen if the Worker is not healthy or there are network issues.  

#### Resolution
- If the job limit for a Hybrid Worker exceeds four jobs per 30 seconds, you can add more Hybrid Workers to the Hybrid Worker group for high availability and load balancing. You can also schedule jobs so they do not exceed the limit of four jobs per 30 seconds. The processing time of the jobs queue depends on the Hybrid worker hardware profile and load. Ensure that the Hybrid Worker is healthy and gives a heartbeat. 
- Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor the [HybridWorkerPing](../../azure-monitor/essentials/metrics-supported.md#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 






### <a name="cannot-connect-signalr"></a>Scenario: Event 15011 in the Hybrid Runbook Worker

#### Issue

The Hybrid Runbook Worker receives event 15011, indicating that a query result isn't valid. The following error appears when the worker attempts to open a connection with the [SignalR server](/aspnet/core/signalr/introduction).

`[AccountId={c7d22bd3-47b2-4144-bf88-97940102f6ca}]
[Uri=https://cc-jobruntimedata-prod-su1.azure-automation.net/notifications/hub][Exception=System.TimeoutException: Transport timed out trying to connect​
   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()​
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)​
   at JobRuntimeData.NotificationsClient.JobRuntimeDataServiceSignalRClient.<Start>d__45.MoveNext()​
`

#### Cause

The Hybrid Runbook Worker hasn't been configured correctly for the automated feature deployment, for example, for Update Management. The deployment contains a part that connects the VM to the Log Analytics workspace. The PowerShell script looks for the workspace in the subscription with the supplied name. In this case, the Log Analytics workspace is in a different subscription. The script can't find the workspace and tries to create one, but the name is already taken. As a result, the deployment fails.

#### Resolution

You have two options for resolving this issue:

* Modify the PowerShell script to look for the Log Analytics workspace in another subscription. This is a good resolution to use if you plan to deploy many Hybrid Runbook Worker machines in the future.

* Manually configure the worker machine to run in an Orchestrator sandbox. Then run a runbook created in the Azure Automation account on the worker to test the functionality.

### <a name="vm-automatically-dropped"></a>Scenario: Microsoft Azure VMs automatically dropped from a hybrid worker group

#### Issue

You can't see the Hybrid Runbook Worker or VMs when the worker machine has been turned off for a long time.

#### Cause

The Hybrid Runbook Worker machine hasn't pinged Azure Automation for more than 30 days. As a result, Automation has purged the Hybrid Runbook Worker group or the System Worker group. 

#### Resolution

Start the worker machine, and then re-register it with Azure Automation. For instructions on how to install the runbook environment and connect to Azure Automation, see [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md).

### <a name="no-cert-found"></a>Scenario: No certificate was found in the certificate store on the Hybrid Runbook Worker

#### Issue

A runbook running on a Hybrid Runbook Worker fails with the following error message:

`Connect-AzAccount : No certificate was found in the certificate store with thumbprint 0000000000000000000000000000000000000000`  
`At line:3 char:1`  
`+ Connect-AzAccount -ServicePrincipal -Tenant $Conn.TenantID -Appl ...`  
`+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`  
`    + CategoryInfo          : CloseError: (:) [Connect-AzAccount],ArgumentException`  
`    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzAccountCommand`

#### Cause

This error occurs when you attempt to use a Run As account in a runbook that runs on a Hybrid Runbook Worker where the Run As account certificate isn't present. Hybrid Runbook Workers don't have the certificate asset locally by default. The Run As account requires this asset to operate properly.

#### Resolution

If your Hybrid Runbook Worker is an Azure VM, you can use [runbook authentication with managed identities](../automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead. This scenario simplifies authentication by allowing you to authenticate to Azure resources using the managed identity of the Azure VM instead of the Run As account. When the Hybrid Runbook Worker is an on-premises machine, you need to install the Run As account certificate on the machine. To learn how to install the certificate, see the steps to run the PowerShell runbook **Export-RunAsCertificateToHybridWorker** in [Run runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).

### <a name="error-403-on-registration"></a>Scenario: Error 403 during registration of a Hybrid Runbook Worker

#### Issue

The worker's initial registration phase fails, and you receive the following error (403):

`Forbidden: You don't have permission to access / on this server.`

#### Cause

The following issues are possible causes:

* There's a mistyped workspace ID or workspace key (primary) in the agent's settings. 
* The Hybrid Runbook Worker can't download the configuration, which causes an account linking error. When Azure enables features on machines, it supports only certain regions for linking a Log Analytics workspace and an Automation account. It's also possible that an incorrect date or time is set on the computer. If the time is +/- 15 minutes from the current time, feature deployment fails.
* Log Analytics Gateway is not configured to support Hybrid Runbook Worker.

#### Resolution

##### Mistyped workspace ID or key
To verify if the agent's workspace ID or workspace key was mistyped, see [Adding or removing a workspace - Windows agent](../../azure-monitor/agents/agent-manage.md#windows-agent) for the Windows agent or [Adding or removing a workspace - Linux agent](../../azure-monitor/agents/agent-manage.md#linux-agent) for the Linux agent. Make sure to select the full string from the Azure portal, and copy and paste it carefully.

##### Configuration not downloaded

Your Log Analytics workspace and Automation account must be in a linked region. This is the suggested solution for System Hybrid Runbook Worker used by Update Management. For a list of supported regions, see [Azure Automation and Log Analytics workspace mappings](../how-to/region-mappings.md).

You might also need to update the date or time zone of your computer. If you select a custom time range, make sure that the range is in UTC, which can differ from your local time zone.

##### Log Analytics gateway not configured

Follow the steps mentioned [here](../../azure-monitor/agents/gateway.md#configure-for-automation-hybrid-runbook-workers) to add Hybrid Runbook Worker endpoints to the Log Analytics Gateway.


### <a name="set-azstorageblobcontent-execution-fails"></a>Scenario: Set-AzStorageBlobContent fails on a Hybrid Runbook Worker 

#### Issue

Runbook fails when it tries to execute `Set-AzStorageBlobContent`, and you receive the following error message:

`Set-AzStorageBlobContent : Failed to open file xxxxxxxxxxxxxxxx: Illegal characters in path`

#### Cause

 This error is caused by the long file name behavior of calls to `[System.IO.Path]::GetFullPath()`, which adds UNC paths.

#### Resolution

As a workaround, you can create a configuration file named `OrchestratorSandbox.exe.config` with the following content:

```azurecli
<configuration>
  <runtime>
    <AppContextSwitchOverrides value="Switch.System.IO.UseLegacyPathHandling=false" />
  </runtime>
</configuration>
```

Place this file in the same folder as the executable file `OrchestratorSandbox.exe`. For example,

`%ProgramFiles%\Microsoft Monitoring Agent\Agent\AzureAutomation\7.3.702.0\HybridAgent`

>[!Note]
> If you upgrade the agent, this config file will be deleted, and will need to be recreated.

## Linux

The Linux Hybrid Runbook Worker depends on the [Log Analytics agent for Linux](../../azure-monitor/agents/log-analytics-agent.md) to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, here are some possible causes for the error.

### <a name="prompt-for-password"></a>Scenario: Linux Hybrid Runbook Worker receives prompt for a password when signing a runbook

#### Issue

Running the `sudo` command for a Linux Hybrid Runbook Worker retrieves an unexpected prompt for a password.

#### Cause

The **nxautomationuser** account for the Log Analytics agent for Linux isn't correctly configured in the **sudoers** file. The Hybrid Runbook Worker needs the appropriate configuration of account permissions and other data so that it can sign runbooks on the Linux Runbook Worker.

#### Resolution

* Ensure that the Hybrid Runbook Worker has the GnuPG (GPG) executable on the machine.

* Verify the configuration of the **nxautomationuser** account in the **sudoers** file. See [Running runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).

### <a name="oms-agent-not-running"></a>Scenario: Log Analytics agent for Linux isn't running

#### Issue

The Log Analytics agent for Linux isn't running.

#### Cause

If the agent isn't running, it prevents the Linux Hybrid Runbook Worker from communicating with Azure Automation. The agent might not be running for various reasons.

#### Resolution

 Verify the agent is running by entering the command `ps -ef | grep python`. You should see output similar to the following. The Python processes with the **nxautomation** user account. If the Azure Automation feature isn't enabled, none of the following processes are running.

```output
nxautom+   8567      1  0 14:45 ?        00:00:00 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/main.py /var/opt/microsoft/omsagent/state/automationworker/oms.conf rworkspace:<workspaceId> <Linux hybrid worker version>
nxautom+   8593      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/state/automationworker/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
nxautom+   8595      1  0 14:45 ?        00:00:02 python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/worker/hybridworker.py /var/opt/microsoft/omsagent/<workspaceId>/state/automationworker/diy/worker.conf managed rworkspace:<workspaceId> rversion:<Linux hybrid worker version>
```

The following list shows the processes that are started for a Linux Hybrid Runbook Worker. They're all located in the /var/opt/microsoft/omsagent/state/automationworker/ directory.

* **oms.conf**: The worker manager process. It's started directly from DSC.
* **worker.conf**: The Auto-Registered hybrid worker process. It's started by the worker manager. This process is used by Update Management and is transparent to the user. This process isn't present if Update Management isn't enabled on the machine.
* **diy/worker.conf**: The DIY hybrid worker process. The DIY hybrid worker process is used to execute user runbooks on the Hybrid Runbook Worker. It only differs from the Auto-registered hybrid worker process in the key detail that it uses a different configuration. This process isn't present if Azure Automation is disabled and the DIY Linux Hybrid Worker isn't registered.

If the agent isn't running, run the following command to start the service: `sudo /opt/microsoft/omsagent/bin/service_control restart`.

### <a name="class-does-not-exist"></a>Scenario: The specified class doesn't exist

If you see the error message `The specified class does not exist..` in **/var/opt/microsoft/omsconfig/omsconfig.log**, the Log Analytics agent for Linux needs to be updated. Run the following command to reinstall the agent.

```Bash
wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <WorkspaceID> -s <WorkspaceKey>
```

## Windows

The Windows Hybrid Runbook Worker depends on the [Log Analytics agent for Windows](../../azure-monitor/agents/log-analytics-agent.md) to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If registration of the worker fails, this section includes some possible reasons.

### <a name="mma-not-running"></a>Scenario: The Log Analytics agent for Windows isn't running

#### Issue

The `healthservice` isn't running on the Hybrid Runbook Worker machine.

#### Cause

If the Log Analytics for Windows service isn't running, the Hybrid Runbook Worker can't communicate with Azure Automation.

#### Resolution

Verify that the agent is running by entering the following command in PowerShell: `Get-Service healthservice`. If the service is stopped, enter the following command in PowerShell to start the service: `Start-Service healthservice`.

### <a name="event-4502"></a>Scenario: Event 4502 in the Operations Manager log

#### Issue

In the **Application and Services Logs\Operations Manager** event log, you see event 4502 and an event message that contains `Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent` with the following description:<br>`The certificate presented by the service \<wsid\>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Please contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication.`

#### Cause

This issue can be caused by your proxy or network firewall blocking communication to Microsoft Azure. Verify that the computer has outbound access to **\*.azure-automation.net** on port 443.

#### Resolution

Logs are stored locally on each hybrid worker at C:\ProgramData\Microsoft\System Center\Orchestrator\7.2\SMA\Sandboxes. You can verify if there are any warning or error events in the **Application and Services Logs\Microsoft-SMA\Operations** and **Application and Services Logs\Operations Manager** event logs. These logs indicate a connectivity or other type of issue that affects the enabling of the role to Azure Automation, or an issue encountered under normal operations. For more help troubleshooting issues with the Log Analytics agent, see [Troubleshoot issues with the Log Analytics Windows agent](../../azure-monitor/agents/agent-windows-troubleshoot.md).

Hybrid workers send [Runbook output and messages](../automation-runbook-output-and-messages.md) to Azure Automation in the same way that runbook jobs running in the cloud send output and messages. You can enable the Verbose and Progress streams just as you do for runbooks.

### Scenario: Orchestrator.Sandbox.exe can't connect to Microsoft 365 through proxy

#### Issue

A script running on a Windows Hybrid Runbook Worker can't connect as expected to Microsoft 365 on an Orchestrator sandbox. The script is using [Connect-MsolService](/powershell/module/msonline/connect-msolservice) for connection. 

If you adjust **Orchestrator.Sandbox.exe.config** to set the proxy and the bypass list, the sandbox still doesn't connect properly. A **Powershell_ise.exe.config** file with the same proxy and bypass list settings seems to work as you expect. Service Management Automation (SMA) logs and PowerShell logs don't provide any information about proxy.​

#### Cause

The connection to Active Directory Federation Services (AD FS) on the server can't bypass the proxy. Remember that a PowerShell sandbox runs as the logged user. However, an Orchestrator sandbox is heavily customized and might ignore the **Orchestrator.Sandbox.exe.config** file settings. It has special code for handling machine or Log Analytics agent proxy settings, but not for handling other custom proxy settings. 

#### Resolution

You can resolve the issue for the Orchestrator sandbox by migrating your script to use the Microsoft Entra modules instead of the MSOnline module for PowerShell cmdlets. For more information, see [Migrating from Orchestrator to Azure Automation (Beta)](../automation-orchestrator-migration.md).

​If you want to continue to use the MSOnline module cmdlets, change your script to use [Invoke-Command](/powershell/module/microsoft.powershell.core/invoke-command). Specify values for the `ComputerName` and `Credential` parameters. 

```powershell
$Credential = Get-AutomationPSCredential -Name MyProxyAccessibleCredential​
Invoke-Command -ComputerName $env:COMPUTERNAME -Credential $Credential 
{ Connect-MsolService … }​
```

This code change starts an entirely new PowerShell session under the context of the specified credentials. It should enable the traffic to flow through a proxy server that's authenticating the active user.

>[!NOTE]
>This resolution makes it unnecessary to manipulate the sandbox configuration file. Even if you succeed in making the configuration file work with your script, the file gets wiped out each time the Hybrid Runbook Worker agent is updated.​

### <a name="corrupt-cache"></a>Scenario: Hybrid Runbook Worker not reporting

#### Issue

Your Hybrid Runbook Worker machine is running, but you don't see heartbeat data for the machine in the workspace.

The following example query shows the machines in a workspace and their last heartbeat:

```kusto
Heartbeat
| summarize arg_max(TimeGenerated, *) by Computer
```

#### Cause

This issue can be caused by a corrupt cache on the Hybrid Runbook Worker.

#### Resolution

To resolve this issue, sign in to the Hybrid Runbook Worker and run the following script. This script stops the Log Analytics agent for Windows, removes its cache, and restarts the service. This action forces the Hybrid Runbook Worker to re-download its configuration from Azure Automation.

```powershell
Stop-Service -Name HealthService

Remove-Item -Path 'C:\Program Files\Microsoft Monitoring Agent\Agent\Health Service State' -Recurse

Start-Service -Name HealthService
```

### <a name="already-registered"></a>Scenario: You can't add a Windows Hybrid Runbook Worker

#### Issue

You receive the following message when you try to add a Hybrid Runbook Worker by using the `Add-HybridRunbookWorker` cmdlet:

`Machine is already registered`

#### Cause

This issue can be caused if the machine is already registered with a different Automation account or if you try to re-add the Hybrid Runbook Worker after removing it from a machine.

#### Resolution

To resolve this issue, remove the following registry key, restart `HealthService`, and try the `Add-HybridRunbookWorker` cmdlet again.

`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\HybridRunbookWorker`

### <a name="already-registered"></a>Scenario: You can't add a Linux Hybrid Runbook Worker

#### Issue

You receive the following message when you try to add a Hybrid Runbook Worker by using the `sudo python /opt/microsoft/omsconfig/.../onboarding.py --register` Python script:

`Unable to register, an existing worker was found. Please deregister any existing worker and try again.`

Additionally, attempting to deregister a Hybrid Runbook Worker by using the `sudo python /opt/microsoft/omsconfig/.../onboarding.py --deregister` Python script:

`Failed to deregister worker. [response_status=404]`

#### Cause

This issue might occur if the machine is already registered with a different Automation account, if the Azure Hybrid Worker Group was deleted, or if you try to re-add the Hybrid Runbook Worker after you remove it from a machine.

#### Resolution

To resolve this issue:

1. Remove the agent `sudo sh onboard_agent.sh --purge`.

1. Run these commands:

   ```bash
   sudo mv -f /home/nxautomation/state/worker.conf /home/nxautomation/state/worker.conf_old
   sudo mv -f /home/nxautomation/state/worker_diy.crt /home/nxautomation/state/worker_diy.crt_old
   sudo mv -f /home/nxautomation/state/worker_diy.key /home/nxautomation/state/worker_diy.key_old
   ```

1. Re-onboard the agent `sudo sh onboard_agent.sh -w <workspace id> -s <workspace key> -d opinsights.azure.com`.

1. Wait for the folder `/opt/microsoft/omsconfig/modules/nxOMSAutomationWorker` to populate.

1. Try the `sudo python /opt/microsoft/omsconfig/.../onboarding.py --register` Python script again.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
