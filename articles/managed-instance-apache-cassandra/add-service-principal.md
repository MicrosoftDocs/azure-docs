---
title: How to add Azure Cosmos DB service principal for Azure Managed Instance for Apache Cassandra
description: Learn how to add an Azure Cosmos DB service principal to an existing virtual network for Azure Managed Instance for Apache Cassandra
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/02/2021
ms.author: thvankra
ms.custom: ignite-fall-2021, ignite-2022
---

# Use Azure portal to add Azure Cosmos DB service principal

For successful deployment into an existing virtual network, Azure Managed Instance for Apache Cassandra requires the Azure Cosmos DB service principal with a role (such as Network Contributor) that allows the action `Microsoft.Network/virtualNetworks/subnets/join/action`. In some circumstances, it may be required to add these permissions manually. This article shows how to do this using Azure portal. 

## Add Azure Cosmos DB service principal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to the target virtual network in your subscription, select the access control tab, and click on `add role assignment`:

   :::image type="content" source="./media/add-service-principal/service-principal-1.png" alt-text="Add role assignment" lightbox="./media/add-service-principal/service-principal-1.png" border="true"::: 

1. Search for the `Network Contributor` role, highlight it, then select the `members` tab:

   :::image type="content" source="./media/add-service-principal/service-principal-2.png" alt-text="Add Network Contributor" lightbox="./media/add-service-principal/service-principal-2.png" border="true"::: 

   > [!NOTE]
   > You do not need to have a role with permissions as expansive as Network Contributor, this is used as an example for simplicity. You can also create a customer role with narrower permissions, as long as it allows the action `Microsoft.Network/virtualNetworks/subnets/join/action`

1. Ensure that `User, group, or service principal` is selected for `Assign access to`, and then click `Select members` to search for the `Azure Cosmos DB` service principal. Select it in the right hand side window:

   :::image type="content" source="./media/add-service-principal/service-principal-3.png" alt-text="Select Azure Cosmos DB service principal" lightbox="./media/add-service-principal/service-principal-3.png" border="true"::: 

1. Click on the `Review + assign` tab at the top, then click the `Review + assign` button at the bottom. The Azure Cosmos DB service principal should now be assigned.

   :::image type="content" source="./media/add-service-principal/service-principal-4.png" alt-text="Review and assign" lightbox="./media/add-service-principal/service-principal-4.png" border="true"::: 

## Next steps

In this article, you learned how to assign the Azure Cosmos DB service principal with an appropriate role to a virtual network, to allow managed Cassandra deployments. Learn more about Azure Managed Instance for Apache Cassandra with the following articles:

* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
