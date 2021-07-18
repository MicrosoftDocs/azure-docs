---
title: Enrich entities in Azure Sentinel with Geolocation data via REST API | Microsoft Docs
description: This article describes how you can enrich entities in Azure Sentinel with Geolocaiton data using the Microsoft Threat Intelligence REST API.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: reference
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/18/2021
ms.author: bagol
---

# Enrich entities in Azure Sentinel with Geolocation data via REST API

This article shows you how to enrich entities in Azure Sentinel with Geolocation data using the REST API.

> [!IMPORTANT]
> This feature is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>


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

This example shows you how to create or update a hunting query for a given Azure Sentinel workspace.  For a livestream query, replace *“Category”: “Hunting Queries”* with *“Category”: “Livestream Queries”* in the **request body**: 

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

This example shows you how to delete a hunting or livestream query for a given Azure Sentinel workspace:

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

In this article, you learned how to manage hunting and livestream queries in Azure Sentinel using the Log Analytics API. To learn more about Azure Sentinel, see the following articles:

- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)