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

### Entity pages

When you select any entity (user, host, URL, IP address…) in an alert or an investigation, you will land on an **entity page**, which is basically a portfolio of relevant information about that entity. Each type of entity has its own unique page, since information about users and about hosts will not be of the same type. On the user entity page, you will find basic information about the user, a list of recent events involving the user, summary counts of various types of alerts, and …

### Architecture overview

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png" alt-text="Entity behavior analytics architecture":::

*(words about individual components)*

### Maximized value / Security-driven analytics *(section needs work)*

Inspired by Gartner’s definition for User and Entity Behavior Analytics (UEBA) solutions, Azure Sentinel's entity behavioral analytics provides a "top-down" approach based on 3 different dimensions:

- **Use cases** - Researching for relevant attack scenarios that put various entities as victims or pivot points in an attack chain, and adapting those attack vectors into MITRE ATT&CK’s tactics, techniques, and sub techniques terminology, Sentinel EBA focuses only on the most valuable logs each data source can provide.

- **Data Sources** – While seemingly supporting Azure data sources, 3rd party data sources are thoughtfully chosen to provide data that matches our threat use cases.

- **Analytics** – Using various ML algorithms, evidence of anomalous activities are presents in enrichments such as: first time activity, uncommon activity, contextual information, and more. All evidence is provided in a clear, to the point manner, where a TRUE statement represents an anomaly.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/behavior-analytics-top-down.png" alt-text="Behavior analytics top-down approach":::

Anomalies provide 'evidence' that helps SecOps get a clear understanding of the context, and the profiling of the user.

The evidence includes information about:
- Context – Geo location, device information & TI
- User behavior 
- User Peers behavior
- Organization behavior

    :::image type="content" source="media/identify-threats-with-entity-behavior-analytics/context.png" alt-text="Entity context":::

## Data schema

### Identity info table

*(to be added later)*

### Behavior analytics table


| Field                 | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
| TenantId              | unique ID number of the tenant                                      |
| SourceRecordId        | unique ID number of the EBA event                                   |
| TimeGenerated         | timestamp of the activity's occurrence                              |
| TimeProcessed         | timestamp of when the activity was processed by the EBA engine      |
| ActivityType          | high-level category of the activity                                 |
| ActionType            | normalized *("friendly"?)* name of the activity                     |
| UserName              | username of the user that initiated the activity                    |
| UserPrincipalName     | FQDN of the user that initiated the activity                        |
| EventSource           | data source that provided the original event                        |
| SourceIPAddress       | IP address from which activity was initiated                        |
| SourceIPLocation      | country from which activity was initiated, enriched from IP address |
| SourceDevice          | hostname of the device that initiated the activity                  |
| DestinationIPAddress  | IP address of the target of the activity                            |
| DestinationIPLocation | country of the target of the activity, enriched from IP address     |
| DestinationDevice     | name of the target device                                           |
| UsersInsights         | contextual enrichments of involved users                            |
| DevicesInsights       | contextual enrichments of involved devices                          |
| ActivityInsights      | collection of insights about the activity based on our profiling    |
| InvestigationPriority | anomaly score, between 0-10: 0 - benign, 10 – highly anomalous)     |
|

### Scoring

Each activity is scored with “Investigation Priority Score” – which determine the probability of a specific user performing a specific activity, based on behavioral learning of the user and their peers. Activities identified as the most abnormal receive the highest scores (on a scale of 0-10).

See how behavior analytics is used in [Microsoft Cloud App Security](https://techcommunity.microsoft.com/t5/microsoft-security-and/prioritize-user-investigations-in-cloud-app-security/ba-p/700136) for an example of how this works.

Using [KQL](https://docs.microsoft.com/azure/data-explorer/kusto/query/), we can query the Behavioral Analytics Table.

For example – in case we’d like to find all the users that failed to login to an Azure, while it was the first attempt to connect from a certain country and is even uncommon for their peers, we can use the following query:

```Kusto
BehaviorAnalytics
| where ActivityType == "FailedLogOn"
| where FirstTimeUserConnectedFromCountry == True
| where CountryUncommonlyConnectedFromAmongPeers == True
```

### User peers metadata - table and notebook

User peers' metadata provides important context in threat detections, in investigating an incident, and in hunting for a potential threat. Security analysts can observe the normal activities of a user's peers to determine if the user's activities are unusual as compared to those of his/her peers.

The UserPeerAnalytics table provides a ranked list of a user's peers, based on the user’s group membership in Azure Active Directory. For example, if the user is Guy Malul, Peer Analytics calculates all of Guy’s peers based on his mailing list, security groups, et cetera, and provides all his peers in the top 20 ranking in the table. The screenshot below shows the schema of UserPeerAnalytics table and an example of a row in the table. One of the peers of Guy is Pini. His peer rank is 18. The TF-IDF algorithm is used to normalize the weighing for calculating the rank: the smaller the group, the higher the weight. 

### Permission analytics - table and notebook

The UserAccessAnalytics table provides the list of direct and transitive access rights to Azure resources for a given user. For example, if the user under investigation is Jane Smith, Access Analytics calculates all the Azure subscriptions that she can access either directly or transitively via groups or service principals. It also lists all the Azure Active Directory security groups of which Jane is a member. The screenshot below shows a sample row in the UserAccessAnalytics table. **Source entity** is the user or service principal account and **target entity** is the resource that the source entity has access to. The values of **access level** and **access type** depend on the access-control model of the target entity. You can see Jane has Contributor access to Azure subscription *Contoso Azure Production 1*. The access control model of the subscription is RBAC.   


## Next steps
In this document, you learned ... . For practical guidance on using Azure Sentinel's entity behavior analytics capabilites, see the following articles:

- [Enable entity behavior analytics](./aaa.md) in Azure Sentinel.
- [Work with entity pages](./bbb.md).