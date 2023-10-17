---
title: Introduction
titleSuffix: Azure Cosmos DB
description: Azure Cosmos DB is a global multi-model database built for speed, elasticity and availability with native support for NoSQL and relational data.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 11/30/2022
ms.custom: ignite-2022
adobe-target: true
---

# Welcome to Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table, PostgreSQL](includes/appliesto-nosql-mongodb-cassandra-gremlin-table-postgresql.md)]

Today's applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. Applications need to respond in real time to large changes in usage at peak hours, store ever increasing volumes of data, and make this data available to users in milliseconds.

Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development. Azure Cosmos DB offers single-digit millisecond response times, automatic and instant scalability, along with guaranteed speed at any scale. Business continuity is assured with [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) availability and enterprise-grade security.

Use Retrieval Augmented Generation (RAG) to bring the most semantically relevant data to enrich your AI-powered applications built with Azure OpenAI models like GPT-3.5 and GPT-4. For more information, see [Retrieval Augmented Generation (RAG) with Azure Cosmos DB](vector-search.md#retrieval-augmented-generation).

App development is faster and more productive thanks to:

- Turnkey multi region data distribution anywhere in the world
- Open source APIs
- SDKs for popular languages.
- Retrieval Augmented Generation that brings your data to Azure OpenAI to

As a fully managed service, Azure Cosmos DB takes database administration off your hands with automatic management, updates and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

You can [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments or use the [Azure Cosmos DB free tier](free-tier.md) to get an account with the first 1000 RU/s and 25 GB of storage free.

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/)

> [!TIP]
> To learn more about Azure Cosmos DB, join us every Thursday at 1PM Pacific on Azure Cosmos DB Live TV. See the [Upcoming session schedule and past episodes](https://gotcosmos.com/tv).

:::image type="content" source="media/introduction/overview.svg" alt-text="Illustration of Azure Cosmos DB with multiple APIs distributed across various geographies." border="false":::

## Key Benefits

### Guaranteed speed at any scale

Gain unparalleled [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) speed and throughput, fast global access, and instant elasticity.

- Real-time access with fast read and write latencies globally, and throughput and consistency all backed by [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db)
- Multi-region writes and data distribution to any Azure region with just a button.
- Independently and elastically scale storage and throughput across any Azure region – even during unpredictable traffic bursts – for unlimited scale worldwide.

### Simplified application development

Build fast with open source APIs, multiple SDKs, schemaless data and no-ETL analytics over operational data.

- Deeply integrated with key Azure services used in modern (cloud-native) app development including Azure Functions, IoT Hub, AKS (Azure Kubernetes Service), App Service, and more.
- Choose from multiple database APIs including the native API for NoSQL, MongoDB, PostgreSQL, Apache Cassandra, Apache Gremlin, and Table.
- Build apps on API for NoSQL using the languages of your choice with SDKs for .NET, Java, Node.js and Python. Or your choice of drivers for any of the other database APIs.
- Change feed makes it easy to track and manage changes to database containers and create triggered events with Azure Functions.
- Azure Cosmos DB's schema-less service automatically indexes all your data, regardless of the data model, to deliver blazing fast queries.

### Mission-critical ready

Guarantee business continuity, 99.999% availability, and enterprise-level security for every application.

- Azure Cosmos DB offers a comprehensive suite of [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db) including industry-leading availability worldwide.
- Easily distribute data to any Azure region with automatic data replication. Enjoy zero downtime with multi-region writes or RPO 0 when using Strong consistency.
- Enjoy enterprise-grade encryption-at-rest with self-managed keys.
- Azure role-based access control keeps your data safe and offers fine-tuned control.

### Fully managed and cost-effective

End-to-end database management, with serverless and automatic scaling matching your application and TCO needs

- Fully managed database service. Automatic, no touch, maintenance, patching, and updates, saving developers time and money.
- Cost-effective options for unpredictable or sporadic workloads of any size or scale, enabling developers to get started easily without having to plan or manage capacity.
- Serverless model offers spiky workloads automatic and responsive service to manage traffic bursts on demand.
- Autoscale provisioned throughput automatically and instantly scales capacity for unpredictable workloads, while maintaining [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db).

### Azure Synapse Link for Azure Cosmos DB

[Azure Synapse Link for Azure Cosmos DB](synapse-link.md) is a cloud-native hybrid transactional and analytical processing (HTAP) capability that enables near real time analytics over operational data in Azure Cosmos DB. Azure Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

- Reduced analytics complexity with No ETL jobs to manage.
- Near real-time insights into your operational data.
- No effect on operational workloads.
- Optimized for large-scale analytics workloads.
- Cost effective.
- Analytics for locally available, globally distributed, multi-region writes.
- Native integration with Azure Synapse Analytics.

## Solutions that benefit from Azure Cosmos DB

[Web, mobile, gaming, and IoT applications](use-cases.md) that handle massive amounts of data, reads, and writes at a [global scale](distribute-data-globally.md) with near-real response times benefit from Azure Cosmos DB. Azure Cosmos DB's [guaranteed high availability](https://azure.microsoft.com/support/legal/sla/cosmos-db/), high throughput, low latency, and tunable consistency are huge advantages when building these types of applications. Learn about how Azure Cosmos DB can be used to build [IoT and telematics](use-cases.md#iot-and-telematics), [retail and marketing](use-cases.md#retail-and-marketing), [gaming](use-cases.md#gaming) and [web and mobile applications](use-cases.md#web-and-mobile-applications).

## Next steps

Get started with Azure Cosmos DB with one of our quickstarts:

- Learn [how to choose an API](choose-api.md) in Azure Cosmos DB
- [Get started with Azure Cosmos DB for NoSQL](nosql/quickstart-dotnet.md)
- [Get started with Azure Cosmos DB for MongoDB](mongodb/create-mongodb-nodejs.md)
- [Get started with Azure Cosmos DB for Apache Cassandra](cassandra/manage-data-dotnet.md)
- [Get started with Azure Cosmos DB for Apache Gremlin](gremlin/quickstart-dotnet.md)
- [Get started with Azure Cosmos DB for Table](table/quickstart-dotnet.md)
- [Get started with Azure Cosmos DB for PostgreSQL](postgresql/quickstart-app-stacks-python.md)
- [A whitepaper on next-gen app development with Azure Cosmos DB](https://azure.microsoft.com/resources/microsoft-azure-cosmos-db-flexible-reliable-cloud-nosql-at-any-scale/)
- Trying to do capacity planning for a migration to Azure Cosmos DB?
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md)
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/)
