---
title: TBD | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Migrate QRadar detection rules

## Identify rules

https://www.microsoft.com/security/blog/2021/08/18/migrating-content-from-traditional-siems-to-azure-sentinel/ 

Mapping detection rules from your SIEM to map to Microsoft Sentinel rules is critical. 
- Understand Microsoft Sentinel rules. Azure Sentinel has four built-in rule types:
    - Alert grouping: Reduces alert fatigue by grouping up to 150 alerts within a given timeframe, using three alert grouping options: matching entities, alerts triggered by the scheduled rule, and matches of specific entities.
    - Entity mapping: Enables your SecOps engineers to define entities to be tracked during the investigation. Entity mapping also makes it possible for analysts to take advantage of the intuitive Investigation Graph to reduce time and effort.
    - Evidence summary: Surfaces events, alerts, and bookmarks associated with a particular incident within the preview pane. Entities and tactics also show up in the incident pane—providing a snapshot of essential details and enabling faster triage.
    - KQL: The request is sent to a Log Analytics database and is stated in plain text, using a data-flow model that makes the syntax easy to read, author, and automate. Because several other Microsoft services also store data in Azure Log Analytics or Azure Data Explorer, this reduces the learning curve needed to query or correlate.
- Check you understand rule terminology using the diagram below.
- Don’t migrate all rules without consideration. Focus on quality, not quantity.
- Leverage existing functionality, and check whether Microsoft Sentinel’s built-in analytics rules might address your current use cases. Because Microsoft Sentinel uses machine learning analytics to produce high-fidelity and actionable incidents, it’s likely that some of your existing detections won’t be required anymore.
- Confirm connected data sources and review your data connection methods. Revisit data collection conversations to ensure data depth and breadth across the use cases you plan to detect.
- Explore community resources such as SOC Prime Threat Detection Marketplace to check whether  your rules are available.
- Consider whether an online query converter such as Uncoder.io conversion tool might work for your rules? 
- If rules aren’t available or can’t be converted, they need to be created manually, using a KQL query. Review the Splunk to Kusto Query Language map.

## Compare rule terminology (pulled in from blog)

(from https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417)

This graphic helps you to clarify the concept of a rule in Microsoft Sentinel compared with other SIEMs.

TBD


## Migrate rules

Add table from GitHub