---
title: Manage zone redundant high availability - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to enable or disable zone redundant high availability in Azure Database for PostgreSQL - Flexible Server through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 06/07/2021
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

## Forced failover

Follow these steps to force failover your primary to the standby flexible server. This will immediately bring the primary down and triggers a failover to the standby server. This is useful for cases like testing the unplanned outage failover time for your workload.

1.	In the [Azure portal](https://portal.azure.com/), select your existing flexible server that has high availability feature already enabled.
2.	On the flexible server page, click High Availability from the front panel to open high availability page.
3.	Check the Primary availability zone and the Standby availability zone
4.	Click on Forced Failover to initiate the manual failover procedure. A pop up will inform you on the potential downtime until the failover is complete. Read the message and click Ok.
5.	A notification will show up mentioning that failover is in progress.
6.	Once failover to the standby server is complete, a notification will pop up.
7.	Check the new Primary availability zone and the Standby availability zone.
    
    :::image type="content" source="./media/how-to-manage-high-availability-portal/ha-forced-failover.png" alt-text="On-demand forced failover"::: 

>[!IMPORTANT] 
> * Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will also allow the new standby server to be fully established.
>
> * The overall end-to-end operation time as reported on the portal may be longer than the actual downtime experienced by the application. Please measure the downtime from the application perspective. 

## Planned failover

Follow these steps to perform a planned failover from your primary to the standby flexible server. This will first prepare the standby server and performs the failover. This provides the least downtime as this performs a graceful failover to the standby server for situations like after a failover event, you want to bring the primary back to the preferred availability zone.
1.	In the [Azure portal](https://portal.azure.com/), select your existing flexible server that has high availability feature already enabled.
2.	On the flexible server page, click High Availability from the front panel to open high availability page.
3.	Check the Primary availability zone and the Standby availability zone
4.	Click on Planned Failover to initiate the manual failover procedure. A pop up will inform you the process. Read the message and click Ok.
5.	A notification will show up mentioning that failover is in progress.
6.	Once failover to the standby server is complete, a notification will pop up.
7.	Check the new Primary availability zone and the Standby availability zone.
        :::image type="content" source="./media/how-to-manage-high-availability-portal/ha-planned-failover.png" alt-text="On-demand planned failover"::: 

>[!IMPORTANT] 
>
> * Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will also allow the new standby server to be fully established.
>
> * It is recommended to perform planned failover during low activity period.
>
> * The overall end-to-end operation time may be longer than the actual downtime experienced by the application. Please measure the downtime from the application perspective.


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
