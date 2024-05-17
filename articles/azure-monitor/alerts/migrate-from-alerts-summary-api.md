---
title: Use ARG queries to get a summary of your alerts
description: Find out how to se ARG queries to migrate from the Azure Monitor alertsSummary API, which is being deprecated.
ms.topic: how-to
ms.date: 03/13/2024
ms.author: abbyweisberg
ms.reviewer: nolavime
---

# Use ARG queries to get a summary of your alerts

Azure Resource Graph queries allow you to query your Azure data and can be used to get information about your Azure monitor alerts.

The [alertsSummary API](/rest/api/monitor/alertsmanagement/alerts/get-summary) is being deprecated as of September 30,2026. Instead of the alertsSummary API, you can use Azure Resource Graph queries to get the same information.

Azure Resource Graph queries provide more functionality than the alertsSummary API, including: 
* The ability to add new fields to the query that returns the alert summary.  
* More flexibility in the query that returns the alert summary. 

## Current implementation of the alertsSummary API

This is the format for the calling the alertsSummary API:

  `GET https://management.azure.com/subscriptions/{subId}/providers/Microsoft.AlertsManagement/alertsSummary?groupby=severity,alertState&api-version=2019-03-01`

Response: AlertSummary_Sev_Alertstate 

This is an example of the output from the alertsSummary API:

```json
{
  "totalRecords": 2,
  "count": 2,
  "data": {
    "columns": [
      {"name": "Severity",
        "type": "string"
      },
      {"name": "AlertState",
        "type": "string"
      },
      {
       "name": "AlertsCount",
       "type": "integer"
      }
    ],
    "rows": [
      [
       "Sev2",
       "New",
        2
      ],
      [
       "Sev1",
        "New",
        8
      ]
      ]
},
"facets": [],
"resultTruncated": false
}
```

## Use the Azure Resource Graph queries for Azure Monitor alerts

Use these Azure Resource Graph queries instead of the alertsSummary API call to retrieve alert information, or use these queries as a basis for designing your own queries.

- [List Azure Monitor alerts ordered by severity](../../governance/resource-graph/samples/starter.md#list-azure-monitor-alerts-ordered-by-severity)
- [List Azure Monitor alerts ordered by severity and alert state](../../governance/resource-graph/samples/starter.md#list-azure-monitor-alerts-ordered-by-severity-and-alert-state)
- [List Azure Monitor alerts ordered by severity, monitor service, and target resource type](../../governance/resource-graph/samples/starter.md#list-azure-monitor-alerts-ordered-by-severity-monitor-service-and-target-resource-type)
 
 This is an example of the output from the Azure Resource Graph query:

```json
{
"properties":{
  "groupedBy": "severity",
  "smartGroupsCount": 100,
  "total": 9692,
  "values": [
    {
        "name": "Sev0",
        "count": 6517,
        "groupedby": "alertState",
        "values": [
            {
                "name": "New",
                "count": 6517
            },
            {
                "name": "Acknowledged",
                "count": 0
            },
            {
                "name": "Closed",
                "count": 0
            }
        ]
    },
    {
        "name": "Sev1",
        "count": 3175,
        "groupedby": "alertState",
        "values": [
            {
                "name": "New",
                "count": 3175
            },
            {
                "name": "Acknowledged",
                "count": 0
            },
            {
                "name": "Closed",
                "count": 0
            }
        ]
    },
    ]
}
},
"id": "/subscriptions/1a2b3c4d-123a-1234-a12b-a1b2c34d5e6f/providers/Microsoft.AlertsManagement/alertsSummary/current",
"type": "Microsoft.AlertsManagement/alertsSummary",
"name": "current"

```
