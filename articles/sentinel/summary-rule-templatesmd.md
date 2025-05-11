---
title: Optimize data analysis in Microsoft Sentinel with summary rule templates (Preview)
description: Learn how to simplify data analysis and reduce costs in Microsoft Sentinel with pre-built summary rule templates.
author: guywi-ms
ms.topic: conceptual
ms.date: 05/08/2025
ms.author: guywild
ms.reviewer: dzatakovi
---
# Optimize data analysis in Microsoft Sentinel with summary rule templates (Preview)

Summary rule templates are pre-built [summary rules]() tailored to common scenarios. Deploy summary rule templates out of the box or customize to specific needs to simplify data analysis, reduce costs, and deliver meaningful insights. 

This article explains how to deploy and customize summary rule templates. 

# How summary rule templates work

A dedicted section on the Summary Rules page to showcase Out-of-the-Box
(OOTB) templates. Each OOTB summary rule will display key details such
as:

- Name: The summary rule name

- Description: The summary rule description

- Frequency: What is the frequency that the summary rule runs

- Data type: What is the source table that the summary rule query runs
  on

- Destination: What is the destination table that the summary rule query
  result lands.

- Source name: What is the solution name that the summary rule tempalate
  installed from

<img src="media/summary-rule-templatesmd/image1.png" style="width:6.5in;height:2.77222in"
alt="A screenshot of a computer Description automatically generated" />

Users can directly create rules from these templates and edit them as
needed to suit their specific use cases.

## Prerequisites

To create summary rules in Microsoft Sentinel:

- Microsoft Sentinel must be enabled in at least one workspace, and actively consume logs.

- You must be able to access Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).

- To create summary rules in the Microsoft Defender portal, you must first onboard your workspace to the Defender portal. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-sentinel-onboard).

We recommend that you [experiment with your summary rule query](hunts.md) in the **Logs** page before creating your rule. Verify that the query doesn't reach or near the [query limit](/azure/azure-monitor/logs/summary-rules#restrictions-and-limitations), and check that the query produces the intended schema and expected results. If the query is close to the query limits, consider using a smaller `binSize` to process less data per bin. You can also modify the query to return fewer records or remove fields with higher volume.


# How summary rule templates work

- Lack of Clarity on Best Practices: Customers often don't know what
  insights can be generated from their data or how to identify which
  summary rules to create. They worry about missing crucial insights or
  creating summaries that are not optimized for cost-efficiency and
  security value.

- Limited Technical Expertise: Many users lack deep knowledge of KQL
  (Kusto Query Language) or the intricacies of their data types, making
  it difficult to construct effective summary rules independently.

- Fear of Suboptimal Configuration: Since summary rules execute on an
  ongoing basis, users are hesitant to proceed without confidence that
  their configurations will maximize ROI and deliver meaningful
  insights.

- Need for Ready-to-Use Content: Customers expect pre-built,
  Out-of-the-Box (OOTB) summary rule templates tailored to common
  scenarios, which can help them quickly leverage the feature without
  extensive customization or technical expertise.

# Business Opportunity

Addressing these challenges unlocks significant value for our customers
and aligns with our strategic goals:

- Customer Empowerment and Adoption: By introducing pre-built templates
  for summary rules, we simplify the user experience, enabling customers
  to transition from uncertainty to confidence in data aggregation. This
  streamlined process encourages broader adoption of both summary rules
  and auxiliary logs.

- Enhanced Data Tiering Strategy: Auxiliary logs work closely with
  summary rules, creating a synergistic opportunity to promote our
  low-cost data tier. Customers can send raw data to the auxiliary logs
  tier while using summary rules to extract and summarize valuable
  insights. Productized, end-to-end scenarios will make this workflow
  seamless, accelerating the adoption of auxiliary logs and advancing
  our data tiering strategy.

- Revenue Growth Potential: Summary rules outputs are stored in the
  analytics logs tier, presenting an opportunity to drive increased ACR.


# Deploy and customize summary rule templates

1. To view the available summary rule templates, open the Content Hub page and filter **Content type** by **Summary rules**.

   <img src="media/summary-rule-templatesmd/image3.png" style="width:6.5in;height:4.05208in" alt="A screenshot of a computer Description automatically generated" />

1. Select a summary rule template. A detailed panel with information about the summary rule template opens. 

1. Select **Install** to install the summary rule template.

   <img src="media/summary-rule-templatesmd/image4.png" style="width:6.5in;height:3.21111in" alt="A screenshot of a computer Description automatically generated" />

1. Select **Templates** tab on the **Summary rules** page to view and manage all the installed summary rules templates.

   <img src="media/summary-rule-templatesmd/image5.png" style="width:6.5in;height:3.18958in" alt="A screenshot of a computer Description automatically generated" />

1. Select a summary rule template. This opens the details panel with all of the summary rule information. 

1. Select **Create** to customize the summary rule template or install it as-is if it suits your requirements. Follow the [summary rules
documentation](https://learn.microsoft.com/en-us/azure/sentinel/summary-rules) to create the rule.

   <img src="media/summary-rule-templatesmd/image6.png" style="width:6.5in;height:3.64722in" alt="A screenshot of a computer Description automatically generated" />

