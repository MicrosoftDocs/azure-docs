---
title: Create/customize recovery plans in Azure Site Recovery 
description: Learn how to create and customize recovery plans for disaster recovery using the Azure Site Recovery service.
ms.topic: how-to
ms.service: site-recovery
ms.date: 01/23/2020
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Create and customize recovery plans

This article describes how to create and customize a recovery plan for failover in [Azure Site Recovery](site-recovery-overview.md). Before you start, [learn more](recovery-plan-overview.md) about recovery plans.

## Create a recovery plan

1. In the Recovery Services vault, select **Recovery Plans (Site Recovery)** > **+Recovery Plan**.
2. In **Create recovery plan**, specify a name for the plan.
3. Choose a source and target based on the machines in the plan, and select **Resource Manager** for the deployment model. The source location must have machines that are enabled for failover and recovery. 

    **Failover** | **Source** | **Target** 
   --- | --- | ---
   Azure to Azure | Select the Azure region | Select the Azure region
   VMware  to Azure | Select the configuration server | Select Azure
   Physical machines to Azure | Select the configuration server | Select Azure   
   Hyper-V to Azure | Select the Hyper-V site name | Select Azure
   Hyper-V (managed by VMM) to Azure  | Select the VMM server | Select Azure
  
    Note the following:
    - You can use a recovery plan for both failover to Azure and failback from Azure.
    - The source location must have machines that are enabled for failover and recovery.
    - A recovery plan can contain machines with the same source and target.
    - You can include VMware VMs and Hyper-V VMs managed by VMM, in the same plan.
    - VMware VMs and physical servers can be in the same plan.
    - All VMs in a recovery plan must replicate into a single subscription. If you want to replicate different VMs to different subscriptions, please use more than one recovery plan (one or more for each target subscription).

4. In **Select items virtual machines**, select the machines (or replication group) that you want to add to the plan. Then click **OK**.
    - Machines are added default group (Group 1) in the  plan. After failover, all machines in this group start at the same time.
    - You can only select machines are in the source and target locations that you specified. 
5. Click **OK** to create the plan.

## Add a group to a plan

You create additional groups, and add machines to different groups so that you can specify different behavior on a group-by-group basis. For example, you can specify when machines in a group should start after failover, or specify customized actions per group.

1. In **Recovery Plans**, right-click the plan > **Customize**. By default, after creating a plan all the machines you added to it are located in default Group 1.
2. Click **+Group**. By default a new group is numbered in the order in which it's added. You can have up to seven groups.
3. Select the machine you want to move to the new group, click **Change group**, and then select the new group. Alternatively, right-click the group name > **Protected item**, and add machines to the group. A machine or replication group can only belong to one group in a recovery plan.


## Add a script or manual action

You can customize a recovery plan by adding a script or manual action. Note that:

- If you're replicating to Azure you can integrate Azure automation runbooks into your recovery plan. [Learn more](site-recovery-runbook-automation.md).
- If you're replicating Hyper-V VMs managed by System Center VMM, you can create a script on the on-premises VMM server, and include it in the recovery plan.
- When you add a script, it adds a new set of actions for the group. For example, a set of pre-steps for Group 1 is created with the name *Group 1: pre-steps*. All pre-steps are listed inside this set. You can add a script on the primary site only if you have a VMM server deployed.
- If you add a manual action, when the recovery plan runs, it stops at the point at which you inserted the manual action. A dialog box prompts you to specify that the manual action was completed.
- To create a script on the VMM server, follow the instructions in [this article](hyper-v-vmm-recovery-script.md).
- Scripts can be applied during failover to the secondary site, and during failback from the secondary site to the primary. Support depends on your replication scenario:
    
    **Scenario** | **Failover** | **Failback**
    --- | --- | --- 
    Azure to Azure  | Runbook | Runbook
    VMware to Azure | Runbook | NA 
    Hyper-V with VMM to Azure | Runbook | Script
    Hyper-V site to Azure | Runbook | NA
    VMM to secondary VMM | Script | Script

1. In the recovery plan, click the step to which the action should be added, and specify when the action should occur:
    1. If you want the action to occur before the machines in the group are started after failover, select **Add pre-action**.
    1. If you want the action to occur after the machines in the group start after failover, select **Add post action**. To move the position of the action, select the **Move Up** or **Move Down** buttons.
2. In **Insert action**, select **Script** or **Manual action**.
3. If you want to add a manual action, do the following:
    1. Type in a name for the action, and type in action instructions. The person running the failover will see these instructions.
    1. Specify whether you want to add the manual action for all types of failover (Test, Failover, Planned failover (if relevant)). Then click **OK**.
4. If you want to add a script, do the following:
    1. If you're adding a VMM script, select **Failover to VMM script**, and in **Script Path** type the relative path to the share. For example, if the share is located at \\\<VMMServerName>\MSSCVMMLibrary\RPScripts, specify the path: \RPScripts\RPScript.PS1.
    1. If you're adding an Azure automation run book, specify the **Azure Automation Account** in which the runbook is located, and select the appropriate **Azure Runbook Script**.
5. Run a test failover of the recovery plan to ensure that the script works as expected.

## Watch a video

Watch a video that demonstrates how to build a recovery plan.


> [!VIDEO https://www.youtube.com/embed/1KUVdtvGqw8]

## Next steps

Learn more about [running failovers](site-recovery-failover.md).  

    
