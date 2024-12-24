---
title: What's new in Firmware analysis
author: karengu0
ms.author: karenguo
description: Learn about the latest updates for Firmware analysis.
ms.topic: conceptual
ms.date: 11/04/2024
ms.service: azure
---

# What's new in Firmware analysis

This article lists new features and feature enhancements in the Firmware analysis service.

Noted features are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## October 2024

- **Support for UEFI images**: Firmware analysis service now analyzes UEFI images and identifies PKFail instances.

- **New upload form with drag and drop**: You can now upload files with the new drag and drop functionality.

- **Enhanced navigation menu**: Firmware analysis service in the Azure portal now has a menu blade for improved navigation.

- **Race condition resolution**: Resolved a race condition that occasionally prevented the UI from fully populating the firmware list on initial load.

- **Certificate encoding update**: Deprecated the encoding value for certificates to avoid confusion. Now also reporting DER certificates in embedded binaries as well as flat files.

- **Paged analysis results**: Added support to fetch analysis results in pages to ensure safe retrieval of very large data sets.

- **Additional bug fixes and improvements**: Multiple bug fixes for filters, styling, and accessibility.


## March 2024

- **Azure CLI and PowerShell commands**: Automate your workflow of analyzing firmware images by using the [Firmware Analysis Azure CLI](/cli/azure/service-page/firmware%20analysis) or the [Firmware Analysis PowerShell commands](/powershell/module/az.firmwareanalysis).
- **User choice in resource group**: Pick your own resource group or create a new resource group during the onboarding process.

    :::image type="content" source="media/whats-new-firmware-analysis/pick-resource-group.png" alt-text="Screenshot that shows resource group picker while onboarding." lightbox="media/whats-new-firmware-analysis/pick-resource-group.png":::

- **New UI format with Firmware inventory**: Subtabs to organize Getting started, Subscription management, and Firmware inventory.

    :::image type="content" source="media/whats-new-firmware-analysis/firmware-inventory-tab.png" alt-text="Screenshot that shows the firmware inventory in the new UI." lightbox="media/whats-new-firmware-analysis/firmware-inventory-tab.png":::

- **Enhanced documentation**: Updates to [Tutorial: Analyze an IoT/OT firmware image](tutorial-analyze-firmware.md) documentation addressing the new onboarding experience.

## January 2024

- **PDF report generator**: Addition of a **Download as PDF** capability on the **Overview page** that generates and downloads a PDF report of the firmware analysis results.

    :::image type="content" source="media/whats-new-firmware-analysis/overview-pdf-download.png" alt-text="Screenshot that shows the new Download as PDF button." lightbox="media/whats-new-firmware-analysis/overview-pdf-download.png":::

- **Reduced analysis time**: Analysis time has been shortened by 30-80%, depending on image size.

- **CODESYS libraries detection**: Firmware analysis now detects the use of CODESYS libraries, which Microsoft recently identified as having high-severity vulnerabilities. These vulnerabilities can be exploited for attacks such as remote code execution (RCE) or denial of service (DoS). For more information, see [Multiple high severity vulnerabilities in CODESYS V3 SDK could lead to RCE or DoS](https://www.microsoft.com/en-us/security/blog/2023/08/10/multiple-high-severity-vulnerabilities-in-codesys-v3-sdk-could-lead-to-rce-or-dos/).

- **Enhanced documentation**: Addition of documentation addressing the following concepts:
    - [Azure role-based access control for Firmware Analysis](firmware-analysis-rbac.md), which explains roles and permissions needed to upload firmware images and share analysis results, and an explanation of how the **FirmwareAnalysisRG** resource group works
    - [Frequently asked questions](firmware-analysis-FAQ.md)

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

- **Added support for file systems**: Firmware analysis now supports extraction of the following file systems. For more information, see [Firmware analysis FAQs](firmware-analysis-faq.md#what-types-of-firmware-images-does-firmware-analysis-support):
    - ISO
    - RomFS
    - Zstandard and non-standard LZMA implementations of SquashFS


## July 2023

Microsoft Defender for IoT Firmware Analysis is now available in public preview. Defender for IoT can analyze your device firmware for common weaknesses and vulnerabilities, and provide insight into your firmware security. This analysis is useful whether you build the firmware in-house or receive firmware from your supply chain. 

For more information, see [Firmware analysis for device builders](overview-firmware-analysis.md).

:::image type="content" source="media/whats-new-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image." lightbox="media/whats-new-firmware-analysis/overview.png":::

