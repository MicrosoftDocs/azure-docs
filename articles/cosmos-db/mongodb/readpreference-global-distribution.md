---
title: Use Read preference with the Azure Cosmos DB's API for MongoDB 
description: Learn how to use MongoDB Read Preference with the Azure Cosmos DB's API for MongoDB
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 02/26/2019
ms.custom: ignite-2022
---
# How to globally distribute reads using Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows how to globally distribute read operations with [MongoDB Read Preference](https://docs.mongodb.com/manual/core/read-preference/) settings using Azure Cosmos DB's API for MongoDB.

## Prerequisites 
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
[!INCLUDE [cosmos-db-emulator-mongodb](../includes/cosmos-db-emulator-mongodb.md)]

Refer to this [Quickstart](tutorial-global-distribution.md) article for instructions on using the Azure portal to set up an Azure Cosmos DB account with global distribution and then connect to it.

## Clone the sample application

Open a git terminal window, such as git bash, and `cd` to a working directory.  

Run the following commands to clone the sample repository. Based on your platform of interest, use one of the following sample repositories:

1. [.NET sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference)
2. [NodeJS sample application]( https://github.com/Azure-Samples/azure-cosmos-db-mongodb-node-geo-readpreference)
3. [Mongoose sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-mongoose-geo-readpreference)
4. [Java sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference)
5. [SpringBoot sample application](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-spring)


```bash
git clone <sample repo url>
```

## Run the application

Depending on the platform used, install the required packages and start the application. To install dependencies, follow the README included in the sample application repository. For instance, in the NodeJS sample application, use the following commands to install the required packages and start the application.

```bash
cd mean
npm install
node index.js
```
The application tries to connect to a MongoDB source and fails because the connection string is invalid. Follow the steps in the README to update the connection string `url`. Also, update the `readFromRegion` to a read region in your Azure Cosmos DB account. The following instructions are from the NodeJS sample:

```
* Next, substitute the `url`, `readFromRegion` in App.Config with your Azure Cosmos DB account's values. 
```

After following these steps, the sample application runs and produces the following output:

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

## Read using Read Preference mode

MongoDB protocol provides the following Read Preference modes for clients to use:

1. PRIMARY
2. PRIMARY_PREFERRED
3. SECONDARY
4. SECONDARY_PREFERRED
5. NEAREST

Refer to the detailed [MongoDB Read Preference behavior](https://docs.mongodb.com/manual/core/read-preference-mechanics/#replica-set-read-preference-behavior) documentation for details on the behavior of each of these read preference modes. In Azure Cosmos DB, primary maps to WRITE region and secondary maps to READ region.

Based on common scenarios, we recommend using the following settings:

1. If **high availability and low latency reads** are required, use the **NEAREST** read preference mode. This setting directs the read operations to the nearest available region. Note that if the nearest region is the WRITE region, then these operations are directed to that region.
2. If **high availability and geo distribution of reads** are required (latency is not a constraint), then use the **PRIMARY PREFERRED** or **SECONDARY PREFERRED** read preference mode. This setting directs read operations to an available WRITE or READ region respectively. If the region is not available, then requests are directed to the next available region as per the read preference behavior.

The following snippet from the sample application shows how to configure NEAREST Read Preference in NodeJS:

```javascript
  var query = {};
  var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.NEAREST});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromNearestfunc query completed!");
  });
```

Similarly, the snippet below shows how to configure the SECONDARY_PREFERRED Read Preference in NodeJS:

```javascript
  var query = {};
  var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.SECONDARY_PREFERRED});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromSecondaryPreferredfunc query completed!");
  });
```

The Read Preference can also be set by passing `readPreference` as a parameter in the connection string URI options:

```javascript
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017?ssl=true&replicaSet=globaldb&readPreference=nearest';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  client.close();
});
```

Refer to the corresponding sample application repos for other platforms, such as [.NET](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference) and [Java](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference).

## Read using tags

In addition to the Read Preference mode, MongoDB protocol allows the use of tags to direct read operations. In Azure Cosmos DB's API for MongoDB, the `region` tag is included by default as a part of the `isMaster` response:

```json
"tags": {
         "region": "West US"
      }
```

Hence, MongoClient can use the `region` tag along with the region name to direct read operations to specific regions. For Azure Cosmos DB accounts, region names can be found in Azure portal on the left under **Settings->Replica data globally**. This setting is useful for achieving **read isolation** - cases in which client application want to direct read operations to a specific region only. This setting is ideal for non-production/analytics type scenarios, which run in the background and are not production critical services.

The following snippet from the sample application shows how to configure the Read Preference with tags in NodeJS:

```javascript
 var query = {};
  var readcoll = client.db('regionDB').collection('regionTest',{readPreference: new ReadPreference(ReadPreference.SECONDARY_PREFERRED, {"region": "West US"})});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromRegionfunc query completed!");
  });
```

Refer to the corresponding sample application repos for other platforms, such as [.NET](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-geo-readpreference) and [Java](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-geo-readpreference).

In this article, you've learned how to globally distribute read operations using Read Preference with Azure Cosmos DB's API for MongoDB.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this article in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

* [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
* [Setup a globally distributed database with Azure Cosmos DB's API for MongoDB](tutorial-global-distribution.md)
* [Develop locally with the Azure Cosmos DB Emulator](../emulator.md)
