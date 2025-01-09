---
title: Integrate Microsoft Sentinel and Microsoft Purview
description: This article describes how to use the Microsoft Sentinel data connector and solution for Microsoft Purview to enable data sensitivity insights, create rules to monitor when classifications have been detected, and get an overview about data found by Microsoft Purview, and where sensitive data resides in your organization.
author: yelevin
ms.topic: how-to
ms.date: 11/11/2024
ms.author: yelevin


#Customer intent: As a security engineer, I want to integrate data governance logs with Microsoft Sentinel so that analysts can prioritize and investigate critical security incidents involving sensitive information.

---

# Integrate Microsoft Sentinel and Microsoft Purview

[Microsoft Purview](../purview/index.yml) provides organizations with visibility into where sensitive information is stored, helping prioritize at-risk data for protection. Integrate Microsoft Purview with Microsoft Sentinel to help narrow down the high volume of incidents and threats surfaced in Microsoft Sentinel, and understand the most critical areas to start.

Start by ingesting your Microsoft Purview logs into Microsoft Sentinel through a data connector. Then use a Microsoft Sentinel workbook to view data such as assets scanned, classifications found, and labels applied by Microsoft Purview. Use analytics rules to create alerts for changes within data sensitivity.

Customize the Microsoft Purview workbook and analytics rules to best suit the needs of your organization, and combine Microsoft Purview logs with data ingested from other sources to create enriched insights within Microsoft Sentinel.

## Prerequisites

Before you start, make sure you have both a [Microsoft Sentinel workspace](quickstart-onboard.md) and [Microsoft Purview](../purview/create-catalog-portal.md) onboarded, and that your user has the following roles:

- **A Microsoft Purview account [Owner](../role-based-access-control/built-in-roles.md) or [Contributor](../role-based-access-control/built-in-roles.md) role**, to set up diagnostic settings and configure the data connector.

- **A [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role**, with write permissions to enable data connector, view the workbook, and create analytic rules.

- **The Microsoft Purview** solution installed in your Log Analytics workspace enabled for Microsoft Sentinel.

    The **Microsoft Purview** solution is a set of bundled content, including a data connector, workbook, and analytics rules configured specifically for Microsoft Purview data. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md) and [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

    Instructions for enabling your data connector also available in Microsoft Sentinel, on the **Microsoft Purview** data connector page.

## Start ingesting Microsoft Purview data in Microsoft Sentinel

Configure diagnostic settings to have Microsoft Purview data sensitivity logs flow into Microsoft Sentinel, and then run a Microsoft Purview scan to start ingesting your data.

Diagnostics settings send log events only after a full scan is run, or when a change is detected during an incremental scan. It typically takes about 10-15 minutes for the logs to start appearing in Microsoft Sentinel.

**To enable data sensitivity logs to flow into Microsoft Sentinel**:

1. Navigate to your Microsoft Purview account in the Azure portal and select **Diagnostic settings**.

    :::image type="content" source="media/purview-solution/diagnostics-settings.png" alt-text="Screenshot of a Microsoft Purview account Diagnostics settings page.":::

1. Select **+ Add diagnostic setting** and configure the new setting to send logs from Microsoft Purview to Microsoft Sentinel:

    - Enter a meaningful name for your setting.
    - Under **Logs**, select **DataSensitivityLogEvent**.
    - Under **Destination details**, select **Send to Log Analytics workspace**, and select the subscription and workspace details used for Microsoft Sentinel.

1. Select **Save**.

For more information, see [Connect Microsoft Sentinel to other Microsoft services by using diagnostic settings-based connections](connect-services-diagnostic-setting-based.md).

**To run a Microsoft Purview scan and view data in Microsoft Sentinel**:

1. In Microsoft Purview, run a full scan of your resources. For more information, see [Scan data sources in Microsoft Purview](../purview/scan-data-sources.md).

1. After your Microsoft Purview scans have completed, go back to the Microsoft Purview data connector in Microsoft Sentinel and confirm that data has been received.

## View recent data discovered by Microsoft Purview

The Microsoft Purview solution provides two analytics rule templates out-of-the-box that you can enable, including a generic rule and a customized rule.

- The generic version, *Sensitive Data Discovered in the Last 24 Hours*, monitors for the detection of any classifications found across your data estate during a Microsoft Purview scan.
- The customized version, *Sensitive Data Discovered in the Last 24 Hours - Customized*, monitors and generates alerts each time the specified classification, such as Social Security Number, has been detected.

Use this procedure to customize the Microsoft Purview analytics rules' queries to detect assets with specific classification, sensitivity label, source region, and more. Combine the data generated with other data in Microsoft Sentinel to enrich your detections and alerts.

> [!NOTE]
> Microsoft Sentinel analytics rules are KQL queries that trigger alerts when suspicious activity has been detected. Customize and group your rules together to create incidents for your SOC team to investigate.
>

### Modify the Microsoft Purview analytics rule templates

1. In Microsoft Sentinel, open the **Microsoft Purview** solution, and then locate and select the **Sensitive Data Discovered in the Last 24 Hours - Customized** rule. On the side pane, select **Create rule** to create a new rule based on the template.

1. Go to the **Configuration** > **Analytics** page and select **Active rules**. Search for a rule named **Sensitive Data Discovered in the Last 24 Hours - Customized**.

    By default, analytics rules created by Microsoft Sentinel solutions are set to disabled. Make sure to enable the rule for your workspace before continuing:

    1. Select the rule. In the side pane, select **Edit**.

    1. In the analytics rule wizard, at the bottom of the **General** tab, toggle the **Status** to **Enabled**.

1. On the **Set rule logic** tab, adjust the **Rule query** to query for the data fields and classifications you want to generate alerts for. For more information on what can be included in your query, see:

    - Supported data fields are the columns of the [PurviewDataSensitivityLogs](/azure/azure-monitor/reference/tables/purviewdatasensitivitylogs) table
    - [Supported classifications](../purview/supported-classifications.md)

    Formatted queries have the following syntax: `| where {data-field} contains {specified-string}`.

    For example:

    ```Kusto
    PurviewDataSensitivityLogs
    | where Classification contains “Social Security Number”
    | where SourceRegion contains “westeurope”
    | where SourceType contains “Amazon”
    | where TimeGenerated > ago (24h)
    ```

1. Under **Query scheduling**, define settings so that the rules show data discovered in the last 24 hours. We also recommend that you set **Event grouping** to group all events into a single alert.

    :::image type="content" source="media/purview-solution/analytics-rule-wizard.png" alt-text="Screenshot of the analytics rule wizard defined to show data detected in the last 24 hours.":::

1. If needed, customize the **Incident settings** and **Automated response**  tabs. For example, in the **Incidents settings** tab, verify that **Create incidents from alerts triggered by this analytics rule** is selected.

1. On the **Review + create** tab, select **Save**.

For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

### View Microsoft Purview data in Microsoft Sentinel workbooks

1. In Microsoft Sentinel, open the **Microsoft Purview** solution, and then locate and select the **Microsoft Purview** workbook. On the side pane, select **Configuration** to add the workbook to your workspace.

1. In Microsoft Sentinel, under **Threat management**, select **Workbooks** > **My workbooks**, and locate the **Microsoft Purview** workbook. Save the workbook to your workspace, and then select **View saved workbook**. For example:

    :::image type="content" source="media/purview-solution/purview-workbook.png" alt-text="Screenshot of the Microsoft Purview workbook.":::

The Microsoft Purview workbook displays the following tabs:

- **Overview**: Displays the regions and resource types where the data is located.
- **Classifications**: Displays assets that contain specified classifications, like Credit Card Numbers.
- **Sensitivity labels**: Displays the assets that have confidential labels, and the assets that currently have no labels.

To drill down in the Microsoft Purview workbook:

- Select a specific data source to jump to that resource in Azure.
- Select an asset path link to show more details, with all the data fields shared in the ingested logs.
- Select a row in the **Data Source**, **Classification**, or **Sensitivity Label** tables to filter the Asset Level data as configured.

### Investigate incidents triggered by Microsoft Purview events

When investigating incidents triggered by the Microsoft Purview analytics rules, find detailed information on the assets and classifications found in the incident's **Events**.

For example:

:::image type="content" source="media/purview-solution/purview-incident.png" alt-text="Screenshot of an incident triggered by Purview events.":::

## Related content

For more information, see:

- [Visualize collected data](get-visibility.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
