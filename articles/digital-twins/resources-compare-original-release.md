---
# Mandatory fields.
title: Differences from original release
titleSuffix: Azure Digital Twins
description: Understand what has changed in the new version of Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/28/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# What is the new Azure Digital Twins? How is it different from the original version (2018)?

The first public preview of Azure Digital Twins was released in October of 2018. While the core concepts from that original version have carried through to the current service, many of the interfaces and implementation details have changed to make the service more flexible and accessible. These changes were motivated by customer feedback.

> [!IMPORTANT]
> In light of the new service's expanded capabilities, the original Azure Digital Twins service has been retired. As of January 2021, its APIs and associated data are no longer available.

If you used the first version of Azure Digital Twins during the first public preview, use the information and best practices in this article to learn how to work with the current service, and take advantage of its features.

## Differences by topic

The chart below provides a side-by-side view of concepts that have changed between the original version of the service and the current service.

| Topic | In original version | In current version |
| --- | --- | --- | --- |
| **Modeling**<br>*More flexible* | The original release was designed around smart spaces, so it came with a built-in vocabulary for buildings. | The current Azure Digital Twins is domain-agnostic. You can define your own custom vocabulary and custom models for your solution, to represent more kinds of environments in more flexible ways.<br><br>Learn more in [*Concepts: Custom models*](concepts-models.md). |
| **Topology**<br>*More flexible*| The original release supported a tree data structure, tailored to smart spaces. Digital twins were connected with hierarchical relationships. | With the current release, your digital twins can be connected into arbitrary graph topologies, organized however you want. This gives you more flexibility to express the complex relationships of the real world.<br><br>Learn more in [*Concepts: Digital twins and the twin graph*](concepts-twins-graph.md). |
| **Compute**<br>*Richer, more flexible* | In the original release, logic for processing events and telemetry was defined in JavaScript user-defined functions (UDFs). Debugging with UDFs was limited. | The current release has an open compute model: you provide custom logic by attaching external compute resources like [Azure Functions](../azure-functions/functions-overview.md). This lets you use a programming language of your choice, access custom code libraries without restriction, and take advantage of development and debugging resources that the external service may have.<br><br>Learn more in [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md). |
| **Device management with IoT Hub**<br>*More accessible* | The original release managed devices with an instance of [IoT Hub](../iot-hub/about-iot-hub.md) that was internal to the Azure Digital Twins service. This integrated hub was not fully accessible to developers. | In the current release, you "bring your own" IoT hub, by attaching an independently-created IoT Hub instance (along with any devices it already manages). This gives you full access to IoT Hub's capabilities and puts you in control of device management.<br><br>Learn more in [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md). |
| **Security**<br>*More standard* | The original release had pre-defined roles that you could use to manage access to your instance. | The current release integrates with the same [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) back-end service that other Azure services use. This may make it simpler to authenticate between other Azure services in your solution, like IoT Hub, Azure Functions, Event Grid, and more.<br>With RBAC, you can still use pre-defined roles, or you can build and configure custom roles.<br><br>Learn more in [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md). |
| **Scalability**<br>*Greater* | The original release had scale limitations for devices, messages, graphs, and scale units. Only one instance of Azure Digital Twins was supported per subscription.  | The current release relies on a new architecture with improved scalability, and has greater compute power. It also supports 10 instances per region, per subscription.<br><br>See [*Azure Digital Twins service limits*](reference-service-limits.md) for details of the limits in the current release. |

## Service limits

For a list of Azure Digital Twins limits, see [*Azure Digital Twins service limits*](reference-service-limits.md).

## Next steps

* Dive into working with the current release in the quickstart: [*Quickstart: Explore a sample scenario*](quickstart-adt-explorer.md).

* Or, start reading about key concepts with [*Concepts: Custom models*](concepts-models.md).