---
title: How to custom configure Azure HDInsight Autoscale.
description: Learn how to custom configure Autoscale in Azure HDInsight clusters
ms.service: hdinsight
ms.topic: how-to
ms.date: 05/09/2023
---

# How to custom configure HDInsight Autoscale

Following are few configurations that can be tuned to custom configure HDInsight Autoscale as per customer needs.
 
> [!NOTE]
>This is applicable for 4.0 and 5.0 stacks.

## Configurations

|Configuration|Description|Default value|Applicable cluster/Autoscale type|Remarks|
|----|----|----|----|----|
|yarn.4_0.graceful.decomm.workaround.enable|Enable YARN graceful decommissioning|Loadware autoscale – True Scheduled autoscale - True|Hadoop/Spark |If this config is disabled, YARN puts nodes in decommissioned state directly from running state without waiting for the applications using the node to finish. This action might lead to applications getting killed abruptly when nodes are decommissioned. Read more about job resiliency in YARN [here](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/GracefulDecommission.html)|
|yarn.graceful.decomm.timeout|YARN graceful decommissioning timeout in seconds | Hadoop Loadware – 3600 Spark Scheduled - 1 Hadoop Scheduled – 1 Spark Loadware – 86400| Hadoop/Spark| Graceful decommissioning timeout is best configured according to customer applications. For example – if an application has many mappers and few reducers, which can take 4 hours to complete, this configuration needs to be set to more than 4 hours |
|yarn.max.scale.up.increment | Maximum number of nodes to scale up in one go|200 | Hadoop/Spark/Interactive Query|It has been tested with 200 nodes. We don't recommend setting this value to more than 200. It can be set to less than 200 if the customer wants less aggressive scale up |
|yarn.max.scale.down.increment |Maximum number of nodes to scale up in one go | 50|Hadoop/Spark/Interactive Query|Can be set to up to 100 |
|nodemanager.recommission.enabled |Feature to enabled recommissioning of decommissioning NMs before adding new nodes to the cluster|True |Hadoop/Spark load based autoscale |Disabling this feature can cause underutilization of cluster. There can be nodes in decommissioning state, which have no containers to run but are waiting for application to finish, even if there's more load in the cluster. **Note:** Applicable for images on **2304280205**  or later|
|UnderProvisioningDiagnoser.time.ms |Time in milliseconds for which cluster needs to under provisioned for scale up to trigger |180000 |Hadoop/Spark load based autoscaling |-|
|OverProvisioningDiagnoser.time.ms |Time in milliseconds for which cluster needs to under provisioned for scale up to trigger |180000 |Hadoop/Spark  |-|
|hdfs.decommission.enable |Decommission data nodes before triggering decommissioning node managers. HDFS doesn't support any graceful decommission timeout, it’s immediate |True | Hadoop/Spark load based autoscaling|Decommissioning datanodes before decommissioning nodemanagers so that particular datanode isn't used for storing shuffle data.|
|scaling.recommission.cooldown.ms | Cooldown period after recommission during which no metrics are sampled|120000 |Hadoop/Spark load based autoscaling |This cooldown period ensures the cluster has some time to redistribute the load to the newly recommissioned `nodemanagers`.  **Note:** Applicable for images on **2304280205**  or later|
|scale.down.nodes.with.ms | Scale down nodes where an AM is running|false | Hadoop/Spark|Can be turned on if there are enough reattempts configured for the AM. Useful for cases where there are long running applications (example spark streaming) which can be killed for scaling down cluster if load has reduced. **Note:** Applicable for images on **2304280205** or later|

> [!NOTE]
>
> * The above configs can be changed using this **[script](https://hdiconfigactions2.blob.core.windows.net/autoscale-config-updates/UpdateAutoscaleConfig.sh)** run on the **headnodes** as a script action, please use this [readme](https://hdiconfigactions2.blob.core.windows.net/autoscale-config-updates/AutoscaleConfigUpdateReadme.md) to understand how to run the script.
> * Customers are advised to test the configurations on lower environments before moving to production.
> * **[How to check image version](./view-hindsight-cluster-image-version.md)**

## Next steps

Read about guidelines for scaling clusters manually in [Scaling guidelines](hdinsight-scaling-best-practices.md)
