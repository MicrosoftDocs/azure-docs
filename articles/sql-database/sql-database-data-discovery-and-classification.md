---
title: Azure SQL Database Data Discovery & Classification | Microsoft Docs
description: Azure SQL Database Data Discovery & Classification
services: sql-database
documentationcenter: ''
author: giladm
manager: shaik
ms.reviewer: carlrab
ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: security
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/29/2018
ms.author: giladm

---
# Azure SQL Database Data Discovery and Classification
Data Discovery & Classification (currently in preview) provides advanced capabilities built into Azure SQL Database for **discovering**, **classifying**, **labeling** & **protecting** the sensitive data in your databases.
Discovering and classifying your most sensitive data (business, financial, healthcare, PII, etc.) can play a pivotal role in your organizational information protection stature. It can serve as infrastructure for:
* Helping meet data privacy standards and regulatory compliance requirements, such as GDPR.
* Various security scenarios, such as monitoring (auditing) and alerting on anomalous access to sensitive data.
* Controlling access to and hardening the security of databases containing highly sensitive data.

## <a id="subheading-1"></a>Overview
Data Discovery & Classification introduces a set of advanced services and new SQL capabilities, forming a new SQL Information Protection paradigm aimed at protecting the data, not just the database:
* **Discovery & recommendations** – The classification engine scans your database and identifies columns containing potentially sensitive data. It then provides you an easy way to review and apply the appropriate classification recommendations via the Azure portal.
* **Labeling** – Sensitivity classification labels can be persistently tagged on columns using new classification metadata attributes introduced into the SQL Engine. This metadata can then be utilized for advanced sensitivity-based auditing and protection scenarios.
* **Query result set sensitivity** – The sensitivity of query result set is calculated in real time for auditing purposes.
* **Visibility** - The database classification state can be viewed in a detailed dashboard in the portal. Additionally, you can download a report (in Excel format) to be used for compliance & auditing purposes, as well as other needs.

## <a id="subheading-2"></a>Discovering, classifying & labeling sensitive columns
The following section describes the steps for discovering, classifying, and labeling columns containing sensitive data in your database, as well as viewing the current classification state of your database and exporting reports.

The classification includes two metadata attributes:
* Labels – The main classification attributes, used to define the sensitivity level of the data stored in the column.  
* Information Types – Provide additional granularity into the type of data stored in the column.

<br>
**To classify your SQL Database:**

1. Go to the [Azure portal](https://portal.azure.com).

2. Navigate to the **Data discovery & classification (preview)** setting in your SQL Database.

    ![Navigation pane][1]

3. The **Overview** tab includes a summary of the current classification state of the database, including a detailed list of all classified columns, which you can also filter to view only specific schema parts, information types and labels. If you haven’t yet classified any columns, [skip to step 5](#step-5).

    ![Navigation pane][2]

4. To download a report in Excel format, click on the **Export** option in the top menu of the window.

    ![Navigation pane][3]

5.  <a id="step-5"></a>To begin classifying your data, click on the **Classification tab** at the top of the window.

    ![Navigation pane][4]

6. The classification engine scans your database for columns containing potentially sensitive data and provides a list of **recommended column classifications**. To view and apply classification recommendations:

    * To view the list of recommended column classifications, click on the recommendations panel at the bottom of the window:

        ![Navigation pane][5]

    * Review the list of recommendations – to accept a recommendation for a specific column, check the checkbox in the left column of the relevant row. You can also mark *all recommendations* as accepted by checking the checkbox in the recommendations table header.

        ![Navigation pane][6]

    * To apply the selected recommendations, click on the blue **Accept selected recommendations** button.

        ![Navigation pane][7]

7. You can also **manually classify** columns as an alternative, or in addition, to the recommendation-based classification:

    * Click on **Add classification** in the top menu of the window.

        ![Navigation pane][8]

    * In the context window that opens, select the schema > table > column that you want to classify, and the information type and sensitivity label. Then click on the blue **Add classification** button at the bottom of the context window.

        ![Navigation pane][9]

8. To complete your classification and persistently label (tag) the database columns with the new classification metadata, click on **Save** in the top menu of the window.

    ![Navigation pane][10]

## <a id="subheading-3"></a>Auditing access to sensitive data

An important aspect of the information protection paradigm is the ability to monitor access to sensitive data.

[Azure SQL Database Auditing](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-auditing) has been enhanced to include a new field in the audit log called *data_sensitivity_information*, which logs the sensitivity classifications (labels) of the actual data that was returned by the query.

![Navigation pane][11]

## <a id="subheading-4"></a>Next steps
Consider configuring [Azure SQL Database Auditing](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-auditing) for monitoring and auditing access to your classified sensitive data.

<!--Anchors-->
[SQL Data Discovery & Classification overview]: #subheading-1
[Discovering, classifying & labeling sensitive columns]: #subheading-2
[Auditing access to sensitive data]: #subheading-3
[Next Steps]: #subheading-4

<!--Image references-->
[1]: ./media/sql-data-discovery-and-classification/1_data_classification_settings_menu.png
[2]: ./media/sql-data-discovery-and-classification/2_data_classification_overview_dashboard.png
[3]: ./media/sql-data-discovery-and-classification/3_data_classification_export_report.png
[4]: ./media/sql-data-discovery-and-classification/4_data_classification_classification_tab_click.png
[5]: ./media/sql-data-discovery-and-classification/5_data_classification_recommendations_panel.png
[6]: ./media/sql-data-discovery-and-classification/6_data_classification_recommendations_list.png
[7]: ./media/sql-data-discovery-and-classification/7_data_classification_accept_selected_recommendations.png
[8]: ./media/sql-data-discovery-and-classification/8_data_classification_add_classification_button.png
[9]: ./media/sql-data-discovery-and-classification/9_data_classification_manual_classification.png
[10]: ./media/sql-data-discovery-and-classification/10_data_classification_save.png
[11]: ./media/sql-data-discovery-and-classification/11_data_classification_audit_log.png
