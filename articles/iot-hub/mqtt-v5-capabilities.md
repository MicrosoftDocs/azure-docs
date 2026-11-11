---
title: Compare IoT Hub connection profiles and MQTT v5 capabilities
titleSuffix: Azure IoT Hub
description: Compare classic and MQTT v5 connection profiles, then review supported capabilities and preview limitations for MQTT v5 in Azure IoT Hub.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 11/10/2026
---

# Compare IoT Hub connection profiles and MQTT v5 capabilities

Azure IoT Hub offers a classic connection profile and an MQTT v5 connection
profile for device connectivity. Select the connection profile when creating
your hub; you can't change it afterward. Use this article to compare the
profiles and check the capabilities available in the MQTT v5 preview.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Preview capabilities,
> availability, limits, and behavior might change before general availability.

<a id="capabilities-of-azure-iot-hub-with-the-mqtt-v5-connection-profile"></a>
<a id="compare-azure-iot-hub-connectivity-options"></a>
<a id="high-level-comparison"></a>

## Compare connection profiles

| Area | Classic connection profile | MQTT v5 connection profile |
| --- | --- | --- |
| Availability | Generally available | Preview |
| Device protocols | MQTT v3.1.1, AMQP, and HTTPS | MQTT v5 only |
| Direct device authentication | SAS or X.509 certificates | X.509 certificates only |
| DPS onboarding attestation | SAS, TPM, or X.509 certificates | SAS or X.509 credentials; SAS requires configured certificate issuance |
| MQTT topics | IoT Hub-defined operation topics | Custom-topic publishing and documented IoT Hub operation topics; no custom-topic subscriptions |
| Device identity foundation | IoT Hub identity registry, with optional ADR integration | ADR-enabled identity and management experience |
| Built-in endpoint and fallback routing | Supported | Neither is supported; configure explicit routes to supported destinations |
| Device-management features | Availability depends on the [IoT Hub tier](iot-hub-scaling.md) | Telemetry, twins, and direct methods are supported; see [Device identity and management](#device-identity-and-management) for gaps |

A connection profile isn't an endpoint hostname. For hostname selection and
TLS support for each profile, see
[IoT Hub endpoints](iot-hub-devguide-endpoints.md#connection-profiles-and-endpoint-selection).

### Choose Azure IoT Hub with the classic connection profile

Choose the classic profile if you require a generally available service
contract, MQTT v3.1.1, AMQP, HTTPS device messaging, direct SAS device
authentication, or TPM attestation through DPS.

Also choose it when your solution depends on cloud-to-device messages, jobs,
automatic configurations, file upload, modules, or IoT Edge, which aren't
available in the MQTT v5 preview. Check the tier requirements for those features.
Existing devices can continue using their current protocol and authentication
implementation without migrating to MQTT v5.

### Choose Azure IoT Hub with the MQTT v5 connection profile

Choose this profile to evaluate MQTT v5 connectivity with X.509 device
authentication, custom-topic publishing, and routing based on topics and
user properties. MQTT v5 reason codes provide protocol feedback alongside
the supported telemetry, twin, direct method, and monitoring capabilities.
Your solution must be able to accommodate preview changes.

Devices can use an existing X.509 certificate for DPS onboarding and hub
authentication, or obtain an ADR-issued operational certificate through
configured DPS issuance. SAS onboarding requires issuance; direct SAS hub
authentication isn't supported. Operational certificates are renewed through
DPS, not directly through the MQTT v5 hub. See
[Device onboarding and certificates](mqtt-v5-device-setup.md#device-provisioning-service-dps-onboarding-and-certificates).

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
| TPM attestation through DPS | Not supported | Use SAS or X.509 onboarding credentials for this profile. |
| SAS onboarding through DPS | Yes | Requires configured certificate issuance. SAS authenticates the device to DPS, which returns an ADR-issued operational X.509 certificate for connecting to the hub. |
| Certificate issuance during DPS provisioning | Yes | Requires an ADR issuing CA, certificate policy, and a DPS enrollment configured to reference them. The device submits a CSR to obtain an operational X.509 certificate. |
| Custom MQTT topics | Yes | Devices can publish to customer-defined topic hierarchies. |
| Custom-topic subscriptions | Not supported | Preview custom-topic operations are publish-only. Consume telemetry through routing destinations. |
| MQTT v5 reason codes | Yes | Reason codes communicate the outcome of protocol operations. |
| MQTT v5 user properties | Yes | User properties carry application context and can be used as application properties in routing conditions. See [Topic and user-property filters](iot-hub-devguide-routing-query-syntax.md#filter-by-mqtt-topic-and-user-properties). |

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
| Modules | Not supported | |
| IoT Edge | Not supported | |
| Device Update integration | Not supported | |

## Development SDKs

### Device application SDKs

| Capability | Supported in preview | Notes |
| --- | --- | --- |
| Unified Azure IoT SDK for .NET | Yes | Select an MQTT v5-compatible preview package from [Available SDKs](/azure/iot/device-registry/concept-unified-iot-sdks#available-sdks). |
| Unified Azure IoT SDK for C | Yes | Select an MQTT v5-compatible preview release from [Available SDKs](/azure/iot/device-registry/concept-unified-iot-sdks#available-sdks), then follow that release's build instructions and samples. |
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
| Message routing | Yes | Supports Event Hubs, Storage blob containers, Service Bus queues and topics, Cosmos DB, and Microsoft Fabric eventstreams. Configure and enable an all-messages route with query `true`. See [Supported routing destinations](iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing) for endpoint requirements. |
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
- [Follow the cloud-to-device setup journey](mqtt-v5-get-started.md).
- [Develop with the unified Azure IoT SDKs](../iot/device-registry/concept-unified-iot-sdks.md).
- [Configure routes and destinations](iot-hub-devguide-messages-d2c.md).
- [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).
- [Read the MQTT v5 FAQ](iot-hub-faq.md#azure-iot-hub-with-the-mqtt-v5-connection-profile).
