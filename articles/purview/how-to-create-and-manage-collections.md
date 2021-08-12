---
title: How to create and manage collections in Azure Purview
description: This article explains how to create and manage collections within Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 08/16/2021
ms.custom: template-how-to
---

# Creating and managing collections in Azure Purview

Collections in Purview can be used to organize assets and sources by your business' flow, but they are also the tool used to manage access across Purview. This guide will take you through the creation and management of these collections, as well as cover steps about how to register sources and add assets into your collections.

> [!NOTE]
> At this time, this quickstart only applies for Purview resources created on or after August 16th. Resources created before August 16th are able to create collections, but do not manage permissions through those collections. For information on creating a collection for a Purview resource created before August 16th, see our [**legacy collection guide**](#legacy-collection-guide) at the bottom of the page.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* An active [Purview resource](create-catalog-portal.md).

### Check permissions

In order to create and manage collections in Purview, you will need to be a **Collection Admin** within Purview. We can check these permissions in the [Purview Studio](use-purview-studio.md). You can find the studio by going to your Purview resource in the Azure portal, and selecting the "Open Purview Studio" tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.
:::image type="content" source="./media/quickstart-create-collection/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected." border="true":::
1. Select your root collection. This is the top collection in your collection list and will have the same name as your Purview resource. In our example below, it is called Contoso Purview. Alternatively-- if collections already exist you can select any collection you would like to create a collection under.
:::image type="content" source="./media/quickstart-create-collection/select-root-collection.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the root collection highlighted." border="true":::
1. Select role assignments in the collection window.
:::image type="content" source="./media/quickstart-create-collection/role-assignments.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the role assignments tab highlighted." border="true":::
1. To create a collection, you will need to be in the collection admin list under role assignments. If you created the Purview resource, you should be listed as a collection admin under the root collection already. If not, you will need to contact the collection admin to grant you permission.
:::image type="content" source="./media/quickstart-create-collection/collection-admins.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the collection admin section highlighted." border="true":::

## Collection management

### Create a collection

You will need to be a collection admin in order to create a collection. If you are not sure, follow the [guide above](#check-permissions) to check permissions.
 
1. Select Data Map > Collections from the left pane to open collection management page.
:::image type="content" source="./media/how-to-create-and-manage-collections/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected and open." border="true":::
1. Select “+ Add a collection”. Again, note that only [collection admins](#check-permissions) can manage collections.
1. In the right panel, enter the collection name and description. If needed you can also add users as collection admins to the new collection.
:::image type="content" source="./media/how-to-create-and-manage-collections/create-collection.png" alt-text="Screenshot of Purview studio window, showing the new collection window, with a display name and collection admins selected, and the create button highlighted." border="true":::
1. Select “Create”. The new collection's information will reflect on the page.
:::image type="content" source="./media/how-to-create-and-manage-collections/created-collection.png" alt-text="Screenshot of Purview studio window, showing the newly created collection window." border="true":::

### Edit a collection

1. Select 'Edit' either from the collection detail page, or from the collection's drop down menu.
:::image type="content" source="./media/how-to-create-and-manage-collections/edit-collection.png" alt-text="Screenshot of Purview studio window, open to collection window, with the 'edit' button highlighted both in the selected collection window, and under the ellipsis button next to the name of the collection." border="true":::
1. Currently collection description and collection admins can be edited. Make any changes, then select “Save” to save your change.
:::image type="content" source="./media/how-to-create-and-manage-collections/edit-description.png" alt-text="Screenshot of Purview studio window with the edit collection window open, a description added to the collection, and the save button highlighted." border="true":::

### View Collections

1. Select the triangle icon beside the collection's name to expand or collapse the collection hierarchy. Click the collection names to navigate.
:::image type="content" source="./media/how-to-create-and-manage-collections/view-collections.png" alt-text="Screenshot of Purview studio collection window, with triangle button next to collection highlighted." border="true":::
1. Type in the filter box at the top of the list to filter collections.
:::image type="content" source="./media/how-to-create-and-manage-collections/search-collections.png" alt-text="Screenshot of Purview studio collection window, with the search bar at the top of the list highlighted." border="true":::
1. Select “Refresh” in Root collection’s contextual menu to reload the collection list.
:::image type="content" source="./media/how-to-create-and-manage-collections/refresh-collections.png" alt-text="Screenshot of Purview studio collection window, with the button next to the Resource name selected, and the refresh button highlighted." border="true":::
1. Select “Refresh” in collection detail page to reload the single collection.
:::image type="content" source="./media/how-to-create-and-manage-collections/refresh-single-collection.png" alt-text="Screenshot of Purview studio collection window, with the refresh button under the collection window highlighted." border="true":::

## Adding roles and restricting access through collections

In Purview since permissions are managed through collections it is important to understand the roles and what permissions they will give your users. Users will have access on the collection levels they are assigned to, and can be assigned different permissions on different collections. Below the guide will discuss the roles, how to manage them, and permissions inheritance.

### Roles

All assigned roles apply to sources, assets, and other objects within the collection where the role is applied.

1. **Collection admins** - can edit the collection, its details, and add subcollections. They can also add data curators, data readers, and other Purview roles to a collection scope. Collection admins that are automatically inherited from a parent collection can't be removed.
1. **Data source admins** - can manage data sources and data scans.
1. **Data curators** - can perform create, read, modify, and delete actions on catalog data objects and establish relationships between objects.
1. **Data readers** - can access but not modify catalog data objects.

### Add role assignments

1. Select “Role assignments” tab to see all the roles in a collection. Only a collection admin can manage role assignments.
:::image type="content" source="./media/how-to-create-and-manage-collections/select-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab highlighted." border="true":::
1. Select “Edit role assignments” or the person icon to edit each role member.
:::image type="content" source="./media/how-to-create-and-manage-collections/edit-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the edit role assignments dropdown list selected." border="true":::
1. Type in the textbox to search for users you want to add to the role member. Select “X” to remove members you don't want to add.
:::image type="content" source="./media/how-to-create-and-manage-collections/remove-collection-admin.png" alt-text="Screenshot of Purview studio collection admins window, with the x button beside one of the names highlighted." border="true":::
1. Click “OK” to save your changes, and you will see the new users reflected in the role assignments list.

### Remove role assignments

1. Click “X” button next to a user's name to remove a role assignment.
:::image type="content" source="./media/how-to-create-and-manage-collections/remove-role-assignment.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab selected, and the x button beside one of the names highlighted." border="true":::
1. Select “Confirm” if you’re sure to remove the user.
:::image type="content" source="./media/how-to-create-and-manage-collections/confirm-remove.png" alt-text="Screenshot of a confirmation pop-up, with the confirm button highlighted." border="true":::

### Restrict inheritance

Collections permissions are inherited automatically from the parent collection. For example, any permissions on the root collection (the collection at the top of the list that has the same name as your Purview resource), will be inherited by all collections below it. You can restrict inheritance from a parent collection at any time, using the restrict inherited permissions option.

1. Select “Restrict inherited permissions” and click “Restrict access” in the popup dialog to remove inherited permissions from this collection and any subcollections. Note that collection admin permissions won’t be affected.
:::image type="content" source="./media/how-to-create-and-manage-collections/restrict-access-inheritance.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab selected, and the restrict inherited permissions slide button highlighted." border="true":::
1. After restriction, inherited members are removed from the roles expect for collection admin.
1. Click the “Restrict inherited permissions” toggle button to revert.
:::image type="content" source="./media/how-to-create-and-manage-collections/remove-restriction.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab selected, and the unrestrict inherited permissions slide button highlighted." border="true":::

## Adding assets to collections

1. Check the collection information in asset details. You can find collection information in the “Collection path” section on right-top corner of the asset details page.
:::image type="content" source="./media/how-to-create-and-manage-collections/collection-path.png" alt-text="Screenshot of Purview studio asset window, with the collection path highlighted." border="true":::
1. Permissions in asset details page:
    1. Please check the collection based permission model by following the [adding roles and restricting access on collections guide above](#adding-roles-and-restricting-access-through-collections).
    1. If you don’t have read permission on a collection, the assets under that collection will not be listed in search results. If you get the direct URL of one asset and open it, you will see the no access page. In this case please contact your Purview admin to grant you the access. You can click the “Refresh” button to check the permission again.
    :::image type="content" source="./media/how-to-create-and-manage-collections/no-access.png" alt-text="Screenshot of Purview studio asset window where the user has no permissions, and has no access to information or options." border="true":::
    1. If you have the read permission to one collection but don’t have the write permission, you can browse the asset details page, but the following operations are disabled:
        1. Edit the asset. The “Edit” button will be disabled.
        1. Delete the asset. The “Delete” button will be disabled.
        1. Move asset to another collection. The “...” button on the right-top corner of Collection path section will be hidden.
    :::image type="content" source="./media/how-to-create-and-manage-collections/read-access-only.png" alt-text="Screenshot of Purview studio asset window where the user has only read permissions, and has only partial access to options." border="true":::
    1. The assets in “Hierarchy” section are also affected by permissions. Assets without read permission will be grayed.
    :::image type="content" source="./media/how-to-create-and-manage-collections/hierarchy-permissions.png" alt-text="Screenshot of Purview studio hierarchy window where the user has only read permissions, and has no access to options." border="true":::

### Move asset to another collection

1. Click the “...” button on the right-top corner of Collection path section.
:::image type="content" source="./media/how-to-create-and-manage-collections/move-asset.png" alt-text="Screenshot of Purview studio asset window with the collection path highlighted and the ellipsis button next to collection path selected." border="true":::
1. Click the “Move to another collection” button.
1. In the right side panel, choose the target collection you want move to. Note that you can only see the collections where you have write permissions.
:::image type="content" source="./media/how-to-create-and-manage-collections/move-select-collection.png" alt-text="Screenshot of Purview studio pop-up window with the select a collection dropdown menu highlighted." border="true":::
1. Click “Move” button on the bottom of the window to move the asset.

### Move asset to another collection in batches

1. You can list all the assets in the same collection in the collection management page.
:::image type="content" source="./media/how-to-create-and-manage-collections/list-assets.png" alt-text="Screenshot of Purview studio collection window with the overview tab selected and the assets count box highlighted." border="true":::
1. Click the “Assets” card to see all the assets that belong to this collection.
:::image type="content" source="./media/how-to-create-and-manage-collections/assets-card.png" alt-text="Screenshot of Purview studio collection window with the overview tab selected and the assets card highlighted." border="true":::
1. Choose the assets that you want to move by check the check box in the first column of the table. The “Move” button in the command bar will be enabled if you selected at least one collection. Click the “Move” button to move the assets you selected to another collection.

## Search and browse by collections

### Search by collection

In Azure Purview, the search bar is located at the top of the Purview studio UX.
<!-- RESOLVE THESE IMAGES -->
:::image type="content" source="./media/how-to-search-catalog/purview-search-bar.png" alt-text="Screenshot showing the location of the Azure Purview search bar" border="true":::

When you click on the search bar, you can see your recent search history and recently accessed assets. Select "View all" to see all of the recently viewed assets.
<!-- RESOLVE THESE IMAGES -->
:::image type="content" source="./media/how-to-search-catalog/search-no-keywords.png" alt-text="Screenshot showing the search bar before any keywords have been entered" border="true":::
<!-- RESOLVE THESE IMAGES -->
Enter in keywords that help identify your asset such as its name, data type, classifications, and glossary terms. As you enter in keywords relating to your desired asset, Azure Purview displays suggestions on what to search and potential asset matches. To complete your search, click on "View search results" or press "Enter".
<!-- RESOLVE THESE IMAGES -->
:::image type="content" source="./media/how-to-search-catalog/search-keywords.png" alt-text="Screenshot showing the search bar as a user enters in keywords" border="true":::
<!-- RESOLVE THESE IMAGES -->
The search results page shows a list of assets that match the keywords provided in order of relevance. There are various factors that can affect the relevance score of an asset. You can filter down the list more by selecting specific collections, data stores, classifications, contacts, labels, and glossary terms that apply to the asset you are looking for.
<!-- RESOLVE THESE IMAGES -->
:::image type="content" source="./media/how-to-search-catalog/search-results.png" alt-text="Screenshot showing the results of a search" border="true":::

 Click on your desired asset to view the asset details page where you can view properties including schema, lineage, and asset owners.
:::image type="content" source="./media/how-to-create-and-manage-collections/search-by-collection.png" alt-text="Screenshot showing search results with collections." border="true":::

### Browse by collection

1. You can browse data assets, by selecting the `Browse assets` on the homepage.
:::image type="content" source="./media/how-to-create-and-manage-collections/browse-by-collection.png" alt-text="Screenshot of the catalog Purview studio window with the browse assets button highlighted." border="true":::
1. On the Browse asset page, select `By collection` pivot. Collections are listed with hierarchical table view. To further explore assets in each collection, click on the corresponding collection name.
:::image type="content" source="./media/how-to-create-and-manage-collections/by-collection-view.png" alt-text="Screenshot of the asset Purview studio window with the by collection tab selected."border="true":::
1. On the next page, the search results of the assets under selected collection will be show up. You can narrow the results by selecting the facet filters. Or you can see the assets under other collections by clicking on the sub/related collection names  
:::image type="content" source="./media/how-to-create-and-manage-collections/search-results-by-collection.png" alt-text="Screenshot of the catalog Purview studio window with the by collection tab selected."border="true":::
1. To view the details of an asset, click the asset name in the search result. Or you can check the assets and bulk edit them.
:::image type="content" source="./media/how-to-create-and-manage-collections/view-asset-details.png" alt-text="Screenshot of the catalog Purview studio window with the by collection tab selected and asset check boxes highlighted."border="true":::

## Register source to a collection

1. Select “Register” or register icon on collection node to register a data source. Note that only data source admin can register sources.
:::image type="content" source="./media/how-to-create-and-manage-collections/register-by-collection.png" alt-text="Screenshot of the data map Purview studio window with the register button highlighted both at the top of the page and under a collection."border="true":::
1. Fill in the data source name, and other source information.  It lists all the collections which you have scan permission on the bottom of the form. You can select one collection. All assets under this source will belong to the collection you select.
:::image type="content" source="./media/how-to-create-and-manage-collections/register-source.png" alt-text="Screenshot of the source registration window."border="true":::
1. The created data source will be put under the selected collection. Click “View details” to see the data source.
:::image type="content" source="./media/how-to-create-and-manage-collections/see-registered-source.png" alt-text="Screenshot of the data map Purview studio window with the newly added source card highlighted."border="true":::
1. Select “New scan” to create scan under the data source.
:::image type="content" source="./media/how-to-create-and-manage-collections/new-scan.png" alt-text="Screenshot of a source Purview studio window with the new scan button highlighted."border="true":::
1. Similarly, at the bottom of the form, you can select a collection, and all assets scanned will be included in the collection. 
Note that the collections listed here are restricted to subcollections of the data source collection. 
:::image type="content" source="./media/how-to-create-and-manage-collections/scan-under-collection.png" alt-text="Screenshot of a new scan window with the collection dropdown highlighted."border="true":::
1. Back to the collection, you will see one data source is linked to the collection.
:::image type="content" source="./media/how-to-create-and-manage-collections/source-under-collection.png" alt-text="Screenshot of the data map Purview studio window with the newly added source card highlighted in the map."border="true":::

## Legacy collection guide

> [!NOTE]
> This legacy collection guide is only for Purview resources created before August 16th. Resources created after that time should follow the guide above.

Legacy collections only organize sources in the data map, and do not manage permissions for these sources.

### Create a legacy collection

1. Select Data Map from the left pane to open the data map. Using the map view you can see your collections and the sources listed under them.
:::image type="content" source="./media/how-to-create-and-manage-collections/legacy-collection-view.png" alt-text="Screenshot of Purview studio window, opened to the Data Map." border="true":::
1. Select “+ New collection”.
:::image type="content" source="./media/how-to-create-and-manage-collections/legacy-collection-create.png" alt-text="Screenshot of Purview studio window, opened to the Data Map with + New collection highlighted." border="true":::
1. Name your collection and select a parent or 'None'. Select “Create”. The collection information will reflect on the data map.
:::image type="content" source="./media/how-to-create-and-manage-collections/legacy-collection-name.png" alt-text="Screenshot of Purview studio window, showing the new collection window." border="true":::

## Next steps
Now that you have a collection, you can follow these guides below to add resources, scan, and manage your collections.

- [Manage data sources](manage-data-sources.md)
- [Supported data sources](purview-connector-overview.md)
