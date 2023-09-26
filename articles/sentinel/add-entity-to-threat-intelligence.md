---
title: Add entities to threat intelligence in Microsoft Sentinel
description: This article shows you, if you discover a malicious entity in an incident investigation, how to add the entity to your threat intelligence indicator lists in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/17/2023
---

# Add entities to threat intelligence in Microsoft Sentinel

When investigating an incident, you examine entities and their context as an important part of understanding the scope and nature of the incident. In the course of the investigation, you may discover a domain name, URL, file, or IP address in the incident that should be labeled and tracked as an indicator of compromise (IOC), a threat indicator.

For example, you may discover an IP address performing port scans across your network, or functioning as a command and control node, sending and/or receiving transmissions from large numbers of nodes in your network.

Microsoft Sentinel allows you to flag these types of entities as malicious, right from within your incident investigation, and add it to your threat indicator lists. You'll then be able to view the added indicators both in Logs and in the Threat Intelligence blade, and use them across your Microsoft Sentinel workspace.

## Add an entity to your indicators list

The new [incident details page](investigate-incidents.md) gives you another way to add entities to threat intelligence, in addition to the investigation graph. Both ways are shown below.

# [Incident details page](#tab/incidents)

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. Select an incident to investigate. In the incident details panel, select **View full details** to open the incident details page.

    :::image type="content" source="media/add-entity-to-threat-intelligence/incident-details-overview.png" alt-text="Screenshot of incident details page." lightbox="media/add-entity-to-threat-intelligence/incident-details-overview.png":::

1. Find the entity from the **Entities** widget that you want to add as a threat indicator. (You can filter the list or enter a search string to help you locate it.)

1. Select the three dots to the right of the entity, and select **Add to TI** from the pop-up menu.

    Only the following types of entities can be added as threat indicators:
    - Domain name
    - IP address (IPv4 and IPv6)
    - URL
    - File (hash)

    :::image type="content" source="media/add-entity-to-threat-intelligence/entity-actions-from-overview.png" alt-text="Screenshot of adding an entity to threat intelligence.":::

# [Investigation graph](#tab/cases)

The [investigation graph](investigate-cases.md) is a visual, intuitive tool that presents connections and patterns and enables your analysts to ask the right questions and follow leads. You can use it to add entities to your threat intelligence indicator lists, making them available across your workspace.

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. Select an incident to investigate. In the incident details panel, select the **Actions** button and choose **Investigate** from the pop-up menu. This will open the investigation graph.

    :::image type="content" source="media/add-entity-to-threat-intelligence/select-incident-to-investigate.png" alt-text="Screenshot of selecting incident from queue to investigate.":::

1. Select the entity from the graph that you want to add as a threat indicator. A side panel will open on the right. Select **Add to TI**.

    Only the following types of entities can be added as threat indicators:
    - Domain name
    - IP address (IPv4 and IPv6)
    - URL
    - File (hash)

    :::image type="content" source="media/add-entity-to-threat-intelligence/add-entity-to-ti.png" alt-text="Screenshot of adding entity to threat intelligence.":::

---

Whichever of the two interfaces you choose, you will end up here:

1. The **New indicator** side panel will open. The following fields will be populated automatically:

    - **Type**
        - The type of indicator represented by the entity you're adding.  
            Drop-down with possible values: *ipv4-addr*, *ipv6-addr*, *URL*, *file*, *domain-name*
        - Required; automatically populated based on the **entity type**.

    - **Value**
        - The name of this field changes dynamically to the selected indicator type.
        - The value of the indicator itself.
        - Required; automatically populated by the **entity value**.

    - **Tags** 
        - Free-text tags you can add to the indicator.
        - Optional; automatically populated by the **incident ID**. You can add others.
    
    - **Name**
        - Name of the indicator&mdash;this is what will be displayed in your list of indicators.
        - Optional; automatically populated by the **incident name.**
    
    - **Created by**
        - Creator of the indicator.
        - Optional; automatically populated by the user logged into Microsoft Sentinel.

    Fill in the remaining fields accordingly.

    - **Threat type**
        - The threat type represented by the indicator.
        - Optional; free text.

    - **Description**
        - Description of the indicator.
        - Optional; free text.

    - **Revoked**
        - Revoked status of the indicator. Mark checkbox to revoke the indicator, clear checkbox to make it active.
        - Optional; boolean.

    - **Confidence**
        - Score reflecting confidence in the correctness of the data, by percent.
        - Optional; integer, 1-100

    - **Kill chain**
        - Phases in the [*Lockheed Martin Cyber Kill Chain*](https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html#OVERVIEW) to which the indicator corresponds.
        - Optional; free text 

    - **Valid from**
        - The time from which this indicator is considered valid.
        - Required; date/time 

    - **Valid until**
        - The time at which this indicator should no longer be considered valid.
        - Optional; date/time 

    :::image type="content" source="media/add-entity-to-threat-intelligence/new-indicator-panel.png" alt-text="Screenshot of entering information in new threat indicator panel.":::

1. When all the fields are filled in to your satisfaction, select **Apply**. You'll see a confirmation message in the upper-right-hand corner that your indicator was created.

1. The entity will be added as a threat indicator in your workspace. You can find it [in the list of indicators in the **Threat intelligence** page](work-with-threat-indicators.md#find-and-view-your-indicators-in-the-threat-intelligence-page), and also [in the *ThreatIntelligenceIndicators* table in **Logs**](work-with-threat-indicators.md#find-and-view-your-indicators-in-logs). 

## Next steps

In this article, you learned how to add entities to your threat indicator lists. For more information, see:

- [Investigate incidents with Microsoft Sentinel](investigate-incidents.md)
- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)
- [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md)
