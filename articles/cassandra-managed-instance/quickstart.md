---
title: Quickstart - Create Azure Managed Instance for Apache Cassandra from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: quickstart
ms.date: 01/18/2021
---
# Quickstart: Create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal
 

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance.

This quickstart demonstrates how to use the Azure portal to create an Azure Managed Instance for Apache Cassandra cluster.

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account 

<a id="create-account"></a>
## Create a managed instance cluster

1. Go to the [Azure portal](https://portal.azure.com/). Search for and select **Managed Instance for Apache Cassandra**.

    :::image type="content" source="./media/quickstart/search-portal.png" alt-text="Search Azure Portal" border="false":::

2. Click on **Create Managed Instance for Apache Cassandra cluster**.


    :::image type="content" source="./media/quickstart/create-cluster.png" alt-text="Create Cluster" border="false":::


3. On the **Create Managed Instance for Apache Cassandra** page, enter resource group, cluster name, number of nodes, and specify Cassandra admin password that will be created for the cluster. The click on **Next: Networking**.

    :::image type="content" source="./media/quickstart/create-cluster-page.png" alt-text="Create Cluster Page" border="false":::

4. On the **Networking** page, select Virtual Network or create a new one. Then click review and create.

    :::image type="content" source="./media/quickstart/networking.png" alt-text="Networking Page" border="false":::

5. Review and click create.

    :::image type="content" source="./media/quickstart/review-create.png" alt-text="Create Cluster Review Page" border="false":::

6. Once resources are created, the overview page should show cluster name and number of nodes.

    :::image type="content" source="./media/quickstart/overview.png" alt-text="Created Cluster Overview Page" border="false":::

7. You can review cluster nodes from within your existing or newly created VNET:

    :::image type="content" source="./media/quickstart/resources.png" alt-text="View Resources" border="false":::

## Next steps

In this quickstart, you learned how to create an Azure Managed Instance for Apache Cassandra cluster using Azure portal. You can now start working with the cluster. 

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)