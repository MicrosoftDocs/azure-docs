---
title: Work with near-real-time (NRT) detection analytics rules in Microsoft Sentinel | Microsoft Docs
description: This article explains how to view and create near-real-time (NRT) detection analytics rules in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 11/02/2022
ms.author: yelevin
---
# Work with near-real-time (NRT) detection analytics rules in Microsoft Sentinel

> [!IMPORTANT]
>
> - Near-real-time (NRT) rules are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Microsoft Sentinel’s [near-real-time analytics rules](near-real-time-rules.md) provide up-to-the-minute threat detection out-of-the-box. This type of rule was designed to be highly responsive by running its query at intervals just one minute apart.

For the time being, these templates have limited application as outlined below, but the technology is rapidly evolving and growing.

## View near-real-time (NRT) rules

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. In the **Active rules** tab of the **Analytics** blade, filter the list for **NRT** templates:

    1. Click the **Rule type** filter, then the drop-down list that appears below.

    1. Unmark **Select all**, then mark **NRT**.

    1. If necessary, click the top of the drop-down list to retract it, then click **OK**.

## Create NRT rules

You create NRT rules the same way you create regular [scheduled-query analytics rules](detect-threats-custom.md):

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Select **Create** from the button bar, then **NRT query rule (preview)** from the drop-down list.

    :::image type="content" source="media/create-nrt-rules/create-nrt-rule.png" alt-text="Screenshot shows how to create a new NRT rule." lightbox="media/create-nrt-rules/create-nrt-rule.png":::

1. Follow the instructions of the [**analytics rule wizard**](detect-threats-custom.md).

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
- Explore other [analytics rule types](detect-threats-built-in.md).
