---
title: Workbooks gallery in Azure Security Center
description: Learn how to create rich, interactive reports of your Azure Security Center data with the integrated Azure Monitor Workbooks gallery
author: memildin
ms.author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 07/07/2021
---

# Create rich, interactive reports of Security Center data

[Azure Monitor Workbooks](../azure-monitor/visualize/workbooks-overview.md) provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences.

Workbooks provide a rich set of capabilities for visualizing your Azure data. For detailed examples of each visualization type, see the [visualizations examples and documentation](../azure-monitor/visualize/workbooks-text-visualizations.md). 

Within Azure Security Center, you can access the built-in workbooks to track your organization’s security posture. You can also build custom workbooks to view a wide range of data from Security Center or other supported data sources.

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Secure score over time workbook.":::

## Availability

| Aspect                          | Details                                                                                                                                      |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                  | General availability (GA)                                                                                                                    |
| Pricing:                        | Free                                                                                                                                         |
| Required roles and permissions: | To save workbooks, you must have at least [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) permissions on the target resource group |
| Clouds:                         | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National/Sovereign (Azure Government, Azure China 21Vianet) |
|                                 |                                                                                                                                              |

## Workbooks gallery in Azure Security Center

With the integrated Azure Workbooks functionality, Azure Security Center makes it straightforward to build your own custom, interactive workbooks. Security Center also includes a gallery with the following workbooks ready for your customization:

- ['Secure Score Over Time' workbook](#use-the-secure-score-over-time-workbook) - Track your subscriptions' scores and changes to recommendations for your resources
- ['System Updates' workbook](#use-the-system-updates-workbook) - View missing system updates by resources, OS, severity, and more
- ['Vulnerability Assessment Findings' workbook](#use-the-vulnerability-assessment-findings-workbook) - View the findings of vulnerability scans of your Azure resources
- ['Compliance Over Time' workbook](#use-the-compliance-over-time-workbook) - View the status of a subscription's compliance with the regulatory or industry standards you've selected 

:::image type="content" source="media/custom-dashboards-azure-workbooks/workbooks-gallery-security-center.png" alt-text="Gallery of built-in workbooks in Azure Security Center.":::

Choose one of the supplied workbooks or create your own.

> [!TIP]
> Use the **Edit** button to customize any of the supplied workbooks to your satisfaction. When you're done editing, select **Save** and your changes will be saved to a new workbook.
> 
> :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-supplied-workbooks.png" alt-text="Editing the supplied workbooks to customize them for your particular needs.":::

### Use the 'Secure Score Over Time' workbook

This workbook uses secure score data from your Log Analytics workspace. That data needs to be exported from the continuous export tool as described in [Configure continuous export from the Security Center pages in Azure portal](continuous-export.md?tabs=azure-portal).

When you set up the continuous export, set the export frequency to both **streaming updates** and **snapshots**.

:::image type="content" source="media/custom-dashboards-azure-workbooks/export-frequency-both.png" alt-text="For the secure score over time workbook you'll need to select both of these options from the export frequency settings in your continuous export configuration.":::

> [!NOTE]
> Snapshots get exported weekly, so you'll need to wait at least one week for the first snapshot to be exported before you can view data in this workbook.

> [!TIP]
> To configure continuous export across your organization, use the supplied Azure Policy 'DeployIfNotExist' policies described in [Configure continuous export at scale](continuous-export.md?tabs=azure-policy).

The secure score over time workbook has five graphs for the subscriptions reporting to the selected workspaces:

|Graph  |Example  |
|---------|---------|
|**Score trends for the last week and month**<br>Use this section to monitor the current score and general trends of the scores for your subscriptions.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-1.png" alt-text="Trends for secure score on the built-in workbook.":::|
|**Aggregated score for all selected subscriptions**<br>Hover your mouse over any point in the trend line to see the aggregated score at any date in the selected time range.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-2.png" alt-text="Aggregated score for all selected subscriptions.":::|
|**Recommendations with the most unhealthy resources**<br>This table helps you triage the recommendations that have had the most resources changed to unhealthy over the selected period.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-3.png" alt-text="Recommendations with the most unhealthy resources.":::|
|**Scores for specific security controls**<br>Security Center's security controls are logical groupings of recommendations. This chart shows you, at a glance, the weekly scores for all of your controls.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-4.png" alt-text="Scores for your security controls over the selected time period.":::|
|**Resources changes**<br>Recommendations with the most resources that have changed state (healthy, unhealthy, or not applicable) during the selected period are listed here. Select any recommendation from the list to open a new table listing the specific resources.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-5.png" alt-text="Recommendations with the most resources that have changed health state.":::|

### Use the 'System Updates' workbook

This workbook is based on the security recommendation "System updates should be installed on your machines".

The workbook helps you identify machines with outstanding updates.

You can view the situation for the selected subscriptions according to:

- The list of resources with outstanding updates
- The list of updates missing from your resources

:::image type="content" source="media/custom-dashboards-azure-workbooks/system-updates-report.png" alt-text="Security Center's system updates workbook based on the missing updates security recommendation":::

### Use the 'Vulnerability Assessment Findings' workbook

Security Center includes vulnerability scanners for your machines, containers in container registries, and SQL servers.

Learn more about using these scanners:

- [Scan your machines with the integrated VA scanner](deploy-vulnerability-assessment-vm.md)
- [Scan your registry images for vulnerabilities](defender-for-container-registries-usage.md)
- [Scan your SQL resources for vulnerabilities](defender-for-sql-on-machines-vulnerability-assessment.md)

Findings for each of these scanners are reported in separate recommendations:

- Vulnerabilities in your virtual machines should be remediated
- Vulnerabilities in Azure Container Registry images should be remediated (powered by Qualys)
- Vulnerability assessment findings on your SQL databases should be remediated
- Vulnerability assessment findings on your SQL servers on machines should be remediated

This workbook gathers these findings and organizes them by severity, resource type, and category.

:::image type="content" source="media/custom-dashboards-azure-workbooks/vulnerability-assessment-findings-report.png" alt-text="Security Center's vulnerability assessment findings report.":::


### Use the 'Compliance Over Time' workbook

Azure Security Center continually compares the configuration of your resources with requirements in industry standards, regulations, and benchmarks. Built-in standards include NIST SP 800-53, SWIFT CSP CSCF v2020, Canada Federal PBMM, HIPAA HITRUST, and more. You can select the specific standards relevant to your organization using the regulatory compliance dashboard. Learn more in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

This workbook lets you track your compliance status over time with the various standards you've added to your dashboard.

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-select-standards.png" alt-text="Select the standards for your compliance over time report.":::

When you select a standard from the overview area of the report, the lower pane reveals a more detailed breakdown:

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-details.png" alt-text="Detailed breakdown of the changes regarding a specific standard.":::

You can keep drilling down - right down to the recommendation level - to view the resources that have passed or failed each control. 

> [!TIP]
> For each panel of the report, you can export the data to Excel with the "Export to Excel" option.
>
> :::image type="content" source="media/custom-dashboards-azure-workbooks/export-workbook-data.png" alt-text="Exporting compliance workbook data to Excel.":::


## Import workbooks from other workbook galleries

If you've built workbooks in other Azure services and want to move them into your Azure Security Center workbooks gallery:

1. Open the target workbook.

1. From the toolbar, select **Edit**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks.png" alt-text="Editing an Azure Monitor workbook.":::

1. From the toolbar, select **</>** to enter the Advanced Editor.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-advanced-editor.png" alt-text="Launching the advanced editor to get the Gallery Template JSON code.":::

1. Copy the workbook's Gallery Template JSON.

1. Open workbooks gallery in Security Center and from the menu bar select **New**.
1. Select the **</>** to enter the Advanced Editor.
1. Paste in the entire Gallery Template JSON.
1. Select **Apply**.
1. From the toolbar, select **Save As**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-save-as.png" alt-text="Saving the workbook to the gallery in Security Center.":::

1. Enter the required details for saving the workbook:
   1. A name for the workbook
   2. The desired region
   3. Subscription, resource group, and sharing as appropriate.

You'll find your saved workbook in the **Recently modified workbooks** category.


## Next steps

This article described Security Center's integrated Azure Monitor Workbooks page with built-in reports and the option to build your own custom, interactive reports.

- Learn more about [Azure Monitor Workbooks](../azure-monitor/visualize/workbooks-overview.md)
- The built-in workbooks pull their data from Security Center's recommendations. Learn about the many security recommendations in [Security recommendations - a reference guide](recommendations-reference.md)