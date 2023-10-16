---
title: Deployment guide for Microsoft Sentinel
description: Learn about the steps to deploy Microsoft Sentinel including the phases to plan and prepare, deploy, and fine tune.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 08/23/2023
ms.service: microsoft-sentinel
---

# Deployment guide for Microsoft Sentinel

This article introduces the activities that help you plan, deploy, and fine tune your Microsoft Sentinel deployment.

## Plan and prepare overview

This section introduces the activities and prerequisites that help you plan and prepare before deploying Microsoft Sentinel.

The plan and prepare phase is typically performed by a SOC architect or related roles.

| Step | Details |
| --------- | ------- |
| **1. Plan and prepare overview and prerequisites** | Review the [Azure tenant prerequisites](prerequisites.md). |
| **2. Plan workspace architecture** | Design your Microsoft Sentinel workspace. Consider parameters such as:<br><br>- Whether you'll use a single tenant or multiple tenants<br>- Any compliance requirements you have for data collection and storage<br>- How to control access to Microsoft Sentinel data<br><br>Review these articles:<br><br>1. [Review best practices](best-practices-workspace-architecture.md)<br>2. [Design workspace architecture](design-your-workspace-architecture.md)<br>3. [Review sample workspace designs](sample-workspace-designs.md)<br>4. [Prepare for multiple workspaces](prepare-multiple-workspaces.md) |
| **3. [Prioritize data connectors](prioritize-data-connectors.md)** | Determine which data sources you need and the data size requirements to help you accurately project your deployment's budget and timeline.<br><br>You might determine this information during your business use case review, or by evaluating a current SIEM that you already have in place. If you already have a SIEM in place, analyze your data to understand which data sources provide the most value and should be ingested into Microsoft Sentinel. |
| **4. [Plan roles and permissions](roles.md)** |Use Azure role based access control (RBAC) to create and assign roles within your security operations team to grant appropriate access to Microsoft Sentinel. The different roles give you fine-grained control over what Microsoft Sentinel users can see and do. Azure roles can be assigned in the Microsoft Sentinel workspace directly, or in a subscription or resource group that the workspace belongs to, which Microsoft Sentinel inherits. |
| **5. [Plan costs](billing.md)** |Start planning your budget, considering cost implications for each planned scenario.<br><br>   Make sure that your budget covers the cost of data ingestion for both Microsoft Sentinel and Azure Log Analytics, any playbooks that will be deployed, and so on. |

## Deployment overview

The deployment phase is typically performed by a SOC analyst or related roles.

| Step | Details |
| --------- | ------- |
| [**1. Enable Microsoft Sentinel, health and audit, and content**](enable-sentinel-features-content.md) | Enable Microsoft Sentinel, enable the health and audit feature, and enable the solutions and content you've identified according to your organization's needs. |
| [**2. Configure content**](configure-content.md) | Configure the different types of Microsoft Sentinel security content, which allow you to detect, monitor, and respond to security threats across your systems: Data connectors, analytics rules, automation rules, playbooks, workbooks, and watchlists. |
| [**3. Set up a cross-workspace architecture**](use-multiple-workspaces.md) |If your environment requires multiple workspaces, you can now set them up as part of your deployment. In this article, you learn how to set up Microsoft Sentinel to extend across multiple workspaces and tenants. |
| [**4. Enable User and Entity Behavior Analytics (UEBA)**](enable-entity-behavior-analytics.md) | Enable and use the UEBA feature to streamline the analysis process.  |
| [**5. Set up data retention and archive**](configure-data-retention-archive.md) |Set up data retention and archive, to make sure your organization retains the data that's important in the long term.  |

## Fine tune and review: Checklist for post-deployment

Review the post-deployment checklist to helps you make sure that your deployment process is working as expected, and that the security content you deployed is working and protecting your organization according to your needs and use cases.

The fine tune and review phase is typically performed by a SOC engineer or related roles.

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

## Related articles

In this article, you reviewed the activities in each of the phases that help you deploy Microsoft Sentinel.

Depending on which phase you're in, choose the appropriate next steps:

- Plan and prepare - [Prerequisites to deploy Azure Sentinel](prerequisites.md)
- Deploy - [Enable Microsoft Sentinel and initial features and content](enable-sentinel-features-content.md)
- Fine tune and review - [Navigate and investigate incidents in Microsoft Sentinel](investigate-incidents.md)[Navigate and investigate incidents in Microsoft Sentinel](investigate-incidents.md)

When you're finished with your deployment of Microsoft Sentinel, continue to explore Microsoft Sentinel capabilities by reviewing tutorials that cover common tasks:  

- [Forward Syslog data to a Log Analytics workspace with Microsoft Sentinel by using Azure Monitor Agent](forward-syslog-monitor-agent.md)
- [Configure data retention policy](configure-data-retention.md)
- [Detect threats using analytics rules](tutorial-log4j-detection.md)
- [Automatically check and record IP address reputation information in incidents](tutorial-enrich-ip-information.md)
- [Respond to threats using automation](tutorial-respond-threats-playbook.md)
- [Extract incident entities with non-native action](tutorial-extract-incident-entities.md)
- [Investigate with UEBA](investigate-with-ueba.md)
- [Build and monitor Zero Trust](sentinel-solution.md)