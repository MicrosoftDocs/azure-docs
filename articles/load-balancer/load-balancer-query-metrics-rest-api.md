---
title: Retrieve metrics with the REST API
titleSuffix: Azure Load Balancer
description: In this article, get started using the Azure REST APIs to collect health and usage metrics for Azure Load Balancer.
services: sql-database
author: asudbring
manager: KumudD
ms.service: load-balancer
ms.custom: REST, seodec18
ms.topic: article
ms.date: 11/19/2019
ms.author: allensu
---

# Get Load Balancer usage metrics using the REST API

Collect the number of bytes processed by a [Standard Load Balancer](/azure/load-balancer/load-balancer-standard-overview) for an interval of time using the [Azure REST API](/rest/api/azure/).

Complete reference documentation and additional samples for the REST API are available in the [Azure Monitor REST reference](/rest/api/monitor). 

## Build the request

Use the following GET request to collect the [ByteCount metric](/azure/load-balancer/load-balancer-standard-diagnostics#multi-dimensional-metrics) from a Standard Load Balancer. 

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=ByteCount&timespan=2018-06-05T03:00:00Z/2018-06-07T03:00:00Z
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
| resourceGroupName | The name of the resource group that contains the resource. You can obtain this value from the Azure Resource Manager API, CLI, or the portal. |
| loadBalancerName | The name of the Azure Load Balancer. |
| metric names | Comma-separated list of valid  [Load Balancer metrics](/azure/load-balancer/load-balancer-standard-diagnostics). |
| api-version | The API version to use for the request.<br /><br /> This document covers api-version `2018-01-01`, included in the above URL.  |
| timespan | The timespan of the query. It's a string with the following format `startDateTime_ISO/endDateTime_ISO`. This optional parameter is set to return a day's worth of data in the example. |
| &nbsp; | &nbsp; |

### Request body

No request body is needed for this operation.

## Handle the response

Status code 200 is returned when the list of metric values is returned successfully. A full list of error codes is available in the [reference documentation](/rest/api/monitor/metrics/list#errorresponse).

## Example response 

```json
{
	"cost": 0,
	"timespan": "2018-06-05T03:00:00Z/2018-06-07T03:00:00Z",
	"interval": "PT1M",
	"value": [
		{
			"id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}/providers/Microsoft.Insights/metrics/ByteCount",
			"type": "Microsoft.Insights/metrics",
			"name": {
				"value": "ByteCount",
				"localizedValue": "Byte Count"
			},
			"unit": "Count",
			"timeseries": [
				{
					"metadatavalues": [],
					"data": [
						{
							"timeStamp": "2018-06-06T17:24:00Z",
							"total": 1067921034.0
						},
						{
							"timeStamp": "2018-06-06T17:25:00Z",
							"total": 0.0
						},
						{
							"timeStamp": "2018-06-06T17:26:00Z",
							"total": 3781344.0
						},
					]
				}
			]
		}
	],
	"namespace": "Microsoft.Network/loadBalancers",
	"resourceregion": "eastus"
}
```
