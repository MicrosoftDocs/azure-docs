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


## View detections

To view the installed analytics rules and detections in Microsoft Sentinel, go to the **Analytics** page. The **Rule templates** tab contains all the installed rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel to install the related product solutions or standalone content.

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

## Create analytics rules from templates

This procedure describes how to use analytics rules templates.

**To use an analytics rule template**:

1. In the Microsoft Sentinel > **Analytics** > **Rule templates** page, select a template name, and then select the **Create rule** button on the details pane to create a new active rule based on that template. 

    Each template has a list of required data sources. When you open the template, the data sources are automatically checked for availability. If there's an availability issue, the **Create rule** button may be disabled, or you may see a warning to that effect.

    :::image type="content" source="media/tutorial-detect-built-in/use-built-in-template.png" alt-text="Detection rule preview panel":::

1. The rule creation wizard opens. All the details are autofilled, and you can customize the logic and other rule settings to better suit your specific needs. Repeat this process to create more rules based on the template. After following the steps in the rule creation wizard to the end, you finished creating a rule based on the template. The new rules appear in the **Active rules** tab.

    For more details on how to customize your rules in the rule creation wizard, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

> [!TIP]
> - Make sure that you **enable all rules associated with your connected data sources** in order to ensure full security coverage for your environment. The most efficient way to enable analytics rules is directly from the data connector page, which lists any related rules. For more information, see [Connect data sources](connect-data-sources.md).
> 
> - You can also **push rules to Microsoft Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0)**, although doing so requires additional effort. 
> 
>     When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Microsoft Sentinel with identical settings in each instance.

## Create a custom analytics rule from scratch




## Create NRT rules

You create NRT rules the same way you create regular [scheduled-query analytics rules](detect-threats-custom.md):

# [Azure portal](#tab/azure-portal)

1. From the **Configuration** section of the Microsoft Sentinel navigation menu, select **Analytics**.

1. In the action bar at the top, select **+Create** and select **NRT query rule**. This opens the **Analytics rule wizard**.

    :::image type="content" source="media/create-nrt-rules/create-nrt-rule.png" alt-text="Screenshot shows how to create a new NRT rule." lightbox="media/create-nrt-rules/create-nrt-rule.png":::

# [Defender portal](#tab/defender-portal)

1. From the Microsoft Defender navigation menu, expand **Microsoft Sentinel**, then **Configuration**. Select **Analytics**.

1. In the action bar at the top of the grid, select **+Create** and select **NRT query rule**. This opens the **Analytics rule wizard**.

    :::image type="content" source="media/create-nrt-rules/defender-create-nrt-rule.png" alt-text="Screenshot shows how to create a new NRT rule." lightbox="media/create-nrt-rules/create-nrt-rule.png":::

---

3. Follow the instructions of the [**analytics rule wizard**](detect-threats-custom.md).

    The configuration of NRT rules is in most ways the same as that of scheduled analytics rules. 

    - You can refer to multiple tables and [**watchlists**](watchlists.md) in your query logic.

    - You can use all of the alert enrichment methods: [**entity mapping**](map-data-fields-to-entities.md), [**custom details**](surface-custom-details-in-alerts.md), and [**alert details**](customize-alert-details.md).

    - You can choose how to group alerts into incidents, and to suppress a query when a particular result has been generated.

    - You can automate responses to both alerts and incidents.

    Because of the [**nature and limitations of NRT rules**](near-real-time-rules.md#considerations), however, the following features of scheduled analytics rules will *not be available* in the wizard:

    - **Query scheduling** is not configurable, since queries are automatically scheduled to run once per minute with a one-minute lookback period. 
    - **Alert threshold** is irrelevant, since an alert is always generated.
    - **Event grouping** configuration is now available to a limited degree. You can choose to have an NRT rule generate an alert for each event for up to 30 events. If you choose this option and the rule results in more than 30 events, single-event alerts will be generated for the first 29 events, and a 30th alert will summarize all the events in the result set.

    In addition, the query itself has the following requirements:

    - You can't run the query across workspaces.

    - Due to the size limits of the alerts, your query should make use of `project` statements to include only the necessary fields from your table. Otherwise, the information you want to surface could end up being truncated.

## Next steps

In this document, you learned how to create near-real-time (NRT) analytics rules in Microsoft Sentinel.

- Learn more about [near-real-time (NRT) analytics rules in Microsoft Sentinel](near-real-time-rules.md).
- Explore other [analytics rule types](threat-detection.md).
