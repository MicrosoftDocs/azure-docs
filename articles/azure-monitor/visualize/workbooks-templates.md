---
title: Azure Workbooks templates
description: Learn how to use Azure Workbooks templates.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr 
---

# Azure Workbooks templates

Azure Workbooks templates are curated reports designed for flexible reuse by multiple users and teams. When you open a template, a transient workbook is created and populated with the content of the template. Workbooks are visible in green. Workbook templates are visible in purple.

You can adjust the template-based workbook parameters and perform analysis without fear of breaking the future reporting experience for colleagues. If you open a template, make some adjustments, and save it, the template is saved as a workbook. This workbook appears in green. The original template is left untouched.

The design and architecture of templates is also different from saved workbooks. Saving a workbook creates an associated Azure Resource Manager resource. But the transient workbook that's created when you open a template doesn't have a unique resource associated with it. The resources associated with a workbook affect who has access to that workbook. Learn more about [Azure Workbooks access control](workbooks-overview.md#access-control).

## Explore a workbook template

Select **Application Failure Analysis** to see one of the default application workbook templates.

  :::image type="content" source="./media/workbooks-overview/failure-analysis.png" alt-text="Screenshot that shows the Application Failure Analysis template." border="false" lightbox="./media/workbooks-overview/failure-analysis.png":::

When you open the template, a temporary workbook is created that you can interact with. By default, the workbook opens in read mode. Read mode displays only the information for the intended analysis experience that was created by the original template author.

You can adjust the subscription, targeted apps, and the time range of the data you want to display. After you make those selections, the grid of HTTP Requests is also interactive. Selecting an individual row changes the data rendered in the two charts at the bottom of the report.

## Edit a template

To understand how this workbook template is put together, switch to edit mode by selecting **Edit**.

  :::image type="content" source="./media/workbooks-overview/edit.png" alt-text="Screenshot that shows the Edit button." border="false" :::

**Edit** buttons on the right correspond with each individual aspect of your workbook.

  :::image type="content" source="./media/workbooks-overview/edit-mode.png" alt-text="Screenshot that shows Edit buttons." border="false" lightbox="./media/workbooks-overview/edit-mode.png":::

If you select the **Edit** button immediately under the grid of requested data, you can see that this part of the workbook consists of a Kusto query against data from an Application Insights resource.

  :::image type="content" source="./media/workbooks-overview/kusto.png" alt-text="Screenshot that shows the underlying Kusto query." border="false" lightbox="./media/workbooks-overview/kusto.png":::

Select the other **Edit** buttons on the right to see some of the core components that make up workbooks, like:

- Markdown-based [text boxes](../visualize/workbooks-create-workbook.md#add-text).
- [Parameter selection](../visualize/workbooks-parameters.md) UI elements.
- Other [chart/visualization types](workbooks-visualizations.md).

Exploring the prebuilt templates in edit mode, modifying them to fit your needs, and saving your own custom workbook is a good way to start to learn about what's possible with Azure Workbooks.