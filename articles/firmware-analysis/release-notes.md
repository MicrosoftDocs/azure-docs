---
title: What's new in firmware analysis
author: karengu0
ms.author: karenguo
description: Learn about the latest updates for firmware analysis.
ms.topic: conceptual
ms.date: 09/12/2025
ms.service: azure
---

# What's new in firmware analysis

This article lists new features and feature enhancements in the firmware analysis service.
Get notified about when to revisit this page for updates by copying and pasting this URL:

> `https://learn.microsoft.com/api/search/rss?search=%22What%27s+new+in+firmware+analysis%22&locale=en-us`

into your RSS feed reader.

## November 2025

- **Download firmware analysis results as ZIP**: You can now download a ZIP file of firmware analysis results, making it easy to share findings with suppliers and partners.
    - Select which types of results to include in the ZIP.
    - Download directly from the firmware analysis results page, or select multiple images from the workspace to download a combined set of results.


## October 27, 2025

- **Page size picker**: Added the ability for users to change the number of analysis results displayed per page, providing more flexibility when reviewing large sets of findings.

- **CSV filenames**: Updated the naming convention for CSV downloads. Filenames now include Vendor / Model / Version of the firmware for easier identification and organization.

- **CVE support**: Expanded support for newly disclosed CVEs across multiple libraries, including Apache, OpenSSL, Nginx, Samba, and others. This ensures broader coverage and improved vulnerability detection.

- **Cramfs extraction fix**: Resolved issues with Cramfs filesystem extraction, improving reliability and accuracy of analysis results.

- **jQuery detection improvement**: Enhanced identification of the jQuery library in firmware components, improving accuracy in component analysis.


## October 7, 2025

- **Firmware analysis is now GA**: We're happy to announce GA with this release.

- **Free workspace banner**: A new banner in the portal clearly shows when you’re using a free workspace and provides a link to learn more about limits and licensing.

- **New built-in roles**: Two new roles - **Firmware Analysis User** and **Firmware Analysis Reader** - make it easier to manage access with Azure RBAC.

- **Updated GA SDKs and CLI**: The Azure CLI, PowerShell module, and SDKs for firmware analysis are updated and are GA. Quickstarts and samples now reflect the latest commands and parameters.

- **Terraform and Bicep support**: New Quickstarts are available for deploying firmware analysis workspaces using Terraform and Bicep templates.

- **Improved OpenSSL detection**: Enhancements to OpenSSL version identification improve accuracy and reduce false negatives in analysis results.

- **JFFS2 extraction fix**: Resolved issues with JFFS2 filesystem extraction for more reliable analysis results.

- **Linux kernel version fix**: Improved parsing of Linux kernel version strings for better vulnerability matching.

- **Other fixes**: Includes general quality and reliability improvements.


## June 2025

- **Standalone and embedded experiences**: Firmware analysis now exists as a standalone service in Azure and continues to exist as a blade within Defender for IoT. You can easily reach firmware analysis by searching for "firmware analysis" in the Azure portal search bar.

- **Free SKU for Public Preview**: Firmware analysis is now in Public Preview as a standalone offering. While in Public Preview, all features and functionality are free of charge, and we look forward to gathering your feedback. In GA, we'll provide more details on capacity limits and licensing.

- **Faster analysis**: Firmware analysis service now can extract, analyze, and produce results up to 30% faster. This improvement means that the time it takes from when you upload your firmware image to when the image is in the Ready state to review results is reduced by up to 30%.

- **New UI with multiple workspaces per resource group**: You can now create and manage multiple workspaces for resource groups, which helps you organize your firmware images better.

- **Support for <1GB pre-extraction and <70GB fully extracted**: You can analyze images up to 1GB before it iss extracted, and up to 70GB fully extracted. The analysis won't complete if the expanded image is greater than 70GB.

- **Azure Monitor tab in firmware analysis**: For each of your workspaces, you can now use Azure Monitor to track the latency of firmware analysis (how long the analysis took) and any failures or errors that occurred during analysis. To access Azure Monitor for firmware analysis, search for "firmware analysis workspaces" in the Azure portal search bar, then navigate to your workspace, and expand the "Monitoring" tab to access "Metrics." With Azure Monitor, you can visualize your data with graphs, scatter plots, histograms, and more.

    :::image type="content" source="media/whats-new-firmware-analysis/azure-monitor.png" alt-text="Screenshot that shows the new Azure Monitor capability." lightbox="media/whats-new-firmware-analysis/azure-monitor.png":::

## October 2024

- **Support for UEFI images**: Firmware analysis service now analyzes UEFI images and identifies PKFail instances.

- **New upload form with drag and drop**: You can now upload files with the new drag and drop functionality.

- **Enhanced navigation menu**: Firmware analysis service in the Azure portal now has a menu blade for improved navigation.

- **Race condition resolution**: Resolved a race condition that occasionally prevented the UI from fully populating the firmware list on initial load.

- **Certificate encoding update**: Deprecated the encoding value for certificates to avoid confusion. Now also reporting DER certificates in embedded binaries and flat files.

- **Paged analysis results**: Added support to fetch analysis results in pages to ensure safe retrieval of large data sets.

- **Additional bug fixes and improvements**: Multiple bug fixes for filters, styling, and accessibility.


## March 2024

- **Azure CLI and PowerShell commands**: Automate your workflow of analyzing firmware images by using the [Firmware analysis Azure CLI](/cli/azure/service-page/firmware%20analysis) or the [Firmware analysis PowerShell commands](/powershell/module/az.firmwareanalysis).
- **User choice in resource group**: Pick your own resource group or create a new resource group during the onboarding process.

    :::image type="content" source="media/whats-new-firmware-analysis/pick-resource-group.png" alt-text="Screenshot that shows resource group picker while onboarding." lightbox="media/whats-new-firmware-analysis/pick-resource-group.png":::

- **New UI format with Firmware inventory**: Subtabs to organize Getting started, Subscription management, and Firmware inventory.

    :::image type="content" source="media/whats-new-firmware-analysis/firmware-inventory-tab.png" alt-text="Screenshot that shows the firmware inventory in the new UI." lightbox="media/whats-new-firmware-analysis/firmware-inventory-tab.png":::

- **Enhanced documentation**: Updates to [Tutorial: Analyze an IoT/OT firmware image](tutorial-analyze-firmware.md) documentation addressing the new onboarding experience.

## January 2024

- **PDF report generator**: Addition of a **Download as PDF** capability on the **Overview page** that generates and downloads a PDF report of the firmware analysis results.

    :::image type="content" source="media/whats-new-firmware-analysis/overview-pdf-download.png" alt-text="Screenshot that shows the new Download as PDF button." lightbox="media/whats-new-firmware-analysis/overview-pdf-download.png":::

- **Reduced analysis time**: Analysis time is shorter by 30-80%, depending on image size.

- **CODESYS libraries detection**: Firmware analysis now detects the use of CODESYS libraries, which Microsoft recently identified as having high-severity vulnerabilities. These vulnerabilities can be exploited for attacks such as remote code execution (RCE) or denial of service (DoS). For more information, see [Multiple high severity vulnerabilities in CODESYS V3 SDK could lead to RCE or DoS](https://www.microsoft.com/en-us/security/blog/2023/08/10/multiple-high-severity-vulnerabilities-in-codesys-v3-sdk-could-lead-to-rce-or-dos/).

- **Enhanced documentation**: Addition of documentation addressing the following concepts:
    - [Azure role-based access control for firmware analysis](firmware-analysis-rbac.md), which explains roles and permissions needed to upload firmware images and share analysis results, and an explanation of how the **FirmwareAnalysisRG** resource group works
    - [Frequently asked questions](firmware-analysis-FAQ.md)

- **Improved filtering for each report**: Each subtab report now includes more fine-grained filtering capabilities.

- **Firmware metadata**: Addition of a collapsible tab with firmware metadata that's available on each page.

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
    - Zstandard and nonstandard LZMA implementations of SquashFS


## July 2023

Microsoft Defender for IoT firmware analysis is now available in public preview. Defender for IoT can analyze your device firmware for common weaknesses and vulnerabilities, and provide insight into your firmware security. This analysis is useful whether you build the firmware in-house or receive firmware from your supply chain. 

For more information, see [Firmware analysis for device builders](overview-firmware-analysis.md).

:::image type="content" source="media/whats-new-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image." lightbox="media/whats-new-firmware-analysis/overview.png":::
