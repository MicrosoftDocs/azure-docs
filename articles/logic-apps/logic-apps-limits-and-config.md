---
title: Logic App limits and configuration | Microsoft Docs
description: Overview of the service limits and configuration values available for Logic Apps.
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 75b52eeb-23a7-47dd-a42f-1351c6dfebdc
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/23/2016
ms.author: LADocs; jehollan

---
# Logic App limits and configuration

Below are information on the current limits and configuration details for Azure Logic Apps.

## Limits

### HTTP request limits

These are limits for a single HTTP request and/or connector call

#### Timeout

|Name|Limit|Notes|
|----|----|----|
|Request Timeout|120 Seconds|An [async pattern](../logic-apps/logic-apps-create-api-app.md) or [until loop](logic-apps-loops-and-scopes.md) can compensate as needed|

#### Message size

|Name|Limit|Notes|
|----|----|----|
|Message size|100 MB|Some connectors and APIs may not support 100MB |
|Expression evaluation limit|131,072 characters|`@concat()`, `@base64()`, `string` cannot be longer than this|

#### Retry policy

|Name|Limit|Notes|
|----|----|----|
|Retry attempts|4|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|
|Retry max delay|1 hour|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|
|Retry min delay|5 sec|Can configure with the [retry policy parameter](https://msdn.microsoft.com/en-us/library/azure/mt643939.aspx)|

### Run duration and retention

These are the limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|Run duration|90 days||
|Storage retention|90 days|This is from the run start time|
|Min recurrence interval|1 sec|| 15 seconds for logic apps with App Service Plan
|Max recurrence interval|500 days||


### Looping and debatching limits

These are limits for a single logic app run.

|Name|Limit|Notes|
|----|----|----|
|ForEach items|100,000|You can use the [query action](../connectors/connectors-native-query.md) to filter larger arrays as needed|
|Until iterations|5,000||
|SplitOn items|100,000||
|ForEach Parallelism|20|You can set to a sequential foreach by adding `"operationOptions": "Sequential"` to the `foreach` action|


### Throughput limits

These are limits for a single logic app instance. 

|Name|Limit|Notes|
|----|----|----|
|Actions executions per 5 minutes |100,000|Can distribute workload across multiple apps as needed|
|Actions concurrent outgoing calls |~2,500|Decrease number of concurrent requests or reduce the duration as needed|
|Runtime endpoint concurrent incoming calls |~1,000|Decrease number of concurrent requests or reduce the duration as needed|
|Runtime endpoint read calls per 5 minutes |60,000|Can distribute workload across multiple apps as needed|
|Runtime endpoint invoke calls per 5 minutes |45,000|Can distribute workload across multiple apps as needed|

If you expect to exceed this limit in normal processing or wish to run load testing that may exceed this limit for a period of time please [contact us](mailto://logicappsemail@microsoft.com) so that we can help with your requirements.

### Definition limits

These are limits for a single logic app definition.

|Name|Limit|Notes|
|----|----|----|
|Actions per workflow|250|You can add nested workflows to extend this as needed|
|Allowed action nesting depth|5|You can add nested workflows to extend this as needed|
|Workflows per region per subscription|1000||
|Triggers per workflow|10||
|Switch scope cases limit|25||
|Number of variables per workflow|250||
|Max characters per expression|8,192||
|Max `trackedProperties` size in characters|16,000|
|`action`/`trigger` name limit|80||
|`description` length limit|256||
|`parameters` limit|50||
|`outputs` limit|10||

### Integration Account limits

These are limits for artifacts added to integration Account

|Name|Limit|Notes|
|----|----|----|
|Schema|8MB|You can use [blob URI](logic-apps-enterprise-integration-schemas.md) to upload files larger than 2 MB |
|Map (XSLT file)|2MB| |
|Runtime endpoint read calls per 5 minutes |60,000|Can distribute workload across multiple accounts as needed|
|Runtime endpoint invoke calls per 5 minutes |45,000|Can distribute workload across multiple accounts as needed|
|Runtime endpoint tracking calls per 5 minutes |45,000|Can distribute workload across multiple accounts as needed|
|Runtime endpoint blocking concurrent calls |~1,000|Decrease number of concurrent requests or reduce the duration as needed|

### B2B protocols (AS2, X12, EDIFACT) message size

These are the limits for B2B protocols

|Name|Limit|Notes|
|----|----|----|
|AS2|50MB|Applicable to decode and encode|
|X12|50MB|Applicable to decode and encode|
|EDIFACT|50MB|Applicable to decode and encode|

## Configuration

### IP Address

#### Logic App Service

Calls made from a logic app directly (i.e. via [HTTP](../connectors/connectors-native-http.md) or [HTTP + Swagger](../connectors/connectors-native-http-swagger.md)) or other HTTP requests will come from the IP Address specified below:

|Logic App Region|Outbound IP|
|-----|----|
|Australia East|13.75.153.66, 104.210.89.222, 104.210.89.244, 13.75.149.4, 104.210.91.55, 104.210.90.241|
|Australia Southeast|13.73.115.153, 40.115.78.70, 40.115.78.237, 13.73.114.207, 13.77.3.139, 13.70.159.205|
|Brazil South|191.235.86.199, 191.235.95.229, 191.235.94.220, 191.235.82.221, 191.235.91.7, 191.234.182.26|
|Canada Central|52.233.29.92,52.228.39.241,52.228.39.244|
|Canada East|52.232.128.155,52.229.120.45,52.229.126.25|
|Central India|52.172.157.194, 52.172.184.192, 52.172.191.194, 52.172.154.168, 52.172.186.159, 52.172.185.79|
|Central US|13.67.236.76, 40.77.111.254, 40.77.31.87, 13.67.236.125, 104.208.25.27, 40.122.170.198|
|East Asia|168.63.200.173, 13.75.89.159, 23.97.68.172, 13.75.94.173, 40.83.127.19, 52.175.33.254|
|East US|137.135.106.54, 40.117.99.79, 40.117.100.228, 13.92.98.111, 40.121.91.41, 40.114.82.191|
|East US 2|40.84.25.234, 40.79.44.7, 40.84.59.136, 40.84.30.147, 104.208.155.200, 104.208.158.174|
|Japan East|13.71.146.140, 13.78.84.187, 13.78.62.130, 13.71.158.3, 13.73.4.207, 13.71.158.120|
|Japan West|40.74.140.173, 40.74.81.13, 40.74.85.215, 40.74.140.4, 104.214.137.243, 138.91.26.45|
|North Central US|168.62.249.81, 157.56.12.202, 65.52.211.164, 168.62.248.37, 157.55.210.61, 157.55.212.238|
|North Europe|13.79.173.49, 52.169.218.253, 52.169.220.174, 40.113.12.95, 52.178.165.215, 52.178.166.21|
|South Central US|13.65.98.39, 13.84.41.46, 13.84.43.45, 104.210.144.48, 13.65.82.17, 13.66.52.232|
|Southeast Asia|52.163.93.214, 52.187.65.81, 52.187.65.155, 13.76.133.155, 52.163.228.93, 52.163.230.166|
|South India|52.172.9.47, 52.172.49.43, 52.172.51.140, 52.172.50.24, 52.172.55.231, 52.172.52.0|
|West Europe|13.95.155.53, 52.174.54.218, 52.174.49.6, 40.68.222.65, 40.68.209.23, 13.95.147.65|
|West India|104.211.164.112, 104.211.165.81, 104.211.164.25, 104.211.164.80, 104.211.162.205, 104.211.164.136|
|West US|52.160.90.237, 138.91.188.137, 13.91.252.184, 52.160.92.112, 40.118.244.241, 40.118.241.243|

#### Connectors

Calls made from a [connector](../connectors/apis-list.md) will come from the IP Address specified below:

|Logic App Region|Outbound IP|
|-----|----|
|Australia East|40.126.251.213|
|Australia Southeast|40.127.80.34|
|Brazil South|191.232.38.129|
|Canada Central|52.233.31.197,52.228.42.205,52.228.33.76,52.228.34.13|
|Canada East|52.229.123.98,52.229.120.178,52.229.126.202,52.229.120.52|
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

- To get started with Logic Apps, follow the [create a Logic App](../logic-apps/logic-apps-create-a-logic-app.md) tutorial.  
- [View common examples and scenarios](../logic-apps/logic-apps-examples-and-scenarios.md)
- [You can automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
- [Learn How to Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)
