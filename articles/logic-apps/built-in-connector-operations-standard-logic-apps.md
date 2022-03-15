---
title: Create built-in connectors for Standard logic app workflows
description: Learn how to create built-in connectors for Standard workflows in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/15/2022
# As a developer, I want learn how to create my own built-in connector operations to use and run in my Standard logic app workflows.
---

# Create built-in connector operations for Standard logic app workflows in single-tenant Azure Logic Apps

In Azure Logic Apps, connectors provide triggers and actions, which are operations that you use in logic app workflows to quickly access data, events, and actions across other apps, services, systems, protocols, and platforms. These operations expand the capabilities in your cloud apps and on-premises apps to work with new and existing data. Connectors are powered by the connector infrastructure that runs in Azure.

Connectors are either built-in or managed. Built-in connectors run natively on the Azure Logic Apps runtime, which means they're hosted in the same process as the runtime and provide higher throughput, low latency, and local connectivity. Managed connectors are deployed, hosted, and managed by Microsoft. When you use a connector operation for the first time in a workflow, some connectors don't require that you create a connection first, but many other connectors require this step. The connection is actually a separate Azure resource that provides access to the target app, service, system, protocol, or platform.

In single-tenant Azure Logic Apps, Standard logic app workflows are powered by a redesigned runtime. This runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and provides a key capability for you to create and use your own built-in connectors. In a Standard logic app, a connection definition file contains the required configuration information for the connections created by these built-in connectors. When single-tenant Azure Logic Apps officially released, new built-in connectors included Azure Blob Storage, Azure Event Hubs, Azure Service Bus, and SQL Server, and this list continues to grow. However, if you need connectors that aren't available, you can create your own built-in connectors with the same Azure Functions extensibility framework used by the included built-in connectors.

This article shows how you can use the Azure Functions extensibility framework to create a built-in connector using Cosmos DB as an example. This example connector provides a trigger and no actions. In this example, when a new document is added to the lease collection or container in Cosmos DB, the trigger fires and runs a workflow that uses the input payload as the Cosmos document. This built-in connector uses the Azure Functions extensibility functionality for the Cosmos DB trigger, based on the Azure Functions trigger binding. Generally, you can add any Azure Functions trigger or action to your own built-in connector. Currently, trigger capabilities are limited to only Azure Functions triggers.

For more information about connectors, review the following documentation:

* [About connectors in Azure Logic Apps](../connectors/apis-list.md)

## Prerequisites


## Built-in connector plugin model

The Azure Logic Apps built-in connector extensibility model uses the Azure Functions extensibility model, which enables the capability to add built-in connector implementations, such as Azure Functions extensions. You can use this capability to create, build, and package your own built-in connectors as Azure Functions extensions that anyone can use.

In this built-in connector extensibility model, you have to implement the following operation parts:

* Operation descriptions

  Operation descriptions are metadata about the operations implemented by your custom built-in connector. The workflow designer primarily uses these descriptions to drive the authoring and monitoring experiences for your connector's operations. For example, the designer uses operation descriptions to understand the input parameters required by a specific operation and to facilitate generating the outputs' property tokens, based on the schema for the operation's outputs.

* Operation invocations

  At runtime, the Azure Logic Apps runtime uses these implementations to invoke the specified operation in the workflow definition.

After you finish your custom built-in connector extension, you also have to register the your custom built-in connector with the Azure Functions runtime extension, which is described later in this article.

## Service provider interface implementation

The webjob extension Nuget package which was added to the class library project provides the service provider interface IServiceOperationsTriggerProvider which needs to be implemented.

As part of operation description, the IServiceOperationsTriggerProvider interface provides methods GetService() and GetOperations() which are required to be implemented by the custom built-in connector. These operations are used by the logic app designer to describe the actions/triggers by the custom built-in connector on the logic app designer surface.  Please note that the GetService() method also specifies the connection parameters needed by the Logic app designer.

For action operation, you need to implement the InvokeActionOperation() method, which is invoked during the action execution. If you would like to use the Azure function binding for azure triggers, then you need to provide connection information and trigger bindings as needed by Azure function. There are two methods which need to be implemented for Azure function binding, GetBindingConnectionInformation() method which provides the connection information to the Azure function binding and GetTriggerType() which is same as “type” binding parameter for Azure function.

The picture below shows the implementation of methods as required by the Logic app designer and Logic app runtime.


## Example custom built-in connector

The following sample custom built-in Cosmos DB connector has only one trigger and no actions:

| Operation | Operation details | Description |
|-----------|-------------------|-------------|
| Trigger | Receive document | This trigger operation runs when an insert or update operation happens in the specified Cosmos DB database and collection. |
| Action | None | This connector doesn't define any action operations. |
|||

To develop your own built-in connector, you need to add the work flow webjob extension package. , I am creating the .NET Core 3.1 class library project in visual studio and added the Microsoft.Azure.Workflows.Webjobs.Extension package as Nuget reference to the project. The Service provider interface is implemented to provide the operations of the CosmosDB connector.  