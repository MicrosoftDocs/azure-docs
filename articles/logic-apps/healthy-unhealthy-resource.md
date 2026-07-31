---
title: Monitor Resource Health with Defender for Cloud
description: Monitor resource health for Azure Logic Apps by setting up diagnostic logging with Microsoft Defender for Cloud in Azure Security Center.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 03/13/2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to set up resource health monitoring and diagnostic logging with Microsoft Defender for Cloud in Azure Security Center.
---

# Monitor resource health for Azure Logic Apps by setting up logging in Azure Security Center

When you monitor your Azure Logic Apps resources by using with Microsoft Defender for Cloud in Microsoft Azure Security Center, you can check whether your logic apps follow default policies. Azure shows the health status for a resource in Azure Logic Apps after you enable logging and correctly set up the logs' destination.

This guide shows how to configure diagnostic logging and make sure that all your logic apps are healthy resources.

For more information, see:

- [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
- [Microsoft Azure Security Center](../security-center/security-center-introduction.md)

> [!TIP]
>
> To find the current status for the Azure Logic Apps service, visit the [Azure status page](https://azure.status.microsoft/). This page lists the statuses for different products and services in each available region.

## Prerequisites

* An Azure subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* Existing logic apps with [diagnostic logging enabled](#enable-diagnostic-logging).

* A Log Analytics workspace, which is required to enable logging for your logic app. If you don't have a workspace, first [create your workspace](/azure/azure-monitor/logs/quick-create-workspace).

## Enable diagnostic logging

Before you can view the resource health status for your logic apps, you must first [set up diagnostic logging](monitor-workflows-collect-diagnostic-data.md). If you already have a Log Analytics workspace, you can enable logging either when you create your logic app or on existing logic apps.

> [!TIP]
>
> The default recommendation is to enable diagnostic logs for Azure Logic Apps. However, you control this setting for your logic apps. When you enable diagnostic logs for your logic apps, you can use the information to help analyze security incidents.

### Check diagnostic logging setting

If you're not sure whether your logic apps have diagnostic logging enabled, you can check in Defender for Cloud:

1. In the [Azure portal](https://portal.azure.com) search bar, enter and select **Defender for Cloud**.
1. On the workload protection dashboard menu, under **General**, select **Recommendations**.
1. In the table of security suggestions, find the table of security controls.
1. Find and select **Enable auditing and logging** &gt; **Diagnostic logs in Logic Apps should be enabled**.
1. On the recommendation page, expand the **Remediation steps** section and review the options.
1. Enable Azure Logic Apps diagnostics by selecting the **Quick Fix!** button, or by following the manual remediation instructions.

## View logic apps' health status

After you [enable diagnostic logging](#enable-diagnostic-logging), you can see the health status of your logic apps in Defender for Cloud.

1. In the [Azure portal](https://portal.azure.com) search bar, enter and select **Defender for Cloud**.
1. On the workload protection dashboard menu,  under **General**, select **Inventory**.
1. On the inventory page, filter your assets list to show only Azure Logic Apps resources.
1. From the page menu, select **Resource types** &gt; **logic apps**.

   The **Unhealthy Resources** counter shows the number of logic apps that Defender for Cloud considers unhealthy.

1.  In the list of logic apps resources, review the **Recommendations** column. To review the health details for a specific logic app, select a resource name, or select the ellipses button (**...**) &gt; **View resource**.
1.  To remediate any potential resource health issues, follow the steps listed for your logic apps.

If diagnostic logging is already enabled, there might be an issue with the destination for your logs. Review [how to fix issues with different diagnostic logging destinations](#fix-diagnostic-logging-for-logic-apps).

## Fix diagnostic logging for logic apps

If your [logic apps are listed as unhealthy in Defender for Cloud](#view-logic-apps-health-status), open your logic app in Code View in the Azure portal or through the Azure CLI. Then, check the destination configuration for your diagnostic logs: [Azure Log Analytics](#log-analytics-and-event-hubs-destinations), [Azure Event Hubs](#log-analytics-and-event-hubs-destinations), or [an Azure Storage account](#storage-account-destination).

### Log Analytics and Event Hubs destinations

If you use Log Analytics or Event Hubs as the destination for your Azure Logic Apps diagnostic logs, check the following settings. 

1. To confirm that you enabled diagnostic logs, check that the diagnostic settings `logs.enabled` field is set to `true`. 
1. To confirm that you haven't set a storage account as the destination instead, check that the `storageAccountId` field is set to `false`.

For example:

```json
"allOf": [
    {
        "field": "Microsoft.Insights/diagnosticSettings/logs.enabled",
        "equals": "true"
    },
    {
        "anyOf": [
            {
                "field": "Microsoft.Insights/diagnosticSettings/logs[*].retentionPolicy.enabled",
                "notEquals": "true"
            },
            {
                "field": "Microsoft.Insights/diagnosticSettings/storageAccountId",
                "exists": false
            }
        ]
    }
] 
```

### Storage account destination

If you use a storage account as the destination for your Azure Logic Apps diagnostic logs, check the following settings.

1. To confirm that you enabled diagnostic logs, check that the diagnostics settings `logs.enabled` field is set to `true`.
1. To confirm that you enabled a retention policy for your diagnostic logs, check that the `retentionPolicy.enabled` field is set to `true`.
1. To confirm you set a retention time of 0-365 days, check the `retentionPolicy.days` field is set to a number inclusively between 0 and 365.

```json
"allOf": [
    {
        "field": "Microsoft.Insights/diagnosticSettings/logs[*].retentionPolicy.enabled",
        "equals": "true"
    },
    {
        "anyOf": [
            {
                "field": "Microsoft.Insights/diagnosticSettings/logs[*].retentionPolicy.days",
                "equals": "0"
            },
            {
                "field": "Microsoft.Insights/diagnosticSettings/logs[*].retentionPolicy.days",
                "equals": "[parameters('requiredRetentionDays')]"
            }
          ]
    },
    {
        "field": "Microsoft.Insights/diagnosticSettings/logs.enabled",
        "equals": "true"
    }
]
```

## Related content

- [Monitor Standard workflow health with Health Check](monitor-health-standard-workflows.md)
- [Monitor workflows in Azure Logic Apps](monitor-logic-apps-overview.md)
