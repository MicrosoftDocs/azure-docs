---
title: Deploy SAP security content in Microsoft Sentinel
description: This article shows you how to deploy Microsoft Sentinel security content into your Microsoft Sentinel workspace. This content makes up the remaining parts of the Microsoft Sentinel solution for SAP® applications.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/23/2023
---

# Deploy SAP security content in Microsoft Sentinel

This article shows you how to deploy Microsoft Sentinel security content into your Microsoft Sentinel workspace. This content makes up the remaining parts of the Microsoft Sentinel solution for SAP® applications.

Learn about [working with the solution across multiple workspaces](cross-workspace.md) (PREVIEW), or [define multiple workspaces](#deploy-sap-security-content). 

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. **Deploy SAP security content (*You are here*)**

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure data connector to use SNC](configure-snc.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Deploy SAP security content

Deploy the [SAP security content](sap-solution-security-content.md) from the Microsoft Sentinel **Content hub** and **Watchlists** areas.

Deploying the **Microsoft Sentinel solution for SAP® applications** causes the Microsoft Sentinel for SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

To deploy SAP solution security content, do the following:

1. In Microsoft Sentinel, on the left pane, select **Content hub (Preview)**.

    The **Content hub (Preview)** page displays a filtered, searchable list of solutions.

1. To open the SAP solution page, select **Microsoft Sentinel solution for SAP® applications**.

    :::image type="content" source="./media/deploy-sap-security-content/sap-solution.png" alt-text="Screenshot of the 'Microsoft Sentinel solution for SAP® applications' solution pane." lightbox="./media/deploy-sap-security-content/sap-solution.png":::

1. To launch the solution deployment wizard, select **Create**, and then enter the details of the Azure subscription and resource group.

1. For the **Deployment target workspace**, select the Log Analytics workspace (the one used by Microsoft Sentinel) where you want to deploy the solution. <a id="multi-workspace"></a>

1. If you want to [work with the Microsoft Sentinel solution for SAP® applications across multiple workspaces](cross-workspace.md) (PREVIEW), do one of the following, select **Some of the data is on a different workspace**.
    1. Under **Configure the workspace where the SOC data resides in**, select the SOC subscription and workspace. 
    1. Under **Configure the workspace where the SAP data resides in**, select the SAP subscription and workspace.

    For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-multi-workspace.png" alt-text="Screenshot of how to configure the Microsoft Sentinel solution for SAP® applications to work across multiple workspaces.":::

    > [!Note]
    > If you want the SAP and SOC data to be kept on the same workspace with no additional access controls, do not select **Some of the data is on a different workspace**. If you want the SOC and SAP data to be kept on the same workspace, but to apply additional access controls, review [this scenario](cross-workspace.md#scenario-2-sap-data-is-kept-in-the-soc-workspace).      

1. Select **Next** to cycle through the **Data Connectors**, **Analytics**, and **Workbooks** tabs, where you can learn about the components that will be deployed with this solution.

    For more information, see [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md).

1. On the **Review + create tab** pane, wait for the **Validation Passed** message, then select **Create** to deploy the solution.

    > [!TIP]
    > You can also select **Download a template** for a link to deploy the solution as code.

1. After the deployment is completed, a confirmation message appears at the upper right.

    To display the newly deployed content, go to:

    - **Threat Management** > **Workbooks** > **My workbooks**, to find the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks).
    - **Configuration** > **Analytics** to find a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

1. In Microsoft Sentinel, go to the **Microsoft Sentinel for SAP** data connector to confirm the connection:

    :::image type="content" source="./media/deploy-sap-security-content/sap-data-connector.png" alt-text="Screenshot of the Microsoft Sentinel for SAP data connector page." lightbox="media/deploy-sap-security-content/sap-data-connector.png":::

    SAP ABAP logs are displayed on the Microsoft Sentinel **Logs** page, under **Custom logs**:

    :::image type="content" source="./media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot of the SAP ABAP logs in the 'Custom Logs' area in Microsoft Sentinel." lightbox="media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

    For more information, see [Microsoft Sentinel solution for SAP® applications solution logs reference](sap-solution-log-reference.md).

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy SAP security content](deploy-sap-security-content.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)
- [Configure SAP Transport Management System](configure-transport.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications solution data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
