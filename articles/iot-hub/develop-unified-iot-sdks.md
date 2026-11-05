---
title: Develop with unified Azure IoT SDKs
titleSuffix: Azure IoT Hub
description: Develop .NET or C device applications for Azure IoT Hub with the MQTT v5 connection profile using the unified Azure IoT SDK preview.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 10/25/2026
---

# Develop with unified Azure IoT SDKs

The unified Azure IoT SDKs provide a lifecycle-aware programming model for
device applications that use Azure IoT Hub, Device Provisioning Service (DPS),
and Azure Device Registry (ADR). Capability availability depends on the SDK
version and the hub's connection profile.

In this preview, the supported device application path for the MQTT v5
connection profile is through the unified Azure IoT SDKs for .NET and C.
Raw MQTT clients aren't part of the supported preview path.

> [!IMPORTANT]
> The unified Azure IoT SDKs are in preview and aren't recommended for
> production workloads. APIs and supported capabilities might change before
> general availability.

## Supported languages

| Language | Package or source | Availability |
| --- | --- | --- |
| .NET | [`Microsoft.Azure.Iot.Device`](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/2.0.0-preview3) | Preview |
| C | [Unified Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk/blob/releases/public-preview/c/README.md) | Preview |
| Python | Not available as a unified device SDK | Not supported |
| Java | Not available as a unified device SDK | Not supported |
| JavaScript or TypeScript | Not available as a unified device SDK | Not supported |

The .NET and C restriction applies to unified device SDKs, not to backend
application languages. Backend applications use separate SDK categories:

- **IoT Hub service SDKs** provide data-plane operations such as reading
  twins, updating desired properties, and invoking direct methods. The .NET
  package is `Microsoft.Azure.Devices`.
- **Resource Manager SDKs** create and configure Azure resources. IoT Hub
  management SDKs manage hub configuration; ADR management SDKs manage ADR
  resources. ADR Resource Manager SDKs are available for .NET, Python, Java,
  and JavaScript.

These aren't unified device SDKs and don't provide the device-side
provisioning, connection, or messaging clients described here. Check the
selected SDK version for the supported operations and API versions; an API's
presence doesn't enable unsupported preview features. See
[Backend application SDKs](mqtt-v5-capabilities.md#backend-application-sdks).

Similarly, the preview Azure IoT CLI extension
[configures cloud resources](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile), enrollments,
routes, and custom topic groups. It doesn't replace the unified device SDK for
provisioning a device, establishing its MQTT v5 session, or publishing telemetry.

## Device lifecycle model

The unified SDKs use a shared connection client and capability-focused feature clients.

The connection client:

- Provisions the device through Device Provisioning Service.
- Receives the assigned IoT Hub endpoint.
- Establishes and monitors the device connection.
- Coordinates credentials and connection state.
- Reconnects or reprovisions the device for supported recovery scenarios.

Feature clients provide supported device operations such as:

- Sending telemetry.
- Publishing to configured custom topics.
- Reading and updating device twin properties.
- Receiving desired property changes.
- Handling direct method requests.

The exact capability set depends on the SDK language and version.

## MQTT v5 preview capabilities

The public unified C SDK documents the following support when the MQTT v5
connection profile is configured:

| Capability | Supported |
| --- | --- |
| DPS provisioning | Yes |
| X.509 connectivity | Yes |
| Telemetry | Yes |
| Custom-topic publishing | Yes |
| Device twins | Yes |
| Direct methods | Yes |
| Cloud-to-device messages | No |
| File upload | No |
| Certificate renewal over IoT Hub | No |

Devices can use an existing X.509 certificate for DPS onboarding and the hub
connection, as shown in [device setup](mqtt-v5-device-setup.md).
Alternatively, configured DPS issuance uses symmetric-key or X.509 onboarding
credentials and a device certificate signing request to return an ADR-issued
operational X.509 certificate. Symmetric-key onboarding for this profile
requires that issuance path; devices connect to the MQTT v5 hub using X.509
certificates, not SAS tokens.

Operational certificate renewal is supported through DPS, not directly
through the MQTT v5 hub. Check the selected SDK version for the APIs needed
to request issuance or repeat issuance; don't assume that the SDK automatically
renews certificates. See
[Configure certificate issuance through DPS](mqtt-v5-cloud-setup.md#configure-certificate-issuance-through-dps).

## Choose an SDK

Use the .NET SDK when your device application runs on a supported .NET
platform and you want a managed-code development experience.

Use the C SDK for native, constrained, or embedded device applications. The C
SDK supports C99, pluggable MQTT clients, PKCS#11 or TPM-backed private keys,
and connection recovery with backoff.

Use the version-specific SDK documentation and samples to verify supported
platforms, APIs, and capabilities before you develop your application.

## Choose a version and payload format

Pin SDK versions when evaluating the preview, and use the documentation for
the version you select.

The SDKs accept message payloads as bytes. Set content metadata that accurately
describes those bytes. For example, use `application/json` for JSON encoded
as UTF-8. Payload metadata controls vary by SDK, API, and version, so check
the documentation for the version you use.

The [device setup guide](mqtt-v5-device-setup.md) provides version-pinned
examples and notes any limitations relevant to those examples.

Device payload metadata and the routing endpoint's **Message format** are
separate settings. **Device format** preserves the original payload, subject
to the destination's encoding and envelope. **Standardized** wraps the
original JSON value in an observation array under `payload.value`; it doesn't
rename fields or convert units. Configure this setting on the routing endpoint,
not on the SDK feature client. See
[Message format on an endpoint](mqtt-v5-route-messages.md#message-format-on-an-endpoint).

## Separate protocol operations from supported features

The SDK handles provisioning and connection lifecycle work. Use feature
clients rather than manually implementing MQTT `CONNECT` or service session
handshakes.

A generic MQTT model can expose operations that aren't supported by the
IoT Hub preview. In particular, custom-topic publishing doesn't establish
support for customer subscriptions, retained messages, or arbitrary
device-to-device messaging. Use the
[capability matrix](mqtt-v5-capabilities.md) to determine product support.

## Next steps

- [Configure a device and run the .NET or C example](mqtt-v5-device-setup.md).
- [Publish custom-topic messages with MQTT v5 user properties](mqtt-v5-device-setup.md#publish-a-custom-topic-test-message-with-net).
- [Verify actual delivery in Fabric](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric).
- [Follow the complete setup journey](mqtt-v5-get-started.md).
- Review [Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).
- Read the public [Unified Azure IoT SDK overview](../iot/device-registry/concept-unified-iot-sdks.md).
