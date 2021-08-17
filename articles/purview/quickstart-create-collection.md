---
title: Create a collection
description: This article describes how to create a collection and add permissions and sources in Azure Purview
author: viseshag
ms.author: viseshag
ms.service: purview
ms.topic: quickstart
ms.date: 08/16/2021
ms.custom: template-quickstart 
---

# Quickstart: Create a collection and assign permissions in Purview

> [!NOTE]
> At this time, this quickstart only applies for Purview instances created on or after August 18th. Instances created before August 18th are able to create collections, but do not manage permissions through those collections. For information on creating a collection for a Purview instance created before August 18th, see our [**legacy collection guide**](#legacy-collection-guide) at the bottom of the page.

Collections are Purview's tool to manage ownership and access control across assets, sources, and information. They also organize your sources and assets into categories that are customized to your team or business to match your management experience with your data. This guide will take you through setting up your first collection and collection admin to prepare your Purview environment for your organization.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* An active [Purview resource](create-catalog-portal.md).

## Check permissions

In order to create and manage collections in Purview, you will need to be a **Collection Admin** within Purview. We can check these permissions in the [Purview Studio](use-purview-studio.md). You can find the studio by going to your Purview resource in the Azure portal, and selecting the "Open Purview Studio" tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.
:::image type="content" source="./media/quickstart-create-collection/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected." border="true":::
1. Select your root collection. This is the top collection in your collection list and will have the same name as your Purview resource. In our example below, it is called Contoso Purview. Alternatively-- if collections already exist you can select any collection you would like to create a collection under.
:::image type="content" source="./media/quickstart-create-collection/select-root-collection.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the root collection highlighted." border="true":::
1. Select role assignments in the collection window.
:::image type="content" source="./media/quickstart-create-collection/role-assignments.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the role assignments tab highlighted." border="true":::
1. To create a collection, you will need to be in the collection admin list under role assignments. If you created the Purview resource, you should be listed as a collection admin under the root collection already. If not, you will need to contact the collection admin to grant you permission.
:::image type="content" source="./media/quickstart-create-collection/collection-admins.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the collection admin section highlighted." border="true":::

## Create a collection in the portal

To create your collection, we will start in the [Purview Studio](use-purview-studio.md). You can find the studio by going to your Purview resource in the Azure portal, and selecting the "Open Purview Studio" tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.
:::image type="content" source="./media/quickstart-create-collection/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected." border="true":::
1. Select “+ Add a collection”. Note that only collection admin can manage collections.
1. In the right panel, enter the collection name, description, and search for users to add them as collection admins.
:::image type="content" source="./media/quickstart-create-collection/create-collection.png" alt-text="Screenshot of Purview studio window, showing the new collection window, with a display name and collection admins selected, and the create button highlighted." border="true":::
1. Select “Create”. The collection information will reflect on the page.
:::image type="content" source="./media/quickstart-create-collection/created-collection.png" alt-text="Screenshot of Purview studio window, showing the newly created collection window." border="true":::

## Assign permissions to collection

Now that you have a collection, you can assign permissions to this collection to manage your users access to Purview.

### Roles

All assigned roles apply to sources, assets, and other objects within the collection where the role is applied.

- **Collection admins** - can edit a collection, its details, manage access in the collection, and add subcollections.
- **Data source admins** - can manage data sources and data scans.
- **Data curators** - can create, read, modify, and delete actions on catalog data objects.
- **Data readers** - can access but not modify catalog data objects.

### Assign permissions

1. Select “Role assignments” tab to see all the roles in a collection.
:::image type="content" source="./media/quickstart-create-collection/select-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab highlighted." border="true":::
1. Select “Edit role assignments” or the person icon to edit each role member.
:::image type="content" source="./media/quickstart-create-collection/edit-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the edit role assignments dropdown list selected." border="true":::
1. Type in the textbox to search for users you want to add to the role member. Click “OK” to save the change.

## Legacy collection guide

> [!NOTE]
> This legacy collection guide is only for Purview instances created before August 18th. Instances created after that time should follow the guide above.

### Create a legacy collection

1. Select Data Map from the left pane to open the data map. Using the map view you can see your collections and the sources listed under them.
:::image type="content" source="./media/quickstart-create-collection/legacy-collection-view.png" alt-text="Screenshot of Purview studio window, opened to the Data Map." border="true":::
1. Select “+ New collection”.
:::image type="content" source="./media/quickstart-create-collection/legacy-collection-create.png" alt-text="Screenshot of Purview studio window, opened to the Data Map with + New collection highlighted." border="true":::
1. Name your collection and select a parent or 'None'. Select “Create”. The collection information will reflect on the data map.
:::image type="content" source="./media/quickstart-create-collection/legacy-collection-name.png" alt-text="Screenshot of Purview studio new collection pop-up." border="true":::

## Next steps

Now that you have a collection, you can follow these guides below to add resources, scan, and manage your collections.

[Register source to collection](how-to-create-and-manage-collections.md#register-source-to-a-collection)
[Access management through collections](how-to-create-and-manage-collections.md#adding-roles-and-restricting-access-through-collections)
