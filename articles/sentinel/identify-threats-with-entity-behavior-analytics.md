---
title: Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel | Microsoft Docs
description: Create behavioral baselines for entities (users, hostnames, IP addresses) and use them to detect anomalous behavior and identify zero-day advanced persistent threats (APT).
author: yelevin
ms.topic: conceptual
ms.date: 08/08/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]


Identifying threats inside your organization and their potential impact - whether a compromised entity or a malicious insider - has always been a time-consuming and labor-intensive process. Sifting through alerts, connecting the dots, and active hunting all add up to massive amounts of time and effort expended with minimal returns, and the possibility of sophisticated threats simply evading discovery. Particularly elusive threats like zero-day, targeted, and advanced persistent threats can be the most dangerous to your organization, making their detection all the more critical.

The UEBA capability in Microsoft Sentinel eliminates the drudgery from your analysts’ workloads and the uncertainty from their efforts, and delivers high-fidelity, actionable intelligence, so they can focus on investigation and remediation.

## What is User and Entity Behavior Analytics (UEBA)?

As Microsoft Sentinel collects logs and alerts from all of its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (such as users, hosts, IP addresses, and applications) across time and peer group horizon. Using a variety of techniques and machine learning capabilities, Microsoft Sentinel can then identify anomalous activity and help you determine if an asset has been compromised. Not only that, but it can also figure out the relative sensitivity of particular assets, identify peer groups of assets, and evaluate the potential impact of any given compromised asset (its “blast radius”). Armed with this information, you can effectively prioritize your investigation and incident handling. 

### UEBA analytics architecture

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png" alt-text="Entity behavior analytics architecture":::

### Security-driven analytics

Inspired by Gartner’s paradigm for UEBA solutions, Microsoft Sentinel provides an "outside-in" approach, based on three frames of reference:

- **Use cases:** By prioritizing for relevant attack vectors and scenarios based on security research aligned with the MITRE ATT&CK framework of tactics, techniques, and sub-techniques that puts various entities as victims, perpetrators, or pivot points in the kill chain; Microsoft Sentinel focuses specifically on the most valuable logs each data source can provide.

- **Data Sources:** While first and foremost supporting Azure data sources, Microsoft Sentinel thoughtfully selects third-party data sources to provide data that matches our threat scenarios.

- **Analytics:** Using various machine learning (ML) algorithms, Microsoft Sentinel identifies anomalous activities and presents evidence clearly and concisely in the form of contextual enrichments, some examples of which appear below.

    :::image type="content" source="media/identify-threats-with-entity-behavior-analytics/behavior-analytics-top-down.png" alt-text="Behavior analytics outside-in approach":::

Microsoft Sentinel presents artifacts that help your security analysts get a clear understanding of anomalous activities in context, and in comparison with the user's baseline profile. Actions performed by a user (or a host, or an address) are evaluated contextually, where a "true" outcome indicates an identified anomaly:
- across geographical locations, devices, and environments.
- across time and frequency horizons (compared to user's own history).
- as compared to peers' behavior.
- as compared to organization's behavior.
    :::image type="content" source="media/identify-threats-with-entity-behavior-analytics/context.png" alt-text="Entity context":::

The user entity information that Microsoft Sentinel uses to build its user profiles comes from your Microsoft Entra ID (and/or your on-premises Active Directory, now in Preview). When you enable UEBA, it synchronizes your Microsoft Entra ID with Microsoft Sentinel, storing the information in an internal database visible through the *IdentityInfo* table in Log Analytics.

Now in preview, you can also sync your on-premises Active Directory user entity information as well, using Microsoft Defender for Identity.

See [Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](enable-entity-behavior-analytics.md) to learn how to enable UEBA and synchronize user identities.

### Scoring

Each activity is scored with “Investigation Priority Score” – which determine the probability of a specific user performing a specific activity, based on behavioral learning of the user and their peers. Activities identified as the most abnormal receive the highest scores (on a scale of 0-10).

See how behavior analytics is used in [Microsoft Defender for Cloud Apps](https://techcommunity.microsoft.com/t5/microsoft-security-and/prioritize-user-investigations-in-cloud-app-security/ba-p/700136) for an example of how this works.

Learn more about [entities in Microsoft Sentinel](entities.md) and see the full list of [supported entities and identifiers](entities-reference.md).

### Entity pages

Information about **entity pages** can now be found at [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md).

## Querying behavior analytics data

Using [KQL](/azure/data-explorer/kusto/query/), we can query the Behavioral Analytics Table.

For example – if we want to find all the cases of a user that failed to sign in to an Azure resource, where it was the user's first attempt to connect from a given country/region, and connections from that country/region are uncommon even for the user's peers, we can use the following query:

```Kusto
BehaviorAnalytics
| where ActivityType == "FailedLogOn"
| where ActivityInsights.FirstTimeUserConnectedFromCountry == True
| where ActivityInsights.CountryUncommonlyConnectedFromAmongPeers == True
```

### User peers metadata - table and notebook

User peers' metadata provides important context in threat detections, in investigating an incident, and in hunting for a potential threat. Security analysts can observe the normal activities of a user's peers to determine if the user's activities are unusual as compared to those of his or her peers.

Microsoft Sentinel calculates and ranks a user's peers, based on the user’s Microsoft Entra security group membership, mailing list, et cetera, and stores the peers ranked 1-20 in the **UserPeerAnalytics** table. The screenshot below shows the schema of the UserPeerAnalytics table, and displays the top eight-ranked peers of the user Kendall Collins. Microsoft Sentinel uses the *term frequency-inverse document frequency* (TF-IDF) algorithm to normalize the weighing for calculating the rank: the smaller the group, the higher the weight. 

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/user-peers-metadata.png" alt-text="Screen shot of user peers metadata table":::

You can use the [Jupyter notebook](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/scenario-notebooks/UserSecurityMetadata) provided in the Microsoft Sentinel GitHub repository to visualize the user peers metadata. For detailed instructions on how to use the notebook, see the [Guided Analysis - User Security Metadata](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/scenario-notebooks/UserSecurityMetadata/Guided%20Analysis%20-%20User%20Security%20Metadata.ipynb) notebook.

### Permission analytics - table and notebook

Permission analytics helps determine the potential impact of the compromising of an organizational asset by an attacker. This impact is also known as the asset's "blast radius." Security analysts can use this information to prioritize investigations and incident handling.

Microsoft Sentinel determines the direct and transitive access rights held by a given user to Azure resources, by evaluating the Azure subscriptions the user can access directly or via groups or service principals. This information, as well as the full list of the user's Microsoft Entra security group membership, is then stored in the **UserAccessAnalytics** table. The screenshot below shows a sample row in the UserAccessAnalytics table, for the user Alex Johnson. **Source entity** is the user or service principal account, and **target entity** is the resource that the source entity has access to. The values of **access level** and **access type** depend on the access-control model of the target entity. You can see that Alex has Contributor access to the Azure subscription *Contoso Hotels Tenant*. The access control model of the subscription is Azure RBAC.

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/user-access-analytics.png" alt-text="Screen shot of user access analytics table":::

You can use the [Jupyter notebook](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/scenario-notebooks/UserSecurityMetadata) (the same notebook mentioned above) from the Microsoft Sentinel GitHub repository to visualize the permission analytics data. For detailed instructions on how to use the notebook, see the [Guided Analysis - User Security Metadata](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/scenario-notebooks/UserSecurityMetadata/Guided%20Analysis%20-%20User%20Security%20Metadata.ipynb) notebook.

### Hunting queries and exploration queries

Microsoft Sentinel provides out-of-the-box a set of hunting queries, exploration queries, and the **User and Entity Behavior Analytics** workbook, which is based on the **BehaviorAnalytics** table. These tools present enriched data, focused on specific use cases, that indicate anomalous behavior.

For more information, see:

- [Hunt for threats with Microsoft Sentinel](hunting.md)
- [Visualize and monitor your data](monitor-your-data.md)

As legacy defense tools become obsolete, organizations may have such a vast and porous digital estate that it becomes unmanageable to obtain a comprehensive picture of the risk and posture their environment may be facing. Relying heavily on reactive efforts, such as analytics and rules, enable bad actors to learn how to evade those efforts. This is where UEBA comes to play, by providing risk scoring methodologies and algorithms to figure out what is really happening.


## Next steps
In this document, you learned about Microsoft Sentinel's entity behavior analytics capabilities. For practical guidance on implementation, and to use the insights you've gained, see the following articles:

- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md) in Microsoft Sentinel.
- See the [list of anomalies](anomalies-reference.md#ueba-anomalies) detected by the UEBA engine.
- [Investigate incidents with UEBA data](investigate-with-ueba.md).
- [Hunt for security threats](./hunting.md).

For more information, also see the [Microsoft Sentinel UEBA reference](ueba-reference.md).
