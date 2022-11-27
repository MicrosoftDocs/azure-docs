---
title: Respond to an alert in the Azure portal - Microsoft Defender for IoT
description: Learn about how to fully respond to OT network alerts in Microsoft Defender for IoT.
ms.date: 11/27/2022
ms.topic: how-to
---

# Investigate an OT network alert in Defender for IoT

This article describes the end-to-end process for investigating and responding to an OT network alert in Microsoft Defender for IoT.

You might be a security operations center (SOC) engineer using Microsoft Sentinel, who's seen a new incident in your Microsoft Sentinel workspace. Continue your investigation in Defender for IoT for further details about related devices and recommended remediation steps.

Alternately, you might be an OT engineer watching for operational alerts directly in Defender for IoT. Operational alerts might not be malicious but can indicate operational activity that can aid in security investigations.

## Prerequisites

Before you start, make sure that you have:

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- An [OT network sensor](onboard-sensors.md) onboarded to Defender for IoT.

- If you're starting in Microsoft Sentinel, make sure that you've completed the following tutorials, and have Defender for IoT data streaming into Microsoft Sentinel:

    - [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
    - [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)

## Start your investigation in Microsoft Sentinel

If you're a SOC engineer who's starting your investigation from a Microsoft Sentinel incident, you'll recognize that you're working with a Defender for IoT alert by the incident's **Product name** value. For example:

:::image type="content" source="media/respond-ot-alert/ot-alert-in-sentinel.png" alt-text="Screenshot of an OT alert in the Microsoft Sentinel Incidents page.":::

Select  **View full details** in Microsoft Sentinel to view details like device entities and MITRE ATT&CK tactics and techniques, run playbooks, add comments, manage the incident, and more. However, to fully investigate an OT network alert, you'll need resources available only in Defender for IoT.

**To go to the alert in Defender for IoT**:

1. On the Microsoft Sentinel **Incidents** page, select the incident you want to investigate, and then select **View full details**.

1. On the incident details page, select the **Timeline** tab, and then select the alert you want to investigate.

1. On the alert details pane on the right, scroll down and select the link in the **Alert link** field. For example:

    :::image type="content" source="media/respond-ot-alert/alert-link.png" alt-text="Screenshot of the Alert link field on an incident details page.":::

    The alert details page opens in Defender for IoT. For example:

    :::image type="content" source="media/respond-ot-alert/alert-details-iot.png" alt-text="Screenshot of the alert details page in Defender for IoT.":::

## Start your investigation in Defender for IoT

If you're an OT engineer who's starting from Defender for IoT, you might be watching a specific sensor or all sensors in your network.


## Investigate source devices

## Investigate related MITRE ATT&CK techniques

## Investigate site and geographic information

## Investigate related alerts

## Take remediation action

## Manage your alert status

## Triage alerts regularly

## Next steps
