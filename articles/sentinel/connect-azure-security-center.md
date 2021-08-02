---
title: Connect Azure Defender alerts to Azure Sentinel
description: Learn how to connect Azure Defender alerts from Azure Security Center and stream them into Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: d28c2264-2dce-42e1-b096-b5a234ff858a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 07/08/2021
ms.author: yelevin
---
# Connect Azure Defender alerts from Azure Security Center

## Background

[Azure Defender](../security-center/azure-defender.md), the integrated cloud workload protection platform (CWPP) of [Azure Security Center](../security-center/security-center-introduction.md), is a security management tool that allows you to detect and quickly respond to threats across hybrid cloud workloads. 

This connector allows you to stream your Azure Defender security alerts from Azure Security Center into Azure Sentinel, so you can view, analyze, and respond to Defender alerts, and the incidents they generate, in a broader organizational threat context.

As Azure Defender itself is enabled per subscription, the Azure Defender connector too is enabled or disabled separately for each subscription.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

### Alert synchronization

- When you connect Azure Defender to Azure Sentinel, the status of Azure Defender alerts that get ingested into Azure Sentinel is synchronized between the two services. So, for example, when an alert is closed in Azure Defender, that alert will display as closed in Azure Sentinel as well.

- Changing the status of an alert in Azure Defender will *not* affect the status of any Azure Sentinel **incidents** that contain the Azure Sentinel alert, only that of the alert itself.

### Bi-directional alert synchronization

> [!IMPORTANT]
>
> - The **bi-directional alert synchronization** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

- Enabling **bi-directional sync** will automatically sync the status of original Azure Defender alerts with that of the Azure Sentinel incidents that contain those alerts. So, for example, when an Azure Sentinel incident containing an Azure Defender alert is closed, the corresponding original alert will be closed in Azure Defender automatically.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have the Security Reader role in the subscriptions of the logs you stream.

- You will need to enable at least one **Azure Defender** plan within Azure Security Center for each subscription for which you want to enable the connector. To enable Azure Defender plans on a subscription, you must have the **Security Admin** role for that subscription.

-  To enable bi-directional sync, you must have the **Contributor** or **Security Admin** role on the relevant subscription.

## Connect to Azure Defender

1. In Azure Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Azure Defender**, and click **Open connector page** in the details pane.

1. Under **Configuration**, you will see a list of the subscriptions in your tenant, and the status of their connection to Azure Defender. Select the **Status** toggle next to each subscription whose alerts you want to stream into Azure Sentinel. If you want to connect several subscriptions at once, you can do this by marking the check boxes next to the relevant subscriptions and then selecting the **Connect** button on the bar above the list.

    > [!NOTE]
    > - The check boxes and **Connect** toggles will be active only on the subscriptions for which you have the required permissions.
    > - The **Connect** button will be active only if at least one subscription's check box has been marked.

1. To enable bi-directional sync on a subscription, locate the subscription in the list, and choose **Enabled** from the drop-down list in the **Bi-directional sync (Preview)** column. To enable bi-directional sync on several subscriptions at once, mark their check boxes and select the **Enable bi-directional sync** button on the bar above the list.

    > [!NOTE]
    > - The check boxes and drop-down lists will be active only on the subscriptions for which you have the [required permissions](#prerequisites).
    > - The **Enable bi-directional sync** button will be active only if at least one subscription's check box has been marked.

1. In the **Azure Defender plans** column of the list, you can see if Azure Defender plans are enabled on your subscription (a prerequisite for enabling the connector). The value for each subscription in this column will either be blank (meaning no Defender plans are enabled), "All enabled," or "Some enabled." Those that say "Some enabled" will also have an **Enable all** link you can select, that will take you to your Azure Defender configuration dashboard for that subscription, where you can choose Defender plans to enable. The **Enable Azure Defender for all subscriptions** link button on the bar above the list will take you to your Azure Defender Getting Started page, where you can choose on which subscriptions to enable Azure Defender altogether.

    :::image type="content" source="./media/connect-azure-security-center/azure-defender-config.png" alt-text="Screen shot of Azure Defender connector configuration":::

1. You can select whether you want the alerts from Azure Defender to automatically generate incidents in Azure Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically [creates incidents from alerts](create-incidents-from-alerts.md). You can then edit this rule under **Analytics**, in the  **Active rules** tab.

    > [!TIP]
    > When configuring [custom analytics rules](tutorial-detect-threats-custom.md) for alerts from Azure Defender, consider the alert severity to avoid opening incidents for informational alerts. 
    >
    > Informational alerts in Azure Security Center don't represent a security risk on their own, and are relevant only in the context of an existing, open incident. For more information, see [Security alerts and incidents in Azure Security Center](/azure/security-center/security-center-alerts-overview).
    > 
    

## Find and analyze your data

> [!NOTE]
> Alert synchronization *in both directions* can take a few minutes. Changes in the status of alerts might not be displayed immediately.

- Azure Defender alerts are stored in the *SecurityAlert* table in your Log Analytics workspace.

- To query Azure Defender alerts in Log Analytics, copy the following into your query window as a starting point:

    ```kusto
    SecurityAlert 
    | where ProductName == "Azure Security Center"
    ```

- See the **Next steps** tab in the connector page for additional useful sample queries, analytics rule templates, and recommended workbooks.

## Next steps

In this document, you learned how to connect Azure Defender to Azure Sentinel and synchronize alerts between them. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- Write your own rules to [detect threats](tutorial-detect-threats-custom.md).
