---
title: What is Microsoft Sentinel SIEM?
description: Learn about Microsoft Sentinel, a scalable, cloud-native SIEM and SOAR that uses AI, analytics, and automation for threat detection, investigation, and response.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

# Customer intent: As a business decision-maker evaluating SIEM/SOAR solutions, I want a summary of Microsoft Sentinel’s cloud-native capabilities so I can determine whether it meets my organization’s security, compliance, and operational requirements and plan adoption or migration.

---

# What is Microsoft Sentinel SIEM?

Microsoft Sentinel is a scalable, cloud-native security information and event management (SIEM) that delivers scalable, cost-efficient security across multicloud and multi-platform environments with built-in AI, automation, threat intelligence, and a modern data lake architecture. Microsoft Sentinel provides cyberthreat detection, investigation, response, and proactive hunting, with a bird's-eye view across your enterprise.

Microsoft Sentinel SIEM natively incorporates proven Azure services, like Log Analytics and Logic Apps, and enriches your investigation and detection with AI. It uses both Microsoft's threat intelligence stream and also enables you to bring your own threat intelligence.

Microsoft Sentinel SIEM empowers analysts to anticipate and stop attacks across clouds and platforms, faster and with greater precision. Use Microsoft Sentinel SIEM to alleviate the stress of increasingly sophisticated attacks, increasing volumes of alerts, and long resolution time frames. This article highlights the key capabilities in Microsoft Sentinel.

Microsoft Sentinel SIEM inherits the Azure Monitor [tamper-proofing and immutability](/azure/azure-monitor/logs/data-security#tamper-proofing-and-immutability) practices. While Azure Monitor is an append-only data platform, it includes provisions to delete data for compliance purposes.

This service supports [Azure Lighthouse](/azure/lighthouse/overview), which lets service providers sign in to their own tenant to manage subscriptions and resource groups that customers have delegated.

## Enable Out-of-the-Box Security Content

Microsoft Sentinel SIEM provides security content packaged in SIEM solutions that enable you to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services.

:::image type="content" source="/media/sentinel-siem-overview/sentinel-content-hub.png" alt-text="Image that shows the Microsoft Sentinel content hub in the Defender portal." lighthouse="media/sentinel-siem-overview/sentinel-content-hub.png":::

For more information, see [About Microsoft Sentinel content and solutions](./sentinel-solutions.md).

---

## Collect Data at Scale

Collect data across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.

:::image type="content" source="media/sentinel-siem-overview/sentinel-data-connectors.png" alt-text="Image that shows the Microsoft Sentinel Data Connectors page in the Azure portal." lighthouse="media/sentinel-siem-overview/sentinel-data-connectors.png":::

---

## Detect Threats

Detect previously undetected threats and minimize false positives using Microsoft's analytics and unparalleled threat intelligence.


:::image type="content" source="media/sentinel-siem-overview/sentinel-threat-detection.png" alt-text="Image that shows the MITRE Attack page in the Defender portal." lighthouse="media/sentinel-siem-overview/sentinel-threat-detection.png":::

This table highlights the key capabilities in Microsoft Sentinel for threat detection.

| **Capacity**           | **Description**                                              | **Get  started**                                             |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Analytics              | Helps  you reduce noise and minimize the number of alerts you have to review and  investigate. Microsoft Sentinel uses analytics to group alerts into  incidents. Use the out of the box analytic rules as-is, or as a starting  point to build your own rules. Microsoft Sentinel also provides rules to map  your network behavior and then look for anomalies across your resources.  These analytics connect the dots, by combining low fidelity alerts about  different entities into potential high-fidelity security incidents. | [Detect threats out-of-the-box](./threat-detection.md) |
| MITRE  ATT&CK coverage | Microsoft  Sentinel analyzes ingested data, not only to detect threats and help you  investigate, but also to visualize the nature and coverage of your  organization's security status based on the tactics and techniques from the  MITRE ATT&CK® framework. | [Understand security coverage by the MITRE ATT&CK®   framework](./mitre-coverage.md) |
| Threat  intelligence   | Integrate  numerous sources of threat intelligence into Microsoft Sentinel to detect  malicious activity in your environment and provide context to security  investigators for informed response decisions. | [Threat intelligence in Microsoft Sentinel](./understand-threat-intelligence.md) |
| Watchlists             | Correlate  data from a data source you provide, a watchlist, with the events in your  Microsoft Sentinel environment. For example, you might create a watchlist  with a list of high-value assets, terminated employees, or service accounts  in your environment. Use watchlists in your search, detection rules, threat  hunting, and response playbooks. | [Watchlists in Microsoft Sentinel](./watchlists.md) |
| Workbooks              | Create  interactive visual reports by using workbooks. Microsoft Sentinel comes with  built-in workbook templates that allow you to quickly gain insights across  your data as soon as you connect a data source. Or, create your own custom  workbooks. | [Visualize collected data](./get-visibility.md) |


## Investigate Threats

Investigate threats with artificial intelligence, and hunt for suspicious activities at scale.

:::image type="content" source="media/sentinel-siem-overview/sentinel-investigate-threats.png" alt-text="Image showing an Microsoft Sentinel incident investigation graph." lighthouse="media/sentinel-siem-overview/sentinel-investigate-threats.png":::

This table highlights the key capabilities in Microsoft Sentinel for threat investigation.

| **Feature** | **Description**                                              | **Get  started**                                             |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Incidents   | Microsoft  Sentinel deep investigation tools help you to understand the scope and find  the root cause of a potential security threat. You can choose an entity on  the interactive graph to ask interesting questions for a specific entity, and  drill down into that entity and its connections to get to the root cause of  the threat. | [Navigate and investigate incidents in Microsoft   Sentinel](./investigate-incidents.md) |
| Hunts       | Microsoft  Sentinel's powerful hunting search-and-query tools, based on the MITRE  framework, enable you to proactively hunt for security threats across your  organization’s data sources, before an alert is triggered. Create custom  detection rules based on your hunting query. Then, surface those insights as  alerts to your security incident responders. | [Threat hunting in Microsoft Sentinel](./hunting.md) |
| Notebooks   | Microsoft  Sentinel supports Jupyter notebooks in Azure Machine Learning workspaces,  including full libraries for machine learning, visualization, and data  analysis.      Use notebooks in Microsoft Sentinel to extend the scope of what you can do  with Microsoft Sentinel data. For example:      - Perform analytics that aren't built in to Microsoft Sentinel, such as some  Python machine learning features.   - Create data visualizations that aren't built in to Microsoft Sentinel, such  as custom timelines and process trees.   - Integrate data sources outside of Microsoft Sentinel, such as an  on-premises data set. | [Jupyter notebooks with Microsoft Sentinel hunting capabilities](./notebooks.md) |


## Respond to Incidents Rapidly

Automate your common tasks and simplify security orchestration with playbooks that integrate with Azure services and your existing tools. Microsoft Sentinel's automation and orchestration provides a highly extensible architecture that enables scalable automation as new technologies and threats emerge.

Playbooks in Microsoft Sentinel are based on workflows built in Azure Logic Apps. For example, if you use the ServiceNow ticketing system, use Azure Logic Apps to automate your workflows and open a ticket in ServiceNow each time a particular alert or incident is generated.

:::image type="content" source="media/sentinel-siem-overview/sentinel-playbooks.png" alt-text="Image that shows an automated workflow in Logic Apps that's used to respond to incidents in Microsoft Sentinel" lighthouse="media/sentinel-siem-overview/sentinel-playbooks.png":::

This table highlights the key capabilities in Microsoft Sentinel for threat response.

| **Feature**       | **Description**                                              | **Get  started**                                             |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Automation  rules | Centrally  manage the automation of incident handling in Microsoft Sentinel by defining  and coordinating a small set of rules that cover different scenarios. | [Automate threat response in Microsoft Sentinel with automation rules](./automate-incident-handling-with-automation-rules.md)|
| Playbooks         | Automate  and orchestrate your threat response by using playbooks, which are a  collection of remediation actions. Run a playbook on-demand or automatically  in response to specific alerts or incidents, when triggered by an automation  rule.      To build playbooks with Azure Logic Apps, choose from a constantly expanding  gallery of connectors for various services and systems like ServiceNow, Jira,  and more. These connectors allow you to apply any custom logic in your  workflow. | [Automate threat response with playbooks in Microsoft Sentinel](../sentinel/automation/automate-responses-with-playbooks.md)[List of all Logic App connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) |

## Microsoft Sentinel in the Azure portal retirement timeline

Microsoft Sentinel is [generally available in the Microsoft Defender portal](./microsoft-sentinel-defender-portal.md), including for customers without Microsoft Defender XDR or an E5 license. This means that you can use Microsoft Sentinel in the Defender portal even if you aren't using other Microsoft Defender services.

Starting in **July 2026**, Microsoft Sentinel will be supported in the Defender portal only, and any remaining customers using the Azure portal will be automatically redirected.

If you're currently using Microsoft Sentinel in the Azure portal, we recommend that you start planning your transition to the Defender portal now to ensure a smooth transition and take full advantage of the [unified security operations experience offered by Microsoft Defender](/unified-secops-platform/overview-unified-security).

For more information, see:

[Microsoft Sentinel in the Microsoft Defender portal](./microsoft-sentinel-defender-portal.md)

[Transition your Microsoft Sentinel environment to the Defender portal](./move-to-defender.md)

[Planning your move to Microsoft Defender portal for all Microsoft Sentinel customers](https://techcommunity.microsoft.com/blog/microsoft-security-blog/planning-your-move-to-microsoft-defender-portal-for-all-microsoft-sentinel-custo/4428613) (blog)

## Changes for new customers starting July 2025

For the sake of the changes described in this section, new Microsoft Sentinel customers are customers who are [onboarding the first workspace in their tenant to Microsoft Sentinel](./quickstart-onboard.md).

Starting **July, 2025**, such new customers who also have the permissions of a subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) or a [User access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), and are not Azure Lighthouse-delegated users, have their workspaces automatically onboarded to the Defender portal together with onboarding to Microsoft Sentinel.

Users of such workspaces, who also aren't Azure Lighthouse-delegated users, see links in Microsoft Sentinel in the Azure portal that redirect them to the Defender portal.

For example:

:::image type="content" source="media/sentinel-siem-overview/sentinel-redirect-to-defender-portal.png" alt-text="Screenshot showing an Azure portal Microsoft Sentinel redirect link to the Microsoft Defender portal." lighthouse="media/sentinel-siem-overview/sentinel-redirect-to-defender-portal.png":::

Such users use Microsoft Sentinel in the Defender portal only.

New customers who don't have relevant permissions aren't automatically onboarded to the Defender portal, but they do still see redirection links in the Azure portal, together with prompts to have a user with relevant permissions manually onboard the workspace to the Defender portal.

This table summarizes these experiences:

| **Customer  type**                                           | **Experience**                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Existing  customers**  creating new workspaces in a tenant where there is already a workspace  enabled for Microsoft Sentinel | Workspaces  are not automatically onboarded, and users don't see redirection links |
| **Azure  Lighthouse-delegated users** creating new workspaces in any tenant | Workspaces  are not automatically onboarded, and users don't see redirection links |
| **New  customers**  onboarding the first workspace in their tenant to Microsoft Sentinel | - **Users  who have the required permissions** have their workspace automatically  onboarded. Other users of such workspaces see redirection links in the Azure  portal.      - **Users who don't have the required permissions** don't have their  workspace automatically onboarded. All users of such workspaces see  redirection links in the Azure portal, and a user with the required  permissions must onboard the workspace to the Defender portal. |

## Related Content

[Onboard Microsoft Sentinel](./quickstart-onboard.md)

[Deployment guide for Microsoft Sentinel](./deploy-overview.md)

[Plan costs and understand Microsoft Sentinel pricing and billing](./billing.md)
