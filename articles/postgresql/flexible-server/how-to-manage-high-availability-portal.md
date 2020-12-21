---
title: Manage zone redundant high availability - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to enable or disable zone redundant high availability in Azure Database for PostgreSQL - Flexible Server through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 09/22/2020
---

# Manage zone redundant high availability in Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

This article describes how you can enable or disable zone redundant high availability configuration in your flexible server.

High availability feature provisions physically separate primary and standby replica in different zones. For more details, see [high availability concepts documentation](./concepts-high-availability.md). You may choose to enable high availability at the time of flexible server creation or after the creation. 
This page provides guidelines how you can enable or disable high availability. This operation does not change your other settings including VNET configuration, firewall settings, and backup retention. Similarly, enabling and disabling of high availability is an online operation and does not impact your application connectivity and operations.

## Pre-requisites

Zone redundant high availability is available only in regions where multiple zones are supported. 

## Enable high availability during server creation

This section provides details specifically for HA-related fields. You can follow these steps to deploy high availability while creating your flexible server.

1.  In the [Azure portal](https://portal.azure.com/), choose Flexible Server and click create.  For details on how to fill details such as **Subscription**, **Resource group**, **server name**, **region**, and other fields, see how-to documentation for the server creation.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/subscription-region.png" alt-text="View subscription and region":::

2.  Choose your **availability zone**. This is useful if you want to collocate your application in the same availability zone as the database to reduce latency. Choose **No Preference** if you want the flexible server to deploy on any availability zone.
    ![AZ selection]()
     :::image type="content" source="./media/how-to-manage-high-availability-portal/zone-selection.png" alt-text="Availability zone selection":::  

3.  Click the checkbox for **Zone redundant high availability** in the Availability option.

    :::image type="content" source="./media/how-to-manage-high-availability-portal/high-availability-checkbox.png" alt-text="High availability checkbox":::

4.  If you want to change the default compute and storage, click  **Configure server**.
 
    :::image type="content" source="./media/how-to-manage-high-availability-portal/configure-server.png" alt-text="configure server - compute+storage":::  

5.  If high availability option is checked, the burstable tier will not be available to choose. You can choose either
    **General purpose** or **Memory Optimized** compute tiers. Then you can select **compute size** for your choice from the dropdown.

    :::image type="content" source="./media/how-to-manage-high-availability-portal/select-compute.png" alt-text="Compute tier selection":::  


6.  Select **storage size** in GiB using the sliding bar and select the **backup retention period** between 7 days and 35 days.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/storage-backup.png" alt-text="Storage Backup"::: 

7. Click **Save**. 

## Enable high availability post server creation

Follow these steps to enable high availability for your existing flexible server.

1.  In the [Azure portal](https://portal.azure.com/), select your existing PostgreSQL flexible server.

2.  On the flexible server page, click **High Availability** from the left panel to open high availability page.
   
     :::image type="content" source="./media/how-to-manage-high-availability-portal/high-availability-left-panel.png" alt-text="Left panel selection"::: 

3.  Click on the **zone redundant high availability** checkbox to **enable** the option and click **Save** to save the change.

     :::image type="content" source="./media/how-to-manage-high-availability-portal/enable-high-availability.png" alt-text="Enable high availability"::: 

4.  A confirmation dialog will show that states that by enabling high availability, your cost will increase due to additional server and
    storage deployment.

5.  Click **Enable HA** button to enable the high availability.

6.  A notification will show up stating the high availability deployment is in progress.

## Disable high availability

Follow these steps to disable high availability for your flexible server
that is already configured with zone redundancy.

1.  In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL - Flexible Server.

2.  On the flexible server page, click **High Availability** from the front panel to open high availability page.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/high-availability-left-panel.png" alt-text="Left panel selection"::: 

3.  Click on the **zone redundant high availability** checkbox to **disable** the option. Then click **Save** to save the change.

     :::image type="content" source="./media/how-to-manage-high-availability-portal/disable-high-availability.png" alt-text="Disable high availability"::: 

4.  A confirmation dialog will be shown where you can confirm disabling high availability.

5.  Click **Disable HA** button to disable the high availability.

6.  A notification will show up decommissioning of the high availability deployment is in progress.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
