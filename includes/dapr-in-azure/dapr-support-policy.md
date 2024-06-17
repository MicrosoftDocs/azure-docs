---
author: hhunter-ms
ms.topic: include
ms.date: 04/22/2024
ms.author: hannahhunter
---

#### Tier 1 versus Tier 2 components

A subset of Dapr components is supported. Within that subset, Dapr components are broken into two support categories: Tier 1 or Tier 2.  

- **Tier 1 components:** Stable components that receive immediate investigation in critical (security or serious regression) scenarios. Otherwise, Microsoft collaborates with open source to address in a hotfix or the next regular release.
- **Tier 2 components:** Components that are investigated on a lesser priority, as they're not in stable state or are with a third party provider.

##### Tier 1 components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Blob Storage v1<br>Azure Table Storage<br>Microsoft SQL Server | `state.azure.blobstorage`<br>`state.azure.tablestorage`<br>`state.sqlserver` | 
| Publish & subscribe | Azure Service Bus Queues<br>Azure Service Bus Topics<br>Azure Event Hubs | `pubsub.azure.servicebus.queues`<br>`pubsub.azure.servicebus.topics`<br>`pubsub.azure.eventhubs` |
| Binding | Azure Storage Queues<br>Azure Service Bus Queues<br>Azure Blob Storage<br>Azure Event Hubs | `bindings.azure.storagequeues`<br>`bindings.azure.servicebusqueues`<br>`bindings.azure.blobstorage`<br>`bindings.azure.eventhubs` |
| Secrets management | Azure Key Vault | `secrets.azure.keyvault` |

##### Tier 2 components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Cosmos DB<br>PostgreSQL<br>MySQL & MariaDB<br>Redis | `state.azure.cosmosdb`<br>`state.postgresql`<br>`state.mysql`<br>`state.redis` | 
| Publish & subscribe | Apache Kafka<br>Redis Streams | `pubsub.kafka`<br>`pubsub.redis` |
| Binding | Azure Event Grid<br>Azure Cosmos DB<br>Apache Kafka<br>PostgreSQL<br>Redis<br>Cron | `bindings.azure.eventgrid`<br>`bindings.azure.cosmosdb`<br>`bindings.kafka`<br>`bindings.postgresql`<br>`bindings.redis`<br>`bindings.cron` |
| Configuration | PostgreSQL<br>Redis | `configuration.postgresql`<br>`configuration.redis` |