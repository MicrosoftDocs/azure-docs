---
title: OT monitoring software release notes - Microsoft Defender for IoT
description: This article lists Microsoft Defender for IoT on-premises OT monitoring software versions, including release and support dates and new features.
ms.topic: overview
ms.date: 09/15/2022
---

# OT monitoring software release notes

This article lists the supported software versions for Microsoft Defender for IoT's OT sensor and on-premises management software. This article lists features supported by OT monitoring software, and doesn't include any cloud-only features.

## Versioning and support for on-premises software versions

The Defender for IoT architecture uses on-premises sensors and management servers. This section describes the servicing information and timelines for the available on-premises software versions.

Release versions have the following syntax: **[Major][Minor][Patch]**

- **Urgent, high-risk security updates are applied in minor versions subsequent to a major version**, and are not applied to earlier versions. Each subsequent version includes aggregated features and fixes from previous versions.

- **Features available from the Azure portal that are dependent on a specific sensor version** are only available for sensors that have the required version installed, or higher.

Version numbers are listed only in this article and in the [What's new in Microsoft Defender for IoT?](whats-new.md) article, and not in detailed descriptions elsewhere in the documentation. To understand whether a feature is supported in your sensor version, check the relevant version section below and its listed features.

### Version update recommendations

We recommend that you make sure to update your sensor versions once every 6 months. When updating, we recommend that you generally update to the latest major version.

- **Update to minor versions** only if you want to use the specific features available in that version.

- **Update to patch versions** only for specific bug fixes or security patches. When working with the Defender for IoT support team on a specific issue, verify whether a patch installation is recommended to resolve the issue.

- **When updating your sensor software version**, make sure to also update your on-premises management console to the same version, if you have one.

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

### Support model

Versions **22.1.7**, **22.2.7**, and any later versions are supported for 1 year from their release. For example, version **22.2.7** was released in **October 2022** and is supported through **September 2023**.

Other versions use a legacy support model. For more information, see the tables and sections for each version below.

> [!IMPORTANT]
> Manual changes to software packages may have detrimental effects on the sensor and on-premises management console. Microsoft is unable to support deployments with manual changes made to software packages.
>

## Versions 22.2.x


|Version  |Release date  |Supported until  |Updates  |
|---------|---------|---------|---------|
|**22.2.7**     |  10/2022       |    09/2023     |   Minor stability improvements      |
|**22.2.6**     |  09/2022       |    04/2023     |  Minor stability improvements      |
|**22.2.5**     |  08/2022       |    04/2023     |   Minor stability improvements      |
|**22.2.4**     |     07/2022    |   04/2023      |  New features   |
|**22.2.3**     |   07/2022      |  04/2023       | New features      |

To update to 22.2.x versions:

- **From version 22.1.x**, update directly to the latest **22.2.x** version
- **From version 10.x**, first update to the latest **22.1.x** version, and then update again to the latest **22.2.x** version.

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

### 22.2.7

**Release date**: 10/2022

**Supported until**: 09/2023

This version includes bug fixes for stability improvements.

### 22.2.6

**Release date**: 09/2022

**Supported until**: 04/2023

This version includes the following new updates and fixes:

- Bug fixes and stability improvements
- Enhancements to the device type classification algorithm

### 22.2.5

**Release date**: 08/2022

**Supported until**: 04/2023

This version includes minor stability improvements.

### 22.2.4

**Release date**: 07/2022

**Supported until**: 04/2023

This version includes the following new updates and fixes:

- [Device inventory enhancements](whats-new.md#device-inventory-enhancements)
- [Enhancements for the ServiceNow integration API](whats-new.md#enhancements-for-the-servicenow-integration-api)
- [New alert columns with timestamp data](whats-new.md#new-alert-columns-with-timestamp-data)

### 22.2.3

**Release date**: 07/2022

**Supported until**: 04/2023

This version includes the following new updates and fixes:

- [OT appliance hardware profile updates](whats-new.md#ot-appliance-hardware-profile-updates)
- [PCAP access from the Azure portal](whats-new.md#pcap-access-from-the-azure-portal-public-preview)
- [Bi-directional alert synch between sensors and the Azure portal](whats-new.md#bi-directional-alert-synch-between-sensors-and-the-azure-portal-public-preview)
- [Sensor connections restored after certificate rotation](whats-new.md#sensor-connections-restored-after-certificate-rotation)
- [Support diagnostic log enhancements](whats-new.md#support-diagnostic-log-enhancements-public-preview)
- [Improved security for uploading protocol plugins](whats-new.md#improved-security-for-uploading-protocol-plugins)
- [Sensor names shown in browser tabs](whats-new.md#sensor-names-shown-in-browser-tabs)

## Versions 22.1.x

|Version  |Release date  |Supported until  |Updates  |
|---------|---------|---------|---------|
|**22.1.7**     |  07/2022     |    06/2023    |   New features     |
|**22.1.6**     |  06/2022       |    10/2022     |  Minor stability improvements      |
|**22.1.5**     |  06/2022       |    10/2022     |   Minor stability improvements      |
|**22.1.4**     |     04/2022    |   10/2022      |  New features   |
|**22.1.3**     |   03/2022      |  10/2022       | New features      |
|**22.1.1**     |   02/2022      |  10/2022      | New features      |


Software versions 22.1.x support direct updates to the latest OT monitoring software versions available. For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

### 22.1.7

**Release date**: 07/2022

**Supported until**: 06/2023

This version includes the following new updates and fixes:

- [Same passwords for *cyberx_host* and *cyberx* users](whats-new.md#same-passwords-for-cyberx_host-and-cyberx-users)

### 22.1.6

**Release date**: 06/2022

**Supported until**: 10/2022

This version minor maintenance updates for internal sensor components.

### 22.1.5

**Release date**: 06/2022

**Supported until**: 10/2022

This version minor updates to improve TI installation packages and software updates.

### 22.1.4

**Release date**: 04/2022

**Supported until**: 10/2022

This version includes the following new updates and fixes:

- [Extended device property data in the Device inventory](whats-new.md#extended-device-property-data-in-the-device-inventory)

### 22.1.3

**Release date**: 03/2022

**Supported until**: 10/2022

This version includes the following new updates and fixes:

- [Support diagnostic log enhancements (Public preview)](whats-new.md#support-diagnostic-log-enhancements-public-preview)
- [Key state alert updates](whats-new.md#key-state-alert-updates-public-preview)
- [Sign out of a CLI session](whats-new.md#sign-out-of-a-cli-session)
- [Sensor health from the Azure portal (Public preview)](whats-new.md#sensor-health-from-the-azure-portal-public-preview)

### 22.1.1

**Release date**: 02/2022

**Supported until**: 10/2022

This version includes the following new updates and fixes:

- [New sensor installation wizard](whats-new.md#new-sensor-installation-wizard)
- [Sensor redesign and unified Microsoft product experience](whats-new.md#sensor-redesign-and-unified-microsoft-product-experience)
- [Enhanced sensor Overview page](whats-new.md#enhanced-sensor-overview-page)
- [New support diagnostics log](whats-new.md#new-support-diagnostics-log)
- [Alert updates](whats-new.md#alert-updates)
- [Custom alert updates](whats-new.md#custom-alert-updates)
- [CLI command updates](whats-new.md#cli-command-updates)
- [Update to version 22.1.x](whats-new.md#update-to-version-221x)
- [New connectivity model and firewall requirements](whats-new.md#new-connectivity-model-and-firewall-requirements)
- [Protocol improvements](whats-new.md#protocol-improvements)
- [Modified, replaced, or removed options and configurations](whats-new.md#modified-replaced-or-removed-options-and-configurations)

## Versions 10.5.x


|Version  |Release date  |Supported until  |Updates  |
|---------|---------|---------|---------|
|**10.5.5**     |  12/2022     |    09/2022    |   Minor stability improvements     |
|**10.5.4**     |  12/2022     |    09/2022    |   New features     |
|**10.5.3**     |  10/2021       |    07/2022     |  New features     |
|**10.5.2**     |  10/2021       |    07/2022     |   New features      |


To update your software to the latest version available, first update to version 22.1.7, and then update again to the latest 22.2.x version. For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

### 10.5.5

**Release date**: 12/2022

**Supported until**: 9/2022

This version minor maintenance updates.

### 10.5.4

**Release date**: 12/2021

**Supported until**: 09/2022

This version includes the following new updates and fixes:

- [Enhanced integration with Microsoft Sentinel (Preview)](whats-new.md#enhanced-integration-with-microsoft-sentinel-preview)
- [Apache Log4j vulnerability](whats-new.md#apache-log4j-vulnerability)
- [Alert updates](whats-new.md#alerting)

### 10.5.3

**Release date**: 10/2021

**Supported until**: 07/2022

This version includes the following new updates and fixes:

- [New integration APIs](release-notes-archive.md#november-2021)
- [Network traffic analysis enhancements](release-notes-archive.md#november-2021)
- [Automatic deletion for older archived alerts](release-notes-archive.md#november-2021)
- [Export alert enhancements](release-notes-archive.md#november-2021)

### 10.5.2

**Release date**: 10/2021

**Supported until**: 07/2022

This version includes the following new updates and fixes:

- [PLC operating mode detections (Public Preview)](release-notes-archive.md#plc-operating-mode-detections-public-preview)
- [PCAP API](release-notes-archive.md#pcap-api)
- [On-premises Management Console Audit](release-notes-archive.md#on-premises-management-console-audit)
- [Webhook Extended](release-notes-archive.md#webhook-extended)
- [Unicode support for certificate passphrases](release-notes-archive.md#unicode-support-for-certificate-passphrases)


## Next steps

For more information about the features listed in this article, see [What's new in Microsoft Defender for IoT?](whats-new.md) and [What's new archive for in Microsoft Defender for IoT for organizations](release-notes-archive.md).
