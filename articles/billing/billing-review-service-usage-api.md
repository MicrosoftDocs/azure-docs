---
title: Review Azure service resource usage with REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review Azure service resource usage.
services: billing
documentationcenter: na
author: lleonard-msft
manager: 
editor: ''
ms.service: cost-management-billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/01/2019
ms.author: banders

# As an administrator or developer, I want to use REST APIs to review resource and service usage data under my control.

---

# Review Azure resource usage using the REST API

Azure Cost Management APIs help you review and manage consumption of your Azure resources.

In this article, you learn how to create a daily report that will generate a comma-separated value document with your hourly usage information, and then how to use filters to customize the report so that you can query the usage of virtual machines, databases, and tagged resources in an Azure resource group.

>[!NOTE]
> The Cost Management API is currently in private preview.

## Create a basic cost management report

Use the `reports` operation in the Cost Management API to define how the cost reporting is generated and where the reports will be published to.

```http
https://management.azure.com/subscriptions/{subscriptionGuid}/providers/Microsoft.CostManagement/reports/{reportName}?api-version=2018-09-01-preview
Content-Type: application/json   
Authorization: Bearer
```

The `{subscriptionGuid}` parameter is required and should contain a subscription ID that can be read using the credentials provided in the API token. The `{reportName}`

The following headers are required: 

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*| Required. Set to `application/json`. |  
|*Authorization:*| Required. Set to a valid `Bearer` token. |

Configure the parameters of the report in the HTTP request body. In the example below, the report is set to generate every day when active, is a CSV file written to an Azure Storage blob container, and contains hourly cost information for all resources in resource group `westus`.

```json
{
    "properties": {
        "schedule": {
            "status": "Inactive",
            "recurrence": "Daily",
            "recurrencePeriod": {
                "from": "2018-08-21",
                "to": "2019-10-31"
            }
        },
        "deliveryInfo": {
            "destination": {
                "resourceId": "/subscriptions/{subscriptionGuid}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}",
                "container": "MyReportContainer",
                "rootFolderPath": "MyScheduleTest"
            }
        },
        "format": "Csv",
        "definition": {
            "type": "Usage",
            "timeframe": "MonthToDate",
            "dataSet": {
                "granularity": "Hourly",
                "filter": {
                    "dimensions": {
                        "name": "ResourceLocation",
                        "operator": "In",
                        "values": [
                            "westus"
                        ]
                    }
                }
            }
        }
    }
}
```

The

## Filtering reports

The `filter` and `dimensions` section of the request body when creating a report let you focus in on the costs for specific resource types. The previous request body shows how to filter by all resources in a region. 

### Get all compute usage

Use the `ResourceType` dimension to report Azure virtual machine costs in your subscription across all regions.

```json
"filter": {
    "dimensions": {
        "name": "ResourceType",
        "operator": "In",
        "values": [
                "Microsoft.ClassicCompute/virtualMachines", 
                "Microsoft.Compute/virtualMachines"
        ] 
    }
}
```

### Get all database usage

Use the `ResourceType` dimension to report Azure SQL Database costs in your subscription across all regions.

```json
"filter": {
    "dimensions": {
        "name": "ResourceType",
        "operator": "In",
        "values": [
                "Microsoft.Sql/servers"
        ] 
    }
}
```

### Report on specific instances

The `Resource` dimension lets you report costs for specific resources.

```json
"filter": {
    "dimensions": {
        "name": "Resource",
        "operator": "In",
        "values": [
            "subscriptions/{subscriptionGuid}/resourceGroups/{resourceGroup}/providers/Microsoft.ClassicCompute/virtualMachines/{ResourceName}"
        ]
    }
}
```

### Changing timeframes

Set the `timeframe` definition to `Custom` to set a timeframe outside of the  week to date and month to date built-in options.

```json
"timeframe": "Custom",
"timePeriod": {
    "from": "2017-12-31T00:00:00.000Z",
    "to": "2018-12-30T00:00:00.000Z"
}
```

## Next steps
- [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)   
