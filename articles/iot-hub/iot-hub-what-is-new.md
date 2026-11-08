---
title: What's New in Azure IoT Hub?
titleSuffix: Azure IoT Hub
description: This article explains the new features and improvements in Azure IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 11/07/2026
ms.custom: references_regions
ai-usage: ai-assisted

#customer intent: As a developer new to IoT Hub, I want to understand the new features and improvements in Azure IoT Hub so that I can evaluate their benefits for my IoT projects.

---

# What's new in Azure IoT Hub?

Azure IoT Hub updates help you manage existing fleets, deliver contextualized
telemetry to downstream applications, and investigate operational problems.
Availability is specific to each feature; a generally available feature doesn't
make every connection profile or related preview feature generally available.

## Generally available capabilities

### Link new or existing Standard hubs to Azure Device Registry

Azure Device Registry (ADR) linking is generally available for Standard IoT hubs.
You can enable ADR integration on an eligible existing Standard hub rather than
recreating the hub. ADR namespaces provide a common management foundation for
connected services and devices.

Linking an existing hub to ADR doesn't convert it to the MQTT v5 connection
profile. Review eligibility, permissions and the permanent-link warning before
starting. See [Enable ADR integration](iot-hub-device-registry-setup.md).

### Manage operational X.509 certificates

Certificate management through IoT Hub is generally available for Standard hubs,
except hubs with the MQTT v5 connection profile. It manages operational
certificates used for hub connections, not the onboarding credential used to
authenticate to Device Provisioning Service (DPS).

Devices using the MQTT v5 connection profile can still obtain and renew
ADR-issued operational certificates through DPS. Management directly through
the MQTT v5 hub isn't supported. Existing MQTT v5 DPS flows are unchanged.

See [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md).

### Route telemetry to Microsoft Fabric eventstreams

The Microsoft Fabric Real-Time Intelligence Eventstream routing endpoint is
generally available. Route IoT Hub messages into an eventstream for downstream
processing and analytics, using Microsoft Entra ID authentication.

The endpoint's availability is separate from preview message-schema and
payload-format capabilities. See
[Microsoft Fabric Eventstreams as a routing endpoint](iot-hub-devguide-endpoints.md#microsoft-fabric-eventstreams-as-a-routing-endpoint).

### Use TLS 1.3

TLS 1.3 support is generally available. TLS support and device application
protocol support are different: adding TLS 1.3 doesn't enable MQTT v5 on a
classic-profile hub or change its authentication requirements.

TLS 1.2 remains supported. Review client compatibility and endpoint requirements
in [TLS support](iot-hub-tls-support.md).

## Preview capabilities

### Azure IoT Hub with the MQTT v5 connection profile

Create a new hub with the MQTT v5 connection profile to evaluate MQTT v5 device
messaging and customer-defined publish topics. This profile has its own supported
SDKs, authentication requirements, routing behavior and capability boundaries.

See the [MQTT v5 overview](mqtt-v5-overview.md) and
[supported capabilities](mqtt-v5-capabilities.md).

### Message schema and message payload formats

Associate telemetry with schema context and select the message payload format
used by a routing endpoint. These preview capabilities help downstream consumers
interpret telemetry consistently.

A schema reference, a device type reference, and an endpoint's output format
serve different purposes. A schema reference doesn't automatically validate,
transform, or make arbitrary data ready for an agent.

See [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md).

## Operational guidance

- [Plan increased device-identity capacity](iot-hub-devguide-quotas-throttling.md#plan-device-identity-capacity-and-request-an-increase),
  including support requests for fleets above five million.
- [Interpret routing and throttling metrics](monitor-iot-hub-reference.md#investigate-routing-and-throttling-together).
- [Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md), using the
  tools available in your installed version and permissions.

## Supported regions

Check the current region and resource eligibility requirements for each feature.
For ADR linking, use the requirements in
[Get started with Azure Device Registry](../iot/device-registry/get-started-azure-device-registry.md#prerequisites).
Don't apply an ADR or MQTT v5 region list to every IoT Hub capability.

## Get started with ADR and certificate management

Choose a new or existing eligible Standard hub, review the linking prerequisites,
and follow [Enable ADR integration](iot-hub-device-registry-setup.md).
Certificate management is optional and requires its own DPS and certificate
configuration; linking a hub doesn't automatically replace device credentials.

Review [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/)
and the pricing of ADR, DPS and your routing destinations. Don't assume that an
earlier preview pricing offer applies to a generally available capability.

## Related content

- [FAQ: What's new in Azure IoT Hub?](iot-hub-faq.md)
- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)
