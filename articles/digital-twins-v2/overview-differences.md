---
# Mandatory fields.
title: Differences from previous version
titleSuffix: Azure Digital Twins
description: Understand what has changed in the new version of Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: overview
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# How is the new Azure Digital Twins different from the previous version (2018)?

The first public preview of Azure Digital Twins was released in October of 2018. While the core concepts from that previous version have carried through to the new service in public preview now, many of the interfaces and implementation details have changed to make the service more flexible and accessible. These changes were motivated by customer feedback.

> [!IMPORTANT]
> In light of the new service's expanded capabilities, the previous Azure Digital Twins service is now deprecated, and will be decommissioned by the end of 2020.

If you used the first version of Azure Digital Twins during the previous public preview, use the information and best practices in this article to learn how to work with the new service, and take advantage of its features.

## Differences by topic

The chart below provides a side-by-side view of concepts that have changed between the previous version of the service and the new (current) service.

| Topic | In previous version | In new version | Tips and best practices |
| --- | --- | --- | --- |
| **Models**<br>*More flexible* | The previous version was mainly designed for building management, so it came with a built-in vocabulary for buildings. Models were expected to align with building concepts. Also, blobs were supported to attach unstructured data to a space. | The new Azure Digital Twins is domain-agnostic. You can define your own custom vocabulary and custom models for your solution. Also, blobs are not directly supported. | Take advantage of the new representation options that an open vocabulary enables for your environment. The possibility to represent processes, concepts, and arbitrary objects may suggest reimagining your digital representation.<br>Learn more in [Concepts: Twin models](concepts-models.md).<br>To include unstructured content with a model, you can manage a separate blob store, and provide a link to the relevant document as a property on your model. |
| **The twin graph**<br>*More flexible*| The previous version supported a tree data structure to represent your environment. Digital twins were connected with hierarchical relationships. | With the new version, your digital twins can be connected into arbitrary graph topologies, organized however you want. | This gives you more flexibility to express the complex relationships of the real world. Any twin can have a relationship with any other twin. You can even create relationships between twins not directly linked in your main topology, as a technique to make your queries shallow and performant.<br>Learn more in [Concepts: Digital twins and the twin graph](concepts-twins-graph.md). |
| **Queries**<br>*More standard* | The previous version supported breadth and depth graph traversal, and querying an object to get its properties. | The new version uses SQL-style queries, and has a single API to get twins by their models, properties, or relationships. | Like in SQL, your queries can use any combination of logic operators like `AND`, `OR`, `NOT` to help you find exactly what you need. Scalar functions are supported as well, opening up an entire query language.<br>Learn more in [Concepts: Azure Digital Twins query language](concepts-query-language.md). |
| **Deployment tool**<br>*More structured and repeatable* | In the previous version, the Azure portal was the primary way to deploy Azure Digital Twins. | While the Azure portal is still an option, Azure Digital Twins now has a custom set of CLI commands you can use to deploy Azure Digital Twins, and manage related creations like endpoints and routes. | CLI is the recommended management tool for this release.<br>As you prepare to take a deployment into production, you can generate a script as a .yml file to automate the flow for repeatability. This can also be integrated with [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines), or an alternate CI/CD pipeline of your choice.<br>Learn more in [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md). |
| **Device management**<br>*More accessible* | The previous version managed devices with an instance of [IoT Hub](../iot-hub/about-iot-hub.md) that was internal to the Azure Digital Twins service. This integrated hub was not fully accessible to developers. | In the new version, you "bring your own" IoT hub, by attaching an independently-created IoT Hub instance (along with any devices it already manages). This change gives you full access to IoT Hub's capabilities and puts you fully in control of device management. | Twins in the new version are focused on the device level; it's no longer recommended to use separate digital twins to represent the individual sensors on a device. There's also a new recommended design pattern for ingesting device data, which uses Azure Functions to communicate between a device representation in IoT Hub and its logical twin in Azure Digital Twins. The Azure function uses Azure Digital Twins APIs to update properties in the logical twin whenever properties change in the IoT Hub representation.<br>Learn more about this pattern in [How-to: Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md). |
| **Routing events and messages**<br>*More integrated* | In the previous version, you could configure [Event Hub](../event-hubs/event-hubs-about.md), [Event Grid](../event-grid/overview.md), or [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) as endpoints and route events to them. | In the new version, you can use the Azure CLI to integrate routing as part of deployment, or call directly into the routing APIs via SDK while implementing an app. | You can use filters to restrict what types of events flow to your endpoints.<br>Learn more in [How-to: Manage endpoints and routes](how-to-manage-routes.md). |
| **Event processing custom logic**<br>*More flexible* | In the previous version, you wrote JavaScript functions (user-defined functions, or **UDFs**) to define custom logic for processing events and telemetry. | With the new version, you provide custom logic by attaching external compute resources like [Azure Functions](../azure-functions/functions-overview.md) instead. This lets you use a programming language of your choice, access custom code libraries without restriction, and take advantage of development and debugging resources that the external service may have. | Azure Functions is the recommended external compute service for processing events and telemetry. You can use functions to direct events within the graph, as well as out to other Azure services (like IoT Hub, or endpoints like Event Grid, Event Hub, Service Bus).<br>Learn more in [How-to: Set up an Azure Function](how-to-create-azure-function.md).<br>Another use for this is calling from one Azure Function to other Azure Functions,to do predictive analysis via an AI model. |
| **Security**<br>*More standard* | The previous version had several pre-defined roles that you could use to manage access to your instance. | The new version integrates with the same Azure [role-based access control (RBAC)](../role-based-access-control/overview.md) back-end service that other Azure services use. This may make it simpler to authenticate between other Azure services in your solution, like IoT Hub, Azure Functions, Event Grid, and more. | You can still use pre-defined roles, or you can build your own custom roles. You can also configure which actions a role applies to (such as ability to upload models or ability to run queries).<br>Learn more in [Concepts: Securing Azure Digital Twins solutions](concepts-security.md). |
| **Data privacy**<br>*Scalable* | In the previous version, only one instance of Azure Digital Twins was supported per subscription. As a result, the way to achieve data privacy was to create multiple tenants within your Azure Digital Twins instance. | The new version supports 10 instances per region, per subscription. See [Reference: Public preview service limits](reference-service-limits.md) for details of this limit and others. | To achieve data separation, the recommended best practice is to create a separate Azure Digital Twins instance for each region or sub-region. |
| **Scale**<br>*Greater* | | The new version is designed to run at greater scale, with more compute power for handling large numbers of messages and API requests. | See [Reference: Public preview service limits](reference-service-limits.md) for details of the limits in public preview now. |

## Service limits in public preview

For a list of Azure Digital Twins limits during this public preview, see [Reference: Public preview service limits](reference-service-limits.md).

## Next steps

Next, dive into working with Azure Digital Twins with the first tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Code a client app](tutorial-code.md)