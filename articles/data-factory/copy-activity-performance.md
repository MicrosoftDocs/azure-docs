---
title: Copy activity performance and scalability guide
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about key factors that affect the performance of data movement in Azure Data Factory and Azure Synapse Analytics pipelines when you use the copy activity.
services: data-factory
documentationcenter: ''
ms.author: jianleishen
author: jianleishen
manager: shwang
ms.service: data-factory
ms.subservice: data-movement
ms.workload: data-services
ms.topic: conceptual
ms.custom: synapse, contperf-fy22q2
ms.date: 10/20/2023
---
# Copy activity performance and scalability guide


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Sometimes you want to perform a large-scale data migration from data lake or enterprise data warehouse (EDW), to Azure. Other times you want to ingest large amounts of data, from different sources into Azure, for big data analytics. In each case, it is critical to achieve optimal performance and scalability.

Azure Data Factory and Azure Synapse Analytics pipelines provide a mechanism to ingest data, with the following advantages:

* Handles large amounts of data
* Is highly performant
* Is cost-effective

These advantages are an excellent fit for data engineers who want to build scalable data ingestion pipelines that are highly performant.

After reading this article, you will be able to answer the following questions:

* What level of performance and scalability can I achieve using copy activity for data migration and data ingestion scenarios?
* What steps should I take to tune the performance of the copy activity?
* What performance optimizations can I utilize for a single copy activity run?
* What other external factors to consider when optimizing copy performance?

> [!NOTE]
> If you aren't familiar with the copy activity in general, see the [copy activity overview](copy-activity-overview.md) before you read this article.

## Copy performance and scalability achievable using Azure Data Factory and Synapse pipelines

Azure Data Factory and Synapse pipelines offer a serverless architecture that allows parallelism at different levels.

This architecture allows you to develop pipelines that maximize data movement throughput for your environment. These pipelines fully utilize the following resources:

* Network bandwidth between the source and destination data stores
* Source or destination data store input/output operations per second (IOPS) and bandwidth

This full utilization means you can estimate the overall throughput by measuring the minimum throughput available with the following resources:

* Source data store
* Destination data store
* Network bandwidth in between the source and destination data stores

The table below shows the calculation of data movement duration. The duration in each cell is calculated based on a given network and data store bandwidth and a given data payload size.

> [!NOTE]
> The duration provided below are meant to represent achievable performance in an end-to-end data integration solution by using one or more performance optimization techniques described in [Copy performance optimization features](#copy-performance-optimization-features), including using ForEach to partition and spawn off multiple concurrent copy activities. We recommend you to follow steps laid out in [Performance tuning steps](#performance-tuning-steps) to optimize copy performance for your specific dataset and system configuration. You should use the numbers obtained in your performance tuning tests for production deployment planning, capacity planning, and billing projection.

&nbsp;

| Data size / <br/> bandwidth | 50 Mbps    | 100 Mbps  | 500 Mbps  | 1 Gbps   | 5 Gbps   | 10 Gbps  | 50 Gbps   |
| --------------------------- | ---------- | --------- | --------- | -------- | -------- | -------- | --------- |
| **1 GB**                    | 2.7 min    | 1.4 min   | 0.3 min   | 0.1 min  | 0.03 min | 0.01 min | 0.0 min   |
| **10 GB**                   | 27.3 min   | 13.7 min  | 2.7 min   | 1.3 min  | 0.3 min  | 0.1 min  | 0.03 min  |
| **100 GB**                  | 4.6 hrs    | 2.3 hrs   | 0.5 hrs   | 0.2 hrs  | 0.05 hrs | 0.02 hrs | 0.0 hrs   |
| **1 TB**                    | 46.6 hrs   | 23.3 hrs  | 4.7 hrs   | 2.3 hrs  | 0.5 hrs  | 0.2 hrs  | 0.05 hrs  |
| **10 TB**                   | 19.4 days  | 9.7 days  | 1.9 days  | 0.9 days | 0.2 days | 0.1 days | 0.02 days |
| **100 TB**                  | 194.2 days | 97.1 days | 19.4 days | 9.7 days | 1.9 days | 1 day    | 0.2 days  |
| **1 PB**                    | 64.7 mo    | 32.4 mo   | 6.5 mo    | 3.2 mo   | 0.6 mo   | 0.3 mo   | 0.06 mo   |
| **10 PB**                   | 647.3 mo   | 323.6 mo  | 64.7 mo   | 31.6 mo  | 6.5 mo   | 3.2 mo   | 0.6 mo    |
| | |  | | |  | | |

Copy is scalable at different levels:

:::image type="content" source="media/copy-activity-performance/adf-copy-scalability.png" alt-text="How copy scales":::

* Control flow can start multiple copy activities in parallel, for example using [For Each loop](control-flow-for-each-activity.md).

* A single copy activity can take advantage of scalable compute resources.
  * When using Azure integration runtime (IR), you can specify [up to 256 data integration units (DIUs)](#data-integration-units) for each copy activity, in a serverless manner.
  * When using self-hosted IR, you can take either of the following approaches:
    * Manually scale up the machine.
    * Scale out to multiple machines ([up to 4 nodes](create-self-hosted-integration-runtime.md#high-availability-and-scalability)), and a single copy activity will partition its file set across all nodes.

* A single copy activity reads from and writes to the data store using multiple threads [in parallel](#parallel-copy).

## Performance tuning steps

Take the following steps to tune the performance of your service with the copy activity:

1. **Pick up a test dataset and establish a baseline.**

    During development, test your pipeline by using the copy activity against a representative data sample. The dataset you choose should represent your typical data patterns along the following attributes:

    * Folder structure
    * File pattern
    * Data schema

    And your dataset should be big enough to evaluate copy performance. A good size takes at least 10 minutes for copy activity to complete. Collect execution details and performance characteristics following [copy activity monitoring](copy-activity-monitoring.md).

2. **How to maximize performance of a single copy activity**:

    We recommend you to first maximize performance using a single copy activity.

    * **If the copy activity is being executed on an _Azure_ integration runtime:**

        Start with default values for [Data Integration Units (DIU)](#data-integration-units) and [parallel copy](#parallel-copy) settings.

    * **If the copy activity is being executed on a _self-hosted_ integration runtime:**

        We recommend that you use a dedicated machine to host IR. The machine should be separate from the server hosting the data store. Start with default values for [parallel copy](#parallel-copy) setting and using a single node for the self-hosted IR.

    Conduct a performance test run. Take a note of the performance achieved. Include the actual values used, such as DIUs and parallel copies. Refer to [copy activity monitoring](copy-activity-monitoring.md) on how to collect run results and performance settings used. Learn how to [troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md) to identify and resolve the bottleneck.

    Iterate to conduct additional performance test runs following the troubleshooting and tuning guidance. Once single copy activity runs cannot achieve better throughput, consider whether to maximize aggregate throughput by running multiple copies concurrently. This option is discussed in the next numbered bullet.

3. **How to maximize aggregate throughput by running multiple copies concurrently:**

    By now you have maximized the performance of a single copy activity. If you have not yet achieved the throughput upper limits of your environment, you can run multiple copy activities in parallel. You can run in parallel by using control flow constructs. One such construct is the [For Each loop](control-flow-for-each-activity.md). For more information, see the following articles about solution templates:

    * [Copy files from multiple containers](solution-template-copy-files-multiple-containers.md)
    * [Migrate data from Amazon S3 to ADLS Gen2](solution-template-migration-s3-azure.md)
    * [Bulk copy with a control table](solution-template-bulk-copy-with-control-table.md)

4. **Expand the configuration to your entire dataset.**

    When you're satisfied with the execution results and performance, you can expand the definition and pipeline to cover your entire dataset.

## Troubleshoot copy activity performance

Follow the [Performance tuning steps](#performance-tuning-steps) to plan and conduct performance test for your scenario. And learn how to troubleshoot each copy activity run's performance issue from [Troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md).

## Copy performance optimization features

The service provides the following performance optimization features:

* [Data Integration Units](#data-integration-units)
* [Self-hosted integration runtime scalability](#self-hosted-integration-runtime-scalability)
* [Parallel copy](#parallel-copy)
* [Staged copy](#staged-copy)

### <a id="data-integration-units"></a>Data Integration Units

A Data Integration Unit (DIU) is a measure that represents the power of a single unit in Azure Data Factory and Synapse pipelines. Power is a combination of CPU, memory, and network resource allocation. DIU only applies to [Azure integration runtime](concepts-integration-runtime.md#azure-integration-runtime). DIU does not apply to [self-hosted integration runtime](concepts-integration-runtime.md#self-hosted-integration-runtime). [Learn more here](copy-activity-performance-features.md#data-integration-units).

### Self-hosted integration runtime scalability

You might want to host an increasing concurrent workload. Or you might want to achieve higher performance in your present workload level. You can enhance the scale of processing by the following approaches:

* You can scale _up_ the self-hosted IR, by increasing the number of [concurrent jobs](create-self-hosted-integration-runtime.md#scale-up) that can run on a node.  
Scale up works only if the processor and memory of the node are being less than fully utilized.
* You can scale _out_ the self-hosted IR, by adding more nodes (machines).

For more information, see:

* [Copy activity performance optimization features: Self-hosted integration runtime scalability](copy-activity-performance-features.md#self-hosted-integration-runtime-scalability)
* [Create and configure a self-hosted integration runtime: Scale considerations](create-self-hosted-integration-runtime.md#scale-considerations)

### Parallel copy

You can set the `parallelCopies` property to indicate the parallelism you want the copy activity to use. Think of this property as the maximum number of threads within the copy activity. The threads operate in parallel. The threads either read from your source, or write to your sink data stores. [Learn more](copy-activity-performance-features.md#parallel-copy).

### Staged copy

A data copy operation can send the data _directly_ to the sink data store. Alternatively, you can choose to use Blob storage as an _interim staging_ store. [Learn more](copy-activity-performance-features.md#staged-copy).

## Next steps

See the other copy activity articles:

* [Copy activity overview](copy-activity-overview.md)
* [Troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md)
* [Copy activity performance optimization features](copy-activity-performance-features.md)
* [Use Azure Data Factory to migrate data from your data lake or data warehouse to Azure](data-migration-guidance-overview.md)
* [Migrate data from Amazon S3 to Azure Storage](data-migration-guidance-s3-azure-storage.md)
