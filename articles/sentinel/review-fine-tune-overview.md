---
title: Fine tune and review your Microsoft Sentinel deployment process and content
description: This article includes a checklist to help you fine tune and review your deployed content and deployment process.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 07/05/2023
---
# Fine tune and review your Microsoft Sentinel deployment process and content

In previous steps, you planned and prepared for your deployment, and then you enabled the Microsoft solution and deployed key security content. In this article, you review a post-deployment checklist that helps you make sure that your deployment process is working as expected, and that the security content you deployed is working and protecting your organization according to your needs and use cases.

The fine tune and review phase is typically performed by a SOC engineer or related roles.

## Fine tune and review: Checklist for post-deployment

|Step |Actions |
| --------- | ------- |
|&#x2705; **Review incidents and incident process** |- Check whether the incidents and the number of incidents you're seeing reflect what's actually happening in your environment.<br>- Check whether your SOC's incident process is working to efficiently handle incidents: Have you assigned different types of incidents to different layers/tiers of the SOC?<br><br>Learn more about how to [navigate and investigate](investigate-incidents.md) incidents and how to [work with incident tasks](work-with-tasks.md). |
|&#x2705; **Review and fine-tune analytics rules** | - Based on your incident review, check whether your analytics rules are triggered as expected, and whether the rules reflect the types of incidents you're interested in.<br>- [Handle false positives](false-positives.md), either by using automation or by modifying scheduled analytics rules.<br>- Microsoft Sentinel provides built-in fine-tuning capabilities to help you analyze your analytics rules. [Review these built-in insights and implement relevant recommendations](detection-tuning.md).  |
|&#x2705; **Review automation rules and playbooks** |- Similar to analytics rules, check that your automation rules are working as expected, and reflect the incidents you're concerned about and are interested in.<br>- Check whether your playbooks are responding to alerts and incidents as expected. |
|&#x2705; **Add data to watchlists** |Check that your watchlists are up to date. If any changes have occurred in your environment, such as new users or use cases, [update your watchlists accordingly](watchlists-manage.md). |
|&#x2705; **Review commitment tiers** | [Review the commitment tiers](billing.md#analytics-logs) you initially set up, and verify that these tiers reflect your current configuration.  |
|&#x2705; **Keep track of ingestion costs** |To keep track of ingestion costs, use one of these workbooks:<br>- The [**Workspace Usage Report** workbook](billing-monitor-costs.md#deploy-a-workbook-to-visualize-data-ingestion) provides your workspace's data consumption, cost, and usage statistics. The workbook gives the workspace's data ingestion status and amount of free and billable data. You can use the workbook logic to monitor data ingestion and costs, and to build custom views and rule-based alerts.<br>- The **Microsoft Sentinel Cost** workbook gives a more focused view of Microsoft Sentinel costs, including ingestion and retention data, ingestion data for eligible data sources, Logic Apps billing information, and more. |
|&#x2705; **Fine-tune Data Collection Rules (DCRs)** |- Check that your [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md) reflect your data ingestion needs and use cases.<br>- If needed, [implement ingestion-time transformation](data-transformation.md#filtering) to filter out irrelevant data even before it's first stored in your workspace. |
|&#x2705; **Check analytics rules against MITRE framework** |[Check your MITRE coverage in the Microsoft Sentinel MITRE page](mitre-coverage.md): View the detections already active in your workspace, and those available for you to configure, to understand your organization's security coverage, based on the tactics and techniques from the MITRE ATT&CK® framework. |
|&#x2705; **Hunt for suspicious activity** |Make sure that your SOC has a process in place for [proactive threat hunting](hunts.md). Hunting is a process where security analysts seek out undetected threats and malicious behaviors. By creating a hypothesis, searching through data, and validating that hypothesis, they determine what to act on. Actions can include creating new detections, new threat intelligence, or spinning up a new incident. |

## Next steps

In this article, you reviewed a checklist of post-deployment steps. You're now finished your deployment of Microsoft Sentinel. 

To continue exploring Microsoft Sentinel capabilities, review these tutorials with common Microsoft Sentinel tasks:  

- [Forward Syslog data to a Log Analytics workspace with Microsoft Sentinel by using Azure Monitor Agent](forward-syslog-monitor-agent.md)
- [Configure data retention policy](configure-data-retention.md)
- [Detect threats using analytics rules](tutorial-log4j-detection.md)
- [Automatically check and record IP address reputation information in incidents](tutorial-enrich-ip-information.md)
- [Respond to threats using automation](tutorial-respond-threats-playbook.md)
- [Extract incident entities with non-native action](tutorial-extract-incident-entities.md)
- [Investigate with UEBA](investigate-with-ueba.md)
- [Build and monitor Zero Trust](sentinel-solution.md)