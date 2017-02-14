---
title: Create recovery plans for failover and recovery in Azure Site Recovery | Microsoft Docs
description: Describes how to create and customize recovery plans to fail over and recover VMs and physical servers in Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 72408c62-fcb6-4ee2-8ff5-cab1218773f2
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 02/14/2017
ms.author: raynew

---
# Create recovery plans


This article provides information about creating and customizing recovery plans in [Azure Site Recovery?](site-recovery-overview.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

Recovery plans contain one or more ordered groups that contain virtual machines or physical servers that will fail over together. Recovery plans do the following:

* Define groups of machines that fail over, and then start up together.
* Model dependencies between machines, by grouping them together in a recovery plan group. For example, to fail over and bring up a specific application, you group the VM for that application in the same recovery plan group.
* Automate failover. You can run a test, planned, or unplanned failover on a recovery plan.

Recovery plans are displayed on the **Recovery Plans** in the Site Recovery portal.

## Create a recovery plan

1. Click **Recovery Plans** > **Create Recovery Plan**.
   Specify a name for the recovery plan, and a source and target. The source server must have virtual machines that are enabled for failover and recovery.

    - For VMM to VMM replication, select **Source Type** > **VMM**, and the source and target VMM servers. Click **Hyper-V** to see clouds that are configured to use Hyper-V Replica.
    - For VMM to Azure, select **Source Type** > **VMM**.  Select the source VMM server and **Azure** as the target.
    - For Hyper-V replication to Azure, without VMM, select **Source Type** > **Hyper-V site**. Select the site as the source and **Azure** as the target.
    - For VMware or a physical on-premises server to Azure, select a configuration server as the source and **Azure** as the target
2. In **Select virtual machines** select the virtual machines (or replication group) that you want to add to the default group (Group 1) in the recovery plan.

## Customize and extend recovery plans

You can customize and extend recovery plans in a number of ways

- **Add new groups**—You can add additional recovery plan groups (up to seven) to the default group, and then add more machines or replication groups to them. Groups are numbered in the order in which you add them. A virtual machine or replication group can only be included in one recovery plan group.
- **Add a manual action**—You can add manual actions that run before or after a recovery plan group. When the recovery plan runs, it stops at the point at which you inserted the manual action, and a dialog box prompts you to specify that the manual action was completed.
- **Add a script**—You can add scripts that before or after a recovery plan group. When you add a script it adds a new set of actions for the group. For example a set of pre-steps for Group 1 will be created with the name: Group 1: pre-steps. All pre-steps will be listed inside this set. Note that you can only add a script on the primary site if you have a VMM server deployed.
- **Add Azure runbooks**—You can extend recovery plans with Azure runbooks. For example to automate tasks, or to create single-step recovery. [Learn more](site-recovery-runbook-automation.md).

## Extend recovery plans with scripts

You can use PowerShell scripts in your recovery plans.

 - Ensure that scripts use try-catch blocks so that the exceptions are handled gracefully.
    - If there is an exception in the script it stops running and the task shows as failed.
    - If an error does occur, any remaining part of the script doesn't run.
    - If an error occurs when you're running an unplanned failover, the recovery plan continues.
    - If an error occurs when you're running a planned failover, the recovery plan stops. You need to fix the script, make sure it runs as expected, and then run the recovery plan again.
- The Write-Host command doesn’t work in a recovery plan script, and the script will fail. If you want to create output, create a proxy script that in turn runs your main script. Ensure that all output is piped out using the >> command.
  * The script times out if it doesn't return within 600 seconds.
  * If anything is written out to STDERR, the script will be classified as failed. This information is displayed in the script execution details.

If you're using VMM in your deployment:

    * Scripts in a recovery plan run in the context of the VMM Service account. Make sure this account has Read permissions on the remote share on which the script is located, and test the script to run at the VMM service account privilege level.
    * VMM cmdlets are delivered in a Windows PowerShell module. The VMM Windows PowerShell module is installed when you install the VMM console. The VMM module can be loaded into your script using the following command in the script: Import-Module -Name virtualmachinemanager. [Get more details](hhttps://technet.microsoft.com/library/hh875013.aspx).
    * Ensure you have at least one library server in your VMM deployment. By default the library share path for a VMM server is located locally on the VMM server with the folder name MSCVMMLibrary.
    * If your library share path is remote (or local but not shared with MSCVMMLibrary, configure the share as follows (using \\libserver2.contoso.com\share\ as an example):
      * Open the Registry Editor and navigate to HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\Azure Site Recovery\Registration.
      * Edit the value ScriptLibraryPath and place the value as \\libserver2.contoso.com\share\. Specify the full FQDN. Provide permissions to the share location.
      * Ensure that you test the script with a user account that has the same permissions as the VMM service account, to ensure that stand-alone tested scripts run in the same way that they will in recovery plans. On the VMM server, set the execution policy to bypass as follows:
        * Open the 64-bit Windows PowerShell console using elevated privileges.
        * Type: **Set-executionpolicy bypass**. [Get more details](https://technet.microsoft.com/library/ee176961.aspx).

## Add a script or manual action to a plan

You can add a script to the default recovery plan groun after you've added VMs or replication groups to it, and created the plan.

1. Open the recovery plan.
2. Click any item in the **Step** list, and then click **Script** or **Manual Action**.
3. Specify whether to want to add the script or action before or after the selected item. Use the **Move Up** and **Move Down**  buttons to move the position of the script up or down.
4. If you're adding a VMM script, select **Failover to VMM script**, and in in **Script Path** type the relative path to the share. So, for the VMM example below, specify the path: \RPScripts\RPScript.PS1.
5. If you're adding an Azure automation run book, specify the **Azure Automation Account** in which the runbook is located, and select the appropriate **Azure Runbook Script**.
6. Do a failover of the recovery plan to ensure that the script works as expected.


### VMM script

If you have a VMM source site, you can create a script on the VMM server, and include it in your recovery plan.

1. Create a new folder in the library share, for example \<VMMServerName>\MSSCVMMLibrary\RPScripts. Place it on the source and target VMM servers.
2. Create the script (for example RPScript), and check it works as expected.
3. Place the script in the location \<VMMServerName>\MSSCVMMLibrary, on the source and target VMM servers.


## Next steps

[Learn more](site-recovery-failover.md) about running failovers.
