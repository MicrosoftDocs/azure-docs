---
title: Provide correct parameters to Service Connector
description: Learn how to pass correct parameters to Service Connector. 
author: houk-ms
ms.service: service-connector
ms.topic: how-to
ms.date: 09/11/2023
ms.author: honc
---
# Provide correct parameters to Service Connector

If you're using a CLI tool to manage connections, it's crucial to understand how to pass correct parameters to Service Connector. In this guide, you gain insights into the fundamental properties and their proper value formats.

## Prerequisites

- This guide assumes that you already know the [basic concepts of Service Connector](concept-service-connector-internals.md).

## Source service

Source services are usually Azure compute services. Service Connector is an [Azure extension resource](../azure-resource-manager/management/extension-resource-types.md). When sending requests using REST tools, to create a connection, for example, the request URL should use the format `{source_resource_id}/providers/Microsoft.ServiceLinker/linkers/{linkerName}`, and `{source_resource_id}` should match with one of the resource IDs listed in the table below.

| Source service type    | Resource ID format                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Azure App Service      | `/subscriptions/{subscription}/resourceGroups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`                                                |
| Azure App Service slot | `/subscriptions/{subscription}/resourceGroups/{source_resource_group}/providers/Microsoft.Web/sites/{site}/slots/{slot}`                                   |
| Azure Functions        | `/subscriptions/{subscription}/resourceGroups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`                                                |
| Azure Spring Apps      | `/subscriptions/{subscription}/resourceGroups/{source_resource_group}/providers/Microsoft.AppPlatform/Spring/{spring}/apps/{app}/deployments/{deployment}` |
| Azure Container Apps   | `/subscriptions/{subscription}/resourceGroups/{source_resource_group}/providers/Microsoft.App/containerApps/{app}`                                         |

## Target service

Target services are backing services or dependency services that your compute services connect to. When passing target resource info to Service Connector, the resource IDs aren't always top-level resources, and could also be subresources. Check the following table for the exact formats of all Service Connector supported target services.

| Target service type                | Resource ID format                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azure App Configuration            | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.AppConfiguration/configurationStores/{config_store}`                              |
| Azure Cache for Redis              | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Cache/redis/{server}/databases/{database}`                                        |
| Azure Cache for Redis (Enterprise) | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Cache/redisEnterprise/{server}/databases/{database}`                              |
| Azure Cosmos DB (NoSQL)            | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DocumentDB/databaseAccounts/{account}/sqlDatabases/{database}`                    |
| Azure Cosmos DB (MongoDB)          | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DocumentDB/databaseAccounts/{account}/mongodbDatabases/{database}`                |
| Azure Cosmos DB (Gremlin)          | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DocumentDB/databaseAccounts/{account}/gremlinDatabases/{database}/graphs/{graph}` |
| Azure Cosmos DB (Cassandra)        | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DocumentDB/databaseAccounts/{account}/cassandraKeyspaces/{key_space}`             |
| Azure Cosmos DB (Table)            | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DocumentDB/databaseAccounts/{account}/tables/{table}`                             |
| Azure Database for MySQL           | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DBforMySQL/flexibleServers/{server}/databases/{database}`                         |
| Azure Database for PostgreSQL      | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.DBforPostgreSQL/flexibleServers/{server}/databases/{database}`                    |
| Azure Event Hubs                   | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.EventHub/namespaces/{namespace}`                                                  |
| Azure Key Vault                    | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.KeyVault/vaults/{vault}`                                                          |
| Azure Service Bus                  | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.ServiceBus/namespaces/{namespace}`                                                |
| Azure SQL Database                 | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Sql/servers/{server}/databases/{database}`                                        |
| Azure SignalR Service              | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.SignalRService/SignalR/{signalr}`                                                 |
| Azure Storage (Blob)               | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/blobServices/default`                           |
| Azure Storage (Queue)              | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/queueServices/default`                          |
| Azure Storage (File)               | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/fileServices/default`                           |
| Azure Storage (Table)              | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/tableServices/default`                          |
| Azure Web PubSub                   | `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.SignalRService/WebPubSub/{webpubsub}`                                             |

## Authentication type

The authentication type refers to the authentication method used by the connection. The following authentication types are supported:

* system managed identity
* user managed identity
* service principal
* secret/connection string/access key

A different subset of the authentication types can be used when specifying a different target service and a different client type, check [how to integrate with target services](./how-to-integrate-postgres.md) for their combinations.

## Client type

Client type refers to your compute service's runtime stack or development framework. The client type often affects the connection string format of a database. The possible client types are:

* `dapr`
* `django`
* `dotnet`
* `go`
* `java`
* `kafka-springBoot`
* `nodejs`
* `none`
* `php`
* `python`
* `ruby`
* `springBoot`

A different subset of the client types can be used when specifying a different target service and a different authentication type, check [how to integrate with target services](./how-to-integrate-postgres.md) for their combinations.

## Next steps

> [!div class="nextstepaction"]
> [How to integrate target services](./how-to-integrate-postgres.md)
