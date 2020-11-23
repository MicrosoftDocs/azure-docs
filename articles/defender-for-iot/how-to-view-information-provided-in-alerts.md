---
title: View information provided in alerts
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# View information provided in alerts

Select an alert from the Alerts window to review alert details. The following information is provided in alerts:

  - ***Alert Metadata***

  - ***Information about Traffic, Assets and the Event***

  - ***Link to Connected Assets in the Asset Map***

  - ***Comments Defined by Security Analysts and Administrators***

  - ***Recommendations for Investigating the Event***

## Alert metadata

The following alert metadata is displayed.

  - Alert ID

  - Policy engine that triggered the alert

  - Date and time the alert was triggered

:::image type="content" source="media/how-to-work-with-alerts-sensor/image164.png" alt-text="Unauthorized":::

## Information about traffic, assets and the event

The alert message provides information about:

  - The detected assets.

  - The traffic detected between the assets, for example: protocols and function codes.

  - Insights into the implications of the event.

You can use this information when deciding how to manage the alert event.

## Link to connected assets in the asset map

To learn more about assets connected to the assets detected, you can select an asset image in the alert and view connected assets in the Map.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image165.png" alt-text="RPC Operation Failed":::

The map filters to the asset you selected, and other assets connected to it. The Quick Properties dialog box for the assets detected in the alerts is displayed on the map as well.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image166.png" alt-text="Assets":::

## Comments defined by security analysts and administrators 

Alerts may include a list of predefined comments, for example with instructions regarding mitigation actions to take, or names of individuals to contact regarding the event.

When managing an alert event, you can choose the comment or comments that best reflect the event status or steps you have taken to investigate the alert.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image167.png" alt-text="Suspicion":::

Selected comments are saved in the alert message. Working with comments enhances commination between individuals and teams during the investigation of an alert event, and as a result, can accelerate incident response time.

Comments are pre-defined by Administrator or Security Analyst users. Selected comments are not forwarded to partner systems defined in the Forwarding rules.

See [Accelerate Incident Workflow with Alert Comments](./accelerate-incident-workflow-with-alert-comments.md) for details about creating comments.
