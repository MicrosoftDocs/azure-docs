---
title: Visualize data lake graphs in Microsoft Sentinel
description: Learn how to visualize and explore graph relationships in the Microsoft Sentinel data lake to understand connections between entities and data points.
author: guywi-ms
ms.author: guywild
ms.topic: how-to
ms.date: 09/14/2024
---

# Visualize data lake graphs in Microsoft Sentinel

This article describes how to visualize and explore graph relationships in the Microsoft Sentinel data lake to understand connections between entities and data points.

> [!NOTE]
> Graph visualization features are currently in development. This article will be updated as features become available.

## Overview

Microsoft Sentinel's data lake supports graph visualization capabilities that allow you to:

- Explore relationships between entities in your security data
- Visualize network connections and data flows
- Identify patterns and anomalies through graph analysis
- Understand the context and impact of security events

## Prerequisites

- Access to Microsoft Sentinel data lake
- Appropriate permissions to view graph data
- Data sources configured to populate graph relationships

## Graph visualization capabilities

### Entity relationship mapping

Visualize how different entities in your environment relate to each other:

- User to device relationships
- Network connections
- Process relationships
- File and registry interactions

### Network topology visualization

Understand your network structure through graph representations:

- Network device connections
- Traffic flow patterns
- Security boundary visualization
- Asset relationships

### Threat investigation graphs

Use graph visualization to investigate security incidents:

- Attack path analysis
- Lateral movement detection
- Impact assessment
- Root cause analysis

## Working with graph data

### Querying graph relationships

Use KQL queries to extract graph data from your data lake:

```kusto
// Example query for entity relationships
// This is a placeholder - actual syntax will be provided when features are available
```

### Customizing graph views

Configure graph visualizations to meet your specific needs:

- Filter nodes and edges
- Customize visual styling
- Set layout preferences
- Configure interaction behaviors

## Best practices

- Start with focused queries to avoid overwhelming visualizations
- Use filters to highlight specific relationship types
- Combine graph views with traditional analytics for comprehensive investigation
- Regularly update graph data sources for accurate representations

## Next steps

- [Explore your data lake](../datalake/kql-overview.md)
- [KQL for data lake exploration](../datalake/kql-queries.md)
- [Microsoft Sentinel data lake overview](../datalake/sentinel-lake-overview.md)
