---
title: Connect industrial assets using Azure IoT OPC UA Broker
description: Use the Azure IoT OPC UA Broker to connect to OPC UA servers and exchange telemetry with a Kubernetes cluster.
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: concept-article
ms.date: 03/01/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand what Azure IoT OPC UA Broker
# is and how it works with OPC UA industrial assets to enables me to add them as resources to my Kubernetes cluster.
---

# Connect industrial assets using Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to exchange data between industrial components and the cloud. Industrial components can include physical devices such as sensors, actuators, controllers, and machines. Industrial components can also include logical elements such as processes, events, software-defined assets, and entire systems. The OPC UA standard enables industrial components that use it to communicate securely and exchange data at the edge, and in the cloud. Because industrial components use a wide variety of protocols for communication and data exchange, it can be complex and costly to develop an integrated solution. The OPC UA standard is a widely used solution to this issue. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

Azure IoT OPC UA Broker Preview enables you to connect to OPC UA servers, and to publish telemetry data from connected industrial components. In Azure IoT Operations Preview, OPC UA Broker is the service that enables your industrial OPC UA environment to ingress data into your local workloads running on a cluster, and into your cloud workloads. This article overviews what OPC UA Broker is and how it works with your industrial assets at the edge.

## What is OPC UA Broker
OPC UA Broker is a client application that runs as a middleware service in Azure IoT Operations. OPC UA Broker connects to an OPC UA server, lets you browse the server address space, and monitor data changes and events in connected assets. The main benefit of OPC UA Broker is that it simplifies the process to connect to local OPC UA server systems.

By using OPC UA Broker, operations teams and developers can streamline the task of connecting OPC UA assets to their industrial solution at the edge. As part of Azure IoT Operations, OPC UA Broker is shipped as a native K8s application that shows how to do the following tasks:
- Connect existing OPC UA servers and assets to a native Kubernetes K8s cluster at the edge
- Publish JSON-encoded telemetry data from OPC UA servers in OPC UA PubSub format, using a JSON payload
- Connect to Azure Arc-enabled services in the cloud

The following diagram illustrates the OPC UA architecture:
:::image type="content" source="media/overview-opcua-broker/opcua-broker-basic-architecture.png" alt-text="Diagram of basic OPC UA architecture." border="false":::


## OPC UA Broker features
OPC UA Broker supports the following features as part of the Azure IoT Operations:

- Simultaneous connections to multiple OPC UA servers configured via Kubernetes AssetEndpointProfile CRs
- Publishing of OPC UA data value changes in OPC UA PubSub format in JSON encoding
- Publishing of OPC UA events with predefined event fields
- Asset definition via Kubernetes Asset CRs
- Support of payload compression (gzip, brotli)
- Automatic reconnection to OPC UA servers
- Integrated OpenTelemetry compatible observability
- Support for OPC UA transport encryption
- Anonymous authentication and authentication based on username and password
- AssetEndpointProfiles and Assets configurable via Azure REST API and Azure IoT Operations (preview) portal
- Akri-supported asset detection of OPC UA assets (assets must be OPC UA Companion Specification compliant)
- Secure by design

## What OPC UA Broker does
OPC UA Broker performs several essential functions for your edge solution and industrial assets. The following sections summarize what OPC UA Broker does in the application itself, and in the OPC UA Discovery Handler.

### The application
OPC UA Broker implements retry logic to establish connections to endpoints that don't respond after a specified number of keep-alive requests. For example, your environment could experience a nonresponsive endpoint when an OPC UA server stops responding because of a power outage.

For every asset, OPC UA Broker creates a separate session to the OPC UA server. All datapoints of the Asset are configured with the same PublishingInterval. For every 1,000 data points, a separate subscription is created in the session. For all events of an asset, there's one separate subscription created.

### The OPC UA Discovery handler
OPC UA Discovery Handler, which is shipped along with OPC UA Broker, uses the Akri configuration to connect to an OPC UA server. After the connection is made, the discovery handler inspects the OPC UA address space, and tries to detect assets that are compliant with the OPC UA Device Information companion specification. After the detection, the `Asset` CRs and the corresponding `AssetEndpointProfile` CRs are created in the cluster.
Note: Asset detection via Akri only works for OPC UA servers, which don't require user or transport authentication.
After successful CR creation, the publishing process of telemetry starts.

OPC UA Broker enables the following use cases that are common in industrial edge environments.

- **Run as a container-based application**. OPC UA Broker is shipped as a component of Azure IoT Operations, which runs as a container-based application on a Kubernetes cluster.
- **Convert OPC UA data to JSON**. OPC UA Broker uses OPC UA PubSub-compliant JSON data encoding to maximize interoperability. By using OPC UA PubSub format for data exchange, you can reduce the risk of future sustainability issues that occur when you use custom JSON encoding.
- **Provide OPC UA data sources for testing**. OPC UA Broker comes with an OPC UA simulation server to speed up the process of development applications that require OPC UA data.

## Next step
In this article, you learned what Azure IoT Operations OPC UA Broker is and how it enables you to add OPC UA servers and assets to your Kubernetes cluster. As a next step, learn how to use the Azure IoT Operations (preview) portal with OPC UA Broker, to manage asset configurations remotely.

> [!div class="nextstepaction"]
> [Manage asset configurations remotely](howto-manage-assets-remotely.md)
