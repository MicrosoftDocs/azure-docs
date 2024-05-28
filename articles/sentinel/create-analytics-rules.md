---
title: Create scheduled analytics rules in Microsoft Sentinel | Microsoft Docs
description: This article explains how to view and create scheduled analytics rules in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/27/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---
# Create scheduled analytics rules in Microsoft Sentinel

Microsoft Sentinel’s [near-real-time analytics rules](near-real-time-rules.md) provide up-to-the-minute threat detection out-of-the-box. This type of rule was designed to be highly responsive by running its query at intervals just one minute apart.

For the time being, these templates have limited application as outlined below, but the technology is rapidly evolving and growing.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]


## View existing analytics rules

To view the installed analytics rules in Microsoft Sentinel, go to the **Analytics** page. The **Rule templates** tab contains all the installed rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel to install the related product solutions or standalone content.

# [Azure portal](#tab/azure-portal)

1. From the **Configuration** section of the Microsoft Sentinel navigation menu, select **Analytics**.

1. On the **Analytics** screen, select the **Rule templates** tab.

1. If you want to filter the list for **Scheduled** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **Scheduled**. Then select **Apply**.

    :::image type="content" source="media/tutorial-detect-built-in/view-oob-detections.png" alt-text="Screenshot shows built-in detection rules to find threats with Microsoft Sentinel.":::

# [Defender portal](#tab/defender-portal)

1. From the Microsoft Defender navigation menu, expand **Microsoft Sentinel**, then **Configuration**. Select **Analytics**.

1. On the **Analytics** screen, select the **Rule templates** tab.

1. If you want to filter the list for **Scheduled** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **Scheduled**. Then select **Apply**.

---

## Create a rule from a template

This procedure describes how to create an analytics rule from a template.

**To use an analytics rule template**:

1. In the Microsoft Sentinel > **Analytics** > **Rule templates** page, select a template name, and then select the **Create rule** button on the details pane to create a new active rule based on that template. 

    Each template has a list of required data sources. When you open the template, the data sources are automatically checked for availability. If a data source isn't enabled, the **Create rule** button may be disabled, or you might see a message to that effect.

    :::image type="content" source="media/tutorial-detect-built-in/use-built-in-template.png" alt-text="Detection rule preview panel":::

1. The rule creation wizard opens. All the details are autofilled, and you can customize the logic and other rule settings to better suit your specific needs. When you get to the end of the rule creation wizard, Microsoft Sentinel creates the rule. The new rule appears in the **Active rules** tab.

    Repeat the process to create more rules. For more details on how to customize your rules in the rule creation wizard, see [Create a custom analytics rule from scratch](#create-a-custom-analytics-rule-from-scratch).

> [!TIP]
> - Make sure that you **enable all rules associated with your connected data sources** in order to ensure full security coverage for your environment. The most efficient way to enable analytics rules is directly from the data connector page, which lists any related rules. For more information, see [Connect data sources](connect-data-sources.md).
> 
> - You can also **push rules to Microsoft Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0)**, although doing so requires additional effort. 
> 
>     When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Microsoft Sentinel with identical settings in each instance.

## Create a custom analytics rule from scratch




## Next steps

In this document, you learned how to create near-real-time (NRT) analytics rules in Microsoft Sentinel.

- Learn more about [near-real-time (NRT) analytics rules in Microsoft Sentinel](near-real-time-rules.md).
- Explore other [analytics rule types](threat-detection.md).
