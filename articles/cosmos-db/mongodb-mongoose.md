---
title: Connect a Node.js Mongoose application to Azure Cosmos DB
description: Learn how to use the Mongoose Framework to store and manage data in Azure Cosmos DB. 
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: nodejs
ms.topic: conceptual
ms.date: 12/26/2018
author: sivethe
ms.author: sivethe
ms.custom: seodec18
---
# Connect a Node.js Mongoose application to Azure Cosmos DB

This tutorial demonstrates how to use the [Mongoose Framework](https://mongoosejs.com/) when storing data in Cosmos DB. We use the Azure Cosmos DB's API for MongoDB for this walkthrough. For those of you unfamiliar, Mongoose is an object modeling framework for MongoDB in Node.js and provides a straight-forward, schema-based solution to model your application data.

Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Cosmos DB.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

[Node.js](https://nodejs.org/) version v0.10.29 or higher.

## Create a Cosmos account

Let's create a Cosmos account. If you already have an account you want to use, you can skip ahead to Set up your Node.js application. If you are using the Azure Cosmos DB Emulator, follow the steps at [Azure Cosmos DB Emulator](local-emulator.md) to set up the emulator and skip ahead to Set up your Node.js application.

[!INCLUDE [cosmos-db-create-dbaccount-mongodb](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Set up your Node.js application

>[!Note]
> If you'd like to just walkthrough the sample code instead of setup the application itself, clone the [sample](https://github.com/Azure-Samples/Mongoose_CosmosDB) used for this tutorial and build your Node.js Mongoose application on Azure Cosmos DB.

1. To create a Node.js application in the folder of your choice, run the following command in a node command prompt.

    ```npm init```

    Answer the questions and your project will be ready to go.

1. Add a new file to the folder and name it ```index.js```.
1. Install the necessary packages using one of the ```npm install``` options:
   * Mongoose: ```npm install mongoose@5 --save```

     > [!Note]
     > The Mongoose example connection below is based on Mongoose 5+, which has changed since earlier versions.
    
   * Dotenv (if you'd like to load your secrets from an .env file): ```npm install dotenv --save```

     >[!Note]
     > The ```--save``` flag adds the dependency to the package.json file.

1. Import the dependencies in your index.js file.
    ```JavaScript
    var mongoose = require('mongoose');
    var env = require('dotenv').load();    //Use the .env file to load the variables
    ```

1. Add your Cosmos DB connection string and Cosmos DB Name to the ```.env``` file.

    ```JavaScript
    COSMOSDB_CONNSTR=mongodb://{cosmos-user}.documents.azure.com:10255/{dbname}
    COSMODDB_USER=cosmos-user
    COSMOSDB_PASSWORD=cosmos-secret
    ```

1. Connect to Cosmos DB using the Mongoose framework by adding the following code to the end of index.js.
    ```JavaScript
    mongoose.connect(process.env.COSMOSDB_CONNSTR+"?ssl=true&replicaSet=globaldb", {
      auth: {
        user: process.env.COSMODDB_USER,
        password: process.env.COSMOSDB_PASSWORD
      }
    })
    .then(() => console.log('Connection to CosmosDB successful'))
    .catch((err) => console.error(err));
    ```
    >[!Note]
    > Here, the environment variables are loaded using process.env.{variableName} using the 'dotenv' npm package.

    Once you are connected to Azure Cosmos DB, you can now start setting up object models in Mongoose.

## Caveats to using Mongoose with Cosmos DB

For every model you create, Mongoose creates a new collection. However, given the per-collection billing model of Cosmos DB, it might not be the most cost-efficient way to go, if you've got multiple object models that are sparsely populated.

This walkthrough covers both models. We'll first cover the walkthrough on storing one type of data per collection. This is the defacto behavior for Mongoose.

Mongoose also has a concept called [Discriminators](https://mongoosejs.com/docs/discriminators.html). Discriminators are a schema inheritance mechanism. They enable you to have multiple models with overlapping schemas on top of the same underlying MongoDB collection.

You can store the various data models in the same collection and then use a filter clause at query time to pull down only the data needed.

### One collection per object model

The default Mongoose behavior is to create a MongoDB collection every time you create an Object model. This section explores how to achieve this with Azure Cosmos DB's API for MongoDB. This method is recommended when you have object models with large amounts of data. This is the default operating model for Mongoose, so, you might be familiar with this, if you're familiar with Mongoose.

1. Open your ```index.js``` again.

1. Create the schema definition for 'Family'.

    ```JavaScript
    const Family = mongoose.model('Family', new mongoose.Schema({
        lastName: String,
        parents: [{
            familyName: String,
            firstName: String,
            gender: String
        }],
        children: [{
            familyName: String,
            firstName: String,
            gender: String,
            grade: Number
        }],
        pets:[{
            givenName: String
        }],
        address: {
            country: String,
            state: String,
            city: String
        }
    }));
    ```

1. Create an object for 'Family'.

    ```JavaScript
    const family = new Family({
        lastName: "Volum",
        parents: [
            { firstName: "Thomas" },
            { firstName: "Mary Kay" }
        ],
        children: [
            { firstName: "Ryan", gender: "male", grade: 8 },
            { firstName: "Patrick", gender: "male", grade: 7 }
        ],
        pets: [
            { givenName: "Blackie" }
        ],
        address: { country: "USA", state: "WA", city: "Seattle" }
    });
    ```

1. Finally, let's save the object to Cosmos DB. This creates a collection underneath the covers.

    ```JavaScript
    family.save((err, saveFamily) => {
        console.log(JSON.stringify(saveFamily));
    });
    ```

1. Now, let's create another schema and object. This time, let's create one for 'Vacation Destinations' that the families might be interested in.
   1. Just like last time, let's create the scheme
      ```JavaScript
      const VacationDestinations = mongoose.model('VacationDestinations', new mongoose.Schema({
       name: String,
       country: String
      }));
      ```

   1. Create a sample object (You can add multiple objects to this schema) and save it.
      ```JavaScript
      const vacaySpot = new VacationDestinations({
       name: "Honolulu",
       country: "USA"
      });

      vacaySpot.save((err, saveVacay) => {
       console.log(JSON.stringify(saveVacay));
      });
      ```

1. Now, going into the Azure portal, you notice two collections created in Cosmos DB.

    ![Node.js tutorial - Screenshot of the Azure portal, showing an Azure Cosmos DB account, with multiple collection names highlighted - Node database][multiple-coll]

1. Finally, let's read the data from Cosmos DB. Since we're using the default Mongoose operating model, the reads are the same as any other reads with Mongoose.

    ```JavaScript
    Family.find({ 'children.gender' : "male"}, function(err, foundFamily){
        foundFamily.forEach(fam => console.log("Found Family: " + JSON.stringify(fam)));
    });
    ```

### Using Mongoose discriminators to store data in a single collection

In this method, we use [Mongoose Discriminators](https://mongoosejs.com/docs/discriminators.html) to help optimize for the costs of each collection. Discriminators allow you to define a differentiating 'Key', which allows you to store, differentiate and filter on different object models.

Here, we create a base object model, define a differentiating key and add 'Family' and 'VacationDestinations' as an extension to the base model.

1. Let's set up the base config and define the discriminator key.

    ```JavaScript
    const baseConfig = {
        discriminatorKey: "_type", //If you've got a lot of different data types, you could also consider setting up a secondary index here.
        collection: "alldata"   //Name of the Common Collection
    };
    ```

1. Next, let's define the common object model

    ```JavaScript
    const commonModel = mongoose.model('Common', new mongoose.Schema({}, baseConfig));
    ```

1. We now define the 'Family' model. Notice here that we're using ```commonModel.discriminator``` instead of ```mongoose.model```. Additionally, we're also adding the base config to the mongoose schema. So, here, the discriminatorKey is ```FamilyType```.

    ```JavaScript
    const Family_common = commonModel.discriminator('FamilyType', new     mongoose.Schema({
        lastName: String,
        parents: [{
            familyName: String,
            firstName: String,
            gender: String
        }],
        children: [{
            familyName: String,
            firstName: String,
           gender: String,
            grade: Number
        }],
        pets:[{
            givenName: String
        }],
        address: {
            country: String,
            state: String,
            city: String
        }
    }, baseConfig));
    ```

1. Similarly, let's add another schema, this time for the 'VacationDestinations'. Here, the DiscriminatorKey is ```VacationDestinationsType```.

    ```JavaScript
    const Vacation_common = commonModel.discriminator('VacationDestinationsType', new mongoose.Schema({
        name: String,
        country: String
    }, baseConfig));
    ```

1. Finally, let's create objects for the model and save it.
   1. Let's add object(s) to the 'Family' model.
      ```JavaScript
      const family_common = new Family_common({
       lastName: "Volum",
       parents: [
           { firstName: "Thomas" },
           { firstName: "Mary Kay" }
       ],
       children: [
           { firstName: "Ryan", gender: "male", grade: 8 },
           { firstName: "Patrick", gender: "male", grade: 7 }
       ],
       pets: [
           { givenName: "Blackie" }
       ],
       address: { country: "USA", state: "WA", city: "Seattle" }
      });

      family_common.save((err, saveFamily) => {
       console.log("Saved: " + JSON.stringify(saveFamily));
      });
      ```

   1. Next, let's add object(s) to the 'VacationDestinations' model and save it.
      ```JavaScript
      const vacay_common = new Vacation_common({
       name: "Honolulu",
       country: "USA"
      });

      vacay_common.save((err, saveVacay) => {
       console.log("Saved: " + JSON.stringify(saveVacay));
      });
      ```

1. Now, if you go back to the Azure portal, you notice that you have only one collection called ```alldata``` with both 'Family' and 'VacationDestinations' data.

    ![Node.js tutorial - Screenshot of the Azure portal, showing an Azure Cosmos DB account, with the collection name highlighted - Node database][alldata]

1. Also, notice that each object has another attribute called as ```__type```, which help you differentiate between the two different object models.

1. Finally, let's read the data that is stored in Azure Cosmos DB. Mongoose takes care of filtering data based on the model. So, you have to do nothing different when reading data. Just specify your model (in this case, ```Family_common```) and Mongoose handles filtering on the 'DiscriminatorKey'.

    ```JavaScript
    Family_common.find({ 'children.gender' : "male"}, function(err, foundFamily){
        foundFamily.forEach(fam => console.log("Found Family (using discriminator): " + JSON.stringify(fam)));
    });
    ```

As you can see, it is easy to work with Mongoose discriminators. So, if you have an app that uses the Mongoose framework, this tutorial is a way for you to get your application up and running using Azure Cosmos's API for MongoDB without requiring too many changes.

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.

[alldata]: ./media/mongodb-mongoose/mongo-collections-alldata.png
[multiple-coll]: ./media/mongodb-mongoose/mongo-mutliple-collections.png
