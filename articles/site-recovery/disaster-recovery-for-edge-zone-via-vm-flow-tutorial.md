---
title: Setup disaster recovery when creating a VM 
description: Learn how to set up disaster recovery for Virtual machines on Azure Public MEC (preview) using VM Flow.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: tutorial
ms.date: 11/09/2022
ms.author: v-pgaddala
---

# Tutorial: Set up disaster recovery for Azure Public MEC (preview) using VM Flow

This tutorial shows you how to set up disaster recovery for Azure Public MEC (preview) using VM Flow. In this article, you learn how to:

> [!div class="checklist"]
> * Enable replication for the Azure VMs

When you enable replication for a VM to set up disaster recovery, the Site Recovery Mobility service extension installs on the VM, and registers it with Azure Site Recovery. During replication, VM disk writes are sent to a cache storage account in the source region. Data is sent from there to the target region, and recovery points are generated from the data. When you fail over a VM during disaster recovery, a recovery point is used to restore the VM in the target region. Learn more about the architecture.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> ![NOTE]
> This is in preview only for Public MECs.

## Enable replication for the Azure VMs

To enable replication to a secondary location, follow the below steps: 

1. On the Azure portal, select **Virtual machines** and select a VM to replicate.
1. On the left pane, under **Operations**, select **Disaster recovery**.
    
:::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/disaster-recovery.png" alt-text=" Select Disaster Recovery":::

1. In **Basics**, select the **Target region** or an Azure Public MEC (preview).
    - Option1: **Public MEC to Region**
    
    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/edge-zone-to-region.png" alt-text="Option1- Edge Zone to Region":::

    - Option2: **Public MEC to Public MEC**
    
    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/EZ-to-EZ.png" alt-text=" Option 2 Edge Zone to Edge Zone ":::    

    >[!Note]
    >This flow proceeds with option1: Public MEC to Region replication.
1. Select **Next : Advanced settings**.
    >[!Note]
    >**Review + Start replication** will appear grey at this step.
1. In **Advanced settings**, select **Subscription**, **VM resource group**, **Virtual network**, **Availability** and **Proximity placement group** as required.
    1. Under **Capacity Reservation Settings**, **Capacity Reservation Groups** is disabled.
    1. Under **Storage settings** > **Cache storage account**, select the cache storage account associated with the vault from the dropdown.
    
    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage.png" alt-text=" Cache storage field":::

    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/cache-storage-2.png" alt-text=" Cache storage field step 2":::

1. Select **Next : Review + Start replication**.

    :::image type="content" source="./media/disaster-recovery-for-edge-zone-vm-flow-tutorial/review.png" alt-text=" Review settings tab":::

1. In **Review + Start replication**, review the VM settings and select **Start replication**.
