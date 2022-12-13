---
title: Reservation of Executors as part of Dynamic Allocation in Synapse Spark
description: In this article, you learn how Dynamic Allocation of Executors works, and the conservative reservation thats applied to the executors to ensure jobs run with greater reliability.
services: synapse analytics 
author: santhoshravindran7
ms.service: synapse-analytics
ms.topic: conceptual 
ms.subservice: spark
ms.date: 11/07/2022
ms.author: saravi 
ms.reviewer: sngun
---

# Reservation of Executors as part of Dynamic Allocation in Synapse Spark Pools

Users create Spark pools and size them based on their workload requirements. In cases when the user is not clear on the overall demand on the usage of the pools, users can enable the Auto scale option and specify a minimum and maximum number of nodes and the platform handles scaling the number of active nodes withing these limits based on the demand.

In cases where the users are not aware on more fine-grained application level executor requirements as they are vastly different across different stages of a Spark Job Execution process, and as the volume of data processed changes from time to time, users can enable Dynamic Allocation as part of the spark pool configuration which would manage the allocation of number of executors  for every spark application from the available nodes in the Spark Pool. 

When the Dynamic Allocation is enabled, for every spark application submitted, the system *reserves* the executors based on the Max Nodes specified by the user to support successful auto scale scenarios in advance as part accepting the job request.

> [!NOTE]
> **This conservative approach allows the platform to enable scaling from say 3 to 10 Nodes without running out of capacity, thereby providing users with greater reliability for job execution.**

![Dynamic Allocation in Synapse Spark Pools](./media/DynamicAllocation_Overview.png)

### What does the reservation of executors mean?

In scenarios where the Dynamic Allocation option is enabled in a Synapse Spark Pool, the platform reserve executors based on the maximum limit specified by the user for any spark application submitted. A new job submitted by the user will only be accepted when there are available executors is > than the max number of reserved executors. 

> [!IMPORTANT]
> This reservation activity however does not impact the billing where the users are billed only for the cores used and not for the number of cores in the reserved state. 


## How does this dynamic allocation work when multiple jobs are submitted against a Spark Pool

Lets look at an example scenario of a single user who creates a Spark Pool A with Auto Scale enabled with minimum of 5 to maximum of 50 nodes.
Since the user is not sure how much compute his spark job would require, the user enables Dynamic Allocation to allow the executors to scale. 
+ The user starts by submitting the application App1, which starts with 3 executors, and it can scale from 3 to 10 executors.
+ The maximum number of nodes allocated for the Spark Pool is 50 and now that App1 is submitted which reserves 10 executors, and the available set of executors in the spark pool reduces to 40. 
+ The user submits another Spark Application App2 with the same compute configurations as that of App1 where the application starts with 3 which can scale up to 10 executors and thereby reserving 10 more executors from the total available executors in the spark pool.
+ Total number of available executors in the spark pool has reduced to 30. 
+ The user submits a application App3, App4 and App5 with the same as the other applications, for the 6th job would get queued because, as part of accepting App3, the number of available executors  reduces to 20, and similarly reduces to 10 and then to 0  when App5 is accepted as part of the reservation of 10 Executors  from the available set of executors  in the pool. 
+ Given that there are no available cores, App6 will be in the queue till these other applications complete execution and will be accepted once the available number of executors in the pool increases to 10 from 0. 

![Job Level Reservation of Executors in Spark Pool with Dynamic Allocation](./media/ReservationofExecutorsinSparkPoolwithDynamicAllocation.png)

> [!NOTE]
> + Even though the reservation of executors is carried out, not all executors are being used but are reserved to support auto scale scenarios for these applications. 
> + If all the applications App1, App2, App3, App4 and App5 were able to run in minimum node capacity the executors consumed for this execution is 15 Executors in total, however the rest of the 35 executors were added as part of the reserve enable scaling out from 3 Executors to 10 Executors in any case while running these applications. 
> + Even with having the 35 executors reserved, **the user is only billed for the 15 executors used in this case and not for the 35 executors in the reserved state.**
> + **When Dynamic Allocation is Disabled**: In a scenario where the user disabled dynamic allocation, the reservation of executors will be based on the min and max number of executors specified by the user. 
> +  If user in the above example has specified number of executors to be 5, then the 5 executors will be reserved for every application submitted, and the user can submit App6 and it would not be queued.


## Scenario where concurrent jobs are submitted to Spark Pools in a Synapse Workspace

Users can create multiple Spark Pools in a Synapse Anlaytics workspace and size them based on their analytics workload requirements. For these spark pools created, if the users have enabled Dynamic Allocation, the total available cores for the given workspace at any point in time will be

**Total Available Cores for the Workspace =  Total Cores of all Spark Pools - Cores Reserved or Being Used for Active Jobs running in Spark Pools**

Users will get a **workspace capacity exceeded error** for jobs submitted when Total Available Cores for the Workspace is 0. 

## Dynamic Allocation and Reservation of Cores in a Multi User Scenario

In scnearios where multiple users try to run multiple spark jobs in a given Synapse Workspace, if User1 is submitting jobs to a Spark Pool which is enabled with Dynamic Allocation, there by taking up all the cores available in Pool. If User2 submits jobs and given that there are no Available Cores for the Spark Pool as some of them are being actively used in the execution of the jobs submitted by User1 and some are reserved for supporting the execution, User2 would experience a **workspace capacity exceeded error**. 

> [!TIP]
> Users can increase the number of cores, there by increasing the total available cores to avoid **workspace capacity exceeded errors**.


---

## Next steps
- [Quickstart: Create an Apache Spark pool in Azure Synapse Analytics using web tools](/azure/synapse-analytics/quickstart-create-apache-spark-pool-portal)
- [What is Apache Spark in Azure Synapse Analytics](/azure/synapse-analytics/spark/apache-spark-overview)
- [Automatically scale Azure Synapse Analytics Apache Spark pools](/azure/synapse-analytics/spark/apache-spark-autoscale)
- [Azure Synapse Analytics](/azure/synapse-analytics)
