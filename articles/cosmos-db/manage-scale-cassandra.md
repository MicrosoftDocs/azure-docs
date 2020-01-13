---
title: Managing scale with Cassandra API
description: The different options for scaling up/down in a Cassandra API account and their advantages/disadvantages
author: TheovanKraay
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: thvankra
---

# Managing scale with Cassandra API

To understand how to scale effectively in Cosmos DB, it is important to understand request units (RUs), and how to ensure they are provisioned properly to account for the performance demands in your system. To learn more about RUs, first consult our article on [request units](https://docs.microsoft.com/azure/cosmos-db/request-units). 

![Database operations consume Request Units](./media/request-units/request-units.png)

In this article, we will outline the spectrum of different options for managing scale and provisioning throughput (RUs) appropriately in the Azure Cosmos DB API for Cassandra: 

* Manually using the Azure portal
* Programmatically using the Control Plane
* Programmatically using CQL with your chosen SDK
* Using Autopilot

We will discuss the advantages and disadvantages of each approach, so you can decide on the best strategy for the needs of your system and overall architecture.  

## Using the Azure portal

You can consult our article [Provision throughput on containers and databases](https://docs.microsoft.com/azure/cosmos-db/set-throughput), which discusses the relative benefits of setting throughput at either [database](https://docs.microsoft.com/en-us/azure/cosmos-db/set-throughput#set-throughput-on-a-database) or [container](https://docs.microsoft.com/azure/cosmos-db/set-throughput#set-throughput-on-a-container) level in the [Azure portal](https://docs.microsoft.com/azure/cosmos-db/set-throughput#set-throughput-on-a-database-and-a-container).

The advantage of this method is that it is a straightforward turnkey way to manage throughput capacity in the database. However, the disadvantage is that in many cases, your approach to scaling may require certain levels of automation to be both cost effective and high performing. We discuss relevant scenarios and methods below.

## Using the Control Plane

The Azure Cosmos DB API for Cassandra provides the capability to adjust throughput programmatically using our various control plane features. Consult our articles [Azure Resource Manager](https://docs.microsoft.com/azure/cosmos-db/manage-cassandra-with-resource-manager), [Powershell](https://docs.microsoft.com/azure/cosmos-db/powershell-samples-cassandra), and [Azure CLI](https://docs.microsoft.com/azure/cosmos-db/cli-samples-cassandra) for guidance and samples.

The advantage of this method is that you can automate the scaling up or down of resources based on a timer to account for peak activity, or periods of low activity. Take a look at our sample [here](https://github.com/Azure-Samples/azure-cosmos-throughput-scheduler) for how to accomplish this using Azure Functions and Powershell.

A disadvantage with this approach may be that you cannot respond to unpredictable changing scale needs in real time. Instead, you may need to leverage the application context in your system, at the client/SDK level, or using [Autopilot](https://docs.microsoft.com/azure/cosmos-db/provision-throughput-autopilot).

## Using CQL with your chosen SDK

Cosmos DB will return rate limit (429) errors if clients are consuming more resources (RUs) than have been provisioned in the system. The Cassandra API in Azure Cosmos DB translates these exceptions to overloaded errors on the Cassandra native protocol. Use SDK level mechanisms to execute retries where necessary. For Java, we have a [Cosmos DB Extension](https://github.com/Azure/azure-cosmos-cassandra-extensions) for implementation of [Retry Policy](https://docs.datastax.com/en/drivers/java/2.0/com/datastax/driver/core/policies/RetryPolicy.html) (ensure that you account for query [idempotence](https://docs.datastax.com/en/developer/java-driver/3.0/manual/idempotence/), and the relevant rules for [retries](https://docs.datastax.com/en/developer/java-driver/3.0/manual/retries/#retries-and-idempotence)). We also have a [spark](https://mvnrepository.com/artifact/com.microsoft.azure.cosmosdb/azure-cosmos-cassandra-spark-helper) extension. When a retry is required due to the system being overloaded, you can scale the system dynamically at this point by executing [ALTER commands in CQL](https://docs.microsoft.com/azure/cosmos-db/cassandra-support#keyspace-and-table-options) for the given database or container.

The advantage of this approach is that is allows to to respond to scale needs dynamically and in a custom way that suits your application, while still leveraging the standard RU charges and rates. If your system's scale needs are mostly predictable (around 70% or more), using SDK with CQL be a more cost-effective method of auto-scaling than using Autopilot. The disadvantage with this approach is that it can be quite complex to implement, and retries while rate limiting may increase latency.

## Using Autopilot

In addition to manual or programmatic provisioning of throughput, you can also configure Azure cosmos containers in autopilot mode. Azure Cosmos containers and databases configured in autopilot mode will automatically and instantly scale the provisioned throughput based on your application needs without compromising the SLAs. You can consult our article [Create Azure Cosmos containers and databases in autopilot mode](https://docs.microsoft.com/azure/cosmos-db/provision-throughput-autopilot) for details on how to configure autopilot. 

The advantage of this approach is that it is the easiest way of managing the scaling needs in your system, and guarantees not to apply rate limiting within the configured RU ranges. The disadvantage is that, if the scaling needs in your system are not volatile and can largely be predicted, it may be a less cost effective way of handling your scaling needs than using the bespoke control plane or SDK level approaches mentioned above.

## Next steps

- Get started with [creating a Cassandra API account, database, and a table](create-cassandra-api-account-java.md) by using a Java application