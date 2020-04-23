---
# Mandatory fields.
title: Differences from previous release
titleSuffix: Azure Digital Twins
description: Understand what has changed in the new release of Azure Digital Twins
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

The first public preview of Azure Digital Twins was released in October of 2018. While the core concepts from that previous release are still the same in the current public preview, some of the interfaces and implementation details have changed with the new release. The new release also aims to be more flexible and accessible. These changes were motivated by customer feedback.

If you used Azure Digital Twins during the previous public preview, use the information and best practices in this article to learn how to work with the new version differently.

## Changes by topic

The chart below provides a side-by-side view of major concepts that have changed between the previous release and the new (current) release.

| Topic | In previous release | In new release | Tips and best practices |
| --- | --- | --- | --- |
| **Models**<br>*More flexible* | The previous release was mainly designed for building management, so it came with a built-in vocabulary for buildings. Models were expected to align with building concepts. | The new Azure Digital Twins is domain-agnostic. You can define your own custom vocabulary and custom models for your solution. | Take advantage of the new representation options this opens up for your environment. The possibility to represent processes, concepts, and arbitrary objects may suggest reimagining your digital representation.<br>Learn more in [Concepts: Twin models](concepts-models.md). |
| **The twin graph**<br>*More flexible*| The previous release supported a tree data structure to represent your environment. Digital twins were connected with hierarchical relationships. | With the new release, your digital twins can be connected into arbitrary graph topologies, organized however you want. | This gives you more flexibility to express the complex relationships of the real world. Any twin can have a relationship with any other twin. You can even create relationships between twins not directly linked in your main topology, as a technique to make your queries shallow and performant.<br>Learn more about creating graphs [here](concepts-twins-graph.md). |
| **Queries**<br>*More standard* | The previous release supported breadth and depth graph traversal, and querying an object to get its properties. | The new release uses SQL-style queries, and has a single API to get twins by their models, properties, or relationships. | Like in SQL, your queries can use any combination of logic operators like `AND`, `OR`, `NOT` to help you find exactly what you need. Scalar functions are supported as well, opening up an entire query language.<br>Learn more about the Azure Digital Twins query language [here](concepts-query-language.md). |
| **Deployment tool**<br>*More structured and repeatable* | In the previous release, the Azure portal was the primary way to deploy Azure Digital Twins. | While the Azure portal is still an option, Azure Digital Twins now has a custom set of CLI commands you can use to deploy Azure Digital Twins, and manage related creations like endpoints and routes. | CLI is the recommended management tool for this release.<br>As you prepare to take a deployment into production, you can generate a script as a .yml file to automate the flow for repeatability. This can also be integrated with [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines), or an alternate CI/CD pipeline of your choice.<br>Learn more about the Azure Digital Twins CLI [here](how-to-use-cli.md). |
| **Device management**<br>*More accessible* | The previous release managed devices with an instance of [IoT Hub](../iot-hub/about-iot-hub) that was internal to the Azure Digital Twins service. This integrated hub was not fully accessible to developers. | In the new release, you "bring your own" IoT hub, by attaching an independently-created IoT Hub instance (along with any devices it already manages). This change gives you full access to IoT Hub's capabilities and puts you fully in control of device management. | There's a new recommended design pattern, which uses Azure Functions to communicate between a device representation in IoT Hub and its logical twin in Azure Digital Twins. The Azure function uses Azure Digital Twins APIs to update properties in the logical twin whenever properties change in the IoT Hub representation. To try out this pattern, visit [How-to: Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md). |
| **Routing events and messages**<br>*More integrated* | With the previous release, you could configure Event Hub, Event Grid, or Service Bus as endpoints and route events. | the new release offers scenario parity. To implement, you can choose to call directly into the routing APIs via SDK if implementing an app, or use the Azure CLI to integrate routing as part of deployment. | It is recommended that you use a filter to limit a certain event type to flow to your end point. See [Manage endpoints and routes](how-to-manage-routes.md) for details. |

| **Event processing custom logic**<br>*More flexible* | The previous release had a compute system that relied on user-defined JavaScript functions. UDFs in JS were the recommended way to define custom logic to direct events to end points, or process incoming telemetry. | With the new release,  this system has been replaced with a new compute system that relies on external, customer-provided processing, such as Azure Functions. This affords a lot of flexibility and enables developers to
    - use a programming language of their choice.
    - access custom code libraries without restriction.
    - have access to a robust development and debugging story with supported serverless compute platforms such as Azure Functions.
    - take advantage of a flexible event processing and routing system throughout the platform. Azure Functions-based compute can be used to direct events within the graph as well as between Azure Digital Twins and other services (IoT Hub, or end points like Event Grid, Event Hub, Service Bus). | the recommended mechanism is to use Azure Functions for external compute to process events and telemetry messages. You may call from one Azure Function to other Azure Functions to do predictive analysis via an AI model. |

| **RBAC**<br>*More standard* | With the previous release, you could use one of several pre-defined roles to manage access. | the new release integrates with the same Azure RBAC backend service in Azure Digital Twins as for all Azure services, several of which you may be using in your deployment, e.g. Azure Fcn, Event Grid, Event Hub, Service Hub, IoT Hub and more. | You can build your own customized roles or use a pre-defined role, and configure scope it applies to,e.g. ability to upload models, or run queries. For details on RBAC, see [Secure Azure Digital Twins solutions](concepts-security.md). |

| **Scale**<br>*Greater* | | The new version of Azure Digital Twins is designed to run at greater scale, with more compute power for handling large numbers of messages and API requests. See <limits section> | |

## Next steps

Learn about the key elements Azure Digital Twins in the current release:
* [Create a twin model](concepts-models.md)
* [Create digital twins and the twin graph](concepts-twins-graph.md)
* [Azure Digital Twins query language](concepts-query-language.md)