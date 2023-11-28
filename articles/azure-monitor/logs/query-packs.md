---
title: Query packs in Azure Monitor
description: Query packs in Azure Monitor provide a way to share collections of log queries in multiple Log Analytics workspaces. 
ms.subservice: logs
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: roygal
ms.date: 06/22/2022

---

# Query packs in Azure Monitor Logs
Query packs act as containers for log queries in Azure Monitor. They let you save log queries and share them across workspaces and other contexts in Log Analytics.

## Permissions
You can set the permissions on a query pack when you view it in the Azure portal. You need the following permissions to use query packs:

- **Reader**: Users can see and run all queries in the query pack.
- **Contributor**: Users can modify existing queries and add new queries to the query pack.

  > [!IMPORTANT]
  > When a user needs to modify or add queries, always grant the user the Contributor permission on the `DefaultQueryPack`. Otherwise, the user won't be able to save any queries to the subscription, including in other query packs.

## View query packs
You can view and manage query packs in the Azure portal from the **Log Analytics query packs** menu. Select a query pack to view and edit its permissions. This article describes how to create a query pack by using the API.
<!-- convertborder later -->
:::image type="content" source="media/query-packs/view-query-pack.png" lightbox="media/query-packs/view-query-pack.png" alt-text="Screenshot that shows query packs." border="false":::

## Default query pack
Azure Monitor automatically creates a query pack called `DefaultQueryPack` in each subscription in a resource group called `LogAnalyticsDefaultResources` when you save your first query. You can save queries to this query pack or create other query packs depending on your requirements.

## Use multiple query packs

The default query pack is sufficient for most users to save and reuse queries. You might want to create multiple query packs for users in your organization if, for example, you want to load different sets of queries in different Log Analytics sessions and provide different permissions for different collections of queries.

When you [create a new query pack](#create-a-query-pack), you can add tags that classify queries based on your business needs. For example, you could tag a query pack to relate it to a particular department in your organization or to severity of issues that the included queries are meant to address. By using tags, you can create different sets of queries intended for different sets of users and different situations.

To add query packs to your Log Analytics workspace: 

1. Open Log Analytics and select **Queries** in the upper-right corner.
1. In the upper-left corner on the **Queries** dialog, next to **Query packs**, click **0 selected**.
1. Select the query packs that you want to add to the workspace.

:::image type="content" source="media/query-packs/log-analytics-add-query-pack.png" alt-text="Screenshot that shows the Select query packs page in Log Analytics, where you can add query packs to a Log Analytics workspace." lightbox="media/query-packs/log-analytics-add-query-pack.png":::

> [!IMPORTANT]
> You can add up to five query packs to a Log Analytics workspace.

## Create a query pack
You can create a query pack by using the REST API or from the **Log Analytics query packs** pane in the Azure portal. To open the **Log Analytics query packs** pane in the portal, select **All services** > **Other**.

### Create a token
You must have a token for authentication of the API request. There are multiple methods to get a token. One method is to use `armclient`.

First, sign in to Azure by using the following command:

```
armclient login
```

Then create the token by using the following command. The token is automatically copied to the clipboard so that you can paste it into another tool.

```
armclient token
```

### Create a payload
The payload of the request is the JSON that defines one or more queries and the location where the query pack should be stored. The name of the query pack is specified in the API request described in the next section.

```json
{
    "location": "eastus",
    "properties":
    {
        "displayName": "Query name that will be displayed in the UI",
        "description": "Query description that will be displayed in the UI",
        "body": "<<query text, standard KQL code>>",
        "related": {
            "categories": [
                "workloads"
            ],
            "resourceTypes": [
                "microsoft.insights/components"
            ],
            "solutions": [
                "logmanagement"
            ]
        },
        "tags": {
            "Tag1": [
                "Value1",
                "Value2"
            ]
        }
    }
}
```

Each query in the query pack has the following properties:

| Property | Description |
|:---|:---|
| `displayName` | Display name listed in Log Analytics for each query. |
| `description` | Description of the query displayed in Log Analytics for each query. |
| `body`        | Query written in Kusto Query Language. |
| `related`    | Related categories, resource types, and solutions for the query. Used for grouping and filtering in Log Analytics by the user to help locate their query. Each query can have up to 10 of each type. Retrieve allowed values from https://api.loganalytics.io/v1/metadata?select=resourceTypes, solutions, and categories. |
| `tags`        | Other tags used by the user for sorting and filtering in Log Analytics. Each tag will be added to Category, Resource Type, and Solution when you [group and filter queries](queries.md#find-and-filter-queries). |

### Create a request
Use the following request to create a new query pack by using the REST API. The request should use bearer token authorization. The content type should be `application/json`.

```rest
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/querypacks/my-query-pack?api-version=2019-09-01
```

Use a tool that can submit a REST API request, such as Fiddler or Postman, to submit the request by using the payload described in the previous section. The query ID will be generated and returned in the payload.

## Update a query pack
To update a query pack, submit the following request with an updated payload. This command requires the query pack ID.

```rest
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/querypacks/my-query-pack/queries/query-id/?api-version=2019-09-01
```

## Next steps

See [Using queries in Azure Monitor Log Analytics](queries.md) to see how users interact with query packs in Log Analytics.
