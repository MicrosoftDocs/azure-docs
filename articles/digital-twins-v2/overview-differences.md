---
# Mandatory fields.
title: Differences from Public Preview 1
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

# Differences from previous preview release (2018)

Azure Digital Twins Public Preview 1 was released in October of 2018. The new version of Azure Digital Twins (now currently in preview) marks a significant departure from the previous architecture. While the core concepts are still the same, the developer interfaces and APIs are different, and the service provides improved capabilities and flexibility. The changes were motivated by customer feedback. 

## Overview of changes

The main changes in the newest preview release are:
* **Flexible representation of twin types (models) and topology.** Azure Digital Twins Preview 1 evolved from a solution designed for building management, and came with a built-in vocabulary for buildings. Digital twins could be connected using hierarchical relationships, effectively creating a tree topology.
 
    Customers expressed great interest in applying the Azure Digital Twins design pattern to a much broader set of business solutions. In response, the new Azure Digital Twins preview lets you define your own custom vocabulary and custom models for your solution; out of the box, Azure Digital Twins is now completely domain agnostic. In addition, the individual digital twins you define can be connected into arbitrary graph topologies, giving you much more flexibility to express the complex relationships that exist in real world environments.
* **Flexible compute and event processing system.** Azure Digital Twins Public Preview 1 had a compute system that relied on user-defined JavaScript functions. Based on customer feedback, this system has been replaced with a new compute system that relies on external, customer-provided processing, such as Azure Functions. The enables developers to:
    - use a programming language of their choice.
    - access custom code libraries without restriction.
    - have access to a robust development and debugging story with supported serverless compute platforms such as Azure Functions.
    - take advantage of a flexible event processing and routing system throughout the platform. 
* **Full access to IoT Hub.** In Azure Digital Twins Public Preview 1, IoT Hub was integrated into Azure Digital Twins, and not fully accessible to developers. In the new version of Azure Digital Twins, you bring your own IoT hub. This change puts you in full control of all device management, and gives you full access to IoT Hub's capabilities.
* **Greater scale.** The new version of Azure Digital Twins is designed to run at greater scale, with more compute power for handling large numbers of messages and API requests.

## Next steps

Learn about the key elements of Azure Digital Twins in the current release:
* [Create a twin model](concepts-models.md)
* [Create digital twins and the twin graph](concepts-twins-graph.md)
* [Azure Digital Twins query language](concepts-query-language.md)

Or, go ahead and dive into working with Azure Digital Twins in the quickstart:

> [!div class="nextstepaction"]
> [Quickstart: Create and configure Azure Digital Twins](quickstart.md)
