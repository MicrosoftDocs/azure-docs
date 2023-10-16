---
title: Configure multi-region writes in your Azure Cosmos DB for MongoDB database
description: Learn how to configure multi-region writes in Azure Cosmos DB for MongoDB
author: gahl-levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/27/2022
ms.author: gahllevy
ms.subservice: mongodb
---

# Configure multi-region writes in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Multi-region writes in Azure Cosmos DB for MongoDB enable your clients to write to multiple regions. This results in lower latency and better availability for your writes. It's important to note that unlike other MongoDB services, Azure Cosmos DB for MongoDB enables you to write data from the same shard to multiple regions. Multi-region writes is a true active-active setup.

## Configure in Azure portal
To enable multi-region writes from Azure portal, use the following steps:

1. Sign-in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB for MongoDB account and from the menu, open the **Replicate data globally** pane.

1. Under the **Multi-region writes** option, choose **enable**. It automatically adds the existing regions to read and write regions.

1. You can add additional regions by selecting the icons on the map or by selecting the **Add region** button. All the regions you add will have both read and writes enabled.

1. After you update the region list, select **save** to apply the changes.

   :::image type="content" source="./media/how-to-multi-region-write/enable-multi-region-writes.png" alt-text="Screenshot to enable multi-region writes using Azure portal." lightbox="./media/how-to-multi-region-write/enable-multi-region-writes.png":::


## Connect your client
MongoDB connection strings supports the “appName” parameter, which is a means to identify client workloads. appName is used to identify the preferred write region for your connection. AppName can be specified in the connection string or using SDK specific initialization methods/properties. 

The appName parameter can be in one of the following formats​:

```powershell
appName=<user-workload-name>​
appName=<user-workload-name>@<preferred-write-region>​
appName=<user-workload-name>@<cosmosdb-account-name>@<preferred-write-region>
```

On multi-region write accounts, Azure portal supports generation of region-specific connection strings to encode the preferred region list​. Selecting the preferred region dropdown will change the appName in the connection string to set the preferred write region. Simply copy the connection string after setting the preferred region. 

   :::image type="content" source="./media/how-to-multi-region-write/connect-multi-region-writes.png" alt-text="Screenshot to connect to multi-region writes account using Azure portal." lightbox="./media/how-to-multi-region-write/connect-multi-region-writes.png":::

We recommend applications deployed to different regions to use the region-specific connection string with the correct preferred region for low-latency writes.

## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](../secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](../role-based-access-control.md).
