---
title: Investigate entities with entity pages in Microsoft Sentinel
description: Use entity pages to get information about entities that you come across in your incident investigations. Gain insights into entity activities and assess risk.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 01/17/2023
---

# Investigate entities with entity pages in Microsoft Sentinel

When you come across a user account, a hostname / IP address, or an Azure resource in an incident investigation, you may decide you want to know more about it. For example, you might want to know its activity history, whether it's appeared in other alerts or incidents, whether it's done anything unexpected or out of character, and so on. In short, you want information that can help you determine what sort of threat these entities represent and guide your investigation accordingly.

## Entity pages

In these situations, you can select the entity (it will appear as a clickable link) and be taken to an **entity page**, a datasheet full of useful information about that entity. You can also arrive at an entity page by searching directly for entities on the Microsoft Sentinel **entity behavior** page. The types of information you will find on entity pages include basic facts about the entity, a timeline of notable events related to this entity and insights about the entity's behavior.

More specifically, entity pages consist of three parts:

- The left-side panel contains the entity's identifying information, collected from data sources like Azure Active Directory, Azure Monitor, Azure Activity, Azure Resource Manager, Microsoft Defender for Cloud, CEF/Syslog, and Microsoft 365 Defender (with all its components).

- The center panel shows a [graphical and textual timeline](#the-timeline) of notable events related to the entity, such as alerts, bookmarks, [anomalies](soc-ml-anomalies.md), and activities. Activities are aggregations of notable events from Log Analytics. The queries that detect those activities are developed by Microsoft security research teams, and you can now [add your own custom queries to detect activities](customize-entity-activities.md) of your choosing. 

- The right-side panel presents [behavioral insights](#entity-insights) on the entity. These insights are continuously developed by Microsoft security research teams. They are based on various data sources and provide context for the entity and its observed activities, helping you to quickly identify [anomalous behavior](soc-ml-anomalies.md) and security threats.

If you're investigating an incident using the **[new investigation experience](investigate-incidents.md) (now in Preview)**, you'll be able to see a panelized version of the entity page right inside the incident details page. You have a [list of all the entities in a given incident](investigate-incidents.md#explore-the-incidents-entities), and selecting an entity opens a side panel with three "cards"&mdash;**Info**, **Timeline**, and **Insights**&mdash; showing all the same information described above, within the specific time frame corresponding with that of the alerts in the incident.

## The timeline

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/entity-pages-timeline.png" alt-text="Screenshot of an example of a timeline on an entity page.":::

The timeline is a major part of the entity page's contribution to behavior analytics in Microsoft Sentinel. It presents a story about entity-related events, helping you understand the entity's activity within a specific time frame.

You can choose the **time range** from among several preset options (such as *last 24 hours*), or set it to any custom-defined time frame. Additionally, you can set filters that limit the information in the timeline to specific types of events or alerts.

The following types of items are included in the timeline:

- Alerts - any alerts in which the entity is defined as a **mapped entity**. Note that if your organization has created [custom alerts using analytics rules](./detect-threats-custom.md), you should make sure that the rules' entity mapping is done properly.

- Bookmarks - any bookmarks that include the specific entity shown on the page.

- Anomalies - UEBA detections based on dynamic baselines created for each entity across various data inputs and against its own historical activities, those of its peers, and those of the organization as a whole.

- Activities - aggregation of notable events relating to the entity. A wide range of activities are collected automatically, and you can now [customize this section by adding activities](customize-entity-activities.md) of your own choosing.

## Entity insights

Entity insights are queries defined by Microsoft security researchers to help your analysts investigate more efficiently and effectively. The insights are presented as part of the entity page, and provide valuable security information on hosts and users, in the form of tabular data and charts. Having the information here means you don't have to detour to Log Analytics. The insights include data regarding sign-ins, group additions, anomalous events and more, and include advanced ML algorithms to detect anomalous behavior.

The insights are based on the following data sources:

- Syslog (Linux)
- SecurityEvent (Windows)
- AuditLogs (Azure AD)
- SigninLogs (Azure AD)
- OfficeActivity (Office 365)
- BehaviorAnalytics (Microsoft Sentinel UEBA)
- Heartbeat (Azure Monitor Agent)
- CommonSecurityLog (Microsoft Sentinel)

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
- IoT device (**Preview**)

## Next steps

In this document, you learned about getting information about entities in Microsoft Sentinel using entity pages. For more information about entities and how you can use them, see the following articles:

- [Classify and analyze data using entities in Microsoft Sentinel](entities.md).
- [Customize activities on entity page timelines](customize-entity-activities.md).
- [Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)
- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md) in Microsoft Sentinel.
- [Hunt for security threats](./hunting.md).
