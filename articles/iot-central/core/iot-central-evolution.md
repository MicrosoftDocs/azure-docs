---
title: Azure IoT Central is evolving
titleSuffix: Azure IoT Central
description: Azure IoT Central is evolving to an architecture built on Azure IoT Hub, DPS, and Microsoft Fabric. Learn what's changing, review the key dates, and plan your transition.
author: jesusbar
ms.author: jesusbar
ms.service: azure-iot-central
ms.topic: concept-article
ms.date: 09/23/2026
ms.custom: iot-central-evolution
#customer intent: As an IoT Central customer, I want to understand how the platform is evolving and the recommended path so that I can plan my transition before September 20, 2029.
---

# Azure IoT Central is evolving

On September 23, 2026, Microsoft announced guidance that helps Azure IoT Central customers migrate their solutions to use new features of Azure IoT Hub and Microsoft Fabric. The new approach leverages IoT Hub capabilities such as certificate management, along with Microsoft Fabric capabilities such as the operations agent, to modernize connected solutions. Existing users can continue using their Azure IoT Central solution as-is until September 20, 2029 if they don't want to take advantage of these new features right away.

This change is a natural step in the ongoing evolution of Azure IoT. Microsoft continues to invest deeply in the platform services that power Azure connected solutions, building on core Azure constructs such as RBAC and ARM resource models, while integrating AI capabilities across Azure and Fabric. If you build on IoT Central today, this article explains what's changing and how to transition to a modern Azure IoT architecture.

## The next step in the evolution of Azure IoT

Azure IoT Central pioneered a managed application experience that made it easy to get started with IoT. Since then, Azure IoT has grown significantly. Azure IoT Hub and Device Provisioning Service (DPS) provide the foundation for secure, high-scale device connectivity and provisioning, while new investments add richer device lifecycle capabilities such as certificate management and deeper integration with Azure Device Registry. Azure Device Registry brings devices into the Azure management plane as ARM resources, enabling more consistent governance across connected environments.

These investments also align with Microsoft's broader vision for connected operations, where operational technology, enterprise data, analytics, and AI come together on a unified platform. As discussed in [our recent work on connected operations and industrial AI](https://techcommunity.microsoft.com/blog/iotblog/making-physical-ai-practical-for-real-world-industrial-operations-part-1/4509351), Azure IoT, Azure Device Registry, and Microsoft Fabric Real-Time Intelligence provide the foundation for connecting device telemetry with operational and business context. This foundation enables organizations to move beyond monitoring toward real-time intelligence, automation, and increasingly AI-powered operational experiences.

By concentrating investment on a unified, Azure-native platform rather than a fixed application experience, Microsoft can innovate faster and give you a more flexible and scalable foundation to build connected solutions tailored to your business needs.

## Key dates

- New Azure IoT Central application creation is unavailable starting September 23, 2026.
- Existing Azure IoT Central applications continue to work as-is through September 20, 2029.
- After September 20, 2029, Azure IoT Central applications are no longer available.

## The modern Azure IoT platform

The [recommended path](https://aka.ms/AzureIoTCentralMigrationPlaybook) is Azure IoT Hub with DPS and Microsoft Fabric, with Azure Device Registry where applicable. This path preserves the core device connectivity and provisioning you rely on today, and upgrades your analytics and dashboards to Microsoft Fabric Real-Time Intelligence. You can continue using your existing devices and data while benefiting from greater scalability, stronger lifecycle controls, and a modern real-time analytics experience.

The following table maps common IoT Central capabilities to their modern Azure-native targets:

| Capability today (IoT Central) | Modern Azure-native target |
|---|---|
| Device connectivity and messaging | Azure IoT Hub |
| Device onboarding and provisioning | Device Provisioning Service (DPS) |
| Device inventory and governance | Azure Device Registry (ADR) - in preview |
| Rules, automation, and integration | Message routing, Event Grid, Functions / Logic Apps, Fabric Activator |
| Dashboards and analytics | Microsoft Fabric Real-Time Intelligence, Power BI |

## Get started faster with the Fabric solution accelerator

To move your analytics forward quickly, start with the [Azure IoT Solution Accelerator Workload for Microsoft Fabric Real-Time Intelligence](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti). Instead of rebuilding dashboards and pipelines from scratch, the accelerator deploys a working, end-to-end Fabric Real-Time Intelligence workload on top of your IoT Hub telemetry - Eventstream ingestion, an Eventhouse/KQL database, and ready-to-use real-time dashboards - so you can see your device data flowing in minutes and can then tailor it to your solution.

## How to get started

You can start planning your transition today:

- Review your current IoT Central deployment, including device templates, device groups, jobs, rules, exports, dashboards, and users.
- Evaluate the Azure IoT Hub and DPS target architecture, and Azure Device Registry where applicable.
- Plan your migration in phases, keeping IoT Central available during the transition.
- Follow the customer migration playbook at [https://aka.ms/AzureIoTCentralMigrationPlaybook](https://aka.ms/AzureIoTCentralMigrationPlaybook), which maps common IoT Central scenarios to Azure IoT-native services.

## Migration playbook and resources

- [Migrate from IoT Central to an Azure-native IoT platform services architecture](howto-migrate-to-azure-native-iot.md) maps common IoT Central scenarios to the modern Azure IoT platform and shows how to use Microsoft Fabric as the data plane.
- [Migrate devices from Azure IoT Central to Azure IoT Hub](howto-migrate-to-iot-hub.md)
- [Microsoft Fabric Real-Time Intelligence overview](/fabric/real-time-intelligence/overview)
- [Azure IoT Solution Accelerator Workload for Microsoft Fabric Real-Time Intelligence (sample)](https://github.com/Azure-Samples/azure-iot-accelerator-workload-for-fabric-rti)
- [Azure IoT Hub documentation](/azure/iot-hub/)
- [Azure IoT Hub Device Provisioning Service documentation](/azure/iot-dps/)

## Migration partners

If you want extra help, experienced Microsoft partners can support discovery, migration planning, and execution. Both partners in the following list build on Azure IoT Hub, DPS, Azure Device Registry, and Microsoft Fabric:

- **Mesh Systems** builds on Azure IoT Hub and Azure IoT Operations to accelerate connected-product development and migration. Read their story: [How Mesh Systems builds on Azure IoT Hub](https://aka.ms/IoTPartners_Mesh).
- **Helin** delivers an Intelligent Edge Application Platform for industrial AI at the edge, built on Azure IoT Hub, DPS, Azure Device Registry, and Microsoft Fabric. Read their story: [Scaling industrial AI at the edge with Helin and Azure IoT](https://aka.ms/IoTPartners_Helin).

To discuss the right approach for your environment, contact your Microsoft account team.

## Our commitment

Microsoft is committed to helping you transition smoothly and to continuing our deep investment in Azure IoT. Thank you for building on Azure IoT - we look forward to supporting your move to a modern, Azure-native foundation for connected operations.

## Help and support

- Get answers from community experts in [Microsoft Q&A](https://aka.ms/azureqa).
- If you have a support plan and need technical help, create a support request in the Azure portal.
- Review the full guidance and recommended migration partners at [https://aka.ms/AzureIoTCentralEvolution](https://aka.ms/AzureIoTCentralEvolution).