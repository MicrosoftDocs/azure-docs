---
title: Create cluster pool and cluster
description: Creating a cluster pool and cluster in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: quickstart
ms.date: 08/29/2023
---

# Create cluster pool and cluster

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS has the concept of cluster pools and clusters.

- **Cluster pools** are a logical grouping of clusters and maintain a set of clusters in the same pool, which helps in building robust interoperability across multiple cluster types. It can be created within an existing virtual network or outside a virtual network.

  A cluster pool in HDInsight on AKS corresponds to one cluster in AKS infrastructure.

- **Clusters** are individual compute workloads, such as Apache Spark, Apache Flink, or Trino, which can be created in the same cluster pool.

For creating Apache Spark, Apache Flink, or Trino clusters, you need to first create a cluster pool.

## Prerequisites

Ensure that you have completed the [subscription prerequisites](prerequisites-subscription.md) and [resource prerequisites](prerequisites-resources.md) before creating a cluster pool.

## Create a cluster pool

1. Sign in to [Azure portal](https://portal.azure.com).
   
1. In the Azure portal search bar, type "HDInsight on AKS cluster pool" and select "Azure HDInsight on AKS cluster pools" from the drop-down list.
  
   :::image type="content" source="./media/quickstart-create-cluster/search-bar.png" alt-text="Diagram showing search bar in Azure portal." border="true" lightbox="./media/quickstart-create-cluster/search-bar.png" 
  
1. Click **+ Create**.

   :::image type="content" source="./media/quickstart-create-cluster/create-button.png" alt-text="Diagram showing create button." border="true" lightbox="./media/quickstart-create-cluster/create-button.png":::
  
1. In the **Basics** tab, enter the following information:

     :::image type="content" source="./media/quickstart-create-cluster/cluster-pool-basic-tab.png" alt-text="Diagram showing cluster pool creation basic tab." border="true" lightbox="./media/quickstart-create-cluster/cluster-pool-basic-tab.png":::

     |Property|Description|
     |---|---|
     |Subscription| From the drop-down list, select the Azure subscription under which you want to create HDInsight on AKS cluster pool.|
     |Resource group|From the drop-down list, select an existing resource group, or select **Create new.**|
     |Pool name| Enter the name of the cluster pool to be created. Cluster pool name length can't be more than 26 characters. It must start with an alphabet, end with an alphanumeric character, and must only contain alphanumeric characters and hyphens.|
     |Region|From the drop-down list, select the region for the cluster pool. Check [region availability](./overview.md#region-availability-public-preview). For cluster pools in a virtual network, the region for the virtual network and the cluster pool must be same. |
     |Cluster pool version|From the drop-down list, select the HDInsight on AKS cluster pool version. |
     |Virtual machine|From the drop-down list, select the virtual machine size for the cluster pool based on your requirement.|
     |Managed resource group|(Optional) Provide a name for managed resource group. It holds ancillary resources created by HDInsight on AKS.|
   

    Select **Next: Security + networking** to continue.
        
1. On the **Security + networking** page, provide the following information:
      
     :::image type="content" source="./media/quickstart-create-cluster/cluster-pool-security-tab.png" alt-text="Diagram showing cluster pool creation network and security tab." border="true" lightbox="./media/quickstart-create-cluster/cluster-pool-security-tab.png":::

     |Property|Description|
     |---|---|
     |Virtual network (VNet) | From the drop-down list, select a virtual network, which is in the same region as the cluster pool.|
     |Subnet | From the drop-down list, select the name of the subnet that you plan to associate with the cluster pool.|

    Select **Next: Integrations** to continue.
    
        
1. On the **Integrations** page, provide the following information:

      :::image type="content" source="./media/quickstart-create-cluster/create-cluster-pool-integration-tab.png" alt-text="Diagram showing cluster pool creation integration tab." border="true" lightbox="./media/quickstart-create-cluster/create-cluster-pool-integration-tab.png":::

     |Property|Description|
     |---|---|
     |Log Analytics| (Optional) Select this option to enable Log analytics to view insights and logs directly in your cluster by sending metrics and logs to a Log Analytics Workspace.|
     |Azure Prometheus| You can enable this option after cluster pool creation is completed. |
     
    Select **Next: Tags** to continue.
    
1. On the **Tags** page, enter any tags (optional) you’d like to assign to the cluster pool.
   
     :::image type="content" source="./media/quickstart-create-cluster/create-cluster-pool-tags-page.png" alt-text="Diagram showing cluster pool creation tags tab." border="true" lightbox="./media/quickstart-create-cluster/create-cluster-pool-tags-page.png":::

     | Property | Description|
     |---|---|
     |Name | Enter a name (key) that help you identify resources based on settings that are relevant to your organization. For example, "Environment" to track the deployment environment for your resources.|
     | Value | Enter the value that helps to relate to the resources. For example, "Production" to identify the resources deployed to production.|
     | Resource | Select the applicable resource type.|

     Select **Next: Review + create** to continue.
     
1. On the **Review + create** page, look for the **Validation succeeded** message at the top of the page and then click **Create**.

     The **Deployment is in process** page is displayed while the cluster pool is being created, and the **Your deployment is complete page** is displayed once the cluster pool is fully deployed and ready for use.

   :::image type="content" source="./media/quickstart-create-cluster/create-cluster-pool-review-create-page.png" alt-text="Diagram showing cluster pool review and create tab." lightbox="./media/quickstart-create-cluster/create-cluster-review-create-page.png"::: 

     If you navigate away from the page, you can check the status of the deployment by clicking Notifications icon.
    
     > [!TIP]
     > For troubleshooting any deployment errors, you can refer this [page](./create-cluster-error-dictionary.md).

## Create a cluster

Once the cluster pool deployment completes, continue to use the Azure portal to create a [Trino](./trino/trino-create-cluster.md#create-a-trino-cluster), [Flink](./flink/flink-create-cluster-portal.md#create-an-apache-flink-cluster), and [Spark](./spark/hdinsight-on-aks-spark-overview.md) cluster. 

> [!IMPORTANT]
> For creating a cluster in a new cluster pool, assign AKS agentpool MSI "Managed Identity Operator" role on the user-assigned managed identity created as part of resource prerequisites.
> When a user has permission to assign the Azure RBAC roles, it's assigned automatically.
> 
> AKS agentpool managed identity is created during cluster pool creation. You can identify the AKS agentpool managed identity by **(your clusterpool name)-agentpool**.
> Follow these steps to [assign the role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).

For a quickstart, refer to the following steps.

1. When the cluster pool creation completes, click **Go to resource** from the **Your deployment is complete** page or the **Notifications** area. If the **Go to resource option** isn't available, type *HDInsight on AKS cluster pool* in the search bar on the Azure portal, and then select the cluster pool you created.

1. Click **+ New cluster** from and then provide the following information:

   :::image type="content" source="./media/quickstart-create-cluster/create-new-cluster.png" alt-text="Screenshot showing create new cluster option.":::
   
   :::image type="content" source="./media/quickstart-create-cluster/create-cluster-basic-page.png" alt-text="Diagram showing how to create a new cluster." border="true" lightbox="./media/quickstart-create-cluster/create-cluster-basic-page.png":::
   
     | Property| Description|
     |---|---|
     |Subscription | By default, it's populated with the subscription used for the cluster pool.|
     |Resource group| By default, it's populated with the resource group used for the cluster pool.|
     |Cluster pool|Represents the cluster pool in which the cluster has to be created. To create a cluster in a different pool, find that cluster pool in the portal and click **+ New cluster**.|
     |Region| By default, it's populated with the region used for the cluster pool.|
     |Cluster pool version|By default, it's populated with the version used for the cluster pool.|
     |HDInsight on AKS version| From the drop-down list, select the HDInsight on AKS version. For more information, see [versioning](./versions.md).|
     |Cluster type | From the drop-down list, select the type of Cluster you want to create: Trino, Flink, or Spark.|
     |Cluster package| Select the cluster package with component version available for the selected cluster type. |
     |Cluster name|Enter the name of the new cluster.|
     |User-assigned managed identity | Select the managed identity to use with the cluster.|
     |Storage account (ADLS Gen2) | Select a storage account and a container that is the default location for cluster logs and other output. It's mandatory for Apache Flink and Spark cluster type.|      
     |Virtual network (VNet) | The virtual network for the cluster. It's derived from the cluster pool.|
     |Subnet|The virtual network subnet for the cluster. It's derived from the cluster pool.|
 
     Click **Next: Configuration** to continue.

1. On the **Configuration** page, provide the following information:

   :::image type="content" source="./media/quickstart-create-cluster/configuration-and-pricing-tab.png" alt-text="Diagram showing configuration tab.":::  
   

     |Property|Description|
     |---|---|
     |Head node size| This value is same as the worker node size.|
     |Number of head nodes|This value is set by default based on the cluster type.|
     |Worker node size| From the drop-down list, select the recommended SKU or you can choose the SKU available in your subscription by clicking **Select VM size**.|
     |Number of worker nodes|Select the number of worker nodes required for your cluster.|
     |Autoscale|(Optional) Select this option to enable the autoscale capability|
     |Secure shell (SSH) configuration|(Optional) Select this option to enable SSH node. By enabling SSH, more VM nodes are created.|

     > [!NOTE]
     > You will see extra section to provide service configurations for Apache Flink clusters.

     Click **Next: Integrations** to continue.

1. On the **Integrations** page, provide the following information:

     :::image type="content" source="./media/quickstart-create-cluster/cluster-integration-tab.png" alt-text="Diagram showing integration tab.":::

     |Property|Description|
     |---|---|
     |Log Analytics|(Optional) Select this option to enable Log analytics to view insights and logs directly in your cluster by sending metrics and logs to a Log Analytics Workspace.|
     |Azure Prometheus|(Optional) Select this option to enable Azure Managed Prometheus to view Insights and Logs directly in your cluster by sending metrics and logs to an Azure Monitor workspace.|

     > [!NOTE]
     > To enable Log Analytics and Azure Prometheus, it should be first enabled at the cluster pool level.
     
     Click **Next: Tags** to continue.
    
1. On the **Tags** page, enter any tags(optional) you’d like to assign to the cluster.
   
     :::image type="content" source="./media/quickstart-create-cluster/create-cluster-tags-page.png" alt-text="Screenshot showing tags page.":::

     | Property | Description|
     |---|---|
     |Name | Enter a name (key) that help you identify resources based on settings that are relevant to your organization. "Environment" to track the deployment environment for your resources.|
     | Value | Enter the value that helps to relate to the resources. "Production" to identify the resources deployed to production.|
     | Resource | Select the applicable resource type.|

     Select **Next: Review + create** to continue.

1. On the **Review + create** page, look for the **Validation succeeded** message at the top of the page and then click **Create**.

   :::image type="content" source="./media/quickstart-create-cluster/create-cluster-review-create-page.png" alt-text="Diagram showing cluster review and create tab." lightbox="./media/quickstart-create-cluster/create-cluster-review-create-page.png"::: 

   The **Deployment is in process** page is displayed while the cluster is being created, and the **"Your deployment is complete"**  page is displayed once the cluster is fully deployed and ready for use.

   > [!TIP]
   > For troubleshooting any deployment errors, you can refer to this [page](./create-cluster-error-dictionary.md).
