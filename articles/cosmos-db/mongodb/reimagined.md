---
title: Your MongoDB app reimagined
description: Easily transition your MongoDB apps to attain planet scale and high availability while maintaining continuity.
author: wmwxwa
ms.author: wangwilliam
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: conceptual
ms.date: 04/10/2024
---

# Your MongoDB app reimagined

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

You have launched an app using [MongoDB](https://www.mongodb.com/) as its database. Word of mouth spreads slowly, and a small but loyal user base forms. They diligently give you feedback, helping you improve it. As you continue to fix issues and add features, more and more users fall in love with your app, and your users grows like a snowball rolling down a hill. Celebrities and influencers endorse it; teenagers use its name as an everyday verb. Suddenly, your app's usage skyrockets, and you watch in awe as the user count soars, anticipating your creation to become a staple on devices worldwide.

But, timeouts become increasingly frequent, especially when traffic spikes. The rapid growth and unpredictable demand push your infrastructure to its limits, making scalability a pressing issue. Yet overhauling your data pipeline is out of the question given your resource and time constraints.

You chose MongoDB for its flexibility. Now, when you face demanding requirements on scalability, availability, continuity, and cost, Azure Cosmos DB for MongoDB comes to the rescue.

You point your app to the connection string of this fully managed database, which offers single-digit millisecond response times, automatic and instant scalability, and guaranteed speed at any scale. Even OpenAI chose its underlying service to dynamically scale their ChatGPT service – one of the fastest-growing consumer apps ever – enabling high reliability and low maintenance. When you use its API [for MongoDB](introduction.md), you continue to use your existing MongoDB skills and your favorite MongoDB drivers, SDKs, and tools, while reaping the following benefits from choosing either of the two available architectures:

## Dynamically scale your MongoDB app

### vCore Architecture

[A fully managed MongoDB-compatible service](./vcore/introduction.md) with dedicated instances for new and existing MongoDB apps. This architecture offers a familiar vCore architecture for MongoDB users, efficient scaling, and seamless integration with Azure services.

- **Integrated Vector Database**: Seamlessly integrate your AI-based applications using the integrated vector database. This integration offers an all-in-one solution, allowing you to store your operational/transactional data and vector data together. Unlike other vector database solutions that involve sending your data between service integrations, this approach saves on cost and complexity.

- **Flat pricing with Low total cost of ownership**: Enjoy a familiar pricing model, based on compute (vCores & RAM) and storage (disks).

- **Elevate querying with Text Indexes**: Enhance your data querying efficiency with our text indexing feature. Seamlessly navigate full-text searches across MongoDB collections, simplifying the process of extracting valuable insights from your documents.

- **Scale with no shard key required**: Simplify your development process with high-capacity vertical scaling, all without the need for a shard key. Sharding and scaling horizontally is simple once collections are into the TBs.

- **Free 35 day Backups with point in time restore (PITR)**: Free 35 day backups for any amount of data.

> [!TIP]
> Visit [Choose your model](./choose-model.md) for an in-depth comparison of each architecture to help you choose which one is right for you.

### Request Unit (RU) architecture

[A fully managed MongoDB-compatible service](./ru/introduction.md) with flexible scaling using [Request Units (RUs)](../request-units.md). Designed for cloud-native applications.

- **Instantaneous scalability**: With the [Autoscale](../provision-throughput-autoscale.md) feature, your database scales instantaneously with zero warmup period. You no longer have to wait for MongoDB Atlas or another MongoDB service you use to take hours to scale up and up to days to scale down.

- **Automatic and transparent sharding**: The infrastructure is fully managed for you. This management includes sharding and optimizing the number of shards as your applications horizontally scale. The automatic and transparent sharding saves you the time and effort you previously spent on specifying and managing MongoDB Atlas sharding, and you can better focus on developing applications for your users.

- **Five 9's of availability**: [99.999% availability](../high-availability.md) is easily configurable to ensure your data is always there for you.

- **Active-active database**: Databases can span multiple regions, with no single point of failure for **writes and reads for the same data**. MongoDB global clusters only support active-passive deployments for writes for the same data.

- **Cost efficient, granular, unlimited scalability**: The platform can scale in increments as small as 1/100th of a VM due to its architecture. This scalability means that you can scale your database to the exact size you need, without paying for unused resources.

- **Real time analytics (HTAP) at any scale**: Run analytics workloads against your transactional MongoDB data in real time with no effect on your database. This analysis is fast and inexpensive, due to the cloud native analytical columnar store being utilized, with no ETL pipelines. Easily create Power BI dashboards, integrate with Azure Machine Learning and Azure AI services, and bring all of your data from your MongoDB workloads into a single data warehousing solution. Learn more about the [Azure Synapse Link](../synapse-link.md).

- **Serverless deployments**: In [serverless capacity mode](../serverless.md), you're only charged per operation, and don't pay for the database when you don't use it.

> [!TIP]
> Visit [Choose your model](./choose-model.md) for an in-depth comparison of each architecture to help you choose which one is right for you.

>[!NOTE]
> This service implements the wire protocol for MongoDB. This implementation allows transparent compatibility with MongoDB client SDKs, drivers, and tools. This service doesn't host the MongoDB database engine. Any MongoDB client driver compatible with the API version you're using should be able to connect, with no special configuration. Microsoft does not run MongoDB databases to provide this service. This service is not affiliated with MongoDB, Inc.

## How to connect a MongoDB application

- [Connect to vCore-based model](vcore/migration-options.md) and [FAQ](vcore/faq.yml)
- [Get answers to frequently asked questions about Azure Cosmos DB for MongoDB RU](faq.yml)
