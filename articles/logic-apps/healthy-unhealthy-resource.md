---
title: Set up logging to monitor logic apps in Azure Security Center
description: Monitor health for Azure Logic Apps resources in Azure Security Center by setting up diagnostic logging. 
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# Set up logging to monitor logic apps in Microsoft Defender for Cloud

When you monitor your Azure Logic Apps resources in [Microsoft Azure Security Center](../security-center/security-center-introduction.md), you can [review whether your logic apps are following the default policies](#view-logic-apps-health-status). Azure shows the health status for an Azure Logic Apps resource after you enable logging and correctly set up the logs' destination. This article explains how to configure diagnostic logging and make sure that all your logic apps are healthy resources.

> [!TIP]
> To find the current status for the Azure Logic Apps service, review the [Azure status page](https://azure.status.microsoft/), which lists the status for different products and services in each available region.

## Prerequisites

* An Azure subscription. If you don't have a subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Existing logic apps with [diagnostic logging enabled](#enable-diagnostic-logging).

* A Log Analytics workspace, which is required to enable logging for your logic app. If you don't have a workspace, first [create your workspace](../azure-monitor/logs/quick-create-workspace.md).

## Enable diagnostic logging

Before you can view the resource health status for your logic apps, you must first [set up diagnostic logging](monitor-workflows-collect-diagnostic-data.md). If you already have a Log Analytics workspace, you can enable logging either when you create your logic app or on existing logic apps.

> [!TIP]
> The default recommendation is to enable diagnostic logs for Azure Logic Apps. However, you control this setting for your logic apps. When you enable diagnostic logs for your logic apps, you can use the information to help analyze security incidents.

### Check diagnostic logging setting

If you're not sure whether your logic apps have diagnostic logging enabled, you can check in Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, enter and select **Defender for Cloud**.
1. On the workload protection dashboard menu, under **General**, select **Recommendations**.
1. In the table of security suggestions, find and select **Enable auditing and logging** &gt; **Diagnostic logs in Logic Apps should be enabled** in the table of security controls.
1. On the recommendation page, expand the **Remediation steps** section and review the options. You can enable Azure Logic Apps diagnostics by selecting the **Quick Fix!** button, or by following the manual remediation instructions.

## View logic apps' health status

After you've [enabled diagnostic logging](#enable-diagnostic-logging), you can see the health status of your logic apps in Defender for Cloud.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, enter and select **Defender for Cloud**.
1. On the workload protection dashboard menu,  under **General**, select **Inventory**.
1. On the inventory page, filter your assets list to show only Azure Logic Apps resources. In the page menu, select **Resource types** &gt; **logic apps**.

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
