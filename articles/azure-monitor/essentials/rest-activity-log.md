---
title: Retrieve activity log data using Azure monitor REST API
description: How to retrieve activity log data using Azure monitor REST API.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 03/10/2024
ms.reviewer: priyamishra

# customer intent: As a developer, I want to learn how to retrieve activity log data using Azure monitor REST API.
---

# Retrieve activity log data using Azure monitor REST API

The Azure Activity Log is a log that provides insight into operations performed on resources in your subscription. Operations include create, update, delete, and other actions taken on resources. The Activity Log is a platform-wide log and isn't limited to a particular service. This article explains how to retrieve activity log data using the Azure Monitor REST API. For more information about the activity log, see [Azure Activity Log event schema](/azure/azure-monitor/essentials/activity-log-schema).


## Authentication

To retrieve resource logs, you must authenticate with Microsoft Entra. For more information, see [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough?tabs=powershell#authenticate-azure-monitor-requests).

## Retrieve activity log data

Use the Azure Monitor REST API to query [activity log](/rest/api/monitor/activitylogs) data. 

The following request format is used to request activity log data.

```curl 
GET /subscriptions/<subscriptionId>/providers/Microsoft.Insights/eventtypes/management/values \
?api-version=2015-04-01 \
&$filter=<filter> \
&$select=<select>
host: management.azure.com
authorization: Bearer <token>
```

### $filter
`$filter` reduces the set of data collected. This argument is required and it also requires at least the start date/time.
The `$filter` argument accepts the following patterns:
- List events for a resource group: `$filter=eventTimestamp ge '2014-07-16T04:36:37.6407898Z' and eventTimestamp le '2014-07-20T04:36:37.6407898Z' and resourceGroupName eq <resourceGroupName>`.
- List events for a specific resource: `$filter=eventTimestamp ge '2014-07-16T04:36:37.6407898Z' and eventTimestamp le '2014-07-20T04:36:37.6407898Z' and resourceUri eq <resourceURI>`.
- List events for a subscription in a time range: `$filter=eventTimestamp ge '2014-07-16T04:36:37.6407898Z' and eventTimestamp le '2014-07-20T04:36:37.6407898Z'`.
- List events for a resource provider: `$filter=eventTimestamp ge '2014-07-16T04:36:37.6407898Z' and eventTimestamp le '2014-07-20T04:36:37.6407898Z' and resourceProvider eq <resourceProviderName>`.
- List events for a correlation ID:` $filter=eventTimestamp ge '2014-07-16T04:36:37.6407898Z' and eventTimestamp le '2014-07-20T04:36:37.6407898Z' and correlationId eq '<correlationID>`.


### $select
`$select` fetches a specified list of properties for the returned events.
The `$select` argument is a comma separated list of property names to be returned. 
Valid values are: 
`authorization`, `claims`, `correlationId`, `description`, `eventDataId`, `eventName`, `eventTimestamp`, `httpRequest`, `level`, `operationId`, `operationName`, `properties`, `resourceGroupName`, `resourceProviderName`, `resourceId`, `status`, `submissionTimestamp`, `subStatus`, and `subscriptionId`.

The following sample requests use the Azure Monitor REST API to query an activity log.
### Get activity logs with filter:

The following example gets the activity logs for resource group `MSSupportGroup` between the dates `2023-03-21T20:00:00Z` and `2023-03-24T20:00:00Z`

``` HTTP
GET https://management.azure.com/subscriptions/12345678-abcd-98765432-abcdef012345/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '2023-03-21T20:00:00Z' and eventTimestamp le '2023-03-24T20:00:00Z' and resourceGroupName eq 'MSSupportGroup'
```
### Get activity logs with filter and select:

The following example gets the activity logs for resource group `MSSupportGroup`, between the dates `2023-03-21T20:00:00Z` and `2023-03-24T20:00:00Z`, returning the elements eventName, operationName, status, eventTimestamp, correlationId, submissionTimestamp, and level.

```HTTP
GET https://management.azure.com/subscriptions/12345678-abcd-98765432-abcdef012345/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '2023-03-21T20:00:00Z' and eventTimestamp le '2023-03-24T20:00:00Z'and resourceGroupName eq 'MSSupportGroup'&$select=eventName,operationName,status,eventTimestamp,correlationId,submissionTimestamp,level
```

## Next steps
[Stream Azure Monitor activity log data](/azure/azure-monitor/essentials/activity-log).
[Azure Activity Log event schema](/azure/azure-monitor/essentials/activity-log-schema).

