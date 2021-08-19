---
title: Introduction to Azure Cosmos DB
description: Learn about Azure Cosmos DB. This globally-distributed multi-model database is built for low latency, elastic scalability, high availability, and offers native support for NoSQL data.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 06/04/2021

---

# Welcome to Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Today's applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. Applications need to respond in real time to large changes in usage at peak hours, store ever increasing volumes of data, and make this data available to users in milliseconds.

Azure Cosmos DB is a fully managed NoSQL database for modern app development. Single-digit millisecond response times, and automatic and instant scalability, guarantee speed at any scale. Business continuity is assured with [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) availability and enterprise-grade security. App development is faster and more productive thanks to turnkey multi region data distribution anywhere in the world, open source APIs and SDKs for popular languages. As a fully managed service, Azure Cosmos DB takes database administration off your hands with automatic management, updates and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

You can [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments or use the [Azure Cosmos DB free tier](free-tier.md) to get an account with the first 1000 RU/s and 25 GB of storage free.

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/)

> [!TIP]
> To learn more about Azure Cosmos DB, join us every Thursday at 1PM Pacific on Azure Cosmos DB Live TV. See the [Upcoming session schedule and past episodes](https://gotcosmos.com/tv).

:::image type="content" source="./media/introduction/azure-cosmos-db.png" alt-text="Azure Cosmos DB is a fully managed NoSQL database for modern app development." border="false":::

## Key Benefits

### Guaranteed speed at any scale

Gain unparalleled [SLA-backed](https://azure.microsoft.com/support/legal/sla/cosmos-db) speed and throughput, fast global access, and instant elasticity.

- Real-time access with fast read and write latencies globally, and throughput and consistency all backed by [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db)
- Multi-region writes and data distribution to any Azure region with the click of a button.
- Independently and elastically scale storage and throughput across any Azure region – even during unpredictable traffic bursts – for unlimited scale worldwide.

### Simplified application development

Build fast with open source APIs, multiple SDKs, schemaless data and no-ETL analytics over operational data.

- Deeply integrated with key Azure services used in modern (cloud-native) app development including Azure Functions, IoT Hub, AKS (Azure Kubernetes Service), App Service, and more.
- Choose from multiple database APIs including the native Core (SQL) API, API for MongoDB, Cassandra API, Gremlin API, and Table API.
- Build apps on Core (SQL) API using the languages of your choice with SDKs for .NET, Java, Node.js and Python. Or your choice of drivers for any of the other database APIs.
- Run no-ETL analytics over the near-real time operational data stored in Azure Cosmos DB with Azure Synapse Analytics.
- Change feed makes it easy to track and manage changes to database containers and create triggered events with Azure Functions.
- Azure Cosmos DB’s schema-less service automatically indexes all your data, regardless of the data model, to deliver blazing fast queries.

### Mission-critical ready

Guarantee business continuity, 99.999% availability, and enterprise-level security for every application.

- Azure Cosmos DB offers a comprehensive suite of [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db) including industry-leading availability worldwide.
- Easily distribute data to any Azure region with automatic data replication. Enjoy zero downtime with multi-region writes or RPO 0 when using Strong consistency.
- Enjoy enterprise-grade encryption-at-rest with self-managed keys.
- Azure role-based access control keeps your data safe and offers fine-tuned control.

### Fully managed and cost-effective

End-to-end database management, with serverless and automatic scaling matching your application and TCO needs

- Fully-managed database service. Automatic, no touch, maintenance, patching, and updates, saving developers time and money.
- Cost-effective options for unpredictable or sporadic workloads of any size or scale, enabling developers to get started easily without having to plan or manage capacity.
- Serverless model offers spiky workloads automatic and responsive service to manage traffic bursts on demand.
- Autoscale provisioned throughput automatically and instantly scales capacity for unpredictable workloads, while maintaining [SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db).

## Solutions that benefit from Azure Cosmos DB

Any [web, mobile, gaming, and IoT application](use-cases.md) that needs to handle massive amounts of data, reads, and writes at a [global scale](distribute-data-globally.md) with near-real response times for a variety of data will benefit from Cosmos DB's [guaranteed high availability](https://azure.microsoft.com/support/legal/sla/cosmos-db/), high throughput, low latency, and tunable consistency. Learn about how Azure Cosmos DB can be used to build [IoT and telematics](use-cases.md#iot-and-telematics), [retail and marketing](use-cases.md#retail-and-marketing), [gaming](use-cases.md#gaming) and [web and mobile applications](use-cases.md#web-and-mobile-applications).

## Next steps

Get started with Azure Cosmos DB with one of our quickstarts:

- Learn [how to choose an API](choose-api.md) in Azure Cosmos DB
- [Get started with Azure Cosmos DB SQL API](create-sql-api-dotnet.md)
- [Get started with Azure Cosmos DB's API for MongoDB](mongodb/create-mongodb-nodejs.md)
- [Get started with Azure Cosmos DB Cassandra API](cassandra/manage-data-dotnet.md)
- [Get started with Azure Cosmos DB Gremlin API](create-graph-dotnet.md)
- [Get started with Azure Cosmos DB Table API](table/create-table-dotnet.md)
- [A whitepaper on next-gen app development with Azure Cosmos DB](https://azure.microsoft.com/resources/microsoft-azure-cosmos-db-flexible-reliable-cloud-nosql-at-any-scale/)

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/)
