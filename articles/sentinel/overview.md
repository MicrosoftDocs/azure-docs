---
title: What is Microsoft Sentinel? | Microsoft Docs
description: Learn about Microsoft Sentinel, a scalable, cloud-native security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution.
author: yelevin
ms.author: yelevin
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 07/14/2022
---

# What is Microsoft Sentinel?

Microsoft Sentinel is a scalable, cloud-native solution that provides:

- Security information and event management (SIEM)
- Security orchestration, automation, and response (SOAR)

Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise. With Microsoft Sentinel, you get a single solution for attack detection, threat visibility, proactive hunting, and threat response.

Microsoft Sentinel is your bird's-eye view across the enterprise alleviating the stress of increasingly sophisticated attacks, increasing volumes of alerts, and long resolution time frames.

> [!NOTE]
> Microsoft Sentinel inherits the Azure Monitor [tamper-proofing and immutability](../azure-monitor/logs/data-security.md#tamper-proofing-and-immutability) practices. While Azure Monitor is an append-only data platform, it includes provisions to delete data for compliance purposes.

- **Collect data at cloud scale** across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.

- **Detect previously undetected threats**, and [minimize false positives](false-positives.md) using Microsoft's analytics and unparalleled threat intelligence.

- **Investigate threats with artificial intelligence**, and hunt for suspicious activities at scale, tapping into years of cyber security work at Microsoft.

- **Respond to incidents rapidly** with built-in orchestration and automation of common tasks.

:::image type="icon" source="media/overview/core-capabilities.png" border="false":::

Microsoft Sentinel natively incorporates proven Azure services, like Log Analytics and Logic Apps. Microsoft Sentinel enriches your investigation and detection with AI. It provides Microsoft's threat intelligence stream and enables you to bring your own threat intelligence.

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Collect data by using data connectors

To on-board Microsoft Sentinel, you first need to [connect to your data sources](connect-data-sources.md).

Microsoft Sentinel comes with many connectors for Microsoft solutions that are available out of the box and provide real-time integration. Some of these connectors include:

- Microsoft sources like Microsoft Defender XDR, Microsoft Defender for Cloud, Office 365, Microsoft Defender for IoT, and more.
- Azure service sources like Microsoft Entra ID, Azure Activity, Azure Storage, Azure Key Vault, Azure Kubernetes service, and more.

Microsoft Sentinel has built-in connectors to the broader security and applications ecosystems for non-Microsoft solutions. You can also use common event format, Syslog, or REST-API to connect your data sources with Microsoft Sentinel.

For more information, see [Find your data connector](data-connectors-reference.md).

:::image type="content" source="media/connect-data-sources/open-data-connector-page.png" alt-text="Screenshot of the data connectors page in Microsoft Sentinel that shows a list of available connectors.":::

## Create interactive reports by using workbooks

After you [onboard to Microsoft Sentinel](quickstart-onboard.md), monitor your data by using the integration with Azure Monitor workbooks.

Workbooks display differently in Microsoft Sentinel than in Azure Monitor. But it may be useful for you to see how to [create a workbook in Azure Monitor](../azure-monitor/visualize/workbooks-create-workbook.md). Microsoft Sentinel allows you to create custom workbooks across your data. Microsoft Sentinel also comes with built-in workbook templates to allow you to quickly gain insights across your data as soon as you connect a data source.

:::image type="content" source="media/tutorial-monitor-data/access-workbooks.png" alt-text="Screenshot of workbooks page in Microsoft Sentinel with a list of available workbooks.":::

Workbooks are intended for SOC engineers and analysts of all tiers to visualize data.

Workbooks are best used for high-level views of Microsoft Sentinel data, and don't require coding knowledge. But you can't integrate workbooks with external data.

## Correlate alerts into incidents by using analytics rules

To help you reduce noise and minimize the number of alerts you have to review and investigate, Microsoft Sentinel uses [analytics to correlate alerts into incidents](detect-threats-built-in.md). Incidents are groups of related alerts that together indicate an actionable possible-threat that you can investigate and resolve. Use the built-in correlation rules as-is, or use them as a starting point to build your own. Microsoft Sentinel also provides machine learning rules to map your network behavior and then look for anomalies across your resources. These analytics connect the dots, by combining low fidelity alerts about different entities into potential high-fidelity security incidents.

:::image type="content" source="media/investigate-cases/incident-severity.png" alt-text="Screenshot of the incidents page in Microsoft Sentinel with a list of open incidents."  lightbox="media/investigate-cases/incident-severity.png":::

## Automate and orchestrate common tasks by using playbooks

Automate your common tasks and [simplify security orchestration with playbooks](tutorial-respond-threats-playbook.md) that integrate with Azure services and your existing tools.

Microsoft Sentinel's automation and orchestration solution provides a highly extensible architecture that enables scalable automation as new technologies and threats emerge. To build playbooks with Azure Logic Apps, you can choose from a constantly expanding gallery with [many hundreds of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for various services and systems. These connectors allow you to apply any custom logic in your workflow, for example:

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

Playbooks are intended for SOC engineers and analysts of all tiers, to automate and simplify tasks, including data ingestion, enrichment, investigation, and remediation.

Playbooks work best with single, repeatable tasks, and don't require coding knowledge. Playbooks aren't suitable for ad-hoc or complex task chains, or for documenting and sharing evidence.

## Investigate the scope and root cause of security threats

Microsoft Sentinel [deep investigation](investigate-cases.md) tools help you to understand the scope and find the root cause of a potential security threat. You can choose an entity on the interactive graph to ask interesting questions for a specific entity, and drill down into that entity and its connections to get to the root cause of the threat.

:::image type="content" source="media/investigate-cases/map-timeline.png" alt-text="Screenshot of an incident investigation that shows an entity and connected entities in an interactive graph.":::

## Hunt for security threats by using built-in queries

Use Microsoft Sentinel's [powerful hunting search-and-query tools](hunting.md), based on the MITRE framework, which enable you to proactively hunt for security threats across your organization’s data sources, before an alert is triggered. Create custom detection rules based on your hunting query. Then, surface those insights as alerts to your security incident responders.

While hunting, create bookmarks to return to  interesting events later. Use a bookmark to share an event with others. Or, group events with other correlating events to create a compelling incident for investigation.

:::image type="content" source="media/overview/hunting.png" alt-text="Screenshot of the hunting page in Microsoft Sentinel that shows a list of available queries. ":::

## Enhance your threat hunting with notebooks

Microsoft Sentinel supports Jupyter notebooks in Azure Machine Learning workspaces, including full libraries for machine learning, visualization, and data analysis.

[Use notebooks in Microsoft Sentinel](notebooks.md) to extend the scope of what you can do with Microsoft Sentinel data. For example:

- Perform analytics that aren't built in to Microsoft Sentinel, such as some Python machine learning features.
- Create data visualizations that aren't built in to Microsoft Sentinel, such as custom timelines and process trees.
- Integrate data sources outside of Microsoft Sentinel, such as an on-premises data set.

:::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Screenshot of a Sentinel notebook in an Azure Machine Learning workspace.":::

Notebooks are intended for threat hunters or Tier 2-3 analysts, incident investigators, data scientists, and security researchers. They require a higher learning curve and coding knowledge. They have limited automation support.

Notebooks in Microsoft Sentinel provide:

- Queries to both Microsoft Sentinel and external data
- Features for data enrichment, investigation, visualization, hunting, machine learning, and big data analytics

Notebooks are best for:

- More complex chains of repeatable tasks
- Ad-hoc procedural controls
- Machine learning and custom analysis

Notebooks support rich Python libraries for manipulating and visualizing data. They're useful to document and share analysis evidence.

## Download security content from the community

The Microsoft Sentinel community is a powerful resource for threat detection and automation. Our Microsoft security analysts create and add new workbooks, playbooks, hunting queries, and more. They post these content items to the community for you to use in your environment. Download sample content from the private community GitHub [repository](https://aka.ms/asicommunity) to create custom workbooks, hunting queries, notebooks, and playbooks for Microsoft Sentinel.

:::image type="content" source="media/overview/community.png" alt-text="Screenshot of the GitHub repository for Microsoft Sentinel with downloadable content like hunting queries, parsers, and playbooks. ":::

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](get-visibility.md).
