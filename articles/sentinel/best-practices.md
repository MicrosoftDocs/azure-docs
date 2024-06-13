---
title: Best practices for Microsoft Sentinel
description: Learn about best practices to employ when managing your Microsoft Sentinel workspace.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 05/16/2024
---

# Best practices for Microsoft Sentinel

Best practice guidance is provided throughout the technical documentation for Microsoft Sentinel. This article highlights some key guidance to use when deploying, managing, and using Microsoft Sentinel.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Setting up Microsoft Sentinel

Start with the [deployment guide for Microsoft Sentinel](deploy-overview.md). The deployment guide covers the high level steps to plan, deploy, and fine-tune your Microsoft Sentinel deployment. From that guide, select the provided links to find detailed guidance for each stage in your deployment.

## Microsoft security service integrations

Microsoft Sentinel is empowered by the components that send data to your workspace, and is made stronger through integrations with other Microsoft services. Any logs ingested into products, such as Microsoft Defender for Cloud Apps, Microsoft Defender for Endpoint, and Microsoft Defender for Identity, allow these services to create detections, and in turn provide those detections to Microsoft Sentinel. Logs can also be ingested directly into Microsoft Sentinel to provide a fuller picture for events and incidents.

For example, the following image shows how Microsoft Sentinel ingests data from other Microsoft services and multicloud and partner platforms to provide coverage for your environment:

:::image type="content" source="media/best-practices/azure-sentinel-and-other-services.png" alt-text="Microsoft Sentinel integrating with other Microsoft and partner services":::

More than ingesting alerts and logs from other sources, Microsoft Sentinel also:

- **Uses the information it ingests with [machine learning](bring-your-own-ml.md)** that allows for better event correlation, alert aggregation, anomaly detection, and more.
- **Builds and presents interactive visuals via [workbooks](get-visibility.md)**, showing trends, related information, and key data used for both admin tasks and investigations.
- **Runs [playbooks](tutorial-respond-threats-playbook.md) to act on alerts**, gathering information, performing actions on items, and sending notifications to various platforms.
- **Integrates with partner platforms**, such as ServiceNow and Jira, to provide essential services for SOC teams.
- **Ingests and fetches enrichment feeds** from [threat intelligence platforms](threat-intelligence-integration.md) to bring valuable data for investigating.

For more information about integrating data from other services or providers, see [Microsoft Sentinel data connectors](connect-data-sources.md).

Consider onboarding Microsoft Sentinel to the Microsoft Defender portal to unify capabilities with Microsoft Defender XDR like incident management and advanced hunting. For more information, see the following articles:

- [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)


## Incident management and response

The following image shows recommended steps in an incident management and response process.

:::image type="content" source="media/best-practices/incident-handling.png" alt-text="Diagram of incident management process: Triage. Preparation. Remediation. Eradication. Post incident activities.":::

The following table provides high-level descriptions for how to use Microsoft Sentinel features for incident management and response. For more information, see [Investigate incidents with Microsoft Sentinel](investigate-cases.md).


|Capability  |Best practice  |
|---------|---------|
|Incidents| Any generated incidents are displayed on the **Incidents** page, which serves as the central location for triage and early investigation. The **Incidents** page lists the title, severity, and related alerts, logs, and any entities of interest. Incidents also provide a quick jump into collected logs and any tools related to the incident. |
|Investigation graph    |  The **Incidents** page works together with the **Investigation graph**, an interactive tool that allows users to explore and dive deep into an alert to show the full scope of an attack. Users can then construct a timeline of events and discover the extent of a threat chain.<br><br>Discover key entities, such as accounts, URLs, IP address, host names, activities, timeline, and more. Use this data to understand whether you have a [false positive](false-positives.md) on hand, in which case you can close the incident directly.<br><br>If you discover that the incident is a true positive, take action directly from the **Incidents** page to investigate logs, entities, and explore the threat chain. After you identified the threat and created a plan of action, use other tools in Microsoft Sentinel and other Microsoft security services to continue investigating.      |
|Information visualization   |  To visualize and get analysis of what's happening on your environment, first, take a look at the Microsoft Sentinel overview dashboard to get an idea of the security posture of your organization. For more information, see [Visualize collected data](get-visibility.md). <br><br>In addition to information and trends on the Microsoft Sentinel overview page, workbooks are valuable investigative tools. For example, use the [Investigation Insights](top-workbooks.md#investigation-insights) workbook to investigate specific incidents together with any associated entities and alerts. This workbook enables you to dive deeper into entities by showing related logs, actions, and alerts.       |
|Threat hunting     |  While investigating and searching for root causes, run built-in threat hunting queries and check results for any indicators of compromise. For more information, see [Threat hunting in Microsoft Sentinel](hunting.md).<br><br>During an investigation, or after having taken steps to remediate and eradicate the threat, use [livestream](livestream.md). Livestream allows you to monitor, in real time, whether there are any lingering malicious events, or if malicious events are still continuing.       |
|Entity behavior     | Entity behavior in Microsoft Sentinel allows users to review and investigate actions and alerts for specific entities, such as investigating accounts and host names. For more information, see:<br><br>- [Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](enable-entity-behavior-analytics.md)<br>- [Investigate incidents with UEBA data](investigate-with-ueba.md)<br>- [Microsoft Sentinel UEBA enrichments reference](ueba-reference.md)        |
|Watchlists    |   Use a watchlist that combines data from ingested data and external sources, such as enrichment data. For example, create lists of IP address ranges used by your organization or recently terminated employees. Use watchlists with playbooks to gather enrichment data, such as adding malicious IP addresses to watchlists to use during detection, threat hunting, and investigations. <br><br>During an incident, use watchlists to contain investigation data, and then delete them when your investigation is done to ensure that sensitive data doesn't remain in view.   <br><br> For more information, see [Watchlists in Microsoft Sentinel](watchlists.md).   |

## Regular SOC activities to perform

Schedule the following Microsoft Sentinel activities regularly to ensure continued security best practices:

### Daily tasks

- **Triage and investigate incidents**.  Review the Microsoft Sentinel **Incidents** page to check for new incidents generated by the currently configured analytics rules, and start investigating any new incidents. For more information, see [Investigate incidents with Microsoft Sentinel](investigate-cases.md).

- **Explore hunting queries and bookmarks**. Explore results for all built-in queries, and update existing hunting queries and bookmarks. Manually generate new incidents or update old incidents if applicable.  For more information, see:

    - [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md)
    - [Hunt for threats with Microsoft Sentinel](hunting.md)
    - [Keep track of data during hunting with Microsoft Sentinel](bookmarks.md)

- **Analytic rules**.  Review and enable new analytics rules as applicable, including both newly released or newly available rules from recently connected data connectors.

- **Data connectors**. Review the status, date, and time of the last log received from each data connector to ensure that data is flowing. Check for new connectors, and review ingestion to ensure set limits aren't exceeded. For more information, see [Data collection best practices](best-practices-data.md) and [Connect data sources](connect-data-sources.md).

- **Log Analytics Agent**. Verify that servers and workstations are actively connected to the workspace, and troubleshoot and remediate any failed connections.   For more information, see     [Log Analytics Agent overview](../azure-monitor/agents/log-analytics-agent.md).

- **Playbook failures**. Verify playbook run statuses and troubleshoot any failures.   For more information, see  [Tutorial: Respond to threats by using playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md).

### Weekly tasks

- **Content review of solutions or standalone content**. Get any content updates for your installed solutions or standalone content from the [Content hub](sentinel-solutions-deploy.md). Review new solutions or standalone content that might be of value for your environment, such as analytics rules, workbooks, hunting queries, or playbooks.

- **Microsoft Sentinel auditing**. Review Microsoft Sentinel activity to see who updated or deleted resources, such as analytics rules, bookmarks, and so on. For more information, see [Audit Microsoft Sentinel queries and activities](audit-sentinel-data.md).

### Monthly tasks

- **Review user access**. Review permissions for your users and check for inactive users. For more information, see [Permissions in Microsoft Sentinel](roles.md).

- **Log Analytics workspace review**. Review that the Log Analytics workspace data retention policy still aligns with your organization's policy.  For more information, see  [Data retention policy](/workplace-analytics/privacy/license-expiration) and [Integrate Azure Data Explorer for long-term log retention](store-logs-in-azure-data-explorer.md).


## Related content

- [On-board Microsoft Sentinel](quickstart-onboard.md)
- [Deployment guide for Microsoft Sentinel](deploy-overview.md)
- [Protecting MSSP intellectual property in Microsoft Sentinel](mssp-protect-intellectual-property.md)

