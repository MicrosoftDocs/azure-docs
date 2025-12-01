---
title: What is Microsoft Sentinel graph?
ms.reviewer: Robert
titleSuffix: Microsoft Security  
description: Learn how Microsoft Sentinel graph enables multi-modal security analytics through graph-based representation of security data, providing deep insights into digital environments and attack paths.
author: mberdugo
ms.topic: overview
ms.date: 11/13/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph

#customer intent: As a security analyst, I want to understand Microsoft Sentinel graph capabilities so that I can detect complex attack paths and relationships that are difficult to identify with traditional tabular queries.
---


# What is Microsoft Sentinel graph?

Microsoft Sentinel graph is a unified graph analytics capability within Microsoft Sentinel that powers graph-based experiences across security, compliance, identity, and the Microsoft Security ecosystem - empowering security teams to model, analyze, and visualize complex relationships across their digital estate.  

Unlike traditional tabular data approaches, Sentinel graph enables defenders and AI agents to reason over interconnected assets, identities, activities, and threat intelligence, unlocking deeper insights and accelerating response to evolving cyber threats across pre-breach and post-breach. Graphs natively represent the real-world web of users, devices, cloud resources, data flows, activities, and attacker actions. By representing these relationships as nodes and edges, security teams can answer questions that are difficult or impossible with tables, such as what could happen if a specific user account is compromised? Or what is the blast radius of a compromised document?


## Enable defense at all stages

Sentinel graph offers interconnected security graphs to help you at every stage of defense. The graph capabilities are being extended with new scenarios throughout Defender and [Microsoft Purview](/purview/purview), providing graph-based defense strategies across all stages, from pre-breach to post-breach and across assets, activities, and threat intelligence.

For example, your digital environment includes active directory, servers, virtual machines, and other assets, vulnerabilities, misconfigurations, and excessive privileges are common and can increase the risk of security breaches through compromised accounts. An attacker can infiltrate your organization, compromise tokens, and eventually gain access to sensitive information, resulting in data exfiltration.

Microsoft Sentinel graph offers underlying graph analytics capabilities interconnecting activity, asset, and threat intelligence functionalities, enhancing analysis across these networks and enabling comprehensive graph-based security throughout Microsoft solutions across pre-breach and post-breach.

:::image type="content" source="./media/sentinel-graph-overview/graph-based-capabilities.png" alt-text="Diagram showing graph enabled defense capabilities pre-breach and post breach.":::

1. Features such as Attack Path within Microsoft Security Exposure Management (MSEM) and Microsoft Defender for Cloud (MDC) provide recommendations to proactively manage attack surfaces, protect critical assets, and explore and mitigate exposure risk.
1. [New] Blast radius analysis in Incident graph in Defender helps you evaluate and visualize the vulnerable paths an attacker could take from a compromise entity to a critical asset.
1. [New] Graph-based hunting in Defender helps you visually traverse the complex web of relationships between users, devices, and other entities to reveal privileged access paths to critical assets to prioritize incidents and response efforts.
1. [New] Activity analysis via Microsoft Purview Insider Risk Management supports user risk assessment and helps you identify data leak blast radius of risky user activity across SharePoint and OneDrive.
1. [New] Microsoft Purview Data Security Investigations graphs facilitate understanding of breach scope by pointing sensitive data access and movement, map potential exfiltration paths, and visualize the users and activities linked to risky files, all in one view.

Collectively, Microsoft Sentinel graph’s capabilities enable defense across all stages of the security lifecycle.

## Integration with Microsoft Security solutions

Microsoft Sentinel graph powers new advanced capabilities across Microsoft's security portfolio:

| Solution | Capability | Description |
|----------|------------|-------------|
| **Microsoft Defender XDR** | [Incident graph extended with Blast Radius](https://aka.ms/sentinel/graph/docs/incidents) | Visualize current impact of a breach and the possible future impact in one consolidated graph |
| **Microsoft Defender XDR** | [Hunting graph in Defender](https://aka.ms/sentinel/graph/docs/hunting) | Interactively traverse graphs to uncover hidden relationships between assets |
| **Microsoft Purview** | [Data risk graph in Insider Risk Management](/purview/insider-risk-management-data-risk-graph) | Map user activities to detect data exfiltration patterns and understand data leak blast radius |
| **Microsoft Purview** | [Data risk graph in Data Security Investigations](/purview/data-security-investigations-data-risk-graph) | Trace sensitive data access and movement. Understand data leak blast radius |

## Get started

To begin using Microsoft Sentinel graph:

### [Defender](#tab/defender)

* If you already have the Sentinel data lake, the required graph is auto provisioned when you sign in into the Defender portal. Hunting graph and blast radius experience will appear in the Defender portal.
* New to data lake? Use the [Sentinel data lake onboarding flow](https://aka.ms/sentinel/graph/docs/defender/onboarding) to enable the data lake and graph.

### [Microsoft Purview](#tab/purview)

To begin using Microsoft Sentinel graph in Microsoft Purview:

* In **Microsoft Purview Insider Risk Management**, follow the instructions in [Data risk graph in Insider Risk Management](/purview/insider-risk-management-data-risk-graph).
* In **Microsoft Purview Data Security Investigation**, follow the instructions in [Data risk graph in Data Security Investigations](/purview/data-security-investigations-data-risk-graph).

---

## Pricing

All new Microsoft Sentinel graph-based experiences are included as part of the existing Defender and Microsoft Purview licenses. However, the Sentinel graph is built upon the Sentinel data lake and requires data sources to be enabled. Enabling data sources incurs ingestion, data processing, and data lake storage costs. For Sentinel SIEM customers, most required data sources are part of Sentinel's *Free data sources* and are available without charge in the lake after the data is ingested into the Analytics tier. Nonentitled sources such as Microsoft Entra ID logs incur ingestion, data processing, and data lake storage costs if loaded directly into the lake, or Analytics tier ingestion if loaded into the Analytics tier. For more information, see Sentinel [data lake billing](https://azure.microsoft.com/pricing/details/storage/data-lake/).
