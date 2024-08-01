---
title: Monitor Azure Bastion
description: Start here to learn how to monitor Azure Bastion by using Azure Monitor. Learn about available metrics and logs.
ms.date: 08/02/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: cherylmc
ms.author: cherylmc
ms.service: azure-bastion
---

# Monitor Azure Bastion

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Bastion, see [Azure Bastion monitoring data reference](monitor-bastion-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Bastion, see [Azure Bastion monitoring data reference](monitor-bastion-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure Bastion, see [Azure Bastion monitoring data reference](monitor-bastion-reference.md#resource-logs).

An example entry of successful login from a downloaded json file is shown below for reference:

```json
{ 
"time":"2019-10-03T16:03:34.776Z",
"resourceId":"/SUBSCRIPTIONS/<subscripionID>/RESOURCEGROUPS/MYBASTION/PROVIDERS/MICROSOFT.NETWORK/BASTIONHOSTS/MYBASTION-BASTION",
"operationName":"Microsoft.Network/BastionHost/connect",
"category":"BastionAuditLogs",
"level":"Informational",
"location":"eastus",
"properties":{ 
   "userName":"<username>",
   "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
   "clientIpAddress":"131.107.159.86",
   "clientPort":24039,
   "protocol":"ssh",
   "targetResourceId":"/SUBSCRIPTIONS/<subscripionID>/RESOURCEGROUPS/MYBASTION/PROVIDERS/MICROSOFT.COMPUTE/VIRTUALMACHINES/LINUX-KEY",
   "subscriptionId":"<subscripionID>",
   "message":"Successfully Connected.",
   "resourceType":"VM",
   "targetVMIPAddress":"172.16.1.5",
   "userEmail":"<userAzureAccountEmailAddress>",
   "tunnelId":"<tunnelID>"
},
"FluentdIngestTimestamp":"2019-10-03T16:03:34.0000000Z",
"Region":"eastus",
"CustomerSubscriptionId":"<subscripionID>"
}
```

The following example entry shows an unsuccessful login, such as due to an incorrect username or password:

```json
{ 
"time":"2019-10-03T16:03:34.776Z",
"resourceId":"/SUBSCRIPTIONS/<subscripionID>/RESOURCEGROUPS/MYBASTION/PROVIDERS/MICROSOFT.NETWORK/BASTIONHOSTS/MYBASTION-BASTION",
"operationName":"Microsoft.Network/BastionHost/connect",
"category":"BastionAuditLogs",
"level":"Informational",
"location":"eastus",
"properties":{ 
   "userName":"<username>",
   "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
   "clientIpAddress":"131.107.159.86",
   "clientPort":24039,
   "protocol":"ssh",
   "targetResourceId":"/SUBSCRIPTIONS/<subscripionID>/RESOURCEGROUPS/MYBASTION/PROVIDERS/MICROSOFT.COMPUTE/VIRTUALMACHINES/LINUX-KEY",
   "subscriptionId":"<subscripionID>",
   "message":"Login Failed",
   "resourceType":"VM",
   "targetVMIPAddress":"172.16.1.5",
   "userEmail":"<userAzureAccountEmailAddress>",
   "tunnelId":"<tunnelID>"
},
"FluentdIngestTimestamp":"2019-10-03T16:03:34.0000000Z",
"Region":"eastus",
"CustomerSubscriptionId":"<subscripionID>"
}
```

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Bastion alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Bastion monitoring data reference](monitor-bastion-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Bastion monitoring data reference](monitor-bastion-reference.md) for a reference of the metrics, logs, and other important values created for Azure Bastion.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
