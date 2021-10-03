---
title: Refresh an Azure Sentinel analytics rule from an updated template
description: Learn how to incorporate the changes from updated versions of analytics rule templates into rules created from those templates. 
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/03/2021
ms.author: yelevin

---
# Refresh an Azure Sentinel analytics rule from an updated template

> [!IMPORTANT]
>
> - This feature is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

Azure Sentinel comes with [analytics rule templates](detect-threats-built-in.md) that you turn into active rules by effectively creating a copy of them – that’s what happens when you create a rule from a template. At that point, however, the active rule is no longer connected to the template. If changes are made by Microsoft engineers – or anyone, for that matter – to a rule template, any rules created from that template beforehand are not dynamically updated to match the new template.

However, you can get notified when a template is updated, and you can have the option to update your rules to the new version of the template. This article will show you how to do that, and what to keep in mind.

## Get notified of changes to a template

You can see which rules have had their templates updated by the appearance of the "*Update available*" badge on the rule in the list on the **Active rules** tab.

1. On the **Analytics** blade, select the **Active rules** tab.

1. Select any rule showing the "*Update available*" badge.

    :::image type="content" source="media/refresh-analytics-rule-from-updated-template/see-rules-with-updated-template.png" alt-text="Screenshot of active rules list, with badge indicating a template update is available." lightbox="media/refresh-analytics-rule-from-updated-template/see-rules-with-updated-template.png":::

1. Scroll down to the bottom of the details pane, where you'll see two version numbers: the version of the template from which the rule was created, and the latest available version of the template. 

    :::image type="content" source="media/refresh-analytics-rule-from-updated-template/scroll-down-to-version-numbers.png" alt-text="Screenshot of details pane. Scroll down to see template version numbers.":::

    The number is in a “1.0.0” format – major version, minor version, and build.  
    (For the time being, the build number is not in use and will always be 0.)

    - A difference in the *major version* number indicates that something essential in the template was changed, that could affect how the rule detects threats or even its ability to function altogether. This is a change you will want to include in your rules.

    - A difference in the *minor version* number indicates a minor improvement in the template – a cosmetic change or something similar – that would be “nice to have” but is not critical to maintaining the rule’s functionality, efficacy, or performance. This is a change that you could just as easily take or leave.


## Update an analytics rule from a template

### Compare your active rule with the new template version

Having selected a rule and determined that you want to consider updating it, select **Review and update** on the details pane (see above). You'll see that the **Analytics rule wizard** now has a **Compare to latest version** tab.

On this tab you'll see a side-by-side comparison between the YAML representations of the existing rule and the latest version of the template. 

:::image type="content" source="media/refresh-analytics-rule-from-updated-template/compare-template-versions.png" alt-text="Screenshot of 'Compare to latest version' tab in Analytics rule wizard.":::

> [!NOTE]
> Updating this rule will overwrite your existing rule with the latest version of the template.
Any automation step or logic that makes reference to the existing rule should be verified, in case the referenced names have changed. Also, any customizations you made in creating the original rule may be overwritten.

### Update your rule with the new template version

- If the changes made to the new version of the template are acceptable to you, and nothing else in your original rule has been affected, select **Review and update** to validate and apply the changes. 

- If you want to further customize the rule or re-apply any changes that might otherwise be overwritten, select **Next : Custom changes**. If you choose this, you will cycle through the remaining tabs of the [Analytics rule wizard](detect-threats-custom.md) to make those changes, after which you will validate and apply the changes on the **Review and update** tab.

## Next steps
In this document, you learned how to update your Azure Sentinel analytics rules to new template versions. To learn more about Azure Sentinel, see the following articles:

- Learn more about [analytics rules](detect-threats-built-in.md).
- See more details about the [analytics rule wizard](detect-threats-custom.md).
