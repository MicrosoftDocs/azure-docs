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

The connector for REST/HTTP enables integration with RESTful endpoints by periodically performing GET requests to devices, sensors, or systems that expose REST APIs. The connector can register the data's schema with the Azure Device Registry service, and forward the data to destinations such as MQTT broker or the state store for further processing and observability.

The connector for REST/HTTP supports the following features:

- Automatic retries when sampling failures occur. Reports a failed status for errors that can't be retried.
- Integration with OpenTelemetry.
- Use of _device endpoints_ and _namespace assets_.
- Device endpoint and asset definition validation for REST compatibility.
- Multiple authentication methods:
  - Username/password basic HTTP authentication
  - x509 client certificates
  - Anonymous access for testing purposes
  - Certificate trust bundle to specify additional certificate authorities

For each configured dataset, the connector for REST/HTTP:

- Performs a GET request to the address specified in the device endpoint and appends the dataset's data source from the namespace asset.
- Generates a message schema for each dataset based on the data it receives, and registers it with Schema Registry and Azure Device Registry.
- Forwards the data to the specified destination.

## How does it relate to Azure IoT Operations?

The connector for REST/HTTP is part of Azure IoT Operations. The connector deploys to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations components, such as:

- [Assets and devices](./concept-assets-devices.md)
- [The MQTT broker](../connect-to-cloud/overview-dataflow.md)
- [Azure Device Registry](./overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry)

## Next step

> [!div class="nextstepaction"]
> [How to use the connector for REST/HTTP](howto-use-http-connector.md)
