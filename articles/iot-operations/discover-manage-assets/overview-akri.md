---
title: Learn about Akri (preview)
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

# What are Akri services (preview)

The Microsoft Akri framework lets you do the following in Azure IoT Operations:

- **Connect**: The Azure IoT Operations Akri connectors let you make southbound connections to a wide variety of assets and devices in Azure IoT Operations, ingest telemetry from them, and use command and control. The connectors send data to the MQTT broker, which uses data flows for northbound connectivity to cloud services.
- **Discover**: The Akri services include discovery handlers that let you find devices and assets on your network. For example, the OPC UA connector includes a discovery handler that finds OPC UA servers on your local subnet.
- **Monitor**: The Akri connectors and discovery handlers use the Akri diagnostics service to consolidate and send observability data to the OTEL service.

The following diagram shows the architecture of the Akri services in Azure IoT Operations.

<!-- Art Library Source# ConceptArt-0-000-92 -->
:::image type="content" source="media/overview-akri/akri-architecture.svg" alt-text="Diagram that shows the Akri services in Azure IoT Operations." lightbox="media/overview-akri/akri-architecture.png" border="false":::

## Connectors

Akri services include connectors that let you connect to different devices and assets. Microsoft provides these connectors:

- **Connector for OPC UA**: Connects to OPC UA servers, ingests telemetry data, and lets you use command and control scenarios.
- **Media connector**: Connects to media devices and ingests stream data like video and image snapshots.
- **Connector for ONVIF**: Connects to ONVIF-compliant cameras, ingests event data like motion detection alerts, and lets you use command and control scenarios like pan-tilt-zoom control.
- **Connector for REST/HTTP**: Connects to REST/HTTP endpoints and ingests telemetry data.

## Discovery handlers

Akri services include discovery handlers that let you find devices and assets on your network. For example, the OPC UA connector has a discovery handler that finds OPC UA servers on your local subnet.

## Akri operator

The Akri operator manages the lifecycle of Akri connectors and discovery handlers. It lets you deploy connectors and discovery handlers dynamically when the cluster finds certain types of devices and allocates the corresponding namespace assets to the inbound connector.

## Akri diagnostics service

The Akri diagnostics service collects and sends observability data from Akri connectors and discovery handlers to the OTEL service. You can monitor the health and performance of your Akri services with cloud-based monitoring solutions like Azure Monitor.

## Akri Azure Device Registry service

The Akri Azure Device Registry service works with connectors and discovery handlers so they can interact with device and namespace asset custom resources in the Azure IoT Operations environment. For example, the Akri Azure Device Registry service lets the connector for ONVIF onboard discovered media sources as namespace assets in the Azure Device Registry.

## Akri SDKs

Akri SDKs (preview) let you build custom connectors and discovery handlers that integrate with Akri services. The SDKs offer a framework that makes it easier to develop connectors. To learn more, see [Overview of the Azure IoT Operations SDKs (preview)](../develop-edge-apps/overview-iot-operations-sdks.md).

## Open-source Akri

Akri services are a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source Cloud Native Computing Foundation (CNCF) project.

Akri services build on the capabilities of the open-source Akri project and give you additional features and support for enterprise scenarios.
