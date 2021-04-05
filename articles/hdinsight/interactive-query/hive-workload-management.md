---
title: Hive Workload Management Feature
description: Hive Workload Management Feature
ms.service: hdinsight
ms.topic: conceptual
author: guptanikhil007
ms.author: guptan
ms.reviewer: HDI HiveLLAP Team
ms.date: 23/03/2021
---

# Hive Workload Management Feature

Workload Management (WLM) is an in-built feature of apache hive that is utilized to tackle the resource starvation issue often seen in LLAP clusters. It enables the capability to provide guaranteed resources for users/use-cases

![`LLAP Architecture/Components`](./media/hive-workload-management/LLAP-architecture.png "LLAP Architecture/Components")

## Enable Hive Workload Management feature for HDInsight clusters

To enable workload management feature in HDInsight clusters following steps needs to be taken
1. Create a new yarn queue which can be used to bring up the workload management Tez AMs.
2. Change cluster configs via Ambari to enable the feature in Hive.
3. Create and Activate a resource plan.

#### Create a new yarn queue suitable for Workload Management feature.
Create a new yarn queue called `wm` with the help of following [guide](https://docs.microsoft.com/azure/hdinsight/hdinsight-troubleshoot-yarn).
Configure the `wm` queue on cluster based on following configurations:
| QueueName   | Capacity | Max Capacity | Priority | AM % |
|:-----------:|:--------:|:------------:|:--------:|:----:|
| `default`   | 5        | 5            | 0        | 33   |
| `llap`      | 85       | 100          | 10       | 33   |
| `wm`        | 10       | 15           | 9        | 100  |

Confirm if the wm queue configuration look as shown below.
![`wm-queue`](./media/hive-workload-management/wm-yarn-queue.jpg)

#### Enable Workload Management feature in Hive Configs
Add the following property to Custom hiveserver2-interactive-site and set its value to the name of newly create yarn queue i.e. `wm`. Restart Interactive HiveServer for configuration changes to take place.
```
hive.server2.tez.interactive.queue=wm
```

#### Create Resource Plan
Refer to [Workload Management Commands](workload-management-commands.md) guide to understand how to create and manage workloads with the help of resource plans.

#### Figure out number of concurrent queries your resource plan can support

Let's assume `wm` queue is defined with capacity as **x%** and cluster's total capacity is **y GBs**
Then number of max queries that can be supported is obtained with following formula
```
Assuming tez container size as 4GB and
number of total concurrent queries(Tez AMs) = N
N = Math.floor(x/100 * y/4)
```
Based on above formula,
For a cluster topology with 4 D14v2 nodes with 100GB per node gives **y=400**  and setting wm queue size as 10% gives **x=10**
```
N = 10/100 * 400/4 = 10
```
Note: It is always better to have a slightly more capacity in wm queue than required to avoid tez AMs getting stuck in accepted state i.e. `wm` queue capacity can be made to 10.01% and `default` queue capacity can be reduced to 4.99%.

### Important Notes
1. Tez AMs from LLAP queue will not be used when a resource plan is active. Only Tez AMs from `wm` queue will be used for scheduling queries. The unused LLAP Tez AMs will still be available in Yarn to support smooth transitions between active and disabled state.
2. Enabling WLM resource plan launches number of Tez AMs equal to total query parallelism configured for the given resource plan. `wm` queue size should be tuned to avoid these Tez AM getting stuck in ACCEPTED state.
3. We only support the use of following two counters for use in resource plans:
    1. EXECUTION_TIME
    2. ELAPSED_TIME

### Next Steps
If you are unable to enable the feature or stuck at a particular step, visit one of the following...

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).  

#### References:
* [Cloudera Hive Workload Management Overview](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload/content/hive_workload_management.html)
* [Cloudera Hive Workload Management Commands Summary](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_management_command_summary.html)
* [Cloudera Hive Workload Management Trigger Counters](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_trigger_counters.html)

