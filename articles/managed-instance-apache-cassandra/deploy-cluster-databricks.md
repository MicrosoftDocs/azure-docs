---
title: Deploy a Managed Apache Spark Cluster with Azure Databricks
description: This quickstart shows how to Deploy a Managed Apache Spark Cluster with Azure Databricks using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 11/02/2021
ms.custom:
- ignite-fall-2021
-  mode-other
- kr2b-contr-experiment
---

# Quickstart: Deploy a Managed Apache Spark Cluster with Azure Databricks

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. This feature accelerates hybrid scenarios and reducing ongoing maintenance.

This quickstart demonstrates how to use the Azure portal to create a fully managed Apache Spark cluster inside the Azure Virtual Network of your Azure Managed Instance for Apache Cassandra cluster. You create the Spark cluster in Azure Databricks. Later, you can create or attach notebooks to the cluster, read data from different data sources, and analyze insights.

You can also learn more with detailed instructions on [Deploying Azure Databricks in your Azure Virtual Network (Virtual Network Injection)](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Databricks cluster

Follow these steps to create an Azure Databricks cluster in a Virtual Network that has the Azure Managed Instance for Apache Cassandra:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the left navigation pane, locate **Resource groups**. Navigate to your resource group that contains the Virtual Network where your managed instance is deployed.

1. Open the **Virtual Network** resource, and make a note of the **Address space**:

   :::image type="content" source="./media/deploy-cluster-databricks/virtual-network-address-space.png" alt-text="Screenshot shows where to get the address space of your Virtual Network." border="true":::

1. From the resource group, select **Add** and search for **Azure Databricks** in the search field:

   :::image type="content" source="./media/deploy-cluster-databricks/databricks.png" alt-text="Screenshot shows a search for Azure Databricks." border="true":::

1. Select **Create** to create an Azure Databricks account:

   :::image type="content" source="./media/deploy-cluster-databricks/databricks-create.png" alt-text="Screenshot shows Azure Databricks offering with the Create button selected." border="true":::

1. Enter the following values:

   * **Workspace name** Provide a name for your Databricks workspace.
   * **Region** Make sure to select the same region as your Virtual Network.
   * **Pricing Tier** Choose between *Standard*, *Premium*, or *Trial*. For more information on these tiers, see [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).

   :::image type="content" source="./media/deploy-cluster-databricks/select-name.png" alt-text="Screenshot shows a dialog box where you can enter workspace name, region, and pricing tier for the Databricks account." border="true":::

1. Next, select the **Networking** tab, and enter the following details:

   * **Deploy Azure Databricks workspace in your Virtual Network (VNet)** Select **Yes**.
   * **Virtual Network** From the dropdown, choose the Virtual Network where your managed instance exists.
   * **Public Subnet Name** Enter a name for the public subnet.
   * **Public Subnet CIDR Range** Enter an IP range for the public subnet.
   * **Private Subnet Name** Enter a name for the private subnet.
   * **Private Subnet CIDR Range** Enter an IP range for the private subnet.

   To avoid range collisions, ensure that you select higher ranges. If necessary, use a [visual subnet calculator](https://www.fryguy.net/wp-content/tools/subnets.html) to divide the ranges:

   :::image type="content" source="./media/deploy-cluster-databricks/subnet-calculator.png" alt-text="Screenshot shows the Visual Subnet Calculator with two highlighted identical network addresses." border="true":::

   The following screenshot shows example details on the networking pane:

   :::image type="content" source="./media/deploy-cluster-databricks/subnets.png" alt-text="Screenshot shows specified public and private subnet names." border="true":::

1. Select **Review and create** and then **Create** to deploy the workspace.

1. **Launch Workspace** after it's created.

1. You're redirected to the Azure Databricks portal. From the portal, select **New Cluster**.

1. In the **New cluster** pane, accept default values for all fields other than the following fields:

   * **Cluster Name** Enter a name for the cluster.
   * **Databricks Runtime Version** We recommend selecting Databricks runtime version 7.5 or higher, for Spark 3.x support.

   :::image type="content" source="../cosmos-db/cassandra/media/migrate-data-databricks/databricks-runtime.png" alt-text="Screenshot shows the New Cluster dialog box with a Databricks Runtime Version selected." border="true":::

1. Expand **Advanced Options** and add the following configuration. Make sure to replace the node IPs and credentials:

   ```java
   spark.cassandra.connection.host <node1 IP>,<node 2 IP>, <node IP>
   spark.cassandra.auth.password cassandra
   spark.cassandra.connection.port 9042
   spark.cassandra.auth.username cassandra
   spark.cassandra.connection.ssl.enabled true
   ```

1. Add the Apache Spark Cassandra Connector library to your cluster to connect to both native and Azure Cosmos DB Cassandra endpoints. In your cluster, select **Libraries** > **Install New** > **Maven**, and then add `com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.0.0` in Maven coordinates.

:::image type="content" source="../cosmos-db/cassandra/media/migrate-data-databricks/databricks-search-packages.png" alt-text="Screenshot that shows searching for Maven packages in Databricks.":::

## Clean up resources

If you're not going to continue to use this managed instance cluster, delete it with the following steps:

1. From the left-hand menu of Azure portal, select **Resource groups**.
1. From the list, select the resource group you created for this quickstart.
1. On the resource group **Overview** pane, select **Delete resource group**.
1. In the next window, enter the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create a fully managed Apache Spark cluster inside the Virtual Network of your Azure Managed Instance for Apache Cassandra cluster. Next, you can learn how to manage the cluster and datacenter resources:

> [!div class="nextstepaction"]
> [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
