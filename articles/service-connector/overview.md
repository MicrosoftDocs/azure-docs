---
title: What is Service Connector?
description: Better understand what typical use case scenarios to use Service Connector, and learn the key benefits of Service Connector.
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: overview
ms.date: 10/29/2021
ms.custom: ignite-fall-2021
---

# What is Service Connector?

The Service Connector service helps you connect Azure compute service to other backing services easily. This service configures the network settings and connection information (for example, generating environment variables) between compute service and target backing service in management plane. Developers just use preferred SDK or library that consumes the connection information to do data plane operations against target backing service.

This article provides an overview of Service Connector service.

## What is Service Connector used for?

Any application that runs on Azure compute services and requires a backing service, can use Service Connector. We list some examples that can use Service Connector to simplify service-to-service connection experience.

* **WebApp + DB:** Use Service Connector to connect PostgreSQL, MySQL, or Cosmos DB to your App Service.  
* **WebApp + Storage:** Use Service Connector to connect to Azure Storage Accounts and use your preferred storage products easily in your App Service.
* **Spring Cloud + Database:** Use Service Connector to connect PostgreSQL, MySQL, SQL DB or Cosmos DB to your Spring Cloud application.
* **Spring Cloud + Apache Kafka:** Service Connector can help you connect your Spring Cloud application to Apache Kafka on Confluent Cloud.

See [What services are supported in Service Connector](#what-services-are-supported-in-service-connector) to see more supported services and application patterns.

## What are the benefits using Service Connector?

**Connect to target backing service with just single command or a few clicks:**

Service Connector is designed for your ease of use. It asks three required parameters including target service instance, authentication type between compute service and target service and your application client type to create a connection. Developers can use Azure Connection CLI or guided Azure portal experience to create connections easily.

**Use Connection Status to monitor or identify connection issue:**

Once a service connection is created. Developers can validate and check connection health status. Service Connector can suggest actions to fix broken connections.

## What services are supported in Service Connector?

> [!NOTE]
> Service Connector is in Public Preview. The product team is actively adding more supported service types in the list.

**Compute Service:**

* Azure App Service
* Azure Spring Cloud

**Target Service:**

* Azure App Configuration
* Azure Cache for Redis (Basic, Standard and Premium and Enterprise tiers)
* Azure Cosmos DB (Core, MangoDB, Gremlin, Cassandra, Table)
* Azure Database for MySQL
* Azure Database for PostgreSQL
* Azure Event Hubs
* Azure Key Vault
* Azure Service Bus
* Azure SignalR Service
* Azure Storage (Blob, Queue, File and Table storage)
* Apache Kafka on Confluent Cloud

## How to use Service Connector?

There are two major ways to use Service Connector for your Azure application:

* **Azure Connection CLI:** Create, list, validate and delete service-to-service connections with connection command group in Azure CLI.
* **Service Connector experience on Azure portal:** Use guided portal experience to create service-to-service connections and manage connections with a hierarchy list.

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Quickstart: Service Connector in App Service using Azure CLI](./quickstart-cli-app-service-connection.md)

> [!div class="nextstepaction"]
> [Quickstart: Service Connector in App Service using Azure portal](./quickstart-portal-app-service-connection.md)

> [!div class="nextstepaction"]
> [Quickstart: Service Connector in Spring Cloud Service using Azure CLI](./quickstart-cli-spring-cloud-connection.md)

> [!div class="nextstepaction"]
> [Quickstart: Service Connector in Spring Cloud using Azure portal](./quickstart-portal-spring-cloud-connection.md)

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
