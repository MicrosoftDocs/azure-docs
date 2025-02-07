---
title: Add entities to threat intelligence
titleSuffix: Microsoft Sentinel
description: Learn how to add a malicious entity discovered in an incident investigation to your threat intelligence in Microsoft Sentinel.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 3/14/2024
appliesto: 
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a security engineer, I want to add entities to threat intelligence during incident investigations so that my team can track and manage indicators of compromise effectively.
---

# Add entities to threat intelligence in Microsoft Sentinel

During an investigation, you examine entities and their context as an important part of understanding the scope and nature of an incident. When you discover an entity as a malicious domain name, URL, file, or IP address in the incident, it should be labeled and tracked as an indicator of compromise (IOC) in your threat intelligence.

For example, you might discover an IP address that performs port scans across your network or functions as a command and control node by sending and/or receiving transmissions from large numbers of nodes in your network.

With Microsoft Sentinel, you can flag these types of entities from within your incident investigation and add them to your threat intelligence. You can view the added indicators by querying them or searching for them in the threat intelligence management interface and use them across your Microsoft Sentinel workspace.

## Add an entity to your threat intelligence

The [Incident details page](investigate-incidents.md) and the investigation graph give you two ways to add entities to threat intelligence.

# [Incident details page](#tab/incidents)

1. On the Microsoft Sentinel menu, select **Incidents** from the **Threat management** section.

1. Select an incident to investigate. On the **Incident details** pane, select **View full details** to open the **Incident details** page.

1. On the **Entities** pane, find the entity that you want to add as a threat indicator. (You can filter the list or enter a search string to help you locate it.)

    :::image type="content" source="media/add-entity-to-threat-intelligence/incident-details-overview.png" alt-text="Screenshot that shows the Incident details page." lightbox="media/add-entity-to-threat-intelligence/incident-details-overview.png":::

1. Select the three dots to the right of the entity, and select **Add to TI** from the pop-up menu.

    Add only the following types of entities as threat indicators:

    - Domain name
    - IP address (IPv4 and IPv6)
    - URL
    - File (hash)

    :::image type="content" source="media/add-entity-to-threat-intelligence/entity-actions-from-overview.png" alt-text="Screenshot that shows adding an entity to threat intelligence.":::

# [Investigation graph](#tab/cases)

The [investigation graph](investigate-cases.md) is a visual, intuitive tool that presents connections and patterns and enables your analysts to ask the right questions and follow leads. Use it to add entities to your threat intelligence indicator lists by making them available across your workspace.

1. On the Microsoft Sentinel menu, select **Incidents** from the **Threat management** section.

1. Select an incident to investigate. On the **Incident details** pane, select **Actions**, and choose **Investigate** from the pop-up menu to open the investigation graph.

    :::image type="content" source="media/add-entity-to-threat-intelligence/select-incident-to-investigate.png" alt-text="Screenshot that shows selecting an incident from the list to investigate.":::

1. Select the entity from the graph that you want to add as a threat indicator. On the side pane that opens, select **Add to TI**.

    Only add the following types of entities as threat indicators:

    - Domain name
    - IP address (IPv4 and IPv6)
    - URL
    - File (hash)

    :::image type="content" source="media/add-entity-to-threat-intelligence/add-entity-to-ti.png" alt-text="Screenshot that shows adding an entity to threat intelligence.":::

---

Whichever of the two interfaces you choose, you end up here.

1. The **New indicator** side pane opens. The following fields are populated automatically:

    - **Types**
        - The type of indicator represented by the entity you're adding.
            - Dropdown list with possible values: `ipv4-addr`, `ipv6-addr`, `URL`, `file`, and `domain-name`.
        - Required. Automatically populated based on the *entity type*.

    - **Value**
        - The name of this field changes dynamically to the selected indicator type.
        - The value of the indicator itself.
        - Required. Automatically populated by the *entity value*.

    - **Tags**
        - Free-text tags you can add to the indicator.
        - Optional. Automatically populated by the *incident ID*. You can add others.
    
    - **Name**
        - Name of the indicator. This name is what appears in your list of indicators.
        - Optional. Automatically populated by the *incident name*.
    
    - **Created by**
        - Creator of the indicator.
        - Optional. Automatically populated by the user signed in to Microsoft Sentinel.

    Fill in the remaining fields accordingly.

    - **Threat types**
        - The threat type represented by the indicator.
        - Optional. Free text.

    - **Description**
        - Description of the indicator.
        - Optional. Free text.

    - **Revoked**
        - Revoked status of the indicator. Select the checkbox to revoke the indicator. Clear the checkbox to make it active.
        - Optional. Boolean.

    - **Confidence**
        - Score that reflects confidence in the correctness of the data, by percent.
        - Optional. Integer, 1-100.

    - **Kill chains**
        - Phases in the [Lockheed Martin Cyber Kill Chain](https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html#OVERVIEW) to which the indicator corresponds.
        - Optional. Free text.

    - **Valid from**
        - The time from which this indicator is considered valid.
        - Required. Date/time.

    - **Valid until**
        - The time at which this indicator should no longer be considered valid.
        - Optional. Date/time.

    :::image type="content" source="media/add-entity-to-threat-intelligence/new-indicator-panel.png" alt-text="Screenshot that shows entering information in the new threat indicator pane.":::

1. When all the fields are filled in to your satisfaction, select **Apply**. A message appears in the upper-right corner to confirm that your indicator was created.

1. The entity is added as threat intelligence in your workspace. You can find it [in threat intelligence management interface](work-with-threat-indicators.md#view-your-threat-intelligence-in-the-management-interface). You can also query it [using the ThreatIntelligenceIndicators table](work-with-threat-indicators.md#find-and-view-your-indicators-with-queries).

## Related content

In this article, you learned how to add entities to your threat indicator lists. For more information, see the following articles:

- [Investigate incidents with Microsoft Sentinel](investigate-incidents.md)
- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)
- [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md)
