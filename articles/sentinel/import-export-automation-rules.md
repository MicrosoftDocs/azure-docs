---
title: Import and export Microsoft Sentinel automation rules | Microsoft Docs
description: Export and import automation rules to and from ARM templates to aid deployment
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 08/07/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Export and import automation rules to and from ARM templates

Manage your Microsoft Sentinel automation rules as code! You can now export your automation rules to Azure Resource Manager (ARM) template files, and import rules from these files, as part of your program to manage and control your Microsoft Sentinel deployments as code. The export action creates a JSON file in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.

The exported JSON file is workspace-independent, so it can be imported to other workspaces and even other tenants. As code, it can also be version-controlled, updated, and deployed in a managed CI/CD framework.

The file includes all the parameters defined in the automation rule. Rules of any trigger type can be exported to a JSON file.

This article shows you how to export and import automation rules.

> [!IMPORTANT]
>
> - Exporting and importing rules is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> - [!INCLUDE [unified-soc-preview](includes/unified-soc-preview-without-alert.md)]

## Export rules

1. From the Microsoft Sentinel navigation menu, select **Automation**.

1. Select the rule (or rules&mdash;see note) you want to export, and select **Export** from the bar at the top of the screen.

    :::image type="content" source="./media/import-export-automation-rules/export-rule.png" alt-text="Screenshot showing how to export an automation rule." lightbox="./media/import-export-automation-rules/export-rule.png":::

    Find the exported file in your Downloads folder. It has the same name as the automation rule, with a .json extension.

    > [!NOTE]
    > - You can select multiple automation rules at once for export by marking the check boxes next to the rules and selecting **Export** at the end.
    >
    > - You can export all the rules on a single page of the display grid at once, by marking the check box in the header row before clicking **Export**. You can't export more than one page's worth of rules at a time, though.
    >
    > - In this scenario, a single file (named *Azure_Sentinel_automation_rules.json*) is created, and contains JSON code for all the exported rules.

## Import rules

1. Have an automation rule ARM template JSON file ready.

1. From the Microsoft Sentinel navigation menu, select **Automation**.

1. Select **Import** from the bar at the top of the screen. In the resulting dialog box, navigate to and select the JSON file representing the rule you want to import, and select **Open**.

    :::image type="content" source="./media/import-export-automation-rules/import-rule.png" alt-text="Screenshot showing how to import an automation rule." lightbox="./media/import-export-automation-rules/import-rule.png":::

    > [!NOTE]
    > You can import **up to 50** automation rules from a single ARM template file.

## Troubleshooting

If you have any issues importing an exported automation rule, consult the following table.

| Behavior (with *error*) | Reason | Suggested action |
| ----------------------- | ------ | ---------------- |
| **Imported automation rule is disabled**<br>-*and*-<br>**The rule's *analytics rule* condition displays "Unknown rule"** | The rule contains a condition that refers to an analytics rule that doesn't exist in the target workspace. | <ol><li>Export the referenced analytics rule from the original workspace and import it to the target one.<li>Edit the automation rule in the target workspace, choosing the now-present analytics rule from the drop-down.<li>Enable the automation rule.</ol> |
| **Imported automation rule is disabled**<br>-*and*-<br>**The rule's *custom details key* condition displays "Unknown custom details key"** | The rule contains a condition that refers to a [custom details key](surface-custom-details-in-alerts.md) that isn't defined in any analytics rules in the target workspace. | <ol><li>Export the referenced analytics rule from the original workspace and import it to the target one.<li>Edit the automation rule in the target workspace, choosing the now-present analytics rule from the drop-down.<li>Enable the automation rule. |
| **Deployment failed in target workspace, with error message: "*Automation rules failed to deploy.*"**<br>Deployment details contain the reasons listed in the next column for failure. | The playbook was moved.<br>-*or*-<br>The playbook was deleted.<br>-*or*-<br>The target workspace doesn't have access to the playbook. | Make sure the playbook exists, and that the target workspace has the right access to the resource group that contains the playbook. |
| **Deployment failed in target workspace, with error message: "*Automation rules failed to deploy.*"**<br>Deployment details contain the reasons listed in the next column for failure . | The automation rule was past its defined expiration date when you imported it. | **If you want the rule to remain expired in its original workspace:**<ol><li>Edit the JSON file that represents the exported automation rule.<li>Find the expiration date (that appears immediately after the string `"expirationTimeUtc":`) and replace it with a new expiration date (in the future).<li>Save the file and re-import it into the target workspace.</ol>**If you want the rule to return to active status in its original workspace:**<ol><li>Edit the automation rule in the original workspace and change its expiration date to a date in the future.<li>Export the rule again from the original workspace.<li>Import the newly exported version into the target workspace.</ol> |
| **Deployment failed in target workspace, with error message:<br>"*The JSON file you attempted to import has an invalid format. Please check the file and try again.*"** | The imported file isn't a valid JSON file. | Check the file for problems and try again. For best results, export the original rule again to a new file, then try the import again. |
| **Deployment failed in target workspace, with error message:<br>"*No resources found in the file. Please ensure the file contains deployment resources and try again.*"** | The list of resources under the "resources" key in the JSON file is empty. | Check the file for problems and try again. For best results, export the original rule again to a new file, then try the import again. |

## Next steps

In this document, you learned how to export and import automation rules to and from ARM templates.
- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) and [how to create and work with them](create-manage-use-automation-rules.md).
- Learn more about [ARM templates](../azure-resource-manager/templates/overview.md).
