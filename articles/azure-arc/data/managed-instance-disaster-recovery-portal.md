---
title: Disaster recovery - Azure Arc-enabled SQL Managed Instance - portal
description: Describes how to configure disaster recovery for Azure Arc-enabled SQL Managed Instance in the portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 08/02/2023
ms.topic: conceptual
---

# Configure failover group - portal

This article explains how to configure disaster recovery for Azure Arc-enabled SQL Managed Instance with Azure portal. Before you proceed, review the information and prerequisites in [Azure Arc-enabled SQL Managed Instance - disaster recovery](managed-instance-disaster-recovery.md).

[!INCLUDE [failover-group-prerequisites](includes/failover-group-prerequisites.md)]

To configure disaster recovery through Azure portal, the Azure Arc-enabled data service requires direct connectivity to Azure.

## Configure Azure failover group

1. In the portal, go to your primary availability group.
1. Under **Data Management**, select **Failover Groups**.

    Azure portal presents **Create instance failover group**. 

    :::image type="content" source="media/managed-instance-disaster-recovery-portal/create-failover-group.png" alt-text="Screenshot of the Azure portal create instance failover group control.":::

1. Provide the information to define the failover group.

   * **Primary mirroring URL**: The mirroring endpoint for the failover group instance.
   * **Resource group**: The resource group for the failover group instance.
   * **Secondary managed instance**: The Azure SQL Managed Instance at the DR location.
   * **Synchronization mode**: Select either *Sync* for synchronous mode, or *Async* for asynchronous mode.
   * **Instance failover group name**: The name of the failover group.
  
1. Select **Create**.

Azure portal begins to provision the instance failover group.

## View failover group

After the failover group is provisioned, you can view it in Azure portal.

:::image type="content" source="media/managed-instance-disaster-recovery-portal/failover-group-overview.png" alt-text="Screenshot of Azure portal failover group.":::

## Failover

In the disaster recovery configuration, only one of the instances in the failover group is primary. You can fail over from the portal to migrate the primary role to the other instance in your failover group. To fail over:

1. In portal, locate your managed instance.
1. Under **Data Management** select **Failover Groups**.
1. Select **Failover**.

Monitor failover progress in Azure portal.

## Set synchronization mode

To set the synchronization mode:

1. From **Failover Groups**, select **Edit configuration**. 

   Azure portal shows an **Edit Configuration** control.

   :::image type="content" source="media/managed-instance-disaster-recovery-portal/edit-synchronization.png" alt-text="Screenshot of the Edit Configuration control.":::

1. Under **Edit configuration**, select your desired mode, and select **Apply**.

## Monitor failover group status in the portal

After you use the portal to change a failover group, the portal automatically reports the status as the change is applied. Changes that the portal reports include:

- Add failover group
- Edit failover group configuration
- Start failover
- Delete failover group

After you initiate the change, the portal automatically refreshes the status every two minutes. The portal automatically refreshes for two minutes. 

## Delete failover group

1. From Failover Groups**, select **Delete Failover Group**.

   Azure portal asks you to confirm your choice to delete the failover group.

1. Select **Delete failover group** to proceed. Otherwise select **Cancel**, to not delete the group.


## Next steps

- [Overview: Azure Arc-enabled SQL Managed Instance business continuity](managed-instance-business-continuity-overview.md)
- [Configure failover group - CLI](managed-instance-disaster-recovery-cli.md)
