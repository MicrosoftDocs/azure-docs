---
title: Using Mongo ReadPreference with Azure Cosmos DB's MongoDB API  | Microsoft Docs
description: Learn how to use MongoDB ReadPreference against Azure CosmosDB with MongoDB API
services: cosmos-db
documentationcenter: ''
author: viviswan
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.custom: geo, readpreference
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: 
ms.topic: article
ms.date: 02/26/2017
ms.author: viviswan

---
# How to globally distribute reads using ReadPreference with Azure Cosmos DB's MongoDB API 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This article shows how to globally distribute read operations using [MongoDB Readpreference](https://docs.mongodb.com/manual/core/read-preference/) settings with Azure Cosmos DB's MongoDB API. 

## Prerequisites 
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
[!INCLUDE [cosmos-db-emulator-mongodb](../../includes/cosmos-db-emulator-mongodb.md)]

Refer to this [Quickstart](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-global-distribution-mongodb) article  for using the Azure portal to set up Azure Cosmos DB account with global distribution  and then connect using MongoDB API.

## Clone the sample application

Open a git terminal window, such as git bash, and `cd` to a working directory.  

Run the following commands to clone the sample repository. Based on your platform of interest, use one of the following sample repositories:

1. [.NET Sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference)
2. [NodeJS Sample application]( https://github.com/Azure-Samples/azure-cosmos-db-mongodb-node-geo-readpreference)
3. [Java Sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference)


```bash
git clone <sample repo url>
```

## Run the application

Depending on the platform used, install the required packages and start the application. To install dependencies, follow the README included in the sample application repository. For instance, in NodeJS sample application, the steps below install the required packages and start the application.

```bash
cd mean
npm install
node index.js
```
The application will try to connect to a MongoDB source and fail because the connection string is invalid. Follow the steps in README to update the connection string `url`. Also, update the `readFromRegion` to a read region in your Azure CosmosDB account. Instruction from NodeJS sample:

```
* Next, substitute the `url`, `readFromRegion` in App.Config with your Cosmos DB account's values. 
```

After following these steps, the sample application should run and produce output:

```
connected!
readDefaultfunc query completed!
readFromNearestfunc query completed!
readFromRegionfunc query completed!
readDefaultfunc query completed!
readFromNearestfunc query completed!
readFromRegionfunc query completed!
readDefaultfunc query completed!
readFromSecondaryfunc query completed!
```

## Read using ReadPreference Mode

MongoDB provides the following ReadPreference modes for clients to use:

1. PRIMARY
2. PRIMARY_PREFERRED
3. SECONDARY
4. SECONDARY_PREFERRED
5. NEAREST

Refer to detailed [MongoDB Readpreference behavior](https://docs.mongodb.com/manual/core/read-preference-mechanics/#replica-set-read-preference-behavior) documentation for details on the behavior of each of these read preference modes. In Azure CosmosDB, primary maps to WRITE region and secondary maps to READ region.

Based on common scenarios, we recommend using the following settings:

1. If **low latency reads** are required, use the **NEAREST** read preference mode. This setting directs the read operations to the nearest available region. Note that if the nearest region is WRITE region, then these operations are directed to that region.
2. If **high availability and geo distribution of reads** are required (latency is not a constraint), then use **SECONDARY PREFERRED** read preference mode. This setting directs read operations to an available READ region. If no READ region is available, then request is directed to WRITE region.

The snippet below from the sample application shows how to configure NEAREST Read preference in NodeJS:

```javascript
  var query = {};
  var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.NEAREST});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromNearestfunc query completed!");
  });
```

Similarly, the snippet below shows how to configure SECONDARY_PREFERRED Read preference in NodeJS:

```javascript
  var query = {};
  var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.SECONDARY_PREFERRED});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromSecondaryPreferredfunc query completed!");
  });
```

Refer to corresponding sample application repos for other platforms like [.NET](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference), [Java](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference).

## Read using Tags

In addition to ReadPreference Mode, MongoDB allows use of tags to direct read operations. In Azure Cosmos DB for MongoDB API, the `region` tag is included by default as part of `isMaster` response:

```json
"tags": {
         "region": "West US"
      }
```

Hence, MongoClient can use the `region` tag along with the region name to direct read operations to specific regions. For Azure Cosmos DB account, region names can be found in Azure portal on the left under **Settings->Replica data globally**. This setting is useful for achieving **read isolation** - cases in which client application wants to direct read operations to a specific region only. This setting is ideal for non-production/analytics type scenarios, which run on background and are not production critical services.

The snippet below from the sample application shows how to configure Read preference with tags in NodeJS:

```javascript
 var query = {};
  var readcoll = client.db('regionDB').collection('regionTest',{readPreference: new ReadPreference(ReadPreference.SECONDARY_PREFERRED, {"region": "West US"})});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromRegionfunc query completed!");
  });
```

Please refer to corresponding sample application repos for other platforms like [.NET](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference), [Java](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference).

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this article, you've learned how to globally distribute read operations using ReadPreference with Azure Cosmos DB's MongoDB API.

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)
> [Setup a globally replicated Azure Cosmos DB account and use it with MongoDB API](tutorial-global-distribution-mongodb.md)
> [Develop locally with the emulator](local-emulator.md)