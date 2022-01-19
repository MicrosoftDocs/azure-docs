---
title: Labeling in Azure Purview
description: Start utilizing sensitivity labels and classifications to enhance your Azure Purview assets
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 09/27/2021
---
# Labeling in Azure Purview

> [!IMPORTANT]
> Azure Purview Sensitivity Labels are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

To get work done, people in your organization collaborate with others both inside and outside the organization. Data doesn't always stay in your cloud, and often roams everywhere, across devices, apps, and services. When your data roams, you still want it to be secure in a way that meets your organization's business and compliance policies.</br>

Applying sensitivity labels to your content enables you to keep your data secure by stating how sensitive certain data is in your organization. It also abstracts the data itself, so you use labels to track the type of data, without exposing sensitive data on another platform.</br>

For example, applying a sensitivity label ‘highly confidential’ to a document that contains social security number and credit card numbers helps you identify the sensitivity of the document without knowing the actual data in the document.

## Benefits of labeling in Azure Purview

Azure Purview allows you to apply sensitivity labels to assets, enabling you to classify and protect your data.

* **Label travels with the data:** The sensitivity labels created in Microsoft 365 can also be extended to Azure Purview, SharePoint, Teams, Power BI, and SQL. When you apply a label on an office document and then scan it in Azure Purview, the label will flow to Azure Purview. While the label is applied to the actual file in M365, it is only added as metadata in the Azure Purview catalog. While there are differences in how a label is applied to an asset across various services/applications, labels travel with the data and is recognized by all the services you extend it to. 
* **Overview of your data estate:** Azure Purview provides insights into your data through pre-canned reports. When you scan data in Azure Purview, we hydrate the reports with information on what assets you have, scan history, classifications found in your data, labels applied, glossary terms, etc.
* **Automatic labeling:** Labels can be applied automatically based on sensitivity of the data. When an asset is scanned for sensitive data, autolabeling rules are used to decide which sensitivity label to apply. You can create autolabeling rules for each sensitivity label, defining which classification/sensitive information type constitutes a label.
* **Apply labels to files and database columns:** Labels can be applied to files in storage like Azure Data Lake, Azure Files, etc. and to schematized data like columns in Azure SQL DB, Cosmos DB, etc.

Sensitivity labels are tags that you can apply on assets to classify and protect your data. Learn more about [sensitivity labels here](/microsoft-365/compliance/create-sensitivity-labels).

## How to apply labels to assets in Azure Purview

:::image type="content" source="media/create-sensitivity-label/apply-label-flow.png" alt-text="Applying labels to assets in Azure Purview flow. Create labels, register asset, scan asset, classifications found, labels applied.":::

Being able to apply labels to your asset in Azure Purview requires you to perform the following steps:

1. [Create or extend existing sensitivity labels to Azure Purview](how-to-automatically-label-your-content.md), in the Microsoft 365 compliance center. Creating sensitivity labels include autolabeling rules that tell us which label should be applied based on the classifications found in your data.
1. [Register and scan your asset](how-to-automatically-label-your-content.md#scan-your-data-to-apply-sensitivity-labels-automatically) in Azure Purview.
1. Azure Purview applies classifications: When you schedule a scan on an asset, Azure Purview scans the type of data in your asset and applies classifications to it in the data catalog. Application of classifications is done automatically by Azure Purview, there is no action for you.
1. Azure Purview applies labels: Once classifications are found on an asset, Azure Purview will apply labels to the assets depending on autolabeling rules. Application of labels is done automatically by Azure Purview, there is no action for you as long as you have created labels with autolabeling rules in step 1.

> [!NOTE]
> Autolabeling rules are conditions that you specify, stating when a particular label should be applied. When these conditions are met, the label is automatically assigned to the data. When you create your labels, make sure to define autolabeling rules for both files and database columns to apply your labels automatically with each scan.
>

## Supported data sources

Sensitivity labels are supported in Azure Purview for the following data sources:

|Data type  |Sources  |
|---------|---------|
|Automatic labeling for files     |   - Azure Blob Storage</br>- Azure Files</br>- Azure Data Lake Storage Gen 1 and Gen 2</br>- Amazon S3|
|Automatic labeling for schematized data assets    |  - SQL server</br>- Azure SQL database</br>- Azure SQL Database Managed Instance</br>- Azure Synapse Analytics workspaces</br>- Azure Cosmos Database (SQL API)</br> - Azure database for MySQL</br> - Azure database for PostgreSQL</br> - Azure Data Explorer</br>  |
| | |

## Labeling for SQL databases

In addition to Azure Purview labeling for schematized data assets, Microsoft also supports labeling for SQL database columns using the SQL data classification in [SQL Server Management Studio (SSMS)](/sql/ssms/sql-server-management-studio-ssms). While Azure Purview uses the global [sensitivity labels](/microsoft-365/compliance/sensitivity-labels), SSMS only uses labels defined locally.

Labeling in Azure Purview and labeling in SSMS are separate processes that do not currently interact with each other. Therefore, **labels applied in SSMS are not shown in Azure Purview, and vice versa**. We recommend Azure Purview for labeling SQL databases, as it uses global MIP labels that can be applied across multiple platforms.

For more information, see the [SQL data discovery and classification documentation](/sql/relational-databases/security/sql-data-discovery-and-classification). </br></br>

> [!div class="nextstepaction"]
> [How to automatically label your content](./how-to-automatically-label-your-content.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)

> [!div class="nextstepaction"]
> [Labeling Frequently Asked Questions](sensitivity-labels-frequently-asked-questions.yml)
