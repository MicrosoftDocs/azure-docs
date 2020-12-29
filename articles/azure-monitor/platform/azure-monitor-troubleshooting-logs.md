---
title: Azure Monitor Troubleshooting logs
description: Use Azure Monitor to quickly and/or periodically investigate issues, troubleshoot code or configuration problems or address support cases, which often rely upon searching over high volume of data for specific insights.
author: osalzberg
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 12/29/2020

---

# Azure Monitor Troubleshooting logs (Preview)
Use Azure Monitor to quickly and/or periodically investigate issues, troubleshoot code or configuration problems or address support cases, which often rely upon searching over high volume of data for specific insights.

## Troubleshoot and query your code or configuration issues
Use Azure monitor troubleshooting logs to fetch your records and investigate problems and issues using a more simpler and cheaper way using KQL.

The service allows you to join analytics docs on supported tables with a free retention period.

> [!NOTE]
>* Troubleshooting logs can be applied to specific tables, currently on "Container Logs" and "App Traces" tables.
>* There is a 4 days free retention period, can be extended in addition cost.
> * Troubleshooting logs is in preview mode.
>* Contact the [CM team](mailto:XXXXXXX@microsoft.com) with any questions or to apply the feature.

## Check if the Troubleshooting logs feature is enabled for a given table
To check whether the troubleshooting log is enabled for a given table, you can use the following API call.

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

```
## Check if the Troubleshooting logs feature is enabled for all of the tables in a workspace
To check which tables have the troubleshooting log enabled, you can use the following API call.

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

## Add Troubleshooting logs to your tables

To enable troubleshooting logs in your workspace, you need to use the following API call.
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
>[!TIP]
>* You can use any REST API tool to run the commands. [Read More](https://docs.microsoft.com/rest/api/azure/)
>* You need to use the Bearer token for authentication. [Read More](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx)

>[!NOTE]
>* The isTroubleshootingAllowed flag – describes if the table is allowed in the service
>* The isTroubleshootEnabled indicates if the feature is enabled for the table - can be switched on or off (true or false)
>* When disabling the isTroubleshootEnabled flag for a specific table, re-enabling it is possible only one week after the prior enable date.
>* Currently this is supported only for tables under PerGB2018 SKU (some other SKUs will also be supported in the future).
## Next steps
* [Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)


