---
title: "FAQ: What's New in Azure IoT Hub?"
titleSuffix: Azure IoT Hub
description: Learn about ADR linking for existing Standard hubs, certificate management, routing, and other Azure IoT Hub updates.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: troubleshooting
ms.date: 11/07/2026
ms.custom: references_regions
#Customer intent: As a developer using IoT Hub, I want to understand the new features and improvements in Azure IoT Hub and how they affect my existing deployments.
---

# FAQ: What's new in Azure IoT Hub?

Azure IoT Hub introduces advanced capabilities to improve security and unify operations across cloud and edge-connected deployments. This FAQ addresses common questions about the new generation of IoT Hub.

## What are the new features in IoT Hub?

Generally available capabilities include ADR linking for Standard hubs, certificate management through Standard hubs other than MQTT v5-profile hubs, the Microsoft Fabric Eventstream routing endpoint, and TLS 1.3. The MQTT v5 connection profile, message schema, and message payload formats are preview capabilities. See [What's new](iot-hub-what-is-new.md) for the scope of each feature.

- **Azure Device Registry (ADR)**: A centralized device registry that you can use to manage devices across multiple IoT Hubs by using namespaces. You can link an existing ADR namespace to your IoT Hub or create a new namespace and create the link. For more information, see [What is Azure Device Registry?](iot-hub-device-registry-overview.md)

- **Certificate management**: IoT Hub introduces built-in support for managing device certificates by using Microsoft-managed public key infrastructure (PKI) with X.509 certificates. These X.509 certificates are strictly operational certificates that the device uses to authenticate with IoT Hub for secure communications, after the device onboarded with a different credential. Certificate management is an optional feature. For more information, see [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)

## Are my existing IoT Hubs affected by these changes?

Existing hubs without ADR integration continue to work. ADR integration is optional; it isn't enabled on an existing hub merely because the capability becomes generally available. You can choose to enable it on an eligible existing Standard hub after reviewing the setup requirements and operational impact.

## Can I upgrade my existing IoT Hubs to use Azure Device Registry and certificate management?

Yes. An eligible existing Standard IoT Hub can become ADR-enabled. You don't need to create a replacement hub just to enable ADR. Certificate management is a separate, optional configuration; linking doesn't automatically change device credentials or the hub's connection profile.

> [!WARNING]
> Connecting an existing IoT Hub or DPS instance to an ADR namespace is permanent and can't be reversed. Review the eligibility checks, confirmation messages, and impact on existing management applications before proceeding.

See [Enable ADR integration](iot-hub-device-registry-setup.md).

## What happens to the built-in IoT Hub Device Registry if I set up a new IoT hub with ADR and certificate management enabled?

ADR provides an Azure Resource Manager representation for managing devices across linked services. Don't interpret ADR enablement as an automatic device reprovisioning or certificate-migration operation. Review the supported management operations for your hub's connection profile in [ADR integration](iot-hub-device-registry-overview.md) and verify your existing device-management applications as part of the rollout.

## Can I use namespaces and Azure Device Registry in my existing hubs?

Yes, eligible existing Standard hubs can link to an ADR namespace. Follow the [existing-hub setup path](iot-hub-device-registry-setup.md#enable-adr-on-an-existing-standard-hub) rather than creating duplicate resources. ADR linking doesn't enable MQTT v5 on a classic-profile hub.

## Can I use certificate management in my existing hubs?

Yes. Certificate management through IoT Hub is generally available for Standard hubs other than those with the MQTT v5 connection profile. First configure ADR linking and the required DPS and certificate resources. Devices need the supported certificate issuance and lifecycle flow; existing credentials aren't replaced automatically.

For MQTT v5 hubs, DPS issuance and renewal of ADR-issued operational certificates remain supported, but management directly through the hub isn't supported. No existing MQTT v5 DPS flow changes.

## Can I use Azure Device Registry without certificate management?

Yes. Certificate management is an optional feature. You can use ADR to manage devices across multiple IoT Hubs and choose to use other authentication methods, such as symmetric keys or third-party X.509 certificates. 

## Can I use certificate management without Azure Device Registry?

No. Certificate management is an optional feature of ADR, so it requires using ADR to manage device certificates. You must set up an ADR namespace and link it to your IoT Hub and DPS instance to use certificate management. For more information, see [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md#onboarding-vs-operational-credentials-for-devices).

## Can I use certificate management without the Device Provisioning Service (DPS)?

No, certificate management relies on Device Provisioning Service (DPS) for device registration and certificate management. You must use DPS with ADR to use certificate management features. For more information, see [Certificate issuance in Azure IoT Hub certificate management](../iot/concept-certificate-issuance.md).

## What is the pricing model for IoT Hub with ADR and certificate management?

Check current [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/) and the pricing for ADR, DPS and other resources used by your solution. Don't assume that an earlier preview offer establishes pricing for a generally available capability.

## What are the quotas and limits for IoT Hub with ADR and certificate management?

ADR linking is available for Standard hubs. Resource eligibility and certificate-management support depend on the configuration and connection profile. Review [setup requirements](iot-hub-device-registry-setup.md#prerequisites) and [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md). An identity-capacity increase doesn't increase every operation throttle.

## What regions support IoT Hub with ADR and certificate management?

Use the current [ADR setup requirements](../iot/device-registry/get-started-azure-device-registry.md#prerequisites) to check resource and region eligibility. Don't assume that every feature or connection profile is available in every region where IoT Hub exists.

## How do I plan a fleet above one million devices?

Verify the identity capacity supported by your hub's configuration and approved quota before provisioning the fleet. If you need capacity above five million, contact Azure support for a capacity assessment rather than assuming that adding units grants unlimited identities. See [Plan device-identity capacity and request an increase](iot-hub-devguide-quotas-throttling.md#plan-device-identity-capacity-and-request-an-increase).

## How do schemas and payload formats help downstream agents?

Schema and device-type context help a consumer interpret telemetry, while the endpoint's message format determines how the payload is packaged. These settings don't automatically validate data or provide an agent with permission to access it. See [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md).

## Can I investigate IoT Hub problems with MCP tools?

Yes. Azure MCP Server includes an IoT Hub tool namespace. Available operations depend on the installed version and your Azure permissions. Combine supported hub tools with monitoring and destination tools, and distinguish collected evidence from a confirmed diagnosis. See [Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md).

## Related content

- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)