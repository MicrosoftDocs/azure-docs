---
title: Updating the threat intelligence data
description: "The Threat Intelligence Data package is provided with each new Defender for IoT version, or if needed in between releases."
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/25/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Threat intelligence research and packages

## About threat intelligence research and packages
Proprietary ICS threat intelligence and vulnerability research is carried out by:

**MSTIC (Microsoft Threat Intelligence Center)**

Provides world-class security detection, analytics, and response to Microsoft’s 
- Cloud infrastructure + services
- Traditional products and devices, and
- Internal corporate resources.

This provides security teams with:

- Protection from known, relevant threats
- Insights that help you triage and prioritize 
- An understanding of the full context of threats before they are affected
- More relevant, accurate & actionable data.


**Section 52 Threat Intelligence team**

A world-class team of domain experts that track ICS-specific zero-days, campaigns, and adversaries as well as reverse-engineer malware. This intelligence adds contextual information to enrich our platform analytics and supports our managed services for incident response and breach investigation.

Threat Intelligence packages contain signatures, including malware signatures, CVE's, and other security content. Packages can be downloaded from the Azure Defender to IoT portal, Updates page.

  :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/image283.png" alt-text="Azure Defender for IoT":::

## Update the threat intelligence data

Threat Intelligence packages are provided with each new Defender for IoT version update, or if needed in between releases.

Packages you download from the Defender for IoT portal can be manually uploaded to individual sensors. If your sensors are managed by the on-premises management console, Threat Intelligence packages can be downloaded to the management console pushed to multiple sensors simultaneously.

### Update a package on a single sensor

1. Navigate to the *Azure Defender for IoT, Updates* page.

1. Download and save the Threat Intelligence package.

1. Log in to the sensor console.

1. On the side menu, select **System Settings**.

1. Select **Threat Intelligence Data** and then select **Update.**

1. Upload the new package.

### Update a package on multiple sensors simultaneously

1. Navigate to the *Azure Defender for IoT, Updates* page.
1. Download and save the Threat Intelligence package.
1. Log in to the management console.

1. On the side menu, select **System Settings**.

1. In **Sensor Engine Configuration** section, select the sensors that should receive the updated packages.  

1. In the **Select Threat Intelligence Data**section, select the +.

1. Upload the package.
