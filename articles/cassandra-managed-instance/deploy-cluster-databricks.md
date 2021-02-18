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

This quickstart demonstrates how to use the Azure portal to create a fully managed Apache Spark cluster inside the VNET of your Azure Managed Instance for Apache Cassandra cluster. 

You can also learn more with detailed instructions on [Deploying Azure Databricks in your Azure Virtual Network (VNET Injection)](https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## Install Azure Databricks in a VNET with the managed instance

1. First, navigate to the resource group in Azure portal that contains the VNET in which your Cassandra Managed Instance is deployed. Open the VNET resource, and take note of the address space in your VNET:

    :::image type="content" source="./media/deploy-cluster-databricks/vnet.png" alt-text="Virtual Network Resource" border="true":::

2. Then, from the resource group, click `Add` and search for Azure Databricks in the search field:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks.png" alt-text="Add Azure Databricks" border="true":::

3. Select `Create`:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks-create.png" alt-text="Create Azure Databricks account" border="true":::

4. Select a name for the Azure Databricks workspace, and ensure it's created in same region as your VNET:

    :::image type="content" source="./media/deploy-cluster-databricks/select-name.png" alt-text="Select name" border="true":::

5. Select the Networking tab, then check yes for deploying Azure Databricks to your VNET, and specify public and private subnet names and subnet ranges:

    :::image type="content" source="./media/deploy-cluster-databricks/subnets.png" alt-text="Specify public and private subnet names" border="true":::

6. To avoid range collisions, ensure you select higher ranges. If necessary, use a visual subnet calculator like [this](https://www.fryguy.net/wp-content/tools/subnets.html) for dividing the ranges:

    :::image type="content" source="./media/deploy-cluster-databricks/subnet-calc.png" alt-text="Subnet Calculator" border="true":::

7. Click `Review and create`, then `Create` to deploy the work space. When created, launch workspace:

    :::image type="content" source="./media/deploy-cluster-databricks/databricks-workspace.png" alt-text="Databricks Workspace" border="true":::

8. When creating a cluster, you'll need to select a version supported by the Cassandra Connector (Scala 2.11 or below):

    :::image type="content" source="./media/deploy-cluster-databricks/spark-cluster.png" alt-text="Spark Cluster" border="true":::

9. Expand advanced options, and ensure you add config as follows (replacing node IP and credentials):

    ```java
    spark.cassandra.connection.host <node1 IP>,<node 2 IP>, <node IP>
    spark.cassandra.auth.password cassandra
    spark.cassandra.connection.port 9042
    spark.cassandra.auth.username cassandra
    spark.cassandra.connection.ssl.enabled true
    ```

10. In Libraries, ensure you install the latest spark connector for Cassandra (and restart cluster):

    :::image type="content" source="./media/deploy-cluster-databricks/connector.png" alt-text="Install Cassandra Connector" border="true":::

## Next steps

In this quickstart, you learned how to create a fully managed Apache Spark cluster inside the VNET of your Azure Managed Instance for Apache Cassandra cluster. 

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
