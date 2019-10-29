---
title: Create and share a query in Azure portal
description: In this tutorial, learn to create a Resource Graph Query and share it with others in the Azure portal.
author: DCtheGeek
ms.author: dacoulte
ms.date: 10/23/2019
ms.topic: tutorial
ms.service: resource-graph
---
# Tutorial: Create and share an Azure Resource Graph query in Azure portal

Azure Resource Graph Explorer lets you save your Resource Graph queries right in Azure portal. There
are two types of queries, _Private_ and _Shared_. A _Private_ query is saved in your Azure portal
settings, but a _Shared_ query is a Resource Manager resource that can be managed with role-based
access controls (RBAC) and protected with resource locks.

Saving queries in Azure portal saves your time spent looking for your favorite or commonly used
queries. When sharing queries, you enable your team to be consistent and repeatable. In this
tutorial, you'll complete these steps:

> [!div class="checklist"]
> - Create and delete a _Private_ query
> - Create a _Shared_ query
> - Discover _Shared_ queries
> - Delete a _Shared_ query

## Prerequisites

To complete this tutorial, you need an Azure subscription. If you don't have an Azure subscription,
create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create and delete a Private query

_Private_ queries are only accessible or visible to the account that creates them. As they're saved
in an account's Azure portal settings, they can only be created, used, and deleted from inside Azure
portal. A _Private_ query isn't a Resource Manager resource. Create a new _Private_ query by
following these steps:

1. From the portal menu, select 'All services' or use the Azure search box at the top of all pages.
   Search for and select 'Resource Graph Explorer'.

1. In the 'Query 1' tab on the Azure Resource Graph Explorer page, enter the following query. For
   information about this query, see
   [Samples - Count virtual machines by OS type](../samples/starter.md#count-virtual-machines-by-os-type).
   Select **Run query** to see the query results in th lower pane.

   ```kusto
   Resources
   | where type =~ 'Microsoft.Compute/virtualMachines'
   | summarize count() by tostring(properties.storageProfile.osDisk.osType)
   ```

1. Select **Save** or **Save as**, enter the _Name_ as 'Count VMs by OS', leave _Type_ as 'Private
   query', then select **Save** at the bottom of the _Save query_ pane. The title of the tab changes
   from 'Query 1' to 'Count VMs by OS'.

1. Browse away from Azure Resource Graph Explorer in Azure portal and then return to it. The saved
   query is no longer displayed and the 'Query 1' tab has returned.

1. Select **Open a query**. Check that _Type_ is 'Private query'. The saved 'Count VMs by OS' now
   appears in the _Query Name_ list. Select the title link of the saved query and it's loaded into a
   new tab with that queries name.

   > [!NOTE]
   > When a saved query is open and the tab shows it's _Name_, the **Save** button updates it with
   > any changes made. To create a new saved query, use **Save as** and follow the steps as if it
   > was a brand new saved query.

1. To delete the saved query, select **Open a query** again, and check that _Type_ is 'Private
   query'. On the row of the saved 'Count VMs by OS' query, select the trash can icon. On the
   confirmation dialog, select **Yes** to complete the deletion of the query. Then close the _Open a
   query_ pane.

## Create a Shared query

Unlike a _Private_ query, a _Shared_ query is a Resource Manager resource. This fact means the query
gets saved to a resource group, can be managed and controlled with RBAC, and even protected with
resource locks. As a resource, anyone with appropriate permissions can see and use it. Create a new
_Shared_ query by following these steps:

1. From the portal menu, select 'All services' or use the Azure search box at the top of all pages.
   Search for and select 'Resource Graph Explorer'.

1. In the 'Query 1' tab on the Azure Resource Graph Explorer page, enter the following query. For
   information about this query, see
   [Samples - Count virtual machines by OS type](../samples/starter.md#count-virtual-machines-by-os-type).
   Select **Run query** to see the query results in the lower pane.

   ```kusto
   Resources
   | where type =~ 'Microsoft.Compute/virtualMachines'
   | summarize count() by tostring(properties.storageProfile.osDisk.osType)
   ```

1. Select **Save** or **Save as**.

   ![Save the new query using the save button](../media/create-share-query/save-shared-query-buttons.png)

1. In the _Save query_ pane, enter the _Name_ as 'Count VMs by OS', change _Type_ to 'Shared query',
   set _Description_ to 'Count of virtual machines by OS type', and select the _Subscription_ where
   the query resource gets created. Leave the 'Publish to resource-graph-queries resource group'
   checkbox checked and the _Resource Group location_ set to '(US) West Central US'. Then select
   **Save** at the bottom of the _Save query_ pane. The title of the tab changes from 'Query 1' to
   'Count VMs by OS'. The first time 'resource-graph-queries' resource group is used, the save takes
   longer as the resource group is created.

   ![Save the new query as a Shared Query](../media/create-share-query/save-shared-query-window.png)

   > [!NOTE]
   > If desired, remove the check to provide the name of an existing resource group to save the
   > shared query into. Using the default named resource group for queries makes _Shared_ queries
   > easier to discover. It also makes more apparent the purpose of that resource group. However,
   > selecting an existing resource group may be done for security reasons based on existing
   > permissions.

1. Browse away from Azure Resource Graph Explorer in Azure portal and then return to it. The saved
   query is no longer displayed and the 'Query 1' tab has returned.

1. Select **Open a query**. Check that _Type_ is 'Shared query' and the combination of
   _Subscription_ and _Resource group_ match where you saved the query. The saved 'Count VMs by OS'
   now appears in the _Query Name_ list. Select the title link of the saved query and it's loaded
   into a new tab with that queries name. As a _Shared_ query, it displays an icon in the tab next
   to the title denoting it as shared.

   ![Show the Shared Query with icon](../media/create-share-query/show-saved-shared-query.png)

   > [!NOTE]
   > When a saved query is open and the tab shows it's _Name_, the **Save** button updates it with
   > any changes made. To create a new saved query, use **Save as** and follow the steps as if it
   > was a brand new saved query.

## Discover Shared queries

As a _Shared_ query is a Resource Manager resource, there are several ways to find them:

- From Resource Graph Explorer, select **Open a query** and set _Type_ to 'Shared query'
- The Resource Graph queries portal page
- The resource group it was saved in
- With a query to Resource Graph

### View Resource Graph queries

In Azure portal, the Resource Graph queries page displays _Shared_ queries that the logged in
account has access to. This page allows filtering by name, subscription, resource group, and other
properties of the Resource Graph query. Resource Graph queries can also be tagged, exported, and
deleted using this interface.

Selecting one of the queries opens the Resource Graph query page. Like other Resource Manager
resources, this page offers an interactive overview along with the Activity log, access control, and
tags. A resource lock can also be applied directly from this page.

Get to the Resource Graph queries page from the portal menu by selecting 'All services' or using the
Azure search box at the top of all pages. Search for and select 'Resource Graph Explorer'.

### List Resource groups resources

The Resource Graph query is listed alongside other resources that are part of a resource group.
Selecting the Resource Graph query opens the page for that query. The ellipsis or right-click
options work the same as the Resource Graph query page.

### Query Resource Graph

As a Resource Manager resource, Resource Graph queries can be found with a query to Resource Graph.
The following Resource Graph query limits by type `Microsoft.ResourceGraph/queries`, and then uses
`project` to list only the name, time modified, and the query itself:

```kusto
Resources
| where type == "microsoft.resourcegraph/queries"
| project name, properties.timeModified, properties.query
```

## Delete a Shared query

If a _Shared_ query is no longer needed, delete it. Deleting a _Shared_ query removes the actual
Resource Manager resource. Any dashboards the results chart was pinned to now display an error
message. When that error message is displayed, use the **Remove from dashboard** button to clean up
your dashboard.

A _Shared_ query can be deleted from the following interfaces:
- Resource Graph queries page
- Resource Graph query page
- Resource Graph Explorer's Open a query page
- Resource groups page

## Clean up resources

When you're finished with this tutorial, delete the _Private_ and _Shared_ queries you created if
you no longer want them.

## Next steps

- Run your first query with [Azure portal](../first-query-portal.md)
- Get more information about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)
- See samples of [Starter queries](../samples/starter.md)
- See samples of [Advanced queries](../samples/advanced.md)
- Provide feedback on [UserVoice](https://feedback.azure.com/forums/915958-azure-governance)