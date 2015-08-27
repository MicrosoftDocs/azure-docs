<properties
	pageTitle="Creating recovery plans" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines located on on-premises servers to Azure or a secondary datacenter." 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="08/05/2015" 
	ms.author="raynew"/>

# Creating recovery plans

The Site Recovery service contributes to a robust business continuity and disaster recovery (BCDR) solution that protects your on-premises physical servers and virtual machines by orchestrating and automating replication and failover to Azure, or to a secondary on-premises datacenter. For an introduction to Site Recovery deployment scenarios read the [Site Recovery Overview](site-recovery-overview.md).

## About this article

The article provides information about creating and customizing recovery plans. 

If you have any questions after reading this article post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

Recovery plans consist of one or more ordered groups that contain protected virtual machines or replication groups (for SAN replication). Machines fail over according to group they are in. Virtual machines in a particular group fail over in parallel. Recovery plans do the following:

- Define groups of machines that fail over and start up together.
- Model dependencies between machines by grouping them together in a recovery plan group. For example if you want to fail over and bring up a specific application you would group the virtual machines for that application in the same recovery plan group.
- Automate and extend failover. You can run a test, planned, or unplanned failover on a recovery plan. You can customize recovery plans with scripts, Azure automation, and manual actions.

Recovery plans are displayed on the **Recovery Plans** in the Site Recovery portal.


## Create recovery plans

The way in which you create a recovery plan depends on your Site Recovery deployment.

- **Hyper-V replication (VMM)**—If you’re replicating from a VMM site to a secondary on-premises site or to Azure using Hyper-V replication you add protected Hyper-V virtual machines from a VMM cloud to a recovery plan.
- **Hyper-V replication (Hyper-V site)**—If you're replicating from a Hyper-V site (without a VMM server) to Azure you add protected Hyper-V virtual machines from a protection group to a recovery plan.
- **SAN replication**—If you’re replicating to a secondary on-premises site using SAN replication you add a replication group that contains virtual machines to the recovery plan. You select a replication group rather than specific virtual machines because all virtual machines in a replication group must fail over together (failover occurs at the storage layer first.
- **VMware replication**—If you're replicating VMware virtual machines to Azure you add replication groups that contain virtual machines to a recovery plan.

Create a recovery plan as follows:

1. On the Recovery Plans tab, click Create Recovery Plan.
Specify a name for the recovery plan, and a source and target. The source server must have virtual machines that are enabled for failover and recovery.

	- If you're replicating from VMM to VMM select VMM in **Source Type**, and the source and target VMM servers. Click **Hyper-V** to see clouds that are configured to use Hyper-V Replica. 
	- If you're replicating from VMM to VMM using SAN select VMM in **Source Type**, and the source and target VMM servers. Click **SAN** to see clouds that are configured for SAN replication.
	- If you're replicating from VMM to Azure select VMM in **Source Type**.  Select the source VMM server and **Azure** as the target.
	- If you're replicating from a Hyper-V site select Hyper-V site in Source Type. Select the site as the source and **Azure **as the target.
	- If you're replicating from VMware or a physical on-premises server to Azure, select a configuration server as the source and **Azure** as the target

2.In **Select virtual machines** select the virtual machines (or replication group) that you want to add to the default group (Group 1) in the recovery plan.

## Customize recovery plans

After you've added protected virtual machines or replication groups to the default recovery plan group and created the plan you can customize it:

- **Add new groups**—You can add additional recovery plan groups. Groups you add are numbered in the order in which you add them. You can add up to seven groups. You can add more machines or replication groups to these new groups. Note that a virtual machine or replication group can only be included in one recovery plan group.
- **Add a script **—You can add scripts that before or after a recovery plan group. When you add a script it adds a new set of actions for the group. For example a set of pre-steps for Group 1 will be created with the name: Group 1: Pre-steps. All pre-steps will be listed inside this set. Note that you can only add a script on the primary site if you have a VMM server deployed.
- **Add a manual action**—You can add manual actions that run before or after a recovery plan group. When the recovery plan runs, it stops at the point at which you inserted the manual action, and a dialog box prompts you to specify that the manual action was completed.

### Extend recovery plans with scripts

You can add a script to your recovery plan:

If you have a VMM source site you can create a script on the VMM server and include it in your recovery plan.
If you're replicating to Azure you can integrate Azure automation runbooks into your recovery plan

#### Create a VMM script

Note the following before you start:

- Write scripts using Windows PowerShell.
- VMM cmdlets are delivered in a Windows PowerShell module. The VMM Windows PowerShell module is installed when you install the VMM console. The VMM module can be loaded into your script using the following command in the script: Import-Module -Name virtualmachinemanager. [Get more details](hhttps://technet.microsoft.com/library/hh875013.aspx).
- Ensure you have at least one library server in your VMM deployment. By default the library share path for a VMM server is located locally on the VMM server with the folder name MSCVMMLibrary.
- If your library share path is remote (or local but not shared with MSCVMMLibrary, configure the share as follows (using \\libserver2.contoso.com\share\ as an example):
	- Open the Registry Editor.
	- Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter\Registration.
	- Edit the value ScriptLibraryPath.
	- Place the value as \\libserver2.contoso.com\share\. Specify the full FQDN.
	- Provide permissions to the share location.

- Scripts in a recovery plan run in the context of the VMM Service account. Make sure this account has Read permissions on the remote share on which the script is located, and test the script to run at the VMM service account privilege level.
- 	Ensure that you test the script with a user account that has the same permissions as the VMM Service account, to ensure that stand-alone tested scripts run in the same way that they will in recovery plans.
- 	On the VMM server, set the execution policy to bypass as follows:
	- Open the 64-bit Windows PowerShell console using elevated privileges.
	- Type: **Set-executionpolicy bypass**. [Get more details](https://technet.microsoft.com/library/ee176961.aspx).
- Ensure that you use try-catch blocks, so that the exceptions are handled gracefully. If there is an exception in the script it stops running and the task shows as failed.  If an error does occur, any remaining part of the script won't run. If this occurs when you are running an unplanned failover, the recovery plan will continue. If this occurs when you are running a planned failover, the recovery plan will stop. If this occurs, fix the script, make sure it runs as expected, and then run the recovery plan again.
- The Write-Host command doesn’t work in a recovery plan script, and the script will fail. If you want to create output, create a proxy script that in turn runs your main script, and ensure that all output is piped out using the >> command.
- The script times out if it does not return within 600 seconds.
- If anything is written out to STDERR, the script will be classified as failed. This information will be displayed in the script execution details.

Create the script as follows:

1. Create a new folder in the library share, for example \<VMMServerName>\MSSCVMMLibrary\RPScripts. Place it on the source and target VMM servers.
2. Create the script (for example RPScript), and check it works as expected.
3. Place the script in the location \<VMMServerName>\MSSCVMMLibrary on the source and target VMM servers.

#### Create an Azure automation runbook

You can extend your recovery plan by running an Azure automation runbook as part of the plan. [Read more](site-recovery-runbook-automation.md).


### Add custom settings to a recovery plan

1. Open the recovery plan you want to customize.
2. Click to add a virtual machines or new group.
3. To add a script or manual action click any item in the **Step** list and then click **Script** or **Manual Action**. Specify whether to want to add the script or action before or after the selected item. Use the **Move Up** and **Move Down** command buttons to move the position of the script up or down.
4. If you're adding a VMM script, select **Failover to VMM script**, and in in **Script Path** type the relative path to the share. So, for our example where the share is located at \\<VMMServerName>\MSSCVMMLibrary\RPScripts, specify the path: \RPScripts\RPScript.PS1.
5. If you're adding an Azure automation run book, specify the **Azure Automation Account** in which the runbook is located, and select the appropriate **Azure Runbook Script**.
5. Do a failover of the recovery plan to ensure that the script works as expected.


## Run a failover

You can run different types of failovers recovery plan, including a test failover to check your environment, and a planned or unplanned failover. Read more about failover and get instructions for running different types of failovers [here](site-recovery-failover.md) about failover.


 