---
title: Troubleshoot Windows update agent issues in Azure Automation
description: This article tells how to troubleshoot and resolve issues with the Windows update agent during Update Management.
services: automation
ms.date: 01/25/2020
ms.topic: troubleshooting
ms.subservice: update-management
---

# Troubleshoot Windows update agent issues

There can be many reasons why your machine isn't showing up as ready (healthy) during an Update Management deployment. You can check the health of a Windows Hybrid Runbook Worker agent to determine the underlying problem. The following are the three readiness states for a machine:

* Ready: The Hybrid Runbook Worker is deployed and was last seen less than one hour ago.
* Disconnected: The Hybrid Runbook Worker is deployed and was last seen over one hour ago.
* Not configured: The Hybrid Runbook Worker isn't found or hasn't finished the deployment.

> [!NOTE]
> There can be a slight delay between what the Azure portal shows and the current state of a machine.

This article discusses how to run the troubleshooter for Azure machines from the Azure portal, and non-Azure machines in the [offline scenario](#troubleshoot-offline).

> [!NOTE]
> The troubleshooter script now includes checks for Windows Server Update Services (WSUS) and for the autodownload and install keys.

## Start the troubleshooter

For Azure machines, you can launch the Troubleshoot Update Agent page by selecting the **Troubleshoot** link under the **Update Agent Readiness** column in the portal. For non-Azure machines, the link brings you to this article. See [Troubleshoot offline](#troubleshoot-offline) to troubleshoot a non-Azure machine.

![Screenshot of the Update Management list of virtual machines](../media/update-agent-issues/vm-list.png)

> [!NOTE]
> To check the health of the Hybrid Runbook Worker, the VM must be running. If the VM isn't running, a **Start the VM** button appears.

On the Troubleshoot Update Agent page, select **Run checks** to start the troubleshooter. The troubleshooter uses [Run Command](../../virtual-machines/windows/run-command.md) to run a script on the machine, to verify dependencies. When the troubleshooter is finished, it returns the result of the checks.

![Screenshot of the Troubleshoot Update Agent page](../media/update-agent-issues/troubleshoot-page.png)

Results are shown on the page when they're ready. The checks sections show what's included in each check.

:::image type="content" source="../media/update-agent-issues/actionable-tasks-windows.png" alt-text="Screenshot of Windows Troubleshooter.":::

## Prerequisite checks

### Operating system

The operating system check verifies whether the Hybrid Runbook Worker is running [one of the supported operating systems](../update-management/operating-system-requirements.md#windows). 


### .NET 4.6.2

The .NET Framework check verifies that the system has [.NET Framework 4.6.2](https://dotnet.microsoft.com/download/dotnet-framework/net462) or later installed.

To fix, install .NET Framework 4.6 or later. </br> Download the [.NET Framework](https://www.docs.microsoft.com/dotnet/framework/install/guide-for-developers).

### WMF 5.1

The WMF check verifies that the system has the required version of the Windows Management Framework (WMF). 

To fix, you need to download and install [Windows Management Framework 5.1](https://www.microsoft.com/download/details.aspx?id=54616) as it requires Windows PowerShell 5.1 for Azure Update Management to work.

### TLS 1.2

This check determines whether you're using TLS 1.2 to encrypt your communications. TLS 1.0 is no longer supported by the platform. Use TLS 1.2 to communicate with Update Management.

To fix, follow the steps to [Enable TLS 1.2](../agents/agent-windows?tabs=setup-wizard.md#configure-agent-to-use-tls-12).

## Monitoring agent service health checks

### Monitoring Agent
To fix the issue, start **HealthService** service 

`Start-Service -Name *HealthService* -ErrorAction SilentlyContinue`

### Hybrid Runbook Worker
To fix the issue, do a force re-registration of Hybrid Runbook Worker.

`Remove-Item -Path "HKLM:\software\microsoft\hybridrunbookworker" -Recurse -Force *Restart-service healthservice`</br> 

>[!NOTE]
> This will remove the user Hybrid worker from the machine. Ensure to check and re-register it afterwards. There is no action needed if the machine has only the System Hybrid Runbook worker. 

To validate, check event id *15003 (HW start event) OR 15004 (hw stopped event) EXISTS in Microsoft-SMA/Operational event logs.* 

Raise a support ticket if the issue is not fixed still.

### Monitoring Agent Service

Check the event id 4502 (error event) in **Operations Manager** event logs and check the description.

To troubleshoot, run the [MMA Agent Troubleshooter](../azure-monitor/agents/agent-windows-troubleshoot.md).


### VMs linked workspace
See [Network requirements](./azure-monitor/agents/agent-windows-troubleshoot.md#connectivity-issues).

To validate: Check VMs connected workspace or Heartbeat table of corresponding log analytics.

`Heartbeat | where Computer =~ ""`

### Windows update service status

 To fix this issue, start **wuaserv** service.

`Start-Service -Name wuauserv -ErrorAction SilentlyContinue`

## Connectivity checks

The troubleshooter currently doesn't route traffic through a proxy server if one is configured.

### Registration endpoint

This check determines whether the agent can properly communicate with the agent service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the registration endpoint. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

Allow the [prerequisite URLs](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory). 
After the network changes, you can either rerun the Troubleshooter or run the below commands to validate: 

```
$workspaceId =- ""  
$endpoint = $workspaceId + “.agentsvc.azure-automation.net”  
(Test-NetConnection -ComputerName $endpoint -Port 443 -WarningAction SilentlyContinue).TcpTestSucceeded 
```

### Operations endpoint

This check determines whether the agent can properly communicate with the Job Runtime Data Service.

Proxy and firewall configurations must allow the Hybrid Runbook Worker agent to communicate with the Job Runtime Data Service. For a list of addresses and ports to open, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

Allow the [prerequisite URLs](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory). After the network changes, you can either rerun the Troubleshooter or run the below commands to validate: 
 
```
$jrdsEndpointLocationMoniker = “” 

# $jrdsEndpointLocationMoniker should be based on automation account location (jpe/ase/scus) etc.  

$endpoint = $jrdsEndpointLocationMoniker + “-jobruntimedata-prod-su1.azure-automation.net” 

(Test-NetConnection -ComputerName $endpoint -Port 443 -WarningAction SilentlyContinue).TcpTestSucceeded  
```

### Https connection
Simplifies the ongoing management of your network security rules. Allow the [prerequisite URLs](../automation-network-configuration.md#update-management-and-change-tracking-and-inventory).

After the network changes, you can either rerun the Troubleshooter or run the below commands to validate:

`$uri = "https://eus2-jobruntimedata-prod-su1.azure-automation.net"`
`*Invoke-WebRequest -URI $uri -UseBasicParsing `


### Proxy settings

If the proxy is enabled, ensure that you have access to the [prerequisite URLs](../automation-network-configuration#update-management-and-change-tracking-and-inventory). 

To check if the proxy is set correctly, use the below commands: 

`netsh winhttp show proxy` 

or check the registry key **ProxyEnable** is set to 1 in 

`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings` 


### IMDS endpoint connectivity

To fix the issue, allow access to IP **169.254.169.254** </br> For more information see, [access Azure instance metadata service](../virtual-machines/windows/instance-metadata-service.md#access-azure-instance-metadata-service). 

After the network changes, you can either rerun the Troubleshooter or run the below commands to validate: 

`Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -Uri http://169.254.169.254/metadata/instance?api-version=2018-02-01`

## VM service health checks

### Monitoring agent service status

This check determines if the Log Analytics agent for Windows (`healthservice`) is running on the machine. To learn more about troubleshooting the service, see [The Log Analytics agent for Windows isn't running](hybrid-runbook-worker.md#mma-not-running).

To reinstall the Log Analytics agent for Windows, see [Install the agent for Windows](../../azure-monitor/agents/agent-windows.md).

### Monitoring agent service events

This check determines whether any 4502 events appear in the Azure Operations Manager log on the machine in the past 24 hours.

To learn more about this event, see the [Event 4502 in the Operations Manager log](hybrid-runbook-worker.md#event-4502) for this event.

## Access permissions checks



### Crypto folder access

The Crypto folder access check determines whether the local system account has access to C:\ProgramData\Microsoft\Crypto\RSA.

## <a name="troubleshoot-offline"></a>Troubleshoot offline

You can use the troubleshooter on a Hybrid Runbook Worker offline by running the script locally. Get the following script from GitHub: [UM_Windows_Troubleshooter_Offline.ps1](https://github.com/Azure/updatemanagement/blob/main/UM_Windows_Troubleshooter_Offline.ps1). To run the script, you must have WMF 4.0 or later installed. To download the latest version of PowerShell, see [Installing various versions of PowerShell](/powershell/scripting/install/installing-powershell).

The output of this script looks like the following example:

```output
RuleId                      : OperatingSystemCheck
RuleGroupId                 : prerequisites
RuleName                    : Operating System
RuleGroupName               : Prerequisite Checks
RuleDescription             : The Windows Operating system must be version 6.2.9200 (Windows Server 2012) or higher
CheckResult                 : Passed
CheckResultMessage          : Operating System version is supported
CheckResultMessageId        : OperatingSystemCheck.Passed
CheckResultMessageArguments : {}

RuleId                      : DotNetFrameworkInstalledCheck
RuleGroupId                 : prerequisites
RuleName                    : .NET Framework 4.5+
RuleGroupName               : Prerequisite Checks
RuleDescription             : .NET Framework version 4.5 or higher is required
CheckResult                 : Passed
CheckResultMessage          : .NET Framework version 4.5+ is found
CheckResultMessageId        : DotNetFrameworkInstalledCheck.Passed
CheckResultMessageArguments : {}

RuleId                      : WindowsManagementFrameworkInstalledCheck
RuleGroupId                 : prerequisites
RuleName                    : WMF 5.1
RuleGroupName               : Prerequisite Checks
RuleDescription             : Windows Management Framework version 4.0 or higher is required (version 5.1 or higher is preferable)
CheckResult                 : Passed
CheckResultMessage          : Detected Windows Management Framework version: 5.1.17763.1
CheckResultMessageId        : WindowsManagementFrameworkInstalledCheck.Passed
CheckResultMessageArguments : {5.1.17763.1}

RuleId                      : AutomationAgentServiceConnectivityCheck1
RuleGroupId                 : connectivity
RuleName                    : Registration endpoint
RuleGroupName               : connectivity
RuleDescription             :
CheckResult                 : Failed
CheckResultMessage          : Unable to find Workspace registration information in registry
CheckResultMessageId        : AutomationAgentServiceConnectivityCheck1.Failed.NoRegistrationFound
CheckResultMessageArguments : {}

RuleId                      : AutomationJobRuntimeDataServiceConnectivityCheck
RuleGroupId                 : connectivity
RuleName                    : Operations endpoint
RuleGroupName               : connectivity
RuleDescription             : Proxy and firewall configuration must allow Automation Hybrid Worker agent to communicate with eus2-jobruntimedata-prod-su1.azure-automation.net
CheckResult                 : Passed
CheckResultMessage          : TCP Test for eus2-jobruntimedata-prod-su1.azure-automation.net (port 443) succeeded
CheckResultMessageId        : AutomationJobRuntimeDataServiceConnectivityCheck.Passed
CheckResultMessageArguments : {eus2-jobruntimedata-prod-su1.azure-automation.net}

RuleId                      : MonitoringAgentServiceRunningCheck
RuleGroupId                 : servicehealth
RuleName                    : Monitoring Agent service status
RuleGroupName               : VM Service Health Checks
RuleDescription             : HealthService must be running on the machine
CheckResult                 : Failed
CheckResultMessage          : Log Analytics for Windows service (HealthService) is not running
CheckResultMessageId        : MonitoringAgentServiceRunningCheck.Failed
CheckResultMessageArguments : {Log Analytics agent for Windows, HealthService}

RuleId                      : MonitoringAgentServiceEventsCheck
RuleGroupId                 : servicehealth
RuleName                    : Monitoring Agent service events
RuleGroupName               : VM Service Health Checks
RuleDescription             : Event Log must not have event 4502 logged in the past 24 hours
CheckResult                 : Failed
CheckResultMessage          : Log Analytics agent for Windows service Event Log (Operations Manager) does not exist on the machine
CheckResultMessageId        : MonitoringAgentServiceEventsCheck.Failed.NoLog
CheckResultMessageArguments : {Log Analytics agent for Windows, Operations Manager, 4502}

RuleId                      : CryptoRsaMachineKeysFolderAccessCheck
RuleGroupId                 : permissions
RuleName                    : Crypto RSA MachineKeys Folder Access
RuleGroupName               : Access Permission Checks
RuleDescription             : SYSTEM account must have WRITE and MODIFY access to 'C:\\ProgramData\\Microsoft\\Crypto\\RSA\\MachineKeys'
CheckResult                 : Passed
CheckResultMessage          : Have permissions to access C:\\ProgramData\\Microsoft\\Crypto\\RSA\\MachineKeys
CheckResultMessageId        : CryptoRsaMachineKeysFolderAccessCheck.Passed
CheckResultMessageArguments : {C:\\ProgramData\\Microsoft\\Crypto\\RSA\\MachineKeys}

RuleId                      : TlsVersionCheck
RuleGroupId                 : prerequisites
RuleName                    : TLS 1.2
RuleGroupName               : Prerequisite Checks
RuleDescription             : Client and Server connections must support TLS 1.2
CheckResult                 : Passed
CheckResultMessage          : TLS 1.2 is enabled by default on the Operating System.
CheckResultMessageId        : TlsVersionCheck.Passed.EnabledByDefault
CheckResultMessageArguments : {}
```

## Next steps

[Troubleshoot Hybrid Runbook Worker issues](hybrid-runbook-worker.md).
