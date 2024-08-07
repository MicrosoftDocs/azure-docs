---
title: |
  Quickstart: Create and us a cross-region replica in Azure Cosmos DB for MongoDB vCore 
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this quickstart, create a new Azure Cosmos DB for MongoDB vCore cluster replica in another region for disaster recovery (DR) and read scaling purposes in the Azure portal.
author: niklarin
ms.author: nlarin
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: quickstart
ms.date: 06/12/2024
---

# Quickstart: Create and use a cross-region cluster replica in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

In this quickstart, you create a cluster replica in another region for an Azure Cosmos DB for MongoDB vCore cluster for disaster recovery (DR) purposes. This replica cluster stores a copy of all of your MongoDB resources - databases, collections, and documents - in another Azure region. The replica cluster provides a unique endpoint for various tools and SDKs to connect to and could be promoted to become available for writes if there's a primary region outage.

> [!IMPORTANT]
> Cross-region replication in Azure Cosmos DB for MongoDB vCore is currently in preview.
> This preview version is provided without a service level agreement (SLA), and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained
> capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- [MongoDB shell](https://www.mongodb.com/try/download/shell)

## Create a new cluster and its replica in another region

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
    
    In-region high availablity provides an in-region solution where a copy of data from each shard in a cluster is streamed to its standby counterpart located in the same region but in a different availability zone (AZ). High availability uses synchronous replication with zero data loss and automatic failure detection and failover while preserving the connection string intact after failover. High availability might be enabled on the primary cluster for an additional layer of protection from failures.

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

1. On the **Global distribution (preview)** tab, select **Enable** for **Read replica in another region (preview)** to create a cluster read replica as a part of this new primary cluster provisioning.

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

1. Review the settings you provided, and then select **Create**. It takes a few minutes to create the cluster. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB for MongoDB cluster page.

   :::image type="content" source="media/quickstart-portal/deployment-complete.png" alt-text="Screenshot of the deployment page for a cluster.":::

## Connect to primary cluster and ingest data

Get the connection string you need to connect to the primary (read-write) cluster in the Azure portal.

1. From the Azure Cosmos DB for MongoDB vCore primary cluster page, select the **Connection strings** navigation menu option under **Settings**.

   :::image type="content" source="media/quickstart-cross-region-replication/select-connection-strings-option.png" alt-text="Screenshot of the connection strings page in the cluster properties.":::

1. Copy the value from the **Connection string** field.
   
    > [!IMPORTANT]
   > The connection string in the portal does not include the username and password values. You must replace the `<user>` and `<password>` placeholders with the credentials you entered when you created the cluster.

1. In command line, use the MongoDB shell to connect to the primary cluster using the connection string.

```cmd
mongosh mongodb+srv://<user>@<primary_cluster_name>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Ingest data

Create a *my_script.js* script file to run it from the MongoDB shell. 

```JavaScript
    let dogDocs = [
      {
        name: "pooch",
        breed: "poodle",
        weight: "6 lbs"
      },
      {
        name: "mutt",
        breed: "bulldog",
        weight: "10 lbs"
      }
    ];
    
    let catDocs = [
      {
        name: "minni", 
        breed: "persian",
        color: "white"
      },
      {
        name: "tinkle",
        breed: "bombay",
        color: "black"
      }
    ];
    
    let dogIndex = { name : 1 };
    let catIndex = { name : 1 };
    
    let collInfoObjs = [ 
      { coll: "dogs", data: dogDocs, index: dogIndex }, 
      { coll: "cats", data: catDocs, index: catIndex } 
    ];
    
    for (obj of collInfoObjs) {
        db[obj.coll].insertMany(obj.data);
        db[obj.coll].createIndex(obj.index);
    }
```

This script file creates two collections and inserts documents with data into those collections.
Save my_script.js file in a folder accessible to the MongoDB shell session.

Run the script from the MongoDB shell connected to the primary MongoDB cluster.

```MongoDB Shell
load(my_script.js);
```

In the MongoDB shell connected to the primary MongoDB cluster, read data from the database.

```MongoDB Shell
db.dogs.find();
db.cats.find();
```
    
## Enable access to replica cluster

> [!IMPORTANT]
> Replica clusters are always created with networking access disabled. You should add firewall rules on the replica cluster after it is created to enable read operations.

1. From the Azure Cosmos DB for MongoDB vCore *primary* cluster page, select the **Global distribution (preview)** page under **Settings**.

   :::image type="content" source="media/quickstart-cross-region-replication/global-distribution-page-on-primary-cluster.png" alt-text="Screenshot of the global distribution preview page in the primary cluster properties.":::

1. Select *cluster replica name* in the **Read replica** field to open the read cluster replica properties in the Azure portal.
 
1. On the MongoDB vCore replica cluster page, under **Settings**, select **Networking**.

1. On the **Networking** page, select **Add current client IP address** to create a firewall rule with the public IP address of your computer, as perceived by the Azure system. 

    :::image type="content" source="media/quickstart-cross-region-replication/cluster-networking-adding-firewall-rule.png" alt-text="Screenshot of the networking page on read replica cluster.":::

    Verify your IP address before saving this configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the Internet and Azure services. You can also select add 0.0.0.0 - 255.255.255.255 firewall rule to allow not just your IP, but the whole Internet to access the cluster. In this situation, clients still must log in with the correct username and password to use the cluster.

1. Select **Save** on the toolbar to save the settings. It might take a few minutes for the updated networking settings to become effective.

## Connect to read replica cluster in another region and read data

Get the connection string for the read cluster replica in another region.

1. On the replica cluster sidebar, under **Cluster management**, select **Connection strings**.

1. Copy the value from the **Connection string** field.
   
    > [!IMPORTANT]
   > The connection string of the read replica cluster contains unique *replica cluster name* that you selected during replica creation. The username and password values for the read replica cluster are always the same as the ones on its primary cluster.

1. In command line, use the MongDB shell to connect to the read replica cluster using its connection string.

```cmd
mongosh mongodb+srv://<user>@<cluster_replica_name>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Read data from replica cluster

In the MongoDB shell connected to the replica cluster, read data from the database.

```MongoDB Shell
db.dogs.find();
db.cats.find();
```

## Promote replica cluster

To promote a cluster read replica to a read-write cluster, follow these steps:

1. Select the *read replica cluster* in the portal.

1. On the cluster sidebar, under **Cluster management**, select **Global distribution (preview)**.

1. On the **Global distribution (preview)** page, select **Promote** on the toolbar to initiate read replica promotion to read-write cluster. 

      :::image type="content" source="media/quickstart-cross-region-replication/replica-cluster-promotion.png" alt-text="Screenshot of the read replica cluster global distribution preview page with the promote button.":::

1. In the **Promote cluster** pop-up window, confirm that you understand how replica promotion works, and select **Promote**. Replica promotion might take a few minutes to complete.

    :::image type="content" source="media/quickstart-cross-region-replication/replica-cluster-promotion-confirmation.png" alt-text="Screenshot of the read replica cluster global distribution preview page with the promote confirmation pop-up window.":::

### Write to promoted cluster replica

Once replica promotion is completed, the promoted replica becomes available for writes and the former primary cluster is set to read-only.

Use the MongDB shell in command line to connect to *the promoted replica cluster* using its connection string.

```cmd
mongosh mongodb+srv://<user>@<promoted_replica_cluster_name>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

In the MongoDB shell session, perform a write operation.

```MongoDB Shell
db.createCollection('foxes')
```

Use the MongDB shell in command line to connect to *the new replica cluster* (former primary cluster) using its connection string.

```cmd
mongosh mongodb+srv://<user>@<new_replica_cluster_name>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

In the MongoDB shell, confirm that writes are now disabled on the new replica (former primary cluster).

```MongoDB Shell
db.createCollection('bears')
```

## Clean up resources

When you're done with Azure Cosmos DB for MongoDB vCore cluster, you can delete the Azure resources you created so you don't incur more charges.

1. In the Azure portal search bar, search for and select **Resource groups**.

1. In the list, select the resource group you used for this quickstart.

    :::image type="content" source="media/quickstart-portal/locate-resource-group.png" alt-text="Screenshot of a list of resource groups filtered down to a specific prefix.":::

1. On the resource group page, select **Delete resource group**.

    :::image type="content" source="media/quickstart-portal/select-delete-resource-group-option.png" alt-text="Screenshot of the delete resource group option in the menu for a specific resource group.":::

1. In the deletion confirmation dialog, enter the name of the resource group to confirm that you intend to delete it. Finally, select **Delete** to permanently delete the resource group.

    :::image type="content" source="media/quickstart-portal/delete-resource-group-dialog.png" alt-text="Screenshot of the delete resource group confirmation dialog with the name of the group filled out.":::

## Related content

In this guide, you learned how to create a cluster read replica for an Azure Cosmos DB for MongoDB vCore cluster and use it for disaster recovery and cross-region read scalability purposes. 

- [Learn about cross-region replication in Azure Cosmos DB for MongoDB vCore](./cross-region-replication.md)
- [Migrate data to Azure Cosmos DB for MongoDB vCore](./migration-options.md)