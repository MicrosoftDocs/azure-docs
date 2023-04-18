---
title: Microsoft Purview metamodel
description: The Microsoft Purview metamodel helps you represent a business perspective of your data, how it’s grouped into data domains, used in business processes, organized into systems, and more.  
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 11/10/2022
ms.custom: template-concept
---

# Microsoft Purview metamodel

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Metamodel is a feature in the Microsoft Purview Data Map that helps add rich business context to your data catalog. It tells a story about how your data is grouped in data domains, how it's used in business processes, what projects are impacted by the data, and ultimately how the data fits in the day to day of your business.

The context metamodel provides is important because business users, the people who are consuming the data, often have non-technical questions about the data. Questions like: What department produces this dataset? Are there any projects that are using this dataset? Where does this report come from?

When you scan data into Microsoft Purview, the technical metadata can tell you what the data looks like, if the data has been classified, or if it has glossary terms assigned, but it can't tell you where and how that data is used. The metamodel gives your users that information. It can tell you what data is mission critical for a product launch or used by a high performing sales team to convert leads to prospects.

So not only does the metamodel help data consumers find the data they're looking for, but it also tells your data managers what data is critical and how healthy that critical data is, so you can better manage and govern it. For example: you may have different privacy obligations if you use personal information for marketing activities vs. analytics that improve a product or service, and metamodel can help you determine where data is being used.

## So what is the metamodel?

What does it look like? The metamodel is built from **assets** and the **relationships** between them.

For example, you might have a sales reporting team (asset) that consumes data (relationship) from some SQL tables (assets).

When you scan data sources into the data map, you already have  the technical data assets like SQL tables available for your metamodel. But what about assets like a sales reporting team, or a marketing strategy that represent processes or people instead of a data source? Metamodel provides **asset types** that allow you to describe other important parts of your business.

An **asset type** is a template for important concepts like business processes, departments, lines of business, or even products. They're the building blocks you'll use to describe how data is used in your business. The **asset type** creates a template you can use over and over to describe specific assets. For example, you can define an asset type "department" and then create new department assets for each of your business departments. These new assets are stored in Microsoft Purview like any other data assets that were scanned in the data map, so you can search and browse for them in the data catalog.

Metamodel includes several [predefined asset types](how-to-metamodel.md#predefined-asset-types) to help you get started, but you can also create your own.

Similarly a **relationship definition** is the template for the kinds of interactions between assets that you want to represent. For example, a department *manages* a business process. An organization *has* departments. The business process, organization, and departments are the assets, "manages" and "has" are the relationships between them.

For example, if we want to use Microsoft Purview to show how key data sets are used in our business processes, we can represent that information as a template:  

:::image type="content" source="media/concept-metamodel/process-dataset.png" alt-text="Diagram showing that a business process uses a dataset." border="false":::

Which we can then use to describe how a specific business process uses a specific data set: 

:::image type="content" source="media/concept-metamodel/specific-example.png" alt-text="Diagram mirroring previous diagram showing social media management using customer demographics." border="false":::

## Metamodel example

For a simple example of a metamodel, let's consider marketing campaign management in a business. This process is an asset that we'll add to our metamodel. It's not a data source we can scan, since it's a set of business processes, but during this process real data will be used and referenced. It's important to show what data is being used and how, so we can properly manage and govern it. We'll create an asset for the marketing campaign management from the asset type "Business Process".

We know there are two tables in SQL that the marketing campaign management team uses. These are assets too, but they were data source assets created when the SQL database was scanned into the Microsoft Purview Data Map.

The relationship between the marketing campaign management asset and the SQL table assets is that campaign management **consumes**, or uses, the SQL tables when developing campaigns. We can record that in our metamodel, so now anyone that looks at those SQL tables can see that they're being used to develop marketing campaigns. We'll also be able to see if there are any other teams that use this data, or maybe which department develops this data as well. So now, with metamodel, we know not only what the data is, but we have a story about how it's being used that helps us understand and manage it.

:::image type="content" source="media/concept-metamodel/simple-metamodel-example.png" alt-text="Screenshot of a metamodel showing a marking email report asset connected to two SQL databases through 'consumes' relationships.":::

And now that marketing campaign management is an asset in your data catalog like any other asset, so you can find it in a search. A user could search for that process and quickly know what data it uses and produces, without needing to know anything about the data beforehand.

## Next steps

If you're ready to get started, follow the [how to create a metamodel](how-to-metamodel.md) article.