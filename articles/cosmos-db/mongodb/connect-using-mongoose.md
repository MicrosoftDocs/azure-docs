---
title: Connect a Node.js Mongoose application to Azure Cosmos DB
description: Learn how to use the Mongoose Framework to store and manage data in Azure Cosmos DB. 
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 08/26/2021
author: gahl-levy
ms.author: gahllevy
ms.custom: seodec18, devx-track-js, ignite-2022
---
# Connect a Node.js Mongoose application to Azure Cosmos DB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This tutorial demonstrates how to use the [Mongoose Framework](https://mongoosejs.com/) when storing data in Azure Cosmos DB. We use the Azure Cosmos DB's API for MongoDB for this walkthrough. For those of you unfamiliar, Mongoose is an object modeling framework for MongoDB in Node.js and provides a straight-forward, schema-based solution to model your application data.

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]

[Node.js](https://nodejs.org/) version v0.10.29 or higher.

## Create an Azure Cosmos DB account

Let's create an Azure Cosmos DB account. If you already have an account you want to use, you can skip ahead to Set up your Node.js application. If you are using the Azure Cosmos DB Emulator, follow the steps at [Azure Cosmos DB Emulator](../emulator.md) to set up the emulator and skip ahead to Set up your Node.js application.

[!INCLUDE [cosmos-db-create-dbaccount-mongodb](../includes/cosmos-db-create-dbaccount-mongodb.md)]

### Create a database 
In this application we will cover two ways of creating collections in Azure Cosmos DB: 
- **Storing each object model in a separate collection**: We recommend [creating a database with dedicated throughput](../set-throughput.md#set-throughput-on-a-database). Using this capacity model will give you better cost efficiency.

    :::image type="content" source="./media/connect-using-mongoose/db-level-throughput.png" alt-text="Node.js tutorial - Screenshot of the Azure portal, showing how to create a database in the Data Explorer for an Azure Cosmos DB account, for use with the Mongoose Node module":::

- **Storing all object models in a single Azure Cosmos DB collection**: If you'd prefer to store all models in a single collection, you can just create a new database without selecting the Provision Throughput option. Using this capacity model will create each collection with its own throughput capacity for every object model.

After you create the database, you'll use the name in the `COSMOSDB_DBNAME` environment variable below.

## Set up your Node.js application

>[!Note]
> If you'd like to just walkthrough the sample code instead of setup the application itself, clone the [sample](https://github.com/Azure-Samples/Mongoose_CosmosDB) used for this tutorial and build your Node.js Mongoose application on Azure Cosmos DB.

1. To create a Node.js application in the folder of your choice, run the following command in a node command prompt.

   `npm init`

   Answer the questions and your project will be ready to go.

2. Add a new file to the folder and name it ```index.js```.

3. Install the necessary packages using one of the ```npm install``` options:

   * **Mongoose**: ```npm install mongoose --save```

    > [!NOTE]
    > For more information on which version of mongoose is compatible with your API for MongoDB server version, see [Mongoose compatability](https://mongoosejs.com/docs/compatibility.html).
    
   * **Dotenv** *(if you'd like to load your secrets from an .env file)*: ```npm install dotenv --save```

     >[!Note]
     > The ```--save``` flag adds the dependency to the package.json file.

4. Import the dependencies in your `index.js` file.

   ```javascript
   var mongoose = require('mongoose');
   var env = require('dotenv').config();   //Use the .env file to load the variables
    ```

5. Add your Azure Cosmos DB connection string and Azure Cosmos DB Name to the ```.env``` file. Replace the placeholders {cosmos-account-name} and {dbname} with your own Azure Cosmos DB account name and database name, without the brace symbols.

   ```javascript
   // You can get the following connection details from the Azure portal. You can find the details on the Connection string pane of your Azure Cosmos DB account.

   COSMOSDB_USER = "<Azure Cosmos DB account's user name, usually the database account name>"
   COSMOSDB_PASSWORD = "<Azure Cosmos DB account password, this is one of the keys specified in your account>"
   COSMOSDB_DBNAME = "<Azure Cosmos DB database name>"
   COSMOSDB_HOST= "<Azure Cosmos DB Host name>"
   COSMOSDB_PORT=10255
   ```

6. Connect to Azure Cosmos DB using the Mongoose framework by adding the following code to the end of index.js.

   ```javascript
   mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
      auth: {
        username: process.env.COSMOSDB_USER,
        password: process.env.COSMOSDB_PASSWORD
      },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
    })
    .then(() => console.log('Connection to CosmosDB successful'))
    .catch((err) => console.error(err));
    ```

    >[!NOTE]
    > Here, the environment variables are loaded using process.env.{variableName} using the `dotenv` npm package.

    Once you are connected to Azure Cosmos DB, you can now start setting up object models in Mongoose.

## Best practices for using Mongoose with Azure Cosmos DB

For every model you create, Mongoose creates a new collection. This is best addressed using the [Database Level Throughput option](../set-throughput.md#set-throughput-on-a-database), which was previously discussed. To use  a single collection, you need to use Mongoose [Discriminators](https://mongoosejs.com/docs/discriminators.html). Discriminators are a schema inheritance mechanism. They enable you to have multiple models with overlapping schemas on top of the same underlying MongoDB collection.

You can store the various data models in the same collection and then use a filter clause at query time to pull down only the data needed. Let's walk through each of the models.

### One collection per object model

This section explores how to achieve this with Azure Cosmos DB's API for MongoDB. This method is our recommended approach since it allows you to control cost and capacity. As a result, the amount of Request Units on the database does not depend on the number of object models. This is the default operating model for Mongoose, so, you might be familiar with this.

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
            { givenName: "Buddy" }
        ],
        address: { country: "USA", state: "WA", city: "Seattle" }
    });
    ```

1. Finally, let's save the object to Azure Cosmos DB. This creates a collection underneath the covers.

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

1. Now, going into the Azure portal, you notice two collections created in Azure Cosmos DB.

   :::image type="content" source="./media/connect-using-mongoose/mongo-mutliple-collections.png" alt-text="Node.js tutorial - Screenshot of the Azure portal, showing an Azure Cosmos DB account, with multiple collection names highlighted - Node database":::

1. Finally, let's read the data from Azure Cosmos DB. Since we're using the default Mongoose operating model, the reads are the same as any other reads with Mongoose.

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
           { givenName: "Buddy" }
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

   :::image type="content" source="./media/connect-using-mongoose/mongo-collections-alldata.png" alt-text="Node.js tutorial - Screenshot of the Azure portal, showing an Azure Cosmos DB account, with the collection name highlighted - Node database":::

1. Also, notice that each object has another attribute called as ```__type```, which help you differentiate between the two different object models.

1. Finally, let's read the data that is stored in Azure Cosmos DB. Mongoose takes care of filtering data based on the model. So, you have to do nothing different when reading data. Just specify your model (in this case, ```Family_common```) and Mongoose handles filtering on the 'DiscriminatorKey'.

    ```JavaScript
    Family_common.find({ 'children.gender' : "male"}, function(err, foundFamily){
        foundFamily.forEach(fam => console.log("Found Family (using discriminator): " + JSON.stringify(fam)));
    });
    ```

As you can see, it is easy to work with Mongoose discriminators. So, if you have an app that uses the Mongoose framework, this tutorial is a way for you to get your application up and running using Azure Cosmos DB's API for MongoDB without requiring too many changes.

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB's API for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)

[dbleveltp]: ./media/connect-using-mongoose/db-level-throughput.png
