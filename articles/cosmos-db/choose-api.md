---
title: Choose an API in Azure Cosmos DB
description: Learn how to choose between APIs for NoSQL, MongoDB, Cassandra, Gremlin, and Table in Azure Cosmos DB based on your workload requirements.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 11/30/2022
ms.custom: ignite-2022
adobe-target: true
---

# Choose an API in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table, PostgreSQL](includes/appliesto-nosql-mongodb-cassandra-gremlin-table-postgresql.md)]

Azure Cosmos DB is a fully managed NoSQL database for modern app development. Azure Cosmos DB takes database administration off your hands with automatic management, updates, and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

## APIs in Azure Cosmos DB

Azure Cosmos DB offers multiple database APIs, which include NoSQL, MongoDB, PostgreSQL Cassandra, Gremlin, and Table. By using these APIs, you can model real world data using documents, key-value, graph, and column-family data models. These APIs allow your applications to treat Azure Cosmos DB as if it were various other databases technologies, without the overhead of management, and scaling approaches. Azure Cosmos DB helps you to use the ecosystems, tools, and skills you already have for data modeling and querying with its various APIs.

All the APIs offer automatic scaling of storage and throughput, flexibility, and performance guarantees. There's no one best API, and you may choose any one of the APIs to build your application. This article will help you choose an API based on your workload and team requirements.

## Considerations when choosing an API

API for NoSQL is native to Azure Cosmos DB.

API for MongoDB, PostgreSQL, Cassandra, Gremlin, and Table implement the wire protocol of open-source database engines. These APIs are best suited if the following conditions are true:

* If you have existing MongoDB, PostgreSQL Cassandra, or Gremlin applications
* If you don't want to rewrite your entire data access layer
* If you want to use the open-source developer ecosystem, client-drivers, expertise, and resources for your database
* If you want to use the Azure Cosmos DB core features such as:
  * Global distribution
  * Elastic scaling of storage and throughput
  * High performance at scale
  * Low latency
  * Ability to run transactional and analytical workloads
  * Fully managed platform
* If you're developing modernized apps on a multicloud environment

You can build new applications with these APIs or migrate your existing data. To run the migrated apps, change the connection string of your application and continue to run as before. When migrating existing apps, make sure to evaluate the feature support of these APIs.

Based on your workload, you must choose the API that fits your requirement. The following image shows a flow chart on how to choose the right API when building new apps or migrating existing apps to Azure Cosmos DB:

:::image type="complex" source="media/choose-api/decision-tree.svg" alt-text="Diagram of the decision tree to choose an API in Azure Cosmos DB.":::
    Diagram of the decision tree to choose an API in Azure Cosmos DB. Half of the diagram illustrates how many existing open-source database workloads can use the corresponding APIs for Azure Cosmos DB. The other half of the diagram illustrates how new applications can either use the API for NoSQL, or use your existing skills with APIs for open-source databases.
:::image-end:::

## <a id="coresql-api"></a> API for NoSQL

The Azure Cosmos DB API for NoSQL stores data in document format. It offers the best end-to-end experience as we have full control over the interface, service, and the SDK client libraries. Any new feature that is rolled out to Azure Cosmos DB is first available on API for NoSQL accounts. NoSQL accounts provide support for querying items using the Structured Query Language (SQL) syntax, one of the most familiar and popular query languages to query JSON objects. To learn more, see the [Azure Cosmos DB API for NoSQL](/training/modules/intro-to-azure-cosmos-db-core-api/) training module and [getting started with SQL queries](nosql/query/getting-started.md) article.

If you're migrating from other databases such as Oracle, DynamoDB, HBase etc. and if you want to use the modernized technologies to build your apps, API for NoSQL is the recommended option. API for NoSQL supports analytics and offers performance isolation between operational and analytical workloads.

## API for MongoDB

The Azure Cosmos DB API for MongoDB stores data in a document structure, via BSON format. It's compatible with MongoDB wire protocol; however, it doesn't use any native MongoDB related code. The API for MongoDB is a great choice if you want to use the broader MongoDB ecosystem and skills, without compromising on using Azure Cosmos DB features.

The features that Azure Cosmos DB provides, that you don't have to compromise on includes:

* Scaling
* High availability
* Geo-replication
* Multiple write locations
* Automatic and transparent shard management
* Transparent replication between operational and analytical stores

You can use your existing MongoDB apps with API for MongoDB by just changing the connection string. You can move any existing data using native MongoDB tools such as mongodump & mongorestore or using our Azure Database Migration tool. Tools, such as the MongoDB shell, [MongoDB Compass](mongodb/connect-using-compass.md), and [Robo3T](mongodb/connect-using-robomongo.md), can run queries and work with data as they do with native MongoDB. To learn more, see [API for MongoDB](mongodb/introduction.md) article.

## API for PostgreSQL

Azure Cosmos DB for PostgreSQL is a managed service for running PostgreSQL at any scale, with the [Citus open source](https://github.com/citusdata/citus) superpower of distributed tables. It stores data either on a single node, or distributed in a multi-node configuration.

Azure Cosmos DB for PostgreSQL is built on native PostgreSQL--rather than a PostgreSQL fork--and lets you choose any major database versions supported by the PostgreSQL community. It's ideal for starting on a single-node database with rich indexing, geospatial capabilities, and JSONB support. Later, if need more performance, you can add nodes to the cluster with zero downtime.

If you’re looking for a managed open source relational database with high performance and geo-replication, Azure Cosmos DB for PostgreSQL is the recommended choice. To learn more, see the [Azure Cosmos DB for PostgreSQL introduction](postgresql/introduction.md).

## <a id="cassandra-api"></a> API for Apache Cassandra

The Azure Cosmos DB API for Cassandra stores data in column-oriented schema. Apache Cassandra offers a highly distributed, horizontally scaling approach to storing large volumes of data while offering a flexible approach to a column-oriented schema. API for Cassandra in Azure Cosmos DB aligns with this philosophy to approaching distributed NoSQL databases. This API for Cassandra is wire protocol compatible with native Apache Cassandra. You should consider API for Cassandra if you want to benefit from the elasticity and fully managed nature of Azure Cosmos DB and still use most of the native Apache Cassandra features, tools, and ecosystem. This fully managed nature means on API for Cassandra you don't need to manage the OS, Java VM, garbage collector, read/write performance, nodes, clusters, etc.

You can use Apache Cassandra client drivers to connect to the API for Cassandra. The API for Cassandra enables you to interact with data using the Cassandra Query Language (CQL), and tools like CQL shell, Cassandra client drivers that you're already familiar with. API for Cassandra currently only supports OLTP scenarios. Using API for Cassandra, you can also use the unique features of Azure Cosmos DB such as [change feed](cassandra/change-feed.md). To learn more, see [API for Cassandra](cassandra/introduction.md) article. For more information if you're already familiar with Apache Cassandra, but are new to Azure Cosmos DB, see [how to adapt to API for Cassandra](./cassandra/adoption.md).

## <a id="gremlin-api"></a> API for Apache Gremlin

The Azure Cosmos DB API for Gremlin allows users to make graph queries and stores data as edges and vertices.

Use the API for Gremlin for scenarios:

* Involving dynamic data
* Involving data with complex relations
* Involving data that is too complex to be modeled with relational databases
* If you want to use the existing Gremlin ecosystem and skills

The API for Gremlin combines the power of graph database algorithms with highly scalable, managed infrastructure. This API provides a unique and flexible solution to common data problems associated with lack of flexibility or relational approaches. API for Gremlin currently only supports OLTP scenarios.

The API for Gremlin is based on the [Apache TinkerPop](https://tinkerpop.apache.org/) graph computing framework. API for Gremlin uses the same Graph query language to ingest and query data. It uses the Azure Cosmos DB partition strategy to do the read/write operations from the Graph database engine. API for Gremlin has a wire protocol support with the open-source Gremlin, so you can use the open-source Gremlin SDKs to build your application. API for Gremlin also works with Apache Spark and [GraphFrames](https://github.com/graphframes/graphframes) for complex analytical graph scenarios. To learn more, see [API for Gremlin](gremlin/introduction.md) article.

## <a id="table-api"></a> API for Table

The Azure Cosmos DB API for Table stores data in key/value format. If you're currently using Azure Table storage, you may see some limitations in latency, scaling, throughput, global distribution, index management, low query performance. API for Table overcomes these limitations and it's recommended to migrate your app if you want to use the benefits of Azure Cosmos DB. API for Table only supports OLTP scenarios.

Applications written for Azure Table storage can migrate to the API for Table with little code changes and take advantage of premium capabilities. To learn more, see [API for Table](table/introduction.md) article.

## Capacity planning when migrating data

Trying to do capacity planning for a migration to Azure Cosmos DB for NoSQL or MongoDB from an existing database cluster? You can use information about your existing database cluster for capacity planning.

* For more information about estimating request units if all you know is the number of vCores and servers in your existing sharded and replicated database cluster, see [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md).
* For more information about estimating request units if you know typical request rates for your current database workload, see  [capacity planner for API for NoSQL](./sql/estimate-ru-with-capacity-planner.md) and [API for MongoDB](./mongodb/estimate-ru-capacity-planner.md)

## Next steps

* [Get started with Azure Cosmos DB for NoSQL](nosql/quickstart-dotnet.md)
* [Get started with Azure Cosmos DB for MongoDB](mongodb/create-mongodb-nodejs.md)
* [Get started with Azure Cosmos DB for PostgreSQL](postgresql/quickstart-create-portal.md)
* [Get started with Azure Cosmos DB for Cassandra](cassandra/manage-data-dotnet.md)
* [Get started with Azure Cosmos DB for Gremlin](gremlin/quickstart-dotnet.md)
* [Get started with Azure Cosmos DB for Table](table/quickstart-dotnet.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  * If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md)
  * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](./sql/estimate-ru-with-capacity-planner.md)
