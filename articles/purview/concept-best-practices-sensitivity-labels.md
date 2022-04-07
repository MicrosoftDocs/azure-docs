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

Azure Purview supports labeling structured and unstructured data stored across various data sources. Labeling data within Azure Purview allows users to easily find data that matches predefined autolabeling rules that were configured in the Microsoft 365 Security and Compliance Center. Azure Purview extends the use of Microsoft 365 sensitivity labels to assets stored in infrastructure cloud locations and structured data sources.

## Protect personal data with custom sensitivity labels for Azure Purview

Storing and processing personal data is subject to special protection. Labeling personal data is crucial to help you identify sensitive information. You can use the detection and labeling tasks for personal data in different stages of your workflows. Because personal data is ubiquitous and fluid in your organization, you need to define identification rules for building policies that suit your individual situation.

## Why do you need to use labeling within Azure Purview?

With Azure Purview, you can extend your organization's investment in Microsoft 365 sensitivity labels to assets that are stored in files and database columns within Azure, multicloud, and on-premises locations. These locations are defined in [supported data sources](./create-sensitivity-label.md#supported-data-sources).
When you apply sensitivity labels to your content, you can keep your data secure by stating how sensitive certain data is in your organization. Azure Purview also abstracts the data itself, so you can use labels to track the type of data, without exposing sensitive data on another platform.

## Azure Purview labeling best practices and considerations

The following sections walk you through the process of implementing labeling for your assets.

### Get started

- To enable sensitivity labeling in Azure Purview, follow the steps in [Automatically apply sensitivity labels to your data in Azure Purview](./how-to-automatically-label-your-content.md).
- To find information on required licensing and helpful answers to other questions, see [Sensitivity labels in Azure Purview FAQ](./sensitivity-labels-frequently-asked-questions.yml).

### Label considerations

- If you already have Microsoft 365 sensitivity labels in use in your environment, continue to use your existing labels. Don't make duplicate or more labels for Azure Purview. This approach allows you to maximize the investment you've already made in the Microsoft 365 compliance space. It also ensures consistent labeling across your data estate.
- If you haven't created Microsoft 365 sensitivity labels, review the documentation to [get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels). Creating a classification schema is a tenant-wide operation. Discuss it thoroughly before you enable it within your organization.

### Label recommendations

- When you configure sensitivity labels for Azure Purview, you might define autolabeling rules for files, database columns, or both within the label properties. Azure Purview labels files within the Azure Purview data map. When the autolabeling rule is configured, Azure Purview automatically applies the label or recommends that the label is applied.

   > [!WARNING]
   > If you haven't configured autolabeling for files and emails on your sensitivity labels, users might be affected within your Office and Microsoft 365 environment. You can test autolabeling on database columns without affecting users.

- If you're defining new autolabeling rules for files when you configure labels for Azure Purview, make sure that you have the condition for applying the label set appropriately.
- You can set the detection criteria to **All of these** or **Any of these** in the upper right of the autolabeling for files and emails page of the label properties.
- The default setting for detection criteria is **All of these**. This setting means that the asset must contain all the specified sensitive information types for the label to be applied. While the default setting might be valid in some instances, many customers want to use **Any of these**. Then if at least one asset is found, the label is applied.

   :::image type="content" source="media/concept-best-practices/label-detection-criteria.png" alt-text="Screenshot that shows detection criteria for a label.":::

   > [!NOTE]
   > Microsoft 365 trainable classifiers aren't used by Azure Purview.

- Maintain consistency in labeling across your data estate. If you use autolabeling rules for files, use the same sensitive information types for autolabeling database columns.
- [Define your sensitivity labels via Microsoft Information Protection to identify your personal data at a central place](/microsoft-365/compliance/information-protection).
- [Use policy templates as a starting point to build your rule sets](/microsoft-365/compliance/what-the-dlp-policy-templates-include#general-data-protection-regulation-gdpr).
- [Combine data classifications to an individual rule set](./supported-classifications.md).
- [Force labeling by using autolabel functionality](./how-to-automatically-label-your-content.md).
- Build groups of sensitivity labels and store them as a dedicated sensitivity label policy. For example, store all required sensitivity labels for regulatory rules by using the same sensitivity label policy to publish.
- Capture all test cases for your labels. Test your label policies with all applications you want to secure.
- Promote sensitivity label policies to Azure Purview.
- Run test scans from Azure Purview on different data sources like hybrid cloud and on-premises to identify sensitivity labels.
- Gather and consider insights, for example, by using Azure Purview Insights. Use alerting mechanisms to mitigate potential breaches of regulations.

By using sensitivity labels with Azure Purview, you can extend Microsoft Information Protection beyond the border of your Microsoft data estate to your on-premises, hybrid cloud, multicloud, and software as a service (SaaS) scenarios.

## Next steps

- [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels).
- [Automatically apply sensitivity labels to your data in Azure Purview](how-to-automatically-label-your-content.md).
