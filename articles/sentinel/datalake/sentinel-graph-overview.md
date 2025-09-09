---
title: What is  Microsoft Sentinel Graph? (Preview)
titleSuffix: Microsoft Security  
description: Learn how Microsoft Sentinel Graph enables multi-modal security analytics through graph-based representation of security data, providing deep insights into digital environments and attack paths.
author: mberdugo
ms.topic: overview
ms.date: 09/2/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph

#customer intent: As a security analyst, I want to understand Microsoft Sentinel Graph capabilities so that I can detect complex attack paths and relationships that are difficult to identify with traditional tabular queries..
---

# What is Microsoft Sentinel graph? (preview)

Microsoft Sentinel graph is a unified graph analytics capability within Microsoft Sentinel which powers graph-based experiences across security, compliance, identity, and the entire ecosystem - empowering security teams to model, analyze, and visualize complex relationships across their digital estate.  

Unlike traditional tabular data approaches, Sentinel graph enables defenders and AI agents to reason over interconnected assets, identities, activities, and threat intelligence—unlocking deeper insights and accelerating response to evolving cyber threats across prebreach and post breach. Graphs natively represent the real-world web of users, devices, cloud resources, data flows, activities, and attacker actions. By representing these relationships as nodes and edges, security teams can answer questions that are slow or impossible with tables, such as what could happen if a specific user account is compromised? Or what is the blast radius of a compromised document?  Sentinel graph offers  interconnected security graphs to help you at every stage of defense from prebreach to post breach.  

<!--- [!INCLUDE [sentinel-graph-preview](includes/sentinel-graph-preview.md)] --->

> [!IMPORTANT]
> Microsoft Sentinel Graph is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Why graph representation matters in security

Defenders seek answers to various questions in order to stop attacks, defend, and strengthen their systems. To support detection and response, data must be represented effectively. Relational or tabular queries allow for selecting, filtering, joining, and aggregating data. Big Data Analytics enables the identification of anomalies, clustering, and deviation within large datasets. Graph analysis provides insight into relationships between entities and events, as well as paths, blast radius, and structural patterns of activities.

Attackers think in graphs. They map environments, find escalation paths, exploit gaps, and stay ahead. This context gives security teams an edge, while many struggle with the limits of legacy tools. Representing data in a graph models real-word connections that deliver context that goes beyond visibility. They enable defenders to predict moves, block escalation paths, detect, and lock down exposed data before it spreads—bringing prebreach and post‑breach insights together.

## Enable defense at all stages

Microsoft Sentinel graph is the underlying graph analytics capability powering graph-based experiences across security, compliance, identity, and the entire ecosystem. The [Enterprise exposure graph](/security-exposure-management/enterprise-exposure-map) is available in Microsoft Security Exposure Management and [Microsoft Defender for Cloud](/azure/defender-for-cloud/how-to-manage-attack-path), offering recommendations to enhance security posture and reduce the risk of breaches. As depicted in the following diagram, the graph capabilities are being extended with new scenarios throughout Defender and Purview, providing graph-based defense strategies across all stages, from prebreach to post-breach and across assets, activities, and threat intelligence.

:::image type="content" source="./media/sentinel-graph-overview/graph-based-capabilities.png" alt-text="Diagram showing graph enabled defense capabilities prebreach and post breach.":::

For example, your digital environment includes active directory, servers, virtual machines, and other assets, vulnerabilities, misconfigurations, and excessive privileges are common and can increase the risk of security breaches through compromised accounts. An attacker can infiltrate your organization, compromise tokens, and eventually gain access to sensitive information, resulting in data exfiltration.

Microsoft Sentinel graph offers underline graph analytics capabilities interconnecting activity, asset, and threat intelligence (TI) functionalities, enhancing analysis across these networks and enabling comprehensive graph-based security throughout Microsoft solutions. Features such as Attack Path within Microsoft Security Exposure Management (MSEM) and Microsoft Defender for Cloud (MDC) provides recommendations. Blast Radius in Incident graph and graph-based hunting in Defender help prioritize incidents and response efforts. Activity analysis via Purview Insider Risk Management (IRM) supports user risk assessment and helps you identify data leak blast radius, while Purview Data Security Investigation (DSI) graphs facilitate understanding of breach scope.

Collectively, Sentinel graph’s capabilities deliver robust defense across all stages of the security lifecycle.

## Integration with Microsoft Security solutions

Sentinel Graph powers advanced capabilities across Microsoft's security portfolio:

| Solution | Capability | Description |
|----------|------------|-------------|
| **Microsoft Defender XDR** | Incident graph extended with Blast Radius | Visualize current impact of a breach and the possible future impact in one consolidated graph |
| **Microsoft Defender XDR** | Hunting graph in Defender | Interactively traverse graphs to uncover hidden relationships between assets |
| **Microsoft Purview** | Data risk graph in Insider Risk Management (IRM) | Map user activities to detect data exfiltration patterns and understand data leak blast radius |
| **Microsoft Purview** | Data risk graph in Data Security Investigation (DSI) | Trace sensitive data access and movement. Understand data leak blast radius |

## Architecture

Microsoft Sentinel graph, built on Azure’s scalable infrastructure, automatically transforms billions of raw signals from the Sentinel data lake into purpose-built interconnected security graphs across Assets, Activities, and Threat Intelligence.

At its core, the Microsoft Sentinel graph is built around the concept of an enterprise security graph, a comprehensive representation of an organization’s entire security digital estate. It employs a hybrid scalable approach of computing the underlying graphs and interconnecting them into security graphs, which are accessible via Microsoft Security solutions.

:::image type="content" source="./media/sentinel-graph-overview/sentinel-graph-architecture.png" alt-text="Diagram showing the Sentinel graph modality logical architecture.":::

## Get started

To begin using Microsoft Sentinel Graph:

### [Defender](#tab/defender)

* [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md)
* [Hunting Graph](/defender-xdr/defender-experts-for-hunting)
* [Blast Radius](../identify-threats-with-entity-behavior-analytics.md)

### [Microsoft Purview](#tab/purview)

To begin using Microsoft Sentinel Graph:

* [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md)
* [Data risk graph in Insider Risk Management (IRM)](/purview/insider-risk-management-configure)
* [Data risk graph in Data Security Investigation (DSI)](/purview/data-security-investigations-billing)

---
