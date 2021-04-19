---
title: Update threat intelligence data
description: The threat intelligence data package is provided with each new Defender for IoT version, or if needed between releases.
ms.date: 12/14/2020
ms.topic: how-to
---

# Threat intelligence research and packages

Security teams in Microsoft carry out proprietary ICS threat intelligence and vulnerability research. These teams include MSTIC (Microsoft Threat Intelligence Center), DART (Microsoft Detection and Response Team), DCU (Digital Crimes Unit), and Section 52 (IoT/OT/ICS domain experts that track ICS-specific zero-days, reverse-engineering malware, campaigns, and adversaries).

The teams provide security detection, analytics, and response to Microsoft's:

- Cloud infrastructure and services.
- Traditional products and devices.
- Internal corporate resources.

Security teams gain the benefit of:

- Protection from known and relevant threats.
- Insights that help you triage and prioritize.
- An understanding of the full context of threats before they're affected.
- More relevant, accurate, and actionable data.

This intelligence adds contextual information to enrich Microsoft platform analytics and supports the company's managed services for incident response and breach investigation. Threat intelligence packages contain signatures (including malware signatures), CVEs, and other security content.

You can download packages from the **Updates** page in the Azure Defender for IoT portal.

:::image type="content" source="media/how-to-work-with-threat-intelligence-packages/download-screen.png" alt-text="Download updates through the Azure Defender for IoT portal.":::

## Update threat intelligence data

Threat intelligence packages are provided with each new Defender for IoT version update, or if needed between releases.

Packages that you download from the Defender for IoT portal can be manually uploaded to individual sensors. If the on-premises management console manages your sensors, you can download threat intelligence packages to the management console and push them to multiple sensors simultaneously.

To update a package on a single sensor:

1. Go to the Azure Defender for IoT **Updates** page.

2. Download and save the **Threat Intelligence** package.

3. Sign in to the sensor console.

4. On the side menu, select **System Settings**.

5. Select **Threat Intelligence Data**, and then select **Update**.

6. Upload the new package.

To update a package on multiple sensors simultaneously:

1. Go to the Azure Defender for IoT **Updates** page.

2. Download and save the **Threat Intelligence** package.

3. Sign in to the management console.

4. On the side menu, select **System Settings**.

5. In the **Sensor Engine Configuration** section, select the sensors that should receive the updated packages.  

6. In the **Select Threat Intelligence Data** section, select the plus sign (**+**).

7. Upload the package.

## See also

[Update versions](how-to-manage-sensors-from-the-on-premises-management-console.md#update-versions)
