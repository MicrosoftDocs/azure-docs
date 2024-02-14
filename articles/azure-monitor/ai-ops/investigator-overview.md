---
title:  Azure Monitor Investigator overview
description: Learn about Microsoft Azure Monitor Investigator.
ms.date: 02/13/2024
ms.topic: overview
ms.service: azure-monitor
ms.author: abbyweisberg
author: AbbyMSFT
ms.reviewer: yalavi
---

# What is Azure Monitor Investigator (preview)?

Azure Monitor Investigator (preview) is an AIOps solution designed to improve the way Site Reliability Engineers (SREs) and developers approach incidents. Investigator  simplifies the process of incident troubleshooting, enabling faster resolution of issues with your Azure resources and the workloads running on them.

Azure Monitor Investigator uses resource metrics to scan for anomalies across all your Azure resources, so that you don't have to rely on manual investigation methods like sifting through static dashboards or executing predefined queries. Based on the metrics, such as specific clusters, regions, error codes, or operations dimensions and labels, Azure Monitor investigator provides SREs and developers with actionable insights and concrete leads for further investigation.

In the Azure portal, you can trigger investigations in two ways:

- When an Azure Monitor alert is triggered, you can start an investigation with a single click from the alert instance.
- Using Azure Copilot, you can ask about resource issues, and trigger an investigation.

The system presents a summary of the issue and outlines what happened, why it happened, and how to fix it so that you can focus on understanding the impact, localizing the source of the issue, and routing the incident to the appropriate owners for quick resolution.

## Automate analysis with Investigator
Azure Monitor Investigator (preview) automates analysis to simplify the identification of anomalies across Azure resources and provides recommended next steps with the following capabilities:

### Metric analysis
- Scans the Azure resources in the investigation target and scope for anomalies in platform metrics, custom metrics, and Azure Monitor Workspace Prometheus metrics.
- Assigns scores to metrics that show a correlation with the incident start time.
- Generates explanations for the incident by conducting subpattern analysis to explain anomalies based on metric dimensions or labels that generate the most impact. 
- Groups and ranks explanations to present the most likely causes.

### Actionable insights
- Provides an issue summary with insights into what happened, the potential causes, and how to further investigate the issue.

### Configurable scope
Investigator suggests resources for analysis based on the investigation scope. The default scope of investigations is the subscription of the investigation target. You can change the scope to limit the investigation to the resource group of the investigation target.

## Join the preview

To enable access to Azure Monitor Investigator for your organization, and to take part in shaping its development, there's a one-time setup process per subscription.

In line with our commitment to responsible AI, we're currently limiting access to Azure Monitor Investigator (preview). Access to Azure Monitor Investigator (Preview) requires a registration process and is currently only available to a select group of enterprise customers and partners. Customers interested in using Azure Monitor Investigator (Preview) must [complete a registration form to request access](https://forms.office.com/Pages/DesignPageV2.aspx?origin=NeoPortalPage&subpage=design&id=v4j5cvGGr0GRqy180BHbRzCPk0K2kF9Il6O4o_cTV91UNVpWRVpONjVPQ1pFN0cxN1Q4NE9VRURVRCQlQCN0PWcu&branchingelementid=r67a427e63a7c404f8b206a36ea1e81b3&topview=Preview).

Granting access to Azure Monitor Investigator (preview) is at the discretion of Microsoft, based on eligibility criteria and a vetting process. Customers must acknowledge that they have read and understand the terms of service specific to Azure Monitor Investigator (Preview) within Azure.

Azure Monitor Investigator (preview) is available under the terms governing the subscription to Microsoft Azure. Customers should review these terms thoroughly as they have important information and conditions that govern the use of Azure Monitor Investigator (Preview).

If you have any questions about gaining access, consult with your Azure administrator.

Some features and functionalities may be considerably enhanced, changed, or added as the tool evolves based on user feedback and continued development.

## Next steps

- Learn how to [use Azure Monitor Investigator for AIOps](investigate-alert-instance.md).
- Review our [Responsible AI FAQ for Microsoft Azure Investigator](responsible-ai-faq.md).
