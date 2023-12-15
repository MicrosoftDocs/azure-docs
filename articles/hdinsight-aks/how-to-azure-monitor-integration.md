---
title: How to integrate with Azure Monitor
description: Learn how to integrate with Azure Monitoring.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# How to integrate with Log Analytics

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to enable Log Analytics to monitor & collect logs for cluster pool and cluster operations on HDInsight on AKS. You can enable the integration during cluster pool creation or post the creation.
Once the integration at cluster pool is enabled, it isn't possible to disable the integration. However, you can disable the log analytics for individual clusters, which are part of the same pool.

## Prerequisites

* Log Analytics workspace. You can think of this workspace as a unique logs environment with its own data repository, data sources, and solutions. Learn how to [create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal) .

  > [!NOTE]
  > 1. Log Analytics must be enabled at cluster pool level first so as to enable it at a cluster level.
  > 
  > 2. The configuration at cluster pool level is a global switch for all clusters in the cluster pool, therefore all clusters in the same cluster pool can only flow log to one Log Analytics workspace.

## Enable Log Analytics using the portal during cluster pool creation

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. Select **Create a resource** and search for *cluster pool* in marketplace and select **Azure HDInsight on AKS Cluster Pool**. For more information on starting the cluster pool creation process, see [Create a cluster pool](quickstart-create-cluster.md#create-a-cluster-pool).
  
1. Navigate to the Integrations blade, select **Enable Log Analytics**.

   :::image type="content" source="./media/how-to-azure-monitor-integration/enable-log-analytics.png" alt-text="Screenshot showing how to enable log analytics option." border="true" lightbox="./media/how-to-azure-monitor-integration/enable-log-analytics.png":::
    
1. From the drop-down list, select an existing Log Analytics workspace. Complete the remaining details required to finish cluster pool creation and select **Create**.
     
1. Log Analytics is enabled when the cluster pool is successfully created. All monitoring capabilities can be accessed under your cluster pool’s **Monitoring** section.
  
   :::image type="content" source="./media/how-to-azure-monitor-integration/monitor-section.png" alt-text="Screenshot showing monitoring section in the Azure portal." lightbox="./media/how-to-azure-monitor-integration/monitor-section.png":::

## Enable Log Analytics using portal after cluster pool creation

1. In the Azure portal search bar, type "HDInsight on AKS cluster pools" and select *Azure HDInsight on AKS cluster pools* to go to the cluster pools page. On the HDInsight on AKS cluster pools page, select your cluster pool.

   :::image type="content" source="./media/how-to-azure-monitor-integration/cluster-pool-get-started.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster pool." border="true" lightbox="./media/how-to-azure-monitor-integration/cluster-pool-get-started.png":::

   :::image type="content" source="./media/how-to-azure-monitor-integration/cluster-pool-in-list-view.png" alt-text="Screenshot showing cluster pools in a list view." border="true" lightbox="./media/how-to-azure-monitor-integration/cluster-pool-in-list-view.png":::

1. Navigate to the "Monitor settings" blade on the left side menu and click on "Configure" to enable Log Analytics.
  
   :::image type="content" source="./media/how-to-azure-monitor-integration/cluster-pool-integration.png" alt-text="Screenshot showing cluster pool integration blade." border="true" lightbox="./media/how-to-azure-monitor-integration/cluster-pool-integration.png":::

1.	Select an existing Log Analytics workspace, and click **Ok**.

  	:::image type="content" source="./media/how-to-azure-monitor-integration/enable-cluster-pool-log-analytics.png" alt-text="Screenshot showing how to enable cluster pool log analytics." border="true" lightbox="./media/how-to-azure-monitor-integration/enable-cluster-pool-log-analytics.png":::
  	
## Enable Log Analytics using the portal during cluster creation

1. In the Azure portal search bar, type "HDInsight on AKS cluster pools" and select *Azure HDInsight on AKS cluster pools* to go to the cluster pools page. On the HDInsight on AKS cluster pools page, select the cluster pool in which you want to create a cluster.
  
   :::image type="content" source="./media/how-to-azure-monitor-integration/cluster-pool-get-started.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster pool." border="true" lightbox="./media/how-to-azure-monitor-integration/cluster-pool-get-started.png":::

   :::image type="content" source="./media/how-to-azure-monitor-integration/cluster-pool-in-list-view.png" alt-text="Screenshot showing cluster pools in a list view." border="true" lightbox="./media/how-to-azure-monitor-integration/cluster-pool-in-list-view.png":::

   > [!NOTE]
   > It is important to make sure that the selected cluster pool has Log Analytics enabled.

1. Select **New Cluster** to start the creation process. For more information on starting the cluster creation process, see [Create a cluster](./quickstart-create-cluster.md).

    :::image type="content" source="./media/how-to-azure-monitor-integration/new-cluster.png" alt-text="Screenshot showing New cluster button in the Azure portal." border="true" lightbox="./media/how-to-azure-monitor-integration/new-cluster.png":::

1. Navigate to the Integrations blade, select **Enable Log Analytics**.

1. Select one or more type of logs you would like to collect. Complete the remaining details required to finish the cluster creation and select **Create**.

   :::image type="content" source="./media/how-to-azure-monitor-integration/select-log-type.png" alt-text="Screenshot showing how to select log type." border="true" lightbox="./media/how-to-azure-monitor-integration/select-log-type.png":::
   
   > [!NOTE]
   > If no option is selected, then only AKS service logs will be available.

2. Log Analytics is enabled when the cluster is successfully created. All monitoring capabilities can be accessed under your cluster's **Monitoring** section.
  
   :::image type="content" source="./media/how-to-azure-monitor-integration/monitor-section-cluster.png" alt-text="Screenshot showing Monitoring section for cluster in the Azure portal.":::	

## Enable Log Analytics using portal after cluster creation

1. In the Azure portal top search bar, type "HDInsight on AKS clusters" and select *Azure HDInsight on AKS clusters* from the drop-down list. On the HDInsight on AKS cluster pools page, select your cluster name from the list page.
   
   :::image type="content" source="./media/how-to-azure-monitor-integration/get-started-portal-search-step-1.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." lightbox="./media/how-to-azure-monitor-integration/get-started-portal-search-step-1.png":::

   :::image type="content" source="./media/how-to-azure-monitor-integration/get-started-portal-list-view-step-2.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/how-to-azure-monitor-integration/get-started-portal-list-view-step-2.png":::

1. Navigate to the "Monitor settings" blade, select **Enable Log Analytics**. Choose one or more type of logs you would like to collect, and click **Save**.
  
   :::image type="content" source="./media/how-to-azure-monitor-integration/select-more-log-types.png" alt-text="Screenshot showing how to select more log types." border="true" lightbox="./media/how-to-azure-monitor-integration/select-more-log-types.png":::
  
   > [!NOTE]
   > If no option is selected, then only AKS service logs will be available.

## Access the log tables and run queries using the portal 

1.	From the Azure portal, select your cluster pool or cluster of choice to open it.

1.	Navigate to the **Monitoring** section and select the **Logs** blade to query and analyze the collected data.

    :::image type="content" source="./media/how-to-azure-monitor-integration/monitoring-logs.png" alt-text="Screenshot showing logs in the Azure portal.":::

1.	A list of commonly used query templates is provided to choose from to simplify the process or you can write your own query using the provided console. 

    :::image type="content" source="./media/how-to-azure-monitor-integration/queries.png" alt-text="Screenshot showing queries in the Azure portal." border="true" lightbox="./media/how-to-azure-monitor-integration/queries.png":::

    :::image type="content" source="./media/how-to-azure-monitor-integration/new-query.png" alt-text="Screenshot showing New queries in the Azure portal." border="true" lightbox="./media/how-to-azure-monitor-integration/new-query.png":::
  	
