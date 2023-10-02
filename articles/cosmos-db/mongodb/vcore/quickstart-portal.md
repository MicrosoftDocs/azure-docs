---
title: |
  Quickstart: Create a new cluster
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this quickstart, create a new Azure Cosmos DB for MongoDB vCore cluster to store databases, collections, and documents by using the Azure portal.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: quickstart
ms.date: 08/28/2023
---

# Quickstart: Create an Azure Cosmos DB for MongoDB vCore cluster by using the Azure portal

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

In this quickstart, you create a new Azure Cosmos DB for MongoDB vCore cluster. This cluster contains all of your MongoDB resources: databases, collections, and documents. The cluster provides a unique endpoint for various tools and SDKs to connect to Azure Cosmos DB and perform everyday operations.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create a cluster

Create a MongoDB cluster by using Azure Cosmos DB for MongoDB vCore.

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Which API best suits your workload?** page, select the **Create** option within the **Azure Cosmos DB for MongoDB** section. For more information, see [API for MongoDB and it's various models](../choose-model.md).

   :::image type="content" source="media/quickstart-portal/select-api-option.png" lightbox="media/quickstart-portal/select-api-option.png" alt-text="Screenshot of the select API option page for Azure Cosmos DB.":::

1. On the **Which type of resource?** page, select the **Create** option within the **vCore cluster** section. For more information, see [API for MongoDB vCore overview](introduction.md).

    :::image type="content" source="media/quickstart-portal/select-resource-type.png" alt-text="Screenshot of the select resource type option page for Azure Cosmos DB for MongoDB.":::

1. On the **Create Azure Cosmos DB for MongoDB cluster** page, select the **Configure** option within the **Cluster tier** section.

    :::image type="content" source="media/quickstart-portal/select-cluster-option.png" alt-text="Screenshot of the configure cluster option for a new Azure Cosmos DB for MongoDB cluster.":::

1. On the **Scale** page, leave the options set to their default values:

    | Setting | Value |
    | --- | --- |
    | **Node count** | Single node |
    | **Cluster tier** | M30 Tier, 2 vCores, 8-GiB RAM |
    | **Storage per node** | 128 GiB |

1. Leave the **High availability** option unselected. In the high availability (HA) acknowledgment section, select **I understand**. Finally, select **Save** to persist your changes to the cluster tier.

    :::image type="content" source="media/quickstart-portal/configure-scale.png" alt-text="Screenshot of cluster tier and scale options for a cluster.":::

1. Back on the cluster page, enter the following information:

    | Setting | Value | Description |
    | --- | --- | --- |
    | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos DB for MongoDB cluster. |
    | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    | cluster Name | A unique name | Enter a name to identify your Azure Cosmos DB for MongoDB cluster. The name is used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
    | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB for MongoDB cluster. Use the location that is closest to your users to give them the fastest access to the data. |
    | MongoDB version | Version of MongoDB to run in your cluster |  This value is set to a default of **5.0** |
    | Admin username | Provide a username to access the cluster | This user is created on the cluster as a user administrator. |
    | Password | Use a unique password to pair with the username | Password must be at least eight characters and at most 128 characters. |

    :::image type="content" source="media/quickstart-portal/configure-cluster.png" alt-text="Screenshot of various configuration options for a cluster.":::

1. Select **Next: Networking**.

1. In the **Networking** section, select **Allow public access from Azure services**. Additionally, add a firewall rule to give your client device or applications access to the cluster.

    :::image type="content" source="media/quickstart-portal/configure-cluster.png" alt-text="Screenshot of networking and firewall options for a cluster.":::

    > [!NOTE]
    > In many corporate environments, developer machine IPs are hidden due to a VPN. In these cases, it's recommended to start with allowing access to all IPs for connection testing initially before refining the allow-list.

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the cluster. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB for MongoDB cluster page.

   :::image type="content" source="media/quickstart-portal/deployment-complete.png" alt-text="Screenshot of the deployment page for a cluster.":::

## Get cluster credentials

Get the connection string you need to connect to this cluster using your application code.

1. From the Azure Cosmos DB for MongoDB vCore cluster page, select the **Connection strings** navigation menu option.

   :::image type="content" source="media/quickstart-portal/select-connection-strings-option.png" alt-text="Screenshot of the connection strings option on the page for a cluster.":::

1. Record the value from the **Connection string** field.

   :::image type="content" source="media/quickstart-portal/connection-string-value.png" alt-text="Screenshot of the connection string credential for a cluster.":::

    > [!IMPORTANT]
    > The connection string in the portal does not include the username and password values. You must replace the `<user>` and `<password>` placeholders with the credentials you used when you originally created the cluster.

## Clean up resources

When you're done with Azure Cosmos DB for MongoDB vCore cluster, you can delete the Azure resources you created so you don't incur more charges.

1. In the Azure portal search bar, search for and select **Resource groups**.

1. In the list, select the resource group you used for this quickstart.

    :::image type="content" source="media/quickstart-portal/locate-resource-group.png" alt-text="Screenshot of a list of resource groups filtered down to a specific prefix.":::

1. On the resource group page, select **Delete resource group**.

    :::image type="content" source="media/quickstart-portal/select-delete-resource-group-option.png" alt-text="Screenshot of the delete resource group option in the menu for a specific resource group.":::

1. In the deletion confirmation dialog, enter the name of the resource group to confirm that you intend to delete it. Finally, select **Delete** to permanently delete the resource group.

    :::image type="content" source="media/quickstart-portal/delete-resource-group-dialog.png" alt-text="Screenshot of the delete resource group confirmation dialog with the name of the group filled out.":::

## Next step

In this guide, you learned how to create an Azure Cosmos DB for MongoDB vCore cluster. You can now migrate data to your cluster.

> [!div class="nextstepaction"]
> [Migrate data to Azure Cosmos DB for MongoDB vCore](migration-options.md)
