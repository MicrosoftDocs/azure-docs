---
title: Workbooks gallery 
description: Learn how to create rich, interactive reports of your Microsoft Defender for Cloud data with the integrated Azure Monitor Workbooks gallery
ms.topic: conceptual
ms.custom: ignite-2022
ms.author: dacurwin
author: dcurwin
ms.date: 02/02/2023
---

# Create rich, interactive reports of Defender for Cloud data

[Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md) provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences.

Workbooks provide a rich set of capabilities for visualizing your Azure data. For detailed examples of each visualization type, see the [visualizations examples and documentation](../azure-monitor/visualize/workbooks-text-visualizations.md).

Within Microsoft Defender for Cloud, you can access the built-in workbooks to track your organization’s security posture. You can also build custom workbooks to view a wide range of data from Defender for Cloud or other supported data sources.

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Secure score over time workbook.":::

For pricing, check out the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

**Required roles and permissions**: To save workbooks, you must have at least [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) permissions on the target resource group

**Cloud availability**: :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds :::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)

## Workbooks gallery in Microsoft Defender for Cloud

With the integrated Azure Workbooks functionality, Microsoft Defender for Cloud makes it straightforward to build your own custom, interactive workbooks. Defender for Cloud also includes a gallery with the following workbooks ready for your customization:

- ['Secure Score Over Time' workbook](#use-the-secure-score-over-time-workbook) - Track your subscriptions' scores and changes to recommendations for your resources
- ['System Updates' workbook](#use-the-system-updates-workbook) - View missing system updates by resources, OS, severity, and more
- ['Vulnerability Assessment Findings' workbook](#use-the-vulnerability-assessment-findings-workbook) - View the findings of vulnerability scans of your Azure resources
- ['Compliance Over Time' workbook](#use-the-compliance-over-time-workbook) - View the status of a subscription's compliance with the regulatory or industry standards you've selected
- ['Active Alerts' workbook](#use-the-active-alerts-workbook) - View active alerts by severity, type, tag, MITRE ATT&CK tactics, and location.
- Price Estimation workbook - View monthly consolidated price estimations for Microsoft Defender for Cloud plans based on the resource telemetry in your own environment. These numbers are estimates based on retail prices and don't provide actual billing data.
- Governance workbook -  The governance report in the governance rules settings lets you track progress of the rules effective in the organization.
- ['DevOps Security (Preview)' workbook](#use-the-devops-security-preview-workbook) - View a customizable foundation that helps you visualize the state of your DevOps posture for the connectors you've configured.

In addition to the built-in workbooks, you can also find other useful workbooks found under the “Community" category, which is provided as is with no SLA or support. Choose one of the supplied workbooks or create your own.

:::image type="content" source="media/custom-dashboards-azure-workbooks/workbooks-gallery-microsoft-defender-for-cloud.png" alt-text="Screenshot showing the gallery of built-in workbooks in Microsoft Defender for Cloud.":::

> [!TIP]
> Use the **Edit** button to customize any of the supplied workbooks to your satisfaction. When you're done editing, select **Save** and your changes will be saved to a new workbook.
>
> :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-supplied-workbooks.png" alt-text="Editing the supplied workbooks to customize them for your particular needs.":::

### Use the 'Secure Score Over Time' workbook

This workbook uses secure score data from your Log Analytics workspace. That data needs to be exported from the continuous export tool as described in [Configure continuous export from the Defender for Cloud pages in Azure portal](continuous-export.md?tabs=azure-portal).

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
|**Scores for specific security controls**<br>Defender for Cloud's security controls is logical groupings of recommendations. This chart shows you, at a glance, the weekly scores for all of your controls.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-4.png" alt-text="Scores for your security controls over the selected time period.":::|
|**Resources changes**<br>Recommendations with the most resources that have changed state (healthy, unhealthy, or not applicable) during the selected period are listed here. Select any recommendation from the list to open a new table listing the specific resources.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-5.png" alt-text="Recommendations with the most resources that have changed health state.":::|

### Use the 'System Updates' workbook

This workbook is based on the security recommendation "System updates should be installed on your machines".

The workbook helps you identify machines with outstanding updates.

You can view the situation for the selected subscriptions according to:

- The list of resources with outstanding updates
- The list of updates missing from your resources

:::image type="content" source="media/custom-dashboards-azure-workbooks/system-updates-report.png" alt-text="Defender for Cloud's system updates workbook based on the missing updates security recommendation":::

### Use the 'Vulnerability Assessment Findings' workbook

Defender for Cloud includes vulnerability scanners for your machines, containers in container registries, and SQL servers.

Learn more about using these scanners:

- [Find vulnerabilities with Microsoft Defender Vulnerability Management](deploy-vulnerability-assessment-defender-vulnerability-management.md)
- [Find vulnerabilities with the integrated Qualys scanner](deploy-vulnerability-assessment-vm.md)
- [Scan your ACR images for vulnerabilities](defender-for-containers-vulnerability-assessment-azure.md)
- [Scan your ECR images for vulnerabilities](defender-for-containers-vulnerability-assessment-elastic.md)
- [Scan your SQL resources for vulnerabilities](defender-for-sql-on-machines-vulnerability-assessment.md)

Findings for each resource type are reported in separate recommendations:

- [Vulnerabilities in your virtual machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f) (includes findings from Microsoft Defender Vulnerability Management, the integrated Qualys scanner, and any configured [BYOL VA solutions](deploy-vulnerability-assessment-byol-vm.md))
- [Container registry images should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dbd0cb49-b563-45e7-9724-889e799fa648)
- [SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/82e20e14-edc5-4373-bfc4-f13121257c37)
- [SQL servers on machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f97aa83c-9b63-4f9a-99f6-b22c4398f936)

This workbook gathers these findings and organizes them by severity, resource type, and category.

:::image type="content" source="media/custom-dashboards-azure-workbooks/vulnerability-assessment-findings-report.png" alt-text="Defender for Cloud's vulnerability assessment findings report.":::

### Use the 'Compliance Over Time' workbook

Microsoft Defender for Cloud continually compares the configuration of your resources with requirements in industry standards, regulations, and benchmarks. Built-in standards include NIST SP 800-53, SWIFT CSP CSCF v2020, Canada Federal PBMM, HIPAA HITRUST, and more. You can select the specific standards relevant to your organization using the regulatory compliance dashboard. Learn more in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

This workbook tracks your compliance status over time with the various standards you've added to your dashboard.

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-select-standards.png" alt-text="Select the standards for your compliance over time report.":::

When you select a standard from the overview area of the report, the lower pane reveals a more detailed breakdown:

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-details.png" alt-text="Detailed breakdown of the changes regarding a specific standard.":::

You can keep drilling down - right down to the recommendation level - to view the resources that have passed or failed each control.

> [!TIP]
> For each panel of the report, you can export the data to Excel with the "Export to Excel" option.
>
> :::image type="content" source="media/custom-dashboards-azure-workbooks/export-workbook-data.png" alt-text="Exporting compliance workbook data to Excel.":::

### Use the 'Active Alerts' workbook

This workbook displays the active security alerts for your subscriptions on one dashboard. Security alerts are the notifications that Defender for Cloud generates when it detects threats on your resources. Defender for Cloud prioritizes, and lists the alerts, along with information needed for quick investigation and remediation.

This workbook benefits you by letting you understand the active threats on your environment, and allows you to prioritize between the active alerts.

> [!NOTE]
> Most workbooks use Azure Resource Graph (ARG) to query their data. For example, to display the Map View, Log Analytics workspace is used to query the data. [Continuous export](continuous-export.md) should be enabled, and export the security alerts to the Log Analytics workspace.

You can view the active alerts by severity, resource group, or tag.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-pie-charts.png" alt-text="Screenshot showing a sample view of the alerts viewed by Severity, Resource Group, or Tag.":::

You can also view your subscription's top alerts by attacked resources, alert types, and new alerts.

:::image type="content" source="media/custom-dashboards-azure-workbooks/top-alerts.png" alt-text="Screenshot highlighting the top alerts for your subscriptions.":::

You can get more details on any of these alerts by selecting it.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-high.png" alt-text="Screenshot that shows all the active alerts with high severity from a specific resource.":::

The MITRE ATT&CK tactics display by the order of the kill-chain, and the number of alerts the subscription has at each stage.

:::image type="content" source="media/custom-dashboards-azure-workbooks/mitre-attack-tactics.png" alt-text="Screenshot showing the order of the kill-chain, and the number of alerts":::

You can see all of the active alerts in a table with the ability to filter by columns. Select an alert to view button appears.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-table.png" alt-text="Screenshot showing the table of active alerts.":::

By selecting the Open Alert View button, you can see all the details of that specific alert.

:::image type="content" source="media/custom-dashboards-azure-workbooks/alert-details-screen.png" alt-text="Screenshot of an alert's details.":::

By selecting Map View, you can also see all alerts based on their location.

:::image type="content" source="media/custom-dashboards-azure-workbooks/alerts-map-view.png" alt-text="Screenshot of the alerts when viewed in a map.":::

Select a location on the map to view all of the alerts for that location.

:::image type="content" source="media/custom-dashboards-azure-workbooks/map-alert-details.png" alt-text="Screenshot showing the alerts in a specific location.":::

You can see the details for that alert with the Open Alert View button.

### Use the 'DevOps Security (Preview)' workbook

This workbook provides a customizable data analysis and gives you the ability to create visual reports. You can use this workbook to view insights into your DevOps security posture in coordination with Defender for DevOps. This workbook allows you to visualize the state of your DevOps posture for the connectors you've configured in Defender for Cloud, code, dependencies, and hardening. You can then investigate credential exposure, including types of credentials and repository locations.

:::image type="content" source="media/custom-dashboards-azure-workbooks/devops-workbook.png" alt-text="A screenshot that shows a sample results page once you've selected the DevOps workbook." lightbox="media/custom-dashboards-azure-workbooks/devops-workbook.png":::

> [!NOTE]
> You must have a [GitHub connector](quickstart-onboard-github.md) or a [DevOps connector](quickstart-onboard-devops.md), connected to your environment in order to utilize this workbook

**To deploy the workbook**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Workbooks**.

1. Select the **DevOps Security (Preview)** workbook.

The workbook will load and show you the Overview tab where you can see the number of exposed secrets, code security and DevOps security. All of these findings are broken down by total for each repository and the severity.

Select the Secrets tab to view the count by secret type.

:::image type="content" source="media/custom-dashboards-azure-workbooks/count-secret-type.png" alt-text="Screenshot of the Secrets tab that shows you your count by secret type." lightbox="media/custom-dashboards-azure-workbooks/count-secret-type.png":::

The Code tab displays your count findings by tool and repository and your code scanning by severity.

:::image type="content" source="media/custom-dashboards-azure-workbooks/code-findings.png" alt-text="Screenshot of the Code tab with all of its findings by tool, repository and severity." lightbox="media/custom-dashboards-azure-workbooks/code-findings.png":::

The Open Source Security (OSS) Vulnerabilities tab displays your OSS vulnerabilities by severity and the count of findings by repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/oss-vulnerabilities.png" alt-text="Screenshot of the Open Source Securities vulnerabilities tab, which shows you your  severities, and findings by repository.":::

The Infrastructure as Code tab displays your findings by tool and repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/infrastructure-code.png" alt-text="Screenshot of the Infrastructure as Code tab, which shows you your findings by tool and repository." lightbox="media/custom-dashboards-azure-workbooks/infrastructure-code.png":::

The Posture tab displays your security posture by severity and repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/posture-tab.png" alt-text="Screenshot of the Posture tab, which displays your security posture by severity and repository." lightbox="media/custom-dashboards-azure-workbooks/posture-tab.png":::

The Threats and Tactics tab displays the total count of threats and tactics and by repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/threats-and-tactics.png" alt-text="Screenshot of the Threats and Tactics tab which displays the total count of threats and tactics and by repository" lightbox="media/custom-dashboards-azure-workbooks/threats-and-tactics.png":::

## Import workbooks from other workbook galleries

To move workbooks that you've built in other Azure services into your Microsoft Defender for Cloud workbooks gallery:

1. Open the target workbook.

1. From the toolbar, select **Edit**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks.png" alt-text="Editing a workbook.":::

1. From the toolbar, select **</>** to enter the Advanced Editor.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-advanced-editor.png" alt-text="Launching the advanced editor to get the Gallery Template JSON code.":::

1. Copy the workbook's Gallery Template JSON.

1. Open the workbooks gallery in Defender for Cloud and from the menu bar select **New**.
1. Select the **</>** to enter the Advanced Editor.
1. Paste in the entire Gallery Template JSON.
1. Select **Apply**.
1. From the toolbar, select **Save As**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-save-as.png" alt-text="Saving the workbook to the gallery in Defender for Cloud.":::

1. Enter the required details for saving the workbook:
   1. A name for the workbook
   2. The desired region
   3. Subscription, resource group, and sharing as appropriate.

You'll find your saved workbook in the **Recently modified workbooks** category.

## Next steps

This article described Defender for Cloud's integrated Azure Workbooks page with built-in reports and the option to build your own custom, interactive reports.

- Learn more about [Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md)

- The built-in workbooks pull their data from Defender for Cloud's recommendations. Learn about the many security recommendations in [Security recommendations - a reference guide](recommendations-reference.md)


