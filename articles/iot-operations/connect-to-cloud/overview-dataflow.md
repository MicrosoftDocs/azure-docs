---
title: What are dataflows
description: What are dataflows in Azure IoT Operations?
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/02/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# What are dataflows?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Dataflows allow you to connect various data sources and perform data operations. It simplifies the setup of data paths to move, transform, and customize data.

The dataflow component is part of Azure IoT Operations deployed as an Arc-extension. The configuration for a dataflow is done via Kubernetes custom resource definitions. The configuration specifies the routes for sources where messages are ingested, sinks where messages are drained, and optionally transformation configuration for the data processing stage. Based on the configuration, the dataflow operator creates the dataflow instances in active-active configuration and configures them for specific routes.