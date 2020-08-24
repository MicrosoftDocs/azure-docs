---
title: Understand your logic app's health in Security Center
description: Understand why Azure considers your logic app resource to be healthy or unhealthy.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm
ms.topic: conceptual
ms.date: 11/23/2020
---

# Understand your logic app's health in Security Center

When your monitor your Logic Apps resources in [Microsoft Azure Security Center](../security-center/security-center-introduction.md), you can [see the health status of your Logic Apps resources](#view-logic-apps-health-status). Azure shows a Logic Apps resource as healthy if logging is enabled, and the logs' destination is properly configured. This article explains how to configure diagnostic logging and make sure all your logic apps are healthy resources.

> [!TIP]
> If you want to find the current status of the Logic Apps service, see the [Azure status](https://status.azure.com/) page, which lists the status of different products and services for each available region.

## Prerequisites

* An Azure subscription. If you don't have a subscription, [create a free Azure account](https://azure.microsoft.com/free/) before you start.
* Existing logic apps with [diagnostic logging enabled](#enable-diagnostic-logging).

## Enable diagnostic logging

To view the resource health status of your logic apps, you must first [set up diagnostic logging](monitor-logic-apps-log-analytics.md). If you don't already have a Log Analytics workspace, you must [create a workspace](../azure-monitor/learn/quick-create-workspace.md) before you can use this feature. Then, you can enable logging during the creation of a logic app, or enable logging for existing logic apps.

> [!TIP]
> Enabling diagnostic logs for Logic Apps is recommended by default. However, you control this setting for your logic apps. When you enable diagnostic logs for your logic apps, you can use the information to help analyze security incidents.

### Check diagnostic logging setting

If you're not sure whether your logic apps have diagnostic logging enabled, you can check in Security Center:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, enter and select **Security Center**.
1. On the Security Center dashboard menu, select **Recommendations** under **General**.
1. In the table of security suggestions, find and select **Enable auditing and logging** &gt; **Diagnostic logs in Logic Apps should be enabled** in the table of security controls.
1. On the recommendation page, expand the **Remediation steps** section and review the options. You can enable Logic Apps diagnostics by selecting the **Quick Fix!** button, or by following the manual remediation instructions.

## View logic apps' health status

After you've [enabled diagnostic logging](#enable-diagnostic-logging), you can see the health status of your logic apps in Security Center.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, enter and select **Security Center**.
1. On the Security Center dashboard menu, select **Inventory** under **General**.
1. On the inventory page, filter your assets list to show only Logic Apps resources. In the page menu, select **Resource types** &gt; **logic apps**. Now, the **Unhealthy Resources** counter shows the number of logic apps that Security Center considers unhealthy.
1. Review the **Recommendations** column in the list of logic apps resources. Select a resource name or select **...** &gt; **View resource** to see details about a specific logic app's health.
1. Follow the steps listed for your logic apps to remediate any potential resource health issues.

If diagnostic logging is already enabled, there may be an issue with the destination for your logs. Review [how to fix issues with different diagnostic logging destinations](#fix-diagnostic-logging-for-logic-apps).

## Fix diagnostic logging for logic apps

If your [logic apps are listed as unhealthy in Security Center](#view-logic-apps-health-status), open your logic app in Code View in the Azure portal or through the Azure CLI. Then, review the appropriate destination configuration for your diagnostic logs: [Azure Log Analytics](#log-analytics-and-event-hubs-destination), [Azure Event Hubs](#log-analytics-and-event-hubs-destination), or [a storage account](#storage-account-destinations).

### Log Analytics and Event Hubs destinations

If you use Log Analytics or Event Hubs as the destination for your Logic Apps diagnostic logs, check the following settings. 

1. Make sure that diagnostic logs are enabled. Confirm that the diagnostic Settings field **logs.enabled** is set to **true**. 
1. Make sure you haven't set a storage account as the destination instead. Confirm that the **storageAccountId** field is set to **false**.

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

### Storage accounts destinations

If you use a storage account as the destination for your Logic Apps diagnostic logs, check the following settings.

1. Make sure you've enabled logs in the setting. Confirm that the field **logs.enabled** is set to **true**.
1. Make sure you've enabled a retention policy for your diagnostic logs. Confirm that the field **retentionPolicy.enabled** is set to **true**.
1. Make sure that you've set a retention time of 0-365 days. Confirm that the field **retentionPolicy.days** is set to a number between 0 and 365.

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
                  },
 

```
