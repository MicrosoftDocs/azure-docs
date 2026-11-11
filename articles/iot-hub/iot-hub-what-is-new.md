---
title: What's New in Azure IoT Hub?
titleSuffix: Azure IoT Hub
description: Explore Azure IoT Hub updates for device management, MQTT v5 messaging, telemetry integration, and troubleshooting.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 11/10/2026
ms.custom: references_regions
ai-usage: ai-assisted

#customer intent: As a developer new to IoT Hub, I want to understand the new features and improvements in Azure IoT Hub so that I can evaluate their benefits for my IoT projects.

---

# What's new in Azure IoT Hub?

Explore the latest Azure IoT Hub capabilities for managing device fleets,
connecting telemetry to analytics and agents, and troubleshooting your solution.
The following sections highlight generally available features, preview
capabilities, and new operational guidance.

## Generally available capabilities

### Link new or existing Standard hubs to Azure Device Registry

Azure Device Registry (ADR) linking is now generally available for Standard IoT
hubs. You can link a new Standard hub to an ADR namespace during setup or
connect an eligible existing Standard hub without recreating it. ADR provides
a common management foundation for devices across linked services.
Group devices from multiple hubs in a shared namespace and manage their Azure
Resource Manager representations using Azure role-based access control.
Learn how to [enable ADR integration](../iot/device-registry/get-started-azure-device-registry.md).

### Manage operational X.509 certificates

Certificate management through IoT Hub is now generally available for Standard
hubs, except hubs using the MQTT v5 connection profile. Use Azure Device Registry
to issue and manage operational X.509 certificates for device connections.
Capabilities include certificate issuance, renewal, and revocation, with
certificate policies to control validity periods and managed certificate
authorities to establish trust.
Learn about [certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md).

### Route telemetry to Microsoft Fabric eventstreams

The Microsoft Fabric Real-Time Intelligence eventstream routing endpoint is now
generally available. Route device telemetry directly into a Fabric eventstream
to connect your IoT solution with real-time processing and analytics.
The endpoint supports managed-identity authentication through Microsoft Entra ID
and delivers telemetry with device identity and event context in a CloudEvents
representation.
Learn how to [route telemetry to Microsoft Fabric](iot-hub-devguide-endpoints.md#microsoft-fabric-eventstreams-as-a-routing-endpoint).

### Use TLS 1.3

TLS 1.3 support is now generally available, giving compatible clients a newer
transport security option for connecting to IoT Hub. TLS 1.2 remains supported.
Compatible clients can negotiate TLS 1.3 to encrypt data in transit and
authenticate the IoT Hub server during connection establishment.
Learn about [TLS support and client requirements](iot-hub-tls-support.md).

## Preview capabilities

### Azure IoT Hub with the MQTT v5 connection profile

The MQTT v5 connection profile is available in preview. Create a new hub to
evaluate MQTT v5 device messaging and customer-defined publish topics for your
IoT applications.
Supported capabilities include device twins, direct methods, and telemetry
routing based on custom topics and MQTT v5 user properties. Build device
applications with the unified Azure IoT SDKs for .NET and C.
See the [MQTT v5 overview](mqtt-v5-overview.md) and
[supported capabilities](mqtt-v5-capabilities.md).

### Message schema and message payload formats

Message schema and message payload formats are available in preview. Associate
telemetry with a schema reference and choose the payload format used by a routing
endpoint to help downstream applications interpret device data consistently.
These capabilities provide context and structure for analytics and agent
workflows.
Schema references describe the original payload contract. Endpoint format
options let you preserve the device payload or wrap it in a standardized
observation format.
See [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md).

## Plan and troubleshoot your deployment

Updated guidance helps you scale your fleet and investigate issues across your
IoT solution:

- **Plan larger fleets.** Review device-identity capacity and deployment
  requirements for fleets of up to five million devices in
  [capacity planning guidance](iot-hub-devguide-quotas-throttling.md#plan-device-identity-capacity-and-request-an-increase).
- **Monitor message delivery.** Use
  [routing and throttling metrics](monitor-iot-hub-reference.md#investigate-routing-and-throttling-together)
  to investigate ingress throttling, delivery outcomes, and latency.
- **Investigate with Azure MCP Server.** Combine IoT Hub, monitoring, and
  destination tools to gather evidence for
  [end-to-end troubleshooting](iot-hub-troubleshoot-mcp.md).

## Supported regions

To use IoT Hub with Azure Device Registry and certificate management, deploy instances of IoT Hub, Azure Device Registry, and Device Provisioning Service in one of the following supported regions. The Azure Device Registry preview capabilities for IoT Hub-connected devices&mdash;groups, jobs, and software updates&mdash;are also available in these regions:

| Azure region |
| --- |
| Australia East |
| Central US |
| East US |
| Japan East |
| UK South |
| West Europe |
| West US |
| West US 3 |

> [!NOTE]
> IoT Hub MQTT5 (preview) is available with Azure Device Registry only in Australia East, Central US, Japan East, UK South, and West US.

For regional availability of Azure Device Registry with IoT Hub and Azure IoT Operations, see [Azure Device Registry regional availability](../iot/device-registry/overview-device-registry.md#regional-availability).

## Get started

To start using ADR with a new or existing Standard hub, follow
[Enable ADR integration](../iot/device-registry/get-started-azure-device-registry.md). To evaluate MQTT v5,
start with the [MQTT v5 getting-started guide](mqtt-v5-get-started.md).

Review [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/)
along with pricing for the other Azure services used by your solution.

## Related content

- [FAQ: What's new in Azure IoT Hub?](iot-hub-faq.md)
- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Get started with Azure Device Registry for Azure IoT Hub](../iot/device-registry/get-started-azure-device-registry.md)
