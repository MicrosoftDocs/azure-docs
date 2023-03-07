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

Both, the Request Unit (RU) and vCore-based Azure Cosmos DB for MongoDB offering make it easy to use Azure Cosmos DB as if it were a MongoDB database, without the overhead of management, and scaling approaches. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB. Additionally, both are cloud-native offerings that can be integrated seamlessly with other Azure services to build enterprise-grade modern applications.


## Choosing between RU-based and vCore-based options

Here are a few key factors to help you decide which is the right architecture for you:

|             | RU-based | vCore-based |
| ----------- | ----------- | -------|
| What do you want to do |  &bull; Works well if you are trying to build new cloud-native MongoDB apps or refactor existing apps for all the benefits of a cloud-native offering | &bull; Works well if you are trying to lift and shift existing MongoDB apps and run them as-is on a fully supported managed service. |
| What are your availability needs | &bull; Offers upto [99.999%](../high-availability.md#slas) of availability with multi-region deployments | &bull; Offers competitive SLA (once generally available) |
| How do you want to scale | &bull; Offers limitless horizontal scalability, instantaneous scale up and granular throughput control. | &bull; Offers high-capacity vertical and horizontal scaling with familiar vCore-based cluster tier options to choose from. |
| What are your top read & query patterns | &bull; Works well for workloads with more point reads *(fetching a single item by its ID and shard key value)* and lesser long running queries and complex aggregation pipeline operations. | &bull; Works well irrespective of the operation types in your workload. This may include workloads with long-running queries, complex aggregation pipelines, distributed transactions, joins, etc. |

## Resource and billing differences between the options

There are differences between the offerings in the way the resources are assigned and billed on the platform :

|             | RU-based | vCore-based |
| ----------- | ----------- | -------|
| How are the resources assigned | &bull; This is a multi-tenant service that instantly assigns resources to the workload to meet its storage and throughput needs. <br/>&bull; Throughput uses the concept of [Request Units (RUs)](../request-units.md). | &bull; These are dedicated instances using preset CPU, memory and storage resources that scale to meet your needs. |
| How are the resources billed | &bull; You pay variable fees for the RUs and consumed storage. <br/>&bull; RU charges are based on the choice of the model: provisioned throughput (standard or autoscale) or serverless. | &bull; You pay consistent flat fee based on the compute (CPU, memory and the number of nodes) and storage. | 

## Next steps

- [TODO: Link to a MongoDB (RU-based) tutorial or quickstart](about:blank)
- [TODO: Link to a second MongoDB (RU-based) tutorial or quickstart](about:blank)
- [TODO: Link to a MongoDB (vCore-based) tutorial or quickstart](about:blank)
