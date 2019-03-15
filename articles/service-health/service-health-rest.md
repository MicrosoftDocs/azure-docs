---
title: Get Azure resource health events using the REST API | Microsoft Docs
description: Use the Azure REST APIs to get the health events for your Azure resources.
author: stephbaron 
ms.author: stbaron
ms.service: service-health
ms.custom: REST
ms.topic: article
ms.date: 06/06/2017

---

# Get Resource Health using the REST API 

This example article shows how to retrieve a list of health events for the Azure resources in your subscription using the [Azure REST API](/rest/api/azure/).

Complete reference documentation and additional samples for the REST API are available in the [Azure Monitor REST reference](/rest/api/monitor). 

## Build the request

Use the following `GET` HTTP request to list the health events for your subscription for the range of time between `2018-05-16` and `2018-06-20`.

```http
https://management.azure.com/subscriptions/{subscription-id}/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&%24filter=eventTimestamp%20ge%20'2018-05-16T04%3A36%3A37.6407898Z'%20and%20eventTimestamp%20le%20'2018-06-20T04%3A36%3A37.6407898Z'
```

### Request headers

The following headers are required: 

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` [access token](/rest/api/azure/#authorization-code-grant-interactive-clients). |  

### URI parameters

| Name | Description |
| :--- | :---------- |
| subscriptionId | The subscription ID that identifies an Azure subscription. If you have multiple subscriptions, see [Working with multiple subscriptions](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest). |
| api-version | The API version to use for the request.<br /><br /> This document covers api-version `2015-04-01`, included in the above URL.  |
| $filter | The filtering option to reduce the set of returned results. The allowable patterns for this parameter are available [in the reference for the Activity Logs operation](/rest/api/monitor/activitylogs/list#uri-parameters). The example shown captures all events in a time range between 2018-05-16 and 2018-06-20 |
| &nbsp; | &nbsp; |

### Request body

No request body is needed for this operation.

## Handle the response

Status code 200 is returned with a list of health event values corresponding to the filter parameter, along with a `nextlink` URI to retrieve the next page of results.

## Example response 

```json
{
  "value": [
    {
      "correlationId": "1e121103-0ba6-4300-ac9d-952bb5d0c80f",
      "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
      },
      "id": "/subscriptions/{subscription-id}/resourceGroups/MSSupportGroup/providers/microsoft.support/supporttickets/115012112305841/events/44ade6b4-3813-45e6-ae27-7420a95fa2f8/ticks/635574752669792776",
      "resourceGroupName": "MSSupportGroup",
      "resourceProviderName": {
        "value": "microsoft.support",
        "localizedValue": "microsoft.support"
      },
      "operationName": {
        "value": "microsoft.support/supporttickets/write",
        "localizedValue": "microsoft.support/supporttickets/write"
      },
      "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
      },
      "eventTimestamp": "2015-01-21T22:14:26.9792776Z",
      "submissionTimestamp": "2015-01-21T22:14:39.9936304Z",
      "level": "Informational"
    }
  ],
  "nextLink": "https://management.azure.com/########-####-####-####-############$skiptoken=######"
}
```
