---
title: Track your Microsoft Sentinel migration with a workbook | Microsoft Docs
description: Learn how to track your migration with a workbook, how to customize and manage the workbook, and how to use the workbook tabs to manage data connectors, analytics, incidents, playbooks, automation rules, UEBA, and data.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Track your Microsoft Sentinel migration with a workbook

As your organization's Security Operations Center (SOC) handles growing amounts of data, it's essential to plan and monitor your deployment status. While you can track migration process using generic tools such as Microsoft Project, Microsoft Excel, Teams, or Azure DevOps, these tools aren’t specific to SIEM migration tracking. To help you with tracking, we provide a dedicated migration tracker workbook in Microsoft Sentinel. 

The workbook helps you to:
- Visualize migration progress
- Deploy and track data sources
- Deploy and monitor analytics rules and incidents
- Deploy and utilize workbooks
- Deploy and perform automation
- Deploy and customize user and entity behavioral analytics (UEBA)

This article describes how to track your migration with the migration tracker workbook, how to customize and manage the workbook, and how to use the workbook tabs to deploy and monitor data connectors, analytics, incidents, playbooks, automation rules, UEBA, and data management. Learn more about how to use [Azure Monitor workbooks](monitor-your-data).

## Deploy the workbook content 

1. In the Azure portal, select Microsoft Sentinel and then select **Workbooks**. 
1. From the search bar, search for `migration`. 
1. From the search results, select the **Microsoft Sentinel Deployment and Migration** workbook and select **Save**.
   Microsoft Sentinel deploys the workbook and saves the workbook in your environment. 
1. To view the workbook, select **Open saved workbook**. 

## Deploy the watchlist 

1. In the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Watchlists), select the **DeploymentandMigration** folder, and select **Deploy to Azure** to begin the template deployment in Azure.
1. Provide the Microsoft Sentinel resource group and workspace name. 
    :::image type="content" source="media/migration-track/migration-track-azure-deployment.png" alt-text="Screenshot of deploying the watchlist to Azure." lightbox="media/migration-track/migration-track-azure-deployment.png":::
1. Select **Review and create**. 
1. After the information is validated, select **Create**.

## Update the watchlist with deployment and migration actions

This step is crucial to the tracking setup process. If you skip this step, the workbook will not reflect the items for tracking.

To update the watchlist with deployment and migration actions:

1. In the Azure portal, select Microsoft Sentinel and then select **Watchlists**.
1. Locate the watchlist with the **Deployment** alias. 
1. Select the watchlist, and then select **Update watchlist > edit watchlist items**. 
    :::image type="content" source="media/migration-track/migration-track-update-watchlist.png" alt-text="Screenshot of updating watchlist items." lightbox="media/migration-track/migration-track-update-watchlist.png":::
1. Provide the information for the actions needed for the deployment and migration, and select **Save**.  

You can now the watchlist within the migration tracker workbook. Learn how to [manage watchlists](watchlists-manage.md).  

## Manage workbook actions

Your team might update or complete tasks during the deployment process. To address these changes, you can update existing actions or add new actions as you identify new use cases or set new requirements. To update or add actions, edit the **Deployment** watchlist that you [deployed previously](#deploy-the-watchlist). To simplify the process, you can open the watchlist directly from the workbook.

:::image type="content" source="media/migration-track/migration-track-update.png" alt-text="Screenshot of the Microsoft Sentinel Edit watchlist items screen, showing an example list of watchlist items." lightbox="media/migration-track/migration-track-update.png":::

## View deployment status

To quickly view the deployment progress, select **Deployment** and locate the **Summary of progress**. This area displays the deployment status, including the following information:

- Tables reporting data
- Number of tables reporting data
- Number of log reports and which table is reported
- Number of enabled rules vs. undeployed rules
- Recommended workbooks deployed
- Total number of workbooks deployed
- Total number of playbooks deployed

## Deploy and monitor data connectors

To monitor deployed resources and deploy new connectors, select **Data Connectors > Monitor**. The **Monitor** view lists:
- Current ingestion trends
- Tables ingesting data
- How much data each table is reporting
- Endpoints reporting with Microsoft Monitoring Agent (MMA)
- Endpoints reporting with Azure Monitoring Agent (AMA)
- Endpoints reporting with both the MMA and AMA agents
- Data collection rules in the resource group and the devices linked to the rules
- Data connector health (changes and failures)
- Health logs within the specified time range

:::image type="content" source="media/migration-track/migration-track-data-connectors.png" alt-text="Screenshot of the Microsoft Sentinel Data Connectors tab Monitor view." lightbox="media/migration-track/migration-track-data-connectors.png":::

To configure a connector: 
1. Select **Data Connectors > Configure**. 
1. Select the button with the name of the connector you want to configure. 
1. Configure the connector in the connector status screen that opens. If you cannot find a connector you need, select the connector name to open the connector gallery or solution gallery. 

:::image type="content" source="media/migration-track/migration-track-configure-data-connectors.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Data Connectors tab Configure view and a specific connector view." lightbox="media/migration-track/migration-track-configure-data-connectors.png":::

## Deploy and monitor analytics and incidents

Once the data is reported in the workspace, you can now configure and monitor analytics rules. Select **Analytics** to view all deployed rule templates and lists, including which rules are currently in use as well as how often the rules generate incidents. 

:::image type="content" source="media/migration-track/migration-track-analytics.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Analytics tab." lightbox="media/migration-track/migration-track-analytics.png":::

If you need more coverage, select **Review MITRE coverage** below the table and define which areas receive more coverage and which rules are deployed, at any stage of the migration project.

:::image type="content" source="media/migration-track/migration-track-mitre.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Review MITRE Coverage view." lightbox="media/migration-track/migration-track-mitre.png":::

Once the desired analytics rules are deployed and the Defender product connector is configured to send the alerts, you can monitor incident creation and frequency under **Deployment > Summary of progress**. This area displays metrics regarding alert generation by product, title, and classification, to indicate the health of the SOC and which alerts require the most attention. If alerts are generating too much volume, return to the **Analytics** tab to modify the logic.

:::image type="content" source="media/migration-track/migration-track-analytics-monitor.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Analytics tab monitoring area." lightbox="media/migration-track/migration-track-analytics-monitor.png":::

## Deploy and utilize workbooks

To visualize information regarding the data ingestion and detections that Microsoft Sentinel performs, select **Workbook**. Similar to the **Data Connectors** tab, you can by use the available views to view monitoring and configuration information. Select **Monitor** to view a list of all workbooks in the environment and how many are deployed. 

When you select a workbook, you can open and view the workbook directly within the **Deployment and Migration** workbook.

:::image type="content" source="media/migration-track/migration-track-workbook.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Workbook tab Monitor view." lightbox="media/migration-track/migration-track-workbook.png":::

If you have not yet deployed workbooks, select **Configure** to view a list of commonly used and recommended workbooks. If a workbook is not listed, select **Go to Workbook Gallery** or **Go to Content Hub** to deploy the relevant workbook. 

:::image type="content" source="media/migration-track/migration-track-view-workbooks.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Workbook tab workbook view." lightbox="media/migration-track/migration-track-view-workbooks.png":::

## Deploy and monitor playbooks and automation rules

Once data ingestion, detections, and visualizations are configured, you can now look into automation. Select **Automation** to view deployed playbooks, and to see which playbooks are currently connected to an automation rule. If automation rules exist, the workbook highlights the following information regarding the automation rule:
- Name
- Status
- Action or actions of the rule
- The last date the rule was modified and the user that modified the rule
- The date the rule was created of the user that created the rule

To view, deploy, and test automation within the current section of the workbook, select **Deploy automation resources** on the bottom left.

Learn about Microsoft Sentinel SOAR capabilities [for playbooks](automate-responses-with-playbooks.md) and [for automation rules](automate-incident-handling-with-automation-rules.md). 

:::image type="content" source="media/migration-track/migration-track-automation.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Automation tab playbooks view." lightbox="media/migration-track/migration-track-automation.png":::

## Deploy and monitor UEBA

Because data reporting and detections happen at the entity level, it is essential to monitor entity behavior and trends. To enable the UEBA feature within Microsoft Sentinel, select **UEBA**. Here you can customize the entity timelines for entity pages, and view which entity related tables are populated with data. 

:::image type="content" source="media/migration-track/migration-track-ueba.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker UEBA tab." lightbox="media/migration-track/migration-track-ueba.png":::

To enable UEBA: 
1. Select **Enable UEBA** above the list of tables.
1. To enable UEBA, select **UEBA**.
1. Select the data sources you want to use to generate insights.
1. Select **Enable**.

After you enable UEBA, you can monitor and ensure that Microsoft Sentinel is generating UEBA data. 

To customize the timeline:
1.	Select **Customize Entity Timeline** above the list of tables.
2.	Create a custom item, or select one of the out-of-the-box templates.
3.	Complete the wizard for the item.
4.	Select **Create**.

Learn more about [UEBA](identify-threats-with-entity-behavior-analytics.md) or learn how to [customize the timeline](customize-entity-activities).

## Configure and manage the data lifecycle

When you deploy or migrate to Microsoft Sentinel, it's essential to manage the usage and lifecycle of the incoming logs. To assist with this, the **Data Management** section of the workbook allows you to configure table retention and archival.

:::image type="content" source="media/migration-track/migration-track-data-management.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Data Management tab." lightbox="media/migration-track/migration-track-data-management":::

You can view information regarding:

- Tables configured for basic log ingestion
- Tables configured for analytics tier ingestion
- Tables configured to be archived
- Tables on the default workspace retention

To modify the existing retention policy for tables, select **Default Retention Tables view**, select the relevant table, and select **Update Retention** to edit the following information:
1. Select **Default Retention Tables**.
2. Select the table you want to modify, and select **Update Retention**. You can edit the following information:
    - Current retention in the workspace
    - Current retention in the archive
    - Total number of days the data will live in the environment
1. Edit the **TotalRetention** value to set a new total number of days that the data should exist within the environment. 
 
The **ArchiveRetention** value is calculated by subtracting the **TotalRetention** value from the **InteractiveRetention** value. If you need to adjust the workspace retention, the change does not impact tables that include configured archives and data is not lost. If you edit the **InteractiveRetention** value and the **TotalRetention** value does not change, Azure Log Analytics adjusts the archive retention to compensate the change.

If you prefer to make changes in the UI, open the relevant blade.

Learn about [data lifecycle management](../azure-monitor/logs/data-retention-archive.md). 

## Enable migration tips and instructions

To assist with the deployment and migration process, the workbook includes tips that explain how to use the different tabs and links to relevant resources. The tips are based on Microsoft Sentinel migration documentation and are relevant to your current SIEM. To enable tips and instructions, on the top right, set **MigrationTips** and **Instruction** to **Yes**. 

:::image type="content" source="media/migration-track/migration-track-tips.png" alt-text="Screenshot of the Microsoft Sentinel Deployment Tracker Data Management tab." lightbox="media/migration-track/migration-track-tips":::