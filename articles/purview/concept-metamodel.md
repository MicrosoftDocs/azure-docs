---
title: Microsoft Purview metamodel
description: The Microsoft Purview metamodel helps you represent a business perspective of your data— how it’s grouped into data domains, used in business processes, organized into systems, and more.  
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 10/13/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Microsoft Purview metamodel

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

The Microsoft Purview metamodel helps you represent a business perspective of your data—how it’s grouped into data domains, used in business processes, organized into systems, and more.  

The backbone of the metamodel is comprised of asset types and their relationship definitions. An asset type is a template for storing a concept that’s important to you—anything you might want to represent in your data map alongside your physical metadata. The instances of each asset type are assets. These can be discovered in the data catalog just like the data assets that are automatically created when you scan and ingest new metadata.

Relationships are first class citizens of the metamodel. A relationship definition is the template for a relationship you’d like to represent in your data map. The relationship is the instance.  

For example, if we want to use Purview to show how key data sets are used in our business processes, we can represent that information as a template:  

:::image type="content" source="media/concept-metamodel/process-dataset.png" alt-text="Diagram showing that a business process uses a dataset.":::

Which we can then use to describe how a specific business process uses a specific data set: 

:::image type="content" source="media/concept-metamodel/specific-example.png" alt-text="Diagram mirroring previous diagram showing social media management using customer demographics.":::

Metamodel includes several predefined asset types and relationship definitions. You can also create your own. 

## Next steps
<!-- Add a context sentence for the following links -->
- [Write concepts](article-concept.md)
- [Links](../contribute/links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->