---
title: Hive Workload Management Feature
description: Hive Workload Management Feature
ms.service: hdinsight
ms.topic: manage
author: guptanikhil007
ms.author: guptan
ms.reviewer: HDI HiveLLAP Team
ms.date: 23/03/2021
---

# Hive Workload Management Feature
Using workload management feature, you can configure who and how the resources are used. The feature also improves the average response time for a user.
It is a critical need to manage resources in an Interactive Query Cluster especially in a multi-tenant environment. Hive LLAP (low-latency analytical processing) uses workload management to enable users to allocate
resources to match availability needs and prevent contention for those resources. Workload management improves
parallel query execution. Workload management also reduces resource starvation often seen in large clusters.

![`LLAP Architecture/Components`](./media/hive-workload-management/LLAP-architecture.png "LLAP Architecture/Components")

## Enable Hive Workload Management feature for HDInsight clusters

Enable workload management feature in HDInsight Interactive Query clusters by following the steps listed below:
1. Create a new yarn queue, which can be used to bring up the workload management Tez AMs.
2. Change cluster configs via Ambari to enable the feature in Hive.
3. Create and Activate a resource plan.

#### Create a new yarn queue suitable for Workload Management feature.
Create a new yarn queue called `wm` with the help of following [guide](https://docs.microsoft.com/azure/hdinsight/hdinsight-troubleshoot-yarn).
Configure the `wm` queue on cluster based on following configurations:

| QueueName   | Capacity | Max Capacity | Priority | Maximum AM Resource |
|:-----------:|:--------:|:------------:|:--------:|:-------------------:|
| `default`   | 5%       | 5%           | 0        | 33%                 |
| `llap`      | 85%      | 100%         | 10       | 33%                 |
| `wm`       | 10%      | 15%          | 9        | 100%                |

Confirm if the `wm` queue configuration looks as shown below.
![`wm-queue`](./media/hive-workload-management/wm-yarn-queue.png)

#### Enable Workload Management feature in Hive Configs
Add the following property to Custom hiveserver2-interactive-site and set its value to the name of newly create yarn queue that is, `wm`. Restart Interactive HiveServer for configuration changes to take place.
```
hive.server2.tez.interactive.queue=wm
```

#### Create Resource Plan
Refer to [Workload Management Commands](workload-management-commands.md) guide to understand how to create and manage workloads with the help of resource plans.

#### Figure out number of concurrent queries your resource plan can support

Let's assume `wm` queue is defined with capacity as **x%** and cluster's total capacity is **y GBs**
Then number of max queries that can be supported is obtained with following formula
```
Assuming tez container size as 4 GB and
number of total concurrent queries(Tez AMs) = N
N = Math.floor(x/100 * y/4)
```
A D14v2 node comes with 112 GB out of which 100 GB can be used for yarn applications. For a cluster with 4 D14v2 worker nodes, **y = 400**. 
If `wm` queue size is set to 10%, **x = 10**.
Based on above values, we can have total `QUERY_PARALLELISM` as 10.

> [!IMPORTANT]
> Note: Have a slightly more capacity in wm queue than required to avoid tez AMs getting stuck in accepted state that is, `wm` queue capacity can be made to 10.01% and `default` queue capacity can be reduced to 4.99%.

### Important Notes
1. Tez AMs from `wm` queue will be used for scheduling queries when a resource plan is active. Tez AMs will remain available in `llap` queue to support smooth transitions between active and disabled state.
2. Enabling WLM resource plan launches number of Tez AMs equal to total `QUERY_PARALLELISM` configured for the given resource plan. `wm` queue size should be tuned to avoid these Tez AM getting stuck in ACCEPTED state.
3. We only support the use of following two counters for use in resource plans:
    1. EXECUTION_TIME
    2. ELAPSED_TIME

#### References:
* [Cloudera Hive Workload Management Overview](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload/content/hive_workload_management.html)
* [Cloudera Hive Workload Management Commands Summary](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_management_command_summary.html)
* [Cloudera Hive Workload Management Trigger Counters](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_trigger_counters.html)

### Next Steps
Stuck at a particular step, visit one of the following...

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).  

