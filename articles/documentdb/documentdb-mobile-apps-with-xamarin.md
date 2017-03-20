---
title: NoSQL C++ tutorial for DocumentDB | Microsoft Docs
description: A NoSQL C++ tutorial that creates a C++ database and console application using a DocumentDB endorsed SDK for C++. DocumentDB is a planet-scale NoSQL database service.
services: documentdb
documentationcenter: cpp
author: asthana86
manager: jhubbard
editor: ''

ms.assetid: b8756b60-8d41-4231-ba4f-6cfcfe3b4bab
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: cpp
ms.topic: hero-article
ms.date: 12/25/2016
ms.author: aasthan

---
# How to build mobile applications with Xamarin and Azure DocumentDB
Most mobile apps need to store data in the cloud, and Azure DocumentDB is an cloud database for mobile apps. It has everything a mobile developer needs, a fully managed NoSQL database as a service that scales on demand, and can bring your data where your users go around the globe -- completely transparently to your application. Using the [Azure DocumentDB .NET Core SDK](documentdb-sdk-dotnet-core.md), you can enabling Xamarin mobile apps to interact directly with DocumentDB, without a middle-tier.

In this article, we provide a tutorial for building mobile apps with Xamarin and DocumentDB. You can find the complete source code for the tutorial at [Xamarin and DocumentDB on Github](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/xamarin).

## DocumentDB capabilities for mobile apps
DocumentDB provides the following capabilities out of the box for mobile app developers:

* Rich queries over schemaless data. DocumentDB stores data as schemaless JSON documents in heterogeneous collections, and offers [rich and fast queries](documentdb-sql-query.md) without the need to worry about schema or indexes.
* Fast. Guaranteed. It takes only few milliseconds to read and write documents with DocumentDB. Developers can specify the throughput they need and DocumentDB will honor it with 99.99% SLA.
* Limitless Scale. Your DocumentDB collections [will grow as your app grows](documentdb-partition-data.md). You can start with small data size and 100s requests per second and grow to arbitrarily large, 10s and 100s of millions requests per second throughput, and petabytes of data.
* Globally Distributed. Your mobile app users are on the go, often across the world. DocumentDB is a [globally distributed database](documentdb-distribute-data-globally.md), and with just one click on a map it will bring the data wherever your users are.
* Built-in rich authorization. With DocumentDB you can easy to implement popular patterns like [per-user data](https://aka.ms/documentdb-xamarin-todouser), or multi-user shared data without custom complex authorization code.
* Geo-spatial queries. Many mobile apps offer geo-contextual experiences today. With the first class support for [geo-spatial types](documentdb-geospatial.md) DocumentDB makes these experiences very easy to accomplish.
* Binary attachments. Your app data often includes binary blobs. Native support for attachments makes it easier to use DocumentDB as one-stop shop for your app data.

## DocumentDB and Xamarin tutorial

### Get strarted
It's easy to get started with DocumentDB, just go to Azure portal, create a new DocumentDB account, go to the Quickstart tab, and download a Xamarin Forms todo list sample, already connected to your DocumentDB account. 

Or if you have an existing Xamarin app, you can just add this [DocumentDB NuGet package](documentdb-sdk-dotnet-core.md). Today we support Xamarin.IOS, Xamarin.Android, as well as Xamarin Forms shared libraries.

### Work with data
Your data records are stored in DocumentDB as schemaless JSON documents in heterogeneous collections. You can store documents with different structures in the same collection.

```cs
    var result = await client.CreateDocumentAsync(collectionLink, todoItem);
```

In your Xamarin projects you can use language integtated queries over schemaless data:

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
Like many get started samples, the DocumentDB sample you downloaded above authenticates to the service using master key hardcoded in the app's code. This is of course not a good idea for an app you intend to run anywhere except your local emulator. If an attacker gets a hold of the master key, all the data across your DocumentDB account is compromised. Instead we want our app to only have access to the records for the logged in user. DocumentDB allows developers to grant application read or read/write access to all documents in a collection, a set of documents, or a specific document, depending on the needs. 

Here is for example, how to modify our todo list app into a multi-user todolist app: 

* Add Login to your app, using Facebook, Active Directory or any other provider.
* Create a DocumentDB UserItems collection with /userId as a partition key. Specifying partition key for your collection allows DocumentDB to scale infinitely as the number of our app users growth, while offering fast queries.
* Add DocumentDB Resource Token Broker, a simple Web API that authenticates the users and issues short lived tokens to the logged in users with access only to the documents within the user's partition. In this example we host Resource Token Broker in App Service.
* Modify the app to authenticate to Resource Token Broker with Facebook and request the resource tokens for the logged in Facebook user, then access users data in the UserItems collection.  

You can find a complete code sample of this pattern at [Resource Token Broker on Github](http://aka.ms/documentdb-xamarin-todouser). This diagram illustrates the solution:

Now if we want two users get access to the same todolist, we just add additional permissions to the access token in Resource Token Broker.

### Scale on demand
DocumentDB is a managed database as a service. As your user base grows, you don't need to worry about provisioning VMs or increasing cores. All you need to tell DocumentDB is how many operations per second (throughput) your app needs. You can specify the throughput via portal Scale tab using a measure of throughput called Request Units per second (RUs). For example, a read operation on a 1KB document requires 1 RU. You can also add alerts for "Throughput" metric to monitor the traffic growth and programmatically change the throughput as alerts fire.

### Go planet scale
As your app gains popularity, you may acquire users accross the globe. Or may be you just don't want to be caught of guard if a meteorite strkes the Azure data centers where you created your DocumentDB collection. Go to Azure portal, your DocumentDB account, and with a click on a map, make your data continuously replicate to any number of regions accross the world. This ensures your data is available whereever your users are, and you can add failover policies to be prepared for the rainy day.

Congratulations! You have completed the solution and have a mobile app with Xamarin and DocumentDB. A similar pattern can be used in Cordova apps using the DocumentDB JavaScript SDK, as well as native iOS / Android apps using DocumentDB REST APIs.

## Next steps
* View the source code for [Xamarin and DocumentDB on Github](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/xamarin).
* Download the [DocumentDB .NET Core SDK](documentdb-sdk-dotnet-core.md).
* Find more code samples for [.NET applications](documentdb-dotnet-samples.md).
* Learn about [DocumentDB's rich query capabilities](documentdb-sql-query.md).
* Learn about [geospatial support in DocumentDB](documentdb-geospatial.md).



