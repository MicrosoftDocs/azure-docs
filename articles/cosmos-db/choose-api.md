---
title: Choose an API in Azure Cosmos DB
description: Learn how to choose between SQL/Core, MongoDB, Cassandra, Gremlin, and table APIs in Azure Cosmos DB based on your workload requirements.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/08/2021
ms.custom: cosmos-db-video
adobe-target: true
---

# Choose an API in Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB is a fully managed NoSQL database for modern app development. Azure Cosmos DB takes database administration off your hands with automatic management, updates, and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

>
> [!VIDEO https://aka.ms/docs.essential-apis]

## APIs in Azure Cosmos DB

Azure Cosmos DB offers multiple database APIs, which include the Core (SQL) API, API for MongoDB, Cassandra API, Gremlin API, and Table API. By using these APIs, you can model real world data using documents, key-value, graph, and column-family data models. These APIs allow your applications to treat Azure Cosmos DB as if it were various other databases technologies, without the overhead of management, and scaling approaches. Using these APIs, Azure Cosmos DB helps you to use the ecosystems, tools, and skills you already have for data modeling and querying.

All the APIs offer automatic scaling of storage and throughput, flexibility, and performance guarantees. There is no one best API, and you may choose any one of the APIs to build your application. This article will help you choose an API based on your workload and team requirements.

## Considerations when choosing an API

Core(SQL) API is native to Azure Cosmos DB.

API for MongoDB, Cassandra, Gremlin, and Table implement the wire protocol of open-source database engines. These APIs are best suited if the following conditions are true:

* If you have existing MongoDB, Cassandra, or Gremlin applications.
* If you don't want to rewrite your entire data access layer.
* If you want to use the open-source developer ecosystem, client-drivers, expertise, and resources for your database.
* If you want to use the Azure Cosmos DB key features such as global distribution, elastic scaling of storage and throughput, performance, low latency, ability to run transactional and analytical workload, and use a fully managed platform.
* If you are developing modernized apps on a multi-cloud environment.

You can build new applications with these APIs or migrate your existing data. To run the migrated apps, change the connection string of your application and continue to run as before. When migrating existing apps, make sure to evaluate the feature support of these APIs.

Based on your workload, you must choose the API that fits your requirement. The following image shows a flow chart on how to choose the right API when building new apps or migrating existing apps to Azure Cosmos DB:

:::image type="content" source="./media/choose-api/choose-api-decision-tree.png" alt-text="Decision tree to choose an API in Azure Cosmos DB." lightbox="./media/choose-api/choose-api-decision-tree.png":::

## Core(SQL) API

This API stores data in document format. It offers the best end-to-end experience as we have full control over the interface, service, and the SDK client libraries. Any new feature that is rolled out to Azure Cosmos DB is first available on SQL API accounts. Azure Cosmos DB SQL API accounts provide support for querying items using the Structured Query Language (SQL) syntax, one of the most familiar and popular query languages to query JSON objects. To learn more, see the [Azure Cosmos DB SQL API](/learn/modules/intro-to-azure-cosmos-db-core-api/) training module and [getting started with SQL queries](sql-query-getting-started.md) article.

If you are migrating from other databases such as Oracle, DynamoDB, HBase etc. and if you want to use the modernized technologies to build your apps, SQL API is the recommended option. SQL API supports analytics and offers performance isolation between operational and analytical workloads.

## API for MongoDB

This API stores data in a document structure, via BSON format. It is compatible with MongoDB wire protocol; however, it does not use any native MongoDB related code. This API is a great choice if you want to use the broader MongoDB ecosystem and skills, without compromising on using Azure Cosmos DB features such as scaling, high availability, geo-replication, multiple write locations, automatic and transparent shard management, transparent replication between operational and analytical stores, and more.

You can use your existing MongoDB apps with API for MongoDB by just changing the connection string. You can move any existing data using native MongoDB tools such as mongodump & mongorestore or using our Azure Database Migration tool. Tools, such as the MongoDB shell, [MongoDB Compass](mongodb/connect-using-compass.md), and [Robo3T](mongodb/connect-using-robomongo.md), can run queries and work with data as they do with native MongoDB. To learn more, see [API for MongoDB](mongodb/mongodb-introduction.md) article.

## Cassandra API

This API stores data in column-oriented schema. Apache Cassandra offers a highly distributed, horizontally scaling approach to storing large volumes of data while offering a flexible approach to a column-oriented schema. Cassandra API in Azure Cosmos DB aligns with this philosophy to approaching distributed NoSQL databases. Cassandra API is wire protocol compatible with the Apache Cassandra. You should consider Cassandra API if you want to benefit the elasticity and fully managed nature of Azure Cosmos DB and still use most of the native Apache Cassandra features, tools, and ecosystem. This means on Cassandra API you don't need to manage the OS, Java VM, garbage collector, read/write performance, nodes, clusters, etc.

You can use Apache Cassandra client drivers to connect to the Cassandra API. The Cassandra API enables you to interact with data using the Cassandra Query Language (CQL), and tools like CQL shell, Cassandra client drivers that you're already familiar with. Cassandra API currently only supports OLTP scenarios. Using Cassandra API, you can also use the unique features of Azure Cosmos DB such as [change feed](cassandra-change-feed.md). To learn more, see [Cassandra API](cassandra-introduction.md) article. If you're already familiar with Apache Cassandra, but new to Azure Cosmos DB, we recommend our article on [how to adapt to the Cassandra API if you are coming from Apache Cassandra](./cassandra/cassandra-adoption.md).

## Gremlin API

This API allows users to make graph queries and stores data as edges and vertices. Use this API for scenarios involving dynamic data, data with complex relations, data that is too complex to be modeled with relational databases, and if you want to use the existing Gremlin ecosystem and skills. The Azure Cosmos DB Gremlin API combines the power of graph database algorithms with highly scalable, managed infrastructure. It provides a unique, flexible solution to most common data problems associated with lack of flexibility and relational approaches. Gremlin API currently only supports OLTP scenarios.

The Azure Cosmos DB Gremlin API is based on the [Apache TinkerPop](https://tinkerpop.apache.org/) graph computing framework. Gremlin API uses the same Graph query language to ingest and query data. It uses the Azure Cosmos DB partition strategy to do the read/write operations from the Graph database engine. Gremlin API has a wire protocol support with the open-source Gremlin, so you can use the open-source Gremlin SDKs to build your application. Azure Cosmos DB Gremlin API also works with Apache Spark and [GraphFrames](https://github.com/graphframes/graphframes) for complex analytical graph scenarios. To learn more, see [Gremlin API](graph-introduction.md) article.

## Table API

This API stores data in key/value format. If you are currently using Azure Table storage, you may see some limitations in latency, scaling, throughput, global distribution, index management, low query performance. Table API overcomes these limitations and it's recommended to migrate your app if you want to use the benefits of Azure Cosmos DB. Table API only supports OLTP scenarios.

Applications written for Azure Table storage can migrate to the Table API with little code changes and take advantage of premium capabilities. To learn more, see [Table API](table/introduction.md) article.

## Capacity planning when migrating data

Trying to do capacity planning for a migration to Azure Cosmos DB API for SQL or MongoDB from an existing database cluster? You can use information about your existing database cluster for capacity planning.

* If all you know is the number of vcores and servers in your existing sharded and replicated database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md).

* If you know typical request rates for your current database workload, read about estimating request units using Azure Cosmos DB [capacity planner for SQL API](./sql/estimate-ru-with-capacity-planner.md) and [API for MongoDB](./mongodb/estimate-ru-capacity-planner.md)

## Next steps

* [Get started with Azure Cosmos DB SQL API](create-sql-api-dotnet.md)
* [Get started with Azure Cosmos DB API for MongoDB](mongodb/create-mongodb-nodejs.md)
* [Get started with Azure Cosmos DB Cassandra API](cassandra/manage-data-dotnet.md)
* [Get started with Azure Cosmos DB Gremlin API](create-graph-dotnet.md)
* [Get started with Azure Cosmos DB Table API](create-table-dotnet.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](./sql/estimate-ru-with-capacity-planner.md)
