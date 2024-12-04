---
title: Ingest Microsoft Defender for Cloud subscription-based alerts to Microsoft Sentinel
description: Learn how to connect security alerts from Microsoft Defender for Cloud and stream them into Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 11/19/2024
ms.author: yelevin
appliesto: 
    - Microsoft Sentinel


#Customer intent: As a security engineer, I want to integrate and synchronize alerts from cloud security tools into Microsoft Sentinel so that analysts can efficiently monitor, analyze, and respond to security incidents across my organization's hybrid and multicloud environments.

---

# Ingest Microsoft Defender for Cloud alerts to Microsoft Sentinel

[Microsoft Defender for Cloud](/azure/defender-for-cloud/)'s integrated cloud workload protections allow you to detect and quickly respond to threats across hybrid and multicloud workloads. The **Microsoft Defender for Cloud** connector allows you to ingest [security alerts from Defender for Cloud](/azure/defender-for-cloud/alerts-reference) into Microsoft Sentinel, so you can view, analyze, and respond to Defender alerts, and the incidents they generate, in a broader organizational threat context.

[Microsoft Defender for Cloud Defender plans](/azure/defender-for-cloud/defender-for-cloud-introduction#protect-cloud-workloads) are enabled per subscription. While Microsoft Sentinel's legacy connector for Defender for Cloud Apps is also configured per subscription, the **Tenant-based Microsoft Defender for Cloud** connector, in preview, allows you to collect Defender for Cloud alerts over your entire tenant without having to enable each subscription separately. The tenant-based connector also works with [Defender for Cloud's integration with Microsoft Defender XDR](ingest-defender-for-cloud-incidents.md) to ensure that all of your Defender for Cloud alerts are fully included in any incidents you receive through [Microsoft Defender XDR incident integration](microsoft-365-defender-sentinel-integration.md).

- **Alert synchronization**:

    - When you connect Microsoft Defender for Cloud to Microsoft Sentinel, the status of security alerts that get ingested into Microsoft Sentinel is synchronized between the two services. So, for example, when an alert is closed in Defender for Cloud, that alert displays as closed in Microsoft Sentinel as well.

    - Changing the status of an alert in Defender for Cloud won't affect the status of any Microsoft Sentinel **incidents** that contain the Microsoft Sentinel alert, only that of the alert itself.

- **Bi-directional alert synchronization**: Enabling **bi-directional sync** automatically syncs the status of original security alerts with that of the Microsoft Sentinel incidents that contain those alerts. So, for example, when a Microsoft Sentinel incident containing a security alerts is closed, the corresponding original alert is closed in Microsoft Defender for Cloud automatically.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]
> [!NOTE]
> The connector does not support syncing alerts from subscriptions owned by other tenants, even when Lighthouse is enabled for those tenants.

## Prerequisites

- You must be using Microsoft Sentinel in the Azure portal. If you're onboarded to Microsoft's unified security operations (SecOps) platform, Defender for Cloud alerts are already ingested into Microsoft Defender XDR, and the **Tenant-based Microsoft Defender for Cloud (Preview)** data connector isn't listed in the **Data connectors** page in the Defender portal. For more information, see [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md).

    If you're onboarded to Microsoft's unified SecOps platform, you'll still want to install the **Microsoft Defender for Cloud** solution to use built-in security content with Microsoft Sentinel.

    If you're using Microsoft Sentinel in the Defender portal without Microsoft Defender XDR, this procedure is still relevant for you. 

- You must have the following roles and permissions:

    - You must have read and write permissions on your Microsoft Sentinel workspace.

    - You must have the **Contributor** or **Owner** role on the subscription you want to connect to Microsoft Sentinel.

    - To enable bi-directional sync, you must have the **Contributor** or **Security Admin** role on the relevant subscription.

- You'll need to enable at least one plan within Microsoft Defender for Cloud for each subscription where you want to enable the connector. To enable Microsoft Defender plans on a subscription, you must have the **Security Admin** role for that subscription.

- You'll need the `SecurityInsights` resource provider to be registered for each subscription where you want to enable the connector. Review the guidance on the [resource provider registration status](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) and the ways to register it.

## Connect to Microsoft Defender for Cloud

1. In Microsoft Sentinel, install the solution for **Microsoft Defender for Cloud** from the **Content Hub**. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

1. Select **Configuration > Data connectors**.

1. From the **Data connectors** page, select either the **Subscription-based Microsoft Defender for Cloud (Legacy)** or the **Tenant-based Microsoft Defender for Cloud (Preview)** connector, and then select **Open connector page**.

1. Under **Configuration**, you'll see a list of the subscriptions in your tenant, and the status of their connection to Microsoft Defender for Cloud. Select the **Status** toggle next to each subscription whose alerts you want to stream into Microsoft Sentinel. If you want to connect several subscriptions at once, you can do this by marking the check boxes next to the relevant subscriptions and then selecting the **Connect** button on the bar above the list.

    - The check boxes and **Connect** toggles are active only on the subscriptions for which you have the [required permissions](#prerequisites).
    - The **Connect** button is active only if at least one subscription's check box has been marked.

1. To enable bi-directional sync on a subscription, locate the subscription in the list, and choose **Enabled** from the drop-down list in the **Bi-directional sync** column. To enable bi-directional sync on several subscriptions at once, mark their check boxes and select the **Enable bi-directional sync** button on the bar above the list.

    - The check boxes and drop-down lists are active only on the subscriptions for which you have the [required permissions](#prerequisites).
    - The **Enable bi-directional sync** button is active only if at least one subscription's check box has been marked.

1. In the **Microsoft Defender plans** column of the list, you can see if Microsoft Defender plans are enabled on your subscription, which is a [prerequisite](#prerequisites) for enabling the connector.

    The value for each subscription in this column is either blank, meaning no Defender plans are enabled, **All enabled**, or **Some enabled**. Those that say **Some enabled** also have an **Enable all** link you can select, that takes you to your Microsoft Defender for Cloud configuration dashboard for that subscription, where you can choose Defender plans to enable.

    The **Enable Microsoft Defender for all subscriptions** link button on the bar above the list takes you to your Microsoft Defender for Cloud Getting Started page, where you can choose on which subscriptions to enable Microsoft Defender for Cloud altogether. For example:

    :::image type="content" source="./media/connect-defender-for-cloud/azure-defender-config.png" alt-text="Screenshot of Microsoft Defender for Cloud connector configuration."::: 

1. You can select whether you want the alerts from Microsoft Defender for Cloud to automatically generate incidents in Microsoft Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically [creates incidents from alerts](create-incidents-from-alerts.md). You can then edit this rule under **Analytics**, in the  **Active rules** tab.

    > [!TIP]
    > When configuring [custom analytics rules](detect-threats-custom.md) for alerts from Microsoft Defender for Cloud, consider the alert severity to avoid opening incidents for informational alerts. 
    >
    > Informational alerts in Microsoft Defender for Cloud don't represent a security risk on their own, and are relevant only in the context of an existing, open incident. For more information, see [Security alerts and incidents in Microsoft Defender for Cloud](../security-center/security-center-alerts-overview.md).
    >

## Find and analyze your data

Security alerts are stored in the *SecurityAlert* table in your Log Analytics workspace. To query security alerts in Log Analytics, copy the following into your query window as a starting point:

```kusto
SecurityAlert 
| where ProductName == "Azure Security Center"
```

Alert synchronization *in both directions* can take a few minutes. Changes in the status of alerts might not be displayed immediately.

See the **Next steps** tab in the connector page for more useful sample queries, analytics rule templates, and recommended workbooks.

## Related content

In this document, you learned how to connect Microsoft Defender for Cloud to Microsoft Sentinel and synchronize alerts between them. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- Write your own rules to [detect threats](detect-threats-custom.md).
