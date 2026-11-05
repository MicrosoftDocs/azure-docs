---
title: Compare Azure IoT Hub connectivity options
titleSuffix: Azure IoT Hub
description: Compare Azure IoT Hub with the classic connection profile and Azure IoT Hub with the MQTT v5 connection profile.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 10/16/2026
---

# Compare Azure IoT Hub connectivity options

Azure IoT Hub supports two distinct connection profiles for device connectivity:
the existing **Classic** connection profile, which supports MQTT v3.1.1, HTTPS,
and AMQP, and the new **MQTT v5** connection profile, which supports MQTT v5 and
is available in preview. Select the connection profile when creating your hub;
you can't change it afterward.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Its capabilities and limits
> might change before general availability.

## High-level comparison

| Area | Azure IoT Hub with the classic connection profile | Azure IoT Hub with the MQTT v5 connection profile |
| --- | --- | --- |
| Device protocol | MQTT v3.1.1, AMQP, and HTTPS | MQTT v5 only |
| Device authentication | SAS or X.509 certificates | X.509 certificates only |
| Device Provisioning Service (DPS) onboarding attestation | SAS, TPM, or X.509 certificates | SAS or X.509 credentials |
| MQTT topics | IoT Hub-defined topics for specific operations | Customer-defined topics plus documented IoT Hub operation topics |
| MQTT v5 reason codes | Not applicable to MQTT v3.1.1 connections | Supported for documented operations |
| MQTT v5 properties | Not applicable to MQTT v3.1.1 connections | Supported properties can carry message and application context |
| Device identity foundation | IoT Hub identity registry, with opt-in Azure Device Registry integration | Azure Device Registry-enabled identity and management experience |
| Telemetry | Supported | Supported in preview |
| Message routing | Supported | Configure an explicit all-messages route with query `true` to a supported destination to access incoming telemetry |
| Fallback routing | Supported | Not supported; disabled for preview |
| Built-in routing endpoint (`messages/events`) | Supported | Not supported; configure a route to another supported destination |
| Device twins | Supported | Supported in preview with an MQTT v5 operation contract |
| Direct methods | Supported | Supported in preview with an MQTT v5 operation contract |
| Cloud-to-device messages | Supported | Not available in preview |
| Jobs and automatic configurations | Supported in applicable tiers | Not available in preview |
| File upload | Supported | Not available in preview |
| IoT Edge | Supported | Not available in preview |
| Service maturity | Generally available | Preview |

For a detailed status matrix, see
[Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).

For Azure IoT Hub with the MQTT v5 connection profile, devices can request an
ADR-issued operational X.509 certificate during DPS provisioning when certificate
issuance is configured. SAS onboarding requires this configuration. Devices can
also provision using an existing X.509 certificate without requesting a new
certificate.

Direct operational certificate renewal through the MQTT v5 hub isn't supported
in this preview.

## Choose Azure IoT Hub with the classic connection profile

Consider an IoT hub with the classic connection profile when your solution:

- Requires MQTT v3.1.1, AMQP, or HTTPS device connectivity.
- Requires direct device authentication by using SAS tokens generated from symmetric keys.
- Uses TPM attestation for onboarding through Device Provisioning Service.
- Depends on cloud-to-device messages, jobs, automatic configurations, file
  upload, modules, or IoT Edge capabilities that aren't available in the MQTT
  v5 preview.
- Requires a generally available service contract.
- Must connect existing devices without migrating their protocol or
  authentication implementation.

## Choose Azure IoT Hub with the MQTT v5 connection profile

Consider an IoT hub with the MQTT v5 connection profile when your solution:

- Requires standards-based MQTT v5 connectivity.
- Uses X.509 certificates issued by Microsoft or by a third-party certificate
  authority for device connectivity.
- Uses DPS for onboarding with SAS or X.509 credentials, including supported
  certificate issuance during provisioning.
- Needs device publishing to customer-defined topic hierarchies and downstream
  filtering through routes.
- Uses MQTT v5 reason codes and properties to improve protocol feedback and
  message context.
- Needs supported IoT Hub telemetry, routing, device state, device control, and
  monitoring capabilities.
- Can evaluate a preview service and accommodate possible changes before
  general availability.

## Next steps

- Read [What is Azure IoT Hub with the MQTT v5 connection profile?](mqtt-v5-overview.md).
- Review [Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).
- [Follow the cloud-to-device setup journey](mqtt-v5-get-started.md).
