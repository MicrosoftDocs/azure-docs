---
title: "Migrate from IoT Central to an Azure-native IoT platform services architecture"
titleSuffix: Azure IoT Central
description: "Learn how to migrate your Azure IoT Central solution to an Azure-native IoT platform services architecture using IoT Hub, DPS, and Microsoft Fabric with this step-by-step playbook."
author: jesusbar
ms.author: jesusbar
ms.service: azure-iot-central
ms.topic: how-to
ms.date: 09/14/2026
ms.custom: iot-central-migration
#customer intent: As an IoT Central customer, I want a step-by-step playbook so that I can move my solution to an Azure-native platform services architecture while keeping my devices online.
---

# Migrate from IoT Central to an Azure-native IoT platform services architecture

Azure IoT Central provides a fully managed application experience. Azure IoT Hub and DPS provide the foundational services to build an Azure-native IoT platform tailored to your connectivity, provisioning, and analytics requirements. Moving to this architecture gives you greater control and flexibility, enabling deeper customization, richer integrations, and advanced real-time analytics and dashboard experiences with Microsoft Fabric.

This article serves as a migration playbook for moving from IoT Central to an Azure-native IoT platform services architecture. It outlines proven patterns and guidance to help you maintain operational continuity, achieve feature parity for core scenarios, and modernize your analytics and dashboard experience with Microsoft Fabric. The result is a more flexible and extensible platform that can evolve with your business needs.

## Start here: accelerate your analytics with the Fabric solution accelerator

The fastest way to set up the target analytics experience is the **[Azure IoT Solution Accelerator Workload for Microsoft Fabric Real-Time Intelligence](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti)**. Rather than rebuilding dashboards and data pipelines from scratch, the accelerator deploys a working, end-to-end Fabric Real-Time Intelligence workload on top of your IoT Hub telemetry - Eventstream ingestion, an Eventhouse/KQL database, and ready-to-use real-time dashboards - so you can see your device data flowing in minutes and then tailor it to your solution.

**What the accelerator gives you:**

- A one-stop, deployable **Fabric Real-Time Intelligence** workload wired to Azure IoT Hub.
- **Eventstream** ingestion of device telemetry into Fabric with no custom plumbing.
- An **Eventhouse / KQL database** for low-latency queries over live and historical device data.
- Prebuilt **Real-Time Dashboards** you can clone and adapt to your fleet.
- A repeatable pattern you can extend for alerting, Power BI reporting, and OneLake history.

> [!TIP]
> Begin your migration analytics workstream with the accelerator. Deploy it against a test IoT Hub first, confirm telemetry is flowing into the Real-Time Dashboard, then point it at your migration pilot cohort. This approach makes the analytics experience the *first* thing your team sees working - not the last.

:::image type="content" source="media/fabric-accelerator-workspace.png" alt-text="Screenshot of the Azure IoT solution accelerator deployed as a Microsoft Fabric Real-Time Intelligence workspace, showing the Eventstream, Eventhouse, and dashboard items.":::
*Screenshot of the Fabric solution accelerator deploys a complete Real-Time Intelligence workspace for Azure IoT data.*


:::image type="content" source="media/fabric-telemetry-dashboard.png" alt-text="Screenshot of a Microsoft Fabric Real-Time dashboard showing live device telemetry ingested from Azure IoT Hub.":::
*Screenshot of a Azure IoT Hub ingesting telemetry and builds dashboards into Fabric with no custom code.*

## Why move from IoT Central to an Azure-native IoT platform services architecture

You usually migrate because you need one or more of the following: deeper customization, more explicit control over identity and provisioning, richer integration patterns, custom user experiences, and a modern real-time analytics stack with Microsoft Fabric.

- **What stays in the control plane**: Device identity, provisioning, telemetry ingress, routing, twin-based state management, and cloud-to-device operations are handled by IoT Hub and DPS.
- **What gets better**: Analytics, dashboards, and data experiences move to **Microsoft Fabric Real-Time Intelligence**, giving you real-time streaming, KQL, alerting, and Power BI reporting that exceed IoT Central's built-in analytics.
- **What you tailor**: You build device administration views and business-application integrations to fit your operation, using Azure-native services and the Fabric accelerator as a starting point.

In an Azure-native IoT platform services architecture:

- IoT Hub provides secure, bidirectional communication with devices.
- DPS enables scalable and secure device onboarding.
- **Microsoft Fabric** provides real-time analytics, dashboards, and downstream data experiences - bootstrapped by the solution accelerator above.

## Capability parity and target-state architecture

The following table maps each IoT Central capability to its Azure-native target. For the analytics and dashboard experience, Microsoft Fabric provides a modern equivalent that goes beyond IoT Central's built-in features.

| IoT Central capability | Azure-native target | Customer guidance |
|---|---|---|
| Device identity / registry | IoT Hub identities + DPS enrollments | Preserve device IDs and choose the authentication model that best fits the fleet. |
| Device templates and models | IoT Plug and Play (DTDL) + application metadata | Templates become a strong starting point for the model catalog used by the new solution. |
| Cloud properties | Twin desired properties + tags + app metadata | Separate device-visible state from service-side metadata in a clean, scalable way. |
| Commands | Direct methods and/or desired properties | Use direct methods for immediate online actions and desired properties for durable state changes. |
| Jobs / bulk operations | IoT Hub jobs | Recreate high-value fleet actions such as bulk property updates and method invocation. |
| Rules and automation | Message routing + Event Grid + Functions / Logic Apps, or Fabric Activator | Central rules map naturally into event-driven workflows; Fabric Activator adds no-code alerting on live streams. |
| Data export | IoT Hub routes + Fabric Eventstream | Stream directly into Fabric for real-time processing and storage. |
| Dashboards and analytics | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse/KQL, Real-Time Dashboards, Power BI) | The Fabric solution accelerator delivers this end-to-end. Real-time dashboards, KQL analytics, and Power BI reporting exceed IoT Central's built-in charts. |
| Device administration UX | Custom portal or internal operations tooling | Start with an MVP operations experience and evolve it over time. |
| Monitoring and alerting | Azure Monitor + Event Grid + Log Analytics, or Fabric Activator | Flexible observability from day one, plus stream-based alerting in Fabric. |
| Device updates | Device Update for IoT Hub (if applicable) | If updates are in scope, plan them as part of the broader lifecycle strategy. |

### Fabric analytics parity at a glance

| IoT Central built-in experience | Microsoft Fabric alternative (via the accelerator) |
|---|---|
| Built-in telemetry charts | **Real-Time Dashboards** over live device streams |
| Data export to downstream stores | **Eventstream** ingestion into Fabric + OneLake |
| Analytics / queries in the app | **Eventhouse / KQL** ad-hoc and scheduled analytics |
| Rules and alerts | **Fabric Activator** no-code alerting |
| Reporting | **Power BI** on curated Fabric data |

### Recommended target-state architecture

- **Connectivity and provisioning**: Devices connect through IoT Hub and use DPS for fleet onboarding and reprovisioning scenarios.
- **Device state and remote operations**: Use twins for state synchronization and direct methods for online request/response operations.
- **Analytics and visualization**: Use **Microsoft Fabric Real-Time Intelligence** - Eventstream, Eventhouse/KQL, Real-Time Dashboards, and Power BI. Start from the [Fabric solution accelerator](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti).
- **Operations and support**: Use Azure Monitor, Event Grid, and your chosen admin tools to keep the experience simple for operators and support teams.

## Migrate your devices

Once your target IoT Hub, DPS, and Fabric analytics are ready, move devices using the path that fits your fleet's firmware capabilities. There are three options, in order of simplicity:

- **Devices implement the `DeviceMove` command → use the IoTC Migrator tool.** If your devices implement the `DeviceMove` command, you can use the [IoTC Migrator tool](https://github.com/Azure/iotc-migrator) to move them from IoT Central to your own IoT Hub using DPS-based reprovisioning with a new DPS ID scope. This is the simplest, phased path. See [Migrate devices to Azure IoT Hub](howto-migrate-to-iot-hub.md) for the tool details.
- **Devices don't implement `DeviceMove` → send a firmware update.** If your devices can't receive `DeviceMove`, deploy a firmware update that points them to the **new DPS ID scope** of your target DPS, so they reprovision to your IoT Hub.
- **Firmware can't change the DPS ID scope → contact Microsoft Support.** If you can't change the DPS ID scope on the device (for example, it's hard-coded and can't be updated), **contact [Microsoft Support](/azure/azure-portal/supportability/how-to-create-azure-support-request)** to evaluate a backend ID-scope swap so devices can reprovision without a firmware change. This is reviewed case by case.

> [!NOTE]
> Whichever path you choose, keep IoT Central live during the transition and migrate in manageable waves so you can validate each cohort and roll back if needed.

## Migration phases

| Phase | Goal |
|---|---|
| 1. Assessment and planning | Inventory the current solution and define requirements |
| 2. Stand up target platform + Fabric analytics | Deploy IoT Hub, DPS, and the Fabric accelerator |
| 3. Prototype and test | Validate the architecture with a pilot environment |
| 4. Staggered device migration in waves | Move devices in controlled batches |
| 5. Capability replacement | Bring dashboards, rules, and tools fully online |
| 6. Validation, decommission, and cleanup | Transition production workloads and clean up old IoT Central workloads |

### Phase 1: Assessment and planning

Begin by agreeing on the customer experience you want to preserve on day one and the improvements you want to introduce over time.

- Identify the user journeys that matter most, such as onboarding, command invocation, fleet visibility, and troubleshooting.
- Inventory the IoT Central templates, devices, groups, jobs, exports, dashboards, and roles.
- **Map capabilities**: Identify native versus custom requirements in IoT Hub, DPS, and Fabric.
- **Define success criteria**: Performance, latency, throughput, and user experience.

**Related content:**

- [Migrate devices to Azure IoT Hub](howto-migrate-to-iot-hub.md)
- [Understand and use device twins in IoT Hub](/azure/iot-hub/iot-hub-devguide-device-twins)

### Phase 2: Stand up the target platform and Fabric analytics

Provision the target platform, and light up the analytics experience early using the accelerator so your team sees value from day one.

1. Choose the IoT Hub and DPS topology that best fits scale, geography, and customer structure.
1. Provision IoT Hub, DPS, routes, and monitoring in a nonproduction environment first.
1. **Deploy the [Fabric solution accelerator](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti)** against the test IoT Hub and confirm telemetry flows into the Real-Time Dashboard.
- Set up a data path that lets the current and new telemetry streams be viewed side by side during the transition.

**Related content:**

- [Create an IoT hub using the Azure portal](/azure/iot-hub/iot-hub-create-through-portal)
- [Quickstart: Set up the Device Provisioning Service in the portal](/azure/iot-dps/quick-setup-auto-provision)
- [How to manage linked IoT hubs with DPS](/azure/iot-dps/how-to-manage-linked-iot-hubs)
- [Add Azure IoT Hub as a source in Real-Time hub](/fabric/real-time-hub/add-source-azure-iot-hub)
- [Eventstreams overview in Fabric Real-Time Intelligence](/fabric/real-time-intelligence/event-streams/overview)

### Phase 3: Prototype and test

#### Map models, properties, and commands

1. Translate device templates into DTDL-friendly models and application contracts.
1. Map commands into direct methods or desired properties depending on the intended customer experience.
1. Validate model IDs, desired/reported property paths, and command payloads with representative devices.

#### Validate with a pilot wave before full migration

1. Pick a pilot cohort that's representative enough to build confidence and still easy to manage.
1. Validate provisioning, reconnect behavior, telemetry flow, state synchronization, and remote operations.
1. Confirm that the Fabric dashboards and reports show the pilot devices clearly.
1. Run performance and load testing to simulate real usage.

**Related content:**

- [Quickstart: Send telemetry to Azure IoT Hub (CLI)](/azure/iot-hub/quickstart-send-telemetry-cli)
- [Understand Azure IoT Hub quotas and throttling](/azure/iot-hub/iot-hub-devguide-quotas-throttling)

### Phase 4: Staggered device migration in waves

Production migration is simplest when the cutover steps are familiar and the team knows what to check after each wave. Use the device migration path that fits your fleet (see [Migrating your devices](#migrate-your-devices)).

1. Use manageable waves that fit customer support coverage and business timing.
1. Keep IoT Central available during the transition so teams can validate with confidence.
1. After each wave, confirm connectivity, telemetry, and twin synchronization, and that the Fabric dashboards reflect the migrated cohort.

**Related content:**

- [Migrate devices to Azure IoT Hub](howto-migrate-to-iot-hub.md)
- [IoT Hub Device Provisioning Service terminology](/azure/iot-dps/concepts-service)

### Phase 5: Capability replacement

Bring the day-to-day experiences fully online alongside the migrated devices.

1. Adapt the accelerator's Real-Time Dashboards to your operators' needs.
1. Recreate rules and alerts by using Fabric Activator or Event Grid with Functions or Logic Apps.
1. Shift recurring reports and workflows to Fabric and Power BI as users become comfortable.

**Related content:**

- [Azure IoT Hub and Event Grid](/azure/iot-hub/iot-hub-event-grid)
- [Add Azure IoT Hub as a source in Real-Time hub](/fabric/real-time-hub/add-source-azure-iot-hub)
- [Azure IoT Solution Accelerator Workload for Microsoft Fabric Real-Time Intelligence (sample)](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti)

### Phase 6: Validation, decommission, and cleanup

1. Confirm all in-scope cohorts are operating on IoT Hub and DPS and are visible in the Fabric dashboards and support tools.
1. Remove migrated devices from IoT Central when you're ready, to avoid ongoing device-based billing.
1. Disable or retire older exports, jobs, and integrations that you no longer need.
1. Delete the IoT Central application after all devices and operations are confirmed running smoothly and a rollback isn't needed.

## Recommended step-by-step customer execution checklist

1. Confirm the migration scope and choose the device families for the first wave.
1. Capture the current IoT Central templates, devices, groups, jobs, exports, dashboards, and roles.
1. Deploy IoT Hub, DPS, and the **Fabric solution accelerator** in a nonproduction environment; confirm telemetry reaches the Real-Time Dashboard.
1. For each template, map telemetry, commands, writable properties, cloud properties, and operator views into the new design.
1. Choose the device migration path per fleet: `DeviceMove` + IoTC Migrator, firmware update to a new DPS ID scope, or [contact Microsoft support](/azure/azure-portal/supportability/how-to-create-azure-support-request) for an ID-scope swap.
1. Set up a parallel data path so you can view IoT Central exports and IoT Hub telemetry side by side during the move.
1. Run a representative pilot cohort and confirm telemetry, provisioning, command behavior, and dashboards.
1. Define production migration waves with clear timing and support coverage; move devices in waves and validate after each one.
1. Bring the Fabric dashboards, support tools, and admin experiences fully online before broad day-two reliance.
1. Once the move is complete, remove migrated devices from IoT Central and clean up older integrations.

## Fabric landing pattern (reference)

If you build the analytics path manually instead of using the accelerator:

1. Create an Eventstream in Fabric Real-Time Intelligence.
1. Add Azure IoT Hub as the Eventstream source and choose the right data format.
1. Route the stream into a KQL database / Eventhouse for low-latency analytics and dashboards.
1. Build Power BI or real-time dashboards over the curated stream.
1. Land longer-term history in OneLake or storage for a broader analytics foundation.

> [!TIP]
> The [Fabric solution accelerator](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti) performs these steps for you and gives you a working dashboard to start from.

## Validation, transition flexibility, and wrap-up

### Validation checklist

1. Provisioning succeeds for the pilot or migrated wave.
1. Devices reconnect to the assigned IoT hub and report expected state.
1. Telemetry volume and schema match expectations for the wave.
1. Fabric dashboards, alerts, and support views show the migrated devices clearly.

### Transition flexibility during migration (rollback strategy)

Keeping IoT Central live during the transition gives you a safety net while you validate the new path in phases.

> [!WARNING]
> If you contacted Microsoft Support to reuse the IoT Central ID scope on your DPS, a rollback requires undoing that change, and all devices reprovision back to IoT Central. Contact [Microsoft Support](/azure/azure-portal/supportability/how-to-create-azure-support-request)  if you used the same ID scope and need to roll back.

- Use manageable waves so validation stays simple.
- Give support teams a clear view of which devices have already moved and which remain on the current path.

### Wrap-up checklist

1. Confirm all in-scope cohorts are operating on IoT Hub, DPS, and Fabric.
1. Remove migrated devices from IoT Central when you're ready.
1. Archive migration notes, mappings, and operational documentation in your chosen repository.
1. When ready, delete IoT Central applications to avoid ongoing device-based billing.

## Related content

- [Azure IoT Solution Accelerator Workload for Microsoft Fabric Real-Time Intelligence (sample)](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti)
- [Microsoft Fabric Real-Time Intelligence overview](/fabric/real-time-intelligence/overview)
- [Add Azure IoT Hub as a source in Real-Time hub](/fabric/real-time-hub/add-source-azure-iot-hub)
- [Migrate devices to Azure IoT Hub](howto-migrate-to-iot-hub.md)
- [Azure IoT Hub documentation](/azure/iot-hub/)
- [Azure IoT Hub Device Provisioning Service documentation](/azure/iot-dps/)
- [IoT Hub device reprovisioning concepts](/azure/iot-dps/concepts-device-reprovision)
- [Understand and use device twins in IoT Hub](/azure/iot-hub/iot-hub-devguide-device-twins)
- [Understand and invoke direct methods from IoT Hub](/azure/iot-hub/iot-hub-devguide-direct-methods)