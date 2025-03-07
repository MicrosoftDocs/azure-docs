---
title: Work with near-real-time (NRT) detection analytics rules in Microsoft Sentinel | Microsoft Docs
description: This article explains how to view and create near-real-time (NRT) detection analytics rules in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 03/28/2024
ms.author: yelevin
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security engineer, I want to configure near-real-time detection analytics rules so that analysts can achieve up-to-the-minute threat detection and automate responses in my security operations.

---
# Work with near-real-time (NRT) detection analytics rules in Microsoft Sentinel

Microsoft Sentinel’s [near-real-time analytics rules](near-real-time-rules.md) provide up-to-the-minute threat detection out-of-the-box. This type of rule was designed to be highly responsive by running its query at intervals just one minute apart.

For the time being, these templates have limited application as outlined below, but the technology is rapidly evolving and growing.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## View near-real-time (NRT) rules

# [Azure portal](#tab/azure-portal)

1. From the **Configuration** section of the Microsoft Sentinel navigation menu, select **Analytics**.

1. On the **Analytics** screen, with the **Active rules** tab selected, filter the list for **NRT** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **NRT**. Then select **Apply**.

# [Defender portal](#tab/defender-portal)

1. From the Microsoft Defender navigation menu, expand **Microsoft Sentinel**, then **Configuration**. Select **Analytics**.

1. On the **Analytics** screen, with the **Active rules** tab selected, filter the list for **NRT** templates:

    1. Select **Add filter** and choose **Rule type** from the list of filters.

    1. From the resulting list, select **NRT**. Then select **Apply**.

---

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

    - You can run the rule query across multiple workspaces.

    Because of the [**nature and limitations of NRT rules**](near-real-time-rules.md#considerations), however, the following features of scheduled analytics rules will *not be available* in the wizard:

    - **Query scheduling** is not configurable, since queries are automatically scheduled to run once per minute with a one-minute lookback period. 
    - **Alert threshold** is irrelevant, since an alert is always generated.
    - **Event grouping** configuration is now available to a limited degree. You can choose to have an NRT rule generate an alert for each event for up to 30 events. If you choose this option and the rule results in more than 30 events, single-event alerts will be generated for the first 29 events, and a 30th alert will summarize all the events in the result set.

    In addition, due to the size limits of the alerts, your query should make use of `project` statements to include only the necessary fields from your table. Otherwise, the information you want to surface could end up being truncated.

## Next steps

In this document, you learned how to create near-real-time (NRT) analytics rules in Microsoft Sentinel.

- Learn more about [near-real-time (NRT) analytics rules in Microsoft Sentinel](near-real-time-rules.md).
- Explore other [analytics rule types](threat-detection.md).
