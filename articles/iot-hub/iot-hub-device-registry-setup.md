---
title: Enable Azure Device Registry integration for IoT Hub
titleSuffix: Azure IoT Hub
description: Link a new or existing eligible Standard IoT hub to Azure Device Registry and plan optional certificate management.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/07/2026
---

# Enable Azure Device Registry integration for IoT Hub

Azure Device Registry (ADR) linking is generally available for Standard hubs.
You can use a new hub or enable ADR on an eligible existing Standard hub.
Creating a replacement hub isn't required just to enable ADR integration.

Certificate management through Standard IoT Hub is also generally available,
except for hubs with the MQTT v5 connection profile. MQTT v5 devices retain
their supported DPS operational certificate issuance and renewal flows.

## Prerequisites

- An Azure subscription and permission to configure the selected resources.
- Permission to create the required role assignments at the applicable scopes.
- An eligible Standard IoT hub, or permission to create one.
- An ADR namespace and DPS configuration appropriate to your onboarding flow.
- Compatible region and resource configurations. Review the current
  [ADR prerequisites](../iot/device-registry/get-started-azure-device-registry.md#prerequisites)
  before selecting existing resources.

> [!WARNING]
> Connecting an existing IoT Hub or DPS instance to an ADR namespace is permanent
> and can't be reversed. Review the portal's eligibility and impact messages
> before confirming. Plan for the effect on management applications; don't
> assume an unlink operation can roll back the change.

## Choose a deployment method

Use the [ADR guided setup](../iot/device-registry/get-started-azure-device-registry.md#use-the-guided-setup)
to select new or existing resources, or
[connect services individually](../iot/device-registry/get-started-azure-device-registry.md#connect-services-individually).
These instructions include portal and CLI paths and the required service identities
and permissions.

Use the path for the resources you already have. Don't run a new-environment
creation script against an existing hub as a substitute for linking it.

## Enable ADR on an existing Standard hub

1. Record the hub, subscription, resource group, location and existing provisioning
   configuration. Identify the device-management applications that use it.
1. Open the ADR guided setup from **Azure Device Registry > Get started**, or from
   **Get started** on an existing namespace.
1. Choose the appropriate namespace and the **Use existing resources** path.
   Select the eligible DPS/IoT Hub resources for your scenario.
1. Review the required identities, role assignments, resource eligibility and
   permanent-link confirmation before submitting.
1. Follow the setup's progress and verify the link results for each service.
   A namespace deployment alone doesn't prove that its service links succeeded.
1. Test the device and management operations your application requires before
   completing the rollout.

The [guided setup](../iot/device-registry/get-started-azure-device-registry.md)
is the authority for the current selection sequence and eligibility checks.
Do not delete or recreate resources to bypass a failed eligibility check.

ADR linking doesn't select a different connection profile or automatically
replace existing device credentials. Configure certificate issuance and lifecycle
management separately when your solution requires them.

<!-- REVIEW BLOCKER: Validate the GA existing-hub workflow and its impact on
existing device-management applications. Canonical ADR setup/shared includes
outside this PR's IoT Hub tree still contain earlier preview guidance. -->

## Create a new ADR-enabled hub

Use the same guided setup and choose **Create new resources**, or follow the
individual-service setup instructions. Select the connection profile required by
your devices rather than treating ADR linking as a protocol upgrade.

For MQTT v5, use the dedicated [cloud setup](mqtt-v5-cloud-setup.md). This article
doesn't change that profile's existing DPS onboarding and certificate flows.

## Configure optional certificate management

An onboarding credential authenticates the device to DPS. An operational
certificate authenticates the provisioned device to IoT Hub. ADR linking alone
doesn't create a certificate policy, enroll a device, or replace its credentials.

Follow the applicable guidance:

- [Certificate management concepts](../iot/iot-certificate-management-concepts.md)
- [Certificate issuance](../iot/concept-certificate-issuance.md)
- [Certificate renewal](../iot/concept-certificate-renewal.md)

Management directly through the hub isn't supported for MQTT v5-profile hubs.
For that profile, use its existing
[DPS certificate issuance and renewal guidance](mqtt-v5-tls-requirements.md#operational-certificate-management).

## Verify the result

Verify the namespace association and successful service-link state for the
intended resources. Confirm that the relevant management identity has the
required permissions.

Test a known device and inspect its identity, provisioning result where applicable,
hub connection, and message delivery. Don't equate a successful control-plane
deployment with successful device authentication or destination receipt.

Review the configured resources and ongoing costs. Don't delete an existing
production hub or namespace as sample cleanup.

## Next steps

- [Understand ADR integration](iot-hub-device-registry-overview.md)
- [Prepare telemetry for agents and analytics](iot-hub-agent-ready-data.md)
- [Review frequently asked questions](iot-hub-faq.md)
