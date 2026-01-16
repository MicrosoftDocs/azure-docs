---
title: Learn about Akri services
description: Understand how the Akri services enable you to dynamically configure and deploy Akri connectors to connect a broad variety of assets and devices to the Azure IoT Operations cluster, ingest telemetry from them, and use command and control.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-akri
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 09/08/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how the Akri services enable me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# What are Akri services

The Microsoft Akri framework lets you perform the following tasks in Azure IoT Operations:

- **Connect**: The Azure IoT Operations Akri connectors let you establish southbound connections to a wide variety of assets and devices in Azure IoT Operations, ingest telemetry from them, and use command and control. The connectors send data to the MQTT broker, which uses data flows for northbound connectivity to cloud services.
- **Discover**: The Akri services let you discover devices on your network for easy onboarding to Azure IoT Operations.
- **Monitor**: The Akri connectors use the Akri diagnostics service to collect and send observability data to the OTel service.

The following diagram shows the architecture of the Akri services in Azure IoT Operations.

<!-- Art Library Source# ConceptArt-0-000-92 -->
:::image type="content" source="media/overview-akri/akri-architecture.svg" alt-text="Diagram that shows the Akri services in Azure IoT Operations." lightbox="media/overview-akri/akri-architecture.png" border="false":::

The following steps explain how the Akri services work together to configure devices and assets, and connect them to your physical assets and devices:

1. An IT admin creates a connector template in the Azure portal with configurations for a connector like the media connector.
1. The connector template syncs to the edge. The Akri operator detects the new connector template.
1. An OT user creates a device and inbound endpoint in the operations experience portal. The Akri operator detects the device and inbound endpoint and deploys a matching connector instance. The Akri operator uses the configuration  details in the connector template to configure the connector instance to connect to the physical device or asset.
1. Data starts flowing from the physical device or asset through the connector instance to destinations set in the assets associated with the inbound endpoint.
1. If the OT user enables asset discovery on the device, the connector creates the necessary custom resources (CRs) for any discovered assets. For example, the connector for ONVIF discovers media profiles in an ONVIF-compliant camera and creates the necessary CRs for each profile. The OT user can then easily onboard the discovered assets through the operations experience portal.
1. The Akri operator handles any updates to configurations or secrets. The Akri operator also automatically deploys more connector instances to scale up as more devices are added.

## Connectors

Akri services enable the connectors that let you connect to different devices and assets. Microsoft provides these connectors:

- **Connector for OPC UA**: Connects to OPC UA servers, ingests telemetry data, and lets you use command-and-control scenarios.
- **Media connector**: Connects to media devices and ingests stream data like video and image snapshots.
- **Connector for ONVIF**: Connects to ONVIF-compliant cameras, ingests event data like motion detection alerts, and lets you use command and control scenarios like pan-tilt-zoom control.
- **Connector for HTTP/REST**: Connects to HTTP/REST endpoints and ingests telemetry data.
- **Connector for SSE**: Connects to SSE endpoints and ingests event data.

## Akri operator

The Akri operator manages the lifecycle of the Akri connector. It lets you deploy connectors dynamically when the cluster detects certain types of devices and allocates the corresponding assets to the inbound connector.

The Akri operator uses *connector templates* to deploy and configure connectors. The IT admin adds the connector templates to the Azure IoT Operations environment from the Azure portal. Templates define how to deploy and configure connectors. For example, the connector template for the media connector lets the IT admin specify how the connector syncs captured media streams to Azure Storage.

After the IT admin adds a connector template, such as the one for the media connector, the Akri operator watches for assets and devices in the cluster that match the criteria in the template. When it finds a match, it deploys and configures the connector dynamically. Dynamic configuration includes:

- An identity for the connector instance.
- Custom configurations, such as Azure Storage account details.
- Connection details for the MQTT broker.
- Connections for the OpenTelemetry (OTel) monitoring endpoint.
- Volume mounts for secrets.

The Akri operator also handles any updates the IT admin makes to secrets or connector configurations.

## Akri Azure Device Registry service

The Akri Azure Device Registry service works with connectors so they can interact with device and asset custom resources in the Azure IoT Operations environment. The Azure Device Registry Service:

- Enables secure access to assets and devices from other Azure IoT Operations components.
- Works with the connectors to support discovery of devices and assets.

For example, the Akri Azure Device Registry service helps an OT user to onboard media devices from the media profiles the connector for ONVIF discovers in an ONVIF compliant camera.

## Akri SDKs

Akri SDKs (preview) let you build custom connectors that integrate with Akri services. The SDKs provide a framework that simplifies connector development, so you can focus on the specific logic for your southbound connector. The SDKs manage all interactions with other Azure IoT Operations services for you.

To learn about the languages the SDKs support and the available libraries, see [Overview of the Azure IoT Operations SDKs (preview)](../develop-edge-apps/overview-iot-operations-development.md).

## Open-source Akri

Akri services are a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source project from the Cloud Native Computing Foundation (CNCF).

> [!NOTE]
> Currently, Akri services in Azure IoT Operations has an API that differs from the CNCF Akri project.

Akri services build on the capabilities of the open-source Akri project and provide additional features and support for enterprise scenarios.

## Next steps

- [Configure the connector for ONVIF](howto-use-onvif-connector.md)
- [Configure the media connector](howto-use-media-connector.md)
- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Configure the connector for HTTP/REST](howto-use-http-connector.md)
- [Configure the connector for SSE](howto-use-sse-connector.md)
- [Configure the connector for MQTT (preview)](howto-use-mqtt-connector.md)
