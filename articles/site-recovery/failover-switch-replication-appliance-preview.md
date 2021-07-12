---
title: Switch replication appliance in Azure Site Recovery - Preview
description: This article describes show to switch between different replication appliances while replicating VMware VMs to Azure in Azure Site Recovery- Preview
ms.service: site-recovery
ms.topic: article
ms.date: 07/12/2021
---

# Failover/switch Azure Site Recovery replication appliance

>[!NOTE]
> The information in this article applies to Azure Site Recovery - Preview.

You need to [create and deploy an on-premises Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-preview.md) when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. For detailed information about replication appliance, see [the architecture](vmware-azure-architecture-preview.md). You can create and use multiple replication appliances based on the capacity requirements of your organization.

This article provides information about how you can failover/switch between replication appliances.

## Failover/switch a replication appliance

You can switch replication appliance in multiple scenarios:

- You want to switch appliance in case your current replication appliance has failed.
- you want to switch the replication appliance due to some internal Org level requirements.

As an example, here is the scenario where replication appliance 1 (RA1) has failed and you want to move the protected workloads to replication appliance 2 (RA2), which is in healthy state. Or, you want to switch the workloads under RA1  to RA2 for any org level requirements.

Follow these steps.

1. Go to **Site Recovery infrastructure** blade and select **ASR replication appliance**.

   The list of available appliances and their health is displayed. RA2 is healthy here.

2. Select the replication appliance (RA1) and select  **Switch appliance**.

   << writer's comment - the screenshot in step 3 reads as **Appliance failover** any changes in the UI or UI text here? >>

3. Under  **Select machines**- select the applications/machines that you want to failover to another replication appliance (RA2). Select **Next**.

   ![Select machines for switching](./media/switch-replication-appliances/select-machines.png)

4. Under **Select appliance** page, for each of the selected applications/machines (in earlier page), select the replication appliance.  

   << writer's comment - Here the screen displays the other tab as **Select machine** in previous screen, it was **machines** >>

   ![Select replication appliance](./media/switch-replication-appliances/select-replication-appliance.png)

   >[!NOTE]
   > In case of a failover, You will be prompted to select the account credentials for all the selected machines, as the previous appliance has failed.

5. Select **Switch application**.

   Once the resync is complete, the replication status turns healthy for the VMs that are moved to a new appliance.

## Next steps
Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
