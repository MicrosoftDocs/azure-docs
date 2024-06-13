---
title: Set up disaster recovery when creating a VM 
description: Learn how to set up disaster recovery for Virtual machines on Azure Public MEC using VM Flow.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: tutorial
ms.date: 04/19/2023
ms.author: ankitadutta
---

# Tutorial: Set up disaster recovery for Azure Public MEC using VM Flow

> [!IMPORTANT]
> The Azure Site Recovery (ASR) functionality for Public MEC is in preview state.


This tutorial shows you how to set up disaster recovery for Azure Site Recovery Public MEC (preview) using VM Flow. You will do this using the Azure Site Recovery portal.


In this article, you learn how to:

> [!div class="checklist"]
> * Enable replication for the Azure VMs

When you enable replication for a VM to set up disaster recovery, the Site Recovery Mobility service extension installs on the VM, and registers it with Azure Site Recovery (ASR as a service for MEC is in preview). During replication, VM disk writes are sent to a cache storage account in the source region. Data is sent from there to the target region, and recovery points are generated from the data. When you fail over a VM during disaster recovery, a recovery point is used to restore the VM in the target region. [Learn more](azure-to-azure-architecture.md) about the architecture.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Enable replication for the Azure VMs

To enable replication to a secondary location, follow the below steps: 

1. On the Azure portal, select **Virtual machines** and select a VM to replicate.
1. On the left pane, under **Operations**, select **Disaster recovery**.
    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/disaster-recovery.png" alt-text=" Screenshot of Select Disaster Recovery option."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/disaster-recovery-expanded.png":::
     
1. In **Basics**, select the **Target region** or an Azure Public MEC.
    - Option 1: **Public MEC to Region**
    
        :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/edge-zone-to-region.png" alt-text="Screenshot of Option 1 Edge Zone to Region."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/edge-zone-to-region.png":::

    - Option 2: **Public MEC to Public MEC**
    
        :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/edgezone-to-edgezone.png" alt-text="Screenshot of Option 2 Edge Zone to Edge Zone."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/edgezone-to-edgezone.png":::
    
    >[!Note]
    >This flow proceeds with Option 1: Public MEC to Region replication.

1. Select **Next : Advanced settings**.

    >[!Note]
    >**Review + Start replication** will appear grey at this step.
1. In **Advanced settings**, select **Subscription**, **VM resource group**, **Virtual network**, **Availability** and **Proximity placement group** as required.
    1. Under **Capacity Reservation Settings**, **Capacity Reservation Groups** is disabled.
    1. Under **Storage settings** > **Cache storage account**, select the cache storage account associated with the vault from the dropdown.
        :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage.png" alt-text="Screenshot of cache storage field."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage.png":::

        :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage-2.png" alt-text="Screenshot of cache storage field step 2."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage-2.png":::
    
1. Select **Next : Review + Start replication**.
    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/review.png" alt-text="Screenshot of Review settings tab."lightbox="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/review-expanded.png":::

1. In **Review + Start replication**, review the VM settings and select **Start replication**.

## Next steps

See [Set up disaster recovery for VMs on Azure Public MEC using Vault flow](disaster-recovery-for-edge-zone-vm-tutorial.md).
