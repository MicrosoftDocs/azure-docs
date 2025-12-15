---
title: What's new in Microsoft Defender for IoT
description: This article describes new features available in Microsoft Defender for IoT, including both OT and Enterprise IoT networks, and both on-premises and in the Azure portal.
ms.topic: whats-new
ms.date: 09/21/2025
ms.custom:
  - enterprise-iot
  - sfi-image-nochange
---

# What's new in Microsoft Defender for IoT?

This article describes features available in Microsoft Defender for IoT, across both OT and Enterprise IoT networks, both on-premises and in the Azure portal, and for versions released in the last nine months.

Features released earlier than nine months ago are described in the [What's new archive for Microsoft Defender for IoT for organizations](whats-new-archive.md). For more information specific to OT monitoring software versions, see [OT monitoring software release notes](release-notes.md).

> [!NOTE]
> Noted features listed below are in PREVIEW. bThe [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [defender-iot-defender-reference](../includes/defender-for-iot-defender-reference.md)]

## December 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | Sensor version 25.2.1 is now available. See [release details and updates](release-notes.md#version-2521). |

## September 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | Sensor version 25.2.0 is now available. See [release details and updates](release-notes.md#version-2520). |

## June 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | Sensor version 25.1.2 is now available. See [release details and updates](release-notes.md#version-2512). |

## April 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | Sensor version 25.1.1 is now available. See [release details and updates](release-notes.md#version-2511). |

## March 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | The following sensor versions are now available:<br><br>- 24.1.9: See [release details and updates](release-notes.md#2419).<br>- 25.1.0: See [release details and updates](release-notes.md#version-2510). |
| **OT networks** | - ["Unauthorized Internet Connectivity Detected" alert now includes URL information](#unauthorized-internet-connectivity-detected-alert-now-includes-url-information)<br>- [Improved RDP Brute Force Detection](#improved-rdp-brute-force-detection) |

### "Unauthorized Internet Connectivity Detected" alert now includes URL information

The "Unauthorized Internet Connectivity Detected" alert details now includes the URL from which the suspicious connection initiated, helping SOC analysts assess and respond to incidents more effectively.

The URL information applies only to HTTP-based connections and doesn’t appear for other protocols or for encrypted traffic such as HTTPS. You can view the URL details both on the sensor and in the Azure portal.

:::image type="content" source="media/whats-new/url-parameters.png" alt-text="Screenshot of URL information in alert details." lightbox="media/whats-new/url-parameters.png":::

### Improved RDP brute force detection

The “Excessive Number of Sessions” alert now includes support by default to a remote desktop protocol (RDP) port, enhancing visibility into potential brute-force attacks and unauthorized access attempts.

## January 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - [Aggregating multiple alerts violations with the same parameters](#aggregating-multiple-alerts-violations-with-the-same-parameters)|
| **OT networks** | - [On-premises management console retirement](#on-premises-management-console-retirement) |

### Aggregating multiple alerts violations with the same parameters

To reduce alert fatigue, multiple versions of the same alert violation and with the same parameters are grouped together and listed in the alerts table as one item. The alert details pane lists each of the identical alert violations in the **Violations** tab and the appropriate remediation actions are listed in the **Take action** tab. For more information, see [aggregating alerts with the same parameters](alerts.md#aggregating-alert-violations).

## On-premises management console retirement

The legacy on-premises management console isn't available for download after **January 1st, 2025**. We recommend transitioning to the new architecture using the full spectrum of on-premises and cloud APIs before this date. For more information, see [on-premises management console retirement](ot-deploy/on-premises-management-console-retirement.md).

## Next steps

[Getting started with Defender for IoT](getting-started.md)
