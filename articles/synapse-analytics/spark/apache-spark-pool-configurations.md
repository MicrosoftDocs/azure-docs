---
title: Apache Spark pool concepts
description: Introduction to Apache Spark pool sizes and configurations in Azure Synapse Analytics.
ms.topic: conceptual
services: synapse-analytics 
ms.service:  synapse-analytics 
ms.subservice: spark
author: guyhay
ms.author: guyhay
ms.reviewer: martinle
ms.date: 07/26/2022 
---

# Apache Spark pool configurations in Azure Synapse Analytics

A Spark pool is a set of metadata that defines the compute resource requirements and associated behavior characteristics when a Spark instance is instantiated. These characteristics include but aren't limited to name, number of nodes, node size, scaling behavior, and time to live. A Spark pool in itself does not consume any resources. There are no costs incurred with creating Spark pools. Charges are only incurred once a Spark job is executed on the target Spark pool and the Spark instance is instantiated on demand.

You can read how to create a Spark pool and see all their properties here [Get started with Spark pools in Synapse Analytics](../quickstart-create-apache-spark-pool-portal.md)

## Isolated Compute

The Isolated Compute option provides additional security to Spark compute resources from untrusted services by dedicating the physical compute resource to a single customer.
Isolated compute option is best suited for workloads that require a high degree of isolation from other customer's workloads for reasons that include meeting compliance and regulatory requirements.  
The Isolate Compute option is only available with the XXXLarge (80 vCPU / 504 GB) node size and only available in the following regions.  The isolated compute option can be enabled or disabled after pool creation although the instance may need to be restarted.  If you expect to enable this feature in the future, ensure that your Synapse workspace is created in an isolated compute supported region.

* East US
* West US 2
* South Central US
* US Gov Arizona
* US Gov Virginia

## Nodes

Apache Spark pool instance consists of one head node and two or more worker nodes with a minimum of three nodes in a Spark instance.  The head node runs additional management services such as Livy, Yarn Resource Manager, Zookeeper, and the Spark driver.  All nodes run services such as Node Agent and Yarn Node Manager. All worker nodes run the Spark Executor service.

## Node Sizes

A Spark pool can be defined with node sizes that range from a Small compute node with 4 vCore and 32 GB of memory up to a XXLarge compute node with 64 vCore and 512 GB of memory per node. Node sizes can be altered after pool creation although the instance may need to be restarted.

|Size | vCore | Memory|
|-----|------|-------|
|Small|4|32 GB|
|Medium|8|64 GB|
|Large|16|128 GB|
|XLarge|32|256 GB|
|XXLarge|64|512 GB|
|XXX Large (Isolated Compute)|80|504 GB|

## Autoscale

Apache Spark pools provide the ability to automatically scale up and down compute resources based on the amount of activity. When the autoscale feature is enabled, you can set the minimum and maximum number of nodes to scale. When the autoscale feature is disabled, the number of nodes set will remain fixed.  This setting can be altered after pool creation although the instance may need to be restarted.

## Elastic pool storage

Apache Spark pools utilize temporary disk storage while the pool is instantiated. For many Spark jobs, it is difficult to estimate cluster storage requirements, which may cause your Spark jobs to fail if the worker nodes exhaust storage. Elastic pool storage allows the Spark engine to monitor worker node temporary cluster storage, and attach additional disks if needed. No action is required by customers. Customers should see fewer job failures as a result of elastic pool storage.

> [!NOTE]
> Azure Synapse Elastic pool storage is currently in Public Preview. During Public Preview there is no charge for use of Elastic Pool Storage.

## Automatic pause

The automatic pause feature releases resources after a set idle period, reducing the overall cost of an Apache Spark pool.  The number of minutes of idle time can be set once this feature is enabled.  The automatic pause feature is independent of the autoscale feature. Resources can be paused whether the autoscale is enabled or disabled.  This setting can be altered after pool creation although active sessions  will need to be restarted.

## Next steps

* [Azure Synapse Analytics](../index.yml)
* [Apache Spark Documentation](https://spark.apache.org/docs/3.2.1/)
