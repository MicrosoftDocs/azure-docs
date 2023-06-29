---
title: Best practices for describing data in Microsoft Purview
description: Microsoft Purview provides a variety of ways to annotate and organize your data. This article covers best practices for using tags, terms, managed attributes, and business assets. 
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.topic: conceptual
ms.date: 04/24/2023
ms.custom: template-concept
---

# Describing metadata in Microsoft Purview

Microsoft Purview provides a variety of ways to annotate and organize your data. You can use tags, terms, managed attributes, and business assets. 

But it may not always be obvious when to use which feature. If you want to show that a data set is published by your accounting team, should you tag it? Assign a managed attribute called account team? What about using a term called accounting? Or maybe you should create a relationship to a department asset called accounting?

Adding context to your data is both art and science, but here are some best practices for tags, managed attributes, business terms, and business assets.

## Best pracitices for using tags 

Use tags when you want to quickly label your data assets without the need for consistency or control. Tags are simple keywords or phrases that can be applied to data assets to provide quick, informal metadata. They’re useful for categorizing data assets, making them easier to discover and understand. They're also a great way to see how your data consumers describe your data so you can incorporate this language into your business glossary over time. 

In the following example, I've tagged a few assets with Q4 Revenue so I can easily find the data assets I plan to use for a new report with this information. Searching the keyword returns all data with that tag applied:

:::image type="content" source="media/concept-annotations/01-tags.png" alt-text="Screen shot showing Microsoft Purview search results showing assets tagged with Q4_Revenue.":::

## Best practices for using managed attributes
Use managed attributes to extend the fields available for an asset in Purview. Managed attributes are key-value pairs that add structured metadata to your data catalog. When Purview scans data, it adds technical information about the data like data type, classification, etc. If you want to add more fields, you’ll need to define managed attributes. 

In the following example, I add a managed attribute that lets me tag tables with the department that publishes them. I use a managed attribute because I want to make sure assets are always tagged in exactly the same way with this information. I also want to filter by the publisher field when I search for data.

:::image type="content" source="media/concept-annotations/02-managed-attributes.png" alt-text="Screen shot showing an asset detail page with a managed attribute key-value pair of publisher: supply chain.":::

The managed attribute in this example helps people quickly find all data published by the supply chain team, but doesn't help someone understand the definition of a publisher or what it means if supply chain is the publisher of the data. For any information that needs a business explanation, we use terms.

## Best practices for using business terms

Use business terms to define a shared vocabulary for your organization. By creating terms, identifying their synonyms, acronyms, related terms, and more, you can create a flexible controlled taxonomy organized in a hierarchical way. Glossaries of terms help bridge the communication gap between various departments in your company by providing consistent definitions for concepts, metrics, and other important elements across the organization. 

I assign the term order to this table, because it contains order information.

:::image type="content" source="media/concept-annotations/03-terms.png" alt-text="Screen shot showing an asset detail page with an assigned term of order.":::

I use a term so that anyone who finds this data can go to the term to explore the business definition of an order:

:::image type="content" source="media/concept-annotations/04-term-detail.png" alt-text="Screen shot showing a term detail page for order.":::

## Best practice for using business assets

Finally, you can extend Purview's metamodel by creating additional asset types for describing real-world things in your organization such as departments, projects, products, and lines of business. When you look at your data estate, it's often helpful to understand how your data fits into your business. Use business assets whenever you want to associate data assets to specific organizational structures, business processes, or other anything else that could be convincingly modeled as entities.

In the example below, I describe more business context for the SalesOrderDetail table by showing that the Supply chain department (a business asset) manages the order fulfillment business process (a business asset) which uses the SalesOrderDetail table. Visualizing business context in this way can help others identify the “official” dataset that's used for a particular business purpose and understand whether data is being used compliantly. 

:::image type="content" source="media/concept-annotations/04-term-detail.png" alt-text="Screen shot showing a relationships between the supply chain department, order fulfillment business process, and SalesOrderDetail table.":::

## Next steps

Learn more about organizing your data in Microsoft Purview: [Govern your domains with Microsoft Purview: best practices for using collections, glossary, and business context](/azure/purview/concept-best-practices-governing-domains)


