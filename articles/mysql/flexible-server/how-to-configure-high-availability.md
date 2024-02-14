---
title: Manage zone redundant high availability - Azure portal
description: This article describes how to enable or disable zone redundant high availability in Azure Database for MySQL - Flexible Server through the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.custom: references_regions
ms.date: 05/24/2022
---

# Manage zone redundant high availability in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes how you can enable or disable zone redundant high availability configuration in Azure Database for MySQL flexible server.

High availability feature provisions physically separate primary and standby replica in different zones. For more information, see the [high availability concepts documentation](./concepts/../concepts-high-availability.md).

> [!IMPORTANT]
> You can enable zone redundant high availability only during Azure Database for MySQL flexible server instance creation.

This page provides guidelines how you can enable or disable high availability. This operation doesn't change your other settings including VNET configuration, firewall settings, and backup retention. Similarly, disabling of high availability is an online operation and doesn't impact your application connectivity and operations.

> [!IMPORTANT]
> Zone redundant high availability is available in a limited set of regions: Southeast Asia, WestUS 2, West Europe, and East US.

## Enable high availability during server creation

This section provides details specifically for HA-related fields. You can follow these steps to deploy high availability while creating your Azure Database for MySQL flexible server instance.

1. In the [Azure portal](https://portal.azure.com/), choose flexible Server and Select **Create**.  For information about how to fill in details such as **Subscription**, **Resource group**, **Server name**, **Region**, and other fields, see the how-to documentation for Azure Database for MySQL flexible server instance creation.

2. Select the checkbox for **Zone redundant high availability** in the Availability option.

3. If you want to change the default compute and storage, select  **Configure server**.

4. If the high availability option is checked, the burstable tier isn't available to choose. You can choose either
    **General purpose** or **Business Critical** compute tiers.

    > [!IMPORTANT]
    > We only support zone redundant high availability for the ***General purpose*** and ***Business Critical*** pricing tiers.

5. Select the **Compute size** for your choice from the dropdown.

6. Select **Storage size** in GiB using the sliding bar and select the **Backup retention period** between 7 days and 35 days.   

## Disable high availability

Follow these steps to disable high availability for your Azure Database for MySQL flexible server instance that is already configured with zone redundancy.

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL flexible server instance.

2. On the Azure Database for MySQL flexible server instance page, select **High Availability** from the front panel to open the high availability page.

3. Select the **zone redundant high availability** checkbox to disable the option and select **Save** to save the change.

4. A confirmation dialog appears where you can confirm disabling HA. Select **Disable HA** button to disable high availability.

6. A notification states that the high availability decommissioning deployment is in progress.

## Forced failover

Follow these steps to force failover from your primary to a standby Azure Database for MySQL flexible server instance.

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL flexible server instance that has the high availability feature enabled.

2. On the Azure Database for MySQL flexible server instance page, select **High Availability** from the front panel to open the high availability page.

3. Check the **Primary availability zone** and the **Standby availability zone**.

4. Select **Forced Failover** to initiate the manual failover procedure. A popup informs you of the expected failover time depending on the current workload on the primary and the recency of the last checkpoint. Read the message and select **OK**.

5. A notification states that failover is in progress. Once failover to the standby server is successful, a notification pops up.

7. Check the new **Primary availability zone** and the **Standby availability zone**.

![How to force failover.](media/how-to-configure-high-availability/how-to-forced-failover.png)

## Next steps

- Learn about [business continuity](./concepts-business-continuity.md)
- Learn about [zone redundant high availability](./concepts-high-availability.md)
