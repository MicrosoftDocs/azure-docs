---
title: Create and connect to an Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Follow the cloud setup, routing, device setup, and monitoring journey for an Azure IoT hub with the MQTT v5 connection profile.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: quickstart
ms.date: 10/25/2026
---

# Create and connect to an Azure IoT Hub with the MQTT v5 connection profile

In this quickstart, you prepare cloud resources, configure a delivery path,
connect a device through the unified SDK, and verify telemetry at a downstream
destination. The device examples use an existing X.509 certificate for DPS
onboarding and the subsequent hub connection. Use the linked guides for each
stage of the journey.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Review the
> [capability matrix](mqtt-v5-capabilities.md) before starting.

## Prerequisites

- An Azure subscription.
- Permission to create and link Azure IoT Hub, Azure Device Registry (ADR)
  namespaces, and Device Provisioning Service (DPS) instances.
- Permission to configure required identities, role assignments, and routing.
- A supported downstream destination and a way to read received messages.
- A development environment for the unified .NET or C SDK.
- An existing X.509 device certificate and its matching private key.

Use a disposable evaluation environment where possible. Record the resources
you create so that cleanup doesn't remove shared infrastructure.

## 1. Set up the cloud foundation

Follow [Set up Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-cloud-setup.md)
to create the hub and configure:

- An IoT hub with the MQTT v5 connection profile selected at creation.
- Its Azure Device Registry namespace association and required permissions.
- DPS, linked through the ADR namespace to the intended hub.
- An enabled X.509 enrollment for the test device.

Use the cloud setup guide for the supported portal, CLI, and ARM steps and
their prerequisites. Record the DPS ID scope for the device application.
For onboarding options and credential configuration, see
[Configure a device with the unified SDKs](mqtt-v5-device-setup.md).

**Checkpoint:** The resource associations and enrollment are ready for the device.

## 2. Configure topics, routes, and destinations

Complete this stage before running the device application:

1. If the application uses custom topics, configure its allowed topics by using
   [Configure custom topic groups](mqtt-v5-custom-topics.md).
1. Create a routing endpoint for a supported downstream destination and grant
   IoT Hub the required access.
1. Create and enable a route for incoming device telemetry with query `true`.
1. Prepare the destination reader.
1. Enable the diagnostic collection needed for the test.

See [Shared routing requirements](iot-hub-devguide-messages-d2c.md#connection-profile-differences).
For destination-specific requirements, see
[Custom endpoints for message routing](iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing).
Set up diagnostics with [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).

A custom topic group doesn't create a route, and a route doesn't grant topic
publishing permission.

The all-messages route is explicit customer configuration, not an automatic
default. Fallback is disabled for preview. There's no customer-accessible
built-in telemetry destination to use instead of configuring your own route.

**Checkpoint:** The route is enabled, references the intended endpoint, and
the destination reader is ready.

## 3. Configure the device and publish

Follow [Configure a device with the unified SDKs](mqtt-v5-device-setup.md):

1. Choose .NET or C and use the version specified by the example.
1. Configure the DPS ID scope and X.509 credentials.
1. Let the SDK provision the device and establish the hub connection.
1. Check that DPS assigned the intended hub with the MQTT v5 connection profile.
1. Send the example's JSON telemetry and record the publish outcome.

MQTT v5 is fixed by the profile. Configure TLS and certificate trust according
to the device platform; don't disable certificate validation.
See [IoT Hub endpoints](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints)
and [X.509 device authentication](mqtt-v5-device-setup.md#x509-device-authentication).

The initial examples send messages by using the SDK's telemetry API, which publishes
to an IoT Hub-defined telemetry topic. To publish to your own MQTT topics,
configure a custom topic group and use the SDK's custom publishing API with an
allowed topic. Both approaches use the same SDK-managed connection.

**Checkpoint:** The device reports provisioning, connection, and publish results.

## 4. Verify delivery and monitor

1. Read the configured destination during the test interval.
1. Find the current message by using its test identifier, or the C sample's test
   device and payload.
1. Compare the received payload and metadata with the sent data.
1. Inspect available IoT Hub metrics and resource logs during the same interval.

A publish acknowledgment or an ingress metric doesn't prove that you
can read the message downstream. If the message doesn't arrive, check the route, query,
destination access, and consumer configuration in that order.

To set up diagnostics and follow a stage-by-stage troubleshooting checklist, see
[Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).

**Checkpoint:** The test message is available to the destination reader and
you know where to look when the pipeline fails.

## Clean up resources

Stop the test device application. Remove test credentials from the development
environment when you no longer need them.

Delete only resources that you created for this evaluation. Before deleting a resource
group, check whether the ADR namespace, DPS instance, destination, or monitoring
workspace is shared. Review related role assignments and diagnostic settings.

## Next steps

- Add [custom-topic publishing](mqtt-v5-custom-topics.md) and selective routes.
- Review the [shared SDK lifecycle and capabilities](../iot/device-registry/concept-unified-iot-sdks.md).
- Set up operational alerts with the [monitoring guide](mqtt-v5-monitor-troubleshoot.md).
- Use the destination service's documentation to build analytics or dashboards.
