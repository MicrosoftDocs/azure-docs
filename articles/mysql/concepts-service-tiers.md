---
title: "Pricing Tiers in Azure Database for MySQL | Microsoft Docs"
description: "Pricing Tiers in Azure Database for MySQL"
services: mysql
author: seanli1988
ms.author: seal
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 10/10/2017
---
# Azure Database for MySQL options and performance: Understand what’s available in each pricing tier
When you create an Azure Database for MySQL server, you decide upon three main choices to configure the resources allocated for that server. These choices impact the performance and scale of the server.
- Pricing tier
- vCore
- Storage (GB)

Each pricing tier has a range of performance levels (vCores) to choose from, depending on your workloads requirements. Higher performance levels provide additional resources for your server designed to deliver higher throughput. You can change the server's performance level within a pricing tier with virtually no application downtime.


Within an Azure Database for MySQL server, you can have one or multiple databases. You can opt to create a single database per server to utilize all the resources, or create multiple databases to share the resources. 

## Choose a pricing tier
Azure Database for MySQL offers Three pricing tiers: Basic, General Purpose and Memory Optimized.

The following table provides examples of the pricing tiers best suited for different application workloads.

| Pricing tier | Target workloads |
| :----------- | :----------------|
| Basic | Best suited for small workloads that require scalable compute and storage without IOPS guarantee. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| General Purpose | The go-to option for most business workloads offering balanced and scalable compute and storage options.|
| Memory Optimized | Ideal for highly transactional and analytical workloads that requires higher memory usage.|

To decide on a pricing tier, first start by determining if your workload needs an IOPS guarantee. We offer 3 IOPS per GB in the General Purpose and Memory Optimized tiers.

| **Pricing tier features** | **Basic** | **General Purpose** | **Memory Optimized** |
| :------------------------ | :-------- | :----------- | :----------- |
| Storage IOPS guarantee | NO | Yes | Yes |   
| Maximum storage IOPS | Variable | 6,000 | 6,000 |  


For the time being, you cannot change pricing tier once the server is created. In the future, it will be possible to upgrade or downgrade a server from one pricing tier to another tier.

## Understand the price
When you create a new Azure Database for MySQL inside the [Azure Portal](https://portal.azure.com/#create/Microsoft.MySQLServer), click the **Pricing tier** tab, and the monthly cost will be shown based on the options you have selected. If you do not have an Azure subscription, use the Azure pricing calculator to get an estimated price. Visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, then click **Add items**, expand the **Databases** category, and choose **Azure Database for MySQL** to customize the options.

## Choose a performance level (vCores)
Once you have determined the pricing tier for your Azure Database for MySQL server, you are ready to determine the performance level by selecting the number of vCores needed. A good starting point is 200 or 400 vCores for applications that require higher user concurrency for their web or analytical workloads, and adjust incrementally as needed. 

vCores are a measure of CPU processing throughput that is guaranteed to be available to a single Azure Database for MySQL server. For more information, see [Explaining vCores](concepts-compute-unit-and-storage.md)


| **Performance level** | **Basic** | **General Purpose** | **Memory Optimized** |
| :-------------------- | :----- | :------ |:----- | :------ | :------ |
| vCores | 1,2 | 2,4,8,16,32 |2,4,8,16,32 |
| Max Storage Size | 50 GB |1 TB | 1 TB | 
| Storage Type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage | 
| Database backup retention period | 7 days | 35 days | 35 days |  


\* Max storage size refers to the maximum usable provisioned storage size for your server. Log usage does not count toward the storage size.

## Storage 
The storage configuration defines the amount of storage capacity available to an Azure Database for MySQL server. The storage used by the service includes the database files, transaction logs, and the MySQL server logs. Consider the size of storage needed to host your databases and the performance requirements (IOPS) when selecting the storage configuration.

Some storage capacity is included at a minimum with each pricing tier, noted in the preceding table as "Included storage size." Additional storage capacity can be added when the server is created, in increments of 1 GB, up to the maximum allowed storage. The additional storage capacity can be configured independently of the vCores configuration. The price changes based on the amount of storage selected.

The IOPS configuration in each performance level relates to the pricing tier and the storage size chosen. Basic tier does not provide an IOPS guarantee. Within the Standard pricing tier, the IOPS scale proportionally to maximum storage size in a fixed 3:1 ratio. The included storage of 125 GB guarantees for 375 provisioned IOPS, each with an IO size of up to 256 KB. You can choose additional storage up to 1 TB maximum, to guarantee 6,000 provisioned IOPS.

Monitor the Metrics graph in the Azure portal or write Azure CLI commands to measure the consumption of storage and IOPS. Relevant metrics to monitor are Storage limit, Storage percentage, Storage used, and IO percent.


## Scaling a server up or down
You initially choose the pricing tier and performance level when you create your Azure Database for MySQL. Later, you can scale the vCores up or down dynamically, within the range of the same pricing tier. In the Azure portal, slide the vCores on the server's Pricing tier blade, or script it by following this example: [Monitor and scale an Azure Database for MySQL server using Azure CLI](scripts/sample-scale-server.md)

Scaling the vCores is done independently of the maximum storage size you have chosen.

Behind the scenes, changing the performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process. During the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.

The duration of the entire scale process depends on both the size and pricing tier of the server before and after the change. For example, a server that is changing vCores within the Standard pricing tier, should complete within few minutes. The new properties for the server are not applied until the changes are complete.

## Next Steps
- For more on vCores, see [Explaining vCores](concepts-compute-unit-and-storage.md)
- Learn how to [Monitor and scale an Azure Database for MySQL server using Azure CLI](scripts/sample-scale-server.md)
