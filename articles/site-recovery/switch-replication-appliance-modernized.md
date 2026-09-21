---
title: Switch replication appliance in Azure Site Recovery - Modernized
ms.reviewer: v-gajeronika
description: This article describes show to switch between different replication appliances while replicating VMware VMs to Azure in Azure Site Recovery- Modernized
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 09/11/2026
ms.author: v-gajeronika
author: Jeronika-MS
# Customer intent: "As a cloud administrator managing VMware VMs, I want to switch replication appliances in Azure Site Recovery, so that I can enhance resiliency and load balance my replication processes seamlessly."
---

# Switch Azure Site Recovery replication appliance

>[!NOTE]
> The information in this article applies to Azure Site Recovery - Modernized.

You need to [create and deploy an on-premises Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-modernized.md) when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. For detailed information about replication appliance, see [the architecture](vmware-azure-architecture-modernized.md). You can create and use multiple replication appliances based on the capacity requirements of your organization.

This article provides information about how you can switch between replication appliances.

## Appliance resiliency

Typically, in the classic architecture, if you need to maintain the resiliency of your configuration server then the recommended action is to take regular manual backups of the machine. It's a highly cumbersome process, also prone to errors and misses.  

This modernized application resilience introduces a better way to make your appliances more resilient. If your replication appliance burns down or you need to balance the machines running on an appliance, just spin up another replication appliance and switch all your machines to the new appliance.


## Considerations for switching replication appliance

Appliance-switch eligibility depends on the health and compatibility of the appliances, their required components, and the protected machines. A compatible version number alone doesn't guarantee that a switch can proceed.

- **Switch from an unavailable appliance:** All components on the current appliance must have no heartbeat. If any component still has a heartbeat, the switch is blocked. The target appliance must be in a healthy or warning state, and you must select credentials for the machines being switched.
- **Switch from a live appliance:** For load balancing or planned maintenance, the current and target appliances and their required components must be in a healthy or warning state. A missing component heartbeat blocks the switch. Credentials are selected automatically.
- Only machines replicating from on-premises to Azure can be selected.
- Switching isn't supported if a protected machine moved to a different vCenter Server.


## Switch a replication appliance

As an example, here's the scenario where replication appliance 1 (RA1) has become critical and you want to move the protected workloads to replication appliance 2 (RA2), which is in healthy state. Or, you want to switch the workloads under RA1  to RA2 for any load balancing or organization level changes.

**Follow these steps to switch an appliance**:

1. Go to **Site Recovery infrastructure** section and select **ASR replication appliance**.

   The list of available appliances and their health is displayed. For example, RA2 is healthy here.

   :::image type="content" source="./media/switch-replication-appliance-modernized/appliance-health.png" alt-text="Screenshot of healthy replication appliances list.":::

2. Select the replication appliance (RA1) and select  **Switch appliance**.

   :::image type="content" source="./media/switch-replication-appliance-modernized/select-switch-appliance.png" alt-text="Screenshot of select replication appliance to switch.":::


3. Under  **Select machines**, select the machines that you want to failover to another replication appliance (RA2). Select **Next**.

   >[!NOTE]
   > Only those machine which have been protected by the current appliance will be visible in the list. Failed over machines will not be present here  

    :::image type="content" source="./media/switch-replication-appliance-modernized/select-machines.png" alt-text="Screenshot of select machines for switching.":::

4. Under **Source settings**  page, for each of the selected machines, select a different replication appliance.

   :::image type="content" source="./media/switch-replication-appliance-modernized/source-settings.png" alt-text="Screenshot of source settings for replication appliance.":::

   >[!NOTE]
   > If your current appliance has burnt down, then you will be required to select the credentials to access the machines. Otherwise, the field will be disabled.

5. Review the selection and then select **Switch appliance**.

   :::image type="content" source="./media/switch-replication-appliance-modernized/review-switch-appliance.png" alt-text="Screenshot of review replication appliance.":::

   Once the resync is complete, the replication status turns healthy for the VMs that are moved to a new appliance.

## Next steps

Set up disaster recovery of [VMware VMs](vmware-azure-set-up-replication-tutorial-modernized.md) to Azure.
