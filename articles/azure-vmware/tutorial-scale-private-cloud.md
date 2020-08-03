---
title: "Tutorial: Scale a private cloud"
description: In this tutorial, you use the Azure portal to scale an Azure VMware Solution (AVS) Preview private cloud.
ms.topic: tutorial
ms.date: 05/04/2020

#Customer intent: As a VMware administrator, I want to learn how to scale an Azure VMware Solution (AVS) private cloud in the Azure portal.
---

# Tutorial: Scale an Azure VMware Solution (AVS) Preview private cloud

To get the most out of your AVS Preview private cloud experience, scale the clusters and hosts to reflect what you need for planned workloads. Since AVS won’t support your on-premises vCenter during preview, you'll need to use what you have already created through the Azure portal.

You can scale the number of clusters and the number of hosts in a private cloud as required for your application workload. Performance and availability limitations for specific services need to be addressed on a case by case basis within your AVS Preview cloud environment. The cluster and host limits in a private cloud are provided in [the private cloud concept article](concepts-private-clouds-clusters.md).

In this tutorial, you use the Azure portal to:

> [!div class="checklist"]
> * Add a cluster to an existing private cloud
> * Add hosts to an existing cluster

## Prerequisites

You need a private cloud to complete this tutorial. If you haven't yet created a private cloud, use the [create a private cloud tutorial](tutorial-create-private-cloud.md) to create a private cloud and configure networking for your VMware private cloud in Azure to setup the required virtual network.

## Add a new cluster

On the overview page of an existing private cloud, under **Manage**, select **Scale private cloud**. Next, select **+ Add a cluster**.

:::image type="content" source="./media/tutorial-scale-private-cloud/ss2-select-add-cluster.png" alt-text="select add a cluster" border="true":::

In the **Add cluster** page, use the slider to select the number of hosts. Select **Save**.

:::image type="content" source="./media/tutorial-scale-private-cloud/ss3-configure-new-cluster.png" alt-text="Configure a new private cloud cluster" border="true":::

The deployment of the new cluster will begin.

## Scale a cluster 

On the overview page of an existing private cloud, select **Scale private cloud** and select the pencil icon to edit the cluster.

:::image type="content" source="./media/tutorial-scale-private-cloud/ss4-select-scale-private-cloud-2.png" alt-text="Select Scale private cloud in Overview" border="true":::

In the **Edit Cluster** page, use the slider to select the number of hosts. Select **Save**.

:::image type="content" source="./media/tutorial-scale-private-cloud/ss5-scale-cluster.png" alt-text="Configure a new private cloud cluster" border="true":::

The addition of hosts to the cluster will begin.

## Next steps

If you require another AVS private cloud, [create another private cloud](tutorial-create-private-cloud.md), following the same networking prerequisites, cluster and host limits...

<!-- LINKS - external-->

<!-- LINKS - internal -->
