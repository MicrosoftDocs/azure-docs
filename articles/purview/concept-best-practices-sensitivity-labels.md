---
title: Best practices for applying sensitivity labels in Purview
description: This article provides best practices for applying sensitivity labels in Azure Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 12/14/2021
ms.custom: ignite-fall-2021
---

# Labeling best practices

Azure Purview supports labeling of both structured and unstructured data stored across various data sources. Labeling of data within Purview allows users to easily find data that matches pre-defined autolabeling rules that have been configured in the Microsoft 365 Security and Compliance Center(SCC). Azure Purview extends the use of Microsoft 365 sensitivity labels to assets stored in infrastructure cloud locations and structured data sources.


## Why do you need to use Labeling within Azure Purview?

Azure Purview allows you to extend your organization's investment in Microsoft 365 sensitivity labels to assets that are stored in files and database columns within Azure, multi-cloud, and on premises locations defined in [Supported data sources](./create-sensitivity-label.md#supported-data-sources).
Applying sensitivity labels to your content enables you to keep your data secure by stating how sensitive certain data is in your organization.
It also abstracts the data itself, so you use labels to track the type of data, without exposing sensitive data on another platform.

## Azure Purview Labeling best practices and considerations

### Get started

- Enabling sensitivity labeling in Azure Purview can be accomplished using the steps defined in [How to automatically apply sensitivity labels to your data in Azure Purview](./how-to-automatically-label-your-content.md).
- Required licensing and helpful answers to other questions can be found in the [Sensitivity labels in Azure Purview FAQ](./sensitivity-labels-frequently-asked-questions.yml).

### Label considerations

- If you already have Microsoft 365 sensitivity labels in use in your environment, it is recommended that you continue to use your existing labels rather than making duplicate or more labels for Purview. This allows you to maximize the investment you have already made in the Microsoft 365 compliance space and ensures consistent labeling across your data estate.
- If you have not yet created Microsoft 365 sensitivity labels, it is recommended that you review the documentation to [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels). Creating a classification schema is a tenant-wide operation and should be discussed thoroughly before enabling it within your organization.

### Label recommendations

- When configuring sensitivity labels for Azure Purview, you may define autolabeling rules for files, database columns, or both within the label properties.  Azure Purview will label files within the Purview data map when the autolabeling rule is configured to automatically apply the label or recommend that the label is applied.

[!WARNING] If you have not already configured autolabeling for files and emails on your sensitivity labels, keep in mind this can have user impact within your Office and Microsoft 365 environment.  You may however test autolabeling on database columns without user impact.

- If you are defining new autolabeling rules for files when configuring labels for Purview, make sure that you have the condition for applying the label set appropriately.
- You can set the detection criteria to **All of these** or **Any of these** in the upper right of the autolabeling for files and emails page of the label properties.
- The default for this is **All of these** which means that the asset must contain all of the specified sensitive info types for the label to be applied.  While this may be valid in some instances, many customers prefer to change this to **Any of these** meaning that if at least one of them is found the label is applied.

:::image type="content" source="media/concept-best-practices/label-detection-criteria.png" alt-text="Screenshot that shows detection criteria for a label.":::

> [!NOTE] 
> Microsoft 365 Trainable classifiers are not used by Azure Purview

- For consistency in labeling across your data estate, if you are using autolabeling rules for files, it is recommended that you use the same sensitive information types for autolabeling database columns.

## Next steps

- [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels).

- [How to automatically apply sensitivity labels to your data in Azure Purview](how-to-automatically-label-your-content.md).
