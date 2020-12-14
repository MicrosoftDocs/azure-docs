---
title: Update the threat intelligence data
description: The threat intelligence data package is provided with each new Defender for IoT version, or if needed in between releases.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/14/2020
ms.service: azure
ms.topic: how-to
---

# Threat intelligence research and packages
## About threat intelligence research

Proprietary ICS Threat Intelligence and vulnerability research is carried out by security research teams in Microsoft including MSTIC (Microsoft Threat Intelligence Center), DART (Microsoft Detection and Response Team), DCU (Digital Crimes Unit) and Section 52 (IoT/OT/ICS domain experts that track ICS-specific zero-days, reverse-engineer malware, campaigns, and adversaries).
The teams provide world-class security detection, analytics, and response to Microsoft’s:

- Cloud infrastructure and services.
- Traditional products and devices.
- Internal corporate resources.

Security teams gain the benefit of:

- Protection from known, and relevant threats.
- Insights that help you triage and prioritize.
- An understanding of the full context of threats before they are affected.
- More relevant, accurate, and actionable data.

This intelligence adds contextual information to enrich our platform analytics and supports our managed services for incident response and breach investigation. Threat Intelligence packages contain signatures, including malware signatures, CVE's, and other security content.

Packages can be downloaded from the Azure Defender to IoT portal, Updates page.

Threat Intelligence packages contain signatures, including malware signatures, CVE's, and other security content. Packages can be downloaded from the Azure Defender to IoT portal, Updates page.

  :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/download-screen.png" alt-text="Download updates through Azure Defender for IoT portal.":::

## Update the threat Intelligence data

Threat Intelligence packages are provided with each new Defender for IoT version update, or if needed in between releases.

Packages you download from the Defender for IoT portal can be manually uploaded to individual sensors. If your sensors are managed by the on-premises management console, TI packages can be downloaded to the management console pushed to multiple sensors simultaneously.

### Update a package on a single sensor

To update a package on a single sensor:

1. Navigate to the Azure Defender for IoT, **Updates** page.

2. Download and save the Threat Intelligence package.

3. Sign in to the sensor console.

4. On the side menu, select **System Settings**.

5. Select **Threat Intelligence Data** and then select **Update.**

6. Upload the new package.

### Update a package on multiple sensors simultaneously

To update a package on multiple sensors:

1. Navigate to the Azure Defender for IoT, Updates page.
2. Download and save the TI package.

3. Sign in to the management console.

4. On the side menu, select **System Settings**.

5. In the Sensor Engine Configuration section, select the sensors that should receive the updated packages.  

6. In the **Select Threat Intelligence Data** section, select the **+**.

7. Upload the package.

## See also

[Update versions](how-to-manage-sensors-from-the-on-premises-management-console.md#update-versions)
