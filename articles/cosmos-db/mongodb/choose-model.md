---
title: Choose between RU-based and vCore-based models
titleSuffix: Azure Cosmos DB for MongoDB
description: Choose whether the RU-based or vCore-based option for Azure Cosmos DB for MongoDB is ideal for your workload.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
author: nayakshweta
ms.author: shwetn
ms.date: 03/02/2023
---

# Choose between RU-based and vCore-based Azure Cosmos DB for MongoDB

Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development. 

Both, the RU-based and vCore-based Azure Cosmos DB for MongoDB offering make it easy to use Azure Cosmos DB as if it were a MongoDB database, without the overhead of management, and scaling approaches. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB. Additionally, both are cloud-native offerings that can be integrated seamlessly with other Azure services to build enterprise-grade modern applications.


## Considerations when choosing between RU-based and vCore-based options

Here are a few key factors to consider while choosing between the two offerings:

|             | RU-based | vCore-based |
| ----------- | ----------- | -------|
| Throughput granularity vs easy cost and capacity estimation | &bull; Needs a good understanding of [Request Units (RUs)](../request-units.md) concept for capacity and cost estimation. <br/>&bull; Allows to control throughput values at database and container levels. <br/>&bull; Supports instantaneous autoscale and serverless modes, so you can control the throughput and costs as per your workload requirements. | &bull; Easy cost and capacity planning with familiar vCore-based cluster tier options to choose from. <br/>&bull;  Does not need an understanding of Request Units (RUs) concept. <br/>&bull; More predictable costs based on cluster tier and disk sizes. However, you will not have access to granular throughput settings such as database/container level, autoscale, serverless modes, etc. |
| SLA guarantees | &bull; Offers upto [99.999%](../high-availability.md#slas) of availability with multi-region deployments | &bull; This offering is still in Preview and currently does not offer SLA guarantees |
| Read & Query patterns | &bull; Works well for workloads with more point reads *(fetching a single item by its ID and shard key value)* and lesser long running queries and complex aggregation pipeline operations. | &bull; Works well irrespective of the operation types in your workload. This may include workloads with long-running queries, complex aggregation pipelines, distributed transactions, joins, etc. |
| Latest MongoDB syntax and features | &bull; Latest MongoDB syntax and features will arrive late to this offering, as compared to vCore-based. | &bull; You can get access to the latest MongoDB syntaxes and features sooner through this offering, as compared to RU-based.|

## Next steps

- [TODO: Link to a MongoDB (RU-based) tutorial or quickstart](about:blank)
- [TODO: Link to a second MongoDB (RU-based) tutorial or quickstart](about:blank)
- [TODO: Link to a MongoDB (vCore-based) tutorial or quickstart](about:blank)
