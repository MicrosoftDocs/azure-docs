---
title: Microsoft Defender XDR integration with Microsoft Sentinel | Microsoft Docs
description: Learn how using Microsoft Defender XDR together with Microsoft Sentinel lets you use Microsoft Sentinel as your universal incidents queue while seamlessly applying Microsoft Defender XDR's strengths to help investigate Microsoft 365 security incidents. Also, learn how to ingest Defender components' advanced hunting data into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 02/01/2023
---

# Microsoft Defender XDR integration with Microsoft Sentinel

Microsoft Sentinel's [Microsoft Defender XDR](/microsoft-365/security/mtp/microsoft-threat-protection) incident integration allows you to stream all Microsoft Defender XDR incidents into Microsoft Sentinel and keep them synchronized between both portals. Incidents from Microsoft Defender XDR include all associated alerts, entities, and relevant information, providing you with enough context to perform triage and preliminary investigation in Microsoft Sentinel. Once in Sentinel, incidents will remain bi-directionally synced with Microsoft Defender XDR, allowing you to take advantage of the benefits of both portals in your incident investigation.

This integration gives Microsoft 365 security incidents the visibility to be managed from within Microsoft Sentinel, as part of the primary incident queue across the entire organization, so you can see – and correlate – Microsoft 365 incidents together with those from all of your other cloud and on-premises systems. At the same time, it allows you to take advantage of the unique strengths and capabilities of Microsoft Defender XDR for in-depth investigations and a Microsoft 365-specific experience across the Microsoft 365 ecosystem. Microsoft Defender XDR enriches and groups alerts from multiple Microsoft 365 products, both reducing the size of the SOC’s incident queue and shortening the time to resolve. The component services that are part of the Microsoft Defender XDR stack are:

- **Microsoft Defender for Endpoint**
- **Microsoft Defender for Identity**
- **Microsoft Defender for Office 365**
- **Microsoft Defender for Cloud Apps**
- **Microsoft Defender for Cloud**

Other services whose alerts are collected by Microsoft Defender XDR include:

- **Microsoft Purview Data Loss Prevention** ([Learn more](/microsoft-365/security/defender/investigate-dlp))
- **Microsoft Entra ID Protection** ([Learn more](/defender-cloud-apps/aadip-integration))

In addition to collecting alerts from these components and other services, Microsoft Defender XDR generates alerts of its own. It creates incidents from all of these alerts and sends them to Microsoft Sentinel.

## Common use cases and scenarios

- Onboarding of Microsoft Sentinel to the unified security operations platform in the Microsoft Defender portal, of which enabling the Microsoft Defender XDR integration is a required early step.

- One-click connect of Microsoft Defender XDR incidents, including all alerts and entities from Microsoft Defender XDR components, into Microsoft Sentinel.

- Bi-directional sync between Sentinel and Microsoft Defender XDR incidents on status, owner, and closing reason.

- Application of Microsoft Defender XDR alert grouping and enrichment capabilities in Microsoft Sentinel, thus reducing time to resolve.

- In-context deep link between a Microsoft Sentinel incident and its parallel Microsoft Defender XDR incident, to facilitate investigations across both portals.

## Connecting to Microsoft Defender XDR <a name="microsoft-defender-xdr-incidents-and-microsoft-incident-creation-rules"></a>

(*"Microsoft Defender XDR incidents and Microsoft incident creation rules"* redirects here.)

Install the Microsoft Defender XDR solution for Microsoft Sentinel and enable the Microsoft Defender XDR data connector to [collect incidents and alerts](connect-microsoft-365-defender.md). Microsoft Defender XDR incidents appear in the Microsoft Sentinel incidents queue, with **Microsoft Defender XDR** (or one of the component services' names) in the **Alert product name** field, shortly after they are generated in Microsoft Defender XDR.

- It can take up to 10 minutes from the time an incident is generated in Microsoft Defender XDR to the time it appears in Microsoft Sentinel.

- Alerts and incidents from Microsoft Defender XDR (those items which populate the *SecurityAlert* and *SecurityIncident* tables) are ingested into and synchronized with Microsoft Sentinel at no charge. For all other data types from individual Defender components (such as the *Advanced hunting* tables *DeviceInfo*, *DeviceFileEvents*, *EmailEvents*, and so on), ingestion will be charged.

- When the Microsoft Defender XDR connector is enabled, alerts created by its component services (Defender for Endpoint, Defender for Identity, Defender for Office 365, Defender for Cloud Apps, Microsoft Entra ID Protection) will be sent to Microsoft Defender XDR and grouped into incidents. Both the alerts and the incidents will flow to Microsoft Sentinel through the Microsoft Defender XDR connector. If you had enabled any of the individual component connectors beforehand, they will appear to remain connected, though no data will be flowing through them.

    The exception to this process is Microsoft Defender for Cloud. Although its [integration with Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud) means that you receive Defender for Cloud *incidents* through Defender XDR, you need to also have a Microsoft Defender for Cloud connector enabled in order to receive Defender for Cloud *alerts*. For the available options and more information, see [Ingest Microsoft Defender for Cloud incidents with Microsoft Defender XDR integration](ingest-defender-for-cloud-incidents.md).

- Similarly, to avoid creating *duplicate incidents for the same alerts*, **Microsoft incident creation rules** will be turned off for Microsoft Defender XDR-integrated products (Defender for Endpoint, Defender for Identity, Defender for Office 365, Defender for Cloud Apps, and Microsoft Entra ID Protection) when connecting Microsoft Defender XDR. This is because Defender XDR has its own incident creation rules. This change has the following potential impacts:

   - Microsoft Sentinel's incident creation rules allowed you to filter the alerts that would be used to create incidents. With these rules disabled, you can preserve the alert filtering capability by configuring [alert tuning in the Microsoft Defender portal](/microsoft-365/security/defender/investigate-alerts), or by using [automation rules](automate-incident-handling-with-automation-rules.md#incident-suppression) to suppress (close) incidents you didn't want created.

   - You can no longer predetermine the titles of incidents, since the Microsoft Defender XDR correlation engine presides over incident creation and automatically names the incidents it creates. This change is liable to affect any automation rules you've created that use the incident name as a condition. To avoid this pitfall, use criteria other than the incident name (we recommend using *tags*) as conditions for [triggering automation rules](automate-incident-handling-with-automation-rules.md#conditions).

## Working with Microsoft Defender XDR incidents in Microsoft Sentinel and bi-directional sync

Microsoft Defender XDR incidents will appear in the Microsoft Sentinel incidents queue with the product name **Microsoft Defender XDR**, and with similar details and functionality to any other Sentinel incidents. Each incident contains a link back to the parallel incident in the Microsoft Defender Portal.

As the incident evolves in Microsoft Defender XDR, and more alerts or entities are added to it, the Microsoft Sentinel incident will update accordingly.

Changes made to the status, closing reason, or assignment of a Microsoft Defender XDR incident, in either Microsoft Defender XDR or Microsoft Sentinel, will likewise update accordingly in the other's incidents queue. The synchronization will take place in both portals immediately after the change to the incident is applied, with no delay. A refresh might be required to see the latest changes.

In Microsoft Defender XDR, all alerts from one incident can be transferred to another, resulting in the incidents being merged. When this merge happens, the Microsoft Sentinel incidents will reflect the changes. One incident will contain all the alerts from both original incidents, and the other incident will be automatically closed, with a tag of "redirected" added.

> [!NOTE]
> Incidents in Microsoft Sentinel can contain a maximum of 150 alerts. Microsoft Defender XDR incidents can have more than this. If a Microsoft Defender XDR incident with more than 150 alerts is synchronized to Microsoft Sentinel, the Sentinel incident will show as having “150+” alerts and will provide a link to the parallel incident in Microsoft Defender XDR where you will see the full set of alerts.

## Advanced hunting event collection

The Microsoft Defender XDR connector also lets you stream **advanced hunting** events - a type of raw event data - from Microsoft Defender XDR and its component services into Microsoft Sentinel. You can now *(as of April 2022)* collect [advanced hunting](/microsoft-365/security/defender/advanced-hunting-overview) events from *all* Microsoft Defender XDR components, and stream them straight into purpose-built tables in your Microsoft Sentinel workspace. These tables are built on the same schema that is used in the Microsoft Defender Portal, giving you complete access to the full set of advanced hunting events, and allowing you to do the following:

- Easily copy your existing Microsoft Defender for Endpoint/Office 365/Identity/Cloud Apps advanced hunting queries into Microsoft Sentinel.

- Use the raw event logs to provide further insights for your alerts, hunting, and investigation, and correlate these events with events from other data sources in Microsoft Sentinel.

- Store the logs with increased retention, beyond Microsoft Defender XDR’s or its components' default retention of 30 days. You can do so by configuring the retention of your workspace or by configuring per-table retention in Log Analytics.

## Next steps

In this document, you learned how to benefit from using Microsoft Defender XDR together with Microsoft Sentinel, using the Microsoft Defender XDR connector.

- Get instructions for [enabling the Microsoft Defender XDR connector](connect-microsoft-365-defender.md).
- Check [availability of different Microsoft Defender XDR data types](microsoft-365-defender-cloud-support.md) in the different Microsoft 365 and Azure clouds.
- Create [custom alerts](detect-threats-custom.md) and [investigate incidents](investigate-incidents.md).
