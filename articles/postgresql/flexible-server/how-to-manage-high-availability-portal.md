---
title: Manage high availability - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to enable or disable high availability in Azure Database for PostgreSQL - Flexible Server through the Azure portal.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 06/23/2022
---

# Manage high availability in Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article describes how you can enable or disable high availability configuration in your flexible server in both zone-redundant and same-zone deployment models.

High availability feature provisions physically separate primary and standby replica with the same zone or across zones depending on the deployment model. For more details, see [high availability concepts documentation](./concepts-high-availability.md). You may choose to enable high availability at the time of flexible server creation or after the creation.

This page provides guidelines how you can enable or disable high availability. This operation does not change your other settings including VNET configuration, firewall settings, and backup retention. Similarly, enabling and disabling of high availability is an online operation and does not impact your application connectivity and operations.

## Pre-requisites

> [!IMPORTANT]
> For the list of regions that support Zone redundant high availability, please review the supported regions [here](./overview.md#azure-regions).  

## Enable high availability during server creation

This section provides details specifically for HA-related fields. You can follow these steps to deploy high availability while creating your flexible server.

1.  In the [Azure portal](https://portal.azure.com/), choose Flexible Server and click create.  For details on how to fill details such as **Subscription**, **Resource group**, **server name**, **region**, and other fields, see how-to documentation for the server creation.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/subscription-region.png" alt-text="Screenshot of subscription and region selection.":::

2.  Choose your **availability zone**. This is useful if you want to collocate your application in the same availability zone as the database to reduce latency. Choose **No Preference** if you want the flexible server to deploy the primary server on any availability zone. Note that only if you choose the availability zone for the primary in a zone-redundant HA deployment, you will be allowed to choose the standby availability zone.

     :::image type="content" source="./media/how-to-manage-high-availability-portal/zone-selection.png" alt-text="Screenshot of availability zone selection.":::  

3.  Click the checkbox for **Enable high availability**. That will open up an option to choose high availability mode. If the region does not support AZs, then only same-zone mode is enabled.

    :::image type="content" source="./media/how-to-manage-high-availability-portal/choose-high-availability-deployment-model.png" alt-text="High availability checkbox and mode selection.":::

4.  If you chose the Availability zone in step 2 and if you chose zone-redundant HA, then you can choose the standby zone.
    :::image type="content" source="./media/how-to-manage-high-availability-portal/choose-standby-availability-zone.png" alt-text="Screenshot of Standby AZ selection.":::
 

5.  If you want to change the default compute and storage, click  **Configure server**.
 
    :::image type="content" source="./media/how-to-manage-high-availability-portal/configure-server.png" alt-text="Screenshot of configure compute and storage screen.":::  

6.  If high availability option is checked, the burstable tier will not be available to choose. You can choose either
    **General purpose** or **Memory Optimized** compute tiers. Then you can select **compute size** for your choice from the dropdown.

    :::image type="content" source="./media/how-to-manage-high-availability-portal/select-compute.png" alt-text="Compute tier selection screen.":::  


7.  Select **storage size** in GiB using the sliding bar and select the **backup retention period** between 7 days and 35 days.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/storage-backup.png" alt-text="Screenshot of Storage Backup."::: 

8. Click **Save**. 

## Enable high availability post server creation

Follow these steps to enable high availability for your existing flexible server.

1.  In the [Azure portal](https://portal.azure.com/), select your existing PostgreSQL flexible server.

2.  On the flexible server page, click **High Availability** from the left panel to open high availability page.
   
     :::image type="content" source="./media/how-to-manage-high-availability-portal/high-availability-left-panel.png" alt-text="Left panel selection screen."::: 

3.  Click on the **Enable high availability** checkbox to **enable** the option. It shows same zone HA and zone-redundant HA option. If you choose zone-redundant HA, you can choose the standby AZ.

     :::image type="content" source="./media/how-to-manage-high-availability-portal/enable-same-zone-high-availability-blade.png" alt-text="Screenshot to enable same zone high availability."::: 

      :::image type="content" source="./media/how-to-manage-high-availability-portal/enable-zone-redundant-high-availability-blade.png" alt-text="Screenshot to enable zone redundant high availability."::: 

4.  A confirmation dialog will show that states that by enabling high availability, your cost will increase due to additional server and storage deployment.

5.  Click **Enable HA** button to enable the high availability.

6.  A notification will show up stating the high availability deployment is in progress.

## Disable high availability

Follow these steps to disable high availability for your flexible server that is already configured with high availability.

1.  In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL - Flexible Server.

2.  On the flexible server page, click **High Availability** from the front panel to open high availability page.
   
    :::image type="content" source="./media/how-to-manage-high-availability-portal/high-availability-left-panel.png" alt-text="Left panel selection screenshot."::: 

3.  Click on the **High availability** checkbox to **disable** the option. Then click **Save** to save the change.

     :::image type="content" source="./media/how-to-manage-high-availability-portal/disable-high-availability.png" alt-text="Screenshot showing disable high availability."::: 

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
    
    :::image type="content" source="./media/how-to-manage-high-availability-portal/ha-forced-failover.png" alt-text="On-demand forced failover option screenshot."::: 

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
        :::image type="content" source="./media/how-to-manage-high-availability-portal/ha-planned-failover.png" alt-text="Screenshot of On-demand planned failover."::: 

>[!IMPORTANT] 
>
> * Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will also allow the new standby server to be fully established.
>
> * It is recommended to perform planned failover during low activity period.
>
> * The overall end-to-end operation time may be longer than the actual downtime experienced by the application. Please measure the downtime from the application perspective.

## Enabling Zone redundant HA after the region supports AZ

There are Azure regions that do not support availability zones. If you have already deployed non-HA servers, you cannot directly enable zone redundant HA on the server, but you can perform restore and enable HA in that server.  Following steps shows how to enable Zone redundant HA for that server.

1. From the overview page of the server, click **Restore** to [perform a PITR](how-to-restore-server-portal.md#restore-to-the-latest-restore-point). Choose **Latest restore point**. 
2. Choose a server name, availability zone.
3. Click **Review+Create**".
4. A new Flexible server will be created from the backup. 
5. Once the new server is created, from the overview page of the server, follow the [guide](#enable-high-availability-post-server-creation) to enable HA.
6. After data verification, you can optionally [delete](how-to-manage-server-portal.md#delete-a-server) the old server. 
7. Make sure your clients connection strings are modified to point to your new HA-enabled server.
   

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
