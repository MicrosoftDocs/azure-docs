---
author: hhunter-ms
ms.topic: include
ms.date: 04/22/2024
ms.author: hannahhunter
---

#### Tier 1 versus tier 2 components

A subset of Dapr components is supported for the Dapr extension for AKS and Arc-enabled Kubernetes. Within that subset, Dapr components are broken into two support categories: tier 1 or tier 2.  

- [Tier 1 components:](#tier-1-components) Fully managed, stable components that receive immediate investigation in critical (security or serious regression) scenarios. Otherwise, collaborate with open source to address in a hotfix or the next regular release.
- [Tier 2 components:](#tier-2-components) Built-in components that receive immediate investigation and are supported with best effort attempt to address with third party provider.

##### Tier 1 components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Blob Storage v1<br>Azure Table Storage<br>Microsoft SQL Server | `state.azure.blobstorage`<br>`state.azure.tablestorage`<br>`state.sqlserver` | 
| Publish & subscribe | Azure Service Bus Queues<br>Azure Service Bus Topics<br>Azure Event Hubs | `pubsub.azure.servicebus.queues`<br>`pubsub.azure.servicebus.topics`<br>`pubsub.azure.eventhubs` |
| Binding | Azure Storage Queues<br>Azure Service Bus Queues<br>Azure Blob Storage<br>Azure Event Hubs | `bindings.azure.storagequeues`<br>`bindings.azure.servicebusqueues`<br>`bindings.azure.blobstorage`<br>`bindings.azure.eventhubs` |

##### Tier 2 components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Cosmos DB<br>PostgreSQL<br>MySQL & MariaDB<br>Redis | `state.azure.cosmosdb`<br>`state.postgresql`<br>`state.mysql`<br>`state.redis` | 
| Publish & subscribe | Apache Kafka<br>Redis Streams | `pubsub.kafka`<br>`pubsub.redis` |
| Binding | Azure Event Grid<br>Azure Cosmos DB<br>Apache Kafka<br>PostgreSQL<br>Redis<br>Cron | `bindings.azure.eventgrid`<br>`bindings.azure.cosmosdb`<br>`bindings.kafka`<br>`bindings.postgresql`<br>`bindings.redis`<br>`bindings.cron` |
| Configuration | PostgreSQL<br>Redis | `bindings.postgresql`<br>`bindings.redis` |