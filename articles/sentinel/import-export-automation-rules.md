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

    You'll find the exported file in your Downloads folder. It will be named the same as the name of the automation rule, with a .json extension.

    > [!NOTE]
    > - You can select multiple automation rules at once for export by marking the check boxes next to the rules and selecting **Export** at the end.
    >
    > - You can export all the rules on a single page of the display grid at once, by marking the check box in the header row before clicking **Export**. You can't export more than one page's worth of rules at a time, though.
    >
    > - Be aware that in this scenario, a single file (named *Azure_Sentinel_automation_rules.json*) will be created, and will contain JSON code for all the exported rules.

## Import rules

1. Have an automation rule ARM template JSON file ready.

1. From the Microsoft Sentinel navigation menu, select **Automation**.

1. Select **Import** from the bar at the top of the screen. In the resulting dialog box, navigate to and select the JSON file representing the rule you want to import, and select **Open**.

    :::image type="content" source="./media/import-export-automation-rules/import-rule.png" alt-text="Screenshot showing how to import an automation rule." lightbox="./media/import-export-automation-rules/import-rule.png":::

    > [!NOTE]
    > You can import **up to 50** automation rules from a single ARM template file.

## Troubleshooting

- **Analytics rule doesn't exist:** If you export an automation rule [based on a particular analytics rule](create-manage-use-automation-rules.md#add-conditions-incidents-only), and then import it to another workspace that doesn't have the same analytics rule in it, the following things will happen:
    - The automation rule will successfully deploy in the second workspace.
    - The automation rule will be automatically disabled.
    - In the automation rule conditions, the analytics rule drop-down will display as "Unknown rule".

    To allow this automation rule to run in the new workspace:
    1. Export the referenced analytics rule from the original workspace and import it to the second one.
    1. Edit the automation rule in the second workspace, choosing the now-present analytics rule from the drop-down.
    1. Enable the automation rule.

- **Custom details key doesn't exist:** If you export an automation rule with conditions that reference [custom details keys](create-manage-use-automation-rules.md#conditions-based-on-custom-details-preview), and then import it to another workspace where no analytics rules surface those custom details, the following things will happen:
    - The automation rule will successfully deploy in the second workspace.
    - The automation rule will *not* be automatically disabled.
    - In the automation rule conditions, the custom details key drop-down will display as "Unknown".  
      (These conditions may change... -YL)

    To allow this automation rule to run in the new workspace:
    - ???

- **Playbook doesn't exist:** If you export an automation rule that calls a playbook, and then import it to another workspace that doesn't have access to the playbook, or if the playbook was moved or deleted, the following things will happen:
    - The automation rule deployment will fail.
    - You'll receive an error message: ___?

- **Expired automation rule:** If an automation rule is past its expiration date when imported, the following things will happen:
    - The automation rule deployment will fail.
    - You'll receive an error message: ___?

## Next steps

In this document, you learned how to export and import automation rules to and from ARM templates.
- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) and [how to create and work with them](create-manage-use-automation-rules.md).
- Learn more about [ARM templates](../azure-resource-manager/templates/overview.md).
