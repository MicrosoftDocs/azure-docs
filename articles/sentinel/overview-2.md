---
title: What is Microsoft Sentinel? | Microsoft Docs
description: Learn about Microsoft Sentinel, a scalable, cloud-native security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution.
author: cwatson-cat
ms.author: cwatson
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 04/08/2024
#customer intent: As a business decision maker, I want to understand what Microsoft Sentinel offers to determine whether the service meets my organization's requirements.
---

# What is Microsoft Sentinel?

Microsoft Sentinel is a scalable, cloud-native solution that delivers an intelligent, comprehensive security information and event management (SIEM) solution for cyberthreat detection, investigation, response, and proactive hunting.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Enable out of the box security content

Microsoft Sentinel provides security content packaged in SIEM solutions that enable you to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

# [Azure portal](#tab/azure-portal)

:::image type="content" source="media/overview/content-hub-azure-portal.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Azure portal that shows the security content available with a solution":::

# [Defender portal](#tab/defender-portal)

:::image type="content" source="media/overview/content-hub-defender-portal.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Defender portal that shows the security content available with a solution":::

---

## Collect data at cloud scale

Collect data at cloud scale across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.

### Out of the box data connectors

Microsoft Sentinel comes with many connectors packaged with solutions that are available out of the box and provide real-time integration. Some of these connectors include:

- Microsoft sources like Microsoft Entra ID, Microsoft Defender XDR, Microsoft Defender for Cloud, Microsoft 365, Microsoft Defender for IoT, and more.

- Azure service sources like Azure Activity, Azure Storage, Azure Key Vault, Azure Kubernetes service, and more.

Microsoft Sentinel has out of the box connectors to the broader security and applications ecosystems for non-Microsoft solutions. You can also use common event format, Syslog, or REST-API to connect your data sources with Microsoft Sentinel.

The Microsoft Sentinel **Data connectors** page lists the installed or in-use data connectors.

# [Azure portal](#tab/azure-portal)

:::image type="content" source="media/overview/data-connectors.png" alt-text="Screenshot of the data connectors page in Microsoft Sentinel that shows a list of available connectors.":::

# [Defender portal](#tab/defender-portal)

:::image type="content" source="media/overview/data-connector-list-defender.png" alt-text="Screenshot of the Microsoft Sentinel data connectors page in the Defender portal that shows a list of available connectors.":::

---

For more information, see the following resources:

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Connect your data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md)
- [Find your data connector](data-connectors-reference.md)

### Custom connectors

Microsoft Sentinel supports ingesting data from some sources without a dedicated connector. If you're unable to connect your data source to Microsoft Sentinel using an existing solutions, create your own data source connector. For more information, [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

### Data normalization

Microsoft Sentinel uses both query time and ingestion time normalization to translate various sources into a uniform, normalized view. For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

## Detect threats

Detect previously undetected threats, and minimize false positives using Microsoft's analytics and unparalleled threat intelligence.

### Analytics 

To help you reduce noise and minimize the number of alerts you have to review and investigate, Microsoft Sentinel uses analytics to group alerts into incidents. Use the out of the box analytic rules as-is, or as a starting point to build your own rules. Microsoft Sentinel also provides rules to map your network behavior and then look for anomalies across your resources. These analytics connect the dots, by combining low fidelity alerts about different entities into potential high-fidelity security incidents. For more information, see the following resources:

- [Detect threats out-of-the-box](detect-threats-built-in.md)
- [Create a custom analytics rule from scratch](detect-threats-custom.md)
- [Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)


### MITRE ATT&CK coverage

Microsoft Sentinel analyzes ingested data, not only to detect threats and help you investigate, but also to visualize the nature and coverage of your organization's security status based on the tactics and techniques from the MITRE ATT&CK® framework. For more information, see [Understand security coverage by the MITRE ATT&CK® framework](mitre-coverage.md).

### Threat intelligence 

Integrate numerous sources of threat intelligence into Microsoft Sentinel to detect malicious activity in your environment and provide context to security investigators for informed response decisions. For more information, see [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).

### Watchlists

Correlate data from a data source you provide, a watchlist, with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high-value assets, terminated employees, or service accounts in your environment. Use watchlists in your search, detection rules, threat hunting, and response playbooks. For more information, see [Watchlists in Microsoft Sentinel](watchlists.md).

### Workbooks

Create interactive visual reports by using workbooks.  Microsoft Sentinel comes with built-in workbook templates that allow you to quickly gain insights across your data as soon as you connect a data source. Or, create your own custom workbooks.

:::image type="content" source="media/monitor-your-data/access-workbooks.png" alt-text="Screenshot of workbooks page in Microsoft Sentinel with a list of available workbooks.":::

For more information, see [Visualize collected data](get-visibility.md).

## Investigate threats

Investigate threats with artificial intelligence, and hunt for suspicious activities at scale, tapping into years of cyber security work at Microsoft.

### Incidents

Microsoft Sentinel deep investigation tools help you to understand the scope and find the root cause of a potential security threat. You can choose an entity on the interactive graph to ask interesting questions for a specific entity, and drill down into that entity and its connections to get to the root cause of the threat.

:::image type="content" source="media/investigate-cases/map-timeline.png" alt-text="Screenshot of an incident investigation that shows an entity and connected entities in an interactive graph.":::

For more information, see [Navigate and investigate incidents in Microsoft Sentinel](investigate-incidents.md).

### Tasks 

Manage your organization's incident-handling workflow processes in Microsoft Sentinel by using incident tasks. For more information, see [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md).

### Hunts

Use Microsoft Sentinel's powerful hunting search-and-query tools, based on the MITRE framework, which enable you to proactively hunt for security threats across your organization’s data sources, before an alert is triggered. Create custom detection rules based on your hunting query. Then, surface those insights as alerts to your security incident responders.

While hunting, create bookmarks to return to  interesting events later. Use a bookmark to share an event with others. Or, group events with other correlating events to create a compelling incident for investigation.

:::image type="content" source="media/overview/hunting.png" alt-text="Screenshot of the hunting page in Microsoft Sentinel that shows a list of available queries. ":::

For more information, see [Threat hunting in Microsoft Sentinel](hunting.md).

### Notebooks

Microsoft Sentinel supports Jupyter notebooks in Azure Machine Learning workspaces, including full libraries for machine learning, visualization, and data analysis.

Use notebooks in Microsoft Sentinel to extend the scope of what you can do with Microsoft Sentinel data. For example:

- Perform analytics that aren't built in to Microsoft Sentinel, such as some Python machine learning features.
- Create data visualizations that aren't built in to Microsoft Sentinel, such as custom timelines and process trees.
- Integrate data sources outside of Microsoft Sentinel, such as an on-premises data set.

:::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Screenshot of a Sentinel notebook in an Azure Machine Learning workspace.":::

Notebooks in Microsoft Sentinel provide:

- Queries to both Microsoft Sentinel and external data
- Features for data enrichment, investigation, visualization, hunting, machine learning, and big data analytics

For more information, see [Jupyter notebooks with Microsoft Sentinel hunting capabilities](notebooks.md).

## Respond to incidents rapidly

Automate your common tasks and simplify security orchestration with playbooks that integrate with Azure services and your existing tools.

Microsoft Sentinel's automation and orchestration provides a highly extensible architecture that enables scalable automation as new technologies and threats emerge. To build playbooks with Azure Logic Apps, choose from a constantly expanding gallery of connectors for various services and systems. These connectors allow you to apply any custom logic in your workflow, for example:

- ServiceNow
- Jira
- Zendesk
- HTTP requests
- Microsoft Teams
- Slack
- Microsoft Entra ID
- Microsoft Defender for Endpoint
- Microsoft Defender for Cloud Apps

For example, if you use the ServiceNow ticketing system, use Azure Logic Apps to automate your workflows and open a ticket in ServiceNow each time a particular alert or incident is generated.

:::image type="content" source="media/tutorial-respond-threats-playbook/logic-app.png" alt-text="Screenshot of example automated workflow in Azure Logic Apps where an incident can trigger different actions.":::

For more information, see:
- [List of all Logic App connectors](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)

## Related content

- [Quickstart: Onboard Microsoft Sentinel](quickstart-onboard.md)
- [Deployment guide for Microsoft Sentinel](deploy-overview.md)
- [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md)
