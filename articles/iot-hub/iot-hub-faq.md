---
title: "FAQ: What's New in Azure IoT Hub?"
titleSuffix: Azure IoT Hub
description: Find answers about existing IoT hubs, ADR integration, certificate management, the MQTT v5 connection profile, scale, and troubleshooting.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: troubleshooting
ms.date: 11/10/2026
ms.custom: references_regions
#Customer intent: As a developer using IoT Hub, I want to understand the new features and improvements in Azure IoT Hub and how they affect my existing deployments.
---

# FAQ: What's new in Azure IoT Hub?

This FAQ explains how the latest Azure IoT Hub updates apply to new and existing deployments. Choose a category:

- [General availability and existing deployments](#general-availability-and-existing-deployments)
- [Azure Device Registry integration](#azure-device-registry-integration)
- [Certificate management and DPS](#certificate-management-and-dps)
- [MQTT v5 connection profile](#mqtt-v5-connection-profile)
- [Scale, telemetry, and troubleshooting](#scale-telemetry-and-troubleshooting)

## General availability and existing deployments

### What are the new features in IoT Hub?

Updates include linking new or existing Standard hubs to Azure Device Registry (ADR), managing operational X.509 certificates, routing telemetry to Microsoft Fabric eventstreams, and using TLS 1.3. Preview capabilities add MQTT v5 device connectivity, message schema references, and payload formats. See [What's new in Azure IoT Hub](iot-hub-what-is-new.md) for feature summaries and getting-started links.

### Which capabilities are generally available, and which are in preview?

ADR linking for Standard hubs, certificate management through Standard hubs other than those using the MQTT v5 connection profile, the Microsoft Fabric eventstream routing endpoint, and TLS 1.3 are generally available. The MQTT v5 connection profile, message schema, and message payload formats are in preview. Availability applies to each capability separately.

### Are my existing IoT Hubs affected by these changes?

No action is required to keep using an existing hub without ADR integration. ADR linking is optional and isn't enabled automatically. If you choose to link an existing Standard hub, review the setup requirements and the impact on your device-management applications before making the change.

### What regions support IoT Hub with ADR and certificate management?

See [Supported regions](iot-hub-what-is-new.md#supported-regions) for IoT Hub with ADR and certificate management. That section also identifies the smaller set of regions available for the MQTT v5 connection profile in preview.

### What is the pricing model for IoT Hub with ADR and certificate management?

Review [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/) along with pricing for ADR, Device Provisioning Service (DPS), and the other services in your solution.

## Azure Device Registry integration

### Can I upgrade my existing IoT Hubs to use Azure Device Registry and certificate management?

Yes. You can link an eligible existing Standard hub to an ADR namespace without creating a replacement hub. You can then configure certificate management separately. Linking doesn't automatically replace device credentials or convert the hub to the MQTT v5 connection profile.

> [!WARNING]
> Connecting an existing IoT Hub or DPS instance to an ADR namespace is permanent and can't be reversed. The setup workflow warns that linking can cause downtime for existing management services. Review the impact on your applications and plan the change before proceeding.

See [Enable ADR integration](iot-hub-device-registry-setup.md).

<a id="can-i-use-namespaces-and-azure-device-registry-in-my-existing-hubs"></a>

### Can new and existing hubs share an ADR namespace?

Yes. Multiple eligible Standard hubs can link to the same ADR namespace, whether you create them during setup or link existing hubs. Each hub links to one namespace, so a shared namespace provides a common management scope for devices across those hubs. See [Azure Device Registry namespaces](iot-hub-device-registry-overview.md#azure-device-registry-namespaces).

### What happens to the built-in IoT Hub Device Registry if I set up a new IoT hub with ADR and certificate management enabled?

ADR provides an Azure Resource Manager representation of devices for management across linked services. Linking a hub doesn't automatically reprovision its devices or replace their credentials. Before linking, review the registry operations used by your applications and verify their compatibility with ADR integration. See [Integration with Azure Device Registry](iot-hub-device-registry-overview.md).

<!-- REVIEW BLOCKER: Complete this answer with the confirmed behavior of the
built-in identity registry after linking, including existing API/SDK operations,
device-record representation, and required management-application changes. -->

### Can I use Azure Device Registry without certificate management?

Yes. Certificate management is optional. You can use ADR to manage devices across linked hubs while using the authentication methods supported by each hub's connection profile. Classic-profile hubs support symmetric keys or third-party X.509 certificates; MQTT v5 hub connections require X.509 certificates.

### Can I unlink a hub after enabling ADR?

No. Linking an IoT hub or DPS instance to an ADR namespace is permanent. Review resource eligibility, permissions, and management-application impact before confirming the link. See [Enable ADR integration](iot-hub-device-registry-setup.md).

## Certificate management and DPS

### Can I use certificate management in my existing hubs?

Yes. Certificate management through IoT Hub is generally available for Standard hubs, except hubs using the MQTT v5 connection profile. Configure ADR linking, DPS, and the required certificate authority and policy, then use the supported device issuance flow to obtain operational X.509 certificates. Existing credentials aren't replaced automatically.

MQTT v5 devices use the separate [DPS issuance and renewal flow](#how-do-mqtt-v5-devices-obtain-and-renew-operational-certificates).

### Does certificate management replace a device's onboarding credential?

No. The onboarding credential authenticates the device to DPS. The operational X.509 certificate authenticates the provisioned device to IoT Hub. ADR certificate management issues and manages operational certificates; it doesn't issue or replace the device's onboarding credential. See [Onboarding and operational credentials](../iot/iot-certificate-management-overview.md#onboarding-vs-operational-credentials-for-devices).

### Can I use certificate management without Azure Device Registry?

No. This managed certificate capability uses ADR certificate authorities and policies. Set up an ADR namespace and link the required IoT Hub and DPS resources to use it. This requirement doesn't prevent you from using your own X.509 certificates with IoT Hub outside ADR certificate management. See [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md).

### Can I use certificate management without the Device Provisioning Service (DPS)?

DPS is required for the initial provisioning and managed certificate issuance flow. A device authenticates to DPS with its onboarding credential and submits a certificate signing request to obtain an operational certificate. Subsequent renewal follows the supported flow for the hub's connection profile. See [Certificate issuance](../iot/concept-certificate-issuance.md) and [Certificate renewal](../iot/concept-certificate-renewal.md).

<a id="can-devices-obtain-and-renew-operational-certificates-through-dps"></a>

### How do MQTT v5 devices obtain and renew operational certificates?

Set up an ADR issuing certificate authority and policy, and reference them in the DPS enrollment. The device authenticates to DPS by using a SAS or X.509 onboarding credential and sends a certificate signing request (CSR) to get an operational X.509 certificate. For renewal, the device uses its valid onboarding credential and sends a new CSR through DPS. The MQTT v5 hub doesn't support direct certificate management. DPS issuance and renewal are still supported.

A device with a suitable existing X.509 certificate can also provision without requesting a new certificate and use that certificate for hub authentication. See [DPS onboarding and certificates](mqtt-v5-tls-requirements.md#device-provisioning-service-dps-onboarding-and-certificates).

<a id="azure-iot-hub-with-the-mqtt-v5-connection-profile"></a>

## MQTT v5 connection profile

### Can I enable the MQTT v5 connection profile on an existing Standard hub?

No. In this preview, select the MQTT v5 connection profile when creating a new hub. You can't convert an existing classic-profile hub in place. See [Set up an MQTT v5 hub](mqtt-v5-cloud-setup.md).

<a id="what-is-the-mqtt-v5-connection-profile"></a>

### Is the MQTT v5 connection profile a pricing tier or a connectivity option?

In preview, it is a connectivity option, not a separate pricing tier of IoT Hub nor a separate Azure IoT Hub product. A hub's SKU and unit count describe its tier and capacity; its connection profile determines its device-connectivity behavior. The MQTT v5 profile supports MQTT v5 messaging, customer-defined publish topics, ADR integration, and DPS onboarding. See the [MQTT v5 overview](mqtt-v5-overview.md) and review supported configurations before selecting a SKU.

### Does enabling ADR on an existing Standard hub enable MQTT v5?

No. ADR linking and connection-profile selection are separate operations. Linking an existing Standard hub to ADR doesn't change its connection profile. To evaluate MQTT v5, create a new hub with that profile.

### Do I need to move my existing devices to MQTT v5?

No. You can continue using your existing classic-profile hub and device applications. Adopting the MQTT v5 preview is optional. Evaluate it with a separate hub and representative devices before planning changes to an existing deployment.

<a id="which-device-protocols-and-sdks-are-supported"></a>

<a id="can-i-reuse-my-existing-device-application-and-sdk"></a>

### What changes does my existing device application need to use MQTT v5?

The MQTT v5 preview requires the unified Azure IoT device SDK for .NET or C. If your application uses a legacy IoT Hub device SDK, migrate its connectivity code to a supported unified SDK. You can reuse application logic where compatible, such as sensor handling and telemetry payload construction, while updating provisioning, authentication, connection, and messaging code as needed. Changing only the hub endpoint or connection string isn't sufficient. See [SDK support](mqtt-v5-capabilities.md#development-sdks) for details.

### Can a device connect directly to the hub with SAS?

No. Direct device connections to an MQTT v5 hub require X.509 authentication. SAS tokens, symmetric device keys, and device connection strings can't authenticate that connection. SAS or X.509 credentials can authenticate onboarding through DPS; SAS onboarding requires issuance of an operational certificate for the hub connection. See [DPS issuance and renewal](#how-do-mqtt-v5-devices-obtain-and-renew-operational-certificates).

<a id="are-all-classic-profile-capabilities-and-limits-available"></a>

### Are all Standard IoT Hub capabilities available with the MQTT v5 profile?

No. The preview supports device telemetry, device twins, direct methods, and routing to supported destinations. Cloud-to-device messages, jobs, automatic device configurations, file upload, and IoT Edge aren't supported. General IoT Hub APIs and limits don't establish support for this profile. See [Supported capabilities](mqtt-v5-capabilities.md) before adapting an existing solution.

<a id="can-devices-subscribe-to-custom-topics"></a>

### Can devices publish and subscribe to custom MQTT topics?

Devices can publish to customer-defined topics that match the configured topic templates. Custom-topic subscriptions aren't supported in this preview. Applications consume the telemetry through routing destinations rather than subscribing to custom topics on the hub. See [Custom topics](mqtt-v5-custom-topics.md).

<a id="where-does-telemetry-go-is-there-a-built-in-or-fallback-destination"></a>

### Can my backend continue reading telemetry from the built-in endpoint?

Not for telemetry sent to an MQTT v5 hub. This profile doesn't provide the built-in `messages/events` destination, and it disables fallback routing. Configure a supported destination and an explicit, enabled all-messages route with condition `true`, then configure your backend to consume from that destination. You can add selective routes for specific messages. The all-messages route is a normal route, not a fallback route. See [Route messages to destinations](mqtt-v5-route-messages.md).

## Scale, telemetry, and troubleshooting

### How do I plan a fleet above one million devices?

IoT Hub can support up to five million registered devices per instance. If you need to grow beyond one million registered devices, contact Azure support to configure extended capacity for your hub. Account for device and module counts, concurrent connections, telemetry volume, and routing requirements. See [Plan device-identity capacity and request an increase](iot-hub-devguide-quotas-throttling.md#plan-device-identity-capacity-and-request-an-increase).

### What are the quotas and limits for IoT Hub with ADR and certificate management?

Hub identity capacity, message quotas, operation throttles, ADR resource limits, and DPS provisioning rates are separate limits. Linking a hub to ADR doesn't by itself increase its capacity. Review [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md) and the [ADR limits references](iot-hub-device-registry-overview.md#limits-and-quotas) when planning your deployment. For MQTT v5, also check the [profile-specific capabilities and limits](mqtt-v5-capabilities.md); don't assume classic-profile limits apply.

### How do schemas and payload formats help downstream agents?

Schema references describe the original telemetry payload, device-type context helps identify the kind of device producing it, and the endpoint's message format determines how the payload is packaged. Together, they help downstream applications and agents interpret device data. Schema references don't automatically validate or transform messages, and consumers still need permission to access the data. Message schema and payload formats are in preview. See [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md).

<a id="which-metrics-should-i-use"></a>

### Which metrics help investigate routing and throttling?

Use supported ingress, throttling, routing-delivery, and latency metrics for the affected resource and time window. Select the metric's documented dimensions and aggregations, and correlate the results with device errors and destination observations. See [Routing and throttling metrics](monitor-iot-hub-reference.md#investigate-routing-and-throttling-together). For MQTT v5, follow the [profile-specific monitoring guidance](mqtt-v5-monitor-troubleshoot.md): a metric definition alone doesn't establish profile support, and missing data isn't the same as zero.

### Does a successful publish prove delivery to my application?

No. A publish acknowledgment, route delivery, and application processing are separate checkpoints. Send a uniquely identifiable test message and verify that the receiving application obtains the expected payload and metadata. For MQTT v5, see [Monitor a test run](mqtt-v5-monitor-troubleshoot.md#monitor-a-test-run).

### Can I investigate IoT Hub problems with MCP tools?

Yes. Azure MCP Server includes tools for retrieving hub information and listing device identities. Combine the supported IoT Hub tools with Azure Monitor and destination tools to investigate issues such as missing telemetry. Available operations depend on your installed version and permissions. Review the collected evidence before accepting a diagnosis, and approve resource changes separately. See [Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md).

## Related content

- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)