---
title: Update Management solution in Azure
description: This article is intended to help you understand how to use this solution to manage updates for your Windows and Linux computers.
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 04/05/2018
ms.topic: article
manager: carmonm
---
# Update Management solution in Azure

The Update Management solution in Azure automation allows you to manage operating system security updates for your Windows and Linux computers deployed in Azure, on-premises environments, or other cloud providers. You can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for servers.

You can enable Update management for virtual machines directly from your [Azure Automation](automation-offering-get-started.md) account.
To learn how to enable update management for virtual machines from your Automation account, see
[Manage updates for multiple virtual machines](manage-update-multi.md).

## Solution overview

Computers managed by update management use the following configurations for performing assessment and update deployments:

* Microsoft Monitoring agent for Windows or Linux
* PowerShell Desired State Configuration (DSC) for Linux
* Automation Hybrid Runbook Worker
* Microsoft Update or Windows Server Update Services for Windows computers

The following diagram shows a conceptual view of the behavior and data flow with how the solution assesses and applies security updates to all connected Windows Server and Linux computers in a workspace.

![Update management process flow](media/automation-update-management/update-mgmt-updateworkflow.png)

After a computer performs a scan for update compliance, the agent forwards the information in bulk to Log Analytics. On a Window computer, the compliance scan is performed every 12 hours by default. In addition to the scan schedule, the scan for update compliance is initiated within 15 minutes if the Microsoft Monitoring Agent (MMA) is restarted, prior to update installation, and after update installation. With a Linux computer, the compliance scan is performed every 3 hours by default, and a compliance scan is initiated within 15 minutes if the MMA agent is restarted.

The solution reports how up-to-date the computer is based on what source you are configured to synchronize with. If the Windows computer is configured to report to WSUS, depending on when WSUS last synchronized with Microsoft Update, the results may differ from what Microsoft Updates shows. This is the same for Linux computers that are configured to report to a local repo versus a public repo.

You can deploy and install software updates on computers that require the updates by creating a scheduled deployment. Updates classified as *Optional* are not included in the deployment scope for Windows computers, only required updates. The scheduled deployment defines what target computers receive the applicable updates, either by explicitly specifying computers or selecting a [computer group](../log-analytics/log-analytics-computer-groups.md) that is based off of log searches of a particular set of computers. You also specify a schedule to approve and designate a period of time when updates are allowed to be installed within. Updates are installed by runbooks in Azure Automation. You cannot view these runbooks, and they don’t require any configuration. When an Update Deployment is created, it creates a schedule that starts a master update runbook at the specified time for the included computers. This master runbook starts a child runbook on each agent that performs installation of required updates.

At the date and time specified in the update deployment, the target computers executes the deployment in parallel. A scan is first performed to verify the updates are still required and installs them. For WSUS client computers, if the updates are not approved in WSUS, the update deployment fails.

## Clients

### Supported client types

The following table shows a list of supported operating systems:

|Operating System  |Notes  |
|---------|---------|
|Windows Server 2008, Windows Server 2008 R2 RTM    | Only supports update assessments         |
|Windows Server 2008 R2 SP1 and higher     |Windows PowerShell 4.0 or higher is required ([Download WMF 4.0](https://www.microsoft.com/download/details.aspx?id=40855)).</br> Windows PowerShell 5.1 ([Download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616)) is recommended for increased reliability.         |
|CentOS 6 (x86/x64), and 7 (x64)      | Linux agents must have access to an update repository.        |
|Red Hat Enterprise 6 (x86/x64), and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 12.04 LTS and newer x86/x64       |Linux agents must have access to an update repository.         |

### Unsupported client types

The following table lists the operating systems that are not supported:

|Operating System  |Notes  |
|---------|---------|
|Windows client     | Client operating systems (Windows 7, Windows 10, etc.) are not supported.        |
|Windows Server 2016 Nano Server     | Not supported       |

### Client requirements

#### Windows

Windows agents must be configured to communicate with a Windows Server Update Services (WSUS) server or have access to Microsoft Update. Update Management can be used with System Center Configuration Manager, to learn more about the integration scenarios visit [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md#configuration). The [Windows agent](../log-analytics/log-analytics-agent-windows.md) is required. This agent is installed automatically if you are onboarding an Azure VM.

#### Linux

For Linux, the machine must have access to an update repository, which can be private or public. An OMS Agent for Linux configured to report to multiple Log Analytics workspaces is not supported with this solution.

For more information on how to install the OMS Agent for Linux and download the latest version, see [Operations Management Suite Agent for Linux](https://github.com/microsoft/oms-agent-for-linux). For information on how to install the OMS Agent for Windows, review [Operations Management Suite Agent for Windows](../log-analytics/log-analytics-windows-agent.md).

## Permissions

In order to create and manage update deployments, you need specific permissions. To learn more about these permissions visit [Role Based Access - Update management](automation-role-based-access-control.md#update-management)

## Solution components

This solution consists of the following resources that are added to your Automation account and directly connected agents or Operations Manager connected management group.

### Hybrid Worker groups

After you enable this solution, any Windows computer directly connected to your Log Analytics workspace is automatically configured as a Hybrid Runbook Worker to support the runbooks included in this solution. For each Windows computer managed by the solution, it is listed under the Hybrid worker groups page as a System hybrid worker group for the Automation account following the naming convention *Hostname FQDN_GUID*. You cannot target these groups with runbooks in your account, otherwise they fail. These groups are only intended to support the management solution.

You can however, add the Windows computers to a Hybrid Runbook Worker group in your Automation account to support Automation runbooks as long as you are using the same account for both the solution and Hybrid Runbook Worker group membership. This functionality has been added to version 7.2.12024.0 of the Hybrid Runbook Worker.

### Management packs

If your System Center Operations Manager management group is connected to a Log Analytics workspace, the following management packs are installed in Operations Manager. These management packs are also installed on directly connected Windows computers after adding this solution. There is nothing to configure or manage with these management packs.

* Microsoft System Center Advisor Update Assessment Intelligence Pack (Microsoft.IntelligencePacks.UpdateAssessment)
* Microsoft.IntelligencePack.UpdateAssessment.Configuration (Microsoft.IntelligencePack.UpdateAssessment.Configuration)
* Update Deployment MP

For more information on how solution management packs are updated, see [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md).

### Confirm non-Azure machines are onboarded

To confirm directly connected machines are communicating with Log Analytics, after a few minutes you can run the following log search:

#### Linux

```
Heartbeat
| where OSType == "Linux" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table
```

#### Windows

```
Heartbeat
| where OSType == "Windows" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table`
```

On a Windows computer, you can review the following to verify agent connectivity with Log Analytics:

1. Open Microsoft Monitoring Agent in Control Panel, and on the **Azure Log Analytics** tab, the agent displays a message stating: **The Microsoft Monitoring Agent has successfully connected to Log Analytics**.
2. Open the Windows Event Log, navigate to **Application and Services Logs\Operations Manager** and search for Event ID 3000 and 5002 from source Service Connector. These events indicate the computer has registered with the Log Analytics workspace and is receiving configuration.

If the agent is not able to communicate with Log Analytics and it is configured to communicate with the internet through a firewall or proxy server, confirm the firewall or proxy server is properly configured by reviewing [Network configuration for Windows agent](../log-analytics/log-analytics-agent-windows.md) or [Network configuration for Linux agent](../log-analytics/log-analytics-agent-linux.md).

> [!NOTE]
> If your Linux systems are configured to communicate with a proxy or OMS Gateway and you are onboarding this solution, update the *proxy.conf* permissions to grant the omiuser group read permission on the file by performing the following commands:
> `sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf`
> `sudo chmod 644 /etc/opt/microsoft/omsagent/proxy.conf`

Newly added Linux agents will show a status of **Updated** after an assessment has been performed. This process can take up to 6 hours.

To confirm an Operations Manager management group is communicating with Log Analytics, see [Validate Operations Manager Integration with Log Analytics](../log-analytics/log-analytics-om-agents.md#validate-operations-manager-integration-with-oms).

## Data collection

### Supported agents

The following table describes the connected sources that are supported by this solution.

| Connected Source | Supported | Description |
| --- | --- | --- |
| Windows agents |Yes |The solution collects information about system updates from Windows agents and initiates installation of required updates. |
| Linux agents |Yes |The solution collects information about system updates from Linux agents and initiates installation of required updates on supported distros. |
| Operations Manager management group |Yes |The solution collects information about system updates from agents in a connected management group.</br>A direct connection from the Operations Manager agent to Log Analytics is not required. Data is forwarded from the management group to the Log Analytics workspace. |

### Collection frequency

For each managed Windows computer, a scan is performed twice per day. Every 15 minutes the Windows API is called to query for the last update time to determine if status has changed, and if so a compliance scan is initiated. For each managed Linux computer, a scan is performed every 3 hours.

It can take anywhere from 30 minutes up to 6 hours for the dashboard to display updated data from managed computers.

## Viewing update assessments

Click on the **Update Management** on your automation account to view the status of your machines.

This view provides information on your machines, missing updates, update deployments, and scheduled update deployments.

You can run a log search that returns information on the machine, update, or deployment by selecting the item in the list. This opens the **Log Search** page with a query for the item selected.

## Installing updates

Once updates have been assessed for all of the Linux and Windows computers in your workspace, you can have required updates installed by creating an *Update Deployment*. An Update Deployment is a scheduled installation of required updates for one or more computers. You specify the date and time for the deployment in addition to a computer or group of computers that should be included in the scope of a deployment. To learn more about computer groups, see [Computer groups in Log Analytics](../log-analytics/log-analytics-computer-groups.md). When you include computer groups in your update deployment, group membership is evaluated only once at the time of schedule creation. Subsequent changes to a group are not reflected. To work around this, delete the scheduled update deployment and recreate it.

> [!NOTE]
> Windows VMs deployed from the Azure Marketplace by default are set to receive automatic updates from Windows Update Service. This behavior does not change after adding this solution or Windows VMs to your workspace. If you do not actively manage updates with this solution, the default behavior (automatically apply updates) applies.

To avoid updates being applied outside of a maintenance window on Ubuntu, reconfigure  Unattended-Upgrade package to disable automatic updates. For information on how to configure this, see [Automatic Updates topic in the Ubuntu Server Guide](https://help.ubuntu.com/lts/serverguide/automatic-updates.html).

For virtual machines created from the on-demand Red Hat Enterprise Linux (RHEL) images available in Azure Marketplace, they are registered to access the [Red Hat Update Infrastructure (RHUI)](../virtual-machines/virtual-machines-linux-update-infrastructure-redhat.md) deployed in Azure. Any other Linux distribution must be updated from the distros online file repository following their supported methods.

## Viewing missing updates

Click **Missing updates** to view the list of updates that are missing from your machines. Each update is listed and displays information with regard to the number of machines that require the update, the operating system, and the link for more information. Each update can be selected and the **Log search** page displays and shows more details about the updates.

## Viewing update deployments

Click the **Update Deployments** tab to view the list of existing Update Deployments. Clicking on any of the update deployments in the table opens up the **Update Deployment Run** page for that update deployment.

![Overview of Update Deployment Results](./media/automation-update-management/update-deployment-run.png)

## Creating an Update Deployment

Create a new Update Deployment by clicking the **Schedule update deployment** button at the top of the screen to open the **New Update Deployment** page. You must provide values for the properties in the following table:

| Property | Description |
| --- | --- |
| Name |Unique name to identify the update deployment. |
|Operating System| Linux or Windows|
| Machines to update |Select a Saved search or pick Machine from the drop-down and select individual machines |
|Update classifications|Select all the update classifications that you need|
|Updates to exclude|Enter all the KBs to exclude without the 'KB' prefix|
|Schedule settings|Select the time to start, and select either Once or recurring for the recurrence|
| Maintenance window |Number of minutes set for updates. The value can be not be less than 30 minutes and no more than 6 hours |

## Search logs

In addition to the details that are provided in the portal, searches can be done against the logs. With the **Change Tracking** page open, click **Log Analytics**, this opens the **Log Search** page

### Sample queries

The following table provides sample log searches for update records collected by this solution:

| Query | Description |
| --- | --- |
|Update</br>&#124; where UpdateState == "Needed" and Optional == false</br>&#124; project Computer, Title, KBID, Classification, PublishedDate |All computers with missing updates</br>Add one of the following to limit the OS:</br>OSType = "Windows"</br>OSType == "Linux" |
| Update</br>&#124; where UpdateState == "Needed" and Optional == false</br>&#124; where Computer == "ContosoVM1.contoso.com"</br>&#124; project Computer, Title, KBID, Product, PublishedDate |Missing updates for a specific computer (replace value with your own computer name)|
| Event</br>&#124; where EventLevelName == "error" and Computer in ((Update &#124; where (Classification == "Security Updates" or Classification == "Critical Updates")</br>&#124; where UpdateState == "Needed" and Optional == false </br>&#124; distinct Computer)) |Error events for machines that have missing critical or security required updates |
| Update</br>&#124; where UpdateState == "Needed" and Optional == false</br>&#124; distinct Title |Distinct missing updates across all computers |
| UpdateRunProgress</br>&#124; where InstallationStatus == "failed" </br>&#124; summarize AggregatedValue = count() by Computer, Title, UpdateRunName |Computers with updates that failed in an update run</br>Add one of the following to limit the OS:</br>OSType = "Windows"</br>OSType == "Linux" |
| Update</br>&#124; where OSType == "Linux"</br>&#124; where UpdateState != "Not needed" and (Classification == "Critical Updates" or Classification == "Security Updates")</br>&#124; summarize AggregatedValue = count() by Computer |List of all the Linux machines, which have a package update available, which addresses Critical or Security vulnerability |
| UpdateRunProgress</br>&#124; where UpdateRunName == "DeploymentName"</br>&#124; summarize AggregatedValue = count() by Computer|Computers that were updated in this update run (replace value with your Update Deployment name |

## Integrate with System Center Configuration Manager

Customers who have invested in System Center Configuration Manager to manage PCs, servers, and mobile devices also rely on its strength and maturity in managing software updates as part of their software update management (SUM) cycle.

To learn how to integrate the management solution with System Center Configuration Manager, see [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md).

## Patching Linux machines

The following sections explain potential issues with Linux patching.

### Package exclusion

On some Linux variants, such as Red Hat Enterprise Linux, OS-level upgrades can occur via packages. This can lead to Update Management runs where the OS version number changes. Since Update Management uses the same methods to update packages as an administrator would locally on the Linux computer, this behavior is intentional.

To avoid updating the OS version via Update Management runs, you use the **Exclusion** feature.

In Red Hat Enterprise Linux, the package name to exclude would be:
redhat-release-server.x86_64

![Packages to exclude for Linux](./media/automation-update-management/linuxpatches.png)

### Security patches not being applied

When deploying updates to a Linux machine, you can select update classifications. This filters the updates that are applied to those that meet the specified criteria. This filter is applied locally on the machine when the update is deployed. Because Update Management performs update enrichment in the cloud, some updates may be flagged in Update Management as having security impact although the local machine does not have that information. As a result, if you apply critical updates to a Linux machine, there may be updates, which are not marked as having security impact on that machine, and do not get applied. However, Update Management may still report that machine as being non-compliant because it has additional information about the relevant update.

Deploying updates by update classification may not work on openSUSE Linux due to the different patching model used.

## Troubleshooting

This section provides information to help troubleshoot issues with the Update Management solution.

If you encounter issues while attempting to onboard the solution or a virtual machine, check the **Application and Services Logs\Operations Manager** event log for events with  event ID 4502 and event message containing **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent**. The following table highlights specific error messages and a possible resolution for each.

| Message | Reason | Solution |
|----------|----------|----------|
| Unable to Register Machine for Patch Management,</br>Registration Failed with Exception</br>System.InvalidOperationException: {"Message":"Machine is already</br>registered to a different account. "} | Machine is already onboarded to another workspace for Update Management | Perform cleanup of old artifacts by [deleting the hybrid runbook group](automation-hybrid-runbook-worker.md#remove-hybrid-worker-groups)|
| Unable to Register Machine for Patch Management, Registration Failed with Exception</br>System.Net.Http.HttpRequestException: An error occurred while sending the request. ---></br>System.Net.WebException: The underlying connection</br>was closed: An unexpected error</br>occurred on a receive. ---> System.ComponentModel.Win32Exception:</br>The client and server cannot communicate,</br>because they do not possess a common algorithm | Proxy/Gateway/Firewall blocking communication | [Review network requirements](automation-offering-get-started.md#network-planning)|
| Unable to Register Machine for Patch Management,</br>Registration Failed with Exception</br>Newtonsoft.Json.JsonReaderException: Error parsing positive infinity value. | Proxy/Gateway/Firewall blocking communication | [Review network requirements](automation-offering-get-started.md#network-planning)|
| The certificate presented by the service \<wsid\>.oms.opinsights.azure.com</br>was not issued by a certificate authority</br>used for Microsoft services. Contact</br>your network administrator to see if they are running a proxy that intercepts</br>TLS/SSL communication. |Proxy/Gateway/Firewall blocking communication | [Review network requirements](automation-offering-get-started.md#network-planning)|
| Unable to Register Machine for Patch Management,</br>Registration Failed with Exception</br>AgentService.HybridRegistration.</br>PowerShell.Certificates.CertificateCreationException:</br>Failed to create a self-signed certificate. ---></br>System.UnauthorizedAccessException: Access is denied. | Self-signed cert generation failure | Verify system account has</br>read access to folder:</br>**C:\ProgramData\Microsoft\**</br>**Crypto\RSA**|

## Next steps

Continue to the tutorial to learn how to manage updates for your Windows VMs.

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-troubleshoot-changes.md)

* Use Log Searches in [Log Analytics](../log-analytics/log-analytics-log-searches.md) to view detailed update data.
* [Create alerts](../log-analytics/log-analytics-alerts.md) when critical updates are detected as missing from computers or a computer has automatic updates disabled.
