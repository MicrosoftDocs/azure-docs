---
title: Tutorial - Scale clusters in a private cloud
description: In this tutorial, you use the Azure portal to scale an Azure VMware Solution private cloud.
ms.topic: tutorial
ms.service: azure-vmware
ms.date: 10/27/2022
ms.custom: engagement-fy23

#Customer intent: As a VMware administrator, I want to learn how to scale an Azure VMware Solution private cloud in the Azure portal.
---

# Tutorial: Scale clusters in a private cloud

To get the most out of your Azure VMware Solution private cloud experience, scale the clusters and hosts to reflect what you need for planned workloads. You can scale the clusters and hosts in a private cloud as required for your application workload.  You should address performance and availability limitations for specific services on a case-by-case basis.

[!INCLUDE [azure-vmware-solutions-limits](includes/azure-vmware-solutions-limits.md)]

In this tutorial, you'll use the Azure portal to:

> [!div class="checklist"]
> * Add a cluster to an existing private cloud
> * Add hosts to an existing cluster

## Prerequisites

You'll need an existing private cloud to complete this tutorial. If you haven't created a private cloud, follow the [create a private cloud tutorial](tutorial-create-private-cloud.md) to create one.

## Add a new cluster

1. In your Azure VMware Solution private cloud, under **Manage**, select **Clusters** > **Add a cluster**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss2-select-add-cluster.png" alt-text="Screenshot showing how to add a cluster to an Azure VMware Solution private cloud." lightbox="media/tutorial-scale-private-cloud/ss2-select-add-cluster.png" border="true":::

2. Use the slider to select the number of hosts and then select **Save**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss3-configure-new-cluster.png" alt-text="Screenshot showing how to configure a new cluster." lightbox="media/tutorial-scale-private-cloud/ss3-configure-new-cluster.png" border="true":::

   The deployment of the new cluster begins.

## Scale a cluster

1. In your Azure VMware Solution private cloud, under **Manage**, select **Clusters**.

2. Select the cluster you want to scale, select **More** (...), then select **Edit**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss4-select-scale-private-cloud-2.png" alt-text="Screenshot showing where to edit an existing cluster." lightbox="media/tutorial-scale-private-cloud/ss4-select-scale-private-cloud-2.png" border="true":::

3. Click **Add Host** to add a host to the cluster. Repeat that to reach the desired number of hosts, and then select **Save**.

   :::image type="content" source="media/tutorial-scale-private-cloud/ss5-add-hosts-to-cluster.png" alt-text="Screenshot showing how to add additional hosts to an existing cluster." lightbox="media/tutorial-scale-private-cloud/ss5-add-hosts-to-cluster.png" border="true":::

   The addition of hosts to the cluster begins.

   >[!NOTE] 
   >The hosts will be added to the cluster in parallel.

## Next steps

If you require another Azure VMware Solution private cloud, [create another private cloud](tutorial-create-private-cloud.md) following the same networking prerequisites, cluster, and host limits.

<!-- LINKS - external-->

<!-- LINKS - internal -->
