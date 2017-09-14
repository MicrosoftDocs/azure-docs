---
title: Serverless database computing - Azure Functions and Azure Cosmos DB| Microsoft Docs
description: Learn how Azure Cosmos DB and Azure Functions can be used together to create event-driven serverless computing apps.
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
ms.date: 09/13/2017
ms.author: mimig
---

# Azure Cosmos DB: Serverless database computing using Azure Functions

Serverless computing is all about the ability to focus on individual pieces of logic that are repeatable and stateless. These pieces require no infrastructure management and they consume resources only for the seconds, or milliseconds, they run for. At the core of the serverless computing movement are functions, which are made available in the Azure ecosystem by [Azure Functions](https://azure.microsoft.com/services/functions).

With the native integration between Azure Cosmos DB and Azure Functions, you can create database triggers, input bindings, and output bindings directly from your Azure Cosmos DB account. Using Azure Functions and Azure Cosmos DB, you can create and deploy event-driven serverless apps with low-latency access to rich data for a global user base.

## Overview

Azure Cosmos DB and Azure Functions enable you to integrate your databases and serverless apps in the following ways:

* Create event-driven Azure Cosmos DB triggers that invoke functions when items are modified in an Azure Cosmos DB database. These triggers rely on Azure Cosmos DB [change feed](change-feed.md) support streams, which monitor your database for changes and then call your Azure Function.
* Bind functions to Azure Cosmos DB databases using input parameters so that data is read from the database when the function executes. This is known as input binding.
* Similarly, bind functions to Azure Cosmos DB databases using output parameters so that data is written to the database when the function executes. This is known as an output binding.

The following diagram illustrates each of these integrations: 

![How Azure Cosmos DB and Azure Functions integrate](./media/serverless-computing-database/cosmos-db-azure-functions-integration.png)

> [!NOTE]
> At this time, the Azure Cosmos DB trigger, input bindings, and output bindings work with DocumentDB, Table, and Graph API accounts only.

## Use cases

The following use cases demonstrate a few ways you can make the most of your Azure Cosmos DB data - by connecting your data to event-driven Azure Functions.

* In IoT implementations, you can invoke a function when the check engine light is displayed in a connected car.

    Implementation: An **Azure Cosmos DB trigger** is used to trigger events related to car alerts, such as the check engine light coming on in a connected car. When the check engine light comes, the sensor data is sent to Azure Cosmos DB. Azure Cosmos DB creates or updates new sensor data documents, and those changes are streamed to the Azure Cosmos DB trigger. The trigger is invoked on every data-change to the sensor data collection, as all changes are all streamed via the change feed. A threshold condition can be used in the function to optionally send the sensor data to the warranty department, or another function can be created to send the related owner information to a marketing task that manages mailers related to car maintenance. The output binding on one of the functions can update the car record in Azure Cosmos DB to store information about the event.

* In financial implementations, you can invoke a function when a bank account balance falls under a certain value

    Implementation: Using a Timer trigger, you can retrieve the bank account balance information stored in an Azure Cosmos DB database using the **input bindings**. The timer can be set to a daily or weekly cadence, where the user can set a threshold for what would be considered as a low balance, then follow that with an action from the Azure Function. The database can also include the email address of the account owner, which should be notified. The output binding can be a SendGrid integration that can send an email from a service account to the affected accounts.

    
    ![A Timer trigger for a financial scenario](./media/serverless-computing-database/cosmos-db-functions-financial-trigger.png)

* •	In gaming, when a new user is created you can search for other users who might know them by using the Azure Cosmos DB Graph API, and then write the results to a Azure Cosmos DB Table database for easy retrieval.

    Implementation: Using an Azure Cosmos DB Graph database to store all users, you can integrate this on your function as a trigger, so whenever a new user is inserted, the function will be executed and then the result can be stored using an **output binding**. The function can query the graph database to search for all the users that are directly related to the new user and return that dataset to the function. This can then be stored in an Azure Cosmos DB Table database as a key-value set of pairs, which can then be easily retrieved by any front-end application that shows the new user their connected friends.

* •	In retail implementations, when a user adds an item to their basket you now have the flexibility to create and invoke functions for optional pipeline components such as sending promotional mailers because the app flow no longer needs to be linear - any department could create an Azure Cosmos DB trigger by listening to the change feed, and be assured they won't delay critical order processing events in the process.

    Implementation: todo

In all of these cases, because the function has decoupled the app itself, you don’t need to spin up new app instances all the time, instead, Azure Functions spins up individual functions to complete discrete processes as needed.

## Tooling

Native integration between Azure Cosmos DB and Azure Functions is available in the portal and Visual Studio 2017. Azure Cosmos DB triggers can be created from either the Azure Cosmos DB portal or the Azure Functions portal, as shown in the following diagram.

![Azure Cosmos DB trigger in the Azure Functions portal](./media/serverless-computing-database/azure-function-cosmos-db-trigger.png) 

## Why choose Azure Functions integration for serverless computing?

Azure Functions provides the ability to create scalable units of work, or concise pieces of logic that can be run on demand, without provisioning or managing infrastructure. By using Azure Functions, you don't have to create a full-blown app to respond to changes in your Azure Cosmos DB database, you can create small reusable functions for specific tasks. In addition, you can also use Azure Cosmos DB data as the input or output to an Azure Function in response to event such as HTTP requests, events in Azure Event Hub, messages in a message queue, or any of the other [Azure Function triggers](../azure-functions/functions-triggers-bindings.md).

Azure Cosmos DB is the recommended database for your serverless computing architecture for the following reasons:

* **Instant access to all your data**: You have granular access to every value stored because Azure Cosmos DB automatically indexes all data, and makes those indexes immediately available. This means you are able to constantly query, update, and add new items. If you're looking to store data and don't need deep indexing or need to store attachments and media files, the [Azure Blog Storage trigger](../azure-functions/functions-bindings-storage-blob.md) may be a better option.

* **Schemaless**. Azure Cosmos DB is schemaless - so its uniquely able to handle any data output from an Azure Function. This "handle anything" approach makes it very straightforward to create a variety of Functions that each query and respond to independent values

* **Scalable throughput**. Throughput can be scaled up and down instantly in Azure Cosmos DB. If you have hundreds or thousands of Functions querying and writing to the same database, you can scale up your [RU/s](request-units.md) to handle the load. All Functions can work in parallel using your allocated RU/s and your data is guaranteed to be [consistent](consistency-levels.md).

* **Global replication**. You can replicate Azure Cosmos DB data [around the globe](distribute-data-globally.md) to reduce latency, geo-locating your data closest to where your users are. As with all Azure Cosmos DB queries, data from event-driven triggers is read data from the Azure Cosmos DB closest to the user.

Benefits of Azure Functions: 

* **Event-driven**. Azure Functions are event-driven and can listen to a change feed from Azure Cosmos DB. This means you don't need to create listening logic, you just keep an eye out for the changes you're listening for. 

* **No limits**. Functions execute in parallel and the service will spin up as many as you need. You set the parameters.

* **Good for quick tasks**. The service spins up new instances of functions whenever an event fires and closes them as soon as the function completes. You only pay for the time your functions are running

* If you're not sure whether Flow, Logic Apps, Azure Functions, or WebJobs are best for your implementation, see [Choose between Flow, Logic Apps, Functions, and WebJobs](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## Next steps

Now let's connect Azure Cosmos DB and Azure Functions for real: 

* Azure Cosmos DB trigger quickstart - link to be provided
* Azure Cosmos DB trigger tutorial (VS) - link to be provided
* Azure Cosmos DB bindings and triggers - link to be provided



 



