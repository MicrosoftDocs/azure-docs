---
title: Understand data classification in the Microsoft Purview governance portal
description: This article explains the concepts behind data classification in the Microsoft Purview governance portal.
author: ankitscribbles
ms.author: ankitgup
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 03/23/2023
---

# Data classification in the Microsoft Purview governance portal

Data classification in the Microsoft Purview governance portal is a way of categorizing data assets by assigning unique logical tags or classes to the data assets. Classification is based on the business context of the data. For example, you might classify assets by *Passport Number*, *Driver's License Number*, *Credit Card Number*, *SWIFT Code*, *Person’s Name*, and so on.

When you classify data assets, you make them easier to understand, search, and govern. Classifying data assets also helps you understand the risks associated with them. This in turn can help you implement measures to protect sensitive or important data from ungoverned proliferation and unauthorized access across the data estate.

The Microsoft Purview Data Map provides an automated classification capability while you scan your data sources. You get more than 200+ built-in system classifications and the ability to create custom classifications for your data. You can classify assets automatically when they're ingested as part of a configured scan, or you can edit them manually in the Microsoft Purview governance portal after they're scanned and ingested.  

## Uses of classification

Classification is the process of organizing data into *logical categories* that make the data easy to retrieve, sort, and identify for future use. This can be important for data governance. Among other reasons, classifying data assets is important because it helps you:

* Narrow down the search for data assets that you're interested in.
* Organize and understand the variety of data classes that are important in your organization and where they're stored.
* Understand the risks associated with your most important data assets and then take appropriate measures to mitigate them.

As shown in the following image, it's possible to apply classifications at both the asset level and the schema level for the *Customers* table in Azure SQL Database.

:::image type="content" source="./media/concept-classification/classification-customers-example-1.png" alt-text="Screenshot that shows the classification of the 'Customers' table in Azure SQL Database." lightbox="./media/concept-classification/classification-customers-example-1.png":::

## Types of classification

The Microsoft Purview governance portal supports both system and custom classifications.

* **System classifications**: 200+ system classifications supported are out of the box. For the entire list of available system classifications, see [supported classifications in the Microsoft Purview governance portal](./supported-classifications.md).

   In the example in the preceding image, *Person’s Name* is a system classification. System classification has the thunderbolt icon along with classification name. Hovering over the classification itself provides more details on the type of classification, and more details on how it was applied

* **Custom classifications**: You can create custom classifications when you want to classify assets based on a pattern or a specific column name that's unavailable as a system classification.
Custom classification rules can be based on a *regular expression* pattern or *dictionary*.

   Let's say that the *Employee ID* column follows the EMPLOYEE{GUID} pattern (for example, EMPLOYEE9c55c474-9996-420c-a285-0d0fc23f1f55). You can create your own custom classification by using a regular expression, such as `\^Employee\[A-Za-z0-9\]{8}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{12}\$`.

> [!NOTE]
> Sensitivity labels are different from classifications. Sensitivity labels categorize assets in the context of data security and privacy, such as *Highly Confidential*, *Restricted*, *Public*, and so on. To use sensitivity labels in the Microsoft Purview Data Map, you'll need at least one Microsoft 365 license or account within the same Azure Active Directory (Azure AD) tenant as your Microsoft Purview Data Map. For more information about the differences between sensitivity labels and classifications, see [sensitivity labels in the Microsoft Purview governance portal FAQ](sensitivity-labels-frequently-asked-questions.yml#what-is-the-difference-between-classifications-and-sensitivity-labels).

## Next steps

* [Read about classification best practices](concept-best-practices-classification.md)
* [Create custom classifications](create-a-custom-classification-and-classification-rule.md)
* [Automatically apply classifications](apply-classifications.md)
* [Manually apply classifications](manually-apply-classifications.md)
* [Use the Microsoft Purview governance portal](use-azure-purview-studio.md)
