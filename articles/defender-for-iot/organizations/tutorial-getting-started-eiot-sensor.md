---
title: Get started with Enterprise IoT - Microsoft Defender for IoT
description: In this tutorial, you'll learn how to onboard to Microsoft Defender for IoT with an Enterprise IoT deployment
ms.topic: tutorial
ms.date: 07/11/2022
ms.custom: template-tutorial
---

# Tutorial: Get started with Enterprise IoT monitoring

This tutorial describes how to get started with your Enterprise IoT monitoring deployment with Microsoft Defender for IoT.

Defender for IoT supports the entire breadth of IoT devices in your environment, including everything from corporate printers and cameras, to purpose-built, proprietary, and unique devices.

In this tutorial, you learn about:

> [!div class="checklist"]
> * Integration with Microsoft Defender for Endpoint
> * Prerequisites for Enterprise IoT network monitoring with Defender for IoT
> * How to prepare a physical appliance or VM as a network sensor
> * How to onboard an Enterprise IoT sensor and install software
> * How to view detected Enterprise IoT devices in the Azure portal
> * How to view devices, alerts, vulnerabilities, and recommendations in Defender for Endpoint

## Microsoft Defender for Endpoint integration

Defender for IoT integrates with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to extend your security analytics capabilities, providing complete coverage across your Enterprise IoT devices. Defender for Endpoint analytics features include alerts, vulnerabilities, and recommendations for your enterprise devices.

Microsoft 365 P2 customers can onboard a plan for Enterprise IoT through the Microsoft Defender for Endpoint portal. After you've onboarded a plan for Enterprise IoT, view discovered IoT devices and related alerts, vulnerabilities, and recommendations in Defender for Endpoint.

Microsoft 365 P2 customers can also install the Enterprise IoT network sensor (currently in **Public Preview**) to gain more visibility into additional IoT segments of the corporate network that were not previously covered by Defender for Endpoint. Deploying a network sensor is not a prerequisite for onboarding Enterprise IoT.

For more information, see [Onboard with Microsoft Defender for IoT in Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

> [!IMPORTANT]
> The **Enterprise IoT network sensor** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before starting this tutorial, make sure that you have the following prerequisites.

### Azure subscription prerequisites

- Make sure that you've added a Defender for IoT plan for Enterprise IoT networks to your Azure subscription from Microsoft Defender for Endpoint.
For more information, see [Onboard with Microsoft Defender for IoT](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

- Make sure that you can access the Azure portal as a **Security admin**, subscription **Contributor**, or subscription **Owner** user. For more information, see [Required permissions](getting-started.md#permissions).






## Next steps

Continue viewing device data in both the Azure portal and Defender for Endpoint, depending on your organization's needs.

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)
- [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md)
- [View and manage alerts on the Defender for IoT portal](how-to-manage-cloud-alerts.md)
- [Use Azure Monitor workbooks in Microsoft Defender for IoT (Public preview)](workbooks.md)
- [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md)
- [Enterprise IoT networks frequently asked questions](faqs-eiot.md)

In Defender for Endpoint, also view alerts data, recommendations and vulnerabilities related to your network traffic.

For more information in the Defender for Endpoint documentation, see:

- [Onboard with Microsoft Defender for IoT in Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration)
- [Defender for Endpoint device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)
- [Alerts in Defender for Endpoint](/microsoft-365/security/defender-endpoint/alerts-queue)
- [Security recommendations in Defender for Endpoint](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Defender for Endpoint: Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)