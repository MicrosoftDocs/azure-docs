---
title: Apache Spark core concepts
description: Introduction to core concepts for Apache Spark in Azure Synapse Analytics.
ms.service: synapse-analytics 
ms.subservice: spark
ms.topic: overview
author: guyhay
ms.author: guyhay
ms.date: 02/09/2023 
---

# Apache Spark in Azure Synapse Analytics Core Concepts

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Apache Spark in Azure Synapse Analytics is one of Microsoft's implementations of Apache Spark in the cloud.

Azure Synapse makes it easy to create and configure Spark capabilities in Azure. Azure Synapse provides a different implementation of these Spark capabilities that are documented here.

## Spark pools

A serverless Apache Spark pool is created in the Azure portal. It's the definition of a Spark pool that, when instantiated, is used to create a Spark instance that processes data. When a Spark pool is created, it exists only as metadata, and no resources are consumed, running, or charged for. A Spark pool has a series of properties that control the characteristics of a Spark instance. These characteristics include but aren't limited to name, size, scaling behavior, time to live.

As there's no dollar or resource cost associated with creating Spark pools, any number can be created with any number of different configurations. Permissions can also be applied to Spark pools allowing users only to have access to some and not others.

A best practice is to create smaller Spark pools that may be used for development and debugging and then larger ones for running production workloads.

You can read how to create a Spark pool and see all their properties here [Get started with Spark pools in Azure Synapse Analytics](../quickstart-create-apache-spark-pool-portal.md)

## Spark instances

Spark instances are created when you connect to a Spark pool, create a session, and run a job. As multiple users may have access to a single Spark pool, a new Spark instance is created for each user that connects.

When you submit a second job, if there's capacity in the pool, the existing Spark instance also has capacity. Then, the existing instance will process the job. Otherwise, if capacity is available at the pool level, then a new Spark instance will be created.

Billing for the instances starts when the Azure VM(s) starts. Billing for the Spark pool instances stops when pool instances change to terminating. For more information on how Azure VMs are started and deallocated, see [States and billing status of Azure Virtual Machines](/azure/virtual-machines/states-billing).

## Examples

### Example 1

- You create a Spark pool called SP1; it has a fixed cluster size of 20 medium nodes
- You submit a notebook job, J1 that uses 10 nodes, a Spark instance, SI1 is created to process the job
- You now submit another job, J2, that uses 10 nodes because there's still capacity in the pool and the instance, the J2, is processed by SI1
- If J2 had asked for 11 nodes, there wouldn't have been capacity in SP1 or SI1. In this case, if J2 comes from a notebook, then the job will be rejected; if J2 comes from a batch job, then it will be queued.
- Billing starts at the submission of notebook job J1.
  - The Spark pool is instantiated with 20 medium nodes, each with 8 vCores, and typically takes ~3 minutes to start. 20 x 8 = 160 vCores.
  - Depending on the exact Spark pool start-up time, idle timeout and the runtime of the two notebook jobs; the pool is likely to run for between 18 and 20 minutes (Spark pool instantiation time + notebook job runtime + idle timeout).
  - Assuming 20-minute runtime, 160 x 0.3 hours = 48 vCore hours.
  - Note: vCore hours are billed per second, vCore pricing varies by Azure region. For more information, see [Azure Synapse Pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing)

### Example 2

- You create a Spark pool call SP2; it has an autoscale enabled with a minimum of 10 to a maximum of 20 medium nodes
- You submit a notebook job J1 that uses 10 nodes; a Spark instance SI1 is created to process the job
- You now submit another job J2 that uses 10 nodes; because there's still capacity in the pool the instance autoscales to 20 nodes and processes J2.
- Billing starts at the submission of notebook job J1.
  - The Spark pool is instantiated with 10 medium nodes, each with 8 vCores, and typically takes ~3 minutes to start. 10 x 8, 80 vCores.
  - At the submission of J2, the pool autoscales by adding another 10 medium nodes, and typically takes 4 minutes to autoscale. Adding 10 x 8, 80 vCores for a total of 160 vCores.
  - Depending on the Spark pool start-up time, runtime of the first notebook job J1, the time to scale-up the pool, runtime of the second notebook, and finally the idle timeout; the pool is likely to run between 22 and 24 minutes (Spark pool instantiation time + J1 notebook job runtime all at 80 vCores) + (Spark pool autoscale-up time + J2 notebook job runtime + idle timeout all at 160 vCores).
  - 80 vCores for 4 minutes + 160 vCores for 20 minutes = 58.67 vCore hours.
  - Note: vCore hours are billed per second, vCore pricing varies by Azure region. For more information, see [Azure Synapse Pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing)

### Example 3

- You create a Spark pool called SP1; it has a fixed cluster size of 20 nodes.
- You submit a notebook job J1 that uses 10 nodes; a Spark instance SI1 is created to process the job.
- Another user U2, submits a Job J3 that uses 10 nodes; a new Spark instance SI2 is created to process the job.
- You now submit another job J2 that uses 10 nodes; because there's still capacity in the pool and the instance J2 is processed by SI1.
- Billing start at the submission of notebook job J1.
  - The Spark pool SI1 is instantiated with 20 medium nodes, each with 8 vCores, and typically takes ~3 minutes to start. 20 x 8, 160 vCores.
  - Depending on the exact Spark pool start-up time, the ide timeout and the runtime of the first, and third notebook job; The SI1 pool is likely to run for between 18 and 20 minutes (Spark pool instantiation time + notebook job runtime + idle timeout).
  - Another Spark pool SI2 is instantiated with 20 medium nodes, each with 8 vCores, and typically takes ~3 minutes to start. 20 x 8, 160 vCores
  - Depending on the exact Spark pool start-up time, the ide timeout and the runtime of the first notebook job; The SI2 pool is likely to run for between 18 and 20 minutes (Spark pool instantiation time + notebook job runtime + idle timeout).
  - Assuming the two pools run for 20 minutes each, 160 x .03 x 2 = 96 vCore hours.
  - Note: vCore hours are billed per second, vCore pricing varies by Azure region. For more information, see [Azure Synapse Pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing)

## Quotas and resource constraints in Apache Spark for Azure Synapse

### Workspace level

Every Azure Synapse workspace comes with a default quota of vCores that can be used for Spark. The quota is split between the user quota and the dataflow quota so that neither usage pattern uses up all the vCores in the workspace. The quota is different depending on the type of your subscription but is symmetrical between user and dataflow. However if you request more vCores than are remaining in the workspace, then you'll get the following error:

```console
Failed to start session: [User] MAXIMUM_WORKSPACE_CAPACITY_EXCEEDED
Your Spark job requested 480 vCores.
However, the workspace only has xxx vCores available out of quota of yyy vCores.
Try reducing the numbers of vCores requested or increasing your vCore quota. Click here for more information - https://go.microsoft.com/fwlink/?linkid=213499
```

The link in the message points to this article.

The following article describes how to request an increase in workspace vCore quota.

- Select "Azure Synapse Analytics" as the service type.
- In the Quota details window, select Apache Spark (vCore) per workspace

[Request a capacity increase via the Azure portal](../../azure-portal/supportability/per-vm-quota-requests.md)

### Spark pool level

When you define a Spark pool you're effectively defining a quota per user for that pool, if you run multiple notebooks, or jobs or a mix of the 2 it's possible to exhaust the pool quota. If you do, then an error message will be generated

```console
Failed to start session: Your Spark job requested xx vCores.
However, the pool is consuming yy vCores out of available zz vCores.Try ending the running job(s) in the pool, reducing the numbers of vCores requested, increasing the pool maximum size or using another pool
```

To solve this problem, you'll have to reduce your usage of the pool resources before submitting a new resource request by running a notebook or a job.

## Next steps

- [Azure Synapse Analytics](../index.yml)
- [Apache Spark Documentation](https://spark.apache.org/docs/2.4.5/)
