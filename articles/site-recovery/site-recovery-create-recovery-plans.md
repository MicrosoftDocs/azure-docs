---
title: Create and customize recovery plans for failover and recovery in Azure Site Recovery | Microsoft Docs
description: Describes how to create and customize recovery plans in Azure Site Recovery, to fail over and recover VMs and physical servers
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 72408c62-fcb6-4ee2-8ff5-cab1218773f2
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/13/2017
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
   Specify a name for the recovery plan, and a source and target. The source location must have virtual machines that are enabled for failover and recovery. Choose a source and target based on the virtual machines that you want to be part of the recovery plan. 

|Scenario                   |Source               |Target           |
|---------------------------|---------------------|-----------------|
|Azure to Azure             |Azure region         |Azure Region     |
|Vmware to Azure            |Configuration server |Azure            |
|VMM to Azure               |VMM friendly name    |Azure            |
|Hyper-v Site to Azure      |Hyper-v site name    |Azure            |
|Physical machines to Azure |Configuration server |Azure            |
|VMM to VMM                 |VMM friendly name    |VMM friendly name|

    > [!NOTE]
    > A recovery plan can contain virtual machines that have the same source and target. Virtual machines of VMware and VMM cannot be part of the same recovery plan. VMware virtual machines and physical machines can however be added to the same plan as the source for both of them is a configuration server.

2. In **Select virtual machines**, select the virtual machines (or replication group) that you want to add to the default group (Group 1) in the recovery plan. Only those virtual machines that were protected on Source (as selected in the recovery plan) and are protected to the Target (as selected in the recovery plan) will be allowed for selection.

## Customize and extend recovery plans

You can customize and extend recovery plans by going to the Site Recovery recovery plan resource blade and clicking the Customize tab.

You can customize and extend recovery plans:

- **Add new groups**—Add additional recovery plan groups (up to seven) to the default group, and then add more machines or replication groups to those recovery plan groups. Groups are numbered in the order in which you add them. A virtual machine, or replication group, can only be included in one recovery plan group.
- **Add a manual action**—You can add manual actions that run before or after a recovery plan group. When the recovery plan runs, it stops at the point at which you inserted the manual action. A dialog box prompts you to specify that the manual action was completed.
- **Add a script**—You can add scripts that run before or after a recovery plan group. When you add a script, it adds a new set of actions for the group. For example, a set of pre-steps for Group 1 will be created with the name: Group 1: pre-steps. All pre-steps will be listed inside this set. You can only add a script on the primary site if you have a VMM server deployed. [Learn more](site-recovery-how-to-add-vmmscript.md).
- **Add Azure runbooks**—You can extend recovery plans with Azure runbooks. For example, to automate tasks, or to create single-step recovery. [Learn more](site-recovery-runbook-automation.md).


## Add a script, runbook or manual action to a plan

You can add a script or manual action to the default recovery plan group after you've added VMs or replication groups to it, and created the plan.

1. Open the recovery plan.
2. Click an item in the **Step** list, and then click **Script** or **Manual Action**.
3. Specify whether to want to add the script or action before or after the selected item. Use the **Move Up** and **Move Down**  buttons, to move the position of the script up or down.
4. If you add a VMM script, select **Failover to VMM script**. In **Script Path**, type the relative path to the share. In the VMM example below, you specify the path: **\RPScripts\RPScript.PS1**.
5. If you add an Azure automation run book, specify the Azure Automation account in which the runbook is located, and select the appropriate Azure runbook script.
6. Do a failover of the recovery plan, to make sure the script works as expected.

The script or runbook options are available only in the below scenarios when doing a failover or failback. A manual action is available for both failover and failback.


|Scenario               |Failover |Failback |
|-----------------------|---------|---------|
|Azure to Azure         |Runbooks |Runbook  |
|Vmware to Azure        |Runbooks |NA       | 
|VMM to Azure           |Runbooks |Script   |
|Hyper-v site to Azure  |Runbooks |NA       |
|VMM to VMM             |Script   |Script   |


## Next steps

[Learn more](site-recovery-failover.md) about running failovers.

Watch this video to see the recovery plan in action.

> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/One-click-failover-of-a-2-tier-WordPress-application-using-Azure-Site-Recovery/player]
