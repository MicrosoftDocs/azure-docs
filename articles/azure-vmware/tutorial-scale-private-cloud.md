---
title: Tutorial - Scale clusters in a private cloud
description: In this tutorial, you use the Azure portal to scale an Azure VMware Solution private cloud.
ms.topic: tutorial
ms.date: 08/03/2021

#Customer intent: As a VMware administrator, I want to learn how to scale an Azure VMware Solution private cloud in the Azure portal.
---

# Tutorial: Scale clusters in a private cloud

To get the most out of your Azure VMware Solution private cloud experience, scale the clusters and hosts to reflect what you need for planned workloads. You can scale the clusters and hosts in a private cloud as required for your application workload. Performance and availability limitations for specific services should be addressed on a case by case basis. The cluster and host limits are provided in the [private cloud concept](concepts-private-clouds-clusters.md) article.

In this tutorial, you'll use the Azure portal to:

> [!div class="checklist"]
> * Add a cluster to an existing private cloud
> * Add hosts to an existing cluster

## Prerequisites

You'll need an existing private cloud to complete this tutorial. If you haven't created a private cloud, use the [create a private cloud tutorial](tutorial-create-private-cloud.md) to create one. 

## Add a new cluster

1. On the overview page of an existing private cloud, under Manage, select **Clusters** > **Add a cluster**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss2-select-add-cluster.png" alt-text="Screenshot showing how to add a cluster to an Azure VMware Solution private cloud." border="true":::

1. Use the slider to select the number of hosts and the select **Save**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss3-configure-new-cluster.png" alt-text="Screenshot showing how to configure a new cluster." border="true":::

   The deployment of the new cluster begins.

## Scale a cluster 

1. On the overview page of an existing private cloud, under Manage, select **Clusters**.

1. Select the cluster you want to scale, select **More** (...) and then select **Edit**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss4-select-scale-private-cloud-2.png" alt-text="Screenshot showing where to edit an existing cluster." border="true":::

1. Use the slider to select the number of hosts and then select **Save**.

   The addition of hosts to the cluster begins.

## Next steps

If you require another Azure VMware Solution private cloud, [create another private cloud](tutorial-create-private-cloud.md), following the same networking prerequisites, cluster, and host limits.

<!-- LINKS - external-->

<!-- LINKS - internal -->
