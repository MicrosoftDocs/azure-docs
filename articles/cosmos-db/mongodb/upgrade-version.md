---
title: Upgrade the Mongo version
titleSuffix: Azure Cosmos DB for MongoDB
description: How to upgrade the MongoDB wire-protocol version for your existing Azure Cosmos DB's API for MongoDB accounts seamlessly
author: gahl-levy
ms.author: gahllevy
ms.service: azure-cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 06/06/2024
#Customer Intent: As a developer, I want to change my MongoDB version, so that I can use the features I need in my applications.
---

# Upgrade the API version of your Azure Cosmos DB for MongoDB account

[!INCLUDE[MongoDB](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb.md)]

This article describes how to upgrade the API version of your Azure Cosmos DB's API for MongoDB account. After your upgrade, you can use the latest functionality in Azure Cosmos DB's API for MongoDB. The upgrade process doesn't interrupt the availability of your account and it doesn't consume RU/s or decrease the capacity of the database at any point. This process doesn't affect existing data or indexes.

When upgrading to a new API version, start with development/test workloads before upgrading production workloads. It's important to upgrade your clients to a version compatible with the API version you're upgrading to before upgrading your Azure Cosmos DB for MongoDB account.

> [!WARNING]
> At this moment, only qualifying accounts using the server version 3.2 can be upgraded to version 3.6 and higher. If your account doesn't show the upgrade option, please [file a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Upgrade your version

1. Sign into the [Azure portal.](https://portal.azure.com/)

1. Navigate to your Azure Cosmos DB for MongoDB account. Open the **Overview** pane and verify that your current **Server version** is either 3.2 or 3.6.

    :::image type="content" source="media/upgrade-version/check-current-version.png" alt-text="Screenshot of how to check the current version of your MongoDB account from the Azure portal.":::

1. From the left menu, open the `Features` pane. This pane shows the account level features that are available for your database account.

1. Select the `Upgrade MongoDB server version` row. If you don't see this option, your account might not be eligible for this upgrade. File [a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if that is the case.

    :::image type="content" source="media/upgrade-version/upgrade-server-version.png" alt-text="Screenshot of the features page to0 upgrade your account.":::

1. Review the information displayed about the upgrade. Select `Set server version to 4.2` (or 4.0 or 3.6 depending upon your current version).

    :::image type="content" source="media/upgrade-version/select-upgrade.png" alt-text="Screenshot of upgrade guidance and the select upgrade option.":::

1. After you start the upgrade, the **Feature** menu is greyed out, and the status is set to *Pending*. The upgrade takes around 15 minutes to complete. This process doesn't affect the existing functionality or operations of your database account. After it's complete, the **Update MongoDB server version** status will show the upgraded version. [Contact support](https://azure.microsoft.com/support/create-ticket/) if there was an issue processing your request.

1. The following are some considerations after upgrading your account:

    1. If you upgraded from 3.2, go back to the **Overview** pane, and copy the new connection string to use in your application. The old connection string running 3.2 isn't interrupted. To ensure a consistent experience, all your applications must use the new endpoint.

    1. If you upgraded from 3.6, your existing connection string is upgraded to the version specified and should continue to be used.

> [!IMPORTANT]
> When upgrading from 3.2, the database account endpoint suffix will be updated to the following format: `<your_database_account_name>.mongo.cosmos.azure.com`. This endpoint may have slight differences if your account was created in a Sovereign, Government or Restricted Azure Cloud.
>
> If you are upgrading from version 3.2, you will need to replace the existing endpoint in your applications and drivers that connect with this database account. **Only connections that are using the new endpoint will have access to the features in the new API version**. The previous 3.2 endpoint should have the suffix `.documents.azure.com`.
> When upgrading from 3.2 to newer versions, [compound indexes](indexing.md) are now required to perform sort operations on multiple fields to ensure stable, high performance for these queries. Ensure that these compound indexes are created so that your multi-field sorts succeed.

## Downgrade your version

You can also downgrade your account to 4.0 or 3.6 via the same steps in the [upgrade your version](#upgrade-your-version) section.

1. If you upgraded from 3.2 to and wish to downgrade back to 3.2, switch back to using your previous (3.2) connection string with the host `accountname.documents.azure.com`, which remains active post-upgrade running version 3.2.

1. Change the connection string in your application.

## Related content

- [MongoDB version 6.0 features](feature-support-60.md)
- [MongoDB version 5.0 features](feature-support-50.md)
- [MongoDB version 4.2 features](feature-support-42.md)
- [MongoDB version 4.0 features](feature-support-40.md)
- [MongoDB version 3.6 features](feature-support-36.md)
- [MongoDB version history](https://www.mongodb.com/resources/products/mongodb-version-history)
