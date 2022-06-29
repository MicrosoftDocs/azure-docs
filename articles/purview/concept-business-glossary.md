---
title: Understand business glossary features in Microsoft Purview
description: This article explains what business glossary is in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 04/28/2021
---

# Understand business glossary features in Microsoft Purview

This article provides an overview of the business glossary feature in Microsoft Purview. 

## Business glossary

A glossary provides vocabulary for business users.  It consists of business terms that can be related to each other and allows them to be categorized so that they can be understood in different contexts. These terms can be then mapped to assets like a database, tables, columns etc. This helps in abstracting the technical jargon associated with the data repositories and allows the business user to discover and work with data in the vocabulary that is more familiar to them.

A business glossary is a collection of terms. Each term represents an object in an organization and it is highly likely that there are multiple terms representing the same object. A customer could also be referred to as client, purchaser, or buyer. These multiple terms have a relationship with each other. The relationship between these terms could one of the following:

- synonyms - different terms with the same definition
- related - different name with similar definition

The same term can also imply multiple business objects. It is important that each term is well-defined and clearly understood within the organization.

## Custom attributes

Microsoft Purview supports eight out-of-the-box attributes for any business glossary term:
- Name (mandatory)
- Nickname
- Status
- Definition
- Stewards
- Experts
- Acronym
- Synonyms
- Related terms
- Resources
- Parent term

These attributes cannot be edited or deleted. However, these attributes are not sufficient to completely define a term in an organization. To solve this problem, Microsoft Purview provides a feature where you can define custom attributes for your glossary.

## Term templates

Term Templates provides glossary custom attributes to be logically grouped together in catalog. The feature allows you to group all the relevant custom attributes together in a template and then apply the template while creating the glossary term. For example, all finance- related custom attributes like cost center, profit center, accounting code can be grouped in a term template Finance Template and the Finance  template can be used to create financial glossary terms.

All the standard attributes are grouped in a system default template. Any term template that you create will contain these attributes along with any additional custom attributes created as part of template creation process.

## Glossary vs classification vs sensitivity labels

While glossary terms, classifications and labels are annotations to a data asset, each one of them has a different meaning in the context of catalog. 

### Glossary

As stated above, Business glossary term defines the business vocabulary for an organization and helps in bridging the gap between various departments in your company.

### Classifications

Classifications are annotations that can be assigned to entities. The flexibility of classifications enables you to use them for multiple scenarios such as:

- understanding the nature of data stored in the data assets
- defining access control policies

Microsoft Purview has more than 200 system classifiers today and you can define your own classifiers in catalog. As part of the scanning process, we automatically detect these classifications and apply them to data assets and schemas. However, you can override them at any point of time. The human overrides are never replaced by automated scans.

### Sensitivity labels

Sensitivity labels are a type of annotation that allows you to classify and protect your organization's data, without hindering productivity and collaboration. Sensitivity labels are used to identify the categories of classification types within your organizational data, and group the policies that you wish to apply to each category. Microsoft Purview makes use of the same sensitive information types as Microsoft 365, which allows you to stretch your existing security policies and protection across your entire content and data estate. The same labels can be shared across Microsoft Office products and data assets in Microsoft Purview.

## Next steps

- [Manage Term Templates](how-to-manage-term-templates.md)
- [Browse the data catalog in Microsoft Purview](how-to-browse-catalog.md)
