---
# Mandatory fields.
title: Migrate from Public Preview 1
titleSuffix: Azure Digital Twins
description: Understand migration process and best practices from the previous version of Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/16/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Migrate from the previous version of Azure Digital Twins

Azure Digital Twins Public Preview 1 was released in October of 2018. While many of the major concepts from the previous release are still present in the newest release, some of the implementation details have changed.

If you have an Azure Digital Twins instance that was created during the previous preview, and you want to migrate it to the new release, follow the best practices in this article.

## Best practices by topic

| Topic | How handled in Public Preview 1 | New release |
| --- | --- | --- |
| Creating a **graph** | Azure Digital Twins Public Preview 1 supported a tree data structure to represent your ontology. | With the new release you can build a generalized graph, i.e. you are not limited to a tree structure. Any node can have a relationship with any other node. You may choose to create additional relationships between nodes not directly linked in topology as a technique to make your queries shallow and performant. Learn more about creating graphs [here](concepts-twins-graph.md). |
| **Querying** | Azure Digital Twins Public Preview 1 supports graph traversal in breadth and depth and then querying an object to get its properties. | With the new release, you can build a SQL-style query and use a single API to get twins representing physical or logical devices and across relationships. You can construct queries using logic operators like AND, OR, NOT for any combination of getting twins by their properties, relationships, interfaces. Scalar functions are supported as well, opening up an entire query language. Learn more about constructing queries for your graph [here](concepts-query-language.md). |
| **Deployment**: from Portal to CI/CD Automation | With Azure Digital Twins Public Preview 1, the Azure portal was the primary way to deploy Azure Digital Twins. | While the Azure portal will continue to be supported in the new release, it is recommended that you use the [CLI extension package](how-to-use-cli.md) for Azure Digital Twins to deploy Azure Digital Twins, connect to end points and set up routes. As you get ready to take your deployment into production, you can generate a script as a .yml file to automate the flow for repeatability and integrate with Azure Pipelines, or an alternate CI/CD pipeline of your choice. |
| Ingesting **telemetry from devices** | With Azure Digital Twins Public Preview 1, an instance of IoT Hub was internal to the Azure Digital Twins service, so telemetry was ingested from devices into Azure Digital Twins. | With the new release, you can attach the service to your own IoT Hub instance and devices you may already be managing. A new design pattern is recommended as best practice. This pattern leverages Azure Functions, so you can create a relationship between a logical twin in Azure Digital Twins and a device twin representing a physical device managed I IoT Hub. You can then use Azure Digital Twins APIs to update properties in the logical twin based on a change in property of the device twin. Follow the how-to article [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md) to try out this pattern. |
| **Routing** events and messages to endpoints | With Azure Digital Twins Public Preview 1, you could configure EH, EG or SB as end points and route events. | the new release offers scenario parity. To implement, you can choose to call directly into the routing APIs via SDK if implementing an app or use the Azure CLI to integrate routing as part of deployment. It is recommended that you use a filter to limit a certain event type to flow to your end point. See [Manage endpoints and routes](how-to-manage-routes.md) for details. |
| **Event processing custom logic** | With Azure Digital Twins Public Preview 1, UDFs in JS were the recommended way to define custom logic to direct events to end points, or process incoming telemetry. | With the new release, the recommended mechanism is to use Azure Functions for external compute to process events and telemetry messages. This affords a lot of flexibility as you may call from one Azure Function to other Azure Functions to do predictive analysis via an AI model. Azure Functions-based compute can be used to direct events within the graph as well as between Azure Digital Twins and other services (IoT Hub, or end points like Event Grid, Event Hub, Service Bus). |
| **RBAC** | With Azure Digital Twins Public Preview 1, you could use one of several pre-defined roles to manage access. | the new release integrates with the same Azure RBAC backend service in Azure Digital Twins as for all Azure services, several of which you may be using in your deployment, e.g. Azure Fcn, Event Grid, Event Hub, Service Hub, IoT Hub and more. You can build your own customized roles or use a pre-defined role, and configure scope it applies to,e.g. ability to upload models, or run queries. For details on RBAC, see [Secure Azure Digital Twins solutions](concepts-security.md). |

## Next steps

Learn more about the key elements Azure Digital Twins in the current release:
* [Create a twin model](concepts-models.md)
* [Create digital twins and the twin graph](concepts-twins-graph.md)
* [Azure Digital Twins query language](concepts-query-language.md)