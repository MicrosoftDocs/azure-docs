---
title: Use gallery workbooks 
description: Learn how to create rich, interactive reports of your Microsoft Defender for Cloud data by using workbooks from the integrated Azure Monitor Workbooks gallery.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 12/06/2023
---

# Create rich, interactive reports of Defender for Cloud data by using workbooks

[Azure workbooks](../azure-monitor/visualize/workbooks-overview.md) are a flexible canvas that you can use to analyze data and create rich, visual reports in the Azure portal. In workbooks, you can tap into multiple data sources across Azure. You can combine workbooks into unified, interactive experiences.

Workbooks provide a rich set of capabilities for visualizing your Azure data. For detailed information about each visualization type, see the [visualizations examples and documentation](../azure-monitor/visualize/workbooks-text-visualizations.md).

In Microsoft Defender for Cloud, you can access built-in workbooks to track your organization’s security posture. You can also build custom workbooks to view a wide range of data from Defender for Cloud or other supported data sources.

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Screenshot that shows the Secure Score Over Time workbook.":::

For pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

**Required roles and permissions**: To save a workbook, you must have at least [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) permissions on the affected resource group.

**Cloud availability**: :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds :::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)

## Use Defender for Cloud gallery workbooks

With the integrated Azure Workbooks functionality, Microsoft Defender for Cloud makes it straightforward to build your own custom, interactive workbooks. Defender for Cloud also includes a gallery that has the following workbooks ready for you to customize:

- [Coverage workbook](#coverage-workbook): Track the coverage of Defender for Cloud plans and extensions across your environments and subscriptions.
- [Secure Score Over Time workbook](#secure-score-over-time-workbook): Track your subscription scores and changes to recommendations for your resources.
- [System Updates workbook](#system-updates-workbook): View missing system updates by resource, OS, severity, and more.
- [Vulnerability Assessment Findings workbook](#vulnerability-assessment-findings-workbook): View the findings of vulnerability scans of your Azure resources.
- [Compliance Over Time workbook](#compliance-over-time-workbook): View the status of a subscription's compliance with the regulatory or industry standards that you've selected.
- [Active Alerts workbook](#active-alerts-workbook): View active alerts by severity, type, tag, MITRE ATT&CK tactics, and location.
- Price Estimation workbook: View monthly, consolidated price estimations for Microsoft Defender for Cloud plans based on the resource telemetry in your own environment. The numbers are estimates based on retail prices and don't represent actual billing or invoice data.
- Governance workbook: Use the governance report in the governance rules settings to track progress of the rules that are effective in the organization.
- [DevOps Security (Preview) workbook](#devops-security-workbook): View a customizable foundation that helps you visualize the state of your DevOps posture for the connectors you've set up.

Along with built-in workbooks, you can find other useful workbooks in the **Community** category. These workbooks are provided as-is and have no SLA or support. You can choose one of the supplied workbooks or create your own.

:::image type="content" source="media/custom-dashboards-azure-workbooks/workbooks-gallery-microsoft-defender-for-cloud.png" alt-text="Screenshot that shows the gallery of built-in workbooks in Microsoft Defender for Cloud.":::

> [!TIP]
> To customize any of the workbooks, select the **Edit** button. When you're done editing, select **Save**. The changes are saved in a new workbook.
>
> :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-supplied-workbooks.png" alt-text="Screenshot that shows how to edit a supplied workbook to customize it for your needs.":::
>

### Coverage workbook

Enabling Defender for Cloud across multiple subscriptions and environments (Azure, AWS, and GCP) can make it hard to keep track of which plans are active. This is especially true if you have multiple subscriptions and environments.

The Coverage workbook allows you to keep track of which Defender for Cloud plans are active on which parts of your environments. This workbook can help you to ensure that your environments and subscriptions are fully protected. By having access to detailed coverage information, you can also identify any areas that might need other protection and take action to address those areas.

:::image type="content" source="media/custom-dashboards-azure-workbooks/coverage.png" alt-text="Screenshot that shows the Coverage workbook display the plans and extensions that are enabled in various subscriptions and environments." lightbox="media/custom-dashboards-azure-workbooks/coverage.png":::

In this workbook, you can select a subscription (or all subscriptions), and then view the following tabs:

- **Additional information**: Shows release notes and an explanation of each toggle.
- **Relative coverage**: Shows the percentage of subscriptions or connectors that have a specific Defender for Cloud plan enabled.
- **Absolute coverage**: Shows each plan's status per subscription.
- **Detailed coverage**: Shows additional settings that can be enabled or must need to be enabled on relevant plans to get each plan's full value.

You can also select the Azure, Amazon Web Services, or Google Cloud Platform environment in each or all subscriptions to see which plans and extensions are enabled for that environment.

### Secure Score Over Time workbook

This workbook uses secure score data from your Log Analytics workspace. The data must be exported from the continuous export tool as described in [Configure continuous export from the Defender for Cloud pages in the Azure portal](continuous-export.md?tabs=azure-portal).

When you set up continuous export, under **Export frequency**, select both **Streaming updates** and **Snapshots (Preview)**.

:::image type="content" source="media/custom-dashboards-azure-workbooks/export-frequency-both.png" alt-text="Screenshot that shows the export frequency options to select for continuous export in the Secure Score Over Time workbook.":::

> [!NOTE]
> Snapshots are exported weekly. There's a delay of at least one week after the first snapshot is exported before you can view data in the workbook.

> [!TIP]
> To configure continuous export across your organization, use the supplied `DeployIfNotExist` policies in Azure Policy that are described in [Configure continuous export at scale](continuous-export.md?tabs=azure-policy).

The Secure Score Over Time workbook has five graphs for the subscriptions that report to the selected workspaces:

|Graph  |Example  |
|---------|---------|
|**Score trends for the last week and month**<br>Use this section to monitor the current score and general trends of the scores for your subscriptions.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-1.png" alt-text="Screenshot that shows trends for secure score on the built-in workbook.":::|
|**Aggregated score for all selected subscriptions**<br>Hover your mouse over any point in the trend line to see the aggregated score at any date in the selected time range.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-2.png" alt-text="Screenshot that shows an aggregated score for all selected subscriptions.":::|
|**Recommendations with the most unhealthy resources**<br>This table helps you triage the recommendations that have had the most resources that changed to an unhealthy status over the selected period.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-3.png" alt-text="Screenshot that shows recommendations that have the most unhealthy resources.":::|
|**Scores for specific security controls**<br>The security controls in Defender for Cloud are logical groupings of recommendations. This chart shows you at a glance the weekly scores for all your controls.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-4.png" alt-text="Screenshot that shows scores for your security controls over the selected time period.":::|
|**Resources changes**<br>Recommendations that have the most resources that changed state (healthy, unhealthy, or not applicable) during the selected period are listed here. Select any recommendation in the list to open a new table that lists the specific resources.|:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-table-5.png" alt-text="Screenshot that shows recommendations that have the most resources that changed health state during the selected period.":::|

### System Updates workbook

This workbook is based on the security recommendation that system updates should be installed on your machines. The workbook helps you identify machines that have updates to apply.

You can view the update status for selected subscriptions by:

- A list of resources that have outstanding updates to apply.
- A list of updates that are missing from your resources.

:::image type="content" source="media/custom-dashboards-azure-workbooks/system-updates-report.png" alt-text="Defender for Cloud's system updates workbook based on the missing updates security recommendation.":::

### Vulnerability Assessment Findings workbook

Defender for Cloud includes vulnerability scanners for your machines, containers in container registries, and computers running SQL Server.

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

:::image type="content" source="media/custom-dashboards-azure-workbooks/vulnerability-assessment-findings-report.png" alt-text="Screenshot that shows the Defender for Cloud vulnerability assessment findings report.":::

### Compliance Over Time workbook

Microsoft Defender for Cloud continually compares the configuration of your resources with requirements in industry standards, regulations, and benchmarks. Built-in standards include NIST SP 800-53, SWIFT CSP CSCF v2020, Canada Federal PBMM, HIPAA HITRUST, and more. You can select the specific standards relevant to your organization using the regulatory compliance dashboard. Learn more in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

This workbook tracks your compliance status over time by using the various standards that you add to your dashboard.

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-select-standards.png" alt-text="Screenshot that shows how to select the standards for your Compliance Over Time report.":::

When you select a standard from the overview area of the report, the lower pane reveals a more detailed breakdown:

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-details.png" alt-text="Screenshot that shows how to a detailed breakdown of the changes regarding a specific standard.":::

You can keep drilling down - right down to the recommendation level - to view the resources that have passed or failed each control.

> [!TIP]
> For each panel of the report, you can export the data to Excel by using the **Export to Excel** option.
>
> :::image type="content" source="media/custom-dashboards-azure-workbooks/export-workbook-data.png" alt-text="Exporting compliance workbook data to Excel.":::

### Active Alerts workbook

This workbook displays the active security alerts for your subscriptions on one dashboard. Security alerts are the notifications that Defender for Cloud generates when it detects threats on your resources. Defender for Cloud prioritizes and lists the alerts with the information you need to quickly investigate and remediate.

This workbook benefits you by letting you understand the active threats on your environment, and allows you to prioritize between the active alerts.

> [!NOTE]
> Most workbooks use Azure Resource Graph to query data. For example, to display Map View, a Log Analytics workspace is used to query the data. [Continuous export](continuous-export.md) should be enabled. Export the security alerts to the Log Analytics workspace.

You can view the active alerts by severity, resource group, or tag.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-pie-charts.png" alt-text="Screenshot that shows a sample view of the alerts viewed by severity, resource group, or tag.":::

You can also view your subscription's top alerts by attacked resources, alert types, and new alerts.

:::image type="content" source="media/custom-dashboards-azure-workbooks/top-alerts.png" alt-text="Screenshot highlighting the top alerts for your subscriptions.":::

To see more details about an alert, select the alert.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-high.png" alt-text="Screenshot that shows all high-severity active alerts for a specific resource.":::

The MITRE ATT&CK tactics are listed by the order of the kill chain and the number of alerts that the subscription has at each stage.

:::image type="content" source="media/custom-dashboards-azure-workbooks/mitre-attack-tactics.png" alt-text="Screenshot that shows the order of the kill chain and the number of alerts.":::

You can see all the active alerts in a table with the ability to filter by columns. Select an alert to view button appears.

:::image type="content" source="media/custom-dashboards-azure-workbooks/active-alerts-table.png" alt-text="Screenshot that shows the table of active alerts.":::

By selecting the Open Alert View button, you can see all the details of that specific alert.

:::image type="content" source="media/custom-dashboards-azure-workbooks/alert-details-screen.png" alt-text="Screenshot that shows an alert's details.":::

By selecting Map View, you can also see all alerts based on their location.

:::image type="content" source="media/custom-dashboards-azure-workbooks/alerts-map-view.png" alt-text="Screenshot that shows the alerts when viewed in a map.":::

Select a location on the map to view all the alerts for that location.

:::image type="content" source="media/custom-dashboards-azure-workbooks/map-alert-details.png" alt-text="Screenshot that shows the alerts in a specific location.":::

To view the details for that alert, select the **Open Alert View** button.

### DevOps Security workbook

This workbook provides a customizable visual report of your DevOps security posture. You can use this workbook to view insights into your repositories with the highest number of CVEs and weaknesses, active repositories that have Advanced Security disabled, security posture assessments of your DevOps environment configurations, and much more. Customize and add your own visual reports using the rich set of data in Azure Resource Graph to fit the business needs of your security team.

:::image type="content" source="media/custom-dashboards-azure-workbooks/devops-workbook.png" alt-text="Screenshot that shows a sample results page after you select the DevOps workbook." lightbox="media/custom-dashboards-azure-workbooks/devops-workbook.png":::

> [!NOTE]
> To use this workbork, your environment must have a [GitHub connector](quickstart-onboard-github.md), [GitLab connector](quickstart-onboard-gitlab.md), or [Azure DevOps connector](quickstart-onboard-devops.md).

To deploy the workbook:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Workbooks**.

1. Select the **DevOps Security (Preview)** workbook.

The workbook loads and displays the **Overview** tab. On this tab, you can see the number of exposed secrets, the code security, and DevOps security. All of these findings are broken down by total for each repository and severity.

To view the count by secret type, select the **Secrets** tab.

:::image type="content" source="media/custom-dashboards-azure-workbooks/count-secret-type.png" alt-text="Screenshot that shows the Secrets tab, which displays the count of findings by secret type." lightbox="media/custom-dashboards-azure-workbooks/count-secret-type.png":::

The **Code** tab displays the findings count by tool and repository. It shows the results of your code scanning by severity.

:::image type="content" source="media/custom-dashboards-azure-workbooks/code-findings.png" alt-text="Screenshot that shows the Code tab and its findings by tool, repository, and severity." lightbox="media/custom-dashboards-azure-workbooks/code-findings.png":::

The **Open Source Security (OSS) Vulnerabilities** tab displays OSS vulnerabilities by severity and the count of findings by repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/oss-vulnerabilities.png" alt-text="Screenshot that shows the Open Source Securities vulnerabilities tab, which displays severities and findings by repository.":::

The **Infrastructure as Code** tab displays your findings by tool and repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/infrastructure-code.png" alt-text="Screenshot that shows the Infrastructure as Code tab, which shows you your findings by tool and repository." lightbox="media/custom-dashboards-azure-workbooks/infrastructure-code.png":::

The **Posture** tab displays security posture by severity and repository.

:::image type="content" source="media/custom-dashboards-azure-workbooks/posture-tab.png" alt-text="Screenshot that shows the Posture tab, which displays security posture by severity and repository." lightbox="media/custom-dashboards-azure-workbooks/posture-tab.png":::

The **Threats and Tactics** tab displays the count of threats and tactics by repository and the total count.

:::image type="content" source="media/custom-dashboards-azure-workbooks/threats-and-tactics.png" alt-text="Screenshot that shows the Threats and Tactics tab, which displays the total count of threats and tactics and the count per repository." lightbox="media/custom-dashboards-azure-workbooks/threats-and-tactics.png":::

## Import workbooks from other workbook galleries

To move workbooks that you build in other Azure services into your Microsoft Defender for Cloud workbooks gallery:

1. Open the workbook that you want to import.

1. On the toolbar, select **Edit**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks.png" alt-text="Screenshot that shows how to edit a workbook.":::

1. On the toolbar, select **</>** to open the Advanced Editor.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-advanced-editor.png" alt-text="Screenshot that shows how to open the Advanced Editor to get the Gallery Template JSON code.":::

1. In the workbook Gallery Template, select all the JSON in the file and copy it.

1. Open the workbooks gallery in Defender for Cloud, and then select **New** on the menu bar.
1. Select **</>** to open the Advanced Editor.
1. Paste in the entire Gallery Template JSON.
1. Select **Apply**.
1. On the toolbar, select **Save As**.

    :::image type="content" source="media/custom-dashboards-azure-workbooks/editing-workbooks-save-as.png" alt-text="Saving the workbook to the gallery in Defender for Cloud.":::

1. To save changes to the workbook, enter or select these details:

   - A name for the workbook.
   - The Azure region to use.
   - Subscription, resource group, and sharing information if relevant.

Find the saved workbook in the **Recently modified workbooks** category.

## Related content

This article describes Defender for Cloud's integrated Azure Workbooks page with built-in reports and the option to build your own custom, interactive reports.

- Learn more about [Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md).

- The built-in workbooks pull their data from Defender for Cloud's recommendations. Learn about the many security recommendations in [Security recommendations - a reference guide](recommendations-reference.md).
