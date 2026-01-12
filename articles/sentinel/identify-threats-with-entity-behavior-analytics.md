---
title: Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel | Microsoft Docs
description: Create behavioral baselines for entities (users, hostnames, IP addresses) and use them to detect anomalous behavior and identify zero-day advanced persistent threats (APT).
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
ms.custom: sfi-image-nochange


#Customer intent: As a security analyst, I want to leverage User and Entity Behavior Analytics (UEBA) so that I can efficiently detect and prioritize sophisticated threats within my organization.

---

# Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Detecting anomalous behavior inside your organization is complex and slow. Microsoft Sentinel User and Entity Behavior Analytics (UEBA) streamlines anomaly detection and investigation by using machine learning models to build dynamic baselines and peer comparisons for your tenant. Instead of just collecting logs, UEBA learns from your data to surface actionable intelligence that helps analysts detect and investigate anomalies.

This article explains how Microsoft Sentinel UEBA works and how to use UEBA to surface and investigate anomalies and enhance your threat detection capabilities.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

All the benefits of UEBA are available in the Microsoft Defender portal.

## What is UEBA?

As Microsoft Sentinel collects logs and alerts from all of your connected data sources, UEBA uses artificial intelligence (AI) to build baseline behavioral profiles of your organization’s entities - such as users, hosts, IP addresses, and applications - over time and across peer groups. UEBA then identifies anomalous activity and helps you determine whether an asset is compromised. 

UEBA also determines the relative sensitivity of particular assets, identifies peer groups of assets, and evaluates the potential impact of any given compromised asset - its “blast radius”. This information lets you prioritize your investigation, hunting, and incident handling effectively.

### UEBA analytics architecture

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png" alt-text="Entity behavior analytics architecture":::

### Security-driven analytics

Inspired by Gartner’s paradigm for UEBA solutions, Microsoft Sentinel provides an "outside-in" approach, based on three frames of reference:

- **Use cases:** By prioritizing for relevant attack vectors and scenarios based on security research aligned with the MITRE ATT&CK framework of tactics, techniques, and subtechniques that puts various entities as victims, perpetrators, or pivot points in the kill chain; Microsoft Sentinel focuses specifically on the most valuable logs each data source can provide.

- **Data sources:** While first and foremost supporting Azure data sources, Microsoft Sentinel thoughtfully selects third-party data sources to provide data that matches our threat scenarios.

- **Analytics:** Using various machine learning (ML) algorithms, Microsoft Sentinel identifies anomalous activities and presents evidence clearly and concisely in the form of contextual enrichments, some examples of which appear below.

    :::image type="content" source="media/identify-threats-with-entity-behavior-analytics/behavior-analytics-top-down.png" alt-text="Behavior analytics outside-in approach":::

Microsoft Sentinel presents artifacts that help your security analysts get a clear understanding of anomalous activities in context, and in comparison with the user's baseline profile. Actions performed by a user (or a host, or an address) are evaluated contextually, where a "true" outcome indicates an identified anomaly:
- across geographical locations, devices, and environments.
- across time and frequency horizons (compared to user's own history).
- as compared to peers' behavior.
- as compared to organization's behavior.
    :::image type="content" source="media/identify-threats-with-entity-behavior-analytics/context.png" alt-text="Entity context":::

The user entity information that Microsoft Sentinel uses to build its user profiles comes from your Microsoft Entra ID (and/or your on-premises Active Directory, now in Preview). When you enable UEBA, it synchronizes your Microsoft Entra ID with Microsoft Sentinel, storing the information in an internal database visible through the *IdentityInfo* table.

- In Microsoft Sentinel in the Azure portal, you query the *IdentityInfo* table in Log Analytics on the **Logs** page.
- In the Defender portal, you query this table in **Advanced hunting**.

Now in preview, you can also sync your on-premises Active Directory user entity information as well, using Microsoft Defender for Identity.

See [Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](enable-entity-behavior-analytics.md) to learn how to enable UEBA and synchronize user identities.

### Scoring

Each activity is scored with “Investigation Priority Score” – which determine the probability of a specific user performing a specific activity, based on behavioral learning of the user and their peers. Activities identified as the most abnormal receive the highest scores (on a scale of 0-10).

See how behavior analytics is used in [Microsoft Defender for Cloud Apps](https://techcommunity.microsoft.com/t5/microsoft-security-and/prioritize-user-investigations-in-cloud-app-security/ba-p/700136) for an example of how this works.

Learn more about [entities in Microsoft Sentinel](entities.md) and see the full list of [supported entities and identifiers](entities-reference.md).

### Entity pages

Information about **entity pages** can now be found at [Entity pages in Microsoft Sentinel](entity-pages.md).

##  UEBA experiences in the Defender portal empower analysts and streamline workflows

By surfacing anomalies in investigation graphs and user pages, and prompting analysts to incorporate anomaly data in hunting queries, UEBA facilitates faster threat detection, smarter prioritization, and more efficient incident response. 

This section outlines the key UEBA analyst experiences available in the Defender portal when you enable UEBA.

### UEBA insights in user investigations

Analysts can quickly assess user risk using UEBA context displayed in side panels and the Overview tab on all user pages. When unusual behavior is detected, the portal automatically tags users with **UEBA anomalies** helping prioritize investigations based on recent activity. For more information, see [User entity page in Microsoft Defender](https://aka.ms/ueba-entity-details).

Each user page includes a **Top UEBA anomalies** section, showing the top three anomalies from the past 30 days, along with direct links to pre-built anomaly queries and the Sentinel events timeline for deeper analysis.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-user-investigations.png" alt-text="Screenshot that shows the overview tab of the User page for a user with UEBA anomalies in the past 30 days." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-user-investigations.png":::

### Built-in user anomaly queries in incident investigations

During incident investigations, analysts can launch built-in queries directly from incident graphs to retrieve all user anomalies related to the case.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-incident-investigations.png" alt-text="Screenshot that shows an incident graph, highlighting the Go hunt All user anomalies option, which allows analysts to quickly find all anomalies related to the user." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-incident-investigations.png":::

For more information, see [Investigate incidents in the Microsoft Defender portal](https://aka.ms/ueba-go-hunt).

### Enrich Advanced Hunting queries and custom detections with UEBA data

When analysts write Advanced Hunting or custom detection queries using UEBA-related tables, the Defender portal displays a banner that prompts them to join the **Anomalies** table. This helps enrich investigations with behavioral insights and strengthens the overall analysis.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-advanced-hunting.png" alt-text="Screenshot that shows the Advanced Hunting page with a banner that prompts the analyst to join the Anomalies table and enrich their analysis with behavioral insights." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-advanced-hunting.png":::

For more information, see: 
- [Proactively hunt for threats with advanced hunting in Microsoft Defender](/defender-xdr/advanced-hunting-overview).
- [KQL join operator](/kusto/query/join-operator?view=microsoft-sentinel).
- [UEBA data sources](ueba-reference.md#ueba-data-sources).
- [Anomalies detected by the Microsoft Sentinel machine learning engine](anomalies-reference.md).

## Querying behavior analytics data

Using [KQL](/kusto/query/?view=microsoft-sentinel&preserve-view=true), we can query the **BehaviorAnalytics** table.

For example – if we want to find all the cases of a user that failed to sign in to an Azure resource, where it was the user's first attempt to connect from a given country/region, and connections from that country/region are uncommon even for the user's peers, we can use the following query:

```Kusto
BehaviorAnalytics
| where ActivityType == "FailedLogOn"
| where ActivityInsights.FirstTimeUserConnectedFromCountry == True
| where ActivityInsights.CountryUncommonlyConnectedFromAmongPeers == True
```

- In Microsoft Sentinel in the Azure portal, you query the *BehaviorAnalytics* table in Log Analytics on the **Logs** page.
- In the Defender portal, you query this table in **Advanced hunting**.

### User peers metadata - table and notebook

User peers' metadata provides important context in threat detections, in investigating an incident, and in hunting for a potential threat. Security analysts can observe the normal activities of users` peers to determine whether a user's activities are unusual as compared to those of their peers.

Microsoft Sentinel calculates and ranks a user's peers, based on the user’s Microsoft Entra security group membership, mailing list, et cetera, and stores the peers ranked 1-20 in the **UserPeerAnalytics** table. The screenshot below shows the schema of the UserPeerAnalytics table, and displays the top eight-ranked peers of the user Kendall Collins. Microsoft Sentinel uses the *term frequency-inverse document frequency* (TF-IDF) algorithm to normalize the weighing for calculating the rank: the smaller the group, the higher the weight. 

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/user-peers-metadata.png" alt-text="Screen shot of user peers metadata table" lightbox="./media/identify-threats-with-entity-behavior-analytics/user-peers-metadata.png":::

You can use the [Jupyter notebook](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/scenario-notebooks/UserSecurityMetadata) provided in the Microsoft Sentinel GitHub repository to visualize the user peers metadata. For detailed instructions on how to use the notebook, see the [Guided Analysis - User Security Metadata](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/scenario-notebooks/UserSecurityMetadata/Guided%20Analysis%20-%20User%20Security%20Metadata.ipynb) notebook.

> [!NOTE]
> The *UserAccessAnalytics* table has been deprecated.

### Hunting queries and exploration queries

Microsoft Sentinel provides out-of-the-box a set of hunting queries, exploration queries, and the **User and Entity Behavior Analytics** workbook, which is based on the **BehaviorAnalytics** table. These tools present enriched data, focused on specific use cases, that indicate anomalous behavior.

For more information, see:

- [Hunt for threats with Microsoft Sentinel](hunting.md)
- [Visualize and monitor your data](monitor-your-data.md)

As legacy defense tools become obsolete, organizations may have such a vast and porous digital estate that it becomes unmanageable to obtain a comprehensive picture of the risk and posture their environment may be facing. Relying heavily on reactive efforts, such as analytics and rules, enable bad actors to learn how to evade those efforts. This is where UEBA comes to play, by providing risk scoring methodologies and algorithms to figure out what is really happening.

## Aggregate behavior insights with the UEBA behaviors layer (Preview)

As Microsoft Sentinel collects logs from supported data sources, the behaviors layer uses AI to transform raw security logs into structured, contextualized behavioral insights. While UEBA builds baseline profiles to detect anomalous activity, the behaviors layer aggregates related events into meaningful behaviors that explain "who did what to whom."

The behaviors layer enriches raw logs with:
- **MITRE ATT&CK mappings** that align behaviors with known tactics and techniques
- **Entity role identification** that clarifies the actors and targets involved
- **Natural language explanations** that make complex activities immediately understandable

By converting fragmented logs into coherent behavior objects, the behaviors layer accelerates threat hunting, simplifies detection authoring, and provides richer context for UEBA anomaly detection. Together, these capabilities help analysts quickly understand not just *that* something anomalous happened, but *what* happened and *why* it matters.

For more information, see [Translate raw security logs to behavioral insights using UEBA behaviors in Microsoft Sentinel (Preview)](../sentinel/entity-behaviors-layer.md).

## Next steps
In this document, you learned about Microsoft Sentinel's entity behavior analytics capabilities. For practical guidance on implementation, and to use the insights you've gained, see the following articles:

- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md) in Microsoft Sentinel.
- See the [list of anomalies](anomalies-reference.md#ueba-anomalies) detected by the UEBA engine.
- [Investigate incidents with UEBA data](investigate-with-ueba.md).
- [Hunt for security threats](./hunting.md).

For more information, also see the [Microsoft Sentinel UEBA reference](ueba-reference.md).
