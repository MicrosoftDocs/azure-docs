---
title: Best practices for Microsoft Sentinel
description: Learn about best practices to employ when managing your Log Analytics workspace for Microsoft Sentinel.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 07/16/2025

#Customer intent: As a security operations center (SOC) analyst, I want to implement best practices for deploying and managing a cloud-based SIEM solution so that I can enhance threat detection, incident response, and overall security posture.

---

# Best practices for Microsoft Sentinel

Best practice guidance is provided throughout the technical documentation for Microsoft Sentinel. This article highlights some key guidance to use when deploying, managing, and using Microsoft Sentinel.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

To get started with Microsoft Sentinel, see the [deployment guide](deploy-overview.md), which covers the high level steps to plan, deploy, and fine-tune your Microsoft Sentinel deployment. From that guide, select the provided links to find detailed guidance for each stage in your deployment.

## Adopt a single-platform architecture

Microsoft Sentinel is integrated with a modern data lake that offers affordable, long-term storage enabling teams to simplify data management, optimize costs, and accelerate the adoption of AI. The Microsoft Sentinel data lake enables a single-platform architecture for security data and empowers analysts with a unified query experience while leveraging Microsoft Sentinel’s rich connector ecosystem. For more information, see [Microsoft Sentinel data lake ](datalake/sentinel-lake-overview.md).

## Onboard Microsoft Sentinel to the Microsoft Defender portal and integrate with Microsoft Defender XDR

Consider onboarding Microsoft Sentinel to the Microsoft Defender portal to unify capabilities with Microsoft Defender XDR like incident management and advanced hunting.

If you don't onboard Microsoft Sentinel to the Microsoft Defender portal, note that:

- By July 2026, all Microsoft Sentinel customers using the Azure portal will be redirected to the Defender portal.
- Until then, you can use the [Defender XDR data connector](connect-microsoft-365-defender.md) to integrate Microsoft Defender service data with Microsoft Sentinel in the Azure portal.

The following illustration shows how Microsoft's XDR solution seamlessly integrates with Microsoft Sentinel.

:::image type="content" source="./media/microsoft-365-defender-sentinel-integration/sentinel-xdr-usx.svg" alt-text="Diagram of a Microsoft Sentinel and Microsoft Defender XDR architecture in the Microsoft Defender portal." lightbox="./media/microsoft-365-defender-sentinel-integration/sentinel-xdr-usx.svg" border="false":::

For more information, see the following articles:

- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)

## Integrate Microsoft security services

Microsoft Sentinel is empowered by the components that send data to your workspace, and is made stronger through integrations with other Microsoft services. Any logs ingested into products, such as Microsoft Defender for Cloud Apps, Microsoft Defender for Endpoint, and Microsoft Defender for Identity, allow these services to create detections, and in turn provide those detections to Microsoft Sentinel. Logs can also be ingested directly into Microsoft Sentinel to provide a fuller picture for events and incidents.

More than ingesting alerts and logs from other sources, Microsoft Sentinel also provides:

| Capability | Description |
|------------|-------------|
| **Threat detection** | [Threat detection capabilities](overview.md#detect-threats) with artificial intelligence, allowing you to build and present interactive visuals via workbooks, run playbooks to automatically act on alerts, integrate [machine learning models](bring-your-own-ml.md) to enhance your security operations, and ingest and fetch enrichment feeds from threat intelligence platforms. |
| **Threat investigation** | [Threat investigation capabilities](overview.md#respond-to-incidents-rapidly) allowing you to visualize and explore alerts and entities, detect anomalies in user and entity behavior, and monitor real-time events during an investigation. |
| **Data collection** | [Collect data](overview.md#collect-data-at-scale) across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds. |
| **Threat response** | [Threat response capabilities](overview.md#respond-to-incidents-rapidly), such as playbooks that integrate with Azure services and your existing tools. |
| **Partner integrations** | Integrates with partner platforms using [Microsoft Sentinel data connectors](connect-data-sources.md), providing essential services for SOC teams. |

## Create custom integration solutions (partners) 

For partners who want to create custom solutions that integrate with Microsoft Sentinel, see [Best practices for partners integrating with Microsoft Sentinel](partner-integrations.md).

## Plan incident management and response process

The following image shows recommended steps in an incident management and response process.

:::image type="content" source="media/best-practices/incident-handling.png" alt-text="Diagram showing incident management process: Triage. Preparation. Remediation. Eradication. Post incident activities.":::

The following table provides high-level incident management and response tasks and related best practices. For more information, see [Microsoft Sentinel incident investigation in the Azure portal](investigate-incidents.md) or [Incidents and alerts in the Microsoft Defender portal](/defender-xdr/incidents-overview).

|Task  |Best practice  |
|---------|---------|
|**Review Incidents page**| Review an incident on the **Incidents** page, which lists the title, severity, and related alerts, logs, and any entities of interest. You can also jump from incidents into collected logs and any tools related to the incident. |
|**Use Incident graph**    |  Review the **Incident graph** for an incident to see the full scope of an attack. You can then construct a timeline of events and discover the extent of a threat chain. |
|**Review incidents for false positives** |Use data about key entities, such as accounts, URLs, IP address, host names, activities, timeline to understand whether you have a [false positive](false-positives.md) on hand, in which case you can close the incident directly.<br><br>If you discover that the incident is a true positive, take action directly from the **Incidents** page to investigate logs, entities, and explore the threat chain. After you identified the threat and created a plan of action, use other tools in Microsoft Sentinel and other Microsoft security services to continue investigating.      |
|**Visualize information**   | Take a look at the Microsoft Sentinel overview dashboard to get an idea of the security posture of your organization. For more information, see [Visualize collected data](get-visibility.md). <br><br>In addition to information and trends on the Microsoft Sentinel overview page, workbooks are valuable investigative tools. For example, use the [Investigation Insights](top-workbooks.md#investigation-insights) workbook to investigate specific incidents together with any associated entities and alerts. This workbook enables you to dive deeper into entities by showing related logs, actions, and alerts.       |
|**Hunt for threats**     |  While investigating and searching for root causes, run built-in threat hunting queries and check results for any indicators of compromise. For more information, see [Threat hunting in Microsoft Sentinel](hunting.md).|
|Use livestream |During an investigation, or after having taken steps to remediate and eradicate the threat, use [livestream](livestream.md). Livestream allows you to monitor, in real time, whether there are any lingering malicious events, or if malicious events are still continuing.       |
|**Entity behavior**     | Entity behavior in Microsoft Sentinel allows users to review and investigate actions and alerts for specific entities, such as investigating accounts and host names. For more information, see:<br><br>- [Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](enable-entity-behavior-analytics.md)<br>- [Investigate incidents with UEBA data](investigate-with-ueba.md)<br>- [Microsoft Sentinel UEBA enrichments reference](ueba-reference.md)        |
|**Watchlists**    |   Use a watchlist that combines data from ingested data and external sources, such as enrichment data. For example, create lists of IP address ranges used by your organization or recently terminated employees. Use watchlists with playbooks to gather enrichment data, such as adding malicious IP addresses to watchlists to use during detection, threat hunting, and investigations. <br><br>During an incident, use watchlists to contain investigation data, and then delete them when your investigation is done to ensure that sensitive data doesn't remain in view.   <br><br> For more information, see [Watchlists in Microsoft Sentinel](watchlists.md).   |

## Optimize data collection and ingestion

Review the Microsoft Sentinel [data collection best practices](best-practices-data.md), which include prioritizing data connectors, filtering logs, and optimizing data ingestion.

## Make your Kusto Query Language queries faster

Review the [Kusto Query Language best practices](/kusto/query/best-practices) to make queries faster.

## Related content

- [Microsoft Sentinel operational guide](ops-guide.md)
- [On-board Microsoft Sentinel](quickstart-onboard.md)
- [On-board Microsoft Sentinel data lake](datalake/sentinel-lake-onboarding.md)
- [Deployment guide for Microsoft Sentinel](deploy-overview.md)
- [Protecting MSSP intellectual property in Microsoft Sentinel](mssp-protect-intellectual-property.md)
