---
title: Set up continuous export in the Azure portal
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/20/2024
#customer intent: As a security analyst, I want to learn how to set up continuous export of alerts and recommendations in Microsoft Defender for Cloud so that I can analyze the data in Log Analytics or Azure Event Hubs.
---

# Set up continuous export in the Azure portal

Microsoft Defender for Cloud generates detailed security alerts and recommendations. To analyze the information that's in these alerts and recommendations, you can export them to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic [deployment model solution](export-to-siem.md). You can stream the alerts and recommendations as they're generated or define a schedule to send periodic snapshots of all new data.

This article describes how to set up continuous export to a Log Analytics workspace or to an event hub in Azure.

> [!TIP]
> Defender for Cloud also offers the option to do a onetime, manual export to a comma-separated values (CSV) file. Learn how to [download a CSV file](export-alerts-to-csv.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

Required roles and permissions:

- Security Admin or Owner for the resource group
- Write permissions for the target resource.
- If you use the [Azure Policy DeployIfNotExist policies](continuous-export-azure-policy.md), you must have permissions that let you assign policies.
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

    You can also send the data to an [event hub or Log Analytics workspace in a different tenant](benefits-of-continuous-export.md#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant)

1. Select **Save**.

> [!NOTE]
> Log Analytics supports only records that are up to 32 KB in size. When the data limit is reached, an alert displays the message **Data limit has been exceeded**.

## Related content

In this article, you learned how to configure continuous exports of your recommendations and alerts. You also learned how to download your alerts data as a CSV file.

To see related content:

- Learn more about [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).
- See the [Azure Event Hubs documentation](../event-hubs/index.yml).
- Learn more about [Microsoft Sentinel](../sentinel/index.yml).
- Review the [Azure Monitor documentation](../azure-monitor/index.yml).
- Learn how to [export data types schemas](https://aka.ms/ASCAutomationSchemas).
- Check out [common questions](faq-general.yml) about continuous export.
