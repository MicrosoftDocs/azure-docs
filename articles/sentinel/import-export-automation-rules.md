---
title: Import and export Microsoft Sentinel automation rules | Microsoft Docs
description: Export and import automation rules to and from ARM templates to aid deployment
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/15/2023
---

# Export and import automation rules to and from ARM templates

> [!IMPORTANT]
>
> - Exporting and importing rules is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

You can now export your automation rules to Azure Resource Manager (ARM) template files, and import rules from these files, as part of managing and controlling your Microsoft Sentinel deployments as code. The export action will create a JSON file in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.

The exported JSON file is workspace-independent, so it can be imported to other workspaces and even other tenants. As code, it can also be version-controlled, updated, and deployed in a managed CI/CD framework.

The file includes all the parameters defined in the automation rule. Rules of any trigger type can be exported to a JSON file.

## Export rules

1. From the Microsoft Sentinel navigation menu, select **Automation**.

1. Select the rule you want to export, and select **Export** from the bar at the top of the screen.

    :::image type="content" source="./media/import-export-automation-rules/export-rule.png" alt-text="Screenshot showing how to export an automation rule." lightbox="./media/import-export-automation-rules/export-rule.png":::

    > [!NOTE]
    > - You can select multiple automation rules at once for export by marking the check boxes next to the rules and selecting **Export** at the end.
    >
    > - You can export all the rules on a single page of the display grid at once, by marking the check box in the header row before clicking **Export**. You can't export more than one page's worth of rules at a time, though.
    >
    > - Be aware that in this scenario, a single file (named *automationRules.json*) will be created, and will contain JSON code for all the exported rules.

## Import rules

1. Have an automation rule ARM template JSON file ready.

1. From the Microsoft Sentinel navigation menu, select **Automation**.

1. Select **Import** from the bar at the top of the screen. In the resulting dialog box, navigate to and select the JSON file representing the rule you want to import, and select **Open**.

    :::image type="content" source="./media/import-export-automation-rules/import-rule.png" alt-text="Screenshot showing how to import an automation rule." lightbox="./media/import-export-automation-rules/import-rule.png":::

    > [!NOTE]
    > You can import **up to 50** automation rules from a single ARM template file.

## Troubleshooting

- **Faulty automation rules:** If you export an automation rule that didn't pass validation when it was created, then when you import it, the deployment will fail with the same errors as the original.

- **Properties don't exist:** If you export an automation rule from a workspace, and then imported it to another workspace where certain properties referenced in the automation rule don't exist, as in the following examples:
    - Analytics rule name&mdash;The analytics rule you used in the automation rule condition doesn't appear in the import destination workspace.
    - Custom field&mdash;The custom field you used in the automation rule condition doesn't appear in the import destination workspace.

    In these cases, when you import the automation rule, the deployment will succeed, but the chosen analytics rule or custom field will show as "Unknown". To remedy this, edit the automation rule and replace the unknowns with new values.

- **Expired automation rule:** If an automation rule is past its expiration date when imported, the deployment of the automation rule will fail with the following error: ___________?

## Next steps

In this document, you learned how to export and import automation rules to and from ARM templates.
- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) and [how to create and work with them](create-manage-use-automation-rules.md).
- Learn more about [ARM templates](../azure-resource-manager/templates/overview.md).
