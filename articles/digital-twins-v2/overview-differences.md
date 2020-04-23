---
# Mandatory fields.
title: Differences from Public Preview 1
titleSuffix: Azure Digital Twins
description: Understand what has changed since the previous release of Azure Digital Twins
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

# Differences to Azure Digital Twins from previous release (2018)

Azure Digital Twins Public Preview 1 was released in October of 2018. While the core concepts from that previous release are still the same, some of the interfaces and implementation details have changed with the newest release. These changes were motivated by customer feedback.

If you used Azure Digital Twins in the previous preview, use the information and best practices in this article to learn how to work with the newest version differently.

## Changes by topic

| Topic | In Public Preview 1 | In new release | Tips and best practices |
| --- | --- | --- | --- |
| **Models**<br>*More flexible* | Azure Digital Twins Preview 1 evolved from a solution designed for building management, and came with a built-in vocabulary for buildings. | the new Azure Digital Twins preview lets you define your own custom vocabulary and custom models for your solution; out of the box, Azure Digital Twins is now completely domain agnostic. | |
| **Twin graph**<br>*More flexible*| Azure Digital Twins Public Preview 1 supported a tree data structure to represent your ontology. Twins were connected with hierarchical relationships. | With the new release, digital twins you define can be connected into arbitrary graph topologies, giving you a generalized graph and much more flexibility to express the complex relationships that exist in real world environments. | Any node can have a relationship with any other node. You may choose to create additional relationships between nodes not directly linked in topology as a technique to make your queries shallow and performant. Learn more about creating graphs [here](concepts-twins-graph.md). |
| **Querying**<br>*More standard* | Azure Digital Twins Public Preview 1 supports graph traversal in breadth and depth and then querying an object to get its properties. | With the new release, you can build a SQL-style query and use a single API to get twins representing physical or logical devices and across relationships. | You can construct queries using logic operators like AND, OR, NOT for any combination of getting twins by their properties, relationships, interfaces. Scalar functions are supported as well, opening up an entire query language. Learn more about constructing queries for your graph [here](concepts-query-language.md). |
| **Deployment**<br>*From portal to CI/CD automation* | With Azure Digital Twins Public Preview 1, the Azure portal was the primary way to deploy Azure Digital Twins. | While the Azure portal will continue to be supported in the new release, you can now also use the [CLI extension package](how-to-use-cli.md) for Azure Digital Twins to deploy Azure Digital Twins, connect to end points and set up routes. | CLI is the recommended management tool for this release. As you get ready to take your deployment into production, you can generate a script as a .yml file to automate the flow for repeatability and integrate with Azure Pipelines, or an alternate CI/CD pipeline of your choice. |
| **Device management**<br>*More accessible* | With Azure Digital Twins Public Preview 1, an instance of IoT Hub was internal to the Azure Digital Twins service, so telemetry was ingested from devices into Azure Digital Twins. As the IoT Hub was integrated into Azure Digital Twins, it was not fully accessible to developers. | With the new release, you bring your own IoT hub. you can attach the service to your own IoT Hub instance and devices you may already be managing. This change puts you in full control of all device management, and gives you full access to IoT Hub's capabilities. | A new design pattern is recommended as best practice. This pattern leverages Azure Functions, so you can create a relationship between a logical twin in Azure Digital Twins and a device twin representing a physical device managed I IoT Hub. You can then use Azure Digital Twins APIs to update properties in the logical twin based on a change in property of the device twin. Follow the how-to article [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md) to try out this pattern. |
| **Routing events and messages**<br>*More integrated* | With Azure Digital Twins Public Preview 1, you could configure Event Hub, Event Grid, or Service Bus as endpoints and route events. | the new release offers scenario parity. To implement, you can choose to call directly into the routing APIs via SDK if implementing an app, or use the Azure CLI to integrate routing as part of deployment. | It is recommended that you use a filter to limit a certain event type to flow to your end point. See [Manage endpoints and routes](how-to-manage-routes.md) for details. |
| **Event processing custom logic**<br>*More flexible* | Azure Digital Twins Public Preview 1 had a compute system that relied on user-defined JavaScript functions. UDFs in JS were the recommended way to define custom logic to direct events to end points, or process incoming telemetry. | With the new release,  this system has been replaced with a new compute system that relies on external, customer-provided processing, such as Azure Functions. This affords a lot of flexibility and enables developers to
    - use a programming language of their choice.
    - access custom code libraries without restriction.
    - have access to a robust development and debugging story with supported serverless compute platforms such as Azure Functions.
    - take advantage of a flexible event processing and routing system throughout the platform. Azure Functions-based compute can be used to direct events within the graph as well as between Azure Digital Twins and other services (IoT Hub, or end points like Event Grid, Event Hub, Service Bus). | the recommended mechanism is to use Azure Functions for external compute to process events and telemetry messages. You may call from one Azure Function to other Azure Functions to do predictive analysis via an AI model. |
| **RBAC**<br>*More standard* | With Azure Digital Twins Public Preview 1, you could use one of several pre-defined roles to manage access. | the new release integrates with the same Azure RBAC backend service in Azure Digital Twins as for all Azure services, several of which you may be using in your deployment, e.g. Azure Fcn, Event Grid, Event Hub, Service Hub, IoT Hub and more. | You can build your own customized roles or use a pre-defined role, and configure scope it applies to,e.g. ability to upload models, or run queries. For details on RBAC, see [Secure Azure Digital Twins solutions](concepts-security.md). |
| **Scale**<br>*Greater* | | The new version of Azure Digital Twins is designed to run at greater scale, with more compute power for handling large numbers of messages and API requests. See <limits section> | |

## Next steps

Learn about the key elements Azure Digital Twins in the current release:
* [Create a twin model](concepts-models.md)
* [Create digital twins and the twin graph](concepts-twins-graph.md)
* [Azure Digital Twins query language](concepts-query-language.md)