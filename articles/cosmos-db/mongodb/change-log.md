---
title: Change Log for Mongo
description: Notifies our customers of any minor/medium updates that were pushed
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: 
ms.date: 06/22/2022
author: t-khelan
ms.author: t-khelanmodi
---

<!-- # Use MongoDB Compass to connect to Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

This tutorial demonstrates how to use [MongoDB Compass](https://www.mongodb.com/products/compass) when storing and/or managing data in Cosmos DB. We use the Azure Cosmos DB's API for MongoDB for this walk-through. For those of you unfamiliar, Compass is a GUI for MongoDB. It is commonly used to visualize your data, run ad-hoc queries, along with managing your data.

Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Cosmos DB. -->

<!--
## Pre-requisites

To connect to your Cosmos DB account using MongoDB Compass, you must:

* Download and install [Compass](https://www.mongodb.com/download-center/compass?jmp=hero)
* Have your Cosmos DB [connection string](connect-mongodb-account.md) information -->

## Jan - April 2022 Updates

### $expr 
Support $expr in Mongo 3.6 and 4.0.

This change adds support for both in memory and backend $expr. Furthermore we now have the infra to support compute only query operators.

This will allow us to support 3.6 style $lookup. There are future improvement available including more push down, point lookup, and _id/shard key constraints.

### Expose Mongo native userId in diagnostic logs
Reach out to Ashwini for this 

###  RBAC for $merge stage
Read doc

### Add Hyperbolic trigonometric operators
Read doc 

### Use federation host name for RoutingGatewayConfiguration calls
Reach out to Dmitri 


### Bump packages and .NET TargetRuntime versions
Bump more packages and remove VersionOverrides under Compute, Mongo and CLuB.

Migrate more projects to .net 6.0

Remove referencees to the CBT Symbol Indexing package. This is because Symbol indexing is done by CloudBuild and that package was about pushing to symweb which is no longer supported.

Remove moderncop since it is enabled only when EnableModernCop is set, and that is not set anywhere in our repo.
ModernCop also does not run today in CloudBuild builds.


<!--
To connect your Cosmos DB account to Compass, you can follow the below steps:

1. Retrieve the connection information for your Cosmos account configured with Azure Cosmos DB's API MongoDB using the instructions [here](connect-mongodb-account.md).

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-connection.png" alt-text="Screenshot of the connection string blade":::

2. Click on the button that says **Copy to clipboard** next to your **Primary/Secondary connection string** in Cosmos DB. Clicking this button will copy your entire connection string to your clipboard.

    :::image type="content" source="./media/connect-using-compass/mongodb-connection-copy.png" alt-text="Screenshot of the copy to clipboard button":::

3. Open Compass on your desktop/machine and click on **Connect** and then **Connect to...**.

4. Compass will automatically detect a connection string in the clipboard, and will prompt to ask whether you wish to use that to connect. Click on **Yes** as shown in the screenshot below.

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-detect.png" alt-text="Screenshot shows a dialog box explaining that your have a connection string on your clipboard.":::

5. Upon clicking **Yes** in the above step, your details from the connection string will be automatically populated. Remove the value automatically populated in the **Replica Set Name** field to ensure that is left blank.

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-replica.png" alt-text="Screenshot shows the Replica Set Name text box.":::

6. Click on **Connect** at the bottom of the page. Your Cosmos DB account and databases should now be visible within MongoDB Compass.
--> 

## Next steps
- TBD
