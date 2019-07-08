---
title: Update Management solution in Azure
description: This article is intended to help you understand how to use the Azure Update Management solution to manage updates for your Windows and Linux computers.
services: automation
ms.service: automation
ms.subservice: update-management
author: bobbytreed
ms.author: robreed
ms.date: 05/22/2019
ms.topic: conceptual
manager: carmonm
---
# Update Management solution in Azure

You can use the Update Management solution in Azure Automation to manage operating system updates for your Windows and Linux computers in Azure, in on-premises environments, or in other cloud providers. You can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for servers.

You can enable Update Management for virtual machines directly from your Azure Automation account. To learn how to enable Update Management for virtual machines from your Automation account, see [Manage updates for multiple virtual machines](manage-update-multi.md). You can also enable Update Management for a virtual machine from the virtual machine page in the Azure portal. This scenario is available for [Linux](../virtual-machines/linux/tutorial-monitoring.md#enable-update-management) and [Windows](../virtual-machines/windows/tutorial-monitoring.md#enable-update-management) virtual machines.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Solution overview

Computers that are managed by Update Management use the following configurations to perform assessment and update deployments:

* Microsoft Monitoring Agent (MMA) for Windows or Linux
* PowerShell Desired State Configuration (DSC) for Linux
* Automation Hybrid Runbook Worker
* Microsoft Update or Windows Server Update Services (WSUS) for Windows computers

The following diagram shows a conceptual view of the behavior and data flow with how the solution assesses and applies security updates to all connected Windows Server and Linux computers in a workspace:

![Update Management process flow](./media/automation-update-management/update-mgmt-updateworkflow.png)

Update Management can be used to natively onboard machines in multiple subscriptions in the same tenant.

Once a package is released, it takes 2-3 hours for the patch to show up for Linux machines for assessment. For Windows machines, it takes 12-15 hours for the patch to show up for assessment after it has been released.

After a computer completes a scan for update compliance, the agent forwards the information in bulk to Azure Monitor logs. On a Windows computer, the compliance scan is run every 12 hours by default.

In addition to the scan schedule, the scan for update compliance is initiated within 15 minutes of the MMA being restarted, before update installation, and after update installation.

For a Linux computer, the compliance scan is performed every hour by default. If the MMA agent is restarted, a compliance scan is initiated within 15 minutes.

The solution reports how up-to-date the computer is based on what source you're configured to sync with. If the Windows computer is configured to report to WSUS, depending on when WSUS last synced with Microsoft Update, the results might differ from what Microsoft Updates shows. This behavior is the same for Linux computers that are configured to report to a local repo instead of to a public repo.

> [!NOTE]
> To properly report to the service, Update Management requires certain URLs and ports to be enabled. To learn more about these requirements, see [Network planning for Hybrid Workers](automation-hybrid-runbook-worker.md#network-planning).

You can deploy and install software updates on computers that require the updates by creating a scheduled deployment. Updates classified as *Optional* aren't included in the deployment scope for Windows computers. Only required updates are included in the deployment scope.

The scheduled deployment defines what target computers receive the applicable updates, either by explicitly specifying computers or by selecting a [computer group](../azure-monitor/platform/computer-groups.md) that's based on log searches of a specific set of computers, or an [Azure query](#azure-machines) that dynamically selects Azure VMs based on specified criteria. These groups are different from [Scope Configuration](../azure-monitor/insights/solution-targeting.md), which is only used to determine what machines get the management packs that enable the solution. 

You also specify a schedule to approve and set a period of time during which updates can be installed. This period of time is called the maintenance window. Ten minutes of the maintenance window is reserved for reboots if a reboot is needed and you selected the appropriate reboot option. If patching takes longer than expected and there is less than ten minutes in the maintenance window, a reboot will not occur.

Updates are installed by runbooks in Azure Automation. You can't view these runbooks, and the runbooks don’t require any configuration. When an update deployment is created, the update deployment creates a schedule that starts a master update runbook at the specified time for the included computers. The master runbook starts a child runbook on each agent to install the required updates.

At the date and time specified in the update deployment, the target computers execute the deployment in parallel. Before installation, a scan is run to verify that the updates are still required. For WSUS client computers, if the updates aren't approved in WSUS, the update deployment fails.

Having a machine registered for Update Management in more than one Log Analytics workspaces (multi-homing) isn't supported.

## Clients

### Supported client types

The following table shows a list of supported operating systems:

|Operating system  |Notes  |
|---------|---------|
|Windows Server 2008, Windows Server 2008 R2 RTM    | Supports only update assessments.         |
|Windows Server 2008 R2 SP1 and later (Including Windows Server 2012 and 2016)    |.NET Framework 4.5.1 or later is required. ([Download .NET Framework](/dotnet/framework/install/guide-for-developers))<br/> Windows PowerShell 4.0 or later is required. ([Download WMF 4.0](https://www.microsoft.com/download/details.aspx?id=40855))<br/> Windows PowerShell 5.1 is recommended for increased reliability.  ([Download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616))        |
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data which CentOS doesn't have out of the box. For more information on classification-based patching on CentOS, see [Update classifications on Linux](#linux-2)          |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS, 16.04 LTS, and 18.04 (x86/x64)      |Linux agents must have access to an update repository.         |

### Unsupported client types

The following table lists operating systems that aren't supported:

|Operating system  |Notes  |
|---------|---------|
|Windows client     | Client operating systems (such as Windows 7 and Windows 10) aren't supported.        |
|Windows Server 2016 Nano Server     | Not supported.       |

### Client requirements

#### Windows

Windows agents must be configured to communicate with a WSUS server or they must have access to Microsoft Update. You can use Update Management with System Center Configuration Manager. To learn more about integration scenarios, see [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md#configuration). The [Windows agent](../azure-monitor/platform/agent-windows.md) is required. The agent is installed automatically if you're onboarding an Azure virtual machine.

#### Linux

For Linux, the machine must have access to an update repository. The update repository can be private or public. TLS 1.1 or TLS 1.2 is required to interact with Update Management. A Log Analytics Agent for Linux that's configured to report to more than one Log Analytics workspaces isn't supported with this solution.

For information about how to install the Log Analytics Agent for Linux and to download the latest version, see [Log Analytics Agent for Linux](https://github.com/microsoft/oms-agent-for-linux). For information about how to install the Log Analytics Agent for Windows, see [Microsoft Monitoring Agent for Windows](../log-analytics/log-analytics-windows-agent.md).

## Permissions

To create and manage update deployments, you need specific permissions. To learn about these permissions, see [Role-based access - Update Management](automation-role-based-access-control.md#update-management).

## Solution components

The solution consists of the following resources. The resources are added to your Automation account. They're either directly connected agents or in an Operations Manager-connected management group.

### Hybrid Worker groups

After you enable this solution, any Windows computer that's directly connected to your Log Analytics workspace is automatically configured as a Hybrid Runbook Worker to support the runbooks that are included in this solution.

Each Windows computer that's managed by the solution is listed in the **Hybrid worker groups** pane as a **System hybrid worker group** for the Automation account. The solutions use the naming convention *Hostname FQDN_GUID*. You can't target these groups with runbooks in your account. They fail if you try. These groups are intended to support only the management solution.

You can add the Windows computers to a Hybrid Runbook Worker group in your Automation account to support Automation runbooks if you use the same account for both the solution and the Hybrid Runbook Worker group membership. This functionality was added in version 7.2.12024.0 of the Hybrid Runbook Worker.

### Management packs

If your System Center Operations Manager management group is connected to a Log Analytics workspace, the following management packs are installed in Operations Manager. These management packs are also installed on directly connected Windows computers after you add the solution. You don't need to configure or manage these management packs.

* Microsoft System Center Advisor Update Assessment Intelligence Pack (Microsoft.IntelligencePacks.UpdateAssessment)
* Microsoft.IntelligencePack.UpdateAssessment.Configuration (Microsoft.IntelligencePack.UpdateAssessment.Configuration)
* Update Deployment MP

> [!NOTE]
> If you have an Operations Manager 1807 Management Group with agents configured at the Management Group level to be associated to a workspace, the current workaround to get them to show up is to override **IsAutoRegistrationEnabled** to **True** in the **Microsoft.IntelligencePacks.AzureAutomation.HybridAgent.Init** rule.

For more information about how solution management packs are updated, see [Connect Operations Manager to Azure Monitor logs](../azure-monitor/platform/om-agents.md).

> [!NOTE]
> For systems with the Operations Manger Agent, to be able to be fully managed by Update Management, the agent needs to be updated to the Microsoft Monitoring Agent. To learn how to update the agent, see [How to upgrade an Operations Manager agent](https://docs.microsoft.com/system-center/scom/deploy-upgrade-agents). For environments using Operations Manager, it is required that you are running System Center Operations Manager 2012 R2 UR 14 or later.

## <a name="onboard"></a>Enable Update Management

To begin patching systems, you need to enable the Update Management solution. There are many ways to onboard machines to Update Management. The following are the recommended and supported ways to onboard the solution:

* [From a virtual machine](automation-onboard-solutions-from-vm.md)
* [From browsing multiple machines](automation-onboard-solutions-from-browse.md)
* [From your Automation account](automation-onboard-solutions-from-automation-account.md)
* [With an Azure Automation runbook](automation-onboard-solutions.md)
  
### Confirm that non-Azure machines are onboarded

To confirm that directly connected machines are communicating with Azure Monitor logs, after a few minutes, you can run one the following log searches.

#### Linux

```loganalytics
Heartbeat
| where OSType == "Linux" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table
```

#### Windows

```loganalytics
Heartbeat
| where OSType == "Windows" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table
```

On a Windows computer, you can review the following information to verify agent connectivity with Azure Monitor logs:

1. In Control Panel, open **Microsoft Monitoring Agent**. On the **Azure Log Analytics** tab, the agent displays the following message: **The Microsoft Monitoring Agent has successfully connected to Log Analytics**.
2. Open the Windows Event Log. Go to **Application and Services Logs\Operations Manager** and search for Event ID 3000 and Event ID 5002 from the source **Service Connector**. These events indicate that the computer has registered with the Log Analytics workspace and is receiving configuration.

If the agent can't communicate with Azure Monitor logs and the agent is configured to communicate with the internet through a firewall or proxy server, confirm the firewall or proxy server is properly configured. To learn how to verify the firewall or proxy server is properly configured, see [Network configuration for Windows agent](../azure-monitor/platform/agent-windows.md) or [Network configuration for Linux agent](../log-analytics/log-analytics-agent-linux.md).

> [!NOTE]
> If your Linux systems are configured to communicate with a proxy or Log Analytics Gateway and you're onboarding this solution, update the *proxy.conf* permissions to grant the omiuser group read permission on the file by using the following commands:
>
> `sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf`
> `sudo chmod 644 /etc/opt/microsoft/omsagent/proxy.conf`

Newly added Linux agents show a status of **Updated** after an assessment has been performed. This process can take up to 6 hours.

To confirm that an Operations Manager management group is communicating with Azure Monitor logs, see [Validate Operations Manager integration with Azure Monitor logs](../azure-monitor/platform/om-agents.md#validate-operations-manager-integration-with-azure-monitor).

## Data collection

### Supported agents

The following table describes the connected sources that are supported by this solution:

| Connected source | Supported | Description |
| --- | --- | --- |
| Windows agents |Yes |The solution collects information about system updates from Windows agents and then initiates installation of required updates. |
| Linux agents |Yes |The solution collects information about system updates from Linux agents and then initiates installation of required updates on supported distributions. |
| Operations Manager management group |Yes |The solution collects information about system updates from agents in a connected management group.<br/>A direct connection from the Operations Manager agent to Azure Monitor logs isn't required. Data is forwarded from the management group to the Log Analytics workspace. |

### Collection frequency

A scan is performed twice per day for each managed Windows computer. Every 15 minutes, the Windows API is called to query for the last update time to determine whether the status has changed. If the status has changed, a compliance scan is initiated.

A scan is performed every hour for each managed Linux computer.

It can take between 30 minutes and 6 hours for the dashboard to display updated data from managed computers.

The average Azure Monitor logs data usage for a machine using Update Management is approximately 25MB per month. This value is only an approximation and is subject to change based on your environment. It's recommended that you monitor your environment to see the exact usage that you have.

## <a name="viewing-update-assessments"></a>View update assessments

In your Automation account, select **Update Management** to view the status of your machines.

This view provides information about your machines, missing updates, update deployments, and scheduled update deployments. In the **COMPLIANCE COLUMN**, you can see the last time the machine was assessed. In the **UPDATE AGENT READINESS** column, you can see if the health of the update agent. If there's an issue, select the link to go to troubleshooting documentation that can help you learn what steps to take to correct the problem.

To run a log search that returns information about the machine, update, or deployment, select the item in the list. The **Log Search** pane opens with a query for the item selected:

![Update Management default view](media/automation-update-management/update-management-view.png)

## Install updates

After updates are assessed for all the Linux and Windows computers in your workspace, you can install required updates by creating an *update deployment*. To create an Update Deployment, you must have write access to the Automation Account and write access to the any Azure VMs that are targeted in the deployment. An update deployment is a scheduled installation of required updates for one or more computers. You specify the date and time for the deployment and a computer or group of computers to include in the scope of a deployment. To learn more about computer groups, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md).

When you include computer groups in your update deployment, group membership is evaluated only once, at the time of schedule creation. Subsequent changes to a group aren't reflected. To get around this use [Dynamic groups](#using-dynamic-groups), these groups are resolved at deployment time and are defined by a query for Azure VMs or a saved search for Non-Azure VMs.

> [!NOTE]
> Windows virtual machines that are deployed from the Azure Marketplace by default are set to receive automatic updates from Windows Update Service. This behavior doesn't change when you add this solution or add Windows virtual machines to your workspace. If you don't actively manage updates by using this solution, the default behavior (to automatically apply updates) applies.

To avoid updates being applied outside of a maintenance window on Ubuntu, reconfigure the Unattended-Upgrade package to disable automatic updates. For information about how to configure the package, see [Automatic Updates topic in the Ubuntu Server Guide](https://help.ubuntu.com/lts/serverguide/automatic-updates.html).

Virtual machines that were created from the on-demand Red Hat Enterprise Linux (RHEL) images that are available in the Azure Marketplace are registered to access the [Red Hat Update Infrastructure (RHUI)](../virtual-machines/virtual-machines-linux-update-infrastructure-redhat.md) that's deployed in Azure. Any other Linux distribution must be updated from the distribution's online file repository by following the distribution's supported methods.

To create a new update deployment, select **Schedule update deployment**. The **New Update Deployment** page opens. Enter values for the properties described in the following table and then click **Create**:

| Property | Description |
| --- | --- |
| Name |Unique name to identify the update deployment. |
|Operating System| Linux or Windows|
| Groups to update |For Azure machines, define a query based on a combination of subscription, resource groups, locations, and tags to build a dynamic group of Azure VMs to include in your deployment. </br></br>For Non-Azure machines, select an existing saved search to select a group of Non-Azure machines to include in the deployment. </br></br>To learn more, see [Dynamic Groups](automation-update-management.md#using-dynamic-groups)|
| Machines to update |Select a Saved search, Imported group, or pick Machine from the drop-down and select individual machines. If you choose **Machines**, the readiness of the machine is shown in the **UPDATE AGENT READINESS** column.</br> To learn about the different methods of creating computer groups in Azure Monitor logs, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md) |
|Update classifications|Select all the update classifications that you need|
|Include/exclude updates|This opens the **Include/Exclude** page. Updates to be included or excluded are on separate tabs. For more information on how inclusion is handled, see [inclusion behavior](automation-update-management.md#inclusion-behavior) |
|Schedule settings|Select the time to start, and select either Once or recurring for the recurrence|
| Pre-scripts + Post-scripts|Select the scripts to run before and after your deployment|
| Maintenance window |Number of minutes set for updates. The value can't be less than 30 minutes and no more than 6 hours |
| Reboot control| Determines how reboots should be handled. Available options are:</br>Reboot if required (Default)</br>Always reboot</br>Never reboot</br>Only reboot - will not install updates|

Update Deployments can also be created programmatically. To learn how to create an Update Deployment with the REST API, see [Software Update Configurations - Create](/rest/api/automation/softwareupdateconfigurations/create). There is also a sample runbook that can be used to create a weekly Update Deployment. To learn more about this runbook, see [Create a weekly update deployment for one or more VMs in a resource group](https://gallery.technet.microsoft.com/scriptcenter/Create-a-weekly-update-2ad359a1).

### <a name="multi-tenant"></a>Cross-tenant Update Deployments

If you have machines in another Azure tenant reporting to Update Management that you need to patch, you'll need to use the following workaround to get them scheduled. You can use the [New-AzureRmAutomationSchedule](/powershell/module/azurerm.automation/new-azurermautomationschedule) cmdlet with the switch `-ForUpdate` to create a schedule, and use the [New-AzureRmAutomationSoftwareUpdateConfiguration](/powershell/module/azurerm.automation/new-azurermautomationsoftwareupdateconfiguration
) cmdlet and pass the machines in the other tenant to the `-NonAzureComputer` parameter. The following example shows an example on how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$sched = New-AzureRmAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdate

New-AzureRmAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName <automationAccountName> -Schedule $sched -Windows -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## View missing updates

Select **Missing updates** to view the list of updates that are missing from your machines. Each update is listed and can be selected. Information about the number of machines that require the update, the operating system, and a link for more information is shown. The **Log search** pane shows more details about the updates.

## View update deployments

Select the **Update Deployments** tab to view the list of existing update deployments. Select any of the update deployments in the table to open the **Update Deployment Run** pane for that update deployment. Job logs are stored for a max of 30 days.

![Overview of update deployment results](./media/automation-update-management/update-deployment-run.png)

To view an update deployment from the REST API, see [Software Update Configuration Runs](/rest/api/automation/softwareupdateconfigurationruns).

## Update classifications

The following tables list the update classifications in Update Management, with a definition for each classification.

### Windows

|Classification  |Description  |
|---------|---------|
|Critical updates     | An update for a specific problem that addresses a critical, non-security-related bug.        |
|Security updates     | An update for a product-specific, security-related issue.        |
|Update rollups     | A cumulative set of hotfixes that are packaged together for easy deployment.        |
|Feature packs     | New product features that are distributed outside a product release.        |
|Service packs     | A cumulative set of hotfixes that are applied to an application.        |
|Definition updates     | An update to virus or other definition files.        |
|Tools     | A utility or feature that helps complete one or more tasks.        |
|Updates     | An update to an application or file that currently is installed.        |

### Linux

|Classification  |Description  |
|---------|---------|
|Critical and security updates     | Updates for a specific problem or a product-specific, security-related issue.         |
|Other updates     | All other updates that aren't critical in nature or aren't security updates.        |

For Linux, Update Management can distinguish between critical and security updates in the cloud while displaying assessment data due to data enrichment in the cloud. For patching, Update Management relies on classification data available on the machine. Unlike other distributions, CentOS does not have this information available out of the box. If you have CentOS machines configured in a way to return security data for the following command, Update Management will be able to patch based on classifications.

```bash
sudo yum -q --security check-update
```

There's currently no method supported method to enable native classification-data availability on CentOS. At this time, only best-effort support is provided to customers who may have enabled this on their own.

## <a name="firstparty-predownload"></a>Advanced settings

Update Management relies on Windows Update to download and install Windows Updates. As a result, we respect many of the settings used by Windows Update. If you use settings to enable non-Windows updates, Update Management will manage those updates as well. If you want to enable downloading updates before an update deployment occurs, update deployments can go faster and be less likely to exceed the maintenance window.

### Pre download updates

To configure automatically downloading updates in Group Policy, you can set the [Configure Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates##configure-automatic-updates) to **3**. This downloads the updates needed in the background, but doesn't install them. This keeps Update Management in control of schedules but allow updates to download outside of the Update Management maintenance window. This can prevent **Maintenance window exceeded** errors in Update Management.

You can also set this with PowerShell, run the following PowerShell on a system that you want to auto-download updates.

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

### Disable automatic installation

Azure VMs have Automatic installation of updates enabled by default. This can cause updates to be installed before you schedule them to be installed by Update Management. You can disable this behavior by setting the `NoAutoUpdate` registry key to `1`. The following PowerShell snippet shows you one way to do this.

```powershell
$AutoUpdatePath = "HKLM:SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
Set-ItemProperty -Path $AutoUpdatePath -Name NoAutoUpdate -Value 1
```

### Enable updates for other Microsoft products

By default, Windows Update only provides updates for Windows. If you enable **Give me updates for other Microsoft products when I update Windows**, you're provided with updates for other products, including security patches for SQL Server or other first party software. This option can't be configured by Group Policy. Run the following PowerShell on the systems that you wish to enable other first party patches on, and Update Management will honor this setting.

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

## <a name="third-party"></a> Third-party patches on Windows

Update Management relies on the locally configured update repository to patch supported Windows systems. This is either WSUS or Windows Update. Tools like [System Center Updates Publisher](/sccm/sum/tools/updates-publisher
) (Updates Publisher) allow you to publish custom updates into WSUS. This scenario allows Update Management to patch machines that use System Center Configuration Manager as their update repository with third-party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/sccm/sum/tools/install-updates-publisher).

## <a name="ports"></a>Network Planning

The following addresses are required specifically for Update Management. Communication to these addresses occurs over port 443.

|Azure Public  |Azure Government  |
|---------|---------|
|*.ods.opinsights.azure.com     |*.ods.opinsights.azure.us         |
|*.oms.opinsights.azure.com     | *.oms.opinsights.azure.us        |
|*.blob.core.windows.net|*.blob.core.usgovcloudapi.net|
|*.azure-automation.net|*.azure-automation.us|

For more information about ports that the Hybrid Runbook Worker requires, see [Hybrid Worker role ports](automation-hybrid-runbook-worker.md#hybrid-worker-role).

It's recommended to use the addresses listed when defining exceptions. For IP addresses you can download the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653). This file is updated weekly, and reflects the currently deployed ranges and any upcoming changes to the IP ranges.

## Search logs

In addition to the details that are provided in the Azure portal, you can do searches against the logs. On the solution pages, select **Log Analytics**. The **Log Search** pane opens.

You can also learn how to customize the queries or use them from different clients and more by visiting:  [Log Analytics search API documentation](
https://dev.loganalytics.io/).

### Sample queries

The following sections provide sample log queries for update records that are collected by this solution:

#### Single Azure VM Assessment queries (Windows)

Replace the VMUUID value with the VM GUID of the virtual machine you're querying. You can find the VMUUID that should be used by running the following query in Azure Monitor logs: `Update | where Computer == "<machine name>" | summarize by Computer, VMUUID`

##### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and VMUUID=~"b08d5afa-1471-4b52-bd95-a44fea6e4ca8"
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| summarize by UpdateID, Classification
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

##### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and VMUUID=~"8bf1ccc6-b6d3-4a0b-a643-23f346dfdf82"
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, KBID, PublishedDate, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| project-away UpdateState, Approved, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), displayName=any(Title), publishedDate=min(PublishedDate), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(UpdateID, "_", KBID), classification=Classification, InformationId=strcat("KB", KBID), InformationUrl=iff(isnotempty(KBID), strcat("https://support.microsoft.com/kb/", KBID), ""), osType=2
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl
```

#### Single Azure VM assessment queries (Linux)

For some Linux distros, there is a [endianness](https://en.wikipedia.org/wiki/Endianness) mismatch with the VMUUID value that comes from Azure Resource Manager and what is stored in Azure Monitor logs. The following query checks for a match on either endianness. Replace the VMUUID values with the big-endian and little-endian format of the GUID to properly return the results. You can find the VMUUID that should be used by running the following query in Azure Monitor logs: `Update | where Computer == "<machine name>"
| summarize by Computer, VMUUID`

##### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and (VMUUID=~"625686a0-6d08-4810-aae9-a089e68d4911" or VMUUID=~"a0865662-086d-1048-aae9-a089e68d4911")
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| summarize by Product, ProductArch, Classification
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

##### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and (VMUUID=~"625686a0-6d08-4810-aae9-a089e68d4911" or VMUUID=~"a0865662-086d-1048-aae9-a089e68d4911")
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, BulletinUrl, BulletinID) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| project-away UpdateState, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(Product, "_", ProductArch), displayName=Product, productArch=ProductArch, classification=Classification, InformationId=BulletinID, InformationUrl=tostring(split(BulletinUrl, ";", 0)[0]), osType=1
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl

```

#### Multi-VM assessment queries

##### Computers summary

```loganalytics
Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(14h) and OSType!="Linux"
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Approved, Optional, Classification) by SourceComputerId, UpdateID
    | distinct SourceComputerId, Classification, UpdateState, Approved, Optional
    | summarize WorstMissingUpdateSeverity=max(iff(UpdateState=~"Needed" and (Optional==false or Classification has "Critical" or Classification has "Security") and Approved!=false, iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1)), 0)) by SourceComputerId
)
on SourceComputerId
| extend WorstMissingUpdateSeverity=coalesce(WorstMissingUpdateSeverity, -1)
| summarize computersBySeverity=count() by WorstMissingUpdateSeverity
| union (Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(5h) and OSType=="Linux"
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by SourceComputerId, Product, ProductArch
    | distinct SourceComputerId, Classification, UpdateState
    | summarize WorstMissingUpdateSeverity=max(iff(UpdateState=~"Needed", iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1)), 0)) by SourceComputerId
)
on SourceComputerId
| extend WorstMissingUpdateSeverity=coalesce(WorstMissingUpdateSeverity, -1)
| summarize computersBySeverity=count() by WorstMissingUpdateSeverity)
| summarize assessedComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity>-1), notAssessedComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==-1), computersNeedCriticalUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==4), computersNeedSecurityUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==2), computersNeedOtherUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==1), upToDateComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==0)
| summarize assessedComputersCount=sum(assessedComputersCount), computersNeedCriticalUpdatesCount=sum(computersNeedCriticalUpdatesCount),  computersNeedSecurityUpdatesCount=sum(computersNeedSecurityUpdatesCount), computersNeedOtherUpdatesCount=sum(computersNeedOtherUpdatesCount), upToDateComputersCount=sum(upToDateComputersCount), notAssessedComputersCount=sum(notAssessedComputersCount)
| extend allComputersCount=assessedComputersCount+notAssessedComputersCount


```

##### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| summarize by Product, ProductArch, Classification
| union (Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| summarize by UpdateID, Classification )
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

##### Computers list

```loganalytics
Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions, Computer, ResourceId, ComputerEnvironment, VMUUID) by SourceComputerId
| where Solutions has "updates"
| extend vmuuId=VMUUID, azureResourceId=ResourceId, osType=1, environment=iff(ComputerEnvironment=~"Azure", 1, 2), scopedToUpdatesSolution=true, lastUpdateAgentSeenTime=""
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
    | where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
    | summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
    | where Solutions has "updates"
    | distinct SourceComputerId))
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Product, Computer, ComputerEnvironment) by SourceComputerId, Product, ProductArch
    | summarize Computer=any(Computer), ComputerEnvironment=any(ComputerEnvironment), missingCriticalUpdatesCount=countif(Classification has "Critical" and UpdateState=~"Needed"), missingSecurityUpdatesCount=countif(Classification has "Security" and UpdateState=~"Needed"), missingOtherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security" and UpdateState=~"Needed"), lastAssessedTime=max(TimeGenerated), lastUpdateAgentSeenTime="" by SourceComputerId
    | extend compliance=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0, 2, 1)
    | extend ComplianceOrder=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0 or missingOtherUpdatesCount > 0, 1, 3)
)
on SourceComputerId
| project id=SourceComputerId, displayName=Computer, sourceComputerId=SourceComputerId, scopedToUpdatesSolution=true, missingCriticalUpdatesCount=coalesce(missingCriticalUpdatesCount, -1), missingSecurityUpdatesCount=coalesce(missingSecurityUpdatesCount, -1), missingOtherUpdatesCount=coalesce(missingOtherUpdatesCount, -1), compliance=coalesce(compliance, 4), lastAssessedTime, lastUpdateAgentSeenTime, osType=1, environment=iff(ComputerEnvironment=~"Azure", 1, 2), ComplianceOrder=coalesce(ComplianceOrder, 2)
| union(Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions, Computer, ResourceId, ComputerEnvironment, VMUUID) by SourceComputerId
| where Solutions has "updates"
| extend vmuuId=VMUUID, azureResourceId=ResourceId, osType=2, environment=iff(ComputerEnvironment=~"Azure", 1, 2), scopedToUpdatesSolution=true, lastUpdateAgentSeenTime=""
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(14h) and OSType!="Linux" and SourceComputerId in ((Heartbeat
    | where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
    | summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
    | where Solutions has "updates"
    | distinct SourceComputerId))
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, Optional, Approved, Computer, ComputerEnvironment) by Computer, SourceComputerId, UpdateID
    | summarize Computer=any(Computer), ComputerEnvironment=any(ComputerEnvironment), missingCriticalUpdatesCount=countif(Classification has "Critical" and UpdateState=~"Needed" and Approved!=false), missingSecurityUpdatesCount=countif(Classification has "Security" and UpdateState=~"Needed" and Approved!=false), missingOtherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security" and UpdateState=~"Needed" and Optional==false and Approved!=false), lastAssessedTime=max(TimeGenerated), lastUpdateAgentSeenTime="" by SourceComputerId
    | extend compliance=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0, 2, 1)
    | extend ComplianceOrder=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0 or missingOtherUpdatesCount > 0, 1, 3)
)
on SourceComputerId
| project id=SourceComputerId, displayName=Computer, sourceComputerId=SourceComputerId, scopedToUpdatesSolution=true, missingCriticalUpdatesCount=coalesce(missingCriticalUpdatesCount, -1), missingSecurityUpdatesCount=coalesce(missingSecurityUpdatesCount, -1), missingOtherUpdatesCount=coalesce(missingOtherUpdatesCount, -1), compliance=coalesce(compliance, 4), lastAssessedTime, lastUpdateAgentSeenTime, osType=2, environment=iff(ComputerEnvironment=~"Azure", 1, 2), ComplianceOrder=coalesce(ComplianceOrder, 2) )
| order by ComplianceOrder asc, missingCriticalUpdatesCount desc, missingSecurityUpdatesCount desc, missingOtherUpdatesCount desc, displayName asc
| project-away ComplianceOrder
```

##### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, BulletinUrl, BulletinID) by SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| project-away UpdateState, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(Product, "_", ProductArch), displayName=Product, productArch=ProductArch, classification=Classification, InformationId=BulletinID, InformationUrl=tostring(split(BulletinUrl, ";", 0)[0]), osType=1
| union(Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, KBID, PublishedDate, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| project-away UpdateState, Approved, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), displayName=any(Title), publishedDate=min(PublishedDate), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(UpdateID, "_", KBID), classification=Classification, InformationId=strcat("KB", KBID), InformationUrl=iff(isnotempty(KBID), strcat("https://support.microsoft.com/kb/", KBID), ""), osType=2)
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl
```

## <a name="using-dynamic-groups"></a>Using dynamic groups

Update Management provides the ability to target a dynamic group of Azure or Non-Azure VMs for update deployments. These groups are evaluated at deployment time so you do not have to edit your deployment to add machines.

> [!NOTE]
> You must have the proper permissions when creating an update deployment. To learn more, see [Install Updates](#install-updates).

### Azure machines

These groups are defined by a query, when an update deployment begins, the members of that group are evaluated. Dynamic groups do not work with classic VMs. When defining your query, the following items can be used together to populate the dynamic group

* Subscription
* Resource groups
* Locations
* Tags

![Select groups](./media/automation-update-management/select-groups.png)

To preview the results of a dynamic group, click the **Preview** button. This preview shows the group membership at that time, in this example, we are searching for machines with the tag **Role** is equal to **BackendServer**. If more machines have this tag added, they will be added to any future deployments against that group.

![preview groups](./media/automation-update-management/preview-groups.png)

### Non-Azure machines

For Non-Azure machines, saved searches also referred to as computer groups are used to create the dynamic group. To learn how to create a saved search, see [Creating a computer group](../azure-monitor/platform/computer-groups.md#creating-a-computer-group). Once your group is created you can select it from the list of saved searches. Click **Preview** to preview the computers in the saved search at that time.

![Select groups](./media/automation-update-management/select-groups-2.png)

## Integrate with System Center Configuration Manager

Customers who have invested in System Center Configuration Manager for managing PCs, servers, and mobile devices also rely on the strength and maturity of Configuration Manager to help them manage software updates. Configuration Manager is part of their software update management (SUM) cycle.

To learn how to integrate the management solution with System Center Configuration Manager, see [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md).

## Inclusion behavior

Update inclusion allows you to specify specific updates to apply. Patches or packages that are included are installed. When Patches or packages are included and a classification is selected as well, both the included items and items that meet the classification are installed.

It is important to know that exclusions override inclusions. For instance, if you define an exclusion rule of `*`, then no patches or packages are installed as they are all excluded. Excluded patches still show as missing from the machine. For Linux machines if a package is included but has a dependant package that was excluded, the package is not installed.

## Patch Linux machines

The following sections explain potential issues with Linux patching.

### Unexpected OS-level upgrades

On some Linux variants, such as Red Hat Enterprise Linux, OS-level upgrades might occur via packages. This might lead to Update Management runs where the OS version number changes. Because Update Management uses the same methods to update packages that an administrator would use locally on the Linux computer, this behavior is intentional.

To avoid updating the OS version via Update Management runs, use the **Exclusion** feature.

In Red Hat Enterprise Linux, the package name to exclude is redhat-release-server.x86_64.

![Packages to exclude for Linux](./media/automation-update-management/linuxpatches.png)

### Critical / security patches aren't applied

When you deploy updates to a Linux machine, you can select update classifications. This filters the updates that are applied to the machine that meet the specified criteria. This filter is applied locally on the machine when the update is deployed.

Because Update Management performs update enrichment in the cloud, some updates can be flagged in Update Management as having security impact, even though the local machine doesn't have that information. As a result, if you apply critical updates to a Linux machine, there might be updates that aren't marked as having security impact on that machine and the updates aren't applied.

However, Update Management might still report that machine as being non-compliant because it has additional information about the relevant update.

Deploying updates by update classification doesn't work on CentOS out of the box. To properly deploy updates for CentOS, select all classifications to ensure updates are applied. For SUSE, selecting *only* 'Other updates' as the classification may result in some security updates also being installed if security updates related to zypper (package manager) or its dependencies are required first. This behavior is a limitation of zypper. In some cases, you may be required to rerun the update deployment. To verify, check the update log.

## Remove a VM from Update Management

To remove a VM from Update Management:

* In your Log Analytics workspace, remove the VM from the saved search for the Scope Configuration `MicrosoftDefaultScopeConfig-Updates`. Saved searches can be found under **General** in your workspace.
* Remove the [Microsoft Monitoring agent](../azure-monitor/learn/quick-collect-windows-computer.md#clean-up-resources) or the [Log Analytics agent for Linux](../azure-monitor/learn/quick-collect-linux-computer.md#clean-up-resources).

## Next steps

Continue to the tutorial to learn how to manage updates for your Windows virtual machines.

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)

* Use log searches in [Azure Monitor logs](../log-analytics/log-analytics-log-searches.md) to view detailed update data.
* [Create alerts](automation-tutorial-update-management.md#configure-alerts) for update deployment status.

* To learn how to interact with Update Management through the REST API, see [Software Update Configurations](/rest/api/automation/softwareupdateconfigurations)
* To learn how to troubleshoot your Update Management, see [Troubleshooting Update Management](troubleshoot/update-management.md)
