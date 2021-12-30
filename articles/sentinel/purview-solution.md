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

Before you start, make sure you both a [Microsoft Sentinel workspace](quickstart-onboard.md) and [Azure Purview](/azure/purview/create-catalog-portal) onboarded, and that your user has the following roles:

- **An Azure Purview account [Owner](/azure/role-based-access-control/built-in-roles) or [Contributor](/azure/role-based-access-control/built-in-roles) role**, to set up Diagnostic Settings and configure the data connector.

- **A [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role**, with write permissions to enable data connector, view the workbook, and create analytic rules.

## Install the Azure Purview solution

The **Azure Purview** solution is a set of bundled content, including analytics rules and workbooks configured specifically for Azure Purview data.

> [!TIP]
> Microsoft Sentinel [solutions](sentinel-solutions.md) can help you onboard Microsoft Sentinel security content for a specific data connector using a single process. For example, the **Azure Purview** supports the integration with <x>.

**To install the solution**

1. In Microsoft Sentinel, under **Content management**, select **Content hub** and then locate the **Azure Purview** solution.

1. At the bottom right, select **View details**, and then **Create**. Select the subscription, resource group, and workspace where you want to install the solution, and then review the data connector and related security content that will be deployed.

    When you're done, select **Review + Create** to install the solution.

For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md) and [Centrally discover and deploy out-of-the-box content and solutions](sentinel-solutions-deploy.md).


## Connect your data from Azure Purview to Microsoft Sentinel

Configure your Azure Purview settings to enable data sensitivity logs to flow into Microsoft Sentinel through the **Azure Purview** data connector.

> [!TIP]
> The following instructions are also available in Microsoft Sentinel, on the **Azure Purview** data connector page.
>

**To enable data sensitivity logs to flow into Microsoft Sentinel**:

1. Navigate to your Azure Purview account in the Azure portal and select **Diagnostic settings**.

    :::image type="content" source="media/purview-solution/diagnostics-settings.png" alt-text="Screenshot of an Azure Purview account Diagnostics settings page.":::

1. Select **+ Add diagnostic setting** and configure the new setting to send logs from Azure Purview to Microsoft Sentinel:

    - Enter a meaningful name for your setting.
    - Under **Logs**, select **DataSensitivityLogEvent**.
    - Under **Destination details**, select **Send to Log Analytics workspace**, and select the subscription and workspace details used for Microsoft Sentinel.

1. Select **Save**.

For more information, see [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md#diagnostic-settings-based-connections).


## View recent data discovered by Azure Purview

Use this procedure to update the analytics rules deployed with the Azure Sentinel solution to show sensitive data discovered in the last 24 and view your data in a Microsoft Sentinel workbook.

Analytical rules within Microsoft Sentinel are queries that trigger alerts when suspicious activity has been detected. The analytical rules can be customized and grouped together to created incidents to be investigated. Analytical rule templates provide the ability to demonstrate the types of queries that can be written to generate alerts. When the Azure Purview Solution is created, two analytical rule templates are generated based on classifications that have been detected by Azure Purview. The customized version of the analytical is triggered when a specific classification, like Social Security Numbers, is detected while the generic version is triggered when any classification has been found. Analytical rules created through Solutions in Microsoft Sentinel are disabled by default, so enable the generic or customized version that best suits the level of detection that is needed. In addition, the queries within the analytical rules can be modified to detect an asset with a specific classification, sensitivity label, source region, and more. The data generated from the Azure Purview Solution can also be combined with other data present in Microsoft Sentinel for enriched detections and alerts. 

How to modify an analytical rule: 
o	Select the analytical rule and edit.
o	Determine the data fields and classifications to query for.
o	List of data fields  
o	List of supported Azure Purview classifications: https://docs.microsoft.com/azure/purview/supported-classifications
o	Customize the analytical rule: Create custom analytics rules to detect threats with Microsoft Sentinel | Microsoft Docs

4.	Within Analytics, edit and enable the analytical rule templates to show sensitive data discovered in the last 24 hours. 
5.	Within Workbooks, view the saved Azure Purview Solution workbook and make any customizations needed. 
6.	Open Purview Studio and run a full scan of resources within Azure Purview. Diagnostic Settings only sends log events when a full scan is run or a change is detected during an incremental scan. 
o	Instructions on registering resources and setting up a scan within Azure Purview can be found here: How to manage multi-cloud data sources - Azure Purview | Microsoft Docs
7.	After scans have completed, navigate back to the Azure Purview data connector within Microsoft Sentinel and confirm that data is being received (it typically takes 10-15 minutes for the logs to begin appearing within Microsoft Sentinel).


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
