---
title: Service providers and built-in connectors for Standard logic apps
description: Learn about service providers for creating built-in connectors for Standard workflows in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 03/15/2022
# As a developer, I want background information about service providers so I can create my own built-in operations.
---

# Built-in connectors in single-tenant Azure Logic Apps

In Azure Logic Apps, connectors provide triggers and actions, which are operations that you use in logic app workflows to quickly access data, events, and actions across other apps, services, systems, protocols, and platforms. These operations expand the capabilities in your cloud apps and on-premises apps to work with new and existing data. Connectors are powered by the connector infrastructure that runs in Azure.

Connectors are either built-in or managed. Built-in connectors run natively on the Azure Logic Apps runtime, which means they're hosted in the same process as the runtime and provide higher throughput, low latency, and local connectivity. Managed connectors are deployed, hosted, and managed by Microsoft. When you use a connector operation for the first time in a workflow, some connectors don't require that you create a connection first, but many other connectors require this step. The connection is actually a separate Azure resource that provides access to the target app, service, system, protocol, or platform.

In single-tenant Azure Logic Apps, Standard logic app workflows are powered by a redesigned runtime. This runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and provides a key capability for you to create and use your own built-in connectors. In a Standard logic app, a connection definition file contains the required configuration information for the connections created by these built-in connectors. When single-tenant Azure Logic Apps officially released, new built-in connectors included Azure Blob Storage, Azure Event Hubs, Azure Service Bus, and SQL Server, and this list continues to grow. However, if you need connectors that aren't available, you can create your own built-in connectors with the same Azure Functions extensibility framework used by the included built-in connectors.

This article shows how you can use the Azure Functions extensibility framework to create a built-in connector using Cosmos DB as an example. This example connector provides a trigger and no actions. In this example, when a new document is added to the lease collection or container in Cosmos DB, the trigger fires and runs a workflow that uses the input payload as the Cosmos document. This built-in connector uses the Azure Functions extensibility functionality for the Cosmos DB trigger, based on the Azure Functions trigger binding. Generally, you can add any Azure Functions trigger or action to your own built-in connector. Currently, trigger capabilities are limited to only Azure Functions triggers.

For more information about connectors, review the following documentation:

* [About connectors in Azure Logic Apps](../connectors/apis-list.md)