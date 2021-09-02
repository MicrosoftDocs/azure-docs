---
title: Sensitivity labels in Azure Purview FAQ 
description: Learn about frequently asked questions for Azure Purview sensitivity labels.
services: purview
author: ajaykar
ms.service: purview
ms.subservice: purview-label 
ms.topic: 
ms.date: 09/17/2021
ms.author: ajaykar
---
# Sensitivity labels in Azure Purview FAQ


### <a name="label-license-reqs"></a>What are the licensing requirements to use sensitivity labels on files and schematized data in Azure Purview? 

To use sensitivity labels in Azure Purview you will need at least one Microsoft 365 license/account within the same Azure Active Directory (AAD) tenant as your Azure Purview account.  

The following Microsoft 365 licenses is required to automatically apply sensitivity labels to your assets in [Microsoft 365](https://docs.microsoft.com/en-us/microsoft-365/compliance/apply-sensitivity-label-automatically?view=o365-worldwide) and [Azure Purview](create-sensitivity-label.md):  

* Microsoft 365 E5/A5/G5
* Microsoft 365 E5/A5/G5 Compliance 
* Microsoft 365 E5/A5/G5 Information Protection, and Governance,  
* Office 365 E5, Enterprise Mobility + Security E5/A5/G5, and AIP Plan  

For more information, see [Microsoft 365 service descriptions]([https://docs.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance#information-protection).

### <a name="multi-purview-accounts-consent"></a>If my organization has multiple Azure Purview accounts within an Azure AD tenant, do I need to manually extend labels to each Purview account separately?

No. When you extend sensitivity labels to Azure Purview, those labels are extended to all the Purview accounts in your tenant. 

### <a name="label-consent-impact"></a>My organization already uses sensitivity labels in Microsoft 365. What is the impact of extending these labels to Purview? Will it affect my existing setup in Microsoft 365? 

Extending the labels to Purview does not affect your Microsoft 365 setup or modify your assets in any way, including files and databases.  

* When you extend sensitivity labels to Purview, your Microsoft 365 setup will continue to work in the same way as usual. 
* Extending the labels allows Purview to apply those labels to your Azure and multi-cloud assets in the Purview catalog. The catalog is a metadata store and can be deleted by you at any time. 
* The labels are applied only to the asset metadata in the Purview catalog and are not applied to the actual files and schematized data. Your files and databases are not modified in any way. 

### <a name="label-management"></a>Where can I manage my sensitivity labels? 

Sensitivity labels can be managed only in the [Microsoft 365 compliance center](https://compliance.microsoft.com/). For more information, see [How to create sensitivity labels in Microsoft 365](create-sensitivity-label.md#how-to-create-sensitivity-labels-in-microsoft-365).

Support for managing sensitivity labels within Azure Purview Studio is not available currently. 

### <a name="label-classification-comparison-matrix"></a>What is the difference between classifications and sensitivity labels in Azure Purview? 

Listed below are the differences between classifications and sensitivity labels in Azure Purview: 
 | | Classifications | Sensitivity labels |
|:--- |:--- |:--- |
| **Definition** | Classifications are regular expressions or patterns that can help identify data types that exist inside an asset. | Sensitivity labels are tags that allow organizations to categorize data based on business impact, while abstracting the type of data from the user. |
| **Examples** | Social Security Number, Drive license number, Bank account number, etc. | Highly confidential, Confidential, General, Public, etc. |
| **Scope** | The scope of classifications applied to an asset is limited to the Purview account it was applied in. If the data moves to an asset managed by another Purview account, the classification applied will not be visible to it. | Sensitivity label applied on an asset travel with the data no matter where the data goes. Example: A sensitivity label applied to a file in Microsoft 365 will be automatically visible/applied to the file even if it moves to Azure, SharePoint, or Teams. |
| **Scan Process** | When you scan an asset in Azure Purview, we look for both system defined and custom classifications (created by you) within the data. If found, classifications are added in the catalog for the asset. | If you have sensitivity labels extended to Purview and auto-labeling rules defined, based on the classifications found, Purview will apply labels to assets in the catalog. |
| **Authoring portal options** | Custom classifications and classification rules can be created in Azure Purview portal. You can also create custom classifications in Microsoft 365. However, we do not yet support importing them to Purview. |Sensitivity labels can only be managed through the Microsoft 365 Compliance Center. |
| **Assignment Limits** | An asset can have none, one or multiple classifications assigned to it. | An asset can have only one sensitivity label. |
| **Asset application workflow** | You can manually add or modify classifications that are assigned to an asset. | Sensitivity labels are automatically assigned to assets based on classifications found. It is not possible to manually apply labels in Purview at this time. | 
| | [Learn more about classifications](create-a-custom-classification-and-classification-rule.md). | [Learn more about sensitivity labels](create-sensitivity-label.md).| 
|||

### <a name="classification-SIT-compare"></a>Are classifications in Purview and Sensitive Information Types (SITs) in Microsoft 365 the same thing? 

Classifications and SITs are fundamentally the same things, while the former is an Azure Purview concept the latter is a Microsoft 365 concept. However, both are used by respective services to identify the type of data in an asset. 

### <a name="classification-engine"></a>Do Azure Purview and Microsoft 365 use the same classification engine? 

Yes, both Azure Purview and Microsoft 365 use the same classification engine. 

### <a name="custom-SIT-use"></a>I have created a custom Sensitive Information Type (SIT) in Microsoft 365 and used it in my auto-labeling rules for schematized data. Can I use this custom SIT in Azure Purview? 

No, [custom sensitive information types](https://docs.microsoft.com/en-us/microsoft-365/compliance/sensitive-information-type-learn-about?view=o365-worldwide#creating-custom-sensitive-information-types) from Microsoft 365 are not supported in Azure Purview at this time. We currently support Microsoft 365 [built-in sensitive information types](https://docs.microsoft.com/en-us/microsoft-365/compliance/sensitive-information-type-learn-about?view=o365-worldwide) only, in Azure Purview.  

### <a name="datasource-eligibility"></a>What data sources can I apply sensitivity labels to in Azure Purview? 

You can apply sensitivity labels to all the data sources that can be scanned in Azure Purview. For more information, see [Supported data types for sensitivity labels in Azure Purview](create-sensitivity-label.md#supported-data-types-for-sensitivity-labels-in-azure-purview). 

### <a name="label-application"></a>Can I manually label an asset, or modify or remove a label in Azure Purview? 

Azure Purview supports automatic labeling only. Labels are automatically applied to assets in Azure Purview based on the classifications found on the assets and the auto-labeling rules for the labels. 

We currently do not support manually applying a label, modifying, or removing a label from an asset. 

### <a name="label-management"></a>Who can manage sensitivity labels in the Microsoft 365 compliance center? 

The following built-in admin roles include permissions to manage sensitivity labels in the compliance center: 

* Global Administrator  
* Compliance Administrator 

For more detailed information, see [Permissions required to create and manage sensitivity labels](https://docs.microsoft.com/microsoft-365/compliance/get-started-with-sensitivity-labels#permissions-required-to-create-and-manage-sensitivity-labels).  Once you have compliance and global administrators' setup, they can [give access to individual users](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/grant-access-to-the-security-and-compliance-center?view=o365-worldwide). 

### <a name="asset-browse-permissions"></a>Who can search and browse assets with sensitivity labels in Azure Purview? 

All users with at least data reader access to the Purview account have permissions to search and browse assets with sensitivity labels in Azure Purview. 

### <a name="label-insights-permissions"></a>Who can view the sensitivity label insights report in Azure Purview? 

All users with at least data reader access to the Purview account have permissions to view sensitivity label insights reports in Azure Purview. 

### <a name="asset-sampling"></a>Does Purview scan the entire asset in order to get the label assigned to the assets? 

Purview scanner samples files in the following way: 

* **For structured file types**, Purview samples 128 rows in each column or 1 MB, whichever is lower. 
* **For document file formats**, Purview samples 20 MB of each file. 
* **If a document file is larger than 20 MB**, the document is not subject to a deep scan or classification. In such cases, Purview captures only basic meta data like file name and fully qualified name. 

### <a name="label-priority"></a>If there are multiple sensitivity labels that meet the classification criteria, which label is applied?  

Within Microsoft 365, sensitivity labels have a priority 'order'. Purview uses the same order to assign labels. In case of multiple labels meeting the classification criteria, Purview picks the label with the highest order.  

For more information, see [Label priority order matters](https://docs.microsoft.com/en-us/microsoft-365/compliance/sensitivity-labels?view=o365-worldwide#label-priority-order-matters).

### <a name="auto-label-creds-content"></a>Can automatic labeling apply to assets that may include content such as credentials?

Azure Purview does not currently support scanning for credentials. When Purview supports scanning for credentials, you should be able to apply labels based on credentials found.

### <a name="file-protect-policy"></a>Can I apply encryption and/or content marking on files in Azure Purview, similar to Microsoft 365?

No, we do not currently support encryption and content marking for files in Azure Purview.

### <a name="labeling-file-types"></a>Which file types can I apply sensitivity labels to in Azure Purview?

You can apply sensitivity labels to all [Azure Purview supported data sources and file types](sources-and-scans.md).

### <a name="DLP-support"></a>Does Azure Purview currently support Data Loss Prevention capabilities?

No, Azure Purview does not provide Data Loss Prevention capabilities yet. [Data Loss Prevention](https://docs.microsoft.com/en-us/microsoft-365/compliance/information-protection#prevent-data-loss) is currently only supported in Microsoft 365. 

### <a name="SQL-classification-comparison"></a>Why does Microsoft support two classification experiences for SQL databases – 'Azure Purview' and 'SQL data discovery and classification'?  

Azure Purview provides a classification and labeling experience for all your Azure assets including SQL databases. Azure Purview is for organizations that want to manage their entire data estate in a single place with the power of classification, labeling, alerting, and more. Also, the labels used in Azure Purview are MIP sensitivity labels. These labels have a global scope. No matter where your data moves to or transforms into, the label travels with the data. 

[SQL data discovery and classification](../azure-sql/database/data-discovery-and-classification-overview.md) is built into SQL. It existed before Purview as a way to provide basic capabilities for discovering, classifying, labeling, and reporting the sensitive data in your SQL databases. Also, the experience uses local labels and does not support sensitivity labels. 

Microsoft plans to integrate Azure Purview and SQL classification, in the future, to provide a unified and consistent experience.

### <a name="SQL-local-labels"></a>I applied labels in SQL data discovery and classification. Why are these labels not showing up on my asset in Azure Purview?

SQL classification uses local labels, while Azure Purview uses MIP sensitivity labels. Labels applied in SQL classification experience will not show up in Purview.  

Microsoft plans to provide a unified classification experience across Azure Purview and SQL, in the future. When the integration is complete, sensitivity labels applied in SQL or Azure Purview will be one and the same. 