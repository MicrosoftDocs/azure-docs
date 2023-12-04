---
title: Azure Cosmos DB – Unified AI Database
titleSuffix:
description: Azure Cosmos DB is a global multi-model database and ideal database for AI applications requiring speed, elasticity and availability with native support for NoSQL and relational data.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 11/02/2023
ms.custom: ignite-2022
adobe-target: true
---

# Azure Cosmos DB – Unified AI Database

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table, PostgreSQL](includes/appliesto-nosql-mongodb-cassandra-gremlin-table-postgresql.md)]

Today's applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. Applications need to respond in real time to large changes in usage at peak hours, store ever increasing volumes of data, and make this data available to users in milliseconds.

Recently, the surge of AI-powered applications created another layer of complexity, because many of these applications currently integrate a multitude of data stores. For example, some teams built applications that simultaneously connect to MongoDB, Postgres, and Gremlin. These databases differ in implementation workflow and operational performances, posing extra complexity for scaling applications. Azure Cosmos DB can simplify and expedite your development by being the single AI database for your applications. Azure Cosmos DB accommodates all your operational data models, including relational, document, vector, key-value, graph, and table.

Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development including; AI, digital commerce, Internet of Things, booking management, and other types of solutions. Azure Cosmos DB offers single-digit millisecond response times, automatic and instant scalability, along with guaranteed speed at any scale. Business continuity is assured with [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) availability and enterprise-grade security.

App development is faster and more productive thanks to:

- Turnkey multi-region data distribution anywhere in the world
- Open source APIs
- SDKs for popular languages.
- AI database functionalities like native vector search or seamless integration with Azure AI Services to support Retrieval Augmented Generation

As a fully managed service, Azure Cosmos DB takes database administration off your hands with automatic management, updates and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

You can [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments or use the [Azure Cosmos DB free tier](free-tier.md) to get an account with the first 1000 RU/s and 25 GB of storage free.

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/)

> [!TIP]
> To learn more about Azure Cosmos DB, join us every Thursday at 1PM Pacific on Azure Cosmos DB Live TV. See the [Upcoming session schedule and past episodes](https://gotcosmos.com/tv).

:::image type="content" source="media/introduction/overview.svg" alt-text="Illustration of Azure Cosmos DB with multiple APIs distributed across various geographies." border="false":::

## Key Benefits

Here's some key benefits of using Azure Cosmos DB.

### Guaranteed speed at any scale

Gain unparalleled [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) speed and throughput, fast global access, and instant elasticity.

- Real-time access with fast read and write latencies globally, and throughput and consistency all backed by [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db)
- Multi-region writes and data distribution to any Azure region with just a button.
- Independently and elastically scale storage and throughput across any Azure region – even during unpredictable traffic bursts – for unlimited scale worldwide.

### Simplified application development

Build fast with open-source APIs, multiple SDKs, schemaless data and no-ETL analytics over operational data.

- Deeply integrated with key Azure services used in modern (cloud-native) app development including Azure Functions, IoT Hub, AKS (Azure Kubernetes Service), App Service, and more.
- Choose from multiple database APIs including the native API for NoSQL, MongoDB, PostgreSQL, Apache Cassandra, Apache Gremlin, and Table.
- Use Azure Cosmos DB as your unified AI database for data models like relational, document, vector, key-value, graph, and table.
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

[Azure Synapse Link for Azure Cosmos DB](synapse-link.md) is a cloud-native hybrid transactional and analytical processing (HTAP) capability that enables analytics at near real-time over operational data in Azure Cosmos DB. Azure Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

- Reduced analytics complexity with No ETL jobs to manage.
- Near real-time insights into your operational data.
- No effect on operational workloads.
- Optimized for large-scale analytics workloads.
- Cost effective.
- Analytics for locally available, globally distributed, multi-region writes.
- Native integration with Azure Synapse Analytics.

## Azure Cosmos DB is more than an AI database

Besides AI database, Azure Cosmos DB should also be your goto database for web, mobile, gaming, and IoT applications. Azure Cosmos DB is well positioned for solutions that handle massive amounts of data, reads, and writes at a global scale with near-real response times. Azure Cosmos DB's guaranteed high availability, high throughput, low latency, and tunable consistency are huge advantages when building these types of applications. Learn about how Azure Cosmos DB can be used to build IoT and telematics, retail and marketing, gaming and web and mobile applications.

## Related content

- Learn [how to choose an API](choose-api.md) in Azure Cosmos DB
  - [Get started with Azure Cosmos DB for NoSQL](nosql/quickstart-dotnet.md)
  - [Get started with Azure Cosmos DB for MongoDB](mongodb/create-mongodb-nodejs.md)
  - [Get started with Azure Cosmos DB for Apache Cassandra](cassandra/manage-data-dotnet.md)
  - [Get started with Azure Cosmos DB for Apache Gremlin](gremlin/quickstart-dotnet.md)
  - [Get started with Azure Cosmos DB for Table](table/quickstart-dotnet.md)
  - [Get started with Azure Cosmos DB for PostgreSQL](postgresql/quickstart-app-stacks-python.md)
