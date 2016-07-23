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
|Message size|50 MB|Some connectors and APIs may not support 50MB|

#### Retry policy

|Name|Limit|Notes|
|----|----|----|
|Retry attempts|5|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|
|Retry delay|1 hour|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|

### Run duration and retention

These are the limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|Run duration|90 days||
|Storage retention|90 days|This is from the run start time|

### Looping and debatching limits

These are limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|ForEach items|10,000|You can use the [query action](../connectors/connectors-native-query.md) to filter larger arrays as needed|
|Until iterations|10,000||
|SplitOn items|10,000||


### Throughput limits

These are limits for a single logic app instance. 

|Name|Limit|Notes|
|----|----|----|
|Triggers per second|100|Can distribute via traffic manager to allocate across multiple apps.|

### Definition limits

These are limits for a single logic app definition.

|Name|Limit|Notes|
|----|----|----|
|Actions in ForEach|1|You can add nested workflows to extend this as needed|
|Actions per workflow|60|You can add nested workflows to extend this as needed|
|Allowed action nesting depth|8|You can add nested workflows to extend this as needed|

## Configuration

### IP Address

Calls made from a [connector](../connectors/apis-list.md) will come from the IP Address specified below.

Calls made from a logic app directly (i.e. via [HTTP](../connectors/connectors-native-http.md) or [HTTP + Swagger](../connectors/connectors-native-httpswagger.md)) may come from any of the [Azure Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653).

|Logic ASE|Outbound IP|
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

- To get started with Logic Apps, follow the [create a Logic App][create] tutorial.  
- [View common examples and scenarios](app-service-logic-examples-and-scenarios.md)
- [You can automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
- [Learn How to Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)