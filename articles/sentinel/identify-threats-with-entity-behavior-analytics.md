---
title: Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel
description: Create behavioral baselines for entities (users, hostnames, IP addresses) and use them to detect anomalous behavior and identify zero-day advanced persistent threats (APT).
author: guywi-ms
ms.author: guywild
ms.topic: concept-article
ms.date: 12/15/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
ms.custom: sfi-image-nochange

#Customer intent: As a security analyst, I want to leverage User and Entity Behavior Analytics (UEBA) so that I can efficiently detect and prioritize sophisticated threats within my organization.

---

# Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel

Detecting anomalous behavior within an organization is often complex and time-consuming. Microsoft Sentinel's User and Entity Behavior Analytics (UEBA) simplifies this challenge by continuously learning from your data to surface meaningful anomalies that help analysts detect and investigate potential threats more effectively.

This article explains what Microsoft Sentinel User and Entity Behavior Analytics (UEBA) is, how it works, how to onboard to it, and how to use UEBA to detect and investigate anomalies to enhance your threat detection capabilities.

## How UEBA works

Microsoft Sentinel UEBA uses machine learning to build dynamic behavioral profiles for users, hosts, IP addresses, applications, and other entities. It then detects anomalies by comparing current activity to established baselines, helping security teams identify threats such as **compromised accounts**, **insider attacks**, and **lateral movement**. 

As Microsoft Sentinel ingests data from connected sources, UEBA applies: 
- **Behavioral modeling** to detect deviations
- **Peer group analysis** and **blast radius evaluation** to assess the impact of anomalous activity

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/context.png" alt-text="Diagram of concentric circles labeled User, Peers, and Organization, illustrating entity context in UEBA analysis.":::

UEBA assigns [risk scores](#ueba-scoring) to anomalous behaviors, taking into account the associated entities, severity of the anomaly, and context, including:

- Deviations across geographical locations, devices, and environments  
- Changes over time and activity frequency compared to the entity’s historical behavior  
- Differences compared to peer groups  
- Deviations from organization-wide behavior patterns  

This diagram shows how you enable UEBA, and how UEBA analyzes data and assigns [risk scores](#ueba-scoring) to prioritize investigations:

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png" alt-text="Diagram showing UEBA architecture, illustrating how data flows from connected sources through behavioral modeling to produce risk scores." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-architecture.png":::

For more information about UEBA tables, see [Investigate anomalies using UEBA data](#investigate-anomalies-using-ueba-data). 

For more information about which anomalies UEBA detects, see [Anomalies detected by the Microsoft Sentinel machine learning engine](anomalies-reference.md#ueba-anomalies).

UEBA is natively integrated into Microsoft Sentinel and the Microsoft Defender portal, providing a seamless experience for security operations teams and embedded experiences that enhance threat investigation and response.

## Enable UEBA to create behavior profiles and detect anomalies

To fully benefit from UEBA's advanced threat detection capabilities: 

1. **Enable UEBA in Microsoft Sentinel and connect key data sources**, such as Microsoft Entra ID, Defender for Identity, and Office 365. For more information, see [Enable entity behavior analytics](enable-entity-behavior-analytics.md).

1. **Install the UEBA Essentials solution**, a collection of dozens of pre-built hunting queries curated and maintained by Microsoft security experts. The solution includes multi-cloud anomaly detection queries across Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), and Okta. Installing the solution helps you get started quickly with threat hunting and investigations using UEBA data, instead of building these detection capabilities from scratch.

    For information about installing Microsoft Sentinel solutions, see [Install or update Microsoft Sentinel solutions](sentinel-solutions-deploy.md#install-or-update-content). 
  
1. **Integrate UEBA insights** into workbooks, incident workflows, and hunting queries to maximize their value across your SOC workflows.

## Investigate anomalies using UEBA data

Microsoft Sentinel stores UEBA insights across several tables, each optimized for a different purpose. Analysts commonly correlate data across these tables to investigate anomalous behavior end to end.

This table provides an overview of the data in each of the UEBA tables: 

| Table | Purpose | Key details |
|-------|---------|-------------|
| [IdentityInfo](ueba-reference.md#identityinfo-table) | Detailed profiles of entities (users, devices, groups) | Built from Microsoft Entra ID and optionally on-premises Active Directory through Microsoft Defender for Identity. Essential for understanding user behavior. |
| [BehaviorAnalytics](/azure/azure-monitor/reference/tables/behavioranalytics) | Enriched behavioral data with geolocation and threat intelligence | Contains deviations from baseline with prioritization scores. Data depends on enabled connectors (Entra ID, AWS, GCP, Okta, and so on). |
| [UserPeerAnalytics](/azure/azure-monitor/reference/tables/userpeeranalytics) | Dynamically calculated peer groups for behavioral baselines | Ranks top 20 peers based on security group membership, mailing lists, and other associations. Uses TF-IDF (term frequency–inverse document frequency) algorithm (smaller groups carry higher weight). |
| [Anomalies](/azure/azure-monitor/reference/tables/anomalies) | Events identified as anomalous | Supports detection and investigation workflows. |
| [SentinelBehaviorInfo](/azure/azure-monitor/reference/tables/sentinelbehaviorinfo) | Summary of behaviors identified in raw logs | Translates raw security logs into structured "who did what to whom" summaries with natural language explanations and MITRE ATT&CK mappings.  |
| [SentinelBehaviorEntities](/azure/azure-monitor/reference/tables/sentinelbehaviorentities) | Profiles of entities involved in identified behaviors | Information about entities - such as files, processes, devices, and users - involved in detected behaviors. |

> [!NOTE]
> The [UEBA behaviors layer](#aggregate-behavior-insights-with-the-ueba-behaviors-layer) is a separate capability that you enable independently from UEBA. The `SentinelBehaviorInfo` and `SentinelBehaviorEntities` tables are only created in your workspace if you enable the behaviors layer.

This screenshot shows an example of data in the `UserPeerAnalytics` table with the eight highest-ranked peers for the user Kendall Collins. Sentinel uses the TF-IDF algorithm to normalize weights when calculating peer ranks. Smaller groups carry higher weight.

:::image type="content" source="./media/identify-threats-with-entity-behavior-analytics/user-peers-metadata.png" alt-text="Screenshot of user peers metadata table." lightbox="./media/identify-threats-with-entity-behavior-analytics/user-peers-metadata.png":::

For more detailed information about UEBA data and how to use it, see:
- [UEBA reference](ueba-reference.md) for a detailed reference of all UEBA-related tables and fields.
- [Anomalies detected by the Microsoft Sentinel machine learning engine](anomalies-reference.md) for a list of anomalies that UEBA detects.

### UEBA scoring

UEBA provides two scores to help security teams prioritize investigations and detect anomalies effectively:

| Aspect | Investigation priority score | Anomaly score |
|--------|------------------------------|---------------|
| **Table** | `BehaviorAnalytics` | `Anomalies` |
| **Field** | `InvestigationPriority` | `AnomalyScore` |
| **Range** | 0–10<br>(0 = benign, 10 = highly anomalous) | 0–1<br>(0 = benign, 1 = highly anomalous) |
| **Indicator of** | How unusual a single event is, based on profile-driven logic | Holistic anomalous behavior across multiple events using machine learning |
| **Used for** | Quick triage and drilling into single events | Identifying patterns and aggregated anomalies over time |
| **Processing** | Near real-time, event-level | Batch processing, behavior-level |
| **How it's calculated** | Combines **Entity Anomaly Score** (rarity of entities like user, device, country/region) with **Time Series Score** (abnormal patterns over time, such as spikes in failed sign-ins). | AI/ML anomaly detector trained on your workspace's telemetry |


For example, when a user performs an Azure operation for the first time:

- **Investigation priority score:** High, because it's a first-time event.
- **Anomaly score:** Low, because occasional first-time Azure actions are common and not inherently risky.

While these scores serve different purposes, you can expect some correlation. High anomaly scores often align with high investigation priority, but not always. Each score provides unique insight for layered detection.

## Use embedded UEBA experiences in Defender portal

By surfacing anomalies in investigation graphs and user pages, and prompting analysts to incorporate anomaly data in hunting queries, UEBA facilitates faster threat detection, smarter prioritization, and more efficient incident response. 

This section outlines the key UEBA analyst experiences available in the Microsoft Defender portal.

### UEBA home page widget 

The Defender portal home page includes a UEBA widget where analysts immediately have visibility into anomalous user behavior and therefore accelerate threat detection workflows. If the tenant isn't onboarded yet to UEBA, this widget also provides security admins quick access to the onboarding process. 

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-widget.png" alt-text="Screenshot of the UEBA widget displaying recent user anomalies and a prompt to onboard if the tenant is not yet configured." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-widget.png":::


### UEBA insights in user investigations

Analysts can quickly assess user risk using UEBA context displayed in side panels and the **Overview** tab on all user pages in the Defender portal. When unusual behavior is detected, the portal automatically tags users with **UEBA anomalies** helping prioritize investigations based on recent activity. For more information, see [User entity page in Microsoft Defender](https://aka.ms/ueba-entity-details).

Each user page includes a **Top UEBA anomalies** section, showing the top three anomalies from the past 30 days, along with direct links to pre-built anomaly queries and the Sentinel events timeline for deeper analysis.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-user-investigations.png" alt-text="Screenshot that shows the overview tab of the User page for a user with UEBA anomalies in the past 30 days." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-user-investigations.png":::

### Built-in user anomaly queries in incident investigations

During incident investigations, analysts can launch built-in queries directly from incident graphs in the Defender portal to retrieve all user anomalies related to the case.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-incident-investigations.png" alt-text="Screenshot that shows an incident graph, highlighting the Go hunt All user anomalies option, which allows analysts to quickly find all anomalies related to the user." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-incident-investigations.png":::

For more information, see [Investigate incidents in the Microsoft Defender portal](https://aka.ms/ueba-go-hunt).

### Enrich advanced hunting queries and custom detections with UEBA data

When analysts write Advanced Hunting or custom detection queries using UEBA-related tables, the Microsoft Defender portal displays a banner that prompts them to join the **Anomalies** table. This enriches investigations with behavioral insights and strengthens the overall analysis.

:::image type="content" source="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-advanced-hunting.png" alt-text="Screenshot that shows the Advanced Hunting page with a banner that prompts the analyst to join the Anomalies table and enrich their analysis with behavioral insights." lightbox="media/identify-threats-with-entity-behavior-analytics/entity-behavior-analytics-advanced-hunting.png":::

For more information, see: 
- [Proactively hunt for threats with advanced hunting in Microsoft Defender](/defender-xdr/advanced-hunting-overview).
- [KQL join operator](/kusto/query/join-operator?view=microsoft-sentinel).
- [UEBA data sources](ueba-reference.md#ueba-data-sources).
- [Anomalies detected by the Microsoft Sentinel machine learning engine](anomalies-reference.md).

## Aggregate behavior insights with the UEBA behaviors layer

While UEBA builds baseline profiles to detect anomalous activity, the new UEBA behaviors layer aggregates related events from high-volume raw security logs into clear, structured, meaningful behaviors that explain "who did what to whom" at a glance.

The behaviors layer enriches raw logs with:
- **Natural language explanations** that make complex activities immediately understandable
- **MITRE ATT&CK mappings** that align behaviors with known tactics and techniques
- **Entity role identification** that clarifies the actors and targets involved

By converting fragmented logs into coherent behavior objects, the behaviors layer accelerates threat hunting, simplifies detection authoring, and provides richer context for UEBA anomaly detection. Together, these capabilities help analysts quickly understand not just *that* something anomalous happened, but *what* happened and *why* it matters.

For more information, see [Translate raw security logs to behavioral insights using UEBA behaviors in Microsoft Sentinel](entity-behaviors-layer.md).

## Pricing model

UEBA is included with Microsoft Sentinel at no extra cost. UEBA data is stored in Log Analytics tables and follows standard Microsoft Sentinel pricing. For more information, see [Microsoft Sentinel pricing](https://www.microsoft.com/security/pricing/microsoft-sentinel/).


## Next steps
For practical guidance on UEBA implementation and usage, see:

- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md) in Microsoft Sentinel.
- [Investigate incidents with UEBA data](investigate-with-ueba.md).
- [List of UEBA anomalies](anomalies-reference.md#ueba-anomalies) detected by the UEBA engine.
- [UEBA reference](ueba-reference.md).
- [Hunt for security threats](./hunting.md).

For training resources, see:

- [Identify threats with Behavioral Analytics - Microsoft Learn module](/training/modules/use-entity-behavior-analytics-azure-sentinel)
- [UEBA and New Data Sources for UEBA Analytics and Anomalies - webinar](https://www.youtube.com/watch?v=rekJwHjKLWg)
- [Expanding Microsoft Sentinel UEBA – Ninja show](https://www.youtube.com/watch?v=R0PnVy-vp_4)
