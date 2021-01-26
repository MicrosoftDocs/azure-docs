---
title: Manage watchlists in Azure Sentinel using REST API | Microsoft Docs
description: This article describes how Azure Sentinel watchlists can be managed using Log Analytics’ REST API to create, modify, and delete watchlists and their items.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: reference
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/11/2021
ms.author: yelevin
---

# Manage watchlists in Azure Sentinel using REST API

> [!IMPORTANT]
> The watchlists feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel, being built in part on Azure Monitor Log Analytics, lets you use Log Analytics’ REST API to manage watchlists. This document shows you how to create, modify, and delete watchlists and their items using the REST API.  Watchlists created in this way will be displayed in the Azure Sentinel UI.

## Common URI parameters

The following are the common URI parameters for all watchlist API commands:

| Name | In | Required | Type | Description |
|-|-|-|-|-|
| **{subscriptionId}** | path | yes | GUID | the Azure subscription ID |
| **{resourceGroupName}** | path | yes | string | the name of the resource group within the subscription |
| **{workspaceName}** | path | yes | string | the name of the Log Analytics workspace |
| **{watchlistAlias}** | path | yes* | string | the name of a given watchlist<br>\* Not required when retrieving all watchlists |
| **{watchlistItemId}** | path | yes** | GUID | the ID of the item to create in, add to, or delete from the watchlist<br>\*\* Required only for watchlist item commands |
| **{api-version}** | query | yes | string | the version of the protocol used to make this request. As of October 29, 2020, the Watchlist API version is *2019-01-01-preview* |
| **{bearerToken}** | authorization | yes | token | the bearer authorization token |
|  

## Retrieve all watchlists

This command retrieves all watchlists associated with a workspace, without their items.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| GET | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists?api-version={{api-version}}` |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | List of existing watchlists, or empty if no watchlist found |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
|

## Look up a watchlist by name

This command retrieves a specific watchlist associated with a workspace, without its items.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| GET | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists/{{watchlistAlias}}?api-version={{api-version}}` |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | The requested watchlist |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
| 404 / Not found |  | No watchlist found with the requested name |
|

## Create a watchlist

This command creates a watchlist and adds items to it. It takes two calls to this endpoint to create the watchlist and its items: the first one will create the watchlist (parent), and the second will add the items.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| PUT | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists/{{watchlistAlias}}?api-version={{api-version}}` |
|

### Request body

Here's a sample of the request body of a watchlist create request:

```json
{
    "properties": {
        "displayName": "High Value Assets Watchlist",
        "source": "Local file",
        "provider": "Microsoft",
        "numberOfLinesToSkip":"1",
        "rawContent": "metadata line\nheader1, header2\nval1, val2",
        "contentType": "text/csv"
    }
}
```

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | The watchlist created by the request, without items |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
| 409 / Conflict |  | Operation failed, there is an existing watchlist with the same alias |
|

## Delete a watchlist

This command deletes a watchlist and its items.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| DELETE | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists/{{watchlistAlias}}?api-version={{api-version}}` |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | Empty response body |  |
| 204 / No content | Empty response body | Nothing deleted |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
|

## Add or update a watchlist item

When this command is run on an existing *watchlisItemId* (a GUID), it will update the item with the data provided in the request body. Otherwise, a new item will be created.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| PUT | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists/{{watchlistAlias}}/`<br>`watchlistitems/{{watchlistItemId}}?api-version={{api-version}}` |
|

### Request body

Here's a sample of the request body of a watchlist item add/update request:

```json
{
    "properties": {
      "itemsKeyValue": {
           "Gateway subnet": "10.0.255.224/27",
           "Web Tier": "10.0.1.0/24",
           "Business tier": "10.0.2.0/24",
           "Private DMZ in": "10.0.0.0/27",
           "Public DMZ out": "10.0.0.96/27"
      }
}
}
```

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | The watchlist item created or updated by the request |  |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
| 409 / Conflict |  | Operation failed, there is an existing watchlist with the same alias |
|

## Delete a watchlist item

This command deletes an existing watchlist item.

### Request URI
(URI is a single line, broken up for easy readability)

| Method | Request URI |
|-|-|
| DELETE | `https://management.azure.com/subscriptions/{{subscriptionId}}/`<br>`resourceGroups/{{resourceGroupName}}/`<br>`providers/Microsoft.OperationalInsights/`<br>`workspaces/{{workspaceName}}/`<br>`providers/Microsoft.SecurityInsights/`<br>`watchlists/{{watchlistAlias}}/`<br>`watchlistitems/{{watchlistItemId}}?api-version={{api-version}}` |
|

### Responses

| Status code | Response body | Description |
|-|-|-|
| 200 / OK | Empty response body |  |
| 204 / No content | Empty response body | Nothing deleted |
| 400 / Bad request |  | Malformed request syntax, invalid request parameter... |
|

## Next steps

In this article, you learned how to manage watchlists and their items in Azure Sentinel using the Log Analytics API. To learn more about Azure Sentinel, see the following articles:

- Learn more about [watchlists](watchlists.md)
- Explore other uses of the [Azure Sentinel API](/rest/api/securityinsights/)