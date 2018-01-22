---
title: Perform queries across Azure Log Analytics workspaces  | Microsoft Docs
description: This article describes how you can query across multiple workspaces in your subscription with examples to follow. 
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2017
ms.author: magoedte

---

# Perform queries across multiple Log Analytics workspaces

Previously with Azure Log Analytics, you could only analyze data from within the current workspace and this limited your ability to query across multiple workspaces defined in your subscription.  

Now you can query across multiple workspaces, providing a system-wide view of your data.  You can only perform this type of query in the [Advanced portal](log-analytics-log-search-portals.md#advanced-analytics-portal), not in the Azure portal.  

## Querying across Log Analytics workspaces
To reference another workspace in your query, use the *workspace* identifier.  For example, the following query returns summarized counts of updates needed by their classification from the Update table from both the current workspace, and another workspace named *contosoretail-it*.  


## Identifying resources
Identifying a workspace can be performed one of several ways:

* Resource name - is a human-readable name of the workspace, sometimes referred to as *component name*. 

    `workspace("contosoretail").Update | count`
 
    >[!NOTE]
    >Identifying a workspace by its name assumes it is unique across all accessible subscriptions. If you have multiple applications with the specified name, the query fails because of the ambiguity. In this case you must use one of the other identifiers.

* Qualified Name - is the “full name” of the workspace, composed of the subscription name, resource group and component name in this format: *subscriptionName/resourceGroup/componentName*. 

    `workspace('contoso/contosoretail/development').requests | count `

    >[!NOTE]
    >Because Azure subscription names are not unique, this identifier might be ambiguous. 
    >

* workspace ID - A workspace ID is the unique, immutable, identifier assigned to each workspace represented as a globally unique identifier (GUID).

    `workspace("b438b4f6-912a-46d5-9cb1-b44069212ab4").Update | count`

* Azure Resource ID – the Azure-defined unique identity of the workspace. You use this when the resource name is ambiguous.  For workspaces, the format is: */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/workspaces/componentName*.  

    For example:
    ``` 
    `workspace("/subscriptions/e427267-5645-4c4e-9c67-3b84b59a6982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail").Event | count
    ```

## Next steps

Review the [Log Analytics log search reference](https://docs.loganalytics.io/docs/Language-Reference) to view all of the query syntax options available in Log Analytics.    