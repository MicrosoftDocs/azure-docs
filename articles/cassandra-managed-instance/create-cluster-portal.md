---
title: Quickstart - Create Azure Managed Instance for Apache Cassandra cluster from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: quickstart
ms.date: 03/02/2021
---
# Quickstart: Create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal (Preview)
 
Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart demonstrates how to use the Azure portal to create an Azure Managed Instance for Apache Cassandra cluster.

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account

## <a id="create-account"></a>Create a managed instance cluster

1. Sign in to the [Azure portal](https://portal.azure.com/). Search for and select **Managed Instance for Apache Cassandra**.

   :::image type="content" source="./media/create-cluster-portal/search-portal.png" alt-text="Search for Managed Instance for Apache Cassandra." lightbox="./media/create-cluster-portal/search-portal.png" border="true":::

1. Select **Create Managed Instance for Apache Cassandra cluster** button.

   :::image type="content" source="./media/create-cluster-portal/create-cluster.png" alt-text="Create the cluster." lightbox="./media/create-cluster-portal/create-cluster.png" border="true":::

1. On the **Create Managed Instance for Apache Cassandra** page, The click on **Next: Networking**.

1. On the **Create Managed Instance for Apache Cassandra** pane, enter the following details:

   *  **Subscription** - Choose your subscription.
   * **Resource Group**- Select an existing resource group or create a new one.
   * **Cluster name** - Enter a name for your cluster
   * **Location** - Choose a location where this cluster will be deployed to.
   * **SKU** - The type of SKU
   * **No. of nodes**-  Number of nodes to use for your cluster
   * **Initial Cassandra admin password** - This password will be used to create the cluster.
   * **Confirm Cassandra admin password** - Reenter the password.

   :::image type="content" source="./media/create-cluster-portal/create-cluster-page.png" alt-text="Fill out the create cluster form." lightbox="./media/create-cluster-portal/create-cluster-page.png" border="true":::

1. Select **Next: Networking**.

1. On the **Networking** page, select an existing Virtual Network or create a new one. Then click **Review+create**.

   :::image type="content" source="./media/create-cluster-portal/networking.png" alt-text="Configure networking details." lightbox="./media/create-cluster-portal/networking.png" border="true":::

1. Review and click create.

   :::image type="content" source="./media/create-cluster-portal/review-create.png" alt-text="Review summary to create the cluster." lightbox="./media/create-cluster-portal/review-create.png" border="true":::

1. After the resources are created, the overview page will show the cluster name and the number of nodes.

   :::image type="content" source="./media/create-cluster-portal/overview.png" alt-text="Overview page after the cluster is created." lightbox="./media/create-cluster-portal/overview.png" border="true":::

1. You can then review the cluster nodes within your existing or newly created Azure Virtual Network:

   :::image type="content" source="./media/create-cluster-portal/resources.png" alt-text="View the cluster resources." lightbox="./media/create-cluster-portal/resources.png" border="true":::

## Next steps

In this quickstart, you learned how to create an Azure Managed Instance for Apache Cassandra cluster using Azure portal. You can now start working with the cluster. 

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)