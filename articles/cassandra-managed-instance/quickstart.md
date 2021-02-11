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

Go to the [Azure portal](https://portal.azure.com/). Search for and select **Managed Instance for Apache Cassandra**.


![Search Azure Portal](./media/quickstart/search-portal.png)


Click on **Create Managed Instance for Apache Cassandra cluster**.


![Create Cluster](./media/quickstart/create-cluster.png)


On the **Create Managed Instance for Apache Cassandra** page, enter resource group, cluster name, number of nodes, and specify Cassandra admin password that will be created for the cluster. The click on **Next: Networking**.


![Create Cluster Page](./media/quickstart/create-cluster-page.png)

On the **Networking** page, select Virtual Network or create a new one. Then click review and create.

![Networking Page](./media/quickstart/networking.png)

Review and click create.

![Create Cluster Review Page](./media/quickstart/review-create.png)

Once resources are created, the overview page should show cluster name and number of nodes.

![Created Cluster Overview Page](./media/quickstart/overview.png)

You can review cluster nodes from within your existing or newly created VNET:

![View Resources](./media/quickstart/resources.png)

## Next steps

In this quickstart, you learned how to create an Azure Managed Instance for Apache Cassandra cluster using Azure portal. You can now start working with the cluster. 

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)