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

Start by ingesting your Azure Purview logs into Microsoft Sentinel through a data connector. Then use a Microsoft Sentinel workbook to view data such as assets scanned, classifications found, and labels applied by Azure Purview. Use analytics rules to create alerts for changes within data sensitivity.

Customize the Azure Purview workbook and analytics rules to best suit the needs of your organization, and combine Azure Purview logs with data ingested from other sources to create enriched insights within Microsoft Sentinel.

In this tutorial, you:

> [!div class="checklist"]
>
> * Install the Microsoft Sentinel solution for Azure Purview
> * Enable your Azure Purview data connector
> * Use Log Analytics to query for Azure Purview alerts
> * Learn about the analytics rules, workbooks, and playbooks deployed to your Microsoft Sentinel workspace with the Defender for IoT solution

## Prerequisites

Before you start, make sure you have both a [Microsoft Sentinel workspace](quickstart-onboard.md) and [Azure Purview](/azure/purview/create-catalog-portal) onboarded, and that your user has the following roles:

- **An Azure Purview account [Owner](/azure/role-based-access-control/built-in-roles) or [Contributor](/azure/role-based-access-control/built-in-roles) role**, to set up Diagnostic Settings and configure the data connector.

- **A [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role**, with write permissions to enable data connector, view the workbook, and create analytic rules.

## Install the Azure Purview solution

The **Azure Purview** solution is a set of bundled content, including analytics rules and workbooks configured specifically for Azure Purview data.

> [!TIP]
> Microsoft Sentinel [solutions](sentinel-solutions.md) can help you onboard Microsoft Sentinel security content for a specific data connector using a single process. 

**To install the solution**

1. In Microsoft Sentinel, under **Content management**, select **Content hub** and then locate the **Azure Purview** solution.

1. At the bottom right, select **View details**, and then **Create**. Select the subscription, resource group, and workspace where you want to install the solution, and then review the data connector and related security content that will be deployed.

    When you're done, select **Review + Create** to install the solution.

For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md) and [Centrally discover and deploy out-of-the-box content and solutions](sentinel-solutions-deploy.md).


## Start ingesting Azure Purview data in Microsoft Sentinel

Configure a diagnostic settings to have Azure Purview data sensitivity logs flow into Microsoft Sentinel, and then run an Azure Purview scan to start ingesting your data.

Diagnostics settings sends log events only after a full scan is run, or when a change is detected during an incremental scan. It typically takes about 10-15 minutes for the logs to start appearing in Microsoft Sentinel.

> [!TIP]
> Instructions for enabling your data connector also available in Microsoft Sentinel, on the **Azure Purview** data connector page.
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

**To run an Azure Purview scan and view data in Microsoft Sentinel**:

1. In Azure Purview, run a full scan of your resources. For more information, see [Manage data sources in Azure Purview](/azure/purview/manage-data-sources).

1. After your Azure Purview scans have completed, go back to the Azure Purview data connector in Microsoft Sentinel and confirm that data has been received.

## View recent data discovered by Azure Purview

Use this procedure to customize the Azure Purview analytics rules and then view your data in a Microsoft Sentinel workbook.

> [!NOTE]
> Microsoft Sentinel analytics rules are KQL queries that trigger alerts when suspicious activity has been detected. Customize and group your rules together to create incidents for your SOC team to investigate.
>

For example, customize the rule so that alerts are generated each time the specified classification, such as *Social Security Numbers* are detected. Customize the rule's query to detect assets with specific classification, sensitivity label, source region, and more. Combine the data generated with other data in Microsoft Sentinel to enrich your detections and alerts.

**To modify the Azure Purview analytics rule templates**:

1. In Microsoft Sentinel, under **Configuration** select **Analytics** > **Active rules**, and search for a rule named **Sensitive Data Discovered in the Last 24 Hours**.

    By default, analytics rules created by Microsoft Sentinel solutions are set to disabled. Make sure to enable the rule for your workspace before continuing:

    1. Select the rule, and then at the bottom right, select **Edit**.

    1. In the analytics rule wizard, at the bottom of the **General** tab, toggle the **Status** to **Enabled**.

1. If you haven't yet, edit the rule to open the analytics rule wizard, and configure the rule to define the data fields and classifications to query for.

    - Supported data fields
    - [Supported classifications](/azure/purview/supported-classifications)

    On the **Set rule logic** tab, under **Query scheduling**, define settings so that the rules show data discovered in the last 24 hours.

    :::image type="content" source="media/purview-solution/analytics-rule-wizard.png" alt-text="Screenshot of the analytics rule wizard defined to show data detected in the last 24 hours.":::

    For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

**To view Azure Purview data in Microsoft Sentinel workbooks**

In Microsoft Sentinel, under **Threat management**, select **Workbooks**, and locate the **Azure Purview** workbook deployed with the **Azure Purview** solution. Open the workbook and customize any parameters as needed.

The Azure Purview workbook displays the following tabs:

- **Overview**: Displays the regions and resources types where the data is located.
- **Classifications**: Displays assets that contain specified classifications, like Credit Card Numbers.
- **Sensitivity labels**: Displays the assets that have confidential labels, and the assets that currently have no labels.

To drill down in the Azure Purview workbook:

- Select a specific data source to jump to that resource in Azure.
- Select an asset path link to show more details, with all the data fields shared in the ingested logs.
- Select a row in the Data Source, Classification, or Sensitivity Label tables to filter the Asset Level data as configured.

## Next steps

For more information, see:

- [Visualize collected data](get-visibility.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md)
