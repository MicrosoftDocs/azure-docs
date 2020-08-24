---
title: Identify internal threats with Azure Sentinel's entity behavior analytics | Microsoft Docs
description:  Create behavioral baselines for entities (users, hostnames, IP addresses) and use them to detect anomalous behavior and identify security threats.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/19/2020
ms.author: yelevin

---
# Identify internal threats with Azure Sentinel's entity behavior analytics

## What is entity behavior analytics?

### The concept

Identifying internal threat sources in your organization, and their potential impact, has always been a labor-intensive process. Sifting through alerts, connecting the dots, and active hunting all add up to massive amounts of effort expended with minimal returns, and the possibility of many internal threats simply evading discovery.

Azure Sentinel’s entity behavioral analytics capability eliminates the drudgery from your analysts’ workloads and the uncertainty from their efforts, and delivers high-fidelity, actionable intelligence, so they can focus on investigation and remediation.

As Azure Sentinel collects logs and alerts from all of its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (users, hosts, IP addresses, applications etc. across time and peer group horizon. Using a variety of techniques and machine learning capabilities, Sentinel can then identify anomalous activity and help you determine if an asset has been compromised. Not only that, but it can also figure out the relative sensitivity of particular assets, identify peer groups of assets, and evaluate the potential impact of any given compromised asset (its “blast radius”). Armed with this information, you can effectively prioritize your investigation and incident handling. 

### Architecture overview

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png" alt-text="Entity behavior analytics architecture":::

*(words about individual components)*

### Maximized value / Security-driven analytics *(section needs work)*

Inspired by Gartner’s definition for User and Entity Behavior Analytics (UEBA) solutions, Azure Sentinel's entity behavioral analytics provides a "top-down" approach based on 3 different dimensions:

- **Use cases** - Researching for relevant attack scenarios that put various entities as victims or pivot points in an attack chain, and adapting those attack vectors into MITRE ATT&CK’s tactics, techniques, and sub techniques terminology, Sentinel EBA focuses only on the most valuable logs each data source can provide.

- **Data Sources** – While seemingly supporting Azure data sources, 3rd party data sources are thoughtfully chosen to provide data that matches our threat use cases.

- **Analytics** – Using various ML algorithms, evidence of anomalous activities are presents in enrichments such as: first time activity, uncommon activity, contextual information, and more. All evidence is provided in a clear, to the point manner, where a TRUE statement represents an anomaly.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/behavior-analytics-top-down.png" alt-text="Behavior analytics top-down approach":::



## Data schema

### Identity info table



### Behavior analytics table


| Field                 | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
| TenantId              | unique ID number of the tenant                                      |
| SourceRecordId        | unique ID number of the EBA event                                   |
| TimeGenerated         | timestamp of the activity's occurrence                              |
| TimeProcessed         | timestamp of when the activity was processed by the EBA engine      |
| ActivityType          | high-level category of the activity                                 |
| ActionType            | normalized *("friendly"?)* name of the activity                     |
| UserName              | name of the user that initiated the activity ***(person's name or username?)*** |
| UserPrincipalName     | FQDN of the user that initiated the activity                        |
| EventSource           | data source that provided the original event                        |
| SourceIPAddress       | IP address from which activity was initiated                        |
| SourceIPLocation      | country from which activity was initiated, enriched from IP address |
| SourceDevice          | name of the device that initiated the activity ***(what kind of name?)*** |
| DestinationIPAddress  | IP address of the target of the activity                            |
| DestinationIPLocation | country of the target of the activity, enriched from IP address     |
| DestinationDevice     | name of the target device                                           |
| UsersInsights         | contextual enrichments of involved users                            |
| DevicesInsights       | contextual enrichments ***(and anomalous activity evidence regarding?)*** involved devices |
| ActivityInsights      | collection of insights about the activity based on our profiling    |
| InvestigationPriority | anomaly score, between 0-10: 0 - benign, 10 – highly anomalous)     |
|


## Next steps
In this document, you learned ... . For practical guidance on using Azure Sentinel's entity behavior analytics capabilites, see the following articles:

- [Enable entity behavior analytics](./aaa.md) in Azure Sentinel.
- [Work with entity pages](./bbb.md).