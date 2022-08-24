---
title: Add entities to threat intelligence in Microsoft Sentinel
description: This article shows you, if you discover a malicious entity in an incident investigation, how to add the entity to your threat intelligence indicator lists in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 08/25/2022
ms.author: yelevin
---

# Add entities to threat intelligence in Microsoft Sentinel

When investigating an incident, you examine entities and their context as an important part of understanding the scope and nature of the incident. In the course of the investigation, you may discover an entity in the incident that should be labeled and tracked as an indicator of compromise (IOC), a threat indicator.

For example, you may discover an IP address performing port scans across your network, or functioning as a command and control node, sending and/or receiving transmissions from large numbers of nodes in your network.

Microsoft Sentinel allows you to flag the entity as malicious, right from within the investigation graph. You'll then be able to view this indicator both in Logs and in the Threat Intelligence blade in Sentinel.

> [!IMPORTANT]
> Adding entities as TI indicators is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Add an entity to your indicators list

The [investigation graph](investigate-cases.md) is a visual, intuitive tool that presents connections and patterns and enables your analysts to ask the right questions and follow leads. You can use it to add entities to your threat intelligence indicator lists, making them available across your workspace.

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

    :::image type="content" source="media/investigate-cases/incident-severity.png" alt-text="Screenshot of incidents queue displayed in a grid." lightbox="media/investigate-cases/incident-severity.png":::

1. Select an incident to investigate. In the incident details panel, select the **Actions** button and choose **Investigate** from the pop-up menu. This will open the investigation graph.

    :::image type="content" source="media/relate-alerts-to-incidents/investigation-map.png" alt-text="Screenshot of incidents with alerts in investigation graph." lightbox="media/investigate-cases/incident-severity.png":::

1. Select the entity you want to add as a threat indicator. A side panel will open on the right. Select **Add to TI**.

1. The **New indicator** side panel will open. Fill in the fields as described below.

    | Field | Required? | Description |
    | ----- | --------- | ----------- |
    | Type | Yes | Type of the indicator (ipv4-addr, ipv6-addr, URL, file, domain-name).<br>**This is auto-populated based on the entity type.** |
    | Value | Yes | Value of the observable.

1. Hover over one of the related alerts until a menu pops out to its side. Select **Add alert to incident (Preview)**.

    :::image type="content" source="media/relate-alerts-to-incidents/add-alert-to-incident.png" alt-text="Screenshot of adding an alert to an incident in the investigation graph.":::

1. The alert is added to the incident, and for all purposes is part of the incident, along with all its entities and details. You'll see two visual representations of this:

    - The line connecting it to the entity in the investigation graph has changed from dotted to solid, and connections to entities in the added alert have been added to the graph.

        :::image type="content" source="media/relate-alerts-to-incidents/alert-joined-to-incident.png" alt-text="Screenshot showing an alert added to an incident." lightbox="media/relate-alerts-to-incidents/alert-joined-to-incident.png":::

    - The alert now appears in this incident's timeline, together with the alerts that were already there.

        :::image type="content" source="media/relate-alerts-to-incidents/two-alerts.png" alt-text="Screenshot showing an alert added to an incident's timeline.":::



## Next steps
In this article, you learned how to add alerts to incidents and remove them using the Microsoft Sentinel portal and API. For more information, see:

- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Incident relations group in the Microsoft Sentinel REST API](/rest/api/securityinsights/preview/incident-relations)
