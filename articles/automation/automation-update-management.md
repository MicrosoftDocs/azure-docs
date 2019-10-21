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

You can enable Update Management for virtual machines directly from your Azure Automation account. To learn how to enable Update Management for virtual machines from your Automation account, see [Manage updates for multiple virtual machines](manage-update-multi.md). You can also enable Update Management for a virtual machine from the virtual machine page in the Azure portal. This scenario is available for [Linux](../virtual-machines/linux/tutorial-config-management.md#enable-update-management) and [Windows](../virtual-machines/windows/tutorial-config-management.md#enable-update-management) virtual machines.

> [!NOTE]
> The Update Management solution requires linking a Log Analytics workspace to your Automation account. For a definitive list of supported regions, see [Azure Workspace mappings](./how-to/region-mappings.md). The region mappings do not affect the ability to manage virtual machines in a
> separate region than your Automation account.

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

The scheduled deployment defines what target computers receive the applicable updates, either by explicitly specifying computers or by selecting a [computer group](../azure-monitor/platform/computer-groups.md) that's based on log searches of a specific set of computers, or an [Azure query](automation-update-management-query-logs.md) that dynamically selects Azure VMs based on specified criteria. These groups are different from [Scope Configuration](../azure-monitor/insights/solution-targeting.md), which is only used to determine what machines get the management packs that enable the solution.

You also specify a schedule to approve and set a period of time during which updates can be installed. This period of time is called the maintenance window. Twenty minutes of the maintenance window is reserved for reboots if a reboot is needed and you selected the appropriate reboot option. If patching takes longer than expected and there is less than twenty minutes in the maintenance window, a reboot will not occur.

Updates are installed by runbooks in Azure Automation. You can't view these runbooks, and the runbooks don’t require any configuration. When an update deployment is created, the update deployment creates a schedule that starts a master update runbook at the specified time for the included computers. The master runbook starts a child runbook on each agent to install the required updates.

At the date and time specified in the update deployment, the target computers execute the deployment in parallel. Before installation, a scan is run to verify that the updates are still required. For WSUS client computers, if the updates aren't approved in WSUS, the update deployment fails.

Having a machine registered for Update Management in more than one Log Analytics workspaces (multi-homing) isn't supported.

## Clients

### Supported client types

The following table shows a list of supported operating systems for Update Assessments. Patching requires a Hybrid Runbook Worker. For information on Hybrid Runbook Worker requirements, see the installation guides for [Windows HRW](automation-windows-hrw-install.md#installing-the-windows-hybrid-runbook-worker) and [Linux HRW](automation-linux-hrw-install.md#installing-a-linux-hybrid-runbook-worker).

|Operating system  |Notes  |
|---------|---------|
|Windows Server 2019 (Datacenter/Datacenter Core/Standard)<br><br>Windows Server 2016 (Datacenter/Datacenter Core/Standard)<br><br>Windows Server 2012 R2(Datacenter/Standard)<br><br>Windows Server 2012<br><br>Windows Server 2008 R2 (RTM and SP1 Standard)||
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data which CentOS doesn't have out of the box. For more information on classification-based patching on CentOS, see [Update classifications on Linux](#linux-2)          |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS, 16.04 LTS, and 18.04 (x86/x64)      |Linux agents must have access to an update repository.         |

> [!NOTE]
> Azure virtual machine scale sets can be managed with Update Management. Update Management works on the instances themselves and not the base image. You'll need to schedule the updates in an incremental way, as to not update all VM instances at once.
> VMSS Nodes can be added by following the steps under [Onboard a non-Azure machine](automation-tutorial-installed-software.md#onboard-a-non-azure-machine).

### Unsupported client types

The following table lists operating systems that aren't supported:

|Operating system  |Notes  |
|---------|---------|
|Windows client     | Client operating systems (such as Windows 7 and Windows 10) aren't supported.        |
|Windows Server 2016 Nano Server     | Not supported.       |
|Azure Kubernetes Service Nodes | Not supported. Use the patching process detailed in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](../aks/node-updates-kured.md)|

### Client requirements

The information below describes OS specific client requirements.  You should also review [Network Planning](#ports) for further guidance.

#### Windows

Windows agents must be configured to communicate with a WSUS server or they must have access to Microsoft Update.

You can use Update Management with System Center Configuration Manager. To learn more about integration scenarios, see [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md#configuration). The [Windows agent](../azure-monitor/platform/agent-windows.md) is required. The agent is installed automatically if you're onboarding an Azure virtual machine.

Windows virtual machines that are deployed from the Azure Marketplace by default are set to receive automatic updates from Windows Update Service. This behavior doesn't change when you add this solution or add Windows virtual machines to your workspace. If you don't actively manage updates by using this solution, the default behavior (to automatically apply updates) applies.

> [!NOTE]
> It is possible for a user to modify Group Policy so that machine reboots can only performed by the user, not by the system. Managed machines may get stuck, if Update Management does not have rights to reboot the machine without manual interaction from the user.
>
> For more information, see [Configure Group Policy Settings for Automatic Updates](https://docs.microsoft.com/en-us/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates).

#### Linux

For Linux, the machine must have access to an update repository. The update repository can be private or public. TLS 1.1 or TLS 1.2 is required to interact with Update Management. A Log Analytics Agent for Linux that's configured to report to more than one Log Analytics workspaces isn't supported with this solution.  The machine must also have Python 2.x installed.

For information about how to install the Log Analytics Agent for Linux and to download the latest version, see [Log Analytics Agent for Linux](https://github.com/microsoft/oms-agent-for-linux). For information about how to install the Log Analytics Agent for Windows, see [Microsoft Monitoring Agent for Windows](../log-analytics/log-analytics-windows-agent.md).

Virtual machines that were created from the on-demand Red Hat Enterprise Linux (RHEL) images that are available in the Azure Marketplace are registered to access the [Red Hat Update Infrastructure (RHUI)](../virtual-machines/virtual-machines-linux-update-infrastructure-redhat.md) that's deployed in Azure. Any other Linux distribution must be updated from the distribution's online file repository by following the distribution's supported methods.

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
> If you have an Operations Manager 1807 or 2019 Management Group with agents configured at the Management Group level to be associated to a workspace, the current workaround to get them to show up is to override **IsAutoRegistrationEnabled** to **True** in the **Microsoft.IntelligencePacks.AzureAutomation.HybridAgent.Init** rule.

For more information about how solution management packs are updated, see [Connect Operations Manager to Azure Monitor logs](../azure-monitor/platform/om-agents.md).

> [!NOTE]
> For systems with the Operations Manger Agent, to be able to be fully managed by Update Management, the agent needs to be updated to the Microsoft Monitoring Agent. To learn how to update the agent, see [How to upgrade an Operations Manager agent](https://docs.microsoft.com/system-center/scom/deploy-upgrade-agents). For environments using Operations Manager, it is required that you are running System Center Operations Manager 2012 R2 UR 14 or later.

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

## <a name="ports"></a>Network Planning

The following addresses are required specifically for Update Management. Communication to these addresses occurs over port 443.

|Azure Public  |Azure Government  |
|---------|---------|
|*.ods.opinsights.azure.com     |*.ods.opinsights.azure.us         |
|*.oms.opinsights.azure.com     | *.oms.opinsights.azure.us        |
|*.blob.core.windows.net|*.blob.core.usgovcloudapi.net|
|*.azure-automation.net|*.azure-automation.us|

For Windows Machines, you must also allow traffic to any endpoints required by Windows Update.  You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Update Server](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment), you must also allow traffic to the server specified in your [WSUS Key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux Machines, please refer to [The IPs for the RHUI content delivery servers](../virtual-machines/linux/update-infrastructure-redhat.md#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux Distributions, refer to provider documentation.

For more information about ports that the Hybrid Runbook Worker requires, see [Hybrid Worker role ports](automation-hybrid-runbook-worker.md#hybrid-worker-role).

It's recommended to use the addresses listed when defining exceptions. For IP addresses you can download the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653). This file is updated weekly, and reflects the currently deployed ranges and any upcoming changes to the IP ranges.

Follow the instructions in [Connect computers without internet access](../azure-monitor/platform/gateway.md) to configure machines that do not have internet access.

## View update assessments

In your Automation account, select **Update Management** to view the status of your machines.

This view provides information about your machines, missing updates, update deployments, and scheduled update deployments. In the **COMPLIANCE COLUMN**, you can see the last time the machine was assessed. In the **UPDATE AGENT READINESS** column, you can see if the health of the update agent. If there's an issue, select the link to go to troubleshooting documentation that can help you learn what steps to take to correct the problem.

To run a log search that returns information about the machine, update, or deployment, select the item in the list. The **Log Search** pane opens with a query for the item selected:

![Update Management default view](media/automation-update-management/update-management-view.png)

## View missing updates

Select **Missing updates** to view the list of updates that are missing from your machines. Each update is listed and can be selected. Information about the number of machines that require the update, the operating system, and a link for more information is shown. The **Log search** pane shows more details about the updates.

![Missing Updates](./media/automation-view-update-assessments/automation-view-update-assessments-missing-updates.png)

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

### <a name="linux-2"></a>Linux

|Classification  |Description  |
|---------|---------|
|Critical and security updates     | Updates for a specific problem or a product-specific, security-related issue.         |
|Other updates     | All other updates that aren't critical in nature or aren't security updates.        |

For Linux, Update Management can distinguish between critical and security updates in the cloud while displaying assessment data due to data enrichment in the cloud. For patching, Update Management relies on classification data available on the machine. Unlike other distributions, CentOS does not have this information available out of the box. If you have CentOS machines configured in a way to return security data for the following command, Update Management will be able to patch based on classifications.

```bash
sudo yum -q --security check-update
```

There's currently no method supported method to enable native classification-data availability on CentOS. At this time, only best-effort support is provided to customers who may have enabled this on their own.

## Integrate with System Center Configuration Manager

Customers who have invested in System Center Configuration Manager for managing PCs, servers, and mobile devices also rely on the strength and maturity of Configuration Manager to help them manage software updates. Configuration Manager is part of their software update management (SUM) cycle.

To learn how to integrate the management solution with System Center Configuration Manager, see [Integrate System Center Configuration Manager with Update Management](oms-solution-updatemgmt-sccmintegration.md).

### Third-party patches on Windows

Update Management relies on the locally configured update repository to patch supported Windows systems. This is either WSUS or Windows Update. Tools like [System Center Updates Publisher](/sccm/sum/tools/updates-publisher) (Updates Publisher) allow you to publish custom updates into WSUS. This scenario allows Update Management to patch machines that use System Center Configuration Manager as their update repository with third-party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/sccm/sum/tools/install-updates-publisher).

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

### <a name="multi-tenant"></a>Cross-tenant Update Deployments

If you have machines in another Azure tenant reporting to Update Management that you need to patch, you'll need to use the following workaround to get them scheduled. You can use the [New-AzureRmAutomationSchedule](/powershell/module/azurerm.automation/new-azurermautomationschedule) cmdlet with the switch `-ForUpdate` to create a schedule, and use the [New-AzureRmAutomationSoftwareUpdateConfiguration](/powershell/module/azurerm.automation/new-azurermautomationsoftwareupdateconfiguration
) cmdlet and pass the machines in the other tenant to the `-NonAzureComputer` parameter. The following example shows an example on how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$sched = New-AzureRmAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdate

New-AzureRmAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName <automationAccountName> -Schedule $sched -Windows -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## <a name="onboard"></a>Enable Update Management

To begin patching systems, you need to enable the Update Management solution. There are many ways to onboard machines to Update Management. The following are the recommended and supported ways to onboard the solution:

* [From a virtual machine](automation-onboard-solutions-from-vm.md)
* [From browsing multiple machines](automation-onboard-solutions-from-browse.md)
* [From your Automation account](automation-onboard-solutions-from-automation-account.md)
* [With an Azure Automation runbook](automation-onboard-solutions.md)

## Next steps

Continue to the tutorial to learn how to manage updates for your Windows virtual machines.

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)

* Use log searches in [Azure Monitor logs](../log-analytics/log-analytics-log-searches.md) to view detailed update data.
* [Create alerts](automation-tutorial-update-management.md#configure-alerts) for update deployment status.

* To learn how to interact with Update Management through the REST API, see [Software Update Configurations](/rest/api/automation/softwareupdateconfigurations)
* To learn how to troubleshoot your Update Management, see [Troubleshooting Update Management](troubleshoot/update-management.md)
