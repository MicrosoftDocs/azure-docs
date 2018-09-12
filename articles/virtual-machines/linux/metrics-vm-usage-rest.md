---
title: Get Azure Virtual Machine usage data using the REST API | Microsoft Docs
description: Use the Azure REST APIs to collect utilization metrics for a Virtual Machine.
services: virtual-machines
author: rloutlaw
ms.reviewer: routlaw
manager: jeconnoc
ms.service: load-balancer
ms.custom: REST
ms.topic: article
ms.date: 06/13/2018
ms.author: routlaw
---

# Get Virtual Machine usage metrics using the REST API

This example shows how to retrieve the CPU usage for a [Linux Virtual Machine](https://docs.microsoft.com/azure/virtual-machines/linux/monitor) using the [Azure REST API](/rest/api/azure/).

Complete reference documentation and additional samples for the REST API are available in the [Azure Monitor REST reference](/rest/api/monitor). 

## Build the request

Use the following GET request to collect the [Percentage CPU metric](/azure/monitoring-and-diagnostics/monitoring-supported-metrics#microsoftcomputevirtualmachines) from a Virtual Machine

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmname}/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU&timespan=2018-06-05T03:00:00Z/2018-06-07T03:00:00Z
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
| subscriptionId | The subscription ID that identifies an Azure subscription. If you have multiple subscriptions, see [Working with multiple subscriptions](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#working-with-multiple-subscriptions). |
| resourceGroupName | The name of the Azure resource group associated with the resource. You can get this value from the Azure Resource Manager API, CLI, or the portal. |
| vmname | The name of the Azure Virtual Machine. |
| metricnames | Comma-separated list of valid  [Load Balancer metrics](/azure/load-balancer/load-balancer-standard-diagnostics). |
| api-version | The API version to use for the request.<br /><br /> This document covers api-version `2018-01-01`, included in the above URL.  |
| timespan | String with the following format `startDateTime_ISO/endDateTime_ISO` that defines the time range of the returned metrics. This optional parameter is set to return a day's worth of data in the example. |
| &nbsp; | &nbsp; |

### Request body

No request body is needed for this operation.

## Handle the response

Status code 200 is returned when the list of metric values is returned successfully. A full list of error codes is available in the [reference documentation](/rest/api/monitor/metrics/list#errorresponse).

## Example response 

```json
{
	"cost": 0,
	"timespan": "2018-06-08T23:48:10Z/2018-06-09T00:48:10Z",
	"interval": "PT1M",
	"value": [
		{
			"id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmname}/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU",
			"type": "Microsoft.Insights/metrics",
			"name": {
				"value": "Percentage CPU",
				"localizedValue": "Percentage CPU"
			},
			"unit": "Percent",
			"timeseries": [
				{
					"metadatavalues": [],
					"data": [
						{
							"timeStamp": "2018-06-08T23:48:00Z",
							"average": 0.44
						},
						{
							"timeStamp": "2018-06-08T23:49:00Z",
							"average": 0.31
						},
						{
							"timeStamp": "2018-06-08T23:50:00Z",
							"average": 0.29
						},
						{
							"timeStamp": "2018-06-08T23:51:00Z",
							"average": 0.29
						},
						{
							"timeStamp": "2018-06-08T23:52:00Z",
							"average": 0.285
						} ]
                } ]
        } ]
}
```