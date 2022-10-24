---
title: Manage assets with metamodel
description: Manage asset types with Microsoft Purview metamodel
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/13/2022
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Manage assets with metamodel

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the 
customer will do. Answer the fundamental “why would I want to do this?” question. Keep it 
short.
Readers should have a clear idea of what they will do in this article after reading the 
introduction.
-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create a new, or use an existing Microsoft Purview account. You can [follow our quick-start guide to create one](create-catalog-portal.md).
- Create a new, or use an existing resource group, and place new data sources under it. [Follow this guide to create a new resource group](../azure-resource-manager/management/manage-resource-groups-portal.md).
- [Data Curator role](catalog-permissions.md#roles) on the collection where the data asset is housed. See the guide on [managing Microsoft Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

## Create and modify asset types

1. To get started, open the data map and select **Asset types**. You’ll see a list of available asset types. Predefined asset types will have unique icons. All custom assets are designated with a puzzle piece icon.

1. To create a new asset type, select **New asset type** and add a name, description, and attributes.

    :::image type="content" source="./media/how-to-metamodel/create-and-modify-metamodel-asset-types-inline.png" alt-text="Screenshot of the asset types page in the Microsoft Purview Data Map, with the buttons in steps 1 through 3 highlighted." lightbox="./media/how-to-metamodel/create-and-modify-metamodel-asset-types.png":::

1. To define a relationship between two asset types, select **New relationship type**.  

1. Give the relationship a name and define its reverse direction. Assign it to one or more pairs of assets. Select **Create** to save your new relationship type.

    :::image type="content" source="./media/how-to-metamodel/create-new-relationship-type.png" alt-text="Screenshot of the new relationship type page with a relationship defined and the create button highlighted." border="true":::

1. As you create more asset types, your canvas may get crowded with asset types. To hide an asset from the canvas, select the eye icon on the asset card.

    :::image type="content" source="./media/how-to-metamodel/hide-asset.png" alt-text="Screenshot of an asset card in the asset types canvas, the eye icon in the right corner is highlighted." border="true":::

1. To add an asset type back to the canvas, drag it from the left panel.

    :::image type="content" source="./media/how-to-metamodel/add-asset.png" alt-text="Screenshot of the asset list to the left of the asset canvas with one item highlighted." border="true":::

## Create and modify assets

1. When you’re ready to begin working with assets, go to the data catalog and select **Business assets**.

    :::image type="content" source="./media/how-to-metamodel/metamodel-assets-in-catalog.png" alt-text="Screenshot of left menu in the Microsoft Purview Governance portal, the data map and business assets buttons highlighted." border="true":::

1. There will be no integration with collections when private preview opens, so all assets created via the metamodel canvas will be listed under the data catalog.

    :::image type="content" source="./media/how-to-metamodel/assets-page.png" alt-text="Screenshot of the business assets page." border="true":::

1. To create a new asset, select **New asset**, select the asset type from the drop-down menu, give it a name, description, and complete any required attributes. Select **Create** to save your new asset.

    :::image type="content" source="./media/how-to-metamodel/select-new-asset.png" alt-text="Screenshot of the business assets page with the new asset button highlighted." border="true":::

    :::image type="content" source="./media/how-to-metamodel/create-new-asset.png" alt-text="Screenshot of the new asset page with a name and description added and create button higlighted." border="true":::

1. To establish a relationship between two assets, go to the asset detail page and select **Edit > Related,** and the relationship you’d like to populate.

    :::image type="content" source="./media/how-to-metamodel/select-edit.png" alt-text="Screenshot of an asset page with the edit button highlighted." border="true":::

    :::image type="content" source="./media/how-to-metamodel/establish-relationships.png" alt-text="Screenshot of the edit asset page with the Related tab open and the relationships highlighted." border="true":::

1. Select the assets or assets you’d like to link from the data catalog and select **OK**.

    :::image type="content" source="./media/how-to-metamodel/select-related-assets.png" alt-text="Screenshot of the select assets page with two assets selected and the Ok button highlighted." border="true":::

1. Save your changes. You can see the relationships you established in the asset overview.

1. In the **Related** tab of the asset youu can also explore a visual representation of related assets.

    :::image type="content" source="./media/how-to-metamodel/visualize-related-assets.png" alt-text="Screenshot of the related tab of a business asset." border="true":::

    >[!NOTE]
    >This is the experience provided by default from Atlas.

## Next steps

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->