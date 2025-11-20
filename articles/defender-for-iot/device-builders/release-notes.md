---
title: What's new in Microsoft Defender for IoT for device builders
description: Learn about the latest updates for Defender for IoT device builders.
ms.topic: conceptual
ms.date: 10/05/2025
---

# What's new in Microsoft Defender for IoT for device builders


This article lists new features and feature enhancements in Microsoft Defender for IoT for device builders.

Noted features are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For more information, see [Upgrade the Microsoft Defender for IoT micro agent](upgrade-micro-agent.md).

## November 2024

The firmware analysis documentation is now located and maintained as part of the Azure documentation. See the full [firmware analysis documentation](/azure/firmware-analysis/overview-firmware-analysis).

## August 2024

Defender for IoT plans to retire the micro agent on August 1, 2025.

## March 2024

**Updates to Defender for IoT Firmware Analysis:**

- **Azure CLI and PowerShell commands**: Automate your workflow of analyzing firmware images by using the [Firmware Analysis Azure CLI](/cli/azure/service-page/firmware%20analysis) or the [Firmware Analysis PowerShell commands](/powershell/module/az.firmwareanalysis).
- **User choice in resource group**: Pick your own resource group or create a new resource group to use Defender for IoT Firmware Analysis during the onboarding process.

    :::image type="content" source="media/whats-new-firmware-analysis/pick-resource-group.png" alt-text="Screenshot that shows resource group picker while onboarding." lightbox="media/whats-new-firmware-analysis/pick-resource-group.png":::

- **New UI format with Firmware inventory**: Subtabs to organize Getting started, Subscription management, and Firmware inventory.

    :::image type="content" source="media/whats-new-firmware-analysis/firmware-inventory-tab.png" alt-text="Screenshot that shows the firmware inventory in the new UI." lightbox="media/whats-new-firmware-analysis/firmware-inventory-tab.png":::

- **Enhanced documentation**: Updates to [Tutorial: Analyze an IoT/OT firmware image](../../../articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md) documentation addressing the new onboarding experience.

## January 2024

**Updates to Defender for IoT Firmware Analysis since public preview in July 2023:**

- **PDF report generator**: Addition of a **Download as PDF** capability on the **Overview page** that generates and downloads a PDF report of the firmware analysis results.

    :::image type="content" source="media/whats-new-firmware-analysis/overview-PDF-download.png" alt-text="Screenshot that shows the new Download as PDF button." lightbox="media/whats-new-firmware-analysis/overview-PDF-download.png":::

- **Reduced analysis time**: Analysis time has been shortened by 30-80%, depending on image size.

- **CODESYS libraries detection**: Defender for IoT Firmware Analysis now detects the use of CODESYS libraries, which Microsoft recently identified as having high-severity vulnerabilities. These vulnerabilities can be exploited for attacks such as remote code execution (RCE) or denial of service (DoS). For more information, see [Multiple high severity vulnerabilities in CODESYS V3 SDK could lead to RCE or DoS](https://www.microsoft.com/en-us/security/blog/2023/08/10/multiple-high-severity-vulnerabilities-in-codesys-v3-sdk-could-lead-to-rce-or-dos/).

- **Enhanced documentation**: Addition of documentation addressing the following concepts:
    - [Azure role-based access control for Defender for IoT Firmware Analysis](defender-iot-firmware-analysis-rbac.md), which explains roles and permissions needed to upload firmware images and share analysis results, and an explanation of how the **FirmwareAnalysisRG** resource group works
    - [Frequently asked questions](defender-iot-firmware-analysis-FAQ.md)

- **Improved filtering for each report**: Each subtab report now includes more fine-grained filtering capabilities.

- **Firmware metadata**: Addition of a collapsible tab with firmware metadata that is available on each page.

    :::image type="content" source="media/whats-new-firmware-analysis/overview-firmware-metadata.png" alt-text="Screenshot that shows the new metadata tab in the Overview page." lightbox="media/whats-new-firmware-analysis/overview-firmware-metadata.png":::

- **Improved version detection**: Improved version detection of the following libraries:
    - pcre
    - pcre2
    - net-tools
    - zebra
    - dropbear
    - bluetoothd
    - WolfSSL
    - sqlite3

- **Added support for file systems**: Defender for IoT Firmware Analysis now supports extraction of the following file systems. For more information, see [Firmware Analysis FAQs](defender-iot-firmware-analysis-faq.md#what-types-of-firmware-images-does-defender-for-iot-firmware-analysis-support):
    - ISO
    - RomFS
    - Zstandard and non-standard LZMA implementations of SquashFS


## July 2023

**Firmware Analysis public preview announcement**

Microsoft Defender for IoT Firmware Analysis is now available in public preview. Defender for IoT can analyze your device firmware for common weaknesses and vulnerabilities, and provide insight into your firmware security. This analysis is useful whether you build the firmware in-house or receive firmware from your supply chain. 

For more information, see [Firmware analysis for device builders](overview-firmware-analysis.md).

:::image type="content" source="media/whats-new-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image." lightbox="media/whats-new-firmware-analysis/overview.png":::

## December 2022

**Version 4.6.2**:

When upgrading the micro agent from version 4.2.* to 4.6.2, you would first need to remove the package and then reinstall it. For more information, see [Upgrade the Microsoft Defender for IoT micro agent](upgrade-micro-agent.md).

- **Peripheral collector**: Addition of a new collector that detects physical plugins of devices. For more information, see [Micro agent event collection - Peripheral events](concept-event-aggregation.md).

- **File system collector**: Addition of a new collector that monitors specified file systems. For more information, see [Micro agent event collection - File system events](concept-event-aggregation.md).

- **Statistics collector**: Addition of a new collector that reports for each collection cycle, data regarding the different collectors in the agent. For more information, see [Micro agent event collection - Statistics events](concept-event-aggregation.md).

- **System information collector**: System information collector now collects the agent type (Edge/Standalone) and version. For more information, see [Micro agent event collection - System information events](concept-event-aggregation.md).

- **New alerts**: Now supporting new peripheral and file system alerts. For more information, see [Micro agent security alerts](concept-agent-based-security-alerts.md).

- **DMI decode alternative**: Now supporting new alternative to report device information in case device does not support DMI decoder. For more information, see [How to configure DMI decoder](how-to-configure-dmi-decoder.md).

- **Firmware information**: Now supporting device firmware vendor and version collected using DMI decoder or its alternative. For more information, see [How to configure DMI decoder](how-to-configure-dmi-decoder.md).

- **Device Provisioning Service support**: Now you can use DPS to provision your micro agent and devices at scale. For more information, see [How to provision the micro agent using DPS](how-to-provision-micro-agent.md).

- **AMQP protocol over web socket protocol support**: Now supporting AMQP over web socket protocol that can be added after installing your micro agent. For more information, see [Add AMQP over websocket protocol support](tutorial-standalone-agent-binary-installation.md#add-amqp-protocol-support).

- **SBoM collector bug fix**: Now supporting collection of all packages instead of first ingested 500. For more information, see [Micro agent event collection - SBoM events](concept-event-aggregation.md).

- **Debian 10 ARM 64 buster support**: Now supporting Debian 10 ARM 64 devices. For more information, see [Agent portfolio overview and OS support](concept-agent-portfolio-overview-os-support.md).

- **22.04 Ubuntu support**: Now supporting Ubuntu 22.04 devices. For more information, see [Agent portfolio overview and OS support](concept-agent-portfolio-overview-os-support.md).


## Next steps

- [Onboard to Defender for IoT](quickstart-onboard-iot-hub.md)
- [Upgrade the Microsoft Defender for IoT micro agent](upgrade-micro-agent.md)