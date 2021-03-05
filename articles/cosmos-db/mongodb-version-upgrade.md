---
title: Upgrade the Mongo version of your Azure Cosmos DB's API for MongoDB account
description: How to upgrade the MongoDB wire-protocol version for your existing Azure Cosmos DB's API for MongoDB accounts seamlessly
author: christopheranderson
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 03/02/2021
ms.author: chrande

---

# Upgrade the API version of your Azure Cosmos DB API for MongoDB account
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

This article describes how to upgrade the API version of your Azure Cosmos DB's API for MongoDB account. After you upgrade, you can use the latest functionality in Azure Cosmos DB's API for MongoDB. The upgrade process doesn't interrupt the availability of your account and it doesn't consume RU/s or decrease the capacity of the database at any point. No existing data or indexes will be affected by this process. 

When upgrading to a new API version, start with development/test workloads before upgrading production workloads. It's important to upgrade your clients to a version compatible with the API version you are upgrading to before upgrading your Azure Cosmos DB API for MongoDB account.

>[!Note]
> At this moment, only qualifying accounts using the server version 3.2 can be upgraded to version 3.6 or 4.0. If your account doesn't show the upgrade option, please [file a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Upgrading to 4.0 or 3.6

### Benefits of upgrading to version 4.0

The following are the new features included in version 4.0:
- Support for multi-document transactions within unsharded collections.
- New aggregation operators
- Enhanced scan performance
- Faster, more efficient storage

### Benefits of upgrading to version 3.6

The following are the new features included in version 3.6:
- Enhanced performance and stability
- Support for new database commands
- Support for aggregation pipeline by default and new aggregation stages
- Support for Change Streams
- Support for compound Indexes
- Cross-partition support for the following operations: update, delete, count and sort
- Improved performance for the following aggregate operations: $count, $skip, $limit and $group
- Wildcard indexing is now supported

### Changes from version 3.2

- By default, the [Server Side Retry (SSR)](prevent-rate-limiting-errors.md) feature is enabled, so that requests from the client application will not return 16500 errors. Instead requests will resume until they complete or hit the 60 second timeout.
- Per request timeout is set to 60 seconds.
- MongoDB collections created on the new wire protocol version will only have the `_id` property indexed by default.

### Action required when upgrading from 3.2

When upgrading from 3.2, the database account endpoint suffix will be updated to the following format:

```
<your_database_account_name>.mongo.cosmos.azure.com
```

If you are upgrading from version 3.2, you will need to replace the existing endpoint in your applications and drivers that connect with this database account. **Only connections that are using the new endpoint will have access to the features in the new API version**. The previous 3.2 endpoint should have the suffix `.documents.azure.com`.

>[!Note]
> This endpoint might have slight differences if your account was created in a Sovereign, Government or Restricted Azure Cloud.

## How to upgrade

1. Go to the Azure portal and navigate to your Azure Cosmos DB API for MongoDB account overview blade. Verify your current server version is what you expect.

    :::image type="content" source="./media/mongodb-version-upgrade/1.png" alt-text="Azure portal with MongoDB account overview" border="false":::

2. From the options on the left, select the `Features` blade. This will reveal the Account level features that are available for your database account.

    :::image type="content" source="./media/mongodb-version-upgrade/2.png" alt-text="Azure portal with MongoDB account overview with Features blade highlighted" border="false":::

3. Click on the `Upgrade Mongo server version` row. If you don't see this option, your account might not be eligible for this upgrade. Please file [a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if that is the case.

    :::image type="content" source="./media/mongodb-version-upgrade/3.png" alt-text="Features blade with options." border="false":::

4. Review the information displayed about the upgrade. Click on `Enable` as soon as you are ready to start the process.

    :::image type="content" source="./media/mongodb-version-upgrade/4.png" alt-text="Expanded upgrade guidance." border="false":::

5. After starting the process, the `Features` menu will show the status of the upgrade. The status will go from `Pending`, to `In Progress`, to `Upgraded`. This process will not affect the existing functionality or operations of the database account.

    :::image type="content" source="./media/mongodb-version-upgrade/5.png" alt-text="Upgrade status after initiating." border="false":::

6. Once the upgrade is completed, the status will show as `Upgraded`. Click on it to learn more about the next steps and actions you need to take to finalize the process. Please [contact support](https://azure.microsoft.com/en-us/support/create-ticket/) if there was an issue processing your request.

    :::image type="content" source="./media/mongodb-version-upgrade/6.png" alt-text="Upgraded account status." border="false":::

7. 
    1. If you upgraded from 3.2, go back to the `Overview` blade, and copy the new connection string to use in your application. The old connection string running 3.2 will not be interrupted. To ensure a consistent experience, all your applications must use the new endpoint.
    2. If you upgraded from 3.6, your existing connection string will be upgraded to the version specified and should continue to be used.

    :::image type="content" source="./media/mongodb-version-upgrade/7.png" alt-text="New overview blade." border="false":::


## How to downgrade
You may also downgrade your account from 4.0 to 3.6 via the same steps in the 'How to Upgrade' section. 

If you upgraded from 3.2 to (4.0 or 3.6) and wish to downgrade back to 3.2, you can simply switch back to using your previous (3.2) connection string with the host `accountname.documents.azure.com` which remains active post-upgrade running version 3.2.


## Next steps

- Learn about the supported and unsupported [features of MongoDB version 4.0](mongodb-feature-support-40.md).
- Learn about the supported and unsupported [features of MongoDB version 3.6](mongodb-feature-support-36.md).
- For further information check [Mongo 3.6 version features](https://devblogs.microsoft.com/cosmosdb/azure-cosmos-dbs-api-for-mongodb-now-supports-server-version-3-6/)
