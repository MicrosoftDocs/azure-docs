---
title: |
  Quickstart: Create and us a cross-region replica in Azure Cosmos DB for MongoDB vCore 
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this quickstart, create a new Azure Cosmos DB for MongoDB vCore cluster replica in another region for disaster recovery (DR) and read scaling purposes in the Azure portal.
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: quickstart
ms.date: 06/12/2024
---

# Quickstart: Create and use a cross-region cluster replica in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

In this quickstart, you create a cluster replica in another region for an Azure Cosmos DB for MongoDB vCore cluster for disaster recovery (DR) purposes. This replica cluster stores a copy of all of your MongoDB resources - databases, collections, and documents - in another Azure region. The replica cluster provides a unique endpoint for various tools and SDKs to connect to and could be promoted to become available for writes in case of the primary region outage.

> [!IMPORTANT]
> Cross-region replication in Azure Cosmos DB for MongoDB vCore is currently in preview.
> This preview version is provided without a service level agreement (SLA), and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained
> capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create a cluster replica for a new cluster

Create a MongoDB cluster with a cluster read replica in another region by using Azure Cosmos DB for MongoDB vCore.

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Which API best suits your workload?** page, select the **Create** option within the **Azure Cosmos DB for MongoDB** section. 

   :::image type="content" source="media/quickstart-portal/select-api-option.png" lightbox="media/quickstart-portal/select-api-option.png" alt-text="Screenshot of the select API option page for Azure Cosmos DB.":::

1. On the **Which type of resource?** page, select the **Create** option within the **vCore cluster** section. For more information, see [overview of the vCore architecture in Azure Cosmos DB for MongoDB](introduction.md).

    :::image type="content" source="media/quickstart-portal/select-resource-type.png" alt-text="Screenshot of the select resource type option page for Azure Cosmos DB for MongoDB.":::

1. On the **Create Azure Cosmos DB for MongoDB cluster** page, select the **Access to global distribution (preview)** option within the **Cluster details** section.

    :::image type="content" source="media/quickstart-cross-region-replication/select-access-to-cross-region-replication-preview.png" alt-text="Screenshot of the access to global distribution preview.":::
  
    > [!IMPORTANT]
  > You should select **Access to global distribution (preview)** during provisioning to be able to create a preview replica cluster.

1. On the **Create Azure Cosmos DB for MongoDB cluster** page, select the **Configure** option within the **Cluster tier** section.

    :::image type="content" source="media/quickstart-portal/select-cluster-option.png" alt-text="Screenshot of the cluster configuration option for a new Azure Cosmos DB for MongoDB cluster.":::

1. On the **Scale** page, leave the options set to their default values:

    | Setting | Value |
    | --- | --- |
    | **Shard count** | 1 shard |
    | **Cluster tier** | M30 Tier, 2 vCores, 8 GiB RAM |
    | **Storage** | 128 GiB |

1. Unselect the **High availability** option. In the high availability (HA) acknowledgment section, select **I understand**. Finally, select **Save** to persist your changes to the cluster configuration.

    :::image type="content" source="media/quickstart-portal/configure-scale.png" alt-text="Screenshot of cluster tier and scale options for a cluster.":::

1. Back on the cluster page, enter the following information:

    | Setting | Value | Description |
    | --- | --- | --- |
    | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos DB for MongoDB cluster and its replica cluster. |
    | Resource group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    | Cluster name | A globally unique name | Enter a name to identify your Azure Cosmos DB for MongoDB cluster. The name is used as part of a fully qualified domain name (FQDN) with a suffix of *mongodbcluster.cosmos.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3 and 40 characters in length. |
    | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB for MongoDB cluster with read and write capabilities, the primary cluster. Use the location that is closest to your users to give them the fastest access to the data. |
    | MongoDB version | Version of MongoDB to run on your cluster |  This value is set to a default of the most recent MongoDB version available. |
    | Admin username | Provide a username to access the cluster | This user is created on the cluster as a user administrator. |
    | Password | Use a unique password to pair with the username | Password must be at least 8 characters and at most 128 characters. |

    :::image type="content" source="media/quickstart-cross-region-replication/configure-cluster.png" alt-text="Screenshot of various configuration options for a cluster.":::

1. Select **Next: Global distribution (preview)**.

1. Select **Enable** for **Read replica in another region (preview)** to create a cluster read replica as a part of this new primary cluster provisioning.

1. In the **Read replica name** field, enter a name for the cluster read replica. It should be a globally unique cluster name.

1. Select a value from the **Read replica region** drop-down list.

   :::image type="content" source="media/quickstart-cross-region-replication/global-distribution-tab.png" alt-text="Screenshot of the global distribution tab in cluster provisioning.":::

1. Select **Next: Networking**.

1. On the **Networking** tab, select **Add current client IP address** to create a firewall rule with the public IP address of your computer, as perceived by the Azure system. 

    :::image type="content" source="media/quickstart-cross-region-replication/networking-adding-firewall-rule.png" alt-text="Screenshot of networking settings.":::

Verify your IP address before saving this configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the Internet and Azure services. Thus, you may need to change the start IP and end IP to make the rule function as expected. Use a search engine or other online tool to check your own IP address. For example, search for *what is my IP*.

   :::image type="content" source="media/quickstart-cross-region-replication/what-is-my-ip.png" alt-text="Screenshot of a web search result for the current host's public IP address.":::

You can also select add 0.0.0.0 - 255.255.255.255 firewall rule to allow not just your IP, but the whole Internet to access the cluster. In this situation, clients still must log in with the correct username and password to use the cluster. Nevertheless, it's best to allow worldwide access for only short periods of time and for only non-production databases.

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
