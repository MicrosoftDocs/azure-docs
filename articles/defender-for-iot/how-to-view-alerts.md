---
title: View Alerts
description: View alerts according to various categories, and use search features to help you find alerts of interest.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/302020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# View alerts

You can view alerts according to various categories from the **Alerts, Main View**, and use search features to help you find alerts of interest. Select the alert required to review details and manage the event.

| Sort by type | Description |
|--|--|
| **Important Alerts** | Alerts sorted by importance. |
| **Pinned Alerts** | Alerts that were pinned by the user for further investigation. Pinned alerts are not archived, and are stored for 14 days in the pinned folder |
| **Recent Alerts** | Alerts sorted by time. |
| **Acknowledged Alerts** | Displays alerts that were acknowledged and unhandled or muted and unmuted. |
| **Archived Alerts** | Alerts that were archived automatically by the system. Accessible by the administrator user only. |

## Search for alerts of interest

The alerts main view provides various search features to help you find alerts of interest.

:::image type="content" source="media/how-to-work-with-alerts-sensor/main-alerts-view.png" alt-text="Alerts learning screenshot.":::

## Text search 

Use the **Free Search** option to search for alerts by text, numbers, or characters.

**To search:**

  - Type the required text in the **Free Search** field and press Enter on your keyboard.

**To clear the search:**

  - Delete the text in the **Free Search** field and press Enter on your keyboard.

## Device group or device IP address search

Search for alerts that reference specific IP addresses or *Device Groups*. Device Groups are created in the Device map.

**To use Advanced Filters:**

1. Select **Advanced Filters** from the alerts main view.

2. Choose a device group or an device(s).

3. Select **Confirm**.

4. To clear the search, select **Clear All**.

## Security versus operational alert search

Toggle between viewing operation and security alerts:

  - **Security** alerts represent potential Malware traffic detected, network anomalies, policy, and protocol violations.

  - **Operational** alerts represent network anomalies, policy, and protocol violations.

When none of the options are selected, all the alerts are displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-security.png" alt-text="Security on alerts screen.":::
