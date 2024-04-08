---
title: Manage clusters
description: Manage clusters in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Manage clusters

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Clusters are individual compute workloads such as Apache Spark, Apache Flink, and Trino, which can be created rapidly in few minutes with preset configurations and few clicks.

This article describes how to manage a cluster using Azure portal. 
 
> [!NOTE]
> You are required to have an operational cluster, Learn how to create a [cluster](./quickstart-create-cluster.md).

## Get started

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS clusters" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/manage-cluster/get-started-portal-search-step-1.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." border="true" lightbox="./media/manage-cluster/get-started-portal-search-step-1.png":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/manage-cluster/get-started-portal-list-view-step-2.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/manage-cluster/get-started-portal-list-view-step-2.png":::

## View cluster details

You can view the cluster details in the "Overview" blade of your cluster. It provides general information and easy access to the tools that are part of the cluster.

|Property|Description|
|-|-|
|Resource group| The resource group in which cluster is created.|
|Cluster pool name| Cluster pool name inside which the cluster is created.|
|Cluster type| The type of the cluster such as Spark, Trino, or Flink.|
|HDInsight on AKS version| HDInsight on AKS cluster version. For more information. see [versioning](./versions.md).|
|Cluster endpoint| The endpoint of the cluster.|
|Cluster package| Component versions associated with the cluster.|
|Subscription details| Subscription name and subscription ID.|
|Location| Region in which the cluster is deployed.|
|Cluster size details| Node size, node type, and number of nodes.|

:::image type="content" source="./media/manage-cluster/view-cluster-information-step-3.png" alt-text="Screenshot showing all cluster settings overview on HDInsight on AKS Cluster." border="true" lightbox="./media/manage-cluster/view-cluster-information-step-3.png":::

## Manage cluster size 

You can check and modify the number of worker nodes for your cluster using "Cluster size" blade in the Azure portal. There are two options to scale up/down your cluster:

* [Manual scale](./manual-scale.md)
* [Auto scale](./hdinsight-on-aks-autoscale-clusters.md)

:::image type="content" source="./media/manage-cluster/cluster-size-step-4.png" alt-text="Screenshot showing cluster size blade on HDInsight on AKS Cluster." border="true" lightbox="./media/manage-cluster/cluster-size-step-4.png":::

## Manage cluster access 

HDInsight on AKS provides a comprehensive and fine-grained access control at both control plane and data plane, which allows you to manage cluster resources and provide access to cluster data plane.

Learn how to [manage access to your cluster](./hdinsight-on-aks-manage-authorization-profile.md).

## Configure secure shell (SSH)

Secure shell (SSH) allows you to submit jobs and queries to your cluster directly. You can enable or disable SSH using "Secure shell (SSH)" blade in the Azure portal.
 
>[!NOTE]
>Enabling SSH will create additional VMs in the cluster. The maximum allowed secure shell nodes are 5.

:::image type="content" source="./media/manage-cluster/ssh-management-step-5.png" alt-text="Screenshot showing SSH blade on HDInsight on AKS Cluster." border="true" lightbox="./media/manage-cluster/ssh-management-step-5.png":::

## Manage cluster configuration

HDInsight on AKS allows you to tweak the configuration properties to improve performance of your cluster with certain settings. For example, usage or memory settings.
In the Azure portal, use "Configuration management" blade of your cluster to manage the configurations.

You can do the following actions:

* Update the existing service configurations or add new configurations.
* Export the service configurations using RestAPI. 

Learn how to manage the [cluster configuration](./service-configuration.md).

## View service details 

In the Azure portal, use "Services" blade in your cluster to check the health of the services running in your cluster. It includes the collection of the services and the status of each service running in the cluster. You can drill down on each service to check instance level details.

Learn how to check [service health](./service-health.md).

## Enable integration with Azure services 

In the Azure portal, use "Integrations" blade in your cluster pool to configure the supported Azure services. Currently, we support Log Analytics and Azure managed Prometheus and Grafana, which has to be configured at cluster pool before you can enable at cluster level.

* Learn more about [Azure Monitor Integration](./how-to-azure-monitor-integration.md).
* For more information, see [how to enable Log Analytics](./how-to-azure-monitor-integration.md).
* For more information, see [how to enable Azure managed Prometheus and Grafana](./monitor-with-prometheus-grafana.md).

:::image type="content" source="./media/manage-cluster/integrations-log-analytics-step-6.png" alt-text="Screenshot showing cluster integration with log analytics on HDInsight on AKS Cluster." border="true" lightbox="./media/manage-cluster/integrations-log-analytics-step-6.png":::

## Delete cluster 

Deleting a cluster doesn't delete the default storage account nor any linked storage accounts. You can re-create the cluster by using the same storage accounts and the same metastores. 

From the "Overview" blade in the Azure portal:

1. Select **Delete** from the top menu.

    :::image type="content" source="./media/manage-cluster/delete-cluster-step-7.png" alt-text="Screenshot showing how to delete the cluster on HDInsight on AKS Cluster." border="true" :::
1. Status can be checked on Notification icon ![Screenshot showing the Notifications icon in the Azure portal.](./media/manage-cluster/notifications.png).
