---
title: Microsoft Purview metamodel
description: The Microsoft Purview metamodel helps you represent a business perspective of your data, how it’s grouped into data domains, used in business processes, organized into systems, and more.  
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 11/10/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Microsoft Purview metamodel

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Metamodel is a feature in the Microsoft Purview Data Map that helps you represent a business perspective of your data: how it’s grouped into data domains, used in business processes, organized into systems, and more.

Without this metamodel, your datamap contains technical metadata, but lacks clear reference points. It's like a map with longitude and latitude, but no city or street names. Metamodel adds reference points that orient your users in your data map and help them discover what they need.

So what does a metamodel look like?
It's built from asset types and their relationships.

- An **asset type** is a template for an important concept. Anything you might want to represent in your data map alongside your physical metadata. The instances of each asset type are assets. These can be discovered in the data catalog just like the data assets that are automatically created when you scan and ingest new metadata.
- **Relationships** are first class citizens of the metamodel. A relationship definition is the template for a relationship you’d like to represent in your data map. The relationship is the instance.  

For example, if we want to use Purview to show how key data sets are used in our business processes, we can represent that information as a template:  

:::image type="content" source="media/concept-metamodel/process-dataset.png" alt-text="Diagram showing that a business process uses a dataset.":::

Which we can then use to describe how a specific business process uses a specific data set: 

:::image type="content" source="media/concept-metamodel/specific-example.png" alt-text="Diagram mirroring previous diagram showing social media management using customer demographics.":::

Metamodel includes several [predefined asset types](how-to-metamodel.md#predefined-asset-types) and relationship definitions to help you get started, but you can also create your own. 

## Next steps

- [How to create a metamodel](how-to-metamodel.md)