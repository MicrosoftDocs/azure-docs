---
title: Microsoft Defender XDR integration with Microsoft Sentinel
description: Learn how using Microsoft Defender XDR together with Microsoft Sentinel lets you use Microsoft Sentinel as your universal incidents queue.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 06/25/2024
appliesto:
- Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
---

# Microsoft Defender XDR integration with Microsoft Sentinel

Integrate Microsoft Defender XDR with Microsoft Sentinel to stream all Defender XDR incidents and advanced hunting events into Microsoft Sentinel and keep the incidents and events synchronized between both portals. Incidents from Defender XDR include all associated alerts, entities, and relevant information, providing you with enough context to perform triage and preliminary investigation in Microsoft Sentinel. Once in Microsoft Sentinel, incidents remain bi-directionally synced with Defender XDR, allowing you to take advantage of the benefits of both portals in your incident investigation.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Incident correlation and alerts

The integration gives Defender XDR security incidents the visibility to be managed from within Microsoft Sentinel, as part of the primary incident queue across the entire organization. See and correlate Defender XDR incidents together with incidents from all of your other cloud and on-premises systems. At the same time, this integration allows you to take advantage of the unique strengths and capabilities of Defender XDR for in-depth investigations and a Defender-specific experience across the Microsoft 365 ecosystem. Defender XDR enriches and groups alerts from multiple Microsoft Defender products, both reducing the size of the SOC’s incident queue and shortening the time to resolve. Alerts from the following Microsoft Defender products and services are also included in the integration of Defender XDR to Microsoft Sentinel:

- Microsoft Defender for Endpoint
- Microsoft Defender for Identity
- Microsoft Defender for Office 365
- Microsoft Defender for Cloud Apps
- Microsoft Defender Vulnerability Management

Other services whose alerts are collected by Defender XDR include:

- Microsoft Purview Data Loss Prevention ([Learn more](/microsoft-365/security/defender/investigate-dlp))
- Microsoft Entra ID Protection ([Learn more](/defender-cloud-apps/aadip-integration))

The Defender XDR connector also brings incidents from Microsoft Defender for Cloud. To synchronize alerts and entities from these incidents as well, you must enable the Microsoft Defender for Cloud connector. Otherwise, your Microsoft Defender for Cloud incidents appear empty. For more information, see [Ingest Microsoft Defender for Cloud incidents with Microsoft Defender XDR integration](ingest-defender-for-cloud-incidents.md).

In addition to collecting alerts from these components and other services, Defender XDR generates alerts of its own. It creates incidents from all of these alerts and sends them to Microsoft Sentinel.

## Common use cases and scenarios

Consider integrating Defender XDR with Microsoft Sentinel for the following use cases and scenarios:

- Onboard Microsoft Sentinel to the unified security operations platform in the Microsoft Defender portal. Enabling the Defender XDR connector is a prerequisite. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard).

- Enable one-click connect of Defender XDR incidents, including all alerts and entities from Defender XDR components, into Microsoft Sentinel.

- Allow bi-directional sync between Microsoft Sentinel and Defender XDR incidents on status, owner, and closing reason.

- Apply Defender XDR alert grouping and enrichment capabilities in Microsoft Sentinel, thus reducing time to resolve.

- Facilitate investigations across both portals with in-context deep links between a Microsoft Sentinel incident and its parallel Defender XDR incident.

For more information about the capabilities of the Microsoft Sentinel integration with Defender XDR in the unified security operations platform, see [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md).

## Connecting to Microsoft Defender XDR <a name="microsoft-defender-xdr-incidents-and-microsoft-incident-creation-rules"></a>

Install the **Microsoft Defender XDR** solution for Microsoft Sentinel from the **Content hub**. Then, enable the **Microsoft Defender XDR** data connector to collect incidents and alerts. For more information, see [Connect data from Microsoft Defender XDR to Microsoft Sentinel](connect-microsoft-365-defender.md).

To onboard Microsoft Sentinel to the unified security operations platform in the Defender portal, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard).

After you enable alert and incident collection in the Defender XDR data connector, Defender XDR incidents appear in the Microsoft Sentinel incidents queue shortly after they're generated in Defender XDR. In these incidents, the **Alert product name** field contains **Microsoft Defender XDR** or one of the component Defender services' names.
- It can take up to 10 minutes from the time an incident is generated in Defender XDR to the time it appears in Microsoft Sentinel.

- Alerts and incidents from Defender XDR (those items that populate the *SecurityAlert* and *SecurityIncident* tables) are ingested into and synchronized with Microsoft Sentinel at no charge. For all other data types from individual Defender components (such as the *Advanced hunting* tables *DeviceInfo*, *DeviceFileEvents*, *EmailEvents*, and so on), ingestion is charged.

- When the Defender XDR connector is enabled, alerts created by Defender XDR-integrated products are sent to Defender XDR and grouped into incidents. Both the alerts and the incidents flow to Microsoft Sentinel through the Defender XDR connector. If you enabled any of the individual component connectors beforehand, they appear to remain connected, though no data flows through them.

    The exception to this process is Microsoft Defender for Cloud. Although its integration with Defender XDR means that you receive Defender for Cloud *incidents* through Defender XDR, you need to also have a Microsoft Defender for Cloud connector enabled in order to receive Defender for Cloud *alerts*. For the available options and more information, see the following articles:
    - [Microsoft Defender for Cloud in the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud)
    - [Ingest Microsoft Defender for Cloud incidents with Microsoft Defender XDR integration](ingest-defender-for-cloud-incidents.md)

- Similarly, to avoid creating *duplicate incidents for the same alerts*, the **Microsoft incident creation rules** setting is turned off for Defender XDR-integrated products when connecting Defender XDR. This is because Defender XDR has its own incident creation rules. This change has the following potential impacts:

   - Microsoft Sentinel's incident creation rules allowed you to filter the alerts that would be used to create incidents. With these rules disabled, you can preserve the alert filtering capability by configuring [alert tuning in the Microsoft Defender portal](/microsoft-365/security/defender/investigate-alerts), or by using [automation rules](automate-incident-handling-with-automation-rules.md#incident-suppression) to suppress (close) incidents you don't want.

   - You can no longer predetermine the titles of incidents, since the Defender XDR correlation engine presides over incident creation and automatically names the incidents it creates. This change is liable to affect any automation rules you created that use the incident name as a condition. To avoid this pitfall, use criteria other than the incident name as conditions for [triggering automation rules](automate-incident-handling-with-automation-rules.md#conditions). We recommend using *tags*.

## Working with Microsoft Defender XDR incidents in Microsoft Sentinel and bi-directional sync

Defender XDR incidents appear in the Microsoft Sentinel incidents queue with the product name **Microsoft Defender XDR**, and with similar details and functionality to any other Microsoft Sentinel incidents. Each incident contains a link back to the parallel incident in the Microsoft Defender Portal.

As the incident evolves in Defender XDR, and more alerts or entities are added to it, the Microsoft Sentinel incident gets updated accordingly.

Changes made to the status, closing reason, or assignment of a Defender XDR incident, in either Defender XDR or Microsoft Sentinel, likewise update accordingly in the other's incidents queue. The synchronization takes place in both portals immediately after the change to the incident is applied, with no delay. A refresh might be required to see the latest changes.

In Defender XDR, all alerts from one incident can be transferred to another, resulting in the incidents being merged. When this merge happens, the Microsoft Sentinel incidents reflect the changes. One incident contains all the alerts from both original incidents, and the other incident is automatically closed, with a tag of "redirected" added.

> [!NOTE]
> Incidents in Microsoft Sentinel can contain a maximum of 150 alerts. Defender XDR incidents can have more than this. If a Defender XDR incident with more than 150 alerts is synchronized to Microsoft Sentinel, the Microsoft Sentinel incident shows as having “150+” alerts and provides a link to the parallel incident in Defender XDR where you see the full set of alerts.

## Advanced hunting event collection

The Defender XDR connector also lets you stream **advanced hunting** events&mdash;a type of raw event data&mdash;from Defender XDR and its component services into Microsoft Sentinel. Collect [advanced hunting](/microsoft-365/security/defender/advanced-hunting-overview) events from all Defender XDR components, and stream them straight into purpose-built tables in your Microsoft Sentinel workspace. These tables are built on the same schema that is used in the Defender portal. This gives you complete access to the full set of advanced hunting events, and allows you to do the following tasks:

- Easily copy your existing Microsoft Defender for Endpoint/Office 365/Identity/Cloud Apps advanced hunting queries into Microsoft Sentinel.

- Use the raw event logs to provide further insights for your alerts, hunting, and investigation, and correlate these events with events from other data sources in Microsoft Sentinel.

- Store the logs with increased retention, beyond Defender XDR’s or its components' default retention of 30 days. You can do so by configuring the retention of your workspace or by configuring per-table retention in Log Analytics.

## Next steps

In this document, you learned the benefit of using Defender XDR together with Microsoft Sentinel, by enabling the Defender XDR connector in Microsoft Sentinel.

- [Connect data from Microsoft Defender XDR to Microsoft Sentinel](connect-microsoft-365-defender.md)
- To use the unified security operations platform in the Defender portal, see [Connect data from Microsoft Defender XDR to Microsoft Sentinel](connect-microsoft-365-defender.md).
- Check [availability of different Microsoft Defender XDR data types](microsoft-365-defender-cloud-support.md) in the different Microsoft 365 and Azure clouds.
- Create [custom alerts](detect-threats-custom.md) and [investigate incidents](investigate-incidents.md).
