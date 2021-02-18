---
title: Quickstart - Deploy a Managed Apache Spark Cluster with Azure Databricks
description: This quickstart shows how to Deploy a Managed Apache Spark Cluster with Azure Databricks using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: quickstart
ms.date: 03/02/2021
---
# Quickstart: Deploy a Managed Apache Spark Cluster with Azure Databricks (Preview)

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart demonstrates how to use the Azure portal to create a fully managed Apache Spark cluster inside the Azure Virtual Network of your Azure Managed Instance for Apache Cassandra cluster. 

You can also learn more with detailed instructions on [Deploying Azure Databricks in your Azure Virtual Network (Virtual Network Injection)](https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## Install Azure Databricks

Use the following steps to install Azure Databricks in a Virtual Network with the managed instance:

1. Form the Azure portal, navigate to your resource group that contains the Virtual Network in which your Cassandra Managed Instance is deployed. Open the Virtual Network resource, and take note of the address space:

    :::image type="content" source="./media/deploy-cluster-databricks/vnet.png" alt-text="Get the address space of your Virtual Network." border="true":::

2. From the resource group, select **Add** and search for **Azure Databricks** in the search field:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks.png" alt-text="Search for Azure Databricks." border="true":::

3. Select **Create** to create an Azure Databricks account:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks-create.png" alt-text="Create an Azure Databricks account." border="true":::

4. Select the required **Subscription**, **Resource group**. Fill out the **Workspace name** for the Azure Databricks workspace, for **Region**, make sure that it's created in same region as your Virtual Network:

    :::image type="content" source="./media/deploy-cluster-databricks/select-name.png" alt-text="Fill out workspace name, region and pricing tier for the Databricks account." border="true":::

5. Select the **Networking** tab, and check **Yes** for deploying Azure Databricks to your Virtual Network, and specify public and private subnet names and subnet ranges:

    :::image type="content" source="./media/deploy-cluster-databricks/subnets.png" alt-text="Specify public and private subnet names." border="true":::

6. To avoid range collisions, ensure you select higher ranges. If necessary, use a [visual subnet calculator](https://www.fryguy.net/wp-content/tools/subnets.html) to divide the ranges:

    :::image type="content" source="./media/deploy-cluster-databricks/subnet-calc.png" alt-text="Use the Virtual Network subnet calculator." border="true":::

7. Click **Review and create**, then **Create** to deploy the workspace. When created, launch workspace:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks-workspace.png" alt-text="Launch the Databricks workspace." border="true":::

8. When creating a cluster, you'll need to select a version supported by the Cassandra Connector (Scala 2.11 or below):

    :::image type="content" source="./media/deploy-cluster-databricks/spark-cluster.png" alt-text="Select the Databricks runtime version and the Spark Cluster." border="true":::

9. Expand advanced options, and ensure you add config as follows (replacing node IP and credentials):

    ```java
    spark.cassandra.connection.host <node1 IP>,<node 2 IP>, <node IP>
    spark.cassandra.auth.password cassandra
    spark.cassandra.connection.port 9042
    spark.cassandra.auth.username cassandra
    spark.cassandra.connection.ssl.enabled true
    ```

10. In Libraries, ensure you install the latest spark connector for Cassandra (and restart cluster):

    :::image type="content" source="./media/deploy-cluster-databricks/connector.png" alt-text="Install the Cassandra connector." border="true":::

## Next steps

In this quickstart, you learned how to create a fully managed Apache Spark cluster inside the Virtual Network of your Azure Managed Instance for Apache Cassandra cluster.

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
