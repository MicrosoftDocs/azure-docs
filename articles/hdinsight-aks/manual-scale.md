---
title: Manual scale
description: How to manually scale in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Manual scale

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS provides elasticity with options to scale up and scale down the number of cluster nodes. This elasticity works to help increase resource utilization and improve cost efficiency.

## Utility to scale clusters

HDInsight on AKS provides the following methods to manually scale clusters:

| Utility| Description|
|---|---|
|Azure portal| Open your HDInsight on AKS cluster pane, select **Cluster size** on the left-hand menu, then on the Cluster size pane, type in the number of worker nodes, and select Save |
|REST API|To scale a running HDInsight on AKS cluster using the REST API, make a subsequent POST request on the same resource with the updated count in the compute profile.|

You can use the Azure portal to access the “Cluster size” menu in the cluster navigation page. In Cluster size blade, change the “Number of worker nodes,” and save the change to scale up or down the cluster.

:::image type="content" source="./media/manual-scale/manual-scale-configuration.png" alt-text="Screenshot showing the UI for selecting cluster size and configuring manual scale." border="true" lightbox="./media/manual-scale/manual-scale-configuration.png":::

## Impact of scaling operation on a cluster

Any scaling operation triggers a restart of the service, which can lead to errors on jobs already running.

When you **add nodes** to an operational HDInsight on AKS cluster (scale up):

- Successful scaling operation using manual scale will add worker nodes to the cluster.
- New jobs can be safely submitted when the scaling process is completed.
- If the scaling operation fails, the failure leaves your cluster in the "Failed” state.
- You can expect to experience job failures during the scaling operation as services get restarted.

If you **remove nodes** (scale down) from an HDInsight on AKS cluster:  
  
- Pending or running jobs fails when the scaling operation completes. This failure is because of some of the services restarting during the scaling process. The impact of changing the number of cluster nodes varies for each cluster type.

>[!IMPORTANT] 
>- To avoid quota errors during scaling operations, please plan for quota in your subscription. In case you have insufficient quota, you can increase quota with this [documentation](/azure/quotas/regional-quota-requests).
>- In case scale down selects a head node, which hosts coordinator/ingress and other services, it will result in downtime.

## Frequently Asked Questions

### General

|Question|Answer|
| -------- | -------- |
|What are the minimum nodes that I can add/remove during scale operations?|One Node.|
|What's the maximum limit to scale up an HDInsight on AKS Trino cluster?|100 nodes (in public preview).|
|How do I manually scale down my cluster?|In the ARM request, update `computeProfile.count` or follow the steps mentioned to scale down using Azure portal.|
|Can I add custom script actions to a cluster during manual scale?|Script actions are applicable for Apache Spark cluster type|
|How do I get logs for manual scale failures for the cluster nodes?|Logs are available in Log analytics module, refer the [Azure Monitor Integration](./how-to-azure-monitor-integration.md).|
|Is load based or schedule based autoscaling supported?|Yes. For more information, see [Autoscale](./hdinsight-on-aks-autoscale-clusters.md).|

### Trino

|Question|Answer|
| -------- | -------- |
|Will my Trino service restart after scaling operation?|Yes, service restarts during the scaling operation.|

### Apache Flink

|Question|Answer|
| -------- | -------- |
|What’s the impact of scaling operations on Apache Flink cluster?|Any scaling operation is likely to trigger a restart of the service, which causes job failures. New jobs can be submitted when the scaling process is completed. In Apache Flink, scale down triggers job restarts and scale up operation can’t trigger job restarts.|


### Apache Spark

|Question|Answer|
| -------- | -------- |
|What’s the impact of scaling operations on Spark cluster?|Manual scale down operation may trigger restart of head nodes services.|


> [!NOTE]
> It is recommended that you manage the quotas set on the subscription prior to scaling operations to avoid quota errors.
> Before scaling down, please note that for an HDInsight on AKS Trino cluster to be operational, it requires minimum **five** active nodes.

