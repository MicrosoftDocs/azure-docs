---
title: Managed attributes in the Microsoft Purview Data Catalog
description: Apply business context to assets using managed attributes
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 07/25/2022
---

# Managed attributes in the Microsoft Purview Data Catalog (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Managed attributes are user-defined attributes that provide a business or organization level context to an asset. When applied, managed attributes enable data consumers using the data catalog to gain context on the role an asset plays in a business.

## Terminology

**Managed attribute:** A set of user-defined attributes that provide a business or organization level context to an asset. A managed attribute has a name and a value. For example, “Department” is an attribute name and “Finance” is its value.
**Attribute group:** A grouping of managed attributes that allow for easier organization and consumption. 

## Create managed attributes in Microsoft Purview Studio

In Microsoft Purview Studio, an organization's managed attributes are managed in the **Annotation management** section of the data map application. Follow the instructions below to create a managed attribute.

1. Open the data map application and navigate to **Managed attributes (preview)** in the **Annotation management** section.
1. Select **New**. Choose whether you wish to start by creating an attribute group or a managed attribute.
    :::image type="content" source="media/how-to-managed-attributes/create-new-managed-attribute.png" alt-text="Screenshot that shows how to create a new managed attribute or attribute group.":::
1. To create an attribute group, enter a name and a description.
    :::image type="content" source="media/how-to-managed-attributes/create-attribute-group.png" alt-text="Screenshot that shows how to create an attribute group.":::
1. Managed attributes have a name, attribute group, data type, and associated asset types. Attribute groups can be created in-line during the managed attribute creation process. Associated asset types are the asset types you can apply the attribute to. For example, if you select "Azure SQL Table" for an attribute, you can apply it to Azure SQL Table assets, but not Azure Synapse Dedicated Table assets.
    :::image type="content" source="media/how-to-managed-attributes/create-managed-attribute.png" alt-text="Screenshot that shows how to create a managed attribute.":::
1. Select **Create** to save your attribute.

### Expiring managed attributes

In the managed attribute management experience, managed attributes can't be deleted, only expired. Expired attributes can't be applied to any assets and are, by default, hidden in the user experience. By default, expired managed attributes aren't removed from an asset. If an asset has an expired managed attribute applied, it can only be removed, not edited.

Both attribute groups and individual managed attributes can be expired. To mark an attribute group or managed attribute as expired, select the **Edit** icon.

:::image type="content" source="media/how-to-managed-attributes/expire-attribute-group.png" alt-text="Screenshot that shows how to edit an attribute group.":::

Select **Mark as expired** and confirm your change. Once expired, attribute groups and managed attributes can't be reactivated.

:::image type="content" source="media/how-to-managed-attributes/mark-as-expired.png" alt-text="Screenshot that shows the expire an attribute group.":::

## Apply managed attributes to assets in Microsoft Purview Studio

Managed attributes can be applied in the [asset details page](catalog-asset-details.md) in the data catalog. Follow the instructions below to apply a managed attribute.

1. Navigate to an asset by either searching or browsing the data catalog. Open the asset details page.
1. Select **Edit** on the asset's action bar.
    :::image type="content" source="media/how-to-managed-attributes/edit-asset.png" alt-text="Screenshot that shows how to edit an asset.":::
1. In the managed attributes section of the editing experience, select **Add attribute**.
1. Choose the attribute you wish to apply. Attributes are grouped by their attribute group.
1. Choose the value or values of the applied attribute.
1. Continue adding more attributes or select **Save** to apply your changes.

## Create managed attributes using APIs

Managed attributes can be programmatically created and applied using the business metadata APIs in Apache Atlas 2.2. For more information, see the [Use Atlas 2.2 APIs](tutorial-atlas-2-2-apis.md) tutorial.

## Known limitations

Below are the known limitations of the managed attribute feature as it currently exists in Microsoft Purview.

- Managed attributes can only be expired, not deleted.
- Managed attributes get matched to search keywords, but there's no user-facing filter in the search results. Managed attributes can be filtered using the Search APIs.
- Managed attributes can't be applied via the bulk edit experience.
- After creating an attribute group, you can't edit the name of the attribute group.
- After creating a managed attribute, you can't update the attribute name, attribute group or the field type. 

## Next steps

- After creating managed attributes, apply them to assets in the [asset details page](catalog-asset-details.md).
