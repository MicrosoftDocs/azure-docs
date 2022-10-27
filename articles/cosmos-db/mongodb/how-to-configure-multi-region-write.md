---
title: Configure multi-region writes in your Azure Cosmos DB for MongoDB database
description: Learn how to configure multi-region writes in Azure Cosmos DB for MongoDB
author: gahl-levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/27/2022
ms.author: gahllevy
---

# Configure multi-region writes in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Multi-region writes in Azure Cosmos DB for MongoDB enable your clients to write to multiple regions. This results in lower latency and better availability for your writes. It's important to note that unlike other MongoDB service, Azure Cosmos DB for MongoDB is the only service which enables you to write data from the same shard to multiple regions. Multi-region writes is a true active-active setup.

### Configure in Azure Portal
To enable multi-region writes from Azure portal, use the following steps:

1. Sign-in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB for MongoDB account and from the menu, open the **Replicate data globally** pane.

1. Under the **Multi-region writes** option, choose **enable**. It automatically adds the existing regions to read and write regions.

1. You can add additional regions by selecting the icons on the map or by selecting the **Add region** button. All the regions you add will have both read and writes enabled.

1. After you update the region list, select **save** to apply the changes.

   :::image type="content" source="./media/how-to-multi-master/enable-multi-region-writes.png" alt-text="Screenshot to enable multi-region writes using Azure portal" lightbox="./media/how-to-multi-master/enable-multi-region-writes.png":::


### Connect your client
Privileges are actions that can be performed on a specific resource. For example, "read access to collection xyz". Privileges are assigned to a specific role.


## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](../secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](../role-based-access-control.md).
