---
title: 'Tutorial: Build mobile applications with Xamarin and Azure Cosmos DB'
description: 'Tutorial: A tutorial that creates a Xamarin iOS, Android, or Forms application by using Azure Cosmos DB. Azure Cosmos DB is a fast, planet scale, cloud database for mobile apps.'
author: SnehaGunda
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 11/05/2019
ms.author: sngun

---
# Tutorial: Build mobile applications with Xamarin and Azure Cosmos DB

> [!div class="op_single_selector"]
> * [.NET](sql-api-dotnet-application.md)
> * [Java](sql-api-java-application.md)
> * [Node.js](sql-api-nodejs-application.md)
> * [Python](sql-api-python-application.md)
> * [Xamarin](mobile-apps-with-xamarin.md)
> 

Most mobile apps need to store data in the cloud, and Azure Cosmos DB is a cloud database for mobile apps. It has everything a mobile developer needs. It is a fully managed database as a service that scales on demand. It can bring your data to your application transparently, wherever your users are located around the globe. By using the [Azure Cosmos DB .NET Core SDK](sql-api-sdk-dotnet-core.md), you can enable Xamarin mobile apps to interact directly with Azure Cosmos DB, without a middle tier.

This article provides a tutorial for building mobile apps with Xamarin and Azure Cosmos DB. You can find the complete source code for the tutorial at [Xamarin and Azure Cosmos DB on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/xamarin), including how to manage users and permissions.

## Azure Cosmos DB capabilities for mobile apps
Azure Cosmos DB provides the following key capabilities for mobile app developers:

![Azure Cosmos DB capabilities for mobile apps](media/mobile-apps-with-xamarin/documentdb-for-mobile.png)

* Rich queries over schemaless data. Azure Cosmos DB stores data as schemaless JSON documents in heterogeneous collections. It offers [rich and fast queries](how-to-sql-query.md) without the need to worry about schemas or indexes.
* Fast throughput. It takes only a few milliseconds to read and write documents with Azure Cosmos DB. Developers can specify the throughput they need, and Azure Cosmos DB honors it with 99.99% availability SLA for all single region accounts and all multi-region accounts with relaxed consistency, and 99.999% read availability on all multi-region database accounts.
* Limitless scale. Your Azure Cosmos containers [grow as your app grows](partition-data.md). You can start with small data size and throughput of hundreds of requests per second. Your collections or databases can grow to petabytes of data and arbitrarily large throughput with hundreds of millions of requests per second.
* Globally distributed. Mobile app users are on the go, often across the world. Azure Cosmos DB is a [globally distributed database](distribute-data-globally.md). Click the map to make your data accessible to your users.
* Built-in rich authorization. With Azure Cosmos DB, you can easily implement popular patterns like [per-user data](https://github.com/kirillg/azure-documentdb-dotnet/tree/master/samples/xamarin/UserItems) or multiuser shared data, without complex custom authorization code.
* Geospatial queries. Many mobile apps offer geo-contextual experiences today. With first-class support for [geospatial types](geospatial.md), Azure Cosmos DB makes creating these experiences easy to accomplish.
* Binary attachments. Your app data often includes binary blobs. Native support for attachments makes it easier to use Azure Cosmos DB as a one-stop shop for your app data.

## Azure Cosmos DB and Xamarin tutorial
The following tutorial shows how to build a mobile application by using Xamarin and Azure Cosmos DB. You can find the complete source code for the tutorial at [Xamarin and Azure Cosmos DB on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/xamarin).

### Get started
It's easy to get started with Azure Cosmos DB. Go to the Azure portal, and create a new Azure Cosmos DB account. Click the **Quick start** tab. Download the Xamarin Forms to-do list sample that is already connected to your Azure Cosmos DB account. 

![Azure Cosmos DB Quick start for mobile apps](media/mobile-apps-with-xamarin/cosmos-db-quickstart.png)

Or if you have an existing Xamarin app, you can add the [Azure Cosmos DB NuGet package](sql-api-sdk-dotnet-core.md). Azure Cosmos DB supports Xamarin.IOS, Xamarin.Android, and Xamarin Forms shared libraries.

### Work with data
Your data records are stored in Azure Cosmos DB as schemaless JSON documents in heterogeneous collections. You can store documents with different structures in the same collection:

```cs
    var result = await client.CreateDocumentAsync(collectionLink, todoItem);
```

In your Xamarin projects, you can use language-integrated queries over schemaless data:

```cs
    var query = await client.CreateDocumentQuery<ToDoItem>(collectionLink)
                    .Where(todoItem => todoItem.Complete == false)
                    .AsDocumentQuery();

    Items = new List<TodoItem>();
    while (query.HasMoreResults) {
        Items.AddRange(await query.ExecuteNextAsync<TodoItem>());
    }
```
### Add users
Like many get started samples, the Azure Cosmos DB sample you downloaded authenticates to the service by using a master key hardcoded in the app's code. This default is not a good practice for an app you intend to run anywhere except on your local emulator. If an unauthorized user obtained the master key, all the data across your Azure Cosmos DB account could be compromised. Instead, you want your app to access only the records for the signed-in user. Azure Cosmos DB allows developers to grant application read or read/write permission to a collection, a set of documents grouped by a partition key, or a specific document. 

Follow these steps to modify the to-do list app to a multiuser to-do list app: 

  1. Add Login to your app by using Facebook, Active Directory, or any other provider.

  2. Create an Azure Cosmos DB UserItems collection with **/userId** as the partition key. Specifying the partition key for your collection allows Azure Cosmos DB to scale infinitely as the number of your app users grows, while continuing to offer fast queries.

  3. Add Azure Cosmos DB Resource Token Broker. This simple Web API authenticates users and issues short-lived tokens to signed-in users with access only to the documents within their partition. In this example, Resource Token Broker is hosted in App Service.

  4. Modify the app to authenticate to Resource Token Broker with Facebook, and request the resource tokens for the signed-in Facebook users. You can then access their data in the UserItems collection.  

You can find a complete code sample of this pattern at [Resource Token Broker on GitHub](https://github.com/kirillg/azure-documentdb-dotnet/tree/master/samples/xamarin/UserItems). This diagram illustrates the solution:

![Azure Cosmos DB users and permissions broker](media/mobile-apps-with-xamarin/documentdb-resource-token-broker.png)

If you want two users to have access to the same to-do list, you can add additional permissions to the access token in Resource Token Broker.

### Scale on demand
Azure Cosmos DB is a managed database as a service. As your user base grows, you don't need to worry about provisioning VMs or increasing cores. All you need to tell Azure Cosmos DB is how many operations per second (throughput) your app needs. You can specify the throughput via the **Scale** tab by using a measure of throughput called Request Units (RUs) per second. For example, a read operation on a 1-KB document requires 1 RU. You can also add alerts to the **Throughput** metric to monitor the traffic growth and programmatically change the throughput as alerts fire.

![Azure Cosmos DB scale throughput on demand](media/mobile-apps-with-xamarin/cosmos-db-xamarin-scale.png)

### Go planet scale
As your app gains popularity, you might gain users across the globe. Or maybe you want to be prepared for unforeseen events. Go to the Azure portal, and open your Azure Cosmos DB account. Click the map to make your data continuously replicate to any number of regions across the world. This capability makes your data available wherever your users are. You can also add failover policies to be prepared for contingencies.

![Azure Cosmos DB scale across geographic regions](media/mobile-apps-with-xamarin/cosmos-db-xamarin-replicate.png)

Congratulations. You have completed the solution and have a mobile app with Xamarin and Azure Cosmos DB. Follow similar steps to build Cordova apps by using the Azure Cosmos DB JavaScript SDK and native iOS/Android apps by using Azure Cosmos DB REST APIs.

## Next steps
* View the source code for [Xamarin and Azure Cosmos DB on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/xamarin).
* Download the [Azure Cosmos DB .NET Core SDK](sql-api-sdk-dotnet-core.md).
* Find more code samples for [.NET applications](sql-api-dotnet-samples.md).
* Learn about [Azure Cosmos DB rich query capabilities](how-to-sql-query.md).
* Learn about [geospatial support in Azure Cosmos DB](geospatial.md).



