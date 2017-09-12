---
title: Azure Cosmos DB - The database for serverless computing | Microsoft Docs
description: Learn how Azure Cosmos DB and Azure Functions can be used together to create a serverless architecure.
services: cosmos-db
author: mimig1
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2017
ms.author: mimig
---

# Azure Cosmos DB: Serverless computing database

Are you implementing a serverless architecture using Azure Functions as the building blocks? Are you pumping data into Azure Cosmos DB and want to make that data work for you? Do you have data that you need granular access to, where you need to constantly query, update, and add new items?

If you answered yes to any of these questions, read this article to learn how using Azure Functions and Azure Cosmos DB together can unlock new possibilities.

## What is serverless computing?

Serverless computing is all about the ability to focus on individual pieces of logic that are repeatable and stateless. These pieces require no infrastructure management and they consume resources only for the seconds, or milliseconds, when they run. At the core of the serverless computing movement are functions, which are made available in the Azure ecosystem by Azure Functions.

## Azure Cosmos DB + Azure Functions

Azure Cosmos DB is the recommended database for your serverless computing architecture. Azure Cosmos DB is globally replicated and supports multiple data models (documents, key/value, graph, and MongoDB) and works seamlessly with Azure Functions. 

Azure Functions provides the ability to create scalable units of work, or concise pieces of logic that can be run on demand, without provisioning or managing infrastructure. By using Azure Functions, you don't need to create a full blown app to respond to changes in your Azure Cosmos DB database, you can create small reusable functions for specific tasks. In addition, you can also use Azure Cosmos DB data as an input or output of an Azure Function in response to event such as HTTP requests, events in Azure Event Hub, or messages in a message queue.

With Azure Functions, you can:

1. Create Azure Cosmos DB triggers that get invoked when items are modified in an Azure Cosmos DB database. These trigger rely Azure Cosmos DB [change feed](change-feed.md) support to monitor your database for changes.
2. Use Azure Cosmos DB data as input to an Azure Function. This is known as an input binding. 
3. Store data in Azure Cosmos DB as the output of an Azure Function. This is known as an output binding.

The following diagram illustrates each of these integrations: 

![How Azure Cosmos DB and Azure Functions integrate](./media/serverless-computing-database/cosmos-db-azure-functions-integration.png) 

## Why Azure Cosmos DB?

1. Throughput can be scaled up and down instantly in Azure Cosmos DB. If you have hundreds or thousands of Functions querying and writing to the same database, you can scale up your [RU/s](request-units.md) you won't be locked out. All Functions can work in parallel using your allocated RU/s and your data is guaranteed to be [consistent](consistency-levels.md).

2. You can replicate Azure Cosmos DB data [around the globe](distribute-data-globally.md) to reduce latency, geo-locating your data closest to where your users are. As with all Azure Cosmos DB queries, data from event-driven triggers is read data from the Azure Cosmos DB closest to the user.

3. Azure Cosmos DB is schemaless - so its uniquely able to handle any data output from an Azure Function. Azure Cosmos DB also automatically indexes all data in the database, and makes those indexes immediately available. This "handle anything" approach makes it very straightforward to create a variety of Functions that each query and respond to independent values.

## Why Azure Functions?

1. Azure Functions are event-driven and can listen to a change feed from Azure Cosmos DB. This means you don't need to create listening logic, you just keep an eye out for the changes you're listening for. 

2. Functions execute in parallel and the service will spin up as many as you need. You set the parameters.

3. Good for quick tasks. The service spins up new instances of functions whenever an event fires and closes them as soon as the function completes. You only pay for the time your functions are running.

## Use cases

The following use cases demonstrate a few ways you can make your Azure Cosmos DB work for you.

* In IoT uses, you can now invoke a function when the temperature of a component in a connected car exceeds a certain value. 

    Implementation: Connected car sensor data is written to Azure Cosmos DB. An Azure Cosmos DB trigger is used to watch the value of the engine temperature. If the temperature exceeds a certain value, the Azure Cosmos DB trigger is invoked, one Azure Function sends the temperature data to a QA department, another Azure Function sends the owner information to the manufacturer call center as the user will soon be calling in. The output binding on one of the functions updates the car record in Azure Cosmos DB to store information about the temperature event. 

* In financial uses, you can invoke a function when a bank account balance falls under a certain value.

    Implementation: todo

* In gaming, when a new user is created you can search for other users who might know them by using the Azure Cosmos DB Graph API.

    Implementation: todo

* In retail uses, when a user adds an item to their basket you now have the flexibility to create and invoke functions for optional pipeline components such as sending promotional mailers because the app flow no longer needs to be linear - any department could create an Azure Cosmos DB trigger by listening to the change feed, and be assured they won't delay critical order processing events in the process.

    Implementation: todo

In all of these cases, because the function has decoupled the app itself, you dont need to worry about spinning up a new app instance for every update. You just call the Azure Function, it spins up as many instances as neccessary, and you can focus on the logic at hand.

## Next steps

Now it's time to connect Azure Cosmos DB and Azure Functions for real. 

* Azure Cosmos DB trigger quickstart
* Azure Cosmos DB trigger tutorial (VS)
* Azure Cosmos DB bindings and triggers



 



