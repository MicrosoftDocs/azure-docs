---
title: Compute and storage
titleSuffix: Supported compute and storage configurations on Azure Cosmos DB for MongoDB vCore
description: Supported compute and storage configurations for Azure Cosmos DB for MongoDB vCore clusters
author: niklarin
ms.author: nlarin
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/07/2024
---

# Compute and storage configurations for Azure Cosmos DB for MongoDB vCore clusters

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Compute resources are provided as vCores, which represent the logical CPU of
the underlying hardware. The storage size for provisioning refers to the
capacity available to the shards in your cluster. The storage is used for database files, temporary files, transaction logs, and the
database server logs. You can select the compute and storage settings independently. The selected compute and storage values apply to each shard in the cluster.

## Compute in Azure Cosmos DB for MongoDB vCore

The total amount of RAM in a single shard is based on the
selected number of vCores.

| Cluster tier | vCores        | One shard, GiB RAM |
|--------------|-------------- |--------------------|
| M25          | 2 (burstable) | 8                  |
| M30          | 2             | 8                  |
| M40          | 4             | 16                 |
| M50          | 8             | 32                 |
| M60          | 16            | 64                 |
| M80          | 32            | 128                |

## Storage in Azure Cosmos DB for MongoDB vCore

The total amount of storage you provision also defines the I/O capacity
available to each shard in the cluster.

| Storage size, GiB | Maximum IOPS |
|-------------------|--------------|
| 32                | 3,500†       |
| 64                | 3,500†       |
| 128               | 3,500†       |
| 256               | 3,500†       |
| 512               | 3,500†       |
| 1,024             | 5,000        |
| 2,048             | 7,500        |
| 4,096             | 7,500        |
| 8,192*            | 16,000       |
| 16,384*           | 18,000       |
| 32,768*           | 20,000       |

† Max IOPS with free disk bursting. Storage up to 512 GiB inclusive come with free disk bursting enabled.

\* Available in preview.

## Maximizing IOPS for your compute / storage configuration
Each *compute* configuration has an IOPS limit that depends on the number of vCores. Make sure you select compute configuration for your cluster to fully utilize IOPS in the selected storage.

| Storage size      | Storage IOPS, up to | Min compute tier | Min vCores |
|-------------------|---------------------|------------------|------------|
| Up to 0.5 TiB     | 3,500†              | M30              | 2 vCores   |
| 1 TiB             | 5,000               | M40              | 4 vCores   |
| 2 TiB             | 7,500               | M50              | 8 vCores   |
| 4 TiB             | 7,500               | M50              | 8 vCores   |
| 8 TiB             | 16,000              | M60              | 16 vCores  |
| 16 TiB            | 18,000              | M60              | 16 vCores  |
| 32 TiB            | 20,000              | M60              | 16 vCores  |

† Max IOPS with free disk bursting. Storage up to 512 GiB inclusive come with free disk bursting enabled.

For instance, if you need 8 TiB of storage per shard or more, make sure you select 16 vCores or more for the node's compute configuration. That selection would allow you to maximize IOPS usage provided by the selected storage.

## Considerations for compute and storage

### Working set and memory considerations

In Azure Cosmos DB for MongoDB vCore, *the working set* refers to the portion of your data that is frequently accessed and used by your applications. It includes both the data and the indexes that are regularly read or written to during the application's typical operations. The concept of a working set is important for performance optimization because MongoDB, like many databases, performs best when the working set fits in RAM.

To define and understand your MongoDB database working set, consider the following components:

1. **Frequently accessed data**: This data include documents that your application reads or updates regularly.
1. **Indexes**: Indexes that are used in query operations also form part of the working set because they need to be loaded into memory to ensure fast access.
1. **Application usage patterns**: Analyzing the usage patterns of your application can help identify which parts of your data are accessed most frequently.

By keeping the working set in RAM, you can minimize slower disk I/O operations, thereby improving the performance of your MongoDB database. If you find that your working set exceeds the available RAM, you might consider optimizing your data model, adding more RAM, or using sharding to distribute the data across multiple nodes.

### Choosing optimal configuration for a workload 

Determining the right compute and storage configuration for your Azure Cosmos DB for MongoDB vCore workload involves evaluating several factors related to your application's requirements and usage patterns. The key steps and considerations to determine the optimal configuration include:

1. **Understand your workload**
    - **Data volume**: Estimate the total size of your data, including indexes.
    - **Read/write ratio**: Determine the ratio of read operations to write operations.
    - **Query patterns**: Analyze the types of queries your application performs. For instance, simple reads, complex aggregations.
    - **Concurrency**: Assess the number of concurrent operations your database needs to handle.

2. **Monitor current performance**
    - **Resource utilization**: Use monitoring tools to track CPU, memory, disk I/O, and network usage before you move your workload to Azure and [monitoring metrics](./how-to-monitor-diagnostics-logs.md) once you start running your MongoDB workload on an Azure Cosmos DB for MongoDB vCore cluster.
    - **Performance metrics**: Monitor key performance metrics such as latency, throughput, and cache hit ratios.
    - **Bottlenecks**: Identify any existing performance bottlenecks, such as high CPU usage, memory pressure, or slow disk I/O.

3. **Estimate resource requirements**
    - **Memory**: Ensure that your [working set](#working-set-and-memory-considerations) (frequently accessed data and indexes) fits into RAM. If your working set size exceeds available memory, consider adding more RAM or optimizing your data model.
    - **CPU**: Choose a CPU configuration that can handle your query load and concurrency requirements. CPU-intensive workloads may require more cores. Use 'CPU percent' metric with 'Max' aggregation on your Azure Cosmos DB for MongoDB vCore cluster to see historical compute usage patterns.
    - **Storage IOPS**: Select storage with sufficient IOPS to handle your read and write operations. Use 'IOPS' metric with 'Max' aggregation on your cluster to see historical storage IOPS usage.
    - **Network**: Ensure adequate network bandwidth to handle data transfer between your application and the database, especially for distributed setups. Make sure you configured host for your MongoDB application to support [accelerated networking](../../../virtual-network/accelerated-networking-overview.md) technologies such as SR-IOV.

4. **Scale appropriately**
    - **Vertical scaling**: Scale compute / RAM up and down and scale storage up. 
        - Compute: Increase the vCore / RAM on a cluster if your workload requires temporary increase or is often crossing over 70% of CPU utilization for prolonged periods. 
        - Make sure you have appropriate data retention in your Azure Cosmos DB for MongoDB vCore database. Retention allows you to avoid unnecessary storage use. Monitor storage usage by setting alerts on the 'Storage percent' and/or 'Storage used' metrics with 'Max' aggregation. Consider increase storage as your workload size crosses 70% usage.
    - **Horizontal scaling**: Consider using multiple shards for your cluster  to distribute your data across multiple Azure Cosmos DB for MongoDB vCore nodes for performance gains and better capacity management as your workload grows. This is especially useful for large datasets (over 2-4 TiB) and high-throughput applications.

5. **Test and iterate**
    - **Benchmarking**: Perform measurement for the most frequently used queries with different configurations to determine the impact on performance. Use CPU/RAM and IOPS metrics and application-level benchmarking.
    - **Load testing**: Conduct load testing to simulate production workloads and validate the performance of your chosen configuration.
    - **Continuous monitoring**: Continuously monitor your Azure Cosmos DB for MongoDB vCore deployment and adjust resources as needed based on changing workloads and usage patterns.

By systematically evaluating these factors and continuously monitoring and adjusting your configuration, you can ensure that your MongoDB deployment is well-optimized for your specific workload.

### Considerations for storage

Deciding on the appropriate storage size for your workload involves several considerations to ensure optimal performance and scalability. Here are considerations for the storage size in Azure Cosmos DB for MongoDB vCore:

1. **Estimate data size:**
   - Calculate the expected size of your Azure Cosmos DB for MongoDB vCore data. Consider:
     - **Current data size:** If migrating from an existing database.
     - **Growth rate:** Estimate how much data will be added over time.
     - **Document size and structure:** Understand your data schema and document sizes, as they affect storage efficiency.

2. **Factor in indexes:**
   - Azure Cosmos DB for MongoDB vCore uses **[indexes](./indexing.md)** for efficient querying. Indexes consume extra disk space.
   - Estimate the size of indexes based on:
     - **Number of indexes**.
     - **Size of indexed fields**.

3. **Performance considerations:**
   - Disk performance impacts database operations, especially for workloads that can't fit their [working set](#working-set-and-memory-considerations) into RAM. Consider:
     - **I/O throughput:** IOPS, or Input/Output Operations Per Second, is the number of requests that are sent to storage disks in one second. The larger storage size comes with more IOPS. Ensure adequate throughput for read/write operations. Use 'IOPS' metric with 'Max' aggregation to monitor used IOPS on your cluster.
     - **Latency:** Latency is the time it takes an application to receive a single request, send it to storage disks, and send the response to the client. Latency is a critical measure of an application's performance in addition to IOPS and throughput. Latency is largely defined by the type of storage used and storage configuration. In a managed service like Azure Cosmos DB for MongoDB, the fast storage such as Premium SSD disks is used with settings optimized to reduce latency. 

4. **Future growth and scalability:**
   - Plan for future data growth and scalability needs.
   - Allocate more disk space beyond current needs to accommodate growth without frequent storage expansions.

5. **Example calculation**:
   - Suppose your initial data size is 500 GiB.
   - With indexes, it might grow to 700 GiB.
   - If you anticipate doubling the data in two years, plan for 1.4 TiB (700 GiB * 2).
   - Add a buffer for overhead, growth, and operational needs.
   - You might want to start with 1 TiB storage today and upscale it to 2 TiB once its size grows over 800 GiB.

Deciding on storage size involves a combination of estimating current and future data needs, considering indexing and compression, and ensuring adequate performance and scalability. Regular monitoring and adjustment based on actual usage and growth trends are also crucial to maintaining optimal MongoDB performance.

## Next steps

- [See more information about burstable compute](./burstable-tier.md)
- [Learn how to scale Azure Cosmos DB for MongoDB vCore cluster](./how-to-scale-cluster.md)
- [Check out indexing best practices](./how-to-create-indexes.md)

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
