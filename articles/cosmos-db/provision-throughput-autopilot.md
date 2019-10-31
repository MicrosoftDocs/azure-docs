---
title: Create Azure Cosmos containers and databases with throughput in autopilot mode.
description: Learn about the benefits, use cases, and how to provision Azure Cosmos databases and containers in autopilot mode.
author: kirillg
ms.author: kirillg
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/04/2019
---

# Create Azure Cosmos containers and databases with provisioned throughput in autopilot mode (Preview)

Azure Cosmos DB allows you to provision throughput on your containers in either manual or autopilot mode. This article describes the benefits and use cases of autopilot mode.

> [!NOTE]
> Autopilot mode is currently available in public preview.

In addition to manual provisioning of throughput, you can now configure Azure cosmos containers in autopilot mode. Azure Cosmos containers and databases configured in autopilot mode will **automatically and instantly scale the provisioned throughput based on your application needs without compromising the SLAs.**

You no longer need to manually manage the provisioned throughput or handle rate-limiting issues. Azure Cosmos containers configured in autopilot mode can be scaled instantly in response to the workload without any impacting the availability, latency, throughput, or performance of the workload globally. Under high utilization, Azure Cosmos containers configured in autopilot mode can be scaled up or down without impacting the ongoing operations.

When configuring containers and databases in autopilot mode, you need to specify the maximum throughput `Tmax`  not to be exceeded. Containers can then scale instantly based on the workload needs within the `0.1*Tmax < T < Tmax` range. In other words, containers and databases scale instantly based on the workload needs, from as low as 10% of the configured throughput value, up to the specified maximum configured value. You can change the maximum throughput (Tmax) setting on autopilot database or container at any point in time.

## Benefits of autopilot mode

Azure Cosmos containers that are configured in autopilot mode have the following benefits:

* **Simple:** Containers in autopilot mode remove the complexity to manage provisioned throughput (RUs) and capacity manually for various containers.

* **Scalable:** Containers in autopilot mode seamlessly scale the provisioned throughput capacity as needed. There is no disruption to client connections, applications and they don’t impact any existing SLAs.

* **Cost-effective:** When you use Azure Cosmos containers configured in autopilot mode, you only pay for the resources that your workloads need on a per-hour basis.

* **Highly available:** Azure Cosmos containers in autopilot mode use the same globally distributed, fault-tolerant, highly available backend to ensure data durability, and high availability always.

## Use cases of autopilot mode

The use cases for Azure Cosmos containers configured in autopilot mode include:

* **Variable workloads:** When you are running a lightly used application with peak usage of 1 hour to several hours few times each day, or several times per year. Examples include applications for human resources, budgeting, and operational reporting. For such scenarios, containers configured in autopilot mode can be used, you no longer need to manually provision for either peak or average capacity.

* **Unpredictable workloads:** When you are running workloads where there is database usage throughout the day, but also peaks of activity that are hard to predict. An example includes a traffic site that sees a surge of activity when weather forecast changes. Containers configured in autopilot mode adjust the capacity to meet the needs of the application's peak load and scale back down when the surge of activity is over.

* **New applications:** If you are deploying a new application and are unsure about how much provisioned throughput (i.e., how many RUs) you need. With containers configured in autopilot mode, you can automatically scale to the capacity needs and requirements of your application.

* **Infrequently used applications:** If you have an application that is only used for a few hours several times per day or week or month, such as a low-volume application/web/blog site.

* **Development and test databases:** Developers use the Azure Cosmos accounts during work hours but don't need them on nights or weekends. With containers configured in autopilot mode, they scale down to minimum when not in use.

* **Scheduled production workloads/queries:** When you have a series of scheduled requests/operations/queries on a single container, and if there are idle periods where you want to run at an absolute low throughput, you can now do that easily. When a scheduled query/request is submitted to a container configured in autopilot mode, it will automatically scale up as much as needed and run the operation.

Solutions to the previous problems not only require an enormous amount of time in implementation, but they also introduce complexity in configuration or your code, and frequently require manual intervention to address them. The autopilot mode enables above scenarios out of the box, so that you do not need to worry about these problems anymore.

## Comparison – Containers configured in manual mode vs. autopilot mode

|  | Containers configured in manual mode  | Containers configured in autopilot mode |
|---------|---------|---------|
| **Provisioned throughput** | Manually provisioned | Proactively and reactively scaled based on the workload usage patterns. |
| **Rate-limiting of requests/operations (429)**  | May happen, if consumption exceeds provisioned capacity. | Will not happen.  |
| **Capacity planning** |  You have to do an initial capacity planning and provision of the throughput you need. |    You don’t have to worry about capacity planning. The system automatically takes care of capacity planning and capacity management. |
| **Pricing** | Manually provisioned RU/s per hour. | For single write region accounts, you pay for the throughput used on an hourly basis, by using the autopilot RU/s per hour rate. <br/><br/>For accounts with multiple write regions, there is no extra charge for autopilot. You pay for the throughput used on hourly basis using the same multi-master RU/s per hour rate. |
| **Best suited for workload types** |  Predictable and stable workloads|   Unpredictable and variable workloads  |

## Create a database or a container with autopilot mode

You can configure autopilot for databases or containers while creating them. Use the following steps to a new database or container, enable autopilot, and specify the maximum throughput.

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos account and open the **Data Explorer** tab.

1. Select **New Database**, enter a name for your database. For **Autopilot** option, choose **Enabled** and specify the maximum throughput that the database cannot exceed when using the autopilot option.

   ![Create a database in autopilot mode](./media/provision-throughput-autopilot/create-database-autopilot-mode.png)

1. Select **OK**

With similar steps, you can also create a container with provisioned throughput in autopilot mode.

## Next steps

* Learn more about [logical partitions](partition-data.md).
* Learn how to [provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md).
* Learn how to [provision throughput on an Azure Cosmos database](how-to-provision-database-throughput.md).