---
title: Set up disaster recovery for Edge Zone (preview) via VM Flow
description: Learn how to set up disaster recovery for Virtual machines on Edge Zone (preview) via VM Flow.
author: v-pgaddala
ms.service: site-recovery
ms.topic: tutorial
ms.date: 11/04/2022
ms.author: v-pgaddala
---

# Tutorial: Set up disaster recovery for Edge Zone (preview) via VM Flow

This tutorial shows you how to set up disaster recovery for Edge Zone (preview) via VM Flow. In this article, you learn how to:

> [!div class="checklist"]
> * Enable replication for the Azure VMs

When you enable replication for a VM to set up disaster recovery, the Site Recovery Mobility service extension installs on the VM, and registers it with Azure Site Recovery. During replication, VM disk writes are sent to a cache storage account in the source region. Data is sent from there to the target region, and recovery points are generated from the data. When you fail over a VM during disaster recovery, a recovery point is used to restore the VM in the target region. Learn more about the architecture.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Enable replication for the Azure VMs

To enable replication to a secondary location, follow the below steps:

1. On the Azure portal, select **Virtual machines** and select a VM to replicate.
1. On the left pane, under **Operations**, select **Disaster recovery**.
1. In **Basics**, select the **Target region** or an edge zone (preview).
    - Option1: **Edge Zone to Region**
    - Option2: **Edge Zone to Edge Zone**
This flow proceeds with option1: Edge Zone to Region replication.
1. Select **Next : Advanced settings**.
    >[!Note]
    >**Review + Start replication** will appear grey at this step.
1. In **Advanced settings**, select **Subscription**, **VM resource group**, **Virtual network**, **Availability** and **Proximity placement group** as required.
    1. Under **Capacity Reservation Settings**, **Capacity Reservation Groups** is disabled.
    1. Under **Storage settings** > **Cache storage account**, select the cache storage account associated with the vault from the dropdown.
1. Select **Next : Review + Start replication**.
1. In **Review + Start replication**, review the VM settings and select **Start replication**.