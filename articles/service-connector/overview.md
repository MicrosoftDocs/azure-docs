---
title: What is Service Connector?
description: Understand typical use case scenarios for Service Connector, and learn the key benefits of Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom:
  - build-2024
ms.topic: overview
ms.date: 10/15/2024
---

# What is Service Connector?

Service Connector helps you connect Azure compute services to other backing services. Service Connector configures the network settings and connection information (for example, generating environment variables) between compute services and target backing services in management plane. Developers use their preferred SDK or library that consumes the connection information to do data plane operations against the target backing service.

This article provides an overview of Service Connector.

## What is Service Connector used for?

Any application that runs on Azure compute services and requires a backing service, can use Service Connector. Find below some examples that can use Service Connector to simplify service-to-service connection experience.

* **Database:** Use Service Connector to connect databases, such as PostgreSQL, MySQL, or Azure Cosmos DB, to your apps.
* **Storage:** Use Service Connector to use your preferred storage products, such as Azure Storage for any of your apps.
* **Messaging Service:** Use Service Connector to connect your cloud apps to messaging services, such as Service Bus, Event Hubs, and Apache Kafka on Confluent Cloud.

See [what services are supported in Service Connector](#what-services-are-supported-by-service-connector) to see more supported services and application patterns.

## What are the benefits to using Service Connector?

**Connect to a target backing service with just a single command or a few clicks:**

Service Connector is designed for your ease of use. To create a connection, you need three required parameters: a target service instance, an authentication type between the compute service and the target service, and your application client type. Developers can use the Azure CLI or the guided Azure portal experience to create connections.

**Use Connection Status to monitor or identify connection issue:**

Once a service connection is created, developers can validate and check the health status of their connections. Service Connector can suggest some actions to take to fix broken connections.

## What services are supported by Service Connector?

Compute services:

* Azure App Service
* Azure Functions
* Azure Spring Apps
* Azure Container Apps
* Azure Kubernetes Service (AKS)

Target services:

* Azure AI services
* Azure App Configuration
* Azure Cache for Redis (Basic, Standard and Premium and Enterprise tiers)
* Azure Cosmos DB (NoSQL, MongoDB, Gremlin, Cassandra, Table)
* Azure Database for MySQL
* Azure Database for PostgreSQL
* Azure Event Hubs
* Azure Key Vault
* Azure Service Bus
* Azure SQL Database
* Azure SignalR Service
* Azure Storage (Blob, Queue, File and Table storage)
* Azure Web PubSub
* Apache Kafka on Confluent Cloud

## How to use Service Connector?

There are two major ways to use Service Connector for your Azure application:

* **Azure CLI:** Create, list, validate and delete service-to-service connections with connection commands in the Azure CLI.
* **Azure portal:** Use the guided portal experience to create service-to-service connections and manage connections with a hierarchy list.

What's more, Service Connector is also supported in the following client tools with its most fundamental features:

* **Azure Powershell:** manage connections with commands in Azure PowerShell.
* **Terraform:** create and delete connections with infrastructure as code tool (be aware of the [limitations](known-limitations.md)).
* **Visual Studio:** manage connections of a project by integrating with [Connected Services](/visualstudio/azure/overview-connected-services) feature in Visual Studio.
* **IntelliJ:** list connections of Azure compute services in [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/install-toolkit).

Finally, you can also use Azure SDKs and API calls to interact with Service Connector. And you're recommended to read [how to provide correct parameters](how-to-provide-correct-parameters.md) before starting if using these ways.

## Related content

- [Quickstart: Service Connector in Azure App Service](./quickstart-portal-app-service-connection.md)
- [Quickstart: Service Connector in Azure Functions](./quickstart-portal-functions-connection.md)
- [Quickstart: Service Connector in Azure Spring Cloud](./quickstart-portal-spring-cloud-connection.md)
- [Quickstart: Service Connector in Azure Container Apps](./quickstart-portal-container-apps.md)
- [Learn about Service Connector concepts](./concept-service-connector-internals.md)
