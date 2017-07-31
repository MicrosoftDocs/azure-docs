---
title: 'Azure Cosmos DB: DocumentDB API articles | Microsoft Docs'
description: A list of all the articles specific to creating document databases with the DocumentDB API in Azure Cosmos DB. 
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
ms.date: 07/31/2017
ms.author: mimig

---
# Azure Cosmos DB: DocumentDB API documentation

Azure Cosmos DB has the following documentation that's specifically for creating document databases with the DocumentDB API.

These articles do not apply to the Graph API, Table API, or MongoDB API. 

## Introduction and concepts

These are must read topics and resources to start learning about the DocumentDB API for Azure Cosmos DB.

- [DocumentDB API introduction](documentdb-introduction.md). Provides an overview of the capabilites of the DocumentDB API and the document data model.
- [Database resources](documentdb-resources.md). An introduction to the resources used by the DocumentDB API: databases, collections, documents, etc.
- [Web site: Query playground](https://www.documentdb.com/sql/demo). A sandbox website available for you to try out SQL queries on Cosmos DB data.
- [Cheat sheet: SQL grammar](documentdb-sql-query-cheat-sheet.md). A printable cheatsheet of common SQL queries for the DocumentDB API.

## Quickstarts

The Quickstart topics are the fastest way to create a working application with Azure Cosmos DB. In each Quickstart you'll learn how to use the UI-based Azure portal and your favorite coding language to create database solutions with Azure Cosmos DB. Cloneable web apps from GitHub area available for each Quickstart. 

- [.NET + Azure Portal + Web apps](create-documentdb-dotnet.md)
- [Java + Azure portal + Web apps](create-documentdb-java.md)
- [Node.js + Azure portal + Web apps](create-documentdb-nodejs.md)
- [Python + Azure portal + Web apps](create-documentdb-python.md)
- [Xamarin + .NET + Azure portal + Web apps](create-documentdb-xamarin-dotnet.md)

## Tutorials

These tutorials are a level deeper than the Quickstarts. In the tutorials you'll build apps from scratch and copy and paste code into the app. You'll also learn how to import data, query data, and distribute your databases globally.

### Tutorials to create a web app

These tutorials walks you through the creation of an Azure Web app that uses Azure Cosmos DB to create an online todo list from scratch. 

- [.NET](documentdb-dotnet-application.md)
- [Node.js](documentdb-nodejs-application.md) 
- [Java](documentdb-java-application.md)
- [Python](documentdb-python-application.md)

### Tutorials to create a console app

These tutorials walk you through the creation of a console app that uses Azure Cosmos DB to store family data.  

- [.NET](documentdb-get-started.md)
- [.NET Core](documentdb-dotnetcore-get-started.md) 
- [Java](documentdb-java-get-started.md) 
- [Node.js](documentdb-nodejs-get-started.md) 
- [C++](documentdb-cpp-get-started.md)

### Tutorial to create a mobile app

This tutorial walks you throught the creation of a mobile todo list using Xamarin, Azure Cosmos DB, and Facebook authentication.

- [Xamarin](mobile-apps-with-xamarin.md)

### Tutorials to work with your data

- [Import data](import-data.md). This tutorial shows you how to use the Azure Cosmos DB: DocumentDB API Data Migration tool to import data from various sources, including JSON files, CSV files, SQL, MongoDB, Azure Table storage, Amazon DynamoDB and Azure Cosmos DB DocumentDB API collections into collections for use with Azure Cosmos DB and the DocumentDB API.
- [Query](tutorial-query-documentdb.md). A brief introduction to query basics using the DocumentDB API.
- [Distribute data globally](tutorial-global-distribution-documentdb.md). Learn how to distribute data globally using the DocumentDB API.

## Developers guide

- [SQL queries](documentdb-sql-query.md). Learn how to perform complex queries using the DocumentDB API.
- [Partitioning](documentdb-partition-data.md). Learn how to partition your data and choose a partition key to horizontally scale your data.
- [Server-side programming: Stored procedures, database triggers, and UDFs](programming.md). Learn how to create stored procedures, triggers, and user defined functions (UDFs) in JavaScript. 
- [Performance testing](performance-testing.md). Learn how to run the performance testing sample locally, and achieve high throughput levels from your client application.
- [Performance tips](performance-tips.md). Learn how to improve database performance.
- [Multi-master setup](multi-region-writers.md). Learn how to develop an app that writes to Azure Cosmos DB from multiple regions. 
- [DateTimes](working-with-dates.md). Learn how to store, index, and query DateTime values with the DocumentDB API.
- [Modeling document data](modeling-data.md). Learn how to model document data by knowing when to embed, reference, and use hybrid relationships between documents.  

## SDKs & Reference content

Azure Cosmos DB provides a number of SDKs to enable client side application development.

- [Java](documentdb-sdk-java.md)
- [.NET](documentdb-sdk-dotnet.md)
- [.NET Change feed](documentdb-sdk-dotnet-changefeed.md)
- [.NET Core](documentdb-sdk-dotnet-core.md)
- [Node.js](documentdb-sdk-node.md)
- [Python](documentdb-sdk-python.md)
- [REST](/rest/api/documentdb/)
- [REST Resource Provider](/rest/api/documentdbresourceprovider/)
- [SQL query reference](documentdb-sql-query-reference.md)

## Samples

These sample pages provide links to sample code and API reference content for the most common DocumentDB API tasks.

- [.NET](documentdb-dotnet-samples.md)
- [Node.js](documentdb-nodejs-samples.md)
- [Python](documentdb-python-samples.md) 