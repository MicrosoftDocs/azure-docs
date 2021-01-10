---
title: Manage hunting and livestream queries in Azure Sentinel using REST API | Microsoft Docs
description: This article describes how Azure Sentinel hunting features enable you to take advantage Log Analytics’ REST API to manage hunting and livestream queries.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/06/2020
ms.author: yelevin
---

# Manage hunting and livestream queries in Azure Sentinel using REST API

Azure Sentinel, being built in part on Azure Monitor Log Analytics, lets you use Log Analytics’ REST API to manage hunting and livestream queries. This document shows you how to create and manage hunting queries using the REST API.  Queries created in this way will be displayed in the Azure Sentinel UI.

See the definitive REST API reference for more details on the [saved searches API](/rest/api/loganalytics/savedsearches).

## Common URI parameters

In the following examples, replace these placeholders with the replacement prescribed in the following table:

| Name | In | Required | Type | Description |
|-|-|-|-|-|
| **{endpoint}** | path | yes | string | the Resource Provider (RP) environment<br>**(need a different example)**
| **{subscriptionId}** | path | yes | GUID | the Azure subscription ID |
| **{resourceGroupName}** | path | yes | string | the name of the resource group within the subscription |
| **{workspaceName}** | path | yes | string | the name of the Log Analytics workspace |
| **{watchlistAlias}** | path | yes* | string | a display name of your choice for the watchlist |
| **{watchlistItemId}** | path | yes** | GUID | the ID of the item to create in or add to the watchlist |
| **{api-version}** | query | yes | string | the version of the protocol used to make this request. As of 10/29/2020, the Watchlist API version is *2019-01-01-preview* |
| **{bearerToken}** | authorization | yes | token | the bearer authorization token |
|  

## Retrieve all watchlists

This example shows you how to retrieve all watchlists associated with a workspace, without their items.

### Request URI

```http
GET https://{{endpoint}}/subscriptions/{{subscriptionId}} _
    /resourceGroups/{{resourceGroupName}} _
    /providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}} _
    /providers/Microsoft.SecurityInsights/watchlists?api-version={{api-version}}
```

| Method | Request URI |
|-|-|
| GET | https://{{**endpoint**}}/subscriptions/{{**subscriptionId**}}/resourceGroups/{{**resourceGroupName**}}/providers/Microsoft.OperationalInsights/workspaces/{{**workspaceName**}}/providers/Microsoft.SecurityInsights/watchlists?api-version={{**api-version**}} |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | List of existing watchlists, or empty if no watchlist found |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
|

## Lookup a watchlist by alias

This example shows you how to retrieve a specific watchlist associated with a workspace, without its items.

| Method | Request URI |
|-|-|
| GET | https://{{**endpoint**}}/subscriptions/{{**subscriptionId**}}/resourceGroups/{{**resourceGroupName**}}/providers/Microsoft.OperationalInsights/workspaces/{{**workspaceName**}}/providers/Microsoft.SecurityInsights/watchlists/{{**watchlistAlias**}}?api-version={{**api-version**}} |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | List of existing watchlists, or empty if no watchlist found |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
|


### Example 3

This example shows you to retrieve a hunting or livestream query for a given workspace:

```http
GET https://management.azure.com/subscriptions/{subscriptionId} _
    /resourcegroups/{resourceGroupName} _
    /providers/Microsoft.OperationalInsights/workspaces/{workspaceName} _
    /savedSearches/{savedSearchId}?api-version=2020-03-01-preview
```

## Next steps

In this article, you learned how to manage hunting and livestream queries in Azure Sentinel using the Log Analytics API. To learn more about Azure Sentinel, see the following articles:

- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)