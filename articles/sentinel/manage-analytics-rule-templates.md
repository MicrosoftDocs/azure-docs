---
title: Manage template versions for your scheduled analytics rules in Microsoft Sentinel
description: Learn how to manage the relationship between your scheduled analytics rule templates and the rules created from those templates. Merge updates to the templates into your rules, and revert changes in your rules back to the original template.
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin


#Customer intent: As a security analyst, I want to manage and update analytics rule templates so that I can ensure my threat detection rules are current and effective.

---

# Manage template versions for your scheduled analytics rules in Microsoft Sentinel

> [!IMPORTANT]
>
> This feature is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

Microsoft Sentinel contains [analytics rule templates](threat-detection.md) that you turn into active rules by effectively creating a copy of them – that’s what happens when you create a rule from a template. At that point, however, the active rule is no longer connected to the template. If changes are made to a rule template, by Microsoft engineers or anyone else, any rules created from that template beforehand are ***not*** dynamically updated to match the new template.

However, rules created from templates ***do*** remember which templates they came from, which allows you two advantages:

- If you made changes to a rule when creating it from a template, or at any time afterward, you can always revert the rule back to its original version.

- You get notified when a template is updated. You can either update your rules to the new version of their templates, or leave them as they are.

This article shows you how to manage these tasks, and what to keep in mind. The procedures discussed in the article apply to any **[Scheduled](scheduled-rules-overview.md)** analytics rules created from templates.

## Discover your rule's template version number

With the implementation of template version control, you can see and track the versions of your rule templates and the rules created from them. Rules with updated templates display an "*Update*" badge next to the rule name.

1. On the **Analytics** page, select the **Active rules** tab.

1. Select any rule of type **Scheduled**.  

    - If the rule displays the "*Update*" badge, its details pane will have a **Review and update** button next to the **Edit** button (see image 1 in the next step).

    - If the rule was created from a template but doesn't have the "*Update*" badge, its details pane will have a **Compare with template** button next to the **Edit** button (see images 2 and 3 in the next step).

    - If there's only an **Edit** button, the rule was created from scratch, not from a template.

        :::image type="content" source="media/manage-analytics-rule-templates/see-rules-with-updated-template.png" alt-text="Screenshot of active rules list, with badge indicating a template update is available." lightbox="media/manage-analytics-rule-templates/see-rules-with-updated-template.png":::

1. Scroll down to the bottom of the details pane, where you see two version numbers: the version of the template from which the rule was created, and the latest available version of the template. 

    :::image type="content" source="media/manage-analytics-rule-templates/see-template-versions.png" alt-text="Screenshot of details pane. Scroll down to see template version numbers." border="false":::

    The number is in a "1.0.0" format – major version, minor version, and build.  

    - A difference in the *major version* number indicates that something essential in the template was changed, that could affect how the rule detects threats or even its ability to function altogether. You want to include this change in your rules.

    - A difference in the *minor version* number indicates a minor improvement in the template – a cosmetic change or something similar – that would be "nice to have" but is not critical to maintaining the rule’s functionality, efficacy, or performance. You could just as easily take this change or leave it.

    > [!NOTE]
    > Images 2 and 3 show two examples of rules created from templates, where the template has not been updated.
    > - Image 2 shows a rule that has a version number for its current template. This signals that the rule was created after Microsoft Sentinel's initial implementation of template version control in October 2021.
    > - Image 3 shows a rule that doesn't have a current template version. This shows that the rule had been created before October 2021. If there is a latest template version available, it's likely a newer version of the template than the one used to create the rule.

## Compare your active rule with its template

Choose one of the following tabs according to the action you wish to take, to see the instructions for that action:

# [Update template](#tab/update)

Having selected a rule and determined that you want to consider updating it, select **Review and update** on the details pane (see earlier). You see that the **Analytics rule wizard** now has a **Compare to latest version** tab.

On this tab, you see a side-by-side comparison between the YAML representations of the existing rule and the latest version of the template. 

:::image type="content" source="media/manage-analytics-rule-templates/compare-template-versions.png" alt-text="Screenshot of 'Compare to latest version' tab in Analytics rule wizard.":::

> [!NOTE]
> Updating this rule will overwrite your existing rule with the latest version of the template.

Any automation step or logic that refers to the existing rule should be verified, in case the referenced names changed. Also, any customizations you made in creating the original rule&mdash;changes to the query, scheduling, grouping, or other settings&mdash;might be overwritten.

### Update your rule with the new template version

- If the changes made to the new version of the template are acceptable to you, and nothing else in your original rule is affected, select **Review and update** to validate and apply the changes. 

- If you want to further customize the rule or reapply any changes that might otherwise be overwritten, select **Next : Custom changes**. Cycle through the remaining tabs of the [Analytics rule wizard](create-analytics-rules.md) to make those changes, then validate and apply the changes on the **Review and update** tab.

- If you don't want to make any changes to your existing rule, but rather to keep the existing template version, simply exit the wizard by selecting the X in the upper right corner.

# [Revert to template](#tab/revert)

Having selected a rule and determined that you want to revert to its original version, select **Compare with template** on the details pane (see earlier). You see that the **Analytics rule wizard** now has a **Compare to latest version** tab.

On this tab, you see a side-by-side comparison between the YAML representations of the existing rule and the latest version of the template. These two version numbers might be the same, but the right side shows the original, unchanged template, and the left side shows the active rule, including any changes from the original template.

:::image type="content" source="media/manage-analytics-rule-templates/compare-template-versions-2.png" alt-text="Screenshot of 'Compare to latest version' tab in Analytics rule wizard.":::

> [!NOTE]
> Updating this rule will overwrite your existing rule with the latest version of the template.

Any automation step or logic that refers to the existing rule should be verified, in case the referenced names changed. Also, any customizations you made in creating the original rule&mdash;changes to the query, scheduling, grouping, or other settings&mdash;might be overwritten.

### Revert your rule to its original template version

- If you want to revert completely to the original version of this rule&mdash;a clean copy of the template&mdash;select **Review and update** to validate and apply the changes. 

- If you want to customize the rule differently or reapply any changes that might otherwise be overwritten, select **Next : Custom changes**. Cycle through the remaining tabs of the [Analytics rule wizard](create-analytics-rules.md) to make those changes, then validate and apply the changes on the **Review and update** tab.

- If you don't want to make any changes to your existing rule, simply exit the wizard by selecting the X in the upper right corner.

---

## Next steps
In this document, you learned how to track the versions of your Microsoft Sentinel analytics rule templates, and either to revert active rules to existing template versions, or update them to new ones. To learn more about Microsoft Sentinel, see the following articles:

- Learn more about [analytics rules](threat-detection.md).
- See more details about the [analytics rule wizard](create-analytics-rules.md).
