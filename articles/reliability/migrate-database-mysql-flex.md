---
title: Migrate Azure Database for MySQL – Flexible Server to availability zone support 
description: Learn how to migrate your Azure Database for MySQL – Flexible Server to availability zone support.
author: VandhanaMehta
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 12/13/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate MySQL – Flexible Server to availability zone support

This guide describes how to migrate MySQL – Flexible Server from non-availability zone support to availability zone support.

You can configure Azure Database for MySQL Flexible Server to use one of two high availability (HA) architectural models:

- **Same-zone HA architecture (zonal).** This option is preferred for infrastructure redundancy with lower network latency because the primary and standby servers will be in the same availability zone. It provides high availability without the need to configure application redundancy across zones. Same-zone HA is preferred when you want to achieve the highest level of availability within a single availability zone with the lowest network latency. Same-zone HA is available in all Azure regions where you can use Azure Database for MySQL - Flexible Server. To learn more about same-zone HA architecture, see [Same-zone HA architecture](../mysql/flexible-server/concepts-high-availability.md#same-zone-ha-architecture).

- **Zone-redundant HA architecture.** This option is preferred for complete isolation and redundancy of infrastructure across multiple availability zones. It provides the highest level of availability, but it requires you to configure application redundancy across zones. Zone-redundant HA is preferred when you want to achieve the highest level of availability against any infrastructure failure in the availability zone and when latency across the availability zone is acceptable. It can be enabled only when the server is created. Zone-redundant HA is available in a [subset of Azure regions](../mysql/flexible-server/overview.md#azure-regions) where the region supports multiple availability zones and [zone-redundant Premium file shares](../storage/common/storage-redundancy.md#zone-redundant-storage) are available. To learn more about zone-redundant HA architecture, see [Zone-redundant HA architecture](../mysql/flexible-server/concepts-high-availability.md#zone-redundant-ha-architecture).

To migrate your existing workload from zonal (same-zone HA) to zone-redundant HA, you'll need to do the following:

1. Deploy and configure a new server that's been configured for zone-redundant HA.

1. Follow the migration guidance in this document to move your resources to your new server. 


## Prerequisites

**To migrate to availability-zone support:**

1. You'll need at least one of the following two servers:

     - A source server that's running Azure Database for MySQL Flexible Server in a region that doesn’t support availability zones.

     - An Azure Database for MySQL Flexible Server that wasn't enabled for HA at the time of create.  

    >[!IMPORTANT]
    > If you've originally provisioned your Azure Database for MySQL Flexible Server as a non-HA server, you can simply enable it for same-zone HA architecture. However, if you want to enable it for zone-redundant HA architecture, then you'll need to implement one of the available migration options listed in this article.
    
2.	You'll need to create a target server that's running Azure Database for MySQL Flexible Server [in a region that supports availability zones](../mysql/flexible-server/overview.md#azure-regions). For more information on how to create an Azure Database for MySQL Flexible Server, see [Use the Azure portal to create an Azure Database for MySQL Flexible Server](../mysql/flexible-server/quickstart-create-server-portal.md). Make sure that the created server is configured for zone redundancy by enabling HA and selecting the *Zone-Redundant* option.

>[!TIP]
> If you want the flexibility of being able to move between zonal (same-zone) and zone-redundant HA in the future, you can provision your Azure Database for MySQL Flexible Server with zone-redundant HA enabled during server create. Once the server is provisioned, you can then disable HA.



## Downtime requirements

Migrations can be categorized as either online or offline:

•	**Offline migration**.  If your application can afford some downtime, offline migrations are always the preferred choice, as they're simple and easy to execute. With an offline migration, the source server is taken offline, and a dump and restores of the databases are performed on the target server. This option will require the most downtime. The duration of the downtime is determined by the time it takes to perform the restoration on the target server.

•	**Online migration**.  This option has minimal downtime and is the best choice if you want less downtime. The source server allows updates, and the migration solution will take care of replicating the ongoing changes between the source and target server along with the initial dump and restore on the target.

## Migration Option 1: Offline Migration

You can migrate from one Azure Database for Flexible Server to another by using one of the following tools. Both of these options will require downtime.

1. **Data Migration Service (DMS).** To learn how to migrate MySQL Flexible Server to another with DMS, see [Migrate Azure Database for MySQL - Single Server to Flexible Server offline using DMS via the Azure portal](../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md). Although the tutorial outlines steps for migrating from Azure MySQL Single Server to Flexible Server, you can use the same procedure for migrating data from one Azure Database for MySQL Flexible Server that doesn’t support availability zones to another that supports availability zones.

2. **Open-source tools**. You can migrate offline with open-source tools, such as **MySQL Workbench**, **mydumper/myloader**, or **mysqldump** to backup and restore the database. For information on how to use these tools, see [Options for migrating Azure Database for  MySQL - Single Server to Flexible Server](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/options-for-migrating-azure-database-for-mysql-single-server-to/ba-p/2674062). Although the tutorial outlines steps for migrating from Azure MySQL Single Server to Flexible Server, you can use the same procedure for migrating data from one Azure Database for MySQL Flexible Server that doesn’t support availability zones to another that supports availability zones.

## Migration Option 2: Online Migration

You can migrate from one Azure Database for Flexible Server to another with minimum downtime to your applications by using one of the following tools:

1. **Data Migration Service (DMS).** To learn how to migrate MySQL Flexible Server to another with DMS, see [Migrate Azure Database for MySQL - Single Server to Flexible Server online using DMS via the Azure portal](../dms/tutorial-mysql-azure-single-to-flex-online-portal.md). Although the tutorial outlines steps for migrating from Azure MySQL Single Server to Flexible Server, you can use the same procedure for migrating data from one Azure Database for MySQL Flexible Server that doesn’t support availability zones to another that supports availability zones.

2. **Open-source tools.** You can use a combination of open-source tools such as **mydumper/myloader** together with **Data-in replication**. To learn how to set up Data-in Replication, see [How to configure Azure Database for MySQL Data-in Replication](../mysql/single-server/how-to-data-in-replication.md). 

>[!IMPORTANT]
>Data-in Replication isn't supported for HA-enabled servers. The workaround is to provision the target server with zone-redundant HA first and then disable HA before configuring Data-in Replication. Once the replication completes, enable zone-redundant HA once again on the target server.


## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [Overview of business continuity with Azure Database for MySQL - Flexible Server](../mysql/flexible-server/concepts-business-continuity.md)

> [!div class="nextstepaction"]
> [High availability concepts in Azure Database for MySQL Flexible Server](../mysql/flexible-server/concepts-high-availability.md)

