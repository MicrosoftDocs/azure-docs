---
title: Connect HTTP sources using the connector for REST/HTTP (preview)
description: The connector for REST/HTTP (preview) in Azure IoT Operations makes HTTP from HTTP sources such as IP cameras available to other Azure IoT Operations components.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 11/12/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to understand what the connector for REST/HTTP is so that I can determine whether I can use it in my industrial IoT solution.
---

# What is the Azure IoT Operations connector for REST/HTTP (preview)?

This article introduces the connector for REST/HTTP (preview) in Azure IoT Operations. The connector for REST/HTTP calls REST endpoints to retrieve data to share with other Azure IoT Operations components. The connector for REST/HTTP is secure and performant.

## HTTP source types

The connector for REST/HTTP can connect to various sources.

<!-- TODO: Add details here when we have more information -->

## Example uses

Example uses of the connector for REST/HTTP include calling REST APIs to retrieve data from industrial devices such as cameras, sensors, and other devices that expose data over HTTP.

<!-- TODO: Add details here when we have more information -->

## How does it relate to Azure IoT Operations?

The connector for REST/HTTP is part of Azure IoT Operations. The connector deploys to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations components, such as:

- [Assets and devices](./concept-assets-devices.md)
- [The MQTT broker](../connect-to-cloud/overview-dataflow.md)
- [Azure Device Registry](./overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry)

## Next step

> [!div class="nextstepaction"]
> [How to use the connector for REST/HTTP](howto-use-http-connector.md)
