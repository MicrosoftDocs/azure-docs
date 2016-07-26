<properties
	pageTitle="Logic App limits and configuration | Microsoft Azure"
	description="Overview of the service limits and configuration values available for Logic Apps."
	services="app-service\logic"
	documentationCenter=".net,nodejs,java"
	authors="jeffhollan"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2016"
	ms.author="jehollan"/>

# Logic App limits and configuration

Below are information on the current limits and configuration details for Azure Logic Apps.

## Limits

### HTTP request limits

These are limits for a single HTTP request and/or connector call

#### Timeout

|Name|Limit|Notes|
|----|----|----|
|Request Timeout|1 Minute|An [async pattern](app-service-logic-create-api-app.md) or [until loop](app-service-logic-loops-and-scopes.md) can compensate as needed|

#### Message size

|Name|Limit|Notes|
|----|----|----|
|Message size|50 MB|Some connectors and APIs may not support 50MB.  Request trigger supports up to 25MB|
|Expression evaluation limit|131,072 characters|`@concat()`, `@base64()`, `string` cannot be longer than this|

#### Retry policy

|Name|Limit|Notes|
|----|----|----|
|Retry attempts|4|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|
|Retry max delay|1 hour|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|
|Retry min delay|20 min|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|

### Run duration and retention

These are the limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|Run duration|90 days||
|Storage retention|90 days|This is from the run start time|
|Min recurrence interval|15 sec||
|Max recurrence interval|500 days||


### Looping and debatching limits

These are limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|ForEach items|10,000|You can use the [query action](../connectors/connectors-native-query.md) to filter larger arrays as needed|
|Until iterations|10,000||
|SplitOn items|10,000||
|ForEach Parallelism|20|You can set to a sequential foreach by adding `"operationOptions": "Sequential"` to the `foreach` action|


### Throughput limits

These are limits for a single logic app instance. 

|Name|Limit|Notes|
|----|----|----|
|Triggers per second|100|Can distribute workflows across multiple apps as needed|

### Definition limits

These are limits for a single logic app definition.

|Name|Limit|Notes|
|----|----|----|
|Actions in ForEach|1|You can add nested workflows to extend this as needed|
|Actions per workflow|60|You can add nested workflows to extend this as needed|
|Allowed action nesting depth|5|You can add nested workflows to extend this as needed|
|Flows per region per subscription|1000||
|Triggers per workflow|10||
|Max characters per expression|8,192||
|Max `trackedProperties` size in characters|16,000|
|`action`/`trigger` name limit|80||
|`description` length limit|256||
|`parameters` limit|50||
|`outputs` limit|10||

## Configuration

### IP Address

Calls made from a [connector](../connectors/apis-list.md) will come from the IP Address specified below.

Calls made from a logic app directly (i.e. via [HTTP](../connectors/connectors-native-http.md) or [HTTP + Swagger](../connectors/connectors-native-http-swagger.md)) may come from any of the [Azure Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653).

|Logic App Region|Outbound IP|
|-----|----|
|Australia East|40.126.251.213|
|Australia Southeast|40.127.80.34|
|Brazil South|191.232.38.129|
|Central India|104.211.98.164|
|Central US|40.122.49.51|
|East Asia|23.99.116.181|
|East US|191.237.41.52|
|East US 2|104.208.233.100|
|Japan East|40.115.186.96|
|Japan West|40.74.130.77|
|North Central US|65.52.218.230|
|North Europe|104.45.93.9|
|South Central US|104.214.70.191|
|Southeast Asia|13.76.231.68|
|South India|104.211.227.225|
|West Europe|40.115.50.13|
|West India|104.211.161.203|
|West US|104.40.51.248|


## Next Steps  

- To get started with Logic Apps, follow the [create a Logic App](app-service-logic-create-a-logic-app.md) tutorial.  
- [View common examples and scenarios](app-service-logic-examples-and-scenarios.md)
- [You can automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
- [Learn How to Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)