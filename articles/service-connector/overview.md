---
title: What is Service Connector?
description: Understand typical use case scenarios for Service Connector, and learn the key benefits of Service Connector.
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: overview
ms.date: 05/03/2022
---

# What is Service Connector?

The Service Connector service helps you connect Azure compute services to other backing services. This service configures the network settings and connection information (for example, generating environment variables) between compute services and target backing services in management plane. Developers use their preferred SDK or library that consumes the connection information to do data plane operations against the target backing service.

This article provides an overview of Service Connector.

## What is Service Connector used for?

Any application that runs on Azure compute services and requires a backing service, can use Service Connector. Find below some examples that can use Service Connector to simplify service-to-service connection experience.

* **WebApp + DB:** Use Service Connector to connect PostgreSQL, MySQL, or Cosmos DB to your App Service.  
* **WebApp + Storage:** Use Service Connector to connect to Azure Storage accounts and use your preferred storage products easily in your App Service.
* **Spring Cloud + Database:** Use Service Connector to connect PostgreSQL, MySQL, SQL DB or Cosmos DB to your Spring Cloud application.
* **Spring Cloud + Apache Kafka:** Service Connector can help you connect your Spring Cloud application to Apache Kafka on Confluent Cloud.

See [what services are supported in Service Connector](#what-services-are-supported-in-service-connector) to see more supported services and application patterns.

## What are the benefits using Service Connector?

**Connect to target backing service with just a single command or a few clicks:**

Service Connector is designed for your ease of use. To create a connection, you'll need three required parameters: a target service instance, an authentication type between the compute service and the target service, and your application client type. Developers can use the Azure CLI or the guided Azure portal experience to create connections.

**Use Connection Status to monitor or identify connection issue:**

Once a service connection is created, developers can validate and check the health status of their connections. Service Connector can suggest some actions to take to fix broken connections.

## What services are supported in Service Connector?

**Compute Services:**

* Azure App Service
* Azure Spring Cloud

**Target Services:**

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

* **Azure CLI:** Create, list, validate and delete service-to-service connections with connection commands in the Azure CLI.
* **Azure Portal:** Use the guided portal experience to create service-to-service connections and manage connections with a hierarchy list.

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> - [Quickstart: Service Connector in App Service using Azure CLI](./quickstart-cli-app-service-connection.md)
> - [Quickstart: Service Connector in App Service using Azure portal](./quickstart-portal-app-service-connection.md)
> - [Quickstart: Service Connector in Spring Cloud Service using Azure CLI](./quickstart-cli-spring-cloud-connection.md)
> - [Quickstart: Service Connector in Spring Cloud using Azure portal](./quickstart-portal-spring-cloud-connection.md)
> - [Learn about Service Connector concepts](./concept-service-connector-internals.md)
