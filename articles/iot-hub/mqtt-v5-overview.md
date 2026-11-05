---
title: What is Azure IoT Hub with the MQTT v5 connection profile?
titleSuffix: Azure IoT Hub
description: Learn about Azure IoT Hub with the MQTT v5 connection profile for secure, standards-based device connectivity.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: overview
ms.date: 10/25/2026
---

# What is Azure IoT Hub with the MQTT v5 connection profile?

Azure IoT Hub with the MQTT v5 connection profile connects devices to cloud
applications by using the MQTT v5 protocol. Devices can publish messages to
customer-defined topics, and the hub routes their data to supported destinations,
including various Azure services and Microsoft Fabric. It supports
certificate-based authentication, integration with Azure Device Registry (ADR)
for device identity and management, state synchronization through device twins,
and request-response commands through direct methods. In this preview, device
applications use the unified Azure IoT SDKs for .NET and C.

Select the MQTT v5 connection profile when you create a new Azure IoT hub.
You can't enable it on an existing hub. For supported creation and configuration
options, see the [setup guide](mqtt-v5-cloud-setup.md).

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Preview capabilities,
> availability, limits, and behavior might change before general availability.

## When to use Azure IoT Hub with the MQTT v5 connection profile

Consider Azure IoT Hub with the MQTT v5 connection profile when your solution:

- Needs MQTT v5 messaging and protocol reason codes.
- Needs custom MQTT topic hierarchies organized around your devices, data, and business needs.
- Uses X.509 certificates for device authentication.
- Needs Azure IoT Hub routing and integration with downstream Azure services.
- Benefits from an integrated device identity, state, control, and monitoring experience.
- Is able to use preview capabilities and accommodate possible changes before general availability.

Use the [capability comparison](compare-iot-hub-connectivity.md) before choosing the profile. Some classic IoT Hub protocols and features aren't available in preview.

## Key capabilities

Azure IoT Hub with the MQTT v5 connection profile provides the following
capabilities:

- MQTT v5 device connectivity.
- X.509 certificate-based device connectivity authentication.
- Device onboarding through Azure IoT Hub Device Provisioning Service (DPS).
- Device publishing to customer-defined MQTT topics.
- MQTT v5 reason codes and message properties.
- Device-to-cloud telemetry.
- Message routing based on supported message attributes.
- Integration with Azure Device Registry (ADR) for device identity and management.
- Unified Azure IoT device SDK preview support for .NET and C.
- Supported device state and control operations, including device twins and
  direct methods.
- Azure Monitor metrics and diagnostic information for supported operations.

For the current availability of each IoT Hub capability, see
[Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).

## MQTT v5-only device connectivity

Devices connect to Azure IoT Hub with the MQTT v5 connection profile by using
MQTT v5. This configuration doesn't support MQTT v3.1.1, AMQP, or HTTPS as
device-connectivity protocols.

Devices connect to the hub by using X.509 certificates issued by Microsoft or
by a third-party certificate authority. Shared access signature (SAS) tokens,
symmetric device keys, and device connection strings aren't supported as hub
connectivity credentials.

Devices provision through Device Provisioning Service (DPS) using a symmetric key
or an existing X.509 certificate as their onboarding credential. When certificate
issuance is configured, DPS returns an ADR-issued operational X.509 certificate
for connecting to IoT Hub. Devices can also provision by using an existing X.509
certificate without requesting a new certificate.

Direct operational certificate renewal through the MQTT v5 hub isn't supported
in this preview.

Management applications can use the supported Azure management and service
interfaces. The protocols used by management applications don't change the
MQTT v5-only device-connectivity contract.

## Customer-defined topics

Customer-defined topics let a solution organize messages around its own
business and operational model. For example, connected vehicles can publish
observations and faults on separate topics identified by vehicle and message
category. Cloud applications consume those messages through routing destinations.

When you design a topic hierarchy, consider authorization boundaries,
publishing permissions, routing requirements, and expected scale. Topic names
should represent stable solution concepts rather than details of the service
implementation.

Custom-topic publishing is supported in preview; customer custom-topic
subscriptions aren't. See [Configure custom topic groups](mqtt-v5-custom-topics.md).

## Route telemetry to a destination

IoT hubs with the MQTT v5 connection profile don't provide a built-in routing
endpoint. To receive telemetry in a downstream service, configure a routing
endpoint for a supported destination and enable an all-messages route with
the routing query set to `true`.

Fallback routing is disabled for preview. The all-messages route is an
explicit route that selects all incoming telemetry from its selected source,
not a fallback route. Messages that don't match an enabled route aren't
delivered to your configured destinations.

Publishing telemetry to IoT Hub doesn't automatically deliver it to a
downstream destination. Verify delivery by reading the message at the
configured destination.

## Integrated device management

Azure Device Registry (ADR) provides the device identity and registry foundation,
while IoT Hub provides device state and control capabilities:

- **Device identity:** Manage device records through the integrated ADR experience.
- **Device twins:** Read reported device state and specify desired configuration
  that devices can apply.
- **Direct methods:** Invoke commands on connected devices and receive application
  responses.

Together, these capabilities help applications manage device identities,
synchronize configuration and state, and interact with devices alongside
telemetry ingestion.

## Develop with unified Azure IoT SDKs

In this preview, unified Azure IoT device SDKs support .NET and C. The
SDKs provide a shared device lifecycle model for DPS provisioning, IoT Hub
connectivity, telemetry, device twins, and direct methods.

Python, Java, and JavaScript Azure Device Registry management SDKs manage Azure
resources. They aren't unified device SDKs and don't provide the same
device-side lifecycle client.

## Next steps

- Review [Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).
- [Compare Azure IoT Hub connectivity options](compare-iot-hub-connectivity.md).
- Follow the [end-to-end setup journey](mqtt-v5-get-started.md).
- [Set up Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-cloud-setup.md).
- [Configure routing and destinations](mqtt-v5-route-messages.md).
- [Configure a device with the unified SDKs](mqtt-v5-device-setup.md).
- [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).
