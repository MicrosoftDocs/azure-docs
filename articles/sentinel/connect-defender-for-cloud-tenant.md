---
title: Ingest tenant-wide Microsoft Defender for Cloud alerts into Microsoft Sentinel
description: Learn how to ingest Microsoft Defender for Cloud security alerts throughout your whole tenant into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/22/2023
---

# Ingest tenant-wide Microsoft Defender for Cloud alerts to Microsoft Sentinel

[Microsoft Defender for Cloud](../defender-for-cloud/index.yml)'s integrated cloud workload protections allow you to detect and quickly respond to threats across hybrid and multi-cloud workloads.

The **Tenant-based Microsoft Defender for Cloud (Preview) connector** allows you to ingest [alerts from Defender for Cloud](../defender-for-cloud/alerts-reference.md) into Microsoft Sentinel, so you can view, analyze, and respond to Defender alerts, and the incidents they generate, in a broader organizational threat context.

While [Microsoft Defender for Cloud Defender plans](../defender-for-cloud/defender-for-cloud-introduction.md#protect-cloud-workloads) are enabled per subscription, this *tenant-based data connector* is enabled or disabled once, over all the subscriptions in your tenant. The legacy version of this connector, also enabled on a per-workload subscription basis, is still available as the **Subscription-based Microsoft Defender for Cloud connector**.

> [!IMPORTANT]
> The Tenant-based Microsoft Defender for Cloud connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Defender for Cloud integration with Microsoft Defender XDR

Defender for Cloud is now [integrated with Microsoft Defender XDR](../defender-for-cloud/release-notes.md#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview)., formerly Microsoft 365 Defender (also in PREVIEW). If you have [Defender XDR incident integration enabled](microsoft-365-defender-sentinel-integration.md) in Microsoft Sentinel, you'll now [receive Defender for Cloud incidents](ingest-defender-for-cloud-incidents.md) through Defender XDR, which means they'll benefit from the same bi-directional synchronization as all other Defender XDR incidents.

## Bi-directional alert synchronization

Enabling **bi-directional sync** will automatically sync the status of original security alerts with that of the Microsoft Sentinel incidents that contain those alerts. So, for example, when a Microsoft Sentinel incident containing a security alerts is closed, the corresponding original alert will be closed in Microsoft Defender for Cloud automatically.

## Prerequisites

- You must have read and write permissions on your Microsoft Sentinel workspace.

- You must have the **Blahblah** role in your Microsoft Entra ID tenant. Since this connector works at the tenant level, you need not have any particular permissions or role on the subscriptions that correspond to the workloads you are monitoring with Defender for Cloud.

- You will need to enable at least one plan within Microsoft Defender for Cloud for each subscription where you want to enable the connector. To enable Microsoft Defender plans on a subscription, you must have the **Security Admin** role for that subscription.

- You will need the `SecurityInsights` resource provider to be registered for each subscription where you want to enable the connector. Review the guidance on the [resource provider registration status](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) and the ways to register it.

- To enable bi-directional sync, you must have the **Contributor** or **Security Admin** role on the relevant subscription.

- Install the solution for **Microsoft Defender for Cloud** from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).
    - If the solution is already installed, reinstall it to get the newest versions of the connector.

## Connect to Microsoft Defender for Cloud

1. In Microsoft Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Microsoft Defender for Cloud**, and select **Open connector page** in the details pane.

1. Under **Configuration**, you will see a list of the subscriptions in your tenant, and the status of their connection to Microsoft Defender for Cloud. Select the **Status** toggle next to each subscription whose alerts you want to stream into Microsoft Sentinel. If you want to connect several subscriptions at once, you can do this by marking the check boxes next to the relevant subscriptions and then selecting the **Connect** button on the bar above the list.

    > [!NOTE]
    > - The check boxes and **Connect** toggles will be active only on the subscriptions for which you have the required permissions.
    > - The **Connect** button will be active only if at least one subscription's check box has been marked.

1. To enable bi-directional sync on a subscription, locate the subscription in the list, and choose **Enabled** from the drop-down list in the **Bi-directional sync** column. To enable bi-directional sync on several subscriptions at once, mark their check boxes and select the **Enable bi-directional sync** button on the bar above the list.

    > [!NOTE]
    > - The check boxes and drop-down lists will be active only on the subscriptions for which you have the [required permissions](#prerequisites).
    > - The **Enable bi-directional sync** button will be active only if at least one subscription's check box has been marked.

1. In the **Microsoft Defender plans** column of the list, you can see if Microsoft Defender plans are enabled on your subscription (a prerequisite for enabling the connector). The value for each subscription in this column will either be blank (meaning no Defender plans are enabled), "All enabled," or "Some enabled." Those that say "Some enabled" will also have an **Enable all** link you can select, that will take you to your Microsoft Defender for Cloud configuration dashboard for that subscription, where you can choose Defender plans to enable. The **Enable Microsoft Defender for all subscriptions** link button on the bar above the list will take you to your Microsoft Defender for Cloud Getting Started page, where you can choose on which subscriptions to enable Microsoft Defender for Cloud altogether.

    :::image type="content" source="./media/connect-defender-for-cloud/azure-defender-config.png" alt-text="Screenshot of Microsoft Defender for Cloud connector configuration":::

1. You can select whether you want the alerts from Microsoft Defender for Cloud to automatically generate incidents in Microsoft Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically [creates incidents from alerts](create-incidents-from-alerts.md). You can then edit this rule under **Analytics**, in the  **Active rules** tab.

    > [!TIP]
    > When configuring [custom analytics rules](detect-threats-custom.md) for alerts from Microsoft Defender for Cloud, consider the alert severity to avoid opening incidents for informational alerts. 
    >
    > Informational alerts in Microsoft Defender for Cloud don't represent a security risk on their own, and are relevant only in the context of an existing, open incident. For more information, see [Security alerts and incidents in Microsoft Defender for Cloud](../security-center/security-center-alerts-overview.md).
    > 
    

## Find and analyze your data

> [!NOTE]
> Alert synchronization *in both directions* can take a few minutes. Changes in the status of alerts might not be displayed immediately.

- Security alerts are stored in the *SecurityAlert* table in your Log Analytics workspace.

- To query security alerts in Log Analytics, copy the following into your query window as a starting point:

    ```kusto
    SecurityAlert 
    | where ProductName == "Azure Security Center"
    ```

- See the **Next steps** tab in the connector page for additional useful sample queries, analytics rule templates, and recommended workbooks.

## Next steps

In this document, you learned how to connect Microsoft Defender for Cloud to Microsoft Sentinel and synchronize alerts between them. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- Write your own rules to [detect threats](detect-threats-custom.md).
