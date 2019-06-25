---
title: Limits and configuration - Azure Logic Apps | Microsoft Docs
description: Service limits and configuration values for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.author: estfan
ms.topic: article
ms.date: 06/19/2019
---

# Limits and configuration information for Azure Logic Apps

This article describes the limits and configuration details for 
creating and running automated workflows with Azure Logic Apps. 
For Microsoft Flow, see [Limits and configuration in Microsoft Flow](https://docs.microsoft.com/flow/limits-and-config).

<a name="definition-limits"></a>

## Definition limits

Here are the limits for a single logic app definition:

| Name | Limit | Notes |
| ---- | ----- | ----- |
| Actions per workflow | 500 | To extend this limit, you can add nested workflows as needed. |
| Allowed nesting depth for actions | 8 | To extend this limit, you can add nested workflows as needed. |
| Workflows per region per subscription | 1,000 | |
| Triggers per workflow | 10 | When working in code view, not the designer |
| Switch scope cases limit | 25 | |
| Variables per workflow | 250 | |
| Characters per expression | 8,192 | |
| Maximum size for `trackedProperties` | 16,000 characters |
| Name for `action` or `trigger` | 80 characters | |
| Length of `description` | 256 characters | |
| Maximum `parameters` | 50 | |
| Maximum `outputs` | 10 | |
||||

<a name="run-duration-retention-limits"></a>

## Run duration and retention limits

Here are the limits for a single logic app run:

| Name | Multi-tenant limit | Integration service environment limit | Notes |
|------|--------------------|---------------------------------------|-------|
| Run duration | 90 days | 365 days | To change the default limit, see [change run duration](#change-duration). |
| Storage retention | 90 days from the run's start time | 365 days | To change the default limit, see [change storage retention](#change-retention). |
| Minimum recurrence interval | 1 second | 1 second ||
| Maximum recurrence interval | 500 days | 500 days ||
|||||

<a name="change-duration"></a>
<a name="change-retention"></a>

### Change run duration and storage retention

To change the default limit for run duration and storage retention, 
follow these steps. If you need to go above the maximum limit, 
[contact the Logic Apps team](mailto://logicappsemail@microsoft.com) 
for help with your requirements.

1. In the Azure portal, on your logic app's menu, 
choose **Workflow settings**.

2. Under **Runtime options**, from the **Run history retention in days** list, 
choose **Custom**.

3. Enter or drag the slider for the number of days you want.

<a name="looping-debatching-limits"></a>

## Concurrency, looping, and debatching limits

Here are the limits for a single logic app run:

| Name | Limit | Notes |
| ---- | ----- | ----- |
| Trigger concurrency | * Unlimited when the concurrency control is turned off <p><p>* 25 is the default limit when the concurrency control is turned on, which can't be undone after you turn on the control. You can change the default to a value between 1 and 50 inclusively. | This limit describes the highest number of logic app instances that can run at the same time, or in parallel. <p><p>To change the default limit to a value between 1 and 50 inclusively, see [Change trigger concurrency limit](../logic-apps/logic-apps-workflow-actions-triggers.md#change-trigger-concurrency) or [Trigger instances sequentially](../logic-apps/logic-apps-workflow-actions-triggers.md#sequential-trigger). |
| Maximum waiting runs | When the concurrency control is turned on, the minimum number of waiting runs is 10 plus the number of concurrent runs (trigger concurrency). You can change the maximum number up to 100 inclusively. | This limit describes the highest number of logic app instances that can wait to run when your logic app is already running the maximum concurrent instances. <p><p>To change the default limit, see [Change waiting runs limit](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs). |
| Foreach array items | 100,000 | This limit describes the highest number of array items that a "for each" loop can process. <p><p>To filter larger arrays, you can use the [query action](../connectors/connectors-native-query.md). |
| Foreach concurrency | 20 is the default limit when the concurrency control is turned off. You can change the default to a value between 1 and 50 inclusively. | This limit is highest number of "for each" loop iterations that can run at the same time, or in parallel. <p><p>To change the default limit to a value between 1 and 50 inclusively, see [Change "for each" concurrency limit](../logic-apps/logic-apps-workflow-actions-triggers.md#change-for-each-concurrency) or [Run "for each" loops sequentially](../logic-apps/logic-apps-workflow-actions-triggers.md#sequential-for-each). |
| SplitOn items | 100,000 | For triggers that return an array, you can specify an expression that uses a 'SplitOn' property that [splits or debatches array items into multiple workflow instances](../logic-apps/logic-apps-workflow-actions-triggers.md#split-on-debatch) for processing, rather than use a "Foreach" loop. This expression references the array to use for creating and running a workflow instance for each array item. |
| Until iterations | 5,000 | |
||||

<a name="throughput-limits"></a>

## Throughput limits

Here are the limits for a single logic app definition:

### Multi-tenant Logic Apps service

| Name | Limit | Notes |
| ---- | ----- | ----- |
| Action: Executions per 5 minutes | 100,000 is the default limit, but 300,000 is the maximum limit. | To change the default limit, see [Run your logic app in "high throughput" mode](../logic-apps/logic-apps-workflow-actions-triggers.md#run-high-throughput-mode), which is in preview. Or, you can distribute the workload across more than one logic app as necessary. |
| Action: Concurrent outgoing calls | ~2,500 | You can reduce the number of concurrent requests or reduce the duration as necessary. |
| Runtime endpoint: Concurrent incoming calls | ~1,000 | You can reduce the number of concurrent requests or reduce the duration as necessary. |
| Runtime endpoint: Read calls per 5 minutes  | 60,000 | You can distribute workload across more than one app as necessary. |
| Runtime endpoint: Invoke calls per 5 minutes | 45,000 | You can distribute workload across more than one app as necessary. |
| Content throughput per 5 minutes | 600 MB | You can distribute workload across more than one app as necessary. |
||||

### Integration service environment (ISE)

| Name | Limit | Notes |
|------|-------|-------|
| Base unit execution limit | System-throttled when infrastructure capacity reaches 80% | Provides ~4,000 action executions per minute, which is ~160 million action executions per month | |
| Scale unit execution limit | System-throttled when infrastructure capacity reaches 80% | Each scale unit can provide ~2,000 additional action executions per minute, which is ~80 million more action executions per month | |
| Maximum scale units that you can add | 10 | |
||||

To go above these limits in normal processing, 
or run load testing that might go above these limits, 
[contact the Logic Apps team](mailto://logicappsemail@microsoft.com) 
for help with your requirements.

<a name="request-limits"></a>

## HTTP limits

Here are the limits for a single HTTP 
request or synchronous connector call:

#### Timeout

Some connector operations make asynchronous calls or listen for webhook requests, so the timeout for these operations might be longer than these limits. For more information, see the technical details for the specific connector and also [Workflow triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action).

| Name | Multi-tenant limit | Integration service environment limit | Notes |
|------|--------------------|---------------------------------------|-------|
| Outgoing request | 120 seconds | 240 seconds | For longer running operations, use an [asynchronous polling pattern](../logic-apps/logic-apps-create-api-app.md#async-pattern) or an [until loop](../logic-apps/logic-apps-workflow-actions-triggers.md#until-action). |
| Synchronous response | 120 seconds | 240 seconds | For the original request to get the response, all steps in the response must finish within the limit unless you call another logic app as a nested workflow. For more information, see [Call, trigger, or nest logic apps](../logic-apps/logic-apps-http-endpoint.md). |
|||||

#### Message size

| Name | Multi-tenant limit | Integration service environment limit | Notes |
|------|--------------------|---------------------------------------|-------|
| Message size | 100 MB | 200 MB | To work around this limit, see [Handle large messages with chunking](../logic-apps/logic-apps-handle-large-messages.md). However, some connectors and APIs might not support chunking or even the default limit. |
| Message size with chunking | 1 GB | 5 GB | This limit applies to actions that natively support chunking or let you enable chunking in their runtime configuration. <p>For the integration service environment, the Logic Apps engine supports this limit, but connectors have their own chunking limits up to the engine limit, for example, see [Azure Blob Storage connector](/connectors/azureblob/). For more information chunking, see [Handle large messages with chunking](../logic-apps/logic-apps-handle-large-messages.md). |
| Expression evaluation limit | 131,072 characters | 131,072 characters | The `@concat()`, `@base64()`, `@string()` expressions can't be longer than this limit. |
|||||

#### Retry policy

| Name | Limit | Notes |
| ---- | ----- | ----- |
| Retry attempts | 90 | The default is 4. To change the default, use the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md). |
| Retry max delay | 1 day | To change the default, use the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md). |
| Retry min delay | 5 seconds | To change the default, use the [retry policy parameter](../logic-apps/logic-apps-workflow-actions-triggers.md). |
||||

<a name="custom-connector-limits"></a>

## Custom connector limits

Here are the limits for custom connectors that you can create from web APIs.

| Name | Multi-tenant limit | Integration service environment limit | Notes |
|------|--------------------|---------------------------------------|-------|
| Number of custom connectors | 1,000 per Azure subscription | 1,000 per Azure subscription ||
| Number of requests per minute for a custom connector | 500 requests per minute per connection | 2,000 requests per minute per *custom connector* ||
|||

<a name="managed-identity"></a>

## Managed identities

| Name | Limit |
| ---- | ----- |
| Number of logic apps with system-assigned managed identities per Azure subscription | 100 |
|||

<a name="integration-account-limits"></a>

## Integration account limits

<a name="artifact-number-limits"></a>

### Artifact limits per integration account

Here are the limits on the number of artifacts for each integration account. 
For more information, see [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/).

> [!NOTE] 
> Use the Free tier only for exploratory scenarios, 
> not production scenarios. This tier restricts 
> throughput and usage, and has no service-level agreement (SLA).

| Artifact | Free | Basic | Standard |
|----------|------|-------|----------|
| EDI trading agreements | 10 | 1 | 1,000 |
| EDI trading partners | 25 | 2 | 1,000 |
| Maps | 25 | 500 | 1,000 |
| Schemas | 25 | 500 | 1,000 |
| Assemblies | 10 | 25 | 1,000 |
| Certificates | 25 | 2 | 500 |
| Batch configurations | 5 | 1 | 50 |
||||

<a name="artifact-capacity-limits"></a>

### Artifact capacity limits

| Artifact | Limit | Notes |
| -------- | ----- | ----- |
| Assembly | 8 MB | To upload files larger than 2 MB, use an [Azure storage account and blob container](../logic-apps/logic-apps-enterprise-integration-schemas.md). |
| Map (XSLT file) | 8 MB | To upload files larger than 2 MB, use the [Azure Logic Apps REST API - Maps](https://docs.microsoft.com/rest/api/logic/maps/createorupdate). |
| Schema | 8 MB | To upload files larger than 2 MB, use an [Azure storage account and blob container](../logic-apps/logic-apps-enterprise-integration-schemas.md). |
||||

| Runtime endpoint | Limit | Notes |
|------------------|-------|-------|
| Read calls per 5 minutes | 60,000 | You can distribute the workload across more than one account as necessary. |
| Invoke calls per 5 minutes | 45,000 | You can distribute the workload across more than one account as necessary. |
| Tracking calls per 5 minutes | 45,000 | You can distribute the workload across more than one account as necessary. |
| Blocking concurrent calls | ~1,000 | You can reduce the number of concurrent requests or reduce the duration as necessary. |
||||

<a name="b2b-protocol-limits"></a>

### B2B protocol (AS2, X12, EDIFACT) message size

Here are the message size limits that apply to B2B protocols:

| Name | Multi-tenant limit | Integration service environment limit | Notes |
|------|--------------------|---------------------------------------|-------|
| AS2 | v2 - 100 MB<br>v1 - 50 MB | v2 - 200 MB <br>v1 - 50 MB | Applies to decode and encode |
| X12 | 50 MB | 50 MB | Applies to decode and encode |
| EDIFACT | 50 MB | 50 MB | Applies to decode and encode |
||||

<a name="disable-delete"></a>

## Disabling or deleting logic apps

When you disable a logic app, no new runs are instantiated. 
All in-progress and pending runs continue until they finish, 
which might take time to complete.

When you delete a logic app, no new runs are instantiated. 
All in-progress and pending runs are canceled. 
If you have thousands of runs, cancellation might 
take significant time to complete.

<a name="configuration"></a>

## Firewall configuration: IP addresses

All logic apps in the same region use the same IP address ranges. 
To support the calls that your logic apps directly make with 
[HTTP](../connectors/connectors-native-http.md), 
[HTTP + Swagger](../connectors/connectors-native-http-swagger.md), 
and other HTTP requests, set up your firewalls with *all* the 
[inbound](#inbound) *and* [outbound](#outbound) IP addresses 
used by the Logic Apps service, based on the regions where your 
logic apps exist. These addresses appear under the **Inbound** 
and **Outbound** headings in this section, and are sorted by region.

To support the calls that [Microsoft-managed connectors](../connectors/apis-list.md) make, 
set up your firewall with *all* the [outbound](#outbound) IP addresses 
used by these connectors, based on the regions where your logic apps exist. 
These addresses appear under the **Outbound** heading in this section, 
and are sorted by region.

For [Azure Government](../azure-government/documentation-government-overview.md) 
and [Azure China 21Vianet](https://docs.microsoft.com/azure/china/), 
reserved IP addresses for connectors aren't currently available.

> [!IMPORTANT]
>
> If you have existing configurations, please update them 
> **as soon as possible before September 1, 2018** so they 
> include and match the IP addresses in these lists for the 
> regions where your logic apps exist.

Logic Apps doesn't support directly connecting to Azure storage 
accounts through firewalls. To access these storage accounts, 
use either option here:

* Create an [integration service environment](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
which can connect to resources in an Azure virtual network.

* If you already use API Management, you can use 
this service for this scenario. For more info, see 
[Simple enterprise integration architecture](https://aka.ms/aisarch).

<a name="inbound"></a>

### Inbound IP addresses - Logic Apps service only

| Region | IP |
|--------|----|
| Australia East | 13.75.153.66, 52.187.231.161, 104.210.89.222, 104.210.89.244 |
| Australia Southeast | 13.73.115.153, 40.115.78.70, 40.115.78.237, 52.189.216.28 |
| Brazil South | 191.234.166.198, 191.235.86.199, 191.235.94.220, 191.235.95.229 |
| Canada Central | 13.88.249.209, 40.85.241.105, 52.233.29.79, 52.233.30.218 |
| Canada East | 40.86.202.42, 52.229.125.57, 52.232.129.143, 52.232.133.109 |
| Central India | 52.172.157.194, 52.172.184.192, 52.172.191.194, 104.211.73.195 |
| Central US | 13.67.236.76, 40.77.31.87, 40.77.111.254, 104.43.243.39 |
| East Asia | 13.75.89.159, 23.97.68.172, 40.83.98.194, 168.63.200.173 |
| East US | 40.117.99.79, 40.117.100.228, 137.116.126.165, 137.135.106.54 |
| East US 2 | 40.70.27.253, 40.79.44.7, 40.84.25.234, 40.84.59.136 |
| Japan East | 13.71.146.140, 13.78.43.164, 13.78.62.130, 13.78.84.187 |
| Japan West | 40.74.68.85, 40.74.81.13, 40.74.85.215, 40.74.140.173 |
| North Central US | 65.52.9.64, 65.52.211.164, 168.62.249.81, 157.56.12.202 |
| North Europe | 13.79.173.49, 40.112.90.39, 52.169.218.253, 52.169.220.174 |
| South Central US | 13.65.98.39, 13.84.41.46, 13.84.43.45, 40.84.138.132 |
| South India | 52.172.9.47, 52.172.49.43, 52.172.51.140, 104.211.225.152 |
| Southeast Asia | 52.163.93.214, 52.187.65.81, 52.187.65.155, 104.215.181.6 |
| West Central US | 13.78.137.247, 52.161.8.128, 52.161.19.82, 52.161.26.172 |
| West Europe | 13.95.155.53, 51.144.176.185, 52.174.49.6, 52.174.54.218 |
| West India | 104.211.157.237, 104.211.164.25, 104.211.164.112, 104.211.165.81 |
| West US | 13.91.252.184, 52.160.90.237, 138.91.188.137, 157.56.160.212 |
| West US 2 | 13.66.128.68, 13.66.224.169, 52.183.30.10, 52.183.39.67 |
| UK South | 51.140.78.71, 51.140.79.109, 51.140.84.39, 51.140.155.81 |
| UK West | 51.141.48.98, 51.141.51.145, 51.141.53.164, 51.141.119.150 |
| | |

<a name="outbound"></a>

### Outbound IP addresses - Logic Apps service & managed connectors

| Region | Logic Apps IP | Managed connectors IP |
|--------|---------------|-----------------------|
| Australia East | 13.75.149.4, 52.187.226.96, 52.187.226.139, 52.187.227.245, 52.187.229.130, 52.187.231.184, 104.210.90.241, 104.210.91.55 | 13.70.72.192 - 13.70.72.207, 13.72.243.10 |
| Australia Southeast | 13.70.159.205, 13.73.114.207, 13.77.3.139, 13.77.56.167, 13.77.58.136, 52.189.214.42, 52.189.220.75, 52.189.222.77 | 13.77.50.240 - 13.77.50.255, 13.70.136.174 |
| Brazil South | 191.234.161.28, 191.234.161.168, 191.234.162.131, 191.234.162.178, 191.234.182.26, 191.235.82.221, 191.235.91.7, 191.237.255.116 | 191.233.203.192 - 191.233.203.207, 104.41.59.51 | 
| Canada Central | 13.71.184.150, 13.71.186.1, 40.85.250.135, 40.85.250.212, 40.85.252.47, 52.233.29.92, 52.228.39.241, 52.228.39.244 | 13.71.170.208 - 13.71.170.223, 13.71.170.224 - 13.71.170.239, 52.237.24.126 |
| Canada East | 40.86.203.228, 40.86.216.241, 40.86.217.241, 40.86.226.149, 40.86.228.93, 52.229.120.45, 52.229.126.25, 52.232.128.155 | 40.69.106.240 - 40.69.106.255, 52.242.35.152 |
| Central India | 52.172.154.168, 52.172.185.79, 52.172.186.159, 104.211.74.145, 104.211.90.162, 104.211.90.169, 104.211.101.108, 104.211.102.62 | 104.211.81.192 - 104.211.81.207, 52.172.211.12 |
| Central US | 13.67.236.125, 23.100.82.16, 23.100.86.139, 23.100.87.24, 23.100.87.56, 40.113.218.230, 40.122.170.198, 104.208.25.27 | 13.89.171.80 - 13.89.171.95, 52.173.245.164 |
| East Asia | 13.75.94.173, 40.83.73.39, 40.83.75.165, 40.83.77.208, 40.83.100.69, 40.83.127.19, 52.175.33.254, 65.52.175.34 | 13.75.36.64 - 13.75.36.79, 52.175.23.169 |
| East US | 13.92.98.111, 23.100.29.190, 23.101.132.208, 23.101.136.201, 23.101.139.153, 40.114.82.191, 40.121.91.41, 104.45.153.81 | 40.71.11.80 - 40.71.11.95, 40.71.249.205, 191.237.41.52 |
| East US 2 | 40.70.26.154, 40.70.27.236, 40.70.29.214, 40.70.131.151, 40.84.30.147, 104.208.140.40, 104.208.155.200, 104.208.158.174 | 40.70.146.208 - 40.70.146.223, 52.232.188.154 |
| Japan East | 13.71.158.3, 13.71.158.120, 13.73.4.207, 13.78.18.168, 13.78.20.232, 13.78.21.155, 13.78.35.229, 13.78.42.223 | 13.78.108.0 - 13.78.108.15, 13.71.153.19 |
| Japan West | 40.74.64.207, 40.74.68.85, 40.74.74.21, 40.74.76.213, 40.74.77.205, 40.74.140.4, 104.214.137.243, 138.91.26.45 | 40.74.100.224 - 40.74.100.239, 104.215.61.248 |
| North Central US | 52.162.208.216, 52.162.213.231, 65.52.8.225, 65.52.9.96, 65.52.10.183, 157.55.210.61, 157.55.212.238, 168.62.248.37 | 52.162.107.160 - 52.162.107.175, 52.162.242.161 |
| North Europe | 40.112.92.104, 40.112.95.216, 40.113.1.181, 40.113.3.202, 40.113.4.18, 40.113.12.95, 52.178.165.215, 52.178.166.21 | 13.69.227.208 - 13.69.227.223, 52.178.150.68 |
| South Central US | 13.65.82.17, 13.66.52.232, 23.100.124.84, 23.100.127.172, 23.101.183.225, 70.37.54.122, 70.37.50.6, 104.210.144.48 | 104.214.19.48 - 104.214.19.63, 13.65.86.57 |
| South India | 52.172.50.24, 52.172.52.0, 52.172.55.231, 104.211.227.229, 104.211.229.115, 104.211.230.126, 104.211.230.129, 104.211.231.39 | 40.78.194.240 - 40.78.194.255, 13.71.125.22 |
| Southeast Asia | 13.67.91.135, 13.67.107.128, 13.67.110.109, 13.76.4.194, 13.76.5.96, 13.76.133.155, 52.163.228.93, 52.163.230.166 | 13.67.8.240 - 13.67.8.255, 52.187.68.19 |
| West Central US | 13.78.129.20, 13.78.137.179, 13.78.141.75, 13.78.148.140, 13.78.151.161, 52.161.18.218, 52.161.9.108, 52.161.27.190 | 13.71.195.32 - 13.71.195.47, 52.161.102.22 |
| West Europe | 13.95.147.65, 23.97.210.126, 23.97.211.179, 23.97.218.130, 40.68.209.23, 40.68.222.65, 51.144.182.201, 104.45.9.52 | 13.69.64.208 - 13.69.64.223, 52.174.88.118 |
| West India | 104.211.154.7, 104.211.154.59, 104.211.156.153, 104.211.158.123, 104.211.158.127, 104.211.162.205, 104.211.164.80, 104.211.164.136 | 104.211.146.224 - 104.211.146.239, 104.211.189.218 |
| West US | 40.83.164.80, 40.118.244.241, 40.118.241.243, 52.160.92.112, 104.42.38.32, 104.42.49.145, 157.56.162.53, 157.56.167.147 | 40.112.243.160 - 40.112.243.175, 104.42.122.49 |
| West US 2 | 13.66.201.169, 13.66.210.167, 13.66.246.219, 13.77.149.159, 52.175.198.132, 52.183.29.132, 52.183.30.169 | 13.66.140.128 - 13.66.140.143, 52.183.78.157 |
| UK South | 51.140.28.225, 51.140.73.85, 51.140.74.14, 51.140.78.44, 51.140.137.190, 51.140.142.28, 51.140.153.135, 51.140.158.24 | 51.140.148.0 - 51.140.148.15, 51.140.80.51 |
| UK West | 51.141.45.238, 51.141.47.136, 51.141.54.185, 51.141.112.112, 51.141.113.36, 51.141.114.77, 51.141.118.119, 51.141.119.63 | 51.140.211.0 - 51.140.211.15, 51.141.47.105 |
||||

## Next steps  

* Learn how to [create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md)  
* Learn about [common examples and scenarios](../logic-apps/logic-apps-examples-and-scenarios.md)
