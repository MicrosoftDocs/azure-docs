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
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# How is the new Azure Digital Twins different from the previous version (2018)?

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

The first public preview of Azure Digital Twins was released in October of 2018. While the core concepts from that previous version have carried through to the new service in public preview now, many of the interfaces and implementation details have changed to make the service more flexible and accessible. These changes were motivated by customer feedback.

> [!IMPORTANT]
> In light of the new service's expanded capabilities, the previous Azure Digital Twins service will be retired by the end of year 2020.

If you used the first version of Azure Digital Twins during the previous public preview, use the information and best practices in this article to learn how to work with the new service, and take advantage of its features.

## Differences by topic

The chart below provides a side-by-side view of concepts that have changed between the previous version of the service and the new (current) service.

| Topic | In previous version | In new version |
| --- | --- | --- | --- |
| **Modeling**<br>*More flexible* | The previous release was designed around smart spaces, so it came with a built-in vocabulary for buildings. | The new Azure Digital Twins is domain-agnostic. You can define your own custom vocabulary and custom models for your solution, to represent more kinds of environments in more flexible ways.<br><br>Learn more in [Concepts: Custom models](concepts-models.md). |
| **Topology**<br>*More flexible*| The previous release supported a tree data structure, tailored to smart spaces. Digital twins were connected with hierarchical relationships. | With the new release, your digital twins can be connected into arbitrary graph topologies, organized however you want. This gives you more flexibility to express the complex relationships of the real world.<br><br>Learn more in [Concepts: Digital twins and the twin graph](concepts-twins-graph.md). |
| **Compute**<br>*Richer, more flexible* | In the previous release, logic for processing events and telemetry was defined in JavaScript user-defined functions (UDFs). Debugging with UDFs was limited. | The new release has an open compute model: you provide custom logic by attaching external compute resources like [Azure Functions](../azure-functions/functions-overview.md). This lets you use a programming language of your choice, access custom code libraries without restriction, and take advantage of development and debugging resources that the external service may have.<br><br>Learn more in [How-to: Set up an Azure function for processing data](how-to-create-azure-function.md). |
| **Device management with IoT Hub**<br>*More accessible* | The previous release managed devices with an instance of [IoT Hub](../iot-hub/about-iot-hub.md) that was internal to the Azure Digital Twins service. This integrated hub was not fully accessible to developers. | In the new release, you "bring your own" IoT hub, by attaching an independently-created IoT Hub instance (along with any devices it already manages). This gives you full access to IoT Hub's capabilities and puts you in control of device management.<br><br>Learn more in [How-to: Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md). |
| **Security**<br>*More standard* | The previous release had pre-defined roles that you could use to manage access to your instance. | The new release integrates with the same Azure [role-based access control (RBAC)](../role-based-access-control/overview.md) back-end service that other Azure services use. This may make it simpler to authenticate between other Azure services in your solution, like IoT Hub, Azure Functions, Event Grid, and more.<br>With RBAC, you can still use pre-defined roles, or you can build and configure custom roles.<br><br>Learn more in [Concepts: Security for Azure Digital Twins solutions](concepts-security.md). |
| **Scalability**<br>*Greater* | The previous release had scale limitations for devices, messages, graphs, and scale units. Only one instance of Azure Digital Twins was supported per subscription.  | The new release relies on a new architecture with improved scalability, and has greater compute power. It also supports 10 instances per region, per subscription.<br><br>See [Reference: Public preview service limits](reference-service-limits.md) for details of the limits in public preview now. |

## Service limits in public preview

For a list of Azure Digital Twins limits during this public preview, see [Reference: Public preview service limits](reference-service-limits.md).

## Next steps

Next, dive into working with Azure Digital Twins with the first tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Code a client app](tutorial-code.md)