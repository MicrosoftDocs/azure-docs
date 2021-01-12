---
title: Azure Monitor Troubleshooting logs (Preview)
description: Use Azure Monitor to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases, which often rely upon searching over high volume of data for specific insights.
author: osalzberg
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 12/29/2020

---

# Azure Monitor Troubleshooting logs (Preview)
Use Azure Monitor to quickly and/or periodically investigate issues, troubleshoot code or configuration problems or address support cases, which often rely upon searching over high volume of data for specific insights.

>[!NOTE]
> * Troubleshooting Logs is in preview mode.
>* Contact the [Log Analytics team](mailto:orens@microsoft.com) with any questions or to apply the feature.
## Troubleshoot and query your code or configuration issues
Use Azure Monitor Troubleshooting Logs to fetch your records and investigate problems and issues in a simpler and cheaper way using KQL.
Troubleshooting Logs decrees your charges by giving you basic capabilities for troubleshooting.

> [!NOTE]
>* The decision for troubleshooting mode is configurable.
>* Troubleshooting Logs can be applied to specific tables, currently on "Container Logs" and "App Traces" tables.
>* There is a 4 days free retention period, can be extended in addition cost.
>* By default, the tables inherits the workspace retention. To avoid additional charges, it is recommended to change these tables retention. [Click here to learn how to change table retention](https://docs.microsoft.com//azure/azure-monitor/platform/manage-cost-storage).

## Turn on Troubleshooting Logs on your tables

To turn on Troubleshooting Logs in your workspace, you need to use the following API call.
```http
PUT https://PortalURL/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}

(With body in the form of a GET single table request response)

Response:

{
        "properties": {
          "retentionInDays": 40,
          "isTroubleshootingAllowed": true,
          "isTroubleshootEnabled": true
        },
        "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}",
        "name": "{tableName}"
}
```
## Check if the Troubleshooting logs feature is enabled for a given table
To check whether the Troubleshooting Log is enabled for a given table, you can use the following API call.

```http
GET https://PortalURL/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}

Response: 
"properties": {
          "retentionInDays": 30,
          "isTroubleshootingAllowed": true,
          "isTroubleshootEnabled": true,
          "lastTroubleshootDate": "Thu, 19 Nov 2020 07:40:51 GMT"
        },
        "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/{tableName}",
        "name": " {tableName}"
                }

```
## Check if the Troubleshooting logs feature is enabled for all of the tables in a workspace
To check which tables have the Troubleshooting Log enabled, you can use the following API call.

```http
GET "https://PortalURL/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables"

Response: 
{
          "properties": {
            "retentionInDays": 30,
            "isTroubleshootingAllowed": true,
            "isTroubleshootEnabled": true,
            "lastTroubleshootDate": "Thu, 19 Nov 2020 07:40:51 GMT"
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table1",
          "name": "table1"
 },
        {
          "properties": {
            "retentionInDays": 7,
            "isTroubleshootingAllowed": true
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table2",
          "name": "table2"
        },
        {
          "properties": {
            "retentionInDays": 7,
            "isTroubleshootingAllowed": false
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table3",
          "name": "table3"
        }
```
## Turn off Troubleshooting Logs on your tables

To turn off Troubleshooting Logs in your workspace, you need to use the following API call.
```http
PUT https://PortalURL/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}

(With body in the form of a GET single table request response)

Response:

{
        "properties": {
          "retentionInDays": 40,
          "isTroubleshootingAllowed": true,
          "isTroubleshootEnabled": false
        },
        "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}",
        "name": "{tableName}"
}
```
>[!TIP]
>* You can use any REST API tool to run the commands. [Read More](https://docs.microsoft.com/rest/api/azure/)
>* You need to use the Bearer token for authentication. [Read More](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx)

>[!NOTE]
>* The "isTroubleshootingAllowed" flag – describes if the table is allowed in the service
>* The "isTroubleshootEnabled" indicates if the feature is enabled for the table - can be switched on or off (true or false)
>* When disabling the "isTroubleshootEnabled" flag for a specific table, re-enabling it is possible only one week after the prior enable date.
>* Currently this is supported only for tables under (some other SKUs will also be supported in the future) - [Read more about pricing](https://docs.microsoft.com/services-hub/health/azure_pricing).

## Query limitations for Troubleshooting
There are few limitations for a table that is marked as "Troubleshooting Logs":
*	Will get less processing resources and therefore, will not be suitable for large dashboards, complex analytics, or many concurrent API calls.
*	Queries are limited to a time range of two days.
* purging will not work – [Read more about purge](https://docs.microsoft.com/rest/api/loganalytics/workspacepurge/purge).
* Alerts are not supported through this service.
## Next steps
* [Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)


