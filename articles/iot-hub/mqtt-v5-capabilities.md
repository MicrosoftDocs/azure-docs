---
title: Capabilities of Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Review the available and unsupported capabilities of Azure IoT Hub with the MQTT v5 connection profile.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 10/26/2026
---

# Capabilities of Azure IoT Hub with the MQTT v5 connection profile

This article summarizes the capabilities available in Azure IoT Hub with the
MQTT v5 connection profile.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Preview capabilities,
> availability, limits, and behavior might change before general availability.

## Hub and device connectivity

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Create a new hub with the MQTT v5 connection profile | Yes | Select the profile when creating a hub through the Azure portal, preview CLI, or ARM. See [Set up cloud resources](mqtt-v5-cloud-setup.md). |
| Enable the profile on an existing IoT hub | Not supported | To use the MQTT v5 connection profile, create a new IoT hub with this profile selected. |
| MQTT v5 | Yes | The only supported device-connectivity protocol. |
| MQTT v3.1.1 | Not supported | If your solution requires MQTT v3.1.1, select **Classic** under **Connection profile** when creating the IoT hub. |
| AMQP and AMQP over WebSockets | Not supported | |
| HTTPS device messaging | Not supported | |
| X.509 connectivity authentication | Yes | Devices connect with certificates issued by Microsoft or by a third-party certificate authority. |
| Direct SAS connectivity authentication | Not supported | SAS tokens, symmetric device keys, and device connection strings can't be used to connect directly to Azure IoT Hub with the MQTT v5 connection profile. |
| Device onboarding through Device Provisioning Service (DPS) | Yes | Devices can onboard using SAS or X.509 credentials. |
| SAS onboarding through DPS | Yes | Requires configured certificate issuance. SAS authenticates the device to DPS, which returns an ADR-issued operational X.509 certificate for connecting to the hub. |
| Certificate issuance during DPS provisioning | Yes | Requires an ADR issuing CA, certificate policy, and a DPS enrollment configured to reference them. The device submits a CSR to obtain an operational X.509 certificate. |
| Custom MQTT topics | Yes | Devices can publish to customer-defined topic hierarchies. |
| Custom-topic subscriptions | Not supported | Preview custom-topic operations are publish-only. Consume telemetry through routing destinations. |
| MQTT v5 reason codes | Yes | Reason codes communicate the outcome of protocol operations. |
| MQTT v5 user properties | Yes | User properties carry application context and can be used as application properties in routing conditions. See [Topic and user-property filters](mqtt-v5-route-messages.md#filter-by-mqtt-topic-and-user-properties). |

## Device identity and management

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Azure Device Registry (ADR) integration | Yes | Provides the device identity and management foundation. |
| Direct operational certificate renewal through IoT Hub | Not supported | Devices renew DPS-issued operational certificates through DPS using their valid onboarding credential and a new CSR. |
| Device identity management | Yes | Devices are represented and managed through the integrated registry experience. |
| Device twins | Yes | Includes supported reported and desired property operations. |
| Direct methods | Yes | Supports request and response operations between a service application and a device. |
| Cloud-to-device messaging | Not supported | |
| Jobs | Not supported | |
| Automatic device configurations | Not supported | |
| File upload | Not supported | |
| IoT Edge | Not supported | |
| Device Update integration | Not supported | |

## Development SDKs

### Device application SDKs

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Unified Azure IoT SDK for .NET | Yes | Use the [Microsoft.Azure.Iot.Device preview package](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/2.0.0-preview3). |
| Unified Azure IoT SDK for C | Yes | Build from the [Unified Azure IoT C SDK source](https://github.com/Azure/azure-iot-sdk/blob/releases/public-preview/c/README.md). See the SDK's build instructions and samples. |
| Raw MQTT clients | Not supported | The supported device application path for this preview is through the unified Azure IoT SDKs for .NET and C. |
| Unified Azure IoT SDK for Python | Not supported | |
| Unified Azure IoT SDK for Java | Not supported | |
| Unified Azure IoT SDK for JavaScript or TypeScript | Not supported | |

### Backend application SDKs

Backend applications use different SDKs for device interactions and Azure resource
configuration:

| SDK category | Purpose | .NET example |
| --- | --- | --- |
| [IoT Hub service SDKs](iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks) | Data-plane clients for device interactions, such as reading twins, updating desired properties, and invoking direct methods. | `Microsoft.Azure.Devices` |
| [Resource Manager SDKs](iot-hub-devguide-sdks.md#azure-iot-hub-management-sdks) | Control-plane clients for creating and configuring Azure resources. IoT Hub management SDKs manage hub resources and configuration; ADR management SDKs manage ADR resources. | `Azure.ResourceManager.IotHub` |

ADR Resource Manager SDKs are available for .NET, Python, Java, and JavaScript.
They aren't device SDKs or substitutes for IoT Hub service SDKs. The .NET and C
restriction above applies to unified device SDKs, not backend application languages.

Check the selected SDK version for the operations and API versions your application
requires. SDK functionality doesn't expand the capabilities supported by the
MQTT v5 connection profile; for example, jobs and cloud-to-device messaging remain
unsupported in this preview.

## Messaging and integration

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Device-to-cloud telemetry | Yes | |
| Message routing | Yes | Supports Event Hubs, Storage blob containers, Service Bus queues and topics, Cosmos DB, and Microsoft Fabric eventstreams. Configure and enable an all-messages route with query `true`. See [Supported routing destinations](mqtt-v5-route-messages.md#supported-routing-destinations) for endpoint requirements. |
| Fallback routing | Not supported | Disabled for preview. Use an explicit all-messages route, not a fallback route. |
| Built-in routing endpoint (`messages/events`) | Not supported | No built-in destination is provided. Customers must configure a route to another supported destination. |
| Custom topic groups | Yes | Maximum 1 group per hub with up to 10 topic templates. Templates starting with `ih`, `+`, or `#` are rejected; `{deviceId}` is the only supported variable. See [Preview limits and topic template rules](mqtt-v5-custom-topics.md#preview-limits-and-topic-template-rules). |
| Route filters based on custom topics | Yes | Routes can select messages by customer-defined topic structure. |
| Route filters based on MQTT v5 properties | Yes | Routes can use supported MQTT v5 properties. |

## Operations, security, and reliability

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Azure CLI resource configuration | Yes, with the preview IoT extension | Native commands cover hub creation, ADR/DPS linking, X.509 enrollment, routing, and custom topic groups. See [CLI setup](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile). CLI support doesn't imply support for every classic-profile command or destination. |
| Azure Monitor metrics | Yes | Metrics describe supported IoT Hub resources and operations. |
| Connected-device and connection metrics | Yes | Distinguish authentication, MQTT connection, and IoT Hub session readiness. |
| Telemetry and routing metrics | Yes | Metrics report telemetry and routing outcomes. |
| Twin and direct method metrics | Yes | Metrics report supported device-management operations. |

## Next steps

- Read [What is Azure IoT Hub with the MQTT v5 connection profile?](mqtt-v5-overview.md).
- [Compare Azure IoT Hub connectivity options](compare-iot-hub-connectivity.md).
- [Follow the cloud-to-device setup journey](mqtt-v5-get-started.md).
- [Develop with the unified Azure IoT SDKs](develop-unified-iot-sdks.md).
- [Configure routes and destinations](mqtt-v5-route-messages.md).
- [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).
