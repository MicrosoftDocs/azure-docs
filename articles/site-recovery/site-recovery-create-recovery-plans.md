---
title: Create recovery plans for failover and recovery in Azure Site Recovery | Microsoft Docs
description: Describes how to create and customize recovery plans in Azure Site Recovery, to fail over and recover VMs and physical servers
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 72408c62-fcb6-4ee2-8ff5-cab1218773f2
ms.service: storage-backup-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/24/2017
ms.author: raynew

---
# Create recovery plans


This article provides information about creating and customizing recovery plans in [Azure Site Recovery](site-recovery-overview.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

 Create recovery plans to do the following:

* Define groups of machines that fail over together, and then start up together.
* Model dependencies between machines, by grouping them together into a recovery plan group. For example, to fail over and bring up a specific application, you group all of the VMs for that application into the same recovery plan group.
* Run a failover. You can run a test, planned, or unplanned failover on a recovery plan.


## Create a recovery plan

1. Click **Recovery Plans** > **Create Recovery Plan**.
   Specify a name for the recovery plan, and a source and target. The source location must have virtual machines that are enabled for failover and recovery.

    - For VMM to VMM replication, select **Source Type** > **VMM**, and the source and target VMM servers. Click **Hyper-V** to see clouds that are protected.
    - For VMM to Azure, select **Source Type** > **VMM**.  Select the source VMM server, and **Azure** as the target.
    - For Hyper-V replication to Azure (without VMM), select **Source Type** > **Hyper-V site**. Select the site as the source, and **Azure** as the target.
    - For a VMware VM or a physical on-premises server to Azure, select a configuration server as the source, and **Azure** as the target.
2. In **Select virtual machines**, select the virtual machines (or replication group) that you want to add to the default group (Group 1) in the recovery plan.

## Customize and extend recovery plans

You can customize and extend recovery plans:

- **Add new groups**—Add additional recovery plan groups (up to seven) to the default group, and then add more machines or replication groups to those recovery plan groups. Groups are numbered in the order in which you add them. A virtual machine, or replication group, can only be included in one recovery plan group.
- **Add a manual action**—You can add manual actions that run before or after a recovery plan group. When the recovery plan runs, it stops at the point at which you inserted the manual action. A dialog box prompts you to specify that the manual action was completed.
- **Add a script**—You can add scripts that run before or after a recovery plan group. When you add a script, it adds a new set of actions for the group. For example, a set of pre-steps for Group 1 will be created with the name: Group 1: pre-steps. All pre-steps will be listed inside this set. You can only add a script on the primary site if you have a VMM server deployed.
- **Add Azure runbooks**—You can extend recovery plans with Azure runbooks. For example, to automate tasks, or to create single-step recovery. [Learn more](site-recovery-runbook-automation.md).

## Add scripts

You can use PowerShell scripts in your recovery plans.

 - Ensure that scripts use try-catch blocks so that the exceptions are handled gracefully.
    - If there is an exception in the script, it stops running and the task shows as failed.
    - If an error occurs, any remaining part of the script doesn't run.
    - If an error occurs when you run an unplanned failover, the recovery plan continues.
    - If an error occurs when you run a planned failover, the recovery plan stops. You need to fix the script, check that it runs as expected, and then run the recovery plan again.
- The Write-Host command doesn’t work in a recovery plan script, and the script will fail. To create output, create a proxy script that in turn runs your main script. Make sure that all output is piped out using the >> command.
  * The script times out if it doesn't return within 600 seconds.
  * If anything is written out to STDERR, the script is classified as failed. This information is displayed in the script execution details.

If you're using VMM in your deployment:

* Scripts in a recovery plan run in the context of the VMM Service account. Make sure this account has Read permissions for the remote share on which the script is located. Test the script to run at the VMM service account privilege level.
* VMM cmdlets are delivered in a Windows PowerShell module. The module is installed when you install the VMM console. It can be loaded into your script, using the following command in the script:
   - Import-Module -Name virtualmachinemanager. [Learn more](https://technet.microsoft.com/library/hh875013.aspx).
* Ensure you have at least one library server in your VMM deployment. By default, the library share path for a VMM server is located locally on the VMM server, with the folder name MSCVMMLibrary.
    * If your library share path is remote (or local but not shared with MSCVMMLibrary), configure the share as follows (using \\libserver2.contoso.com\share\ as an example):
      * Open the Registry Editor and navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\Azure Site Recovery\Registration**.
      * Edit the value **ScriptLibraryPath** and place it as \\libserver2.contoso.com\share\. Specify the full FQDN. Provide permissions to the share location.
      * Ensure that you test the script with a user account that has the same permissions as the VMM service account. This checks that standalone tested scripts run in the same way as they will in recovery plans. On the VMM server, set the execution policy to bypass as follows:
        * Open the 64-bit Windows PowerShell console using elevated privileges.
        * Type: **Set-executionpolicy bypass**. [Learn more](https://technet.microsoft.com/library/ee176961.aspx).

## Add a script or manual action to a plan

You can add a script to the default recovery plan group after you've added VMs or replication groups to it, and created the plan.

1. Open the recovery plan.
2. Click an item in the **Step** list, and then click **Script** or **Manual Action**.
3. Specify whether to want to add the script or action before or after the selected item. Use the **Move Up** and **Move Down**  buttons, to move the position of the script up or down.
4. If you add a VMM script, select **Failover to VMM script**. In **Script Path**, type the relative path to the share. In the VMM example below, you specify the path: **\RPScripts\RPScript.PS1**.
5. If you add an Azure automation run book, specify the Azure Automation account in which the runbook is located, and select the appropriate Azure runbook script.
6. Do a failover of the recovery plan, to make sure the script works as expected.


### Add a VMM script

If you have a VMM source site, you can create a script on the VMM server, and include it in your recovery plan.

1. Create a new folder in the library share. For example, \<VMMServerName>\MSSCVMMLibrary\RPScripts. Place it on the source and target VMM servers.
2. Create the script (for example RPScript), and check it works as expected.
3. Place the script in the location \<VMMServerName>\MSSCVMMLibrary, on the source and target VMM servers.


## Next steps

[Learn more](site-recovery-failover.md) about running failovers.
