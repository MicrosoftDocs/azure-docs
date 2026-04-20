---
title: Identity attack graph in Microsoft Sentinel
titleSuffix: Microsoft Security
description: Learn how the identity attack graph in Microsoft Sentinel models identities, permissions, and Azure resources to surface lateral movement paths and privilege escalation risks.
author: evangelinew
ms.topic: overview
ms.date: 04/10/2026
ms.author: evwhite
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform

#CustomerIntent: As a security analyst, I want to turn on the identity attack graph so that I can identify lateral movement paths and privilege escalation risks in my environment.
---

# What is the identity attack graph?

The identity attack graph in Microsoft Sentinel visualizes how identities connect to Azure resources through permissions and group memberships. Security analysts can use the graph to identify lateral movement paths, which are the potential routes an attacker could take to move from one identity or resource to another by exploiting existing permissions, group memberships, or trust relationships, often to escalate privileges or reach sensitive assets.

The predefined identity attack graph represents your environment as interconnected entities and relationships, making it easier to answer complex questions, such as "What resources could an attacker reach if this account is compromised?" or "Which identities have paths to critical assets?"

SOC analysts, threat hunters, cloud security engineers, and IAM teams can use the graph to understand and reduce identity risk across Azure and Entra. 

## How the identity attack graph works

The identity attack graph uses asset data from the Microsoft Sentinel lake's Entra ID asset and Azure resource graph connectors to build a comprehensive model of your environment:

- **Identities**: Users, service principals, managed identities, and groups
- **Resources**: Azure subscriptions, resource groups, virtual machines, storage accounts, and other assets
- **Access and permission relationships**: Role assignments and group memberships that create paths to resources they can access

After setup, use Graph Query Language (GQL) to uncover hidden risks that are difficult to detect with traditional methods. 

You can query the graph to:

- **Surface lateral movement paths**: Find all routes an attacker could take from a compromised identity to reach critical resources
- **Identify overprivileged accounts**: Discover identities with excessive permissions or indirect paths to privileged roles
- **Prioritize remediation**: Focus on the shortest paths to your most sensitive assets

## Prerequisites

To set up the identity attack graph, make sure you meet the following prerequisites:

- Microsoft Sentinel data lake enabled in your environment
- [Permissions](/azure/sentinel/datalake/enable-data-connectors#required-permissions-for-asset-sources) to turn on or update the **Microsoft Entra ID Assets** and **Azure Resource Graph connectors**
- Global Administrator, Security Administrator to create the graph

## Set up the identity attack graph

Follow these steps to set up the identity attack graph:

1. In the Microsoft Defender portal, navigate to **Microsoft Sentinel** > **Graphs**.
1. Locate the **identity attack graph** card and select **Set up graph**.
1. Follow the setup steps and turn on or update the required connectors.
1. Select **Turn on graph** to create your graph.
1. Select **Query graph** on the graph tile to view the graph query page.

    :::image type="content" source="./media/identity-attack-graph/identity-graph-overview-panel.png" alt-text="Screenshot showing the Microsoft Sentinel identity attack graph overview panel." lightbox="./media/identity-attack-graph/identity-graph-overview-panel.png":::


After you turn on the graph, the graph begins ingesting data and building relationships. Initial processing may take up to 48 hours. 

## Explore and query the identity attack graph

Follow these steps to query the graph when the graph is ready to use:

1. Use the **Schema** tab to understand the types of entities and relationships in the graph.

    :::image type="content" source="./media/identity-attack-graph/visualize-graph-schema.png" alt-text="Screenshot showing the schema tab on the graph query page." lightbox="./media/identity-attack-graph/visualize-graph-schema.png":::

1. Select any node to view the detailed metadata.

1. Use the **Graph** tab to visualize relationships and privilege paths. Write your own GQL queries or use the predefined queries to get started.

    :::image type="content" source="./media/identity-attack-graph/predefined-query.png" alt-text="Screenshot showing the predefined query on the graph." lightbox="./media/identity-attack-graph/predefined-query.png":::

    > [!NOTE]
    > It's recommended that you start with the predefined queries, which are designed to surface common and high‑value investigation scenarios. These queries help you get immediate value without writing GQL from scratch.

1. Select **Run GQL query** to see the results.

    :::image type="content" source="./media/identity-attack-graph/visualize-query.png" alt-text="Screenshot showing the graph tab to visualize query." lightbox="./media/identity-attack-graph/visualize-query.png":::


## Related content

- [What is Microsoft Sentinel graph?](sentinel-graph-overview.md)
- [Microsoft Sentinel data lake overview](sentinel-lake-overview.md)

