---
title: Entity pages in Microsoft Sentinel
description: Comprehensive entity information including timelines, insights, and behavioral analysis for security investigations in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to access detailed entity pages in Microsoft Sentinel so that I can efficiently investigate and respond to security incidents.

---

# Entity pages in Microsoft Sentinel

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

Entity pages provide comprehensive information about entities (user accounts, hostnames, IP addresses, Azure resources) encountered during investigations, including activity timelines, behavioral insights, and contextual enrichments.

## Entity Page Components

### Information Panel (Left)
Identifying information from connected data sources including Microsoft Entra ID, Azure Monitor, Microsoft Defender XDR, and CEF/Syslog.

### Timeline (Center)
Chronological view of entity-related events:

# [Defender portal](#tab/defender-portal)

Available on the **Sentinel events** tab, showing 24-hour timeline (non-adjustable) with:

# [Azure portal](#tab/azure-portal)

Customizable time range with filtering options, showing:

---

- **Alerts**: Alerts with mapped entities
- **Bookmarks**: Bookmarks including the entity
- **Anomalies**: UEBA detections based on dynamic baselines
- **Activities**: Aggregated notable events (customizable)

For device entities (January 2025), network traffic activities appear on both the main Timeline tab and Sentinel events tab in the Defender portal.

### Insights Panel (Right)
Security insights from Microsoft security researchers based on multiple data sources, with links to underlying queries in Log Analytics or Advanced hunting.

## Access Methods

Entity pages are accessible from:
- Incident management and investigation graphs
- Bookmarks
- **Entity behavior** page in Microsoft Sentinel menu
- Direct entity searches

In the new investigation experience, entity information appears in side panels with **Info**, **Timeline**, and **Insights** cards within incident timeframes.

## Supported Entity Types

- **User account**
- **Host**
- **IP address** (Preview) - includes Microsoft Threat Intelligence geolocation data
- **Azure resource** (Preview)
- **IoT device** (Preview) - Azure portal only

Entity page data is stored in the **BehaviorAnalytics** table. See [Microsoft Sentinel UEBA reference](ueba-reference.md) for schema details.

## Next steps

- [Learn about entities in Microsoft Sentinel](entities.md)
- [Customize activities on entity page timelines](customize-entity-activities.md)
- [Enable entity behavior analytics](./enable-entity-behavior-analytics.md)
- [Enrich entities with geolocation data via REST API](geolocation-data-api.md)
