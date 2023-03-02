---
title: 'Quickstart: Create a collection'
description: Collections are used for access control, and asset organization in the Microsoft Purview Data Map. This article describes how to create a collection and add permissions, register sources, and register assets to collections.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: quickstart
ms.date: 06/17/2022
ms.custom: template-quickstart, mode-other
---

# Quickstart: Create a collection and assign permissions in the Microsoft Purview Data Map

Collections are the Microsoft Purview Data Map's tool to manage ownership and access control across assets, sources, and information. They also organize your sources and assets into categories that are customized to match your management experience with your data. This guide will take you through setting up your first collection and collection admin to prepare your Microsoft Purview environment for your organization.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* An active [Microsoft Purview account](create-catalog-portal.md).

## Check permissions

In order to create and manage collections in the Microsoft Purview Data Map, you'll need to be a **Collection Admin** within the Microsoft Purview governance portal. We can check these permissions in the [portal](use-azure-purview-studio.md). You can find the studio by going to your Microsoft Purview account in the [Azure portal](https://portal.azure.com), and selecting the **Open Microsoft Purview governance portal** tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.

    :::image type="content" source="./media/quickstart-create-collection/find-collections.png" alt-text="Screenshot of the Microsoft Purview governance portal opened to the Data Map, with the Collections tab selected." border="true":::

1. Select your root collection. This is the top collection in your collection list and will have the same name as your Microsoft Purview account. In our example below, it's called ContosoPurview.

    :::image type="content" source="./media/quickstart-create-collection/select-root-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the root collection highlighted." border="true":::

1. Select role assignments in the collection window.

    :::image type="content" source="./media/quickstart-create-collection/role-assignments.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the role assignments tab highlighted." border="true":::

1. To create a collection, you'll need to be in the collection admin list under role assignments. If you created the account, you should be listed as a collection admin under the root collection already. If not, you'll need to contact the collection admin to grant you permission.

    :::image type="content" source="./media/quickstart-create-collection/collection-admins.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the collection admin section highlighted." border="true":::

## Create a collection in the portal

To create your collection, we'll start in the [Microsoft Purview governance portal](use-azure-purview-studio.md). You can find the portal by going to your Microsoft Purview account in the [Azure portal](https://portal.azure.com) and selecting the **Open Microsoft Purview governance portal** tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.

    :::image type="content" source="./media/quickstart-create-collection/find-collections.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the Collections tab selected." border="true":::

1. Select **+ Add a collection**.

    :::image type="content" source="./media/quickstart-create-collection/select-add-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the Collections tab selected and Add a Collection highlighted." border="true":::

1. In the right panel, enter the collection name, description, and search for users to add them as collection admins.

    :::image type="content" source="./media/quickstart-create-collection/create-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, showing the new collection window, with a display name and collection admins selected, and the create button highlighted." border="true":::

1. Select **Create**. The collection information will reflect on the page.

    :::image type="content" source="./media/quickstart-create-collection/created-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, showing the newly created collection window." border="true":::

## Assign permissions to collection

Now that you have a collection, you can assign permissions to this collection to manage your users access to the Microsoft Purview governance portal.

### Roles

All assigned roles apply to sources, assets, and other objects within the collection where the role is applied.

* **Collection admins** - can edit a collection, its details, manage access in the collection, and add subcollections.
* **Data source admins** - can manage data sources and data scans.
* **Data curators** - can create, read, modify, and delete actions on catalog data objects.
* **Data readers** - can access but not modify catalog data objects.

### Assign permissions

1. Select **Role assignments** tab to see all the roles in a collection.

    :::image type="content" source="./media/quickstart-create-collection/select-role-assignments.png" alt-text="Screenshot of the Microsoft Purview governance portal collection window, with the role assignments tab highlighted." border="true":::

1. Select **Edit role assignments** or the person icon to edit each role member.

    :::image type="content" source="./media/quickstart-create-collection/edit-role-assignments.png" alt-text="Screenshot of the Microsoft Purview governance portal collection window, with the edit role assignments dropdown list selected." border="true":::

1. Type in the textbox to search for users you want to add to the role member. Select **OK** to save the change.

## Next steps

Now that you have a collection, you can follow these guides below to add resources, scan, and manage your collections.

* [Register source to collection](how-to-create-and-manage-collections.md#register-source-to-a-collection)
* [Access management through collections](how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections)
