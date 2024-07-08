---
title: Create scheduled analytics rules from templates in Microsoft Sentinel | Microsoft Docs
description: This article explains how to view and create scheduled analytics rules from templates in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/27/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---
# Create scheduled analytics rules from templates

By far the most common type of analytics rule, **Scheduled** rules are based on [Kusto queries](kusto-overview.md) that are configured to run at regular intervals and examine raw data from a defined "lookback" period. These queries can perform complex statistical operations on their target data, revealing baselines and outliers in groups of events. If the number of results captured by the query passes the threshold configured in the rule, the rule produces an alert.

Microsoft makes a vast array of **analytics rule templates** available to you through the many [solutions provided in the Content hub](sentinel-solutions.md), and strongly encourages you to use them to create your rules. The queries in scheduled rule templates are written by security and data science experts, either from Microsoft or from the vendor of the solution providing the template.

This article shows you how to create a scheduled analytics rule using a template.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## View existing analytics rules

To view the installed analytics rules in Microsoft Sentinel, go to the **Analytics** page. The **Rule templates** tab displays all the installed rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel to install the related product solutions or standalone content.

# [Azure portal](#tab/azure-portal)

1. From the **Configuration** section of the Microsoft Sentinel navigation menu, select **Analytics**.

1. On the **Analytics** screen, select the **Rule templates** tab.

1. If you want to filter the list for **Scheduled** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **Scheduled**. Then select **Apply**.

    :::image type="content" source="media/create-analytics-rule-from-template/view-detections.png" alt-text="Screenshot of scheduled analytics rule templates in Microsoft Azure portal." lightbox="media/create-analytics-rule-from-template/view-detections.png":::

# [Defender portal](#tab/defender-portal)

1. From the Microsoft Defender navigation menu, expand **Microsoft Sentinel**, then **Configuration**. Select **Analytics**.

1. On the **Analytics** screen, select the **Rule templates** tab.

1. If you want to filter the list for **Scheduled** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **Scheduled**. Then select **Apply**.

    :::image type="content" source="media/create-analytics-rule-from-template/view-detections-defender.png" alt-text="Screenshot of scheduled analytics rule templates in Microsoft Defender portal." lightbox="media/create-analytics-rule-from-template/view-detections-defender.png":::

---

## Create a rule from a template

This procedure describes how to create an analytics rule from a template.

# [Azure portal](#tab/azure-portal)

From the **Configuration** section of the Microsoft Sentinel navigation menu, select **Analytics**.

# [Defender portal](#tab/defender-portal)

From the Microsoft Defender navigation menu, expand **Microsoft Sentinel**, then **Configuration**. Select **Analytics**.

---

1. On the **Analytics** screen, select the **Rule templates** tab.

1. Select a template name, and then select the **Create rule** button on the details pane to create a new active rule based on that template. 

    Each template has a list of required data sources. When you open the template, the data sources are automatically checked for availability. If a data source isn't enabled, the **Create rule** button may be disabled, or you might see a message to that effect.

    :::image type="content" source="media/create-analytics-rule-from-template/use-built-in-template.png" alt-text="Screenshot of analytics rule preview panel.":::

1. The rule creation wizard opens. All the details are autofilled.

1. Cycle through the tabs of the wizard, customizing the logic and other rule settings where possible to better suit your specific needs. 

    When you get to the end of the rule creation wizard, Microsoft Sentinel creates the rule. The new rule appears in the **Active rules** tab.

    Repeat the process to create more rules. For more details on how to customize your rules in the rule creation wizard, see [Create a custom analytics rule from scratch](create-analytics-rules.md).

> [!TIP]
> - Make sure that you **enable all rules associated with your connected data sources** in order to ensure full security coverage for your environment. The most efficient way to enable analytics rules is directly from the data connector page, which lists any related rules. For more information, see [Connect data sources](connect-data-sources.md).
> 
> - You can also **push rules to Microsoft Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0)**, although doing so requires additional effort. 
> 
>     When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Microsoft Sentinel with identical settings in each instance.

## Next steps

In this document, you learned how to create scheduled analytics rules from templates in Microsoft Sentinel.

- Learn more about [analytics rules](threat-detection.md).
- Learn how to [create an analytics rule from scratch](create-analytics-rules.md).
