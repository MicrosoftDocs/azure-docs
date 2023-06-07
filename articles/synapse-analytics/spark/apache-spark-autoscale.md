---
title: Automatically scale Apache Spark instances
description: Use the Azure Synapse autoscale feature to automatically scale Apache Spark Instances
author: guyhay
ms.author: guyhay
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: spark
ms.date: 02/14/2023
---

# Automatically scale Azure Synapse Analytics Apache Spark pools

Apache Spark for Azure Synapse Analytics pool's Autoscale feature automatically scales the number of nodes in a cluster instance up and down. During the creation of a new Apache Spark for Azure Synapse Analytics pool, a minimum and maximum number of nodes, up to 200 nodes, can be set when Autoscale is selected. Autoscale then monitors the resource requirements of the load and scales the number of nodes up or down. There's no additional charge for this feature.

## Metrics monitoring

Autoscale continuously monitors the Spark instance and collects the following metrics:

|Metric|Description|
|---|---|
|Total Pending CPU|The total number of cores required to start execution of all pending jobs.|
|Total Pending Memory|The total memory (in MB) required to start execution of all pending jobs.|
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

For scale-down, based on the number of executors, application masters per node, the current CPU and memory requirements, Autoscale issues a request to remove a certain number of nodes. The service also detects which nodes are candidates for removal based on current job execution. The scale down operation first decommissions the nodes, and then removes them from the cluster.

>[!NOTE]
>A note about updating and force applying autoscale configuration to an existing Spark pool. If **Force new setting** in the Azure portal or `ForceApplySetting` in [PowerShell](/powershell/module/az.synapse/update-azsynapsesparkpool) is enabled, then all existing Spark sessions are terminated and configuration changes are applied immediately. If this option is not selected, then the configuration is applied to the new Spark sessions and existing sessions are not terminated.

## Get started

### Create a serverless Apache Spark pool with Autoscaling

To enable the Autoscale feature, complete the following steps as part of the normal pool creation process:

1. On the **Basics** tab, select the **Enable autoscale** checkbox.
1. Enter the desired values for the following properties:

    * **Min** number of nodes.
    * **Max** number of nodes.

The initial number of nodes will be the minimum. This value defines the initial size of the instance when it's created. The minimum number of nodes can't be fewer than three.

Optionally, you can enable dynamic allocation of executors in scenarios where the executor requirements are vastly different across stages of a Spark Job or the volume of data processed fluctuates with time. By enabling Dynamic Allocation of Executors, we can utilize capacity as required.

On enabling dynamic allocation, it allows the job to scale the number of executors within min and max number of executors specified.

Apache Spark enables configuration of Dynamic Allocation of Executors through code as below:

```
    %%configure -f
    {
        "conf" : {
            "spark.dynamicAllocation.maxExecutors" : "6",
            "spark.dynamicAllocation.enabled": "true",
            "spark.dynamicAllocation.minExecutors": "2"
     }
    }
```
The defaults specified through the code override the values set through the user interface.

In this example, if your job requires only 2 executors, it will use only 2 executors.  When the job requires more, it will scale up to 6 executors (1 driver, 6 executors).  When the job doesn't need the executors, then it will decommission the executors. If it doesn't need the node, it will free up the node.

>[!NOTE]
>The maxExecutors will reserve the number of executors configured. Considering the example, even if you use only 2, it will reserve 6. 

Hence, on enabling Dynamic allocation, Executors scale up or down based on the utilization of the Executors. This ensures that the Executors are provisioned in accordance with the needs of the job being run.

## Best practices

### Consider the latency of scale up or scale down operations

It can take 1 to 5 minutes for a scaling operation to complete.

### Prepare for scaling down

During the instance scaling down process, Autoscale will put the nodes in decommissioning state so that no new executors can launch on that node.

The running jobs will continue to run and finish. The pending jobs will wait to be scheduled as normal with fewer available nodes.

## Next steps

Quickstart to set up a new Spark pool [Create a Spark pool](../quickstart-create-apache-spark-pool-portal.md)
