---
title: Create Azure Cosmos containers and databases in autoscale provisioned throughput.
description: Learn about the benefits, use cases, and how to provision Azure Cosmos databases and containers in autoscale provisioned throughput.
author: kirillg
ms.author: kirillg
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/28/2020
---

# Create Azure Cosmos containers and databases with autoscale provisioned throughput

Azure Cosmos DB allows you to configure your containers with standard (manual) provisioned throughput or autoscale provisioned throughput. This article describes the benefits and use cases of autoscale.

> [!NOTE]
> You can [enable autoscale for new databases and containers](#create-db-container-autoscale) only. It is not available for existing containers and databases.

In addition to standard provisioning of throughput, you can now configure Azure Cosmos containers with autoscale provisioned throughput. Containers and databases configured in autoscale provisioned throughput will **automatically and instantly scale the provisioned throughput based on your application needs without impacting the availability, latency, throughput, or performance of the workload globally.**

When configuring containers and databases in autoscale, you need to specify the maximum throughput `Tmax` not to be exceeded. Containers can then scale their throughput so that `0.1*Tmax < T < Tmax`. In other words, containers and databases scale instantly based on the workload needs, from as low as 10% of the maximum throughput value that you have configured up to the configured maximum throughput value. After configuring autoscale, you can change the maximum throughput (`Tmax`) setting on a database or container at any point in time. With the autoscale option, the 400 RU/s minimum throughput per container or database is no longer applicable.

For the specified maximum throughput on the container or the database, the system allows operating within the calculated storage limit. If the storage limit is exceeded, then the maximum throughput is automatically adjusted to a higher value. When using database level throughput with autoscale, the number of containers allowed within a database is calculated as: `0.001*TMax`. For example, if you provision 20,000 autoscale RU/s, then the database can have 20 containers.

## <a id="autoscale-benefits"></a> Benefits of autoscale provisioned throughput

Azure Cosmos containers that are configured with autoscale have the following benefits:

* **Simple:** Containers with autoscale remove the complexity to manage provisioned throughput (RUs) and capacity manually for various containers.

* **Scalable:** Containers with autoscale seamlessly scale the provisioned throughput capacity as needed. There is no disruption to client connections, applications and they don’t impact any existing SLAs.

* **Cost-effective:** When you use containers configured with autoscale, you only pay for the resources that your workloads need on a per-hour basis.

* **Highly available:** Containers with autoscale use the same globally distributed, fault-tolerant, highly available backend to ensure data durability and high availability.

## <a id="autoscale-usecases"></a> Use cases of autoscale provisioned throughput

The use cases for Azure Cosmos containers configured with autoscale include:

* **Variable workloads:** When you are running a lightly used application with peak usage of 1 hour to several hours a few times each day or several times per year. Examples include applications for human resources, budgeting, and operational reporting. For such scenarios, containers configured with autoscale can be used, and you no longer need to manually provision for either peak or average capacity.

* **Unpredictable workloads:** When you are running workloads where there is database usage throughout the day, but also peaks of activity that are hard to predict. An example includes a traffic site that sees a surge of activity when weather forecast changes. Containers configured with autoscale adjust the capacity to meet the needs of the application's peak load and scale back down when the surge of activity is over.

* **New applications:** If you are deploying a new application and are unsure about how much provisioned throughput (i.e., how many RUs) you need. With containers configured with autoscale, you can automatically scale to the capacity needs and requirements of your application.

* **Infrequently used applications:** If you have an application that is only used for a few hours several times per day or week or month, such as a low-volume application/web/blog site.

* **Development and test databases:** If you have developers using containers during work hours but don't need them on nights or weekends. With containers configured with autoscale, they scale down to a minimum when not in use.

* **Scheduled production workloads/queries:** When you have a series of scheduled requests/operations/queries on a single container, and if there are idle periods where you want to run at an absolute low throughput, you can now do that easily. When a scheduled query/request is submitted to a container configured with autoscale, it will automatically scale up as much as needed and run the operation.

Solutions to the previous problems not only require an enormous amount of time in implementation, but they also introduce complexity in configuration or your code, and frequently require manual intervention to address them. Autoscale enables the above scenarios out of the box, so that you do not need to worry about these problems anymore.

## Comparison – standard (manual) Vs. autoscale provisioned throughput

|  | Containers configured with standard provisioned throughput  | Containers configured with autoscale provisioned throughput |
|---------|---------|---------|
| **Provisioned throughput** | Manually provisioned. | Automatically and instantaneously scaled based on the workload usage patterns. |
| **Rate-limiting of requests/operations (429)**  | May happen, if consumption exceeds provisioned capacity. | Will not happen if the throughput consumed is within the max throughput that you choose with autoscale.   |
| **Capacity planning** |  You have to do an initial capacity planning and provision of the throughput you need. |    You don’t have to worry about capacity planning. The system automatically takes care of capacity planning and capacity management. |
| **Pricing** | Manually provisioned RU/s per hour. | For single write region accounts, you pay for the throughput used on an hourly basis, by using the autoscale RU/s per hour rate. <br/><br/>For accounts with multiple write regions, there is no extra charge for autoscale. You pay for the throughput used on hourly basis using the same multi-master RU/s per hour rate. |
| **Best suited for workload types** |  Predictable and stable workloads|   Unpredictable and variable workloads  |

## <a id="create-db-container-autoscale"></a> Create a database or a container with autoscale

You can configure autoscale for new databases or containers when creating them through the Azure portal. Use the following steps to create a new database or container, enable autoscale, and specify the maximum throughput (RU/s).

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container.** Enter a name for your database, container, and a partition key. Under **Throughput**, select the **Autoscale** option, and choose the maximum throughput (RU/s) that the database or container cannot exceed when using the autoscale option.

   ![Creating a container and configuring autoscale throughput](./media/provision-throughput-autoscale/create-container-autoscale-mode.png)

1. Select **OK**.

You can create a shared throughput database with autoscale by selecting the **Provision database throughput** option.

## <a id="autoscale-limits"></a> Throughput and storage limits for autoscale

The following table shows the maximum throughout and storage limits for different options in autoscale:

|Maximum throughput limit  |Maximum storage limit  |
|---------|---------|
|4000 RU/s  |   50 GB    |
|20,000 RU/s  |  200 GB  |
|100,000 RU/s    |  1 TB   |
|500,000 RU/s    |  5 TB  |

## Next steps

* Review the [autoscale FAQ](autoscale-faq.md).
* Learn more about [logical partitions](partition-data.md).
* Learn how to [provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md).
* Learn how to [provision throughput on an Azure Cosmos database](how-to-provision-database-throughput.md).
