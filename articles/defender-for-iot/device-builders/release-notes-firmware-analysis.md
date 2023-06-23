---
title: What's new in Microsoft Defender for IoT Firmware analysis
description: Learn about the latest updates for Defender for IoT Firmware analysis.
ms.topic: conceptual
ms.date: 06/23/2023
---


# What's new in Microsoft Defender for IoT Firmware analysis (preview)

This article lists new features and feature enhancements in Microsoft Defender for IoT Firmware analysis.

> [!NOTE]
> The Defender for IoT **Firmware analysis** page is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>


## July 2023

- Firmware analysis is now in Public Preview 

## June 2023

- Added TLS/SSL Certificate and Crypto Key analysis
- Added ability to export firmware inventory and individual results to a CSV file
- Added support for extracting ext and Android Sparse Image filesystems
- When first using Firmware analysis, subscription owners have a choice to pick a region to use for firmware analysis and storage. Options for regions are currently Western Europe and Eastern US.
- Added a warning message for firmware filesystems identified but not fully extracted
- Updated CVE data through May
- Fixed an issue where LZOP file analysis failed if the original file name wasn't present in the header
- Fixed an issue where some images would report incorrect root filesystems found across different users
- Fixed an issue where some images were reporting incorrect analysis times

## May 2023

- Added new Overview tab showing overview of all results
- Enabled sorting / filtering / pagination on firmware library
- Firmware image filename is a subtitle under the vendor/model/version title on analysis results
- Toolbars headers and footers are now sticky while scrolling through the table
- Fix mbedtls SBOM detection when minor version >1 digit
- Updated CVE data through April 28
- Infrastructure changes to improve overall analysis performance

## April 2023

- Added password hash analyzer
- Enabled sorting / filtering / pagination on all analysis results
- Added sudo and mbedtls component detection

## Next steps

- [What is Defender for IoT Firmware analysis?](overview-firmware-analysis.md)
- [Analyze an IoT/OT firmware image](tutorial-analyze-firmware.md)
