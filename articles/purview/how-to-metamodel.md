---
title: Manage assets with metamodel
description: The Microsoft Purview metamodel helps you represent a business perspective of your data, how it’s grouped into data domains, used in business processes, organized into systems, and more.  
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
- Create a new, or use an existing Microsoft Purview account. You can [follow our quick-start guide to create one](../create-catalog-portal.md).
- Create a new, or use an existing resource group, and place new data sources under it. [Follow this guide to create a new resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md).
- [Data Curator role](catalog-permissions.md#roles) on the collection where the data asset is housed. See the guide on [managing Microsoft Purview role assignments](../catalog-permissions.md#assign-permissions-to-your-users).

## Create and modify asset types

1. To get started, open the data map and select **Metamodels**. You’ll see a list of available asset types. Predefined asset types will have unique icons. All custom assets are designated with a puzzle piece icon. 

1. To create a new asset type, select **New asset type** and add a name, description, and attributes.  

1. To define a relationship between two asset types, select **New relationship type**.  

1. Give the relationship a name and define its reverse direction. Assign it to one or more pairs of assets.  

1. As you create more asset types, your canvas may get crowded with asset types. To hide an asset from the canvas, select the eye icon on the asset card. 

1. To add an asset type back to the canvas, drag it from the left panel.

## Create and modify assets

1. When you’re ready to begin working with assets, go to the data catalog.  

1. There will be no integration with collections when private preview opens, so all assets created via the metamodel canvas will be listed under the data catalog. 

1. To create a new asset, select **New asset**, select the asset type from the drop-down menu, give it a name, description, and complete any required attributes.

1. To establish a relationship between two assets, go to the asset detail page and select **Edit > Related,** and the relationship you’d like to populate.

1. Select the assets or assets you’d like to link from the data catalog and select **OK**.

1. Save your changes. You can see the relationships you established in the asset overview.

1. You can also explore a visual representation of related assets in the Related tab. 

>[!NOTE]
>This is the experience provided by default from Atlas.

## Next steps

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->