---
title: What is Microsoft Sentinel? | Microsoft Docs
description: Learn about Microsoft Sentinel, a scalable, cloud-native security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution.
author: yelevin
ms.topic: overview
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
ms.author: yelevin
---

# What is Microsoft Sentinel?

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Sentinel is a scalable, cloud-native, **security information and event management (SIEM)** and **security orchestration, automation, and response (SOAR)** solution. Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for attack detection, threat visibility, proactive hunting, and threat response.

Microsoft Sentinel is your birds-eye view across the enterprise alleviating the stress of increasingly sophisticated attacks, increasing volumes of alerts, and long resolution time frames.

- **Collect data at cloud scale** across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.

- **Detect previously undetected threats**, and [minimize false positives](false-positives.md) using Microsoft's analytics and unparalleled threat intelligence.

- **Investigate threats with artificial intelligence**, and hunt for suspicious activities at scale, tapping into years of cyber security work at Microsoft.

- **Respond to incidents rapidly** with built-in orchestration and automation of common tasks.

![Microsoft Sentinel core capabilities](./media/overview/core-capabilities.png)

Building on the full range of existing Azure services, Microsoft Sentinel natively incorporates proven foundations, like Log Analytics, and Logic Apps. Microsoft Sentinel enriches your investigation and detection with AI, and provides Microsoft's threat intelligence stream and enables you to bring your own threat intelligence.

## Connect to all your data

To on-board Microsoft Sentinel, you first need to [connect to your security sources](connect-data-sources.md). 

Microsoft Sentinel comes with a number of connectors for Microsoft solutions, available out of the box and providing real-time integration, including Microsoft 365 Defender (formerly Microsoft Threat Protection) solutions, and Microsoft 365 sources, including Office 365, Azure AD, Microsoft Defender for Identity (formerly Azure ATP), and Microsoft Defender for Cloud Apps, and more. In addition, there are built-in connectors to the broader security ecosystem for non-Microsoft solutions. You can also use common event format, Syslog or REST-API to connect your data sources with Microsoft Sentinel as well. 

For more information, see [Find your data connector](data-connectors-reference.md).

![Data collectors](./media/collect-data/collect-data-page.png)

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Workbooks

After you [connected your data sources](quickstart-onboard.md) to Microsoft Sentinel, you can monitor the data using the Microsoft Sentinel integration with Azure Monitor Workbooks, which provides versatility in creating custom workbooks.

While Workbooks are displayed differently in Microsoft Sentinel, it may be useful for you to see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/visualize/workbooks-overview.md). Microsoft Sentinel allows you to create custom workbooks across your data, and also comes with built-in workbook templates to allow you to quickly gain insights across your data as soon as you connect a data source.

![Dashboards](./media/tutorial-monitor-data/access-workbooks.png)

- Workbooks are intended for SOC engineers and analysts of all tiers to visualize data.

- While Workbooks are best used for high-level views of Microsoft Sentinel data, and require no coding knowledge, you cannot integrate Workbooks with external data.

## Analytics

To help you reduce noise and minimize the number of alerts you have to review and investigate, Microsoft Sentinel uses [analytics to correlate alerts into incidents](detect-threats-built-in.md). **Incidents** are groups of related alerts that together create an actionable possible-threat that you can investigate and resolve. Use the built-in correlation rules as-is, or use them as a starting point to build your own. Microsoft Sentinel also provides machine learning rules to map your network behavior and then look for anomalies across your resources. These analytics connect the dots, by combining low fidelity alerts about different entities into potential high-fidelity security incidents.

![Incidents](./media/investigate-cases/incident-severity.png)


## Security automation & orchestration

Automate your common tasks and [simplify security orchestration with playbooks](tutorial-respond-threats-playbook.md) that integrate with Azure services and your existing tools.

Built on the foundation of Azure Logic Apps, Microsoft Sentinel's automation and orchestration solution provides a highly extensible architecture that enables scalable automation as new technologies and threats emerge. To build playbooks with Azure Logic Apps, you can choose from a growing gallery of built-in playbooks. These include [200+ connectors](../connectors/apis-list.md) for services such as Azure functions. The connectors allow you to apply any custom logic in code, ServiceNow, Jira, Zendesk, HTTP requests, Microsoft Teams, Slack, Windows Defender ATP, and Defender for Cloud Apps.

For example, if you use the ServiceNow ticketing system, you can use the tools provided to use Azure Logic Apps to automate your workflows and open a ticket in ServiceNow each time a particular event is detected.

![Playbooks](./media/tutorial-respond-threats-playbook/logic-app.png)

- Playbooks are intended for SOC engineers and analysts of all tiers, to automate and simplify tasks, including data ingestion, enrichment, investigation, and remediation.

- Playbooks work best with single, repeatable tasks, and require no coding knowledge. Playbooks are not suitable for ad-hoc or complex task chains, or for documenting and sharing evidence.


## Investigation

Currently in preview, Microsoft Sentinel [deep investigation](investigate-cases.md) tools help you to understand the scope and find the root cause, of a potential security threat. You can choose an entity on the interactive graph to ask interesting questions for a specific entity, and drill down into that entity and its connections to get to the root cause of the threat. 

![Investigation](./media/investigate-cases/map-timeline.png)


## Hunting

Use Microsoft Sentinel's [powerful hunting search-and-query tools](hunting.md), based on the MITRE framework, which enable you to proactively hunt for security threats across your organization’s data sources, before an alert is triggered. After you discover which hunting query provides high-value insights into possible attacks, you can also create custom detection rules based on your query, and surface those insights as alerts to your security incident responders. While hunting, you can create bookmarks for interesting events, enabling you to return to them later, share them with others, and group them with other correlating events to create a compelling incident for investigation.

![Overview of hunting feature](./media/overview/hunting.png)

## Notebooks

Microsoft Sentinel supports Jupyter notebooks in Azure Machine Learning workspaces, including full libraries for machine learning, visualization, and data analysis.

[Use notebooks in Microsoft Sentinel](notebooks.md) to extend the scope of what you can do with Microsoft Sentinel data. For example, perform analytics that aren't built in to Microsoft Sentinel, such as some Python machine learning features, create data visualizations that aren't built in to Microsoft Sentinel, such as custom timelines and process trees, or integrate data sources outside of Microsoft Sentinel, such as an on-premises data set.

:::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Screenshot of a Sentinel notebook in an AML workspace.":::

- Microsoft Sentinel notebooks are intended for threat hunters or Tier 2-3 analysts, incident investigators, data scientists, and security researchers.

- Notebooks provide queries to both Microsoft Sentinel and external data, features for data enrichment, investigation, visualization, hunting, machine learning, and big data analytics.

- Notebooks are best for more complex chains of repeatable tasks, ad-hoc procedural controls, machine learning and custom analysis, support rich Python libraries for manipulating and visualizing data, and are useful in documenting and sharing analysis evidence.

- Notebooks require a higher learning curve and coding knowledge, and have limited automation support.


## Community

The Microsoft Sentinel community is a powerful resource for threat detection and automation. Our Microsoft security analysts constantly create and add new workbooks, playbooks, hunting queries, and more, posting them to the community for you to use in your environment. You can download sample content from the private community GitHub [repository](https://aka.ms/asicommunity) to create custom workbooks, hunting queries, notebooks, and playbooks for Microsoft Sentinel.

![Explore the user community](./media/overview/community.png)

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](get-visibility.md).
