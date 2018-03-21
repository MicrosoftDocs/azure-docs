---
title: Perform queries across Azure Log Analytics workspaces  | Microsoft Docs
description: This article describes how you can query across multiple workspaces and specific App Insights app in your subscription. 
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
ms.date: 02/15/2018
ms.author: magoedte

---

# How to perform queries across multiple Log Analytics workspaces

Previously with Azure Log Analytics, you could only analyze data from within the current workspace and it limited your ability to query across multiple workspaces defined in your subscription.  

Now you can query not only across multiple Log Analytics workspaces, but also data from a specific Application Insights app in the same resource group, another resource group, or another subscription. This provides you with a system-wide view of your data.  You can only perform this type of query in the [Advanced portal](log-analytics-log-search-portals.md#advanced-analytics-portal), not in the Azure portal.  

## Querying across Log Analytics workspaces and from Application Insights
To reference another workspace in your query, use the [*workspace*](https://docs.loganalytics.io/docs/Language-Reference/Scope-functions/workspace()) identifier, and for an app from Application Insights, use the [*app*](https://docs.loganalytics.io/docs/Language-Reference/Scope-functions/app()) identifier.  

For example, the first query returns summarized counts of updates needed by their classification from the Update table from both the current workspace, and another workspace named *contosoretail-it*.  The second query example returns a summarized count of requests made against an app named *fabrikamapp* in Application Insights. 

### Identifying workspace resources
Identifying a workspace can be performed one of several ways:

* Resource name - is a human-readable name of the workspace, sometimes referred to as *component name*. 

    `workspace("contosoretail").Update | count`
 
    >[!NOTE]
    >Identifying a workspace by its name assumes it is unique across all accessible subscriptions. If you have multiple applications with the specified name, the query fails because of the ambiguity. In this case, you must use one of the other identifiers.

* Qualified name - is the “full name” of the workspace, composed of the subscription name, resource group, and component name in this format: *subscriptionName/resourceGroup/componentName*. 

    `workspace('contoso/contosoretail/development').requests | count `

    >[!NOTE]
    >Because Azure subscription names are not unique, this identifier might be ambiguous. 
    >

* Workspace ID - A workspace ID is the unique, immutable, identifier assigned to each workspace represented as a globally unique identifier (GUID).

    `workspace("b438b4f6-912a-46d5-9cb1-b44069212ab4").Update | count`

* Azure Resource ID – the Azure-defined unique identity of the workspace. You use the Resource ID when the resource name is ambiguous.  For workspaces, the format is: */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/workspaces/componentName*.  

    For example:
    ``` 
    workspace("/subscriptions/e427267-5645-4c4e-9c67-3b84b59a6982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail").Event | count
    ```

### Identifying an application

Identifying an application in Application Insights can be performed with the *app(Identifier)* expression.  The *Identifier* argument specifies the app using one of the following:

* Resource name - is a human readable name of the app, sometimes referred to as the *component name*.  

    `app("fabrikamapp")`

* Qualified name - is the “full name” of the app, composed of the subscription name, resource group, and component name in this format: *subscriptionName/resourceGroup/componentName*. 

    `app("AI-Prototype/Fabrikam/fabrikamapp").requests | count`

     >[!NOTE]
    >Because Azure subscription names are not unique, this identifier might be ambiguous. 
    >

* ID - the app GUID of the application.

    `app("b438b4f6-912a-46d5-9cb1-b44069212ab4").requests | count`

* Azure Resource ID - the Azure-defined unique identity of the app. You use the Resource ID when the resource name is ambiguous. The format is: */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/components/componentName*.  

    For example:
    ```
    app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
    ```

## Next steps

Review the [Log Analytics log search reference](https://docs.loganalytics.io/docs/Language-Reference) to view all of the query syntax options available in Log Analytics.    