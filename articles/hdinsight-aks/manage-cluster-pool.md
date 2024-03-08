---
title: Manage cluster pools
description: Manage cluster pools in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Manage cluster pools

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Cluster pools are a logical grouping of clusters and maintain a set of clusters in the same pool. It helps in building robust interoperability across multiple cluster types and allow enterprises to have the clusters in the same virtual network. One cluster pool corresponds to one cluster in AKS infrastructure. 

This article describes how to manage a cluster pool. 

> [!NOTE]
> You are required to have an operational cluster pool, Learn how to create a [cluster pool](./quickstart-create-cluster.md).

## Get started

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS cluster pool" and select "Azure HDInsight on AKS cluster pools" from the drop-down list.
  
   :::image type="content" source="./media/manage-cluster-pool/cluster-pool-get-started.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster pool." border="true" lightbox="./media/manage-cluster-pool/cluster-pool-get-started.png":::
  
1. Select your cluster pool name from the list page.
  
   :::image type="content" source="./media/manage-cluster-pool/cluster-pool-in-list-view.png" alt-text="Screenshot showing cluster pools in a list view." border="true" lightbox="./media/manage-cluster-pool/cluster-pool-in-list-view.png":::

## Create new cluster
   
In a cluster pool, you can add multiple clusters of different types. For example, you can have a Trino cluster and an Apache Flink cluster inside the same pool. 

To create a new cluster, click on the  **+New cluster** on the Azure portal and continue to use the Azure portal to create a Trino, Apache Flink, and Apache Spark cluster. 

Learn more on how to [create a cluster](./quickstart-create-cluster.md).

:::image type="content" source="./media/manage-cluster-pool/create-new-cluster.png" alt-text="Screenshot showing create new cluster option.":::

## View the list of existing clusters

You can view the list of clusters in the cluster pool on the **Overview** tab.

:::image type="content" source="./media/manage-cluster-pool/cluster-pool-view-clusters.png" alt-text="Screenshot showing list of existing clusters." lightbox="./media/manage-cluster-pool/cluster-pool-view-clusters.png":::
   
## Manage access to the cluster pool
 
HDInsight on AKS supports both Azure built-in roles and certain roles specific to HDInsight on AKS. In the Azure portal, you can use Access control (IAM) blade in your pool to manage the access for cluster pool’s control plane.

For more information, see [manage access](./hdinsight-on-aks-manage-authorization-profile.md).

## Enable integration with Azure services

   In the Azure portal, use Monitor settings blade in your cluster pool to configure the supported Azure services. Currently, we support Log Analytics and Azure managed Prometheus and Grafana, which has to be configured at cluster pool before you can enable at cluster level.

   * Learn more about [Azure Monitor Integration](./how-to-azure-monitor-integration.md).
   * For more information, see [how to enable Log Analytics](./how-to-azure-monitor-integration.md).
   * For more information, see [how to enable Azure managed Prometheus and Grafana](./monitor-with-prometheus-grafana.md).
   
   
## Delete cluster pool 

   Deleting the cluster pool deletes the following resources:
   
   * All the clusters that are part of the cluster pool.
   * Managed resource groups created during cluster pool creation to hold the ancillary resources.
    
  However, it doesn't delete the external resources associated with the cluster pool or cluster. For example, Key Vault, Storage account, Monitoring workspace etc.

  Each cluster pool version is associated with an AKS version. When an AKS version is deprecated, you'll be notified. In this case, you need to delete the cluster pool and recreate to move to the supported AKS version


 > [!Note]
 > You can't recover the deleted cluster pool. Be careful while deleting the cluster pool.

  1. To delete the cluster pool, click on "Delete" at the top left in the "Overview" blade in the Azure portal.
    
     :::image type="content" source="./media/manage-cluster-pool/delete-cluster-pool.png" alt-text="Screenshot showing how to delete cluster pool.":::
    
  1. Enter the pool name to be deleted and click on delete.
    
     :::image type="content" source="./media/manage-cluster-pool/cluster-pool-delete-cluster.png" alt-text="Screenshot showing how to delete cluster pool, and updating your cluster pool name once you click delete.":::

   Once the deletion is successful, you can check the status by clicking Notifications icon ![Screenshot showing the Notifications icon in the Azure portal.](./media/manage-cluster-pool/notifications.png) in the Azure portal.

   :::image type="content" source="./media/manage-cluster-pool/cluster-pool-delete-cluster-notification.png" alt-text="Screenshot showing a notification alert of a cluster pool deletion successful.":::
