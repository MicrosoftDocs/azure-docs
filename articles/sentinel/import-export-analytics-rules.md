---
title: Import and export Microsoft Sentinel analytics rules | Microsoft Docs
description: Export and import analytics rules to and from ARM templates to aid deployment
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Export and import analytics rules to and from ARM templates

> [!IMPORTANT]
>
> - Exporting and importing rules is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

You can now export your analytics rules to Azure Resource Manager (ARM) template files, and import rules from these files, as part of managing and controlling your Microsoft Sentinel deployments as code. The export action will create a JSON file (named *Azure_Sentinel_analytic_rule.json*) in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.

The exported JSON file is workspace-independent, so it can be imported to other workspaces and even other tenants. As code, it can also be version-controlled, updated, and deployed in a managed CI/CD framework.

The file includes all the parameters defined in the analytics rule, so for **Scheduled** rules it includes the underlying query and its accompanying scheduling settings, the severity, incident creation, event- and alert-grouping settings, assigned MITRE ATT&CK tactics, and more. Any type of analytics rule - not just **Scheduled** - can be exported to a JSON file.

## Export rules

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Select the rule you want to export and click **Export** from the bar at the top of the screen.

    :::image type="content" source="./media/import-export-analytics-rules/export-rule.png" alt-text="Export analytics rule" lightbox="./media/import-export-analytics-rules/export-rule.png":::

    > [!NOTE]
    > - You can select multiple analytics rules at once for export by marking the check boxes next to the rules and clicking **Export** at the end.
    >
    > - You can export all the rules on a single page of the display grid at once, by marking the check box in the header row (next to **SEVERITY**) before clicking **Export**. You can't export more than one page's worth of rules at a time, though.
    >
    > - Be aware that in this scenario, a single file (named *Azure_Sentinel_analytic_**rules**.json*) will be created, and will contain JSON code for all the exported rules.

## Import rules

1. Have an analytics rule ARM template JSON file ready.

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Click **Import** from the bar at the top of the screen. In the resulting dialog box, navigate to and select the JSON file representing the rule you want to import, and select **Open**.

    :::image type="content" source="./media/import-export-analytics-rules/import-rule.png" alt-text="Import analytics rule" lightbox="./media/import-export-analytics-rules/import-rule.png":::

    > [!NOTE]
    > You can import **up to 50** analytics rules from a single ARM template file.

## Next steps

In this document, you learned how to export and import analytics rules to and from ARM templates.
- Learn more about [analytics rules](detect-threats-built-in.md), including [custom scheduled rules](detect-threats-custom.md).
- Learn more about [ARM templates](../azure-resource-manager/templates/overview.md).
