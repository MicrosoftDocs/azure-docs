---
title: Manage hunting and livestream queries in Microsoft Sentinel using REST API | Microsoft Docs
description: This article describes how Microsoft Sentinel hunting features enable you to take advantage Log Analytics’ REST API to manage hunting and livestream queries.
author: yelevin
ms.topic: reference
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
ms.author: yelevin
---

# Manage hunting and livestream queries in Microsoft Sentinel using REST API

Microsoft Sentinel, being built in part on Azure Monitor Log Analytics, lets you use Log Analytics’ REST API to manage hunting and livestream queries. This document shows you how to create and manage hunting queries using the REST API.  Queries created in this way will be displayed in the Microsoft Sentinel UI.

See the definitive REST API reference for more details on the [saved searches API](/rest/api/loganalytics/savedsearches).

## API examples

In the following examples, replace these placeholders with the replacement prescribed in the following table:

| Placeholder | Replace with |
|-|-|
| **{subscriptionId}** | the name of the subscription to which you are applying the hunting or livestream query. |
| **{resourceGroupName}** | the name of the resource group to which you are applying the hunting or livestream query. |
| **{savedSearchId}** | a unique id (GUID) for each hunting query. |
| **{WorkspaceName}** | the name of the Log Analytics workspace that is the target of the query. |
| **{DisplayName}** | a display name of your choice for the query. |
| **{Description}** | a description of the hunting or livestream query. |
| **{Tactics}** | the relevant MITRE ATT&CK tactics that apply to the query. |
| **{Query}** | the query expression for your query. |
|  

### Example 1

This example shows you how to create or update a hunting query for a given Microsoft Sentinel workspace.  For a livestream query, replace *“Category”: “Hunting Queries”* with *“Category”: “Livestream Queries”* in the **request body**: 

#### Request header

```http
PUT https://management.azure.com/subscriptions/{subscriptionId} _
    /resourcegroups/{resourceGroupName} _
    /providers/Microsoft.OperationalInsights/workspaces/{workspaceName} _
    /savedSearches/{savedSearchId}?api-version=2020-03-01-preview
```

#### Request body

```json
{
"properties": {
    “Category”: “Hunting Queries”,
    "DisplayName": "HuntingRule02",
    "Query": "SecurityEvent | where EventID == \"4688\" | where CommandLine contains \"-noni -ep bypass $\"",
    “Tags”: [
        { 
        “Name”: “Description”,
        “Value”: “Test Hunting Query”
        },
        { 
        “Name”: “Tactics”,
        “Value”: “Execution, Discovery”
        }
        ]        
    }
}
```

### Example 2

This example shows you how to delete a hunting or livestream query for a given Microsoft Sentinel workspace:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId} _
       /resourcegroups/{resourceGroupName} _
       /providers/Microsoft.OperationalInsights/workspaces/{workspaceName} _
       /savedSearches/{savedSearchId}?api-version=2020-03-01-preview
```

### Example 3

This example shows you to retrieve a hunting or livestream query for a given workspace:

```http
GET https://management.azure.com/subscriptions/{subscriptionId} _
    /resourcegroups/{resourceGroupName} _
    /providers/Microsoft.OperationalInsights/workspaces/{workspaceName} _
    /savedSearches/{savedSearchId}?api-version=2020-03-01-preview
```

## Next steps

In this article, you learned how to manage hunting and livestream queries in Microsoft Sentinel using the Log Analytics API. To learn more about Microsoft Sentinel, see the following articles:

- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
