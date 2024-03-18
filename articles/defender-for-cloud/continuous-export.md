---
title: Setup continuous export in the Azure portal
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/18/2024
#customer intent: As a security analyst, I want to learn how to set up continuous export of alerts and recommendations in Microsoft Defender for Cloud so that I can analyze the data in Log Analytics or Azure Event Hubs.
---

# Setup continuous export in the Azure portal

Microsoft Defender for Cloud generates detailed security alerts and recommendations. To analyze the information that's in these alerts and recommendations, you can export them to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic [deployment model solution](export-to-siem.md). You can stream the alerts and recommendations as they're generated or define a schedule to send periodic snapshots of all new data.

This article describes how to set up continuous export to a Log Analytics workspace or to an event hub in Azure.

> [!TIP]
> Defender for Cloud also offers the option to do a onetime, manual export to a comma-separated values (CSV) file. Learn more in [Manually export alerts and recommendations](#manually-export-alerts-and-recommendations).

## Prerequisites

Required roles and permissions:
- Security Admin or Owner for the resource group
- Write permissions for the target resource.
- If you use the [Azure Policy DeployIfNotExist policies](#set-up-continuous-export-at-scale-by-using-provided-policies), you must have permissions that let you assign policies.
- To export data to Event Hubs, you must have Write permissions on the Event Hubs policy.
- To export to a Log Analytics workspace: 
    - If it *has the SecurityCenterFree solution*, you must have a minimum of Read permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/read`.
    - If it *doesn't have the SecurityCenterFree solution*, you must have write permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/action`.
    
    Learn more about [Azure Monitor and Log Analytics workspace solutions](/previous-versions/azure/azure-monitor/insights/solutions).

## Set up continuous export in the Azure portal

You can set up continuous export on the Microsoft Defender for Cloud pages in the Azure portal, by using the REST API, or at scale by using provided Azure Policy templates.

**To set up a continuous export to Log Analytics or Azure Event Hubs by using the Azure portal**:

1. On the Defender for Cloud resource menu, select **Environment settings**.

1. Select the subscription that you want to configure data export for.

1. In the resource menu under **Settings**, select **Continuous export**.

    :::image type="content" source="./media/continuous-export/continuous-export-options-page.png" alt-text="Screenshot that shows the export options in Microsoft Defender for Cloud." lightbox="./media/continuous-export/continuous-export-options-page.png":::

    The export options appear. There's a tab for each available export target, either event hub or Log Analytics workspace.

1. Select the data type you'd like to export, and choose from the filters on each type (for example, export only high-severity alerts).

1. Select the export frequency:

    - **Streaming**. Assessments are sent when a resource’s health state is updated (if no updates occur, no data is sent).
    - **Snapshots**. A snapshot of the current state of the selected data types that are sent once a week per subscription. To identify snapshot data, look for the field **IsSnapshot**.

    If your selection includes one of these recommendations, you can include the vulnerability assessment findings with them:

    - [SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/82e20e14-edc5-4373-bfc4-f13121257c37)
    - [SQL servers on machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f97aa83c-9b63-4f9a-99f6-b22c4398f936)
    - [Container registry images should have vulnerability findings resolved (powered by Qualys)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dbd0cb49-b563-45e7-9724-889e799fa648)
    - [Machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f)
    - [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27)

    To include the findings with these recommendations, set **Include security findings** to **Yes**.

    :::image type="content" source="./media/continuous-export/include-security-findings-toggle.png" alt-text="Screenshot that shows the Include security findings toggle in a continuous export configuration." :::

1. Under **Export target**, choose where you'd like the data saved. Data can be saved in a target of a different subscription (for example, in a central Event Hubs instance or in a central Log Analytics workspace).

    You can also send the data to an [event hub or Log Analytics workspace in a different tenant](#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant).

1. Select **Save**.

> [!NOTE]
> Log Analytics supports only records that are up to 32 KB in size. When the data limit is reached, an alert displays the message **Data limit has been exceeded**.

## View exported alerts and recommendations in Azure Monitor

You might also choose to view exported security alerts or recommendations in [Azure Monitor](../azure-monitor/alerts/alerts-overview.md).

Azure Monitor provides a unified alerting experience for various Azure alerts, including a diagnostic log, metric alerts, and custom alerts that are based on Log Analytics workspace queries.

To view alerts and recommendations from Defender for Cloud in Azure Monitor, configure an alert rule that's based on Log Analytics queries (a log alert rule):

1. On the Azure Monitor **Alerts** page, select **New alert rule**.

    ![Screenshot that shows the Azure Monitor alerts page.](./media/continuous-export/azure-monitor-alerts.png)

1. On the **Create rule** pane, set up your new rule the same way you'd configure a [log alert rule in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md):

    - For **Resource**, select the Log Analytics workspace to which you exported security alerts and recommendations.

    - For **Condition**, select **Custom log search**. In the page that appears, configure the query, lookback period, and frequency period. In the search query, you can enter **SecurityAlert** or **SecurityRecommendation** to query the data types that Defender for Cloud continuously exports to as you enable the continuous export to Log Analytics feature.

    - Optionally, create an [action group](../azure-monitor/alerts/action-groups.md) to trigger. Action groups can automate sending an email, creating an ITSM ticket, running a webhook, and more, based on an event in your environment.

    ![Screenshot that shows the Azure Monitor create alert rule pane.](./media/continuous-export/azure-monitor-alert-rule.png)

The Defender for Cloud alerts or recommendations appear (depending on your configured continuous export rules and the condition that you defined in your Azure Monitor alert rule) in Azure Monitor alerts, with automatic triggering of an action group (if provided).

<a name="manual-one-time-export-of-alerts-and-recommendations"></a>

## Manually export alerts and recommendations

To download a CSV file that lists alerts or recommendations, go to the **Security alerts** page or the **Recommendations** page, and then select the **Download CSV report** button.

> [!TIP]
> Due to Azure Resource Graph limitations, the reports are limited to a file size of 13,000 rows. If you see errors related to too much data being exported, try limiting the output by selecting a smaller set of subscriptions to be exported.

:::image type="content" source="./media/continuous-export/download-alerts-csv.png" alt-text="Screenshot that shows how to download alerts data as a CSV file." lightbox="./media/continuous-export/download-alerts-csv.png":::

> [!NOTE]
> These reports contain alerts and recommendations for resources from the currently selected subscriptions.

## Related content

In this article, you learned how to configure continuous exports of your recommendations and alerts. You also learned how to download your alerts data as a CSV file.

To see related content:

- Learn more about [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).
- See the [Azure Event Hubs documentation](../event-hubs/index.yml).
- Learn more about [Microsoft Sentinel](../sentinel/index.yml).
- Review the [Azure Monitor documentation](../azure-monitor/index.yml).
- Learn how to [export data types schemas](https://aka.ms/ASCAutomationSchemas).
- Check out [common questions](faq-general.yml) about continuous export.
