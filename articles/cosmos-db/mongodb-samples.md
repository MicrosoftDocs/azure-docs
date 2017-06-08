---
title: Use MongoDB APIs to build an Azure Cosmos DB app | Microsoft Docs
description: A tutorial that creates an online database using the DocumentDB APIs for MongoDB.
keywords: mongodb examples
services: cosmos-db
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: fb38bc53-3561-487d-9e03-20f232319a87
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: anhoh

---
# Build an Azure Cosmos DB: API for MongoDB app using Node.js
> [!div class="op_single_selector"]
> * [.NET](documentdb-get-started.md)
> * [.NET Core](documentdb-dotnetcore-get-started.md)
> * [Java](documentdb-java-get-started.md)
> * [Node.js for MongoDB](mongodb-samples.md)
> * [Node.js](documentdb-nodejs-get-started.md)
> * [C++](documentdb-cpp-get-started.md)
>  
>

This example shows you how to build an Azure Cosmos DB: API for MongoDB console app using Node.js.

To use this example, you must:

* [Create](create-mongodb-dotnet.md#create-account) an Azure Cosmos DB: API for MongoDB account.
* Retrieve your MongoDB [connection string](connect-mongodb-account.md) information.

## Create the app

1. Create a *app.js* file and copy & paste the code below.

    ```nodejs
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    
    var config = {
      MONGODB_HOST: process.env.MONGODB_HOST || 'mongodb://<endpoint>:<password>@<endpoint>.documents.azure.com:10250',  //If using local MongoDB on default 27017 port, consider using mongodb://localhost or mongodb://0.0.0.0.
      MONGODB_NAME: 'people', //This database name can be anything you like and where the families collection will reside from this sample
      MONGODB_OPTS: process.env.MONGODB_OPTS || '?ssl=true&replicaSet=globaldb', //Options for end of MongoDB connection string. If using local MongoDB, leave blank.
    };

    var url = config.MONGODB_HOST + '/' + config.MONGODB_NAME + config.MONGODB_OPTS;

    var insertDocument = function(db, callback) {
    db.collection('families').insertOne( {
            "id": "AndersenFamily",
            "lastName": "Andersen",
            "parents": [
                { "firstName": "Thomas" },
                { "firstName": "Mary Kay" }
            ],
            "children": [
                { "firstName": "John", "gender": "male", "grade": 7 }
            ],
            "pets": [
                { "givenName": "Fluffy" }
            ],
            "address": { "country": "USA", "state": "WA", "city": "Seattle" }
        }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the families collection.");
        callback();
    });
    };
    
    var findFamilies = function(db, callback) {
    var cursor =db.collection('families').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
    };
    
    var updateFamilies = function(db, callback) {
    db.collection('families').updateOne(
        { "lastName" : "Andersen" },
        {
            $set: { "pets": [
                { "givenName": "Fluffy" },
                { "givenName": "Rocky"}
            ] },
            $currentDate: { "lastModified": true }
        }, function(err, results) {
        console.log(results);
        callback();
    });
    };
    
    var removeFamilies = function(db, callback) {
    db.collection('families').deleteMany(
        { "lastName": "Andersen" },
        function(err, results) {
            console.log(results);
            callback();
        }
    );
    };
    
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        findFamilies(db, function() {
        updateFamilies(db, function() {
            removeFamilies(db, function() {
                db.close();
            });
        });
        });
    });
    });
    ```

2. Modify the following variables in the *app.js* file per your account settings (Learn how to find your [connection string](connect-mongodb-account.md)).  
Copy all of the text _to the left of_ `/?ssl=true..` since this is provided by default with the MONGODB_OPTS variable.

    ```nodejs
    MONGODB_HOST: process.env.MONGODB_HOST || 
    'mongodb://<endpoint>:<password>@<endpoint>.documents.azure.com:10250';
    ```
    > Note: The MONGODB_HOST and MONGODB_OPTS variables are setup to utilize the host machine/container ENV variables if they are present, otherwise will revert to the hard-coded text just entered.

3. Open your favorite terminal, run **npm install mongodb --save**, then run your app with **node app.js**

    The data just created from this sample can be seen in the Azure Portal under CosmosDB - Data Explorer.  The Data Explorer allows deletion of the database or collection if desired.

## Next steps

* Learn how to [use MongoChef](mongodb-mongochef.md) with your Azure Cosmos DB: API for MongoDB account.
