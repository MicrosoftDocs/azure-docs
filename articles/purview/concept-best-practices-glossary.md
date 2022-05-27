---
title: Microsoft Purview glossary best practices
description: This article provides examples of Microsoft Purview glossary best practices.
author: zeinab-mk
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 12/15/2021
---

# Microsoft Purview glossary best practices

The business glossary is a definition of terms specific to a domain of knowledge that is commonly used, communicated, and shared in organizations as they are conducting business. 
A common business glossary (for example, business language) is significant as it is critical in improving an organizations overall business productivity and performance. You will observe in most organizations that their business language is being codified based on business dealings associated with:  

- Business Meetings
- Stand-Ups, Projects, and Systems (ERP, CRM, SharePoint, etc.). 
- Business Plans and Business Processes
- Presentations
- Reporting and Business Rules
- Learnings (Knowledge Acquisition)
- Business Models
- Policy and Procedure

It is important that your organizations business language and discourse align to a common business glossary to ensure your organization data assets are properly applied in conducting business at speed and with agility as rapid changing business needs happen.  

This article is intended to provide guidance around how to establish and govern your organizations A to Z business glossary of commonly used terms and it is aimed to provide more guidance to ensure you are able to focus on promoting a shared understanding for business data governance ownership. Adopting these considerations and recommendations will help your organization achieve success with Microsoft Purview.
The adoption by your organization of the business glossary will depend on you promote consistent use of a business glossary to enable your organization to better understand the meanings of their business terms they come across daily while running the organizations business.

## Why is a common business glossary needed?
Without a common business glossary an organization's performance, culture, operations, and strategy often will adversely hinder the business. You will observe, in this hindrance, a condition in which cultural differences arise grounded in an inconsistent business language. These inconsistencies about the business language are communicated between team members and prevents them from leveraging their relevant data assets as a competitive advantage.
You will also observe when there are language barriers, in which, most organizations will spend more time pursuing non-productive and non-collaborative activities as they need to rely on more detailed interactions to reach the same meaning and understanding for their data assets. 

## Recommendations for implementing new glossary terms

Creating terms is necessary to build the business vocabulary and apply it to assets within Microsoft Purview. When a new Microsoft Purview account is created, by default, there are no built-in terms in the account.

This creation process should follow strict naming standards to ensure that the glossary does not contain duplicate or competing terms.

- Establish a strict hierarchy for all business terms across your organization.
- The hierarchy could consist of a business domain such as: Finance, Marketing, Sales, HR, etc.
- Implement naming standards for all glossary terms that include case sensitivity. In Microsoft Purview terms are case-sensitive.
- Always use the provide search glossary terms feature before adding a new term. This will help you avoid adding duplicate terms to the glossary.
- Avoid deploying terms with duplicated names. In Microsoft Purview, terms with the same name can exist under different parent terms. This can lead to confusion and should be well thought out before building your business glossary to avoid duplicated terms. 

Glossary terms in Microsoft Purview are case sensitive and allow white space. The following shows a poorly executed example of implementing glossary terms and demonstrates the confusion caused:

 :::image type="content" source="media/concept-best-practices/glossary-duplicated-term-search.png" alt-text="Screenshot that shows searching duplicated glossary terms.":::

As a best practice it always best to: Plan, search, and strictly follow standards.  The following shows an approach that is better thought out and greatly reduces confusion between glossary terms:

 :::image type="content" source="media/concept-best-practices/glossary-duplicated-term-2.png" alt-text="Another example of a duplicated glossary terms.":::

## Recommendations for deploying glossary term templates

When building new term templates in Microsoft Purview, review the following considerations:

- Term templates are used to add custom attributes to glossary terms.
- By default, Microsoft Purview offers several [out-of-the-box term attributes](./concept-business-glossary.md#custom-attributes) such as Name, Nick Name, Status, Definition, Acronym, Resources, Related terms, Synonyms, Stewards, Experts, and Parent term, which are found in the "System Default" template. 
- Default attributes cannot be edited or deleted. 
- Custom attributes extend beyond default attributes, allowing the data curators to add more descriptive details to each term to completely describe the term in the organization.
- As a reminder, Microsoft Purview stores only meta-data. Attributes should describe the meta-data; not the data itself.
- Keep definition simple. If there are custom metrics or formulas these could easily be added as an attribute.
- A term must include at least default attributes. When building new glossary terms if you use custom templates, other attributes that are included in the custom template are expected for the given term.

## Recommendations for importing glossary terms from term templates

- Terms may be imported with the "System default" or custom template.
- When importing terms, use the sample .CSV file to guide you. This can save hours of frustration.
- When importing terms from a .CSV file, be sure that terms already existing in Microsoft Purview are intended to be updated. When using the import feature, Microsoft Purview will overwrite existing terms.
- Before importing terms, test the import in a lab environment to ensure that no unexpected results occur, such as duplicate terms. 
- The email address for Stewards and Experts should be the primary address of the user from the Azure Active Directory group. Alternate email, user principal name and non-Azure Active Directory emails are not yet supported.
- Glossary terms provide fours status: Draft, Approved, Expired, Alert. Draft is not officially implemented, Approved is official/stand/approved for production, Expired means should no longer be used, Alert need to pay more attention.
For more information, see [Create, import, and export glossary terms](./how-to-create-import-export-glossary.md)

## Recommendations for exporting glossary terms 

Exporting terms may be useful in Microsoft Purview account to account, Backup, or Disaster Recovery scenarios. Exporting terms in the Microsoft Purview governance portal must be done one term template at a time. Choosing terms from multiple templates will disable the "Export terms" button. As a best practice, using the "Term template" filter before bulk selecting will make the export process quick.

## Glossary Management 

### Recommendations for assigning terms to assets

- While classifications and sensitivity labels are applied to assets automatically by the system based on classification rules, glossary terms are not applied automatically.
- Similar to classifications, glossary terms can be mapped to assets at the asset level or scheme level.
- In Microsoft Purview, terms can be added to assets in different ways:
  - Manually, using the Microsoft Purview governance portal.
  - Using Bulk Edit mode to update up to 25 assets, using the Microsoft Purview governance portal.
  - Curated Code using the Atlas API.
- Use Bulk Edit Mode when assigning terms manually. This feature allows a curator to assign glossary terms, owners, experts, classifications and certified in bulk based on selected items from a search result. Multiple searches can be chained by selecting objects in the results. The Bulk Edit will apply to all selected objects. Be sure to clear the selections after the bulk edit has been performed. 
- Other bulk edit operations can be performed by using the Atlas API. An example would be using the API to add descriptions or other custom properties to assets in bulk programmatically.

## Next steps
-  [Create, import, and export glossary terms](./how-to-create-import-export-glossary.md)
