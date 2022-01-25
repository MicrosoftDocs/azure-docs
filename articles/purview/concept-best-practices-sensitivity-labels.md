---
title: Best practices for applying sensitivity labels in Azure Purview
description: This article provides best practices for applying sensitivity labels in Azure Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 01/12/2022
ms.custom: ignite-fall-2021
---

# Labeling best practices

Azure Purview supports labeling of both structured and unstructured data stored across various data sources. Labeling of data within Azure Purview allows users to easily find data that matches pre-defined auto-labeling rules that have been configured in the Microsoft 365 Security and Compliance Center (SCC). Azure Purview extends the use of Microsoft 365 sensitivity labels to assets stored in infrastructure cloud locations and structured data sources.

## Protect Personal Identifiable Information(PII) with Custom Sensitivity Label for Azure Purview, using Microsoft Information Protection

Storing and processing of Personal Identifiable Information is subject to special protection. With referring to Regulations labeling of Personal Identifiable Information data is crucial to identify and label sensitive information.  The detection and labeling tasks of Personal Identifiable Information can be used on different stages of your workflows and because Personal Identifiable Information is ubiquitous and fluid in your organization it is important to define identification rules for building policies that suit your individual situation

## Why do you need to use Labeling within Azure Purview?

Azure Purview allows you to extend your organization's investment in Microsoft 365 sensitivity labels to assets that are stored in files and database columns within Azure, multi-cloud, and on premises locations defined in [Supported data sources](./create-sensitivity-label.md#supported-data-sources).
Applying sensitivity labels to your content enables you to keep your data secure by stating how sensitive certain data is in your organization.
It also abstracts the data itself, so you use labels to track the type of data, without exposing sensitive data on another platform.

## Azure Purview Labeling best practices and considerations

### Get started

- Enabling sensitivity labeling in Azure Purview can be accomplished using the steps defined in [How to automatically apply sensitivity labels to your data in Azure Purview](./how-to-automatically-label-your-content.md).
- Required licensing and helpful answers to other questions can be found in the [Sensitivity labels in Azure Purview FAQ](./sensitivity-labels-frequently-asked-questions.yml).

### Label considerations

- If you already have Microsoft 365 sensitivity labels in use in your environment, it is recommended that you continue to use your existing labels rather than making duplicate or more labels for Azure Purview. This approach allows you to maximize the investment you have already made in the Microsoft 365 compliance space and ensures consistent labeling across your data estate.
- If you have not yet created Microsoft 365 sensitivity labels, it is recommended that you review the documentation to [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels). Creating a classification schema is a tenant-wide operation and should be discussed thoroughly before enabling it within your organization.

### Label recommendations

- When configuring sensitivity labels for Azure Purview, you may define autolabeling rules for files, database columns, or both within the label properties.  Azure Purview will label files within the Azure Purview data map when the autolabeling rule is configured to automatically apply the label or recommend that the label is applied.

> [!WARNING]
> If you have not already configured autolabeling for files and emails on your sensitivity labels, keep in mind this can have user impact within your Office and Microsoft 365 environment.  You may however test autolabeling on database columns without user impact.

- If you are defining new autolabeling rules for files when configuring labels for Azure Purview, make sure that you have the condition for applying the label set appropriately.
- You can set the detection criteria to **All of these** or **Any of these** in the upper right of the autolabeling for files and emails page of the label properties.
- The default setting for detection criteria is **All of these** which means that the asset must contain all of the specified sensitive info types for the label to be applied.  While the default setting may be valid in some instances, many customers prefer to change the setting to **Any of these** meaning that if at least one of them is found the label is applied.

:::image type="content" source="media/concept-best-practices/label-detection-criteria.png" alt-text="Screenshot that shows detection criteria for a label.":::

> [!NOTE] 
> Microsoft 365 Trainable classifiers are not used by Azure Purview

- For consistency in labeling across your data estate, if you are using autolabeling rules for files, it is recommended that you use the same sensitive information types for autolabeling database columns.

- [Define your sensitivity labels via Microsoft information Protection is recommended to identify your Personal Identifiable Information at central place](/microsoft-365/compliance/information-protection).
- [Use Policy templates as a starting point to build your rulesets](/microsoft-365/compliance/what-the-dlp-policy-templates-include#general-data-protection-regulation-gdpr).
- [Combine Data Classifications to an individual Ruleset](./supported-classifications.md).
- [Force Labeling by using auto label functionality](./how-to-automatically-label-your-content.md).
- Build groups of Sensitivity Labels and store them as dedicated Sensitivity Label Policy – for example store all required Sensitivity Labels for Regulatory Rules by using the same Sensitivity Label Policy to publish.
- Capture all test cases for your labels and test your Label policies with all applications you want to secure.
- Promote Sensitivity Label Policies to Azure Purview.
- Run test scans from Azure Purview on different Data Sources (for Example Hybrid-Cloud, On-Premise) to identify Sensitivity Labels.
- Gather and consider insights (for example by using Azure Purview insights) and use alerting mechanism to mitigate potential breaches of Regulations.

By using Sensitivity Labels with Azure Purview you are able to extend your Microsoft Information Protection beyond the border of Microsoft Data Estate to your  On-prem, Hybrid-Could, Multi-Cloud and SaaS Scenarios.

## Next steps

- [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels).

- [How to automatically apply sensitivity labels to your data in Azure Purview](how-to-automatically-label-your-content.md).
