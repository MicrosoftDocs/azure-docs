---
title: Scale Stream Analytics cluster
description: Learn how to scale up and down size of Stream Analytics cluster
author: sidramadoss
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 09/22/2020
---

# Scale Stream Analytics cluster
<Token>**APPLIES TO:** ![yes](./media/applies-to/yes.png)Stream Analytics cluster</Token> 

The capacity of a Stream Analytics cluster is measured in Streaming Units (SU). Multiple jobs can run in parallel in the same cluster as long as the sum of SUs assigned to all running jobs does not exceed the capacity of the cluster.

The capacity of the cluster can be scaled up and down to match the size of your streaming workloads. Scaling of clusters is expected to take a short while and therefore not intended to be changed very frequently. It is recommended you plan and provision a cluster with the right number of Streaming Units you will be consuming in the near future. You can change the scale of your cluster by:
1. Sign in to the Azure portal.
2. Locate and select your Stream Analytics cluster.
3. In the **Overview** section, select **Scale**. You can then see how many Streaming Units are assigned to your cluster currently. You can increase or decrease as needed.
   ![scale cluster](./media/scale-cluster/scale-cluster.png)

Scaling operation does not impact any jobs that are currently running. 

## Next steps

You now know how to scale up and down your Stream Analytics clusters. Next, you can learn about managing private endpoints and autoscaling your jobs:

* [Manage private endpoints](stream-analytics-privateendpoints.md).
* [Managing Stream Analytics jobs in a Stream Analytics cluster](stream-analytics-manage-jobs-cluster.md).
* [Autoscale jobs]([stream-analytics-quick-create-portal.md](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-autoscale)).
   