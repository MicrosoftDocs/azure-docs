---
title: Non-common alert schema definitions in Azure Monitor for test action group
description: Understanding the non-common alert schema definitions for Azure Monitor for the test action group feature.
author: issahn
ms.topic: conceptual
ms.date: 06/19/2023
ms.reviewer: nolavime
---

# Non-common alert schema definitions for test action group (preview)

This article describes the non-common alert schema definitions for Azure Monitor, including definitions for:
- Webhooks
- Azure Logic Apps
- Azure Functions
- Azure Automation runbooks

## What is the non-common alert schema?

The non-common alert schema lets you customize the consumption experience for alert notifications in Azure today. Historically, the three alert types in Azure today (metric, log, and activity log) have had their own email templates and webhook schemas.

## Alert context

See sample values for two metric alerts.

### Metric alerts: Static threshold

**Sample values**

```json
{
  "schemaId": "AzureMonitorMetricAlert",
  "data": {
    "version": "2.0",
    "properties": {
      "customKey1": "value1",
      "customKey2": "value2"
    },
    "status": "Activated",
    "context": {
      "timestamp": "2021-11-15T09:35:12.9703687Z",
      "id": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/microsoft.insights/metricAlerts/test-metricAlertRule",
      "name": "test-metricAlertRule",
      "description": "Alert rule description",
      "conditionType": "SingleResourceMultipleMetricCriteria",
      "severity": "3",
      "condition": {
        "windowSize": "PT5M",
        "allOf": [
          {
            "metricName": "Transactions",
            "metricNamespace": "Microsoft.Storage/storageAccounts",
            "operator": "GreaterThan",
            "threshold": "0",
            "timeAggregation": "Total",
            "dimensions": [
              {
                "name": "ApiName",
                "value": "GetBlob"
              }
            ],
            "metricValue": 100,
            "webTestName": null
          }
        ]
      },
      "subscriptionId": "11111111-1111-1111-1111-111111111111",
      "resourceGroupName": "test-RG",
      "resourceName": "test-storageAccount",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Storage/storageAccounts/test-storageAccount",
      "portalLink": "https://portal.azure.com/#resource/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Storage/storageAccounts/test-storageAccount"
    }
  }
}
```

### Metric alerts: Dynamic threshold

**Sample values**

```json
{
	"schemaId": "AzureMonitorMetricAlert",
	"data": {
		"version": "2.0",
		"properties": {
			"customKey1": "value1",
			"customKey2": "value2"
		},
		"status": "Activated",
		"context": {
			"timestamp": "2021-11-15T09:35:24.3468506Z",
			"id": "/subscriptions/11111111-1111-1111-1111-111111111111/resourcegroups/test-RG/providers/microsoft.insights/metricalerts/test-metricAlertRule",
			"name": "test-metricAlertRule",
			"description": "Alert rule description",
			"conditionType": "DynamicThresholdCriteria",
			"severity": "3",
			"condition": {
				"windowSize": "PT15M",
				"allOf": [
					{
						"alertSensitivity": "Low",
						"failingPeriods": {
							"numberOfEvaluationPeriods": 3,
							"minFailingPeriodsToAlert": 3
						},
						"ignoreDataBefore": null,
						"metricName": "Transactions",
						"metricNamespace": "Microsoft.Storage/storageAccounts",
						"operator": "GreaterThan",
						"threshold": "0.3",
						"timeAggregation": "Average",
						"dimensions": [],
						"metricValue": 78.09,
						"webTestName": null
					}
				]
			},
			"subscriptionId": "11111111-1111-1111-1111-111111111111",
			"resourceGroupName": "test-RG",
			"resourceName": "test-storageAccount",
			"resourceType": "Microsoft.Storage/storageAccounts",
			"resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Storage/storageAccounts/test-storageAccount",
			"portalLink": "https://portal.azure.com/#resource/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Storage/storageAccounts/test-storageAccount"
		}
	}
}
```

### Log alerts

See sample values for two log alerts.

#### monitoringService = Log Alerts V1 – Metric

**Sample values**

```json
{
  "SubscriptionId": "11111111-1111-1111-1111-111111111111",
  "AlertRuleName": "test-logAlertRule-v1-metricMeasurement",
  "SearchQuery": "Heartbeat | summarize AggregatedValue=count() by bin(TimeGenerated, 5m)",
  "SearchIntervalStartTimeUtc": "2021-11-15T15:16:49Z",
  "SearchIntervalEndtimeUtc": "2021-11-16T15:16:49Z",
  "AlertThresholdOperator": "Greater Than",
  "AlertThresholdValue": 0,
  "ResultCount": 2,
  "SearchIntervalInSeconds": 86400,
  "LinkToSearchResults": "https://portal.azure.com#@aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F11111111-1111-1111-1111-111111111111%2FresourceGroups%2Ftest-RG%2Fproviders%2FMicrosoft.OperationalInsights%2Fworkspaces%2Ftest-logAnalyticsWorkspace%22%7D%5D%7D/q/aBcDeFgHi%2BWqaBcDeFgHiMqsSlVwTE8vSk1PLElNCUvMKU2aBcDeFgHiaBcDeFgHiaBcDeFgHiaBcDeFgHiaBcDeFgHi/prettify/1/timespan/2021-11-15T15%3a16%3a49.0000000Z%2f2021-11-16T15%3a16%3a49.0000000Z",
  "LinkToFilteredSearchResultsUI": "https://portal.azure.com#@aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F11111111-1111-1111-1111-111111111111%2FresourceGroups%2Ftest-RG%2Fproviders%2FMicrosoft.OperationalInsights%2Fworkspaces%2Ftest-logAnalyticsWorkspace%22%7D%5D%7D/q/aBcDeFgHiaBcDeFgHiaBcDeFgHiTP1DtWhcTfIApUfTx0dp%2BOPOhDKsHR%2FFeJXsaBcDeFgHiaBcDeFgHiaBcDeFgHiaBcDeFgHiaBcDeFgHiaBcDeFgHiRI9mhc%3D/prettify/1/timespan/2021-11-15T15%3a16%3a49.0000000Z%2f2021-11-16T15%3a16%3a49.0000000Z",
  "LinkToSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/query?query=Heartbeat%20%0A%7C%20summarize%20AggregatedValue%3Dcount%28%29%20by%20bin%28TimeGenerated%2C%205m%29&timespan=2021-11-15T15%3a16%3a49.0000000Z%2f2021-11-16T15%3a16%3a49.0000000Z",
  "LinkToFilteredSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/query?query=Heartbeat%20%0A%7C%20summarize%20AggregatedValue%3Dcount%28%29%20by%20bin%28TimeGenerated%2C%205m%29%7C%20where%20todouble%28AggregatedValue%29%20%3E%200&timespan=2021-11-15T15%3a16%3a49.0000000Z%2f2021-11-16T15%3a16%3a49.0000000Z",
  "Description": "Alert rule description",
  "Severity": "3",
  "SearchResult": {
    "tables": [
      {
        "name": "PrimaryResult",
        "columns": [
          {
            "name": "TimeGenerated",
            "type": "datetime"
          },
          {
            "name": "AggregatedValue",
            "type": "long"
          }
        ],
        "rows": [
          [
            "2021-11-16T10:56:49Z",
            11
          ],
          [
            "2021-11-16T11:56:49Z",
            11
          ]
        ]
      }
    ],
    "dataSources": [
      {
        "resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourcegroups/test-RG/providers/microsoft.operationalinsights/workspaces/test-logAnalyticsWorkspace",
        "region": "eastus",
        "tables": [
          "Heartbeat"
        ]
      }
    ]
  },
  "WorkspaceId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "ResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.OperationalInsights/workspaces/test-logAnalyticsWorkspace",
  "AlertType": "Metric measurement",
  "Dimensions": []
}
```

#### monitoringService = Log Alerts V1 - Numresults

**Sample values**

```json
{
	"SubscriptionId": "11111111-1111-1111-1111-111111111111",
	"AlertRuleName": "test-logAlertRule-v1-numResults",
	"SearchQuery": "Heartbeat",
	"SearchIntervalStartTimeUtc": "2021-11-15T15:15:24Z",
	"SearchIntervalEndtimeUtc": "2021-11-16T15:15:24Z",
	"AlertThresholdOperator": "Greater Than",
	"AlertThresholdValue": 0,
	"ResultCount": 1,
	"SearchIntervalInSeconds": 86400,
	"LinkToSearchResults": "https://portal.azure.com#@aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F11111111-1111-1111-1111-111111111111%2FresourceGroups%2Ftest-RG%2Fproviders%2FMicrosoft.OperationalInsights%2Fworkspaces%2Ftest-logAnalyticsWorkspace%22%7D%5D%7D/q/aBcDeFgHi%2ABCDE%3D%3D/prettify/1/timespan/2021-11-15T15%3a15%3a24.0000000Z%2f2021-11-16T15%3a15%3a24.0000000Z",
	"LinkToFilteredSearchResultsUI": "https://portal.azure.com#@aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2F11111111-1111-1111-1111-111111111111%2FresourceGroups%2Ftest-RG%2Fproviders%2FMicrosoft.OperationalInsights%2Fworkspaces%2Ftest-logAnalyticsWorkspace%22%7D%5D%7D/q/aBcDeFgHi%2ABCDE%3D%3D/prettify/1/timespan/2021-11-15T15%3a15%3a24.0000000Z%2f2021-11-16T15%3a15%3a24.0000000Z",
	"LinkToSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/query?query=Heartbeat%0A&timespan=2021-11-15T15%3a15%3a24.0000000Z%2f2021-11-16T15%3a15%3a24.0000000Z",
	"LinkToFilteredSearchResultsAPI": "https://api.loganalytics.io/v1/workspaces/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/query?query=Heartbeat%0A&timespan=2021-11-15T15%3a15%3a24.0000000Z%2f2021-11-16T15%3a15%3a24.0000000Z",
	"Description": "Alert rule description",
	"Severity": "3",
	"SearchResult": {
		"tables": [
			{
				"name": "PrimaryResult",
				"columns": [
					{
						"name": "TenantId",
						"type": "string"
					},
					{
						"name": "Computer",
						"type": "string"
					},
					{
						"name": "TimeGenerated",
						"type": "datetime"
					}
				],
				"rows": [
					[
						"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
						"test-computer",
						"2021-11-16T12:00:00Z"
					]
				]
			}
		],
		"dataSources": [
			{
				"resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourcegroups/test-RG/providers/microsoft.operationalinsights/workspaces/test-logAnalyticsWorkspace",
				"region": "eastus",
				"tables": [
					"Heartbeat"
				]
			}
		]
	},
	"WorkspaceId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
	"ResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.OperationalInsights/workspaces/test-logAnalyticsWorkspace",
	"AlertType": "Number of results"
}
```

### Activity log alerts

See sample values for four activity log alerts.

#### monitoringService = Activity Log - Administrative

**Sample values**

```json
{
	"schemaId": "Microsoft.Insights/activityLogs",
	"data": {
		"status": "Activated",
		"context": {
			"activityLog": {
				"authorization": {
					"action": "Microsoft.Compute/virtualMachines/restart/action",
					"scope": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Compute/virtualMachines/test-VM"
				},
				"channels": "Operation",
				"claims": "{}",
				"caller": "user-email@domain.com",
				"correlationId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
				"description": "",
				"eventSource": "Administrative",
				"eventTimestamp": "2021-11-16T08:27:36.1836909+00:00",
				"eventDataId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
				"level": "Informational",
				"operationName": "Microsoft.Compute/virtualMachines/restart/action",
				"operationId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
				"properties": {
					"eventCategory": "Administrative",
					"entity": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Compute/virtualMachines/test-VM",
					"message": "Microsoft.Compute/virtualMachines/restart/action",
					"hierarchy": "22222222-2222-2222-2222-222222222222/CnAIOrchestrationServicePublicCorpprod/33333333-3333-3333-3333-3333333303333/44444444-4444-4444-4444-444444444444/55555555-5555-5555-5555-555555555555/11111111-1111-1111-1111-111111111111"
				},
				"resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Compute/virtualMachines/test-VM",
				"resourceGroupName": "test-RG",
				"resourceProviderName": "Microsoft.Compute",
				"status": "Succeeded",
				"subStatus": "",
				"subscriptionId": "11111111-1111-1111-1111-111111111111",
				"submissionTimestamp": "2021-11-16T08:29:00.141807+00:00",
				"resourceType": "Microsoft.Compute/virtualMachines"
			}
		},
		"properties": {
			"customKey1": "value1",
			"customKey2": "value2"
		}
	}
}
```

#### monitoringService = Service Health

**Sample values**

```json
{
	"schemaId": "Microsoft.Insights/activityLogs",
	"data": {
		"status": "Activated",
		"context": {
			"activityLog": {
				"channels": "Admin",
				"correlationId": "11223344-1234-5678-abcd-aabbccddeeff",
				"description": "This alert rule will trigger when there are updates to a service issue impacting subscription <name>.",
				"eventSource": "ServiceHealth",
				"eventTimestamp": "2021-11-17T05:34:44.5778226+00:00",
				"eventDataId": "12345678-1234-1234-1234-1234567890ab",
				"level": "Warning",
				"operationName": "Microsoft.ServiceHealth/incident/action",
				"operationId": "12345678-abcd-efgh-ijkl-abcd12345678",
				"properties": {
					"title": "Test Action Group - Test Service Health Alert",
					"service": "Azure Service Name",
					"region": "Global",
					"communication": "<p><strong>Summary of impact</strong>:&nbsp;This is the impact summary.</p>\n<p><br></p>\n<p><strong>Preliminary Root Cause</strong>: This is the preliminary root cause.</p>\n<p><br></p>\n<p><strong>Mitigation</strong>:&nbsp;Mitigation description.</p>\n<p><br></p>\n<p><strong>Next steps</strong>: These are the next steps.&nbsp;</p>\n<p><br></p>\n<p>Stay informed about Azure service issues by creating custom service health alerts: <a href=\"https://aka.ms/ash-videos\" rel=\"noopener noreferrer\" target=\"_blank\">https://aka.ms/ash-videos</a> for video tutorials and <a href=\"https://aka.ms/ash-alerts%20for%20how-to%20documentation\" rel=\"noopener noreferrer\" target=\"_blank\">https://aka.ms/ash-alerts for how-to documentation</a>.</p>\n<p><br></p>",
					"incidentType": "Incident",
					"trackingId": "ABC1-DEF",
					"impactStartTime": "2021-11-16T20:00:00.0000000Z",
					"impactMitigationTime": "2021-11-17T01:00:00.0000000Z",
					"impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"Global\"}],\"ServiceName\":\"Azure Service Name\"}]",
					"impactedServicesTableRows": "<tr>\r\n<td align='center' style='padding: 5px 10px; border-right:1px solid black; border-bottom:1px solid black'>Azure Service Name</td>\r\n<td align='center' style='padding: 5px 10px; border-bottom:1px solid black'>Global<br></td>\r\n</tr>\r\n",
					"defaultLanguageTitle": "Test Action Group - Test Service Health Alert",
					"defaultLanguageContent": "<p><strong>Summary of impact</strong>:&nbsp;This is the impact summary.</p>\n<p><br></p>\n<p><strong>Preliminary Root Cause</strong>: This is the preliminary root cause.</p>\n<p><br></p>\n<p><strong>Mitigation</strong>:&nbsp;Mitigation description.</p>\n<p><br></p>\n<p><strong>Next steps</strong>: These are the next steps.&nbsp;</p>\n<p><br></p>\n<p>Stay informed about Azure service issues by creating custom service health alerts: <a href=\"https://aka.ms/ash-videos\" rel=\"noopener noreferrer\" target=\"_blank\">https://aka.ms/ash-videos</a> for video tutorials and <a href=\"https://aka.ms/ash-alerts%20for%20how-to%20documentation\" rel=\"noopener noreferrer\" target=\"_blank\">https://aka.ms/ash-alerts for how-to documentation</a>.</p>\n<p><br></p>",
					"stage": "Resolved",
					"communicationId": "11223344556677",
					"isHIR": "false",
					"isSynthetic": "True",
					"impactType": "SubscriptionList",
					"version": "0.1.1"
				},
				"status": "Resolved",
				"subscriptionId": "11111111-1111-1111-1111-111111111111",
				"submissionTimestamp": "2021-11-17T01:23:45.0623172+00:00"
			}
		},
		"properties": {
			"customKey1": "value1",
			"customKey2": "value2"
		}
	}
}
```

#### monitoringService = Resource Health

**Sample values**

```json
{
	"schemaId": "Microsoft.Insights/activityLogs",
	"data": {
		"status": "Activated",
		"context": {
			"activityLog": {
				"channels": "Admin, Operation",
				"correlationId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
				"eventSource": "ResourceHealth",
				"eventTimestamp": "2021-11-16T09:50:20.406+00:00",
				"eventDataId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
				"level": "Informational",
				"operationName": "Microsoft.Resourcehealth/healthevent/Activated/action",
				"operationId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
				"properties": {
					"title": "Rebooted by user",
					"details": null,
					"currentHealthStatus": "Unavailable",
					"previousHealthStatus": "Available",
					"type": "Downtime",
					"cause": "UserInitiated"
				},
				"resourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/test-RG/providers/Microsoft.Compute/virtualMachines/test-VM",
				"resourceGroupName": "test-RG",
				"resourceProviderName": "Microsoft.Resourcehealth/healthevent/action",
				"status": "Active",
				"subscriptionId": "11111111-1111-1111-1111-111111111111",
				"submissionTimestamp": "2021-11-16T09:54:08.5303319+00:00",
				"resourceType": "MICROSOFT.COMPUTE/VIRTUALMACHINES"
			}
		},
		"properties": {
			"customKey1": "value1",
			"customKey2": "value2"
		}
	}
}
```

#### monitoringService = Actual Cost Budget or Forecasted Budget

**Sample values**

```json
{
  "schemaId": "AIP Budget Notification",
  "data": {
    "SubscriptionName": "test-subscription",
    "SubscriptionId": "11111111-1111-1111-1111-111111111111",
    "EnrollmentNumber": "",
    "DepartmentName": "test-budgetDepartmentName",
    "AccountName": "test-budgetAccountName",
    "BillingAccountId": "",
    "BillingProfileId": "",
    "InvoiceSectionId": "",
    "ResourceGroup": "test-RG",
    "SpendingAmount": "1111.32",
    "BudgetStartDate": "2023-01-20T23:49:40.216Z",
    "Budget": "10000",
    "Unit": "USD",
    "BudgetCreator": "email@domain.com",
    "BudgetName": "test-budgetName",
    "BudgetType": "Cost",
    "NotificationThresholdAmount": "8000.0"
  }
}
```
