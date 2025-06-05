---
title: What's new in Microsoft Defender for IoT
description: This article describes new features available in Microsoft Defender for IoT, including both OT and Enterprise IoT networks, and both on-premises and in the Azure portal.
ms.topic: whats-new
ms.date: 05/05/2025
ms.custom: enterprise-iot
---

# What's new in Microsoft Defender for IoT?

This article describes features available in Microsoft Defender for IoT, across both OT and Enterprise IoT networks, both on-premises and in the Azure portal, and for versions released in the last nine months.

Features released earlier than nine months ago are described in the [What's new archive for Microsoft Defender for IoT for organizations](whats-new-archive.md). For more information specific to OT monitoring software versions, see [OT monitoring software release notes](release-notes.md).

> [!NOTE]
> Noted features listed below are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [defender-iot-defender-reference](../includes/defender-for-iot-defender-reference.md)]

## On-premises management console retirement

The legacy on-premises management console isn't available for download after **January 1st, 2025**. We recommend transitioning to the new architecture using the full spectrum of on-premises and cloud APIs before this date. For more information, see [on-premises management console retirement](ot-deploy/on-premises-management-console-retirement.md).

## March 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - ["Unauthorized Internet Connectivity Detected" alert now includes URL information](#unauthorized-internet-connectivity-detected-alert-now-includes-url-information)<br>- [Improved RDP Brute Force Detection](#improved-rdp-brute-force-detection) |

### "Unauthorized Internet Connectivity Detected" alert now includes URL information

The "Unauthorized Internet Connectivity Detected" alert details now includes the URL from which the suspicious connection initiated, helping SOC analysts assess and respond to incidents more effectively.

:::image type="content" source="media/whats-new/url-parameters.png" alt-text="Screenshot of URL information in alert details." lightbox="media/whats-new/url-parameters.png":::

### Improved RDP brute force detection

The “Excessive Number of Sessions” alert now includes support by default to a remote desktop protocol (RDP) port, enhancing visibility into potential brute-force attacks and unauthorized access attempts.

## January 2025

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - [Aggregating multiple alerts violations with the same parameters](#aggregating-multiple-alerts-violations-with-the-same-parameters)|

### Aggregating multiple alerts violations with the same parameters

To reduce alert fatigue, multiple versions of the same alert violation and with the same parameters are grouped together and listed in the alerts table as one item. The alert details pane lists each of the identical alert violations in the **Violations** tab and the appropriate remediation actions are listed in the **Take action** tab. For more information, see [aggregating alerts with the same parameters](alerts.md#aggregating-alert-violations).

## December 2024

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - [Support Multiple Source Devices in DDoS Attack Alerts](#support-multiple-source-devices-in-ddos-attack-alerts) |

### Support Multiple Source Devices in DDoS Attack Alerts

Alert details now display up to 10 source devices involved in DDoS attack.

## October 2024

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - [Add wildcards to allowlist domain names](#add-wildcards-allowlist-domain-names)<br> - [Added protocol](#added-protocol) <br> - [New sensor setting type Public addresses](#new-sensor-setting-type-public-addresses) <br>  - [Improved OT sensor onboarding](#improved-ot-sensor-onboarding) |

### Add wildcards allowlist domain names

When adding domain names to the FQDN allowlist use the `*` wildcard to include all sub-domains. For more information, see [allow internet connections on an OT network](how-to-accelerate-alert-incident-response.md#allow-internet-connections-on-an-ot-network).

### Added protocol

We now support the OCPI protocol. See [the updated protocol list](concept-supported-protocols.md#supported-protocols-for-ot-device-discovery).

### New sensor setting type Public addresses

We're adding the **Public addresses** type to the sensor settings, that allows you to exclude public IP addresses that might have been used for internal use and shouldn't be tracked. For more information, see [add sensor settings](configure-sensor-settings-portal.md#add-sensor-settings).

### Improved OT sensor onboarding

If there are connection problems, during sensor onboarding, between the OT sensor and the Azure portal at the configuration stage, the process can't be completed until the connection problem is solved.

We now support completing the configuration process without the need to solve the communication problem, allowing you to continue the onboarding of your OT sensor quickly and solve the problem at a later time. For more information, see [activate your OT sensor](ot-deploy/activate-deploy-sensor.md#activate-your-ot-sensor).

## July 2024

|Service area  |Updates  |
|---------|---------|
| **OT networks** | - [Security update](#security-update) |

### Security update

This update resolves a CVE, which is listed in [software version 24.1.4 feature documentation](release-notes.md#version-2414).

## Next steps

[Getting started with Defender for IoT](getting-started.md)
