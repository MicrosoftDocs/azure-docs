---
title: Connect industrial assets using Azure IoT OPC UA Broker
description: Use the Azure IoT OPC UA Broker to connect to OPC UA servers and exchange telemetry with a Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: opcua-broker
ms.topic: overview
ms.date: 05/14/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand what Azure IoT OPC UA Broker is and how it works with OPC UA industrial assets to enable me to add them as resources to my Kubernetes cluster.
---

# What is Azure IoT OPC UA Broker Preview?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to enable the exchange of data between industrial components at the edge and with the cloud. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

Azure IoT OPC UA Broker Preview is a part of Azure IoT Operations Preview. OPC UA Broker connects to OPC UA servers to retrieve data that it publishes to topics in the Azure IoT MQ service. OPC UA Broker enables your industrial OPC UA environment to ingress data into your local workloads running on a Kubernetes cluster, and into your cloud workloads.

OPC UA Broker is a client application that runs as a middleware service in Azure IoT Operations. OPC UA Broker connects to OPC UA servers, lets you browse the server address space, and monitor data changes and events in connected assets. Operations teams and developers use the broker to streamline the task of connecting OPC UA assets to their industrial solution at the edge.

## Capabilities

As part of Azure IoT Operations, OPC UA Broker is a native Kubernetes application that:

- Connects existing OPC UA servers and assets to a native Kubernetes cluster at the edge.
- Publishes JSON-encoded telemetry data from OPC UA servers in OPC UA PubSub format, using a JSON payload. By using this standard format for data exchange, you can reduce the risk of future compatibility issues.
- Connects to Azure Arc-enabled services in the cloud.

OPC UA Broker includes an OPC UA simulation server that you can use to test your applications. To learn more, see [Configure an OPC PLC simulator to work with Azure IoT OPC UA Broker Preview](howto-configure-opc-plc-simulator.md).

### Other features

OPC UA Broker supports the following features as part of Azure IoT Operations:

- Simultaneous connections to multiple OPC UA servers configured by using Kubernetes `AssetEndpointProfile` custom resources (CRs).
- Publish OPC UA data value changes in OPC UA PubSub format with JSON encoding.
- Publish OPC UA events with predefined event fields.
- Asset definition by using Kubernetes Asset CRs
- Payload compression including `gzip` and `brotli`.
- Automatic reconnection to OPC UA servers.
- Integrated [OpenTelemetry](https://opentelemetry.io/) compatible observability.
- OPC UA transport encryption.
- Anonymous authentication and authentication based on username and password.
- `AssetEndpointProfile` and `Asset` CRs configurable by using Azure REST API and Azure IoT Operations (preview) portal.
- Akri-supported asset detection of OPC UA assets. The assets must be [OPC UA Companion Specifications](https://opcfoundation.org/about/opc-technologies/opc-ua/ua-companion-specifications/) compliant.

## How it works

The two main components of OPC UA Broker are the application and the discovery handler.

The OPC UA Broker application:

- Creates a session to the OPC UA server for each asset that you define.
- All the tags of the asset are configured with the same publishing interval. This interval determines how frequently the broker publishes data to an Azure IoT MQ topic.
- Creates a separate subscription in the session for each 1,000 tags.
- Creates a separate subscription for each event defined in the asset.
- Implements retry logic to establish connections to endpoints that don't respond after a specified number of keep-alive requests. For example, there could be a nonresponsive endpoint in your environment when an OPC UA server stops responding because of a power outage.

The OPC UA discovery handler:

- Uses the Akri configuration to connect to an OPC UA server. After the connection is made, the discovery handler inspects the OPC UA address space, and tries to detect assets that  comply with the [OPC UA Companion Specifications](https://opcfoundation.org/about/opc-technologies/opc-ua/ua-companion-specifications/).
- Creates `Asset` and `AssetEndpointProfile` CRs in the cluster.

> [!NOTE]
> Asset detection by Akri only works for OPC UA servers that don't require user or transport authentication.

To learn more about Akri, see [What is Azure IoT Akri Preview?](overview-akri.md).
