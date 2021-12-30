---
title: Integrate Microsoft Sentinel and Azure Purview  | Microsoft Docs
description: This tutorial describes how to use the Microsoft Sentinel data connector and solution for Azure Purview to enable data sensitivity insights, create rules to monitor when classifications have been detected, and get an overview about data found by Azure Purview, and where sensitive data resides in your organization.
author: batamig
ms.topic: tutorial
ms.date: 12/20/2021
ms.author: bagol
---

# Tutorial: Integrate Microsoft Sentinel and Azure Purview

> [!IMPORTANT]
>
> The *Microsoft Sentinel data connector for Azure Purview* and the *Azure Purview* solution are in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[Azure Purview](/azure/purview/) provides organizations with visibility into where on the network sensitive information is stored, helping top prioritize at-risk data for protection.

Integrate Azure Purview with Microsoft Sentinel to help narrow down the high volume of incidents and threats surfaced in Microsoft Sentinel, and understand the most critical areas to start.

Start ingesting your Azure Purview logs into Microsoft Sentinel to view data such as assets scanned, classifications found, and labels applied by Azure Purview, using a Microsoft Sentinel workbook. Use analytics rules to create alerts for changes within data sensitivity.

Customize the Azure Purview workbook and analytics rules to best suit the needs of your organization, and combine Azure Purview logs with data ingested from other sources to create enriched insights with a single pane of glass.

In this tutorial, you:

> [!div class="checklist"]
>
> * Install the Microsoft Sentinel solution for Azure Purview
> * Enable your Azure Purview data connector
> * Use Log Analytics to query for Azure Purview alerts
> * Learn about the analytics rules, workbooks, and playbooks deployed to your Microsoft Sentinel workspace with the Defender for IoT solution

## Prerequisites

Before you start, make sure you both a Microsoft Sentinel workspace and Azure Purview onboarded, and that your user has the following roles:

- An Azure Purview account Owner or Contributor role, to set up Diagnostic Settings and configure the data connector.

- Azure Sentinel Contributor role, with write permissions to enable data connector, view workbook, and create analytic rules.

## Install the Azure Purview solution

1.	Within Microsoft Sentinel, navigate to Content Hub in the left navigation.

2.	Search for Azure Purview and follow the steps to install the solution. 

    o	Select a subscription, resource group, and workspace to deploy the solution.
    o	Look over the data connector, workbook, and analytical rules that will be enabled. 
    o	Review and create the solution. 

## Connect your data from Azure Purview to Microsoft Sentinel

3.	Within Data Connectors, search for Azure Purview, and follow the steps to enable the data sensitivity logs to flow into Microsoft Sentinel through the data connector. 

    o	Navigate to your Azure Purview account within the Azure Portal.
o	From the navigation bar, select Diagnostic Settings.
o	Within Diagnostic Settings, select + Add diagnostic setting. 
o	Add a Diagnostic Setting to send logs from Azure Purview to Microsoft Sentinel.
o	Choose a Diagnostic setting name.
o	Select DataSensitivityLogEvent under logs.
o	Select Send to Log Analytics workspace and set the subscription and log analytics workspace to match what is being used by Microsoft Sentinel.
o	Select Save. 

## View recent data discovered by Azure Purview

4.	Within Analytics, edit and enable the analytical rule templates to show sensitive data discovered in the last 24 hours. 
5.	Within Workbooks, view the saved Azure Purview Solution workbook and make any customizations needed. 
6.	Open Purview Studio and run a full scan of resources within Azure Purview. Diagnostic Settings only sends log events when a full scan is run or a change is detected during an incremental scan. 
o	Instructions on registering resources and setting up a scan within Azure Purview can be found here: How to manage multi-cloud data sources - Azure Purview | Microsoft Docs
7.	After scans have completed, navigate back to the Azure Purview data connector within Microsoft Sentinel and confirm that data is being received (it typically takes 10-15 minutes for the logs to begin appearing within Microsoft Sentinel).

## Detect sensitive data out-of-the-box with Azure Purview logs

### Use out-of-the-box analytics rules

Analytical rules within Microsoft Sentinel are queries that trigger alerts when suspicious activity has been detected. The analytical rules can be customized and grouped together to created incidents to be investigated. Analytical rule templates provide the ability to demonstrate the types of queries that can be written to generate alerts. When the Azure Purview Solution is created, two analytical rule templates are generated based on classifications that have been detected by Azure Purview. The customized version of the analytical is triggered when a specific classification, like Social Security Numbers, is detected while the generic version is triggered when any classification has been found. Analytical rules created through Solutions in Microsoft Sentinel are disabled by default, so enable the generic or customized version that best suits the level of detection that is needed. In addition, the queries within the analytical rules can be modified to detect an asset with a specific classification, sensitivity label, source region, and more. The data generated from the Azure Purview Solution can also be combined with other data present in Microsoft Sentinel for enriched detections and alerts. 

How to modify an analytical rule: 
o	Select the analytical rule and edit.
o	Determine the data fields and classifications to query for.
o	List of data fields  
o	List of supported Azure Purview classifications: https://docs.microsoft.com/azure/purview/supported-classifications
o	Customize the analytical rule: Create custom analytics rules to detect threats with Microsoft Sentinel | Microsoft Docs

## WorkbookWorkbook
The Azure Purview workbook features insights on resources, classifications, and sensitivity labels that are detected through scans by Azure Purview. Begin by setting the filters to narrow down the data displayed in the workbook. The overview tab showcases the regions and resource types that the data is located in. The classifications tab provides the ability to see all the assets that contain a specific classification, like Credit Card Numbers. The sensitivity labels tab showcases which assets have confidential labels and which assets currently have no labels. The workbook can be customized by adding, deleting, and editing visualizations. 
How to drilldown to the asset level within the workbook:
o	Selecting the hyperlink of a Data Source will link to the Azure portal view of the resource.
o	Selecting the hyperlink of an Asset Path will generate an in-depth details pane containing all the data fields present in the logs.
o	Selecting the row of the Data Source, Classification, or Sensitivity Label tables will filter the Asset Level drilldown to only contain assets with the respective selection.  

## Next steps

For more information, see:

- [Visualize collected data](get-visibility.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md)
