---
title: Connect industrial assets using the connector for OPC UA
description: Use the connector for OPC UA to connect to OPC UA servers and exchange telemetry with a Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: overview
ms.date: 10/22/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand what the connector for OPC UA is and how it works with OPC UA industrial assets to enable me to add them as resources to my Kubernetes cluster.
ms.service: azure-iot-operations
---

# What is the connector for OPC UA?

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to enable the exchange of data between industrial components at the edge and with the cloud. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

The connector for OPC UA is a part of Azure IoT Operations. The connector for OPC UA connects to OPC UA servers to retrieve data that it publishes to topics in the MQTT broker. The connector for OPC UA enables your industrial OPC UA environment to ingress data into your local workloads running on a Kubernetes cluster, and into your cloud workloads.

The connector for OPC UA is a client application that runs as a middleware service in Azure IoT Operations. The connector for OPC UA connects to OPC UA servers, lets you browse the server address space, and monitor data changes and events in connected assets. Operations teams and developers use the connector for OPC UA to streamline the task of connecting OPC UA assets to their industrial solution at the edge.

## Capabilities

As part of Azure IoT Operations, the connector for OPC UA is a native Kubernetes application that:

- Connects existing OPC UA servers and assets to a native Kubernetes cluster at the edge.
- Publishes JSON-encoded telemetry data from OPC UA servers in OPC UA PubSub format, using a JSON payload. By using this standard format for data exchange, you can reduce the risk of future compatibility issues.
- Connects to Azure Arc-enabled services in the cloud.

### Other features

The connector for OPC UA supports the following features as part of Azure IoT Operations:

- Simultaneous connections to multiple OPC UA servers configured by using Kubernetes `AssetEndpointProfile` custom resources (CRs).
- Publish OPC UA data value changes in OPC UA PubSub format with JSON encoding.
- Publish message headers as user properties in the MQTT message. The headers in the messages published by the connector for OPC UA are based on the [CloudEvents specification for OPC UA](https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/opcua.md).
- Publish OPC UA events with predefined event fields.
- Asset definition by using Kubernetes Asset CRs
- Payload compression including `gzip` and `brotli`.
- Automatic reconnection to OPC UA servers.
- Integrated [OpenTelemetry](https://opentelemetry.io/) compatible observability.
- OPC UA transport encryption.
- Anonymous authentication and authorization based on username and password.
- `AssetEndpointProfile` and `Asset` CRs configurable by using Azure REST API and the operations experience web UI.

## How it works

The two main components of the connector for OPC UA are the application and the discovery handler.

The connector for OPC UA application:

- Creates a session to the OPC UA server for each asset that you define.
- All the tags of the asset are configured with the same publishing interval. This interval determines how frequently the connector publishes data to an MQTT broker topic.
- Creates a separate subscription in the session for each 1,000 tags.
- Creates a separate subscription for each event defined in the asset.
- Implements retry logic to establish connections to endpoints that don't respond after a specified number of keep-alive requests. For example, there could be a nonresponsive endpoint in your environment when an OPC UA server stops responding because of a power outage.
