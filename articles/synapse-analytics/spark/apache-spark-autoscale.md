---
title: Automatically scale Azure Synapse Apache Spark instances
description: Use the Azure Synapse Autoscale feature to automatically scale Apache Spark Instances
author: euangMS
ms.author: euang
ms.reviewer: euang
services: synapse-analytics 
ms.service:  synapse-analytics 
ms.topic: conceptual
ms.date: 03/31/2020
---

# Automatically scale Azure Synapse Analytics Apache Spark pools

Apache Spark for Azure Synapse Analytics pool's Autoscale feature automatically scales the number of nodes in a cluster instance up and down. During the creation of a new Apache Spark for Azure Synapse Analytics pool, a minimum and maximum number of nodes can be set when Autoscale is selected. Autoscale then monitors the resource requirements of the load and scales the number of nodes up or down. There's no additional charge for this feature.

## Metrics monitoring

Autoscale continuously monitors the Spark instance and collects the following metrics:

|Metric|Description|
|---|---|
|Total Pending CPU|The total number of cores required to start execution of all pending nodes.|
|Total Pending Memory|The total memory (in MB) required to start execution of all pending nodes.|
|Total Free CPU|The sum of all unused cores on the active nodes.|
|Total Free Memory|The sum of unused memory (in MB) on the active nodes.|
|Used Memory per Node|The load on a node. A node on which 10 GB of memory is used, is considered under more load than a worker with 2 GB of used memory.|

The above metrics are checked every 30 seconds. Autoscale makes scale-up and scale-down decisions based on these metrics.

## Load-based scale conditions

When the following conditions are detected, Autoscale will issue a scale request:

|Scale-up|Scale-down|
|---|---|
|Total pending CPU is greater than total free CPU for more than 1 minute.|Total pending CPU is less than total free CPU for more than 2 minutes.|
|Total pending memory is greater than total free memory for more than 1 minute.|Total pending memory is less than total free memory for more than 2 minutes.|

For scale-up, the Azure Synapse Autoscale service calculates how many new nodes are needed to meet the current CPU and memory requirements, and then issues a scale-up request to add the required number of nodes.

For scale-down, based on the number of executors, application masters per node and the current CPU and memory requirements, Autoscale issues a request to remove a certain number of nodes. The service also detects which nodes are candidates for removal based on current job execution. The scale down operation first decommissions the nodes, and then removes them from the cluster.

## Get started

### Create a Spark pool with Autoscaling

To enable the Autoscale feature, complete the following steps as part of the normal pool creation process:

1. On the **Basics** tab, select the **Enable autoscale** checkbox.
1. Enter the desired values for the following properties:  

    * **Min** number of nodes.
    * **Max** number of nodes.

The initial number of nodes will be the minimum. This value defines the initial size of the instance when it's created. The minimum number of nodes can't be fewer than three.

## Best practices

### Consider the latency of scale up or scale down operations

It can take 1 to 5 minutes for a scaling operation to complete.

### Preparation for scaling down

During instance scaling down process, Autoscale will put the nodes in decommissioning state so that no new executors can launch on that node.

The running jobs will continue to run and finish. The pending jobs will wait to be scheduled as normal with fewer available nodes.

## Next steps

Quickstart to set up a new Spark pool [Create a Spark pool](../quickstart-create-apache-spark-pool-portal.md)
