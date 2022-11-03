---
title: Set up disaster recovery for Edge Zone (preview) via VM Flow
description: Learn how to set up disaster recovery for Virtual machines on Edge Zone (preview) via VM Flow.
author: v-pgaddala
ms.service: site-recovery
ms.topic: tutorial
ms.date: 11/03/2022
ms.author: v-pgaddala
---

# Tutorial: Set up disaster recovery for Edge Zone (preview) via VM Flow

This tutorial shows you how to set up disaster recovery for Edge Zone (preview) via VM Flow. In this article, you learn how to:

> [!div class="checklist"]
> * Enable VM replication

When you enable replication for a VM to set up disaster recovery, the Site Recovery Mobility service extension installs on the VM, and registers it with Azure Site Recovery. During replication, VM disk writes are sent to a cache storage account in the source region. Data is sent from there to the target region, and recovery points are generated from the data. When you fail over a VM during disaster recovery, a recovery point is used to restore the VM in the target region. Learn more about the architecture.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Enable replication for the Azure VMs

To enable replication to a secondary location, follow the below steps:

1. On the Azure portal, select **Virtual machines** and select a VM to replicate.
1. On the left pane, select **Operations** > **Disaster recovery**.
1. In the **Disaster Recovery** page, under **Basics** tab > **Target region**, select the target region or an edge zone (preview).
    - Option1: **Edge Zone to Region**
    - Option2: **Edge Zone to Edge Zone**
1. Select **Next : Advanced settings**.
    >[!Note]
    >**Review + Start replication** will be greyed at this step.
1. In **Advanced settings**, select **Cache storage account**.
    >[!NOTE]
    >- Capacity reservation is disabled. 
    >- This flow proceeds with option1: Edge Zone to Region replication. 
    >- Select the Storage account associated with the vault from the dropdown.
