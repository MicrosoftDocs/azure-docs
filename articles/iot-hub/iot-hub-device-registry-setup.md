---
title: Enable Azure Device Registry integration for IoT Hub
titleSuffix: Azure IoT Hub
description: Link a new or existing eligible Standard IoT hub to Azure Device Registry and plan optional certificate management.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/10/2026
---

# Enable Azure Device Registry integration for IoT Hub

Link a new or existing Standard IoT hub to an Azure Device Registry (ADR)
namespace to manage devices across connected services. ADR linking is generally
available, and you don't need to recreate an eligible existing hub to use it.
This guide walks through both Azure portal setup paths, the choice to enable
certificate management, and verification of the connected resources.

## Prerequisites

- An active Azure subscription with the `Microsoft.DeviceRegistry` and
  `Microsoft.Devices` resource providers registered. See
  [Register a resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- Permission to configure the existing resources you select and create any
  required resource groups, ADR namespaces, managed identities, IoT hubs, and
  Device Provisioning Service (DPS) instances.
- Permission to create role assignments at the required scopes. For example,
  Owner or User Access Administrator can grant role assignments; resource
  configuration permissions are also required. See
  [Privileged roles](../role-based-access-control/built-in-roles.md#privileged).
- An eligible Standard hub for the existing-hub path, or a planned Standard hub
  configuration for the new-hub path.
- A new or existing ADR namespace and a plan to connect or create the DPS
  resources used by the setup.
- A region supported by the selected services. Guided setup creates new resources
  in the namespace's region and filters existing resources to that region.

For existing deployments, record the hub and DPS resource IDs, provisioning
configuration, and device-management applications that use them. Plan a change
window and identify the operations you need to test after linking.

> [!WARNING]
> Connecting an existing IoT Hub or DPS instance to an ADR namespace is permanent
> and can't be reversed. Linking can cause downtime for existing management
> services. Review the impact on your applications before confirming; unlinking
> isn't available as a rollback option.

## Choose a deployment method

Choose the path that matches your deployment:

| Your starting point | Setup path |
| --- | --- |
| An existing Standard hub | [Enable ADR on an existing Standard hub](#enable-adr-on-an-existing-standard-hub). |
| A new Standard hub | [Create a new ADR-enabled hub](#create-a-new-adr-enabled-hub). |
| A new hub with the MQTT v5 connection profile | Use the dedicated [MQTT v5 cloud setup](mqtt-v5-cloud-setup.md). |

The following steps use the Azure portal's
[ADR guided setup](../iot/device-registry/get-started-azure-device-registry.md#use-the-guided-setup).
To configure each service separately or use the Azure CLI, follow
[Connect services individually](../iot/device-registry/get-started-azure-device-registry.md#connect-services-individually).
For the documented CLI linking flow, connect DPS before the hub and configure
the required system-assigned managed identities and role assignments.

## Enable ADR on an existing Standard hub

1. In the Azure portal, open **Azure Device Registry** > **Get started** and select
   **Start setup**. To use an existing namespace, open its **Get started** tab.
1. On **ADR namespace**, choose the namespace and confirm its subscription,
   resource group, and region. Select the region that contains the existing
   resources. When you start from an existing namespace, these values are fixed.
1. On **Connectivity**, select **Use existing resources**. Choose **Existing DPS
   linked to IoT Hub instances** or **Existing IoT Hub instances**, as appropriate.
   Under **Choose a linked setup**, select the resources you want.
1. On **Capabilities**, choose whether to enable certificate management. Review
   [Configure optional certificate management](#configure-optional-certificate-management)
   before continuing.
1. On **Review + create**, inspect the impact summary, existing and new resources,
   and selected capabilities. Confirm that the setup uses the intended hub and
   DPS configuration, and review the permanent-link warning.
1. Select **Submit** and monitor setup progress. When the namespace opens, review
   its **Connected Services** tab for the intended hub and DPS resources.
1. Complete [Verify the result](#verify-the-result) before resuming normal
   management operations or extending the rollout.

> [!NOTE]
> The documented guided picker shows only hubs in the namespace's region with
> public network access enabled. If your hub isn't listed, check its eligibility
> and network configuration. Don't enable public access solely to make the hub
> appear; confirm a supported setup path for your network requirements.

ADR linking preserves the selected connection profile and doesn't automatically
replace device credentials.

<!-- REVIEW BLOCKER: Validate the GA guided setup, including region/network
eligibility, exact portal controls, service-link results, and effects on existing
management applications. Canonical ADR setup/shared includes outside this PR's
IoT Hub tree still contain earlier preview/pricing guidance and need alignment. -->

## Create a new ADR-enabled hub

For a new Standard hub that uses the classic connection profile, follow these steps:

1. In the Azure portal, open **Azure Device Registry > Get started** and select
   **Start setup**, or start from an existing namespace's **Get started** tab.
1. On **ADR namespace**, create or select a namespace. Confirm the subscription,
   resource group, and supported region for the deployment.
1. On **Connectivity**, select **Create new resources**. Choose a deployment
   preset and review the proposed Standard hub configuration and DPS resources.
   Adjust the configuration to your workload rather than treating a preset as a
   capacity guarantee.
1. On **Capabilities**, choose whether to enable certificate management. Review
   [Configure optional certificate management](#configure-optional-certificate-management)
   before continuing.
1. On **Review + create**, confirm the resource names, hub count, SKUs, capacity,
   location, and enabled capabilities. Review the pricing of the selected
   services before submitting.
1. Select **Submit** and monitor setup progress. When the namespace opens, review
   its **Connected Services** tab for the new hub and DPS resources.
1. Complete [Verify the result](#verify-the-result), including a test device
   connection and telemetry delivery.

For a new MQTT v5 hub, follow [MQTT v5 cloud setup](mqtt-v5-cloud-setup.md) for that
profile's resource, routing, and certificate requirements.

## Configure optional certificate management

Choose the certificate management option on **Capabilities** before submitting
either guided setup path. The current guided setup enables **Certificate
management** by default, so review the selection even when you're only planning
to link resources.

- **ADR without managed certificate issuance:** Turn off **Certificate
  management** for this setup. Devices continue to use authentication supported
  by their hub's connection profile.
- **ADR with managed certificate issuance:** Keep **Certificate management**
  enabled and review the certificate authority configuration. The default uses
  a Microsoft-issued root certificate authority. For other CA arrangements, see
  [Certificate authorities in Azure Device Registry](../iot/concept-managed-ca-hierarchy.md).

Certificate management through IoT Hub is generally available for Standard hubs
except those using the MQTT v5 connection profile.

After setup, verify the issuing CA and certificate policy, configure the DPS
enrollment to reference the issuance configuration, and prepare the device to
submit a certificate signing request. An onboarding credential authenticates
the device to DPS; the resulting operational certificate authenticates it to
IoT Hub. Enabling the capability doesn't automatically replace credentials on
existing devices.

Use the detailed guidance to complete and test the device lifecycle:

- [Certificate management concepts](../iot/iot-certificate-management-concepts.md)
- [Certificate issuance](../iot/concept-certificate-issuance.md)
- [Certificate renewal](../iot/concept-certificate-renewal.md)

MQTT v5 devices obtain and renew operational certificates through DPS, not
directly through the hub. Follow the profile's
[DPS certificate issuance and renewal guidance](mqtt-v5-device-setup.md#operational-certificate-management);
those flows are unchanged.

<!-- REVIEW BLOCKER: Verify the GA certificate management default and selection
controls, resources and policy created by guided setup, and the ADR-only setup path. -->

## Verify the result

Validate both the resource links and the device workload:

| Check | Expected result |
| --- | --- |
| Resource setup | The setup completes without unresolved errors, and the intended hub and DPS resources appear under the namespace's **Connected Services**. |
| Identities and permissions | The configured service identities have the role assignments required by the setup instructions. |
| Device-management applications | The identity and management operations your applications depend on work with the linked resources. |
| Device connectivity | A known device authenticates and connects to the intended hub using the selected onboarding and credential flow. |
| Certificate issuance, if enabled | A test device obtains an operational certificate through DPS and uses it to authenticate to the hub. |
| Telemetry delivery | A uniquely identified test message reaches the configured destination and is received by the consuming application. |

For an existing deployment, compare the tested management and device operations
with their pre-link behavior. For a new deployment, complete these checks before
onboarding the rest of the fleet.

If a check fails, capture the affected resource ID, operation, UTC time, and
redacted error details. Investigate the failed step before continuing the rollout;
a successful namespace deployment alone doesn't establish device connectivity
or message delivery. See [IoT support and help](../iot/iot-support-help.md) if you
need assistance.

## Next steps

- [Understand ADR integration](iot-hub-device-registry-overview.md)
- [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md)
- [Review frequently asked questions](iot-hub-faq.md)
