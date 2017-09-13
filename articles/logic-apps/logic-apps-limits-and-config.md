---
title: Limits and configuration - Azure Logic Apps | Microsoft Docs
description: Service limits and configuration values for Azure Logic Apps
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
ms.date: 08/18/2017
ms.author: LADocs; jehollan
---

# Logic Apps limits and configuration

This topic describes the current limits and configuration details for Azure Logic Apps.

## Limits

### HTTP request limits

These limits apply to a single HTTP request or a connector call.

#### Timeout

|Name|Limit|Notes|
|----|-----|-----|
|Request Timeout|120 seconds|An [async pattern](../logic-apps/logic-apps-create-api-app.md) or [until loop](logic-apps-loops-and-scopes.md) can compensate as needed|
||||

#### Message size

|Name|Limit|Notes|
|----|-----|-----|
|Message size|100 MB|Some connectors and APIs might not support 100 MB.|
|Expression evaluation limit|131,072 characters|`@concat()`, `@base64()`, `string` can't be longer than this limit.|
||||

#### Retry policy

|Name|Limit|Notes|
|----|-----|-----|
|Retry attempts|10| The default is 4. You can configure with the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md).|
|Retry max delay|1 hour|You can configure with the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md).|
|Retry min delay|5 sec|You can configure with the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md).|
||||

### Run duration and retention

These limits apply to a single logic app run.

|Name|Limit|Notes|
|----|-----|-----|
|Run duration|90 days||
|Storage retention|90 days from the run's start time ||
|Min recurrence interval|1 second </br>For logic apps with an App Service Plan: 15 seconds ||
|Max recurrence interval|500 days||
||||

To exceed the limits for run duration or 
storage retention in your normal processing flow, 
[contact us](mailto://logicappsemail@microsoft.com) 
so that we can help with your requirements.

### Looping and debatching limits

These limits apply to a single logic app run.

|Name|Limit|Notes|
|----|-----|-----|
|ForEach items|100,000|You can use the [query action](../connectors/connectors-native-query.md) to filter larger arrays as needed|
|Until iterations|5,000||
|SplitOn items|100,000||
|ForEach Parallelism|50| The default is 20. <p>To set a specific level of parallelism in a ForEach loop, set the `runtimeConfiguration` property in the `foreach` action. <p>To sequentially run a ForEach loop, set the `operationOptions` property to "Sequential" in the `foreach` action.|
||||

### Throughput limits

These limits apply to a single logic app instance.

|Name|Limit|Notes|
|----|-----|-----|
|Actions executions per 5 minutes |100,000|Can distribute workload across multiple apps as needed.|
|Actions concurrent outgoing calls |~2,500|Decrease number of concurrent requests or reduce the duration as needed.|
|Runtime endpoint: Concurrent incoming calls |~1,000|Decrease number of concurrent requests or reduce the duration as needed.|
|Runtime endpoint: Read calls per 5 minutes |60,000|Can distribute workload across multiple apps as needed.|
|Runtime endpoint: Invoke calls per 5 minutes |45,000|Can distribute workload across multiple apps as needed.|
||||

To exceed these limits in normal processing, 
or run load testing that might exceed these limits, 
[contact us](mailto://logicappsemail@microsoft.com) 
so that we can help with your requirements.

### Logic app definition limits

These limits apply to a single logic app definition.

|Name|Limit|Notes|
|----|-----|-----|
|Actions per workflow|500|To extend this limit, you can add nested workflows as needed.|
|Allowed action nesting depth|8|To extend this limit, you can add nested workflows as needed.|
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
||||

### Custom connector limits

|Name|Limit|Notes|
|----|-----|-----|
|Number of custom connectors that you can create|1,000 per Azure subscription||
|Number of requests per minute with a custom connector|500||
||||

### Integration account limits

These limits apply to artifacts that you can add to an integration account.

|Name|Limit|Notes|
|----|-----|-----|
|Schema|8 MB|You can use [blob URI](logic-apps-enterprise-integration-schemas.md) to upload files larger than 2 MB. |
|Map (XSLT file)|2 MB| |
|Runtime endpoint: Read calls per 5 minutes |60,000|Can distribute the workload across multiple accounts as needed.|
|Runtime endpoint: Invoke calls per 5 minutes |45,000|Can distribute the workload across multiple accounts as needed.|
|Runtime endpoint: Tracking calls per 5 minutes |45,000|Can distribute the workload across multiple accounts as needed.|
|Runtime endpoint: Blocking concurrent calls |~1,000|Decrease the number of concurrent requests or reduce the duration as needed.|
||||

These limits apply to the number of artifacts that you can add to an integration account.

Free pricing tier

|Name|Limit|Notes|
|----|----|----|
|Agreements|10||
|Other artifact types|25|Artifact types include partners, schemas, certificates, and maps. Each type can have up to the maximum number of artifacts.|

Standard pricing tier

|Name|Limit|Notes|
|----|----|----|
|Any type of artifact|500|Artifact types include agreements, partners, schemas, certificates, and maps. Each type can have up to the maximum number of artifacts.|

### B2B protocols (AS2, X12, EDIFACT) message size

These limits apply to B2B protocols.

|Name|Limit|Notes|
|----|-----|-----|
|AS2|50 MB|Applies to decode and encode|
|X12|50 MB|Applies to decode and encode|
|EDIFACT|50 MB|Applies to decode and encode|
||||

<a name="configuration"></a>

## Configuration: IP Addresses

### Logic Apps service

The calls that a logic app directly makes, that is, through 
[HTTP](../connectors/connectors-native-http.md) or 
[HTTP + Swagger](../connectors/connectors-native-http-swagger.md) 
or other HTTP requests, come from IP addresses in this list.

|Logic Apps region|Outbound IP|
|-----------------|-----------|
|Australia East|13.75.149.4, 104.210.91.55, 104.210.90.241|
|Australia Southeast|13.73.114.207, 13.77.3.139, 13.70.159.205|
|Brazil South|191.235.82.221, 191.235.91.7, 191.234.182.26|
|Canada Central|52.233.29.92, 52.228.39.241, 52.228.39.244|
|Canada East|52.232.128.155, 52.229.120.45, 52.229.126.25|
|Central India|52.172.154.168, 52.172.186.159, 52.172.185.79|
|Central US|13.67.236.125, 104.208.25.27, 40.122.170.198|
|East Asia|13.75.94.173, 40.83.127.19, 52.175.33.254|
|East US|13.92.98.111, 40.121.91.41, 40.114.82.191|
|East US 2|40.84.30.147, 104.208.155.200, 104.208.158.174|
|Japan East|13.71.158.3, 13.73.4.207, 13.71.158.120|
|Japan West|40.74.140.4, 104.214.137.243, 138.91.26.45|
|North Central US|168.62.248.37, 157.55.210.61, 157.55.212.238|
|North Europe|40.113.12.95, 52.178.165.215, 52.178.166.21|
|South Central US|104.210.144.48, 13.65.82.17, 13.66.52.232|
|Southeast Asia|13.76.133.155, 52.163.228.93, 52.163.230.166|
|South India|52.172.50.24, 52.172.55.231, 52.172.52.0|
|West Central US|52.161.27.190, 52.161.18.218, 52.161.9.108|
|West Europe|40.68.222.65, 40.68.209.23, 13.95.147.65|
|West India|104.211.164.80, 104.211.162.205, 104.211.164.136|
|West US|52.160.92.112, 40.118.244.241, 40.118.241.243|
|West US 2|13.66.210.167, 52.183.30.169, 52.183.29.132|
|UK South|51.140.74.14, 51.140.73.85, 51.140.78.44|
|UK West|51.141.54.185, 51.141.45.238, 51.141.47.136|
| | |

### Connectors

The calls that [connectors](../connectors/apis-list.md) 
make come from the IP addresses in this list.

|Logic Apps region|Outbound IP|
|-----------------|-----------|
|Australia East|40.126.251.213|
|Australia Southeast|40.127.80.34|
|Brazil South|191.232.38.129|
|Canada Central|52.233.31.197, 52.228.42.205, 52.228.33.76, 52.228.34.13|
|Canada East|52.229.123.98, 52.229.120.178, 52.229.126.202, 52.229.120.52|
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
|UK South|51.140.80.51|
|UK West|51.141.47.105|
| | |

## Next steps  

* [Create your first logic app](../logic-apps/logic-apps-create-a-logic-app.md)  
* [Common examples and scenarios](../logic-apps/logic-apps-examples-and-scenarios.md)
* [Video: Automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
* [Video: Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)
