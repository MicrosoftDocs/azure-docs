---
title: Upgrade your Mongo version on Azure Cosmos DB's API for MongoDB
description: How to upgrade the MongoDB wire-protocol version for your existing Azure Cosmos DB's API for MongoDB seamlessly
author: LuisBosquez
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: guide
ms.date: 09/09/2020
ms.author: lbosq

---

# Upgrade the version of your Azure Cosmos DB's API for MongoDB account

This article describes how to upgrade the wire protocol version of your Azure Cosmos DB's API for MongoDB account. Upgrading the wire protocol version provides the latest functionality in Azure Cosmos DB's API for MongoDB. The upgrade process doesn't interrupt the availability of your account and it doesn't consume RU/s or decrease the capacity of the database at any point. No existing data or indexes will be affected by this process.

>[!Note]
> At this moment, only qualifying accounts using the server version 3.2 can be upgraded to version 3.6. If your account doesn't show the upgrade option, please file a support ticket.

## Upgrading from version 3.2 to 3.6

### Benefits of upgrading to version 3.6
The following is the new functionality included in version 3.6:
- Enhanced performance and stability
- Support for new database commands
- Support for aggregation pipeline by default and new aggregation stages
- Support for Change Streams
- Support for Compound Indexes
- Cross-partition support for the following operations: update, delete, count and sort
- Improved performance for the following aggregate operations: $count, $skip, $limit and $group

### Changes from version 3.2
- MongoDB collections created on the new wire protocol version will only have the `_id` property indexed by default.
- Per request timeout is set to 60 seconds.

### Action required
For the upgrade to version 3.6, the database account endpoint suffix will be updated to the following format:

```
<your_database_account_name>.mongo.cosmos.azure.com
```

This new endpoint will need to be replace the existing one in the applications and drivers that connect with this database account. **Only connections that are using the new endpoint will have access to the features in the MongoDB version 3.6.**

### How to upgrade

1. First, go to the Azure Portal and navigate to your Azure Cosmos DB API for MongoDB account overview blade. Verify that your server version is `3.2`. 

    :::image type="content" source="./media/mongodb-version-upgrade/1.png" alt-text="Azure Portal with MongoDB account overview" border="false":::

2. From the options on the left, select the `Features` blade. This will reveal the Account level features that are available for your database account.

    :::image type="content" source="./media/mongodb-version-upgrade/2.png" alt-text="Azure Portal with MongoDB account overview with Features blade highlighted" border="false":::

3. Click on the `Upgrade to Mongo server version 3.6` row. If you don't see this option, your account might not be eligible for this upgrade.

    :::image type="content" source="./media/mongodb-version-upgrade/3.png" alt-text="Features blade with options." border="false":::

4. Review the information displayed about this specific upgrade. Note that the upgrade will only be completed until your applications use the updated endpoint, as highlighted in this section. Click on `Enable` as soon as you are ready to start the process.

    :::image type="content" source="./media/mongodb-version-upgrade/4.png" alt-text="Expanded upgrade guidance." border="false":::

5. After starting the process, the `Features` menu will show the status of the upgrade. The status will go from `Pending`, to `In Progress`, to `Upgraded`. This process will not affect the existing functionality or operations of the database account.

    :::image type="content" source="./media/mongodb-version-upgrade/5.png" alt-text="Upgrade status after initiating." border="false":::

6. Once the upgrade is completed, the status will show as `Upgraded`. Click on it to learn more about the next steps and actions you need to take to finalize the process.

    :::image type="content" source="./media/mongodb-version-upgrade/6.png" alt-text="Upgraded account status." border="false":::

7. **To start using the upgraded version of your database account**, go back to the `Overview` blade, and copy the new connection string to use in your application. The applications will start using the upgraded version as soon as they connect to the new endpoint. Existing connections will not be interrupted and can be updated at your convenience.

    :::image type="content" source="./media/mongodb-version-upgrade/7.png" alt-text="New overview blade." border="false":::

## Next steps

- Learn about the supported and unsupported [features of MongoDB version 3.6](mongodb-feature-support-36.md).
- For further information check [Mongo 3.6 version features](https://devblogs.microsoft.com/cosmosdb/azure-cosmos-dbs-api-for-mongodb-now-supports-server-version-3-6/)