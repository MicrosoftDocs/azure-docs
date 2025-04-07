---
title: Entity pages in Microsoft Sentinel
description: Entity pages display information about entities surfaced in your alerts, or that you otherwise come across in your incident investigations. Among this information is the timeline of alerts involving the entity, and curated insights into entity activities. Entity pages provide a rich foundation and context for your investigations, helping you detect, analyze, mitigate, and respond to security threats.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to access detailed entity pages in Microsoft Sentinel so that I can efficiently investigate and respond to security incidents.

---

# Entity pages in Microsoft Sentinel

When you come across a user account, a hostname, an IP address, or an Azure resource in an incident investigation, you may decide you want to know more about it. For example, you might want to know its activity history, whether it's appeared in other alerts or incidents, whether it's done anything unexpected or out of character, and so on. In short, you want information that can help you determine what sort of threat these entities represent and guide your investigation accordingly.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Entity pages

In these situations, you can select the entity (it will appear as a clickable link) and be taken to an **entity page**, a datasheet full of useful information about that entity. You can also arrive at an entity page by searching directly for entities on the Microsoft Sentinel **entity behavior** page. The types of information you will find on entity pages include basic facts about the entity, a timeline of notable events related to this entity and insights about the entity's behavior.

More specifically, entity pages consist of three parts:

- The left-side panel contains the entity's identifying information, collected from data sources like Microsoft Entra ID, Azure Monitor, Azure Activity, Azure Resource Manager, Microsoft Defender for Cloud, CEF/Syslog, and Microsoft Defender XDR (with all its components).

- The center panel shows a [graphical and textual timeline](#the-timeline) of notable events related to the entity, such as alerts, bookmarks, [anomalies](soc-ml-anomalies.md), and activities. Activities are aggregations of notable events from Log Analytics. The queries that detect those activities are developed by Microsoft security research teams, and you can now [add your own custom queries to detect activities](customize-entity-activities.md) of your choosing. 

- The right-side panel presents [behavioral insights](#entity-insights) on the entity. These insights are continuously developed by Microsoft security research teams. They are based on various data sources and provide context for the entity and its observed activities, helping you to quickly identify [anomalous behavior](soc-ml-anomalies.md) and security threats.

If you're investigating an incident using the **[new investigation experience](investigate-incidents.md)**, you'll be able to see a panelized version of the entity page right inside the incident details page. You have a [list of all the entities in a given incident](investigate-incidents.md#explore-the-incidents-entities), and selecting an entity opens a side panel with three "cards"&mdash;**Info**, **Timeline**, and **Insights**&mdash; showing all the same information described above, within the specific time frame corresponding with that of the alerts in the incident.

If you're using the **[Microsoft Sentinel in the Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2263690)**, the **timeline** and **insights** panels appear in the **Sentinel events** tab of the Defender entity page.

# [Azure portal](#tab/azure-portal)

:::image type="content" source="./media/entity-pages/entity-page-sentinel.png" alt-text="Screenshot of an example of an entity page in the Azure portal." lightbox="./media/entity-pages/entity-page-sentinel.png":::

# [Defender portal](#tab/defender-portal)

:::image type="content" source="./media/entity-pages/entity-pages-timeline-defender.png" alt-text="Screenshot of an example of an entity page in the Defender portal." lightbox="./media/entity-pages/entity-pages-timeline-defender.png":::

---

## The timeline

# [Azure portal](#tab/azure-portal)

The timeline is a major part of the entity page's contribution to behavior analytics in Microsoft Sentinel. It presents a story about entity-related events, helping you understand the entity's activity within a specific time frame.

You can choose the **time range** from among several preset options (such as *last 24 hours*), or set it to any custom-defined time frame. Additionally, you can set filters that limit the information in the timeline to specific types of events or alerts.

The following types of items are included in the timeline.

- **Alerts**: any alerts in which the entity is defined as a **mapped entity**. Note that if your organization has created [custom alerts using analytics rules](./detect-threats-custom.md), you should make sure that the rules' entity mapping is done properly.

- **Bookmarks**: any bookmarks that include the specific entity shown on the page.

- **Anomalies**: UEBA detections based on dynamic baselines created for each entity across various data inputs and against its own historical activities, those of its peers, and those of the organization as a whole.

- **Activities**: aggregation of notable events relating to the entity. A wide range of activities are collected automatically, and you can now [customize this section by adding activities](customize-entity-activities.md) of your own choosing.

:::image type="content" source="./media/entity-pages/entity-pages-timeline-sentinel.png" alt-text="Screenshot of an example of a timeline on an entity page in the Azure portal." lightbox="./media/entity-pages/entity-pages-timeline-sentinel.png":::

# [Defender portal](#tab/defender-portal)

The timeline on the [**Sentinel events** tab](/defender-xdr/entity-page-device#sentinel-events-tab) adds a major part of the entity page's contribution to behavior analytics in the Defender portal. It presents a story about entity-related events, helping you understand the entity's activity within a specific time frame.

In particular, you'll see on the Sentinel events timeline alerts and events from third-party sources collected only by Microsoft Sentinel, such as syslog/CEF and custom logs ingested through the Azure Monitor Agent or custom connectors.

The following types of items are included in the timeline.

- **Alerts**: any alerts in which the entity is defined as a **mapped entity**. If your organization created [custom alerts using analytics rules](./detect-threats-custom.md), make sure that the rules' entity mapping is done properly.

- **Bookmarks**: any bookmarks that include the specific entity shown on the page.

- **Anomalies**: [UEBA detections](./anomalies-reference.md) based on dynamic baselines created for each entity across various data inputs and against its own historical activities, those of its peers, and those of the organization as a whole.

- **Activities**: aggregation of notable events relating to the entity. A wide range of activities are collected automatically, and you can now [customize this section by adding activities](customize-entity-activities.md) of your own choosing.

    For device entities, a new activity type was added in January 2025. This activity includes dropped, blocked, or denied network traffic originating from a given device, based on data collected from industry-leading network device logs. These logs provide your security teams with critical information to quickly identify and address potential threats.

As of January 2025, **activities** for the device entity are visible on the main [*Timeline* tab](/defender-xdr/entity-page-device#timeline-tab) of the [device entity page](/defender-xdr/entity-page-device), as well as remaining visible on the Sentinel events tab as before. For more information, see [Unified timeline (Preview)](/defender-xdr/entity-page-device#unified-timeline-preview).

:::image type="content" source="./media/entity-pages/entity-pages-timeline-defender.png" alt-text="Screenshot of an example of a timeline on an entity page in the Defender portal." lightbox="./media/entity-pages/entity-pages-timeline-defender.png":::

This timeline displays information from the past 24 hours. This period is not currently adjustable.

---

## Entity insights

Entity insights are queries defined by Microsoft security researchers to help your analysts investigate more efficiently and effectively. The insights are presented as part of the entity page, and provide valuable security information on hosts and users, in the form of tabular data and charts. Having the information here means you don't have to detour to Log Analytics. The insights include data regarding sign-ins, group additions, anomalous events and more, and include advanced ML algorithms to detect anomalous behavior.

The insights are based on the following data sources:

- Syslog (Linux)
- SecurityEvent (Windows)
- AuditLogs (Microsoft Entra ID)
- SigninLogs (Microsoft Entra ID)
- OfficeActivity (Office 365)
- BehaviorAnalytics (Microsoft Sentinel UEBA)
- Heartbeat (Azure Monitor Agent)
- CommonSecurityLog (Microsoft Sentinel)

Generally speaking, each entity insight displayed on the entity page is accompanied by a link that will take you to a page where the query underlying the insight is displayed, along with the results, so you can examine the results in greater depth.

- In Microsoft Sentinel in the Azure portal, the link takes you to the **Logs** page.
- In the Microsoft Defender portal, the link takes you to the **Advanced hunting** page.

## How to use entity pages

Entity pages are designed to be part of multiple usage scenarios, and can be accessed from incident management, the investigation graph, bookmarks, or directly from the entity search page under **Entity behavior** in the Microsoft Sentinel main menu.

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/entity-pages-use-cases.png" alt-text="Diagram of areas from which you can access entity pages, corresponding with use cases.":::

Entity page information is stored in the **BehaviorAnalytics** table, described in detail in the [Microsoft Sentinel UEBA reference](ueba-reference.md).

## Supported entity pages

Microsoft Sentinel currently offers the following entity pages:

- User account
- Host
- IP address (**Preview**)

    > [!NOTE]
    > The **IP address entity page** (now in preview) contains **geolocation data** supplied by the **Microsoft Threat Intelligence service**. This service combines geolocation data from Microsoft solutions and third-party vendors and partners. The data is then available for analysis and investigation in the context of a security incident. For more information, see also [Enrich entities in Microsoft Sentinel with geolocation data via REST API (Public preview)](geolocation-data-api.md).

- Azure resource (**Preview**)
- IoT device (**Preview**)&mdash;only in Microsoft Sentinel in the Azure portal for now.
## Next steps

In this document, you learned about getting information about entities in Microsoft Sentinel using entity pages. For more information about entities and how you can use them, see the following articles:

- [Learn about entities in Microsoft Sentinel](entities.md).
- [Customize activities on entity page timelines](customize-entity-activities.md).
- [Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)
- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md) in Microsoft Sentinel.
- [Hunt for security threats](./hunting.md).
