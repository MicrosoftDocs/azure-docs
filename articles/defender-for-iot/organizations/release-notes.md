---
title: OT monitoring software versions - Microsoft Defender for IoT
description: This article lists Microsoft Defender for IoT on-premises OT monitoring software versions, including release and support dates and highlights for new features.
ms.topic: release-notes
ms.date: 01/26/2025
---

# OT monitoring software versions

The Microsoft Defender for IoT architecture uses on-premises sensors and management servers.

This article lists the supported software versions for the OT sensor and on-premises management software, including release dates, support dates, and highlights for the updated features.

For more information, including detailed descriptions and updates for cloud-only features, see [What's new in Microsoft Defender for IoT?](whats-new.md) Cloud-only features aren't dependent on specific sensor versions.

## Versioning and support for on-premises software versions

This section describes the servicing information, timelines, and guidance for the available on-premises software versions.

### Version update recommendations

When updating your on-premises software, we recommend:

- Plan to **update your sensor versions to the latest version once every 6 months**.

- Update to a **patch version only for specific bug fixes or security patches**. When working with the Microsoft support team on a specific issue, verify which patch version is recommended to resolve your issue.

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

### OT monitoring software versions (sensor versions)
 
Cloud features may be dependent on a specific sensor version. Such features are listed below for the relevant software versions, and are only available for data coming from sensors that have the required version installed, or higher.

> [!IMPORTANT]
> The on-premises management console won't be supported or available for download after January 1st, 2025. For more information, see [on-premises management console retirement](ot-deploy/on-premises-management-console-retirement.md).
>

| Version / Patch |  Release date | Scope     | Supported until |
| ------- |  ------------ | ----------- | ------------------- |
| **24.1** | | | |
| 24.1.8  |12/2024 | Minor |12/2025 |
| 24.1.7  |12/2024 | Minor |12/2025 |
| 24.1.6  |11/2024 | Minor |12/2025 |
| 24.1.5  |09/2024 | Minor |09/2025 |
| 24.1.4  |07/2024 | Minor |07/2025 |
| 24.1.3  |06/2024 | Minor |06/2025 |
| 24.1.2  |04/2024 | Minor |04/2025 |

### Threat intelligence updates

Threat intelligence updates are continuously available and are independent of specific sensor versions. You don't need to update your sensor version in order to get the latest threat intelligence updates.

For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md).

### Support model

Defender for IoT provides **1 year of support** for every new version, starting with versions **22.1.7** and **22.2.7**. For example, version **22.2.7** was released in **October 2022** and is supported through **September 2023**.

Earlier versions use a legacy support model, with support dates [detailed for each version](#ot-monitoring-software-versions).

### On-premises appliance security

The OT network sensor and the on-premises management console are designed as a *locked-down* security appliance with a hardened attack surface. Appliance access and control are allowed only through the [management port](best-practices/understand-network-architecture.md), via HTTP for web access and SSH for the support shell.

Defender for IoT adheres to the [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) throughout the entire development lifecycle, including activities like training, compliance, code reviews, threat modeling, design requirements, component governance, and pen testing. All appliances are locked down according to industry best practices and shouldn't be modified.

Maintain your sensors and on-premises management consoles, for activities like backups, log exports, or health monitoring, via the web interface, or the Defender for IoT [CLI commands](references-work-with-defender-for-iot-cli-commands.md).

> [!IMPORTANT]
> Manual changes to software packages or additions of external packages may have detrimental security or functional effects on the sensor and on-premises management console. Microsoft is unable to support deployments with manual changes made to software packages.
>

### Feature documentation per versions

Version numbers are listed only in this article and in the [What's new in Microsoft Defender for IoT?](whats-new.md) article, and not in detailed descriptions elsewhere in the documentation.

To understand whether a feature is supported in your sensor version, check the relevant version section below and its listed features.

## Versions 24.1.x

### 24.1.8

**Release date**: 12/2024

**Supported until**: 12/2025

This version includes bug fixes for stability improvements.

### 24.1.7

**Release date**: 12/2024

**Supported until**: 12/2025

This version includes bug fixes for stability improvements.

### 24.1.6

**Release date**: 11/2024

**Supported until**: 12/2025

This version includes bug fixes for stability improvements.

### Version 24.1.5

**Release date**: 09/2024

**Supported until**: 09/2025

This version includes the following updates and enhancements:

- [Add wildcards to allowlist domain names](how-to-accelerate-alert-incident-response.md#allow-internet-connections-on-an-ot-network)
- [OCPI protocol is now supported](concept-supported-protocols.md#supported-protocols-for-ot-device-discovery)
- [New sensor setting type: Public addresses](configure-sensor-settings-portal.md#add-sensor-settings)
- [Improved OT sensor onboarding](ot-deploy/activate-deploy-sensor.md#activate-your-ot-sensor)

### Version 24.1.4

**Release date**: 07/2024

**Supported until**: 07/2025

This version includes the following updates and enhancements:

- [Malicious URL path alert](release-notes-ot-monitoring-sensor-archive.md#malicious-url-path-alert)
- The following CVE is resolved in this version:
  - CVE-2024-38089

### Version 24.1.3

**Release date**: 06/2024

**Supported until**: 06/2025

This version includes the following updates and enhancements:

- [Sensor time drift detection](release-notes-ot-monitoring-sensor-archive.md#sensor-time-drift-detection)
- Bug fixes for stability improvements
- The following CVEs are resolved in this version:
  - CVE-2024-29055
  - CVE-2024-29054
  - CVE-2024-29053
  - CVE-2024-21324
  - CVE-2024-21323
  - CVE-2024-21322

### Version 24.1.2

**Release date**: 04/2024

**Supported until**: 04/2025

This version includes the following updates and enhancements:

- [Alert suppression rules from the Azure portal](how-to-accelerate-alert-incident-response.md#suppress-irrelevant-alerts)
- [Focused alerts in OT/IT environments](alerts.md#focused-alerts-in-otit-environments)
- [Alert ID (ID field) is now aligned on the Azure portal and sensor console](how-to-manage-cloud-alerts.md#view-alerts-on-the-azure-portal)
- [Newly supported protocols](concept-supported-protocols.md)
- [L60 hardware profile is no longer supported](ot-appliance-sizing.md#production-line-monitoring-medium-and-small-deployments)

## Next steps

For more information about the features listed in this article, see [What's new in Microsoft Defender for IoT](whats-new.md) and [What's new archive for in Microsoft Defender for IoT for organizations](release-notes-ot-monitoring-sensor-archive.md.md).
