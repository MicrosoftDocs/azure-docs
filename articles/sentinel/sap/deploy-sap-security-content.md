---
title: Deploy Microsoft Sentinel for SAP apps from the content hub
description: Learn how to deploy the Microsoft Sentinel solution for SAP applications security content from the content hub to your Microsoft Sentinel workspace.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 03/23/2023

# customer intent: As an SAP admin, I want to know how to deploy the Microsoft Sentinel solution for SAP applications from the content hub so that I can plan a deployment.
---

# Deploy the Microsoft Sentinel solution for SAP applications from the content hub

This article shows you how to deploy the Microsoft Sentinel solution for SAP applications security content from the content hub to your Microsoft Sentinel workspace. This content makes up the remaining parts of the Microsoft Sentinel solution for SAP.

## Prerequisites

To deploy the Microsoft Sentinel solution for SAP applications from the content hub, you need:

- A Microsoft Sentinel instance.
- A defined Microsoft Sentinel workspace, and read and write permissions to the workspace.
- A Microsoft Sentinel for SAP data connector set up.

## Check deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution in multiple workspaces](cross-workspace.md) (preview)

1. [Prepare your SAP environment](preparing-sap.md)

1. [Configure auditing](configure-audit.md)

1. [Deploy the data connector agent](deploy-data-connector-agent-container.md)

1. **Deploy the Microsoft Sentinel solution for SAP applications from the content hub** (*You are here*)

1. [Configure the Microsoft Sentinel solution for SAP applications](deployment-solution-configuration.md)

1. Optional deployment steps:

   - [Configure the SAP data connector to use SNC](configure-snc.md)
   - [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
   - [Configure audit log monitoring rules](configure-audit-log-rules.md)
   - [Deploy the SAP data connector manually](sap-solution-deploy-alternate.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Deploy the security content from the content hub

Deploy the [SAP security content](sap-solution-security-content.md) from the Microsoft Sentinel **Content hub** and **Watchlists** areas.

Deploying the Microsoft Sentinel solution for SAP applications causes the Microsoft Sentinel for SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

To deploy SAP solution security content:

1. In Microsoft Sentinel, on the left pane, select **Content hub (Preview)**.

    The **Content hub (Preview)** page displays a filtered, searchable list of solutions.

1. To open the SAP solution page, select **Microsoft Sentinel solution for SAP applications**.

    :::image type="content" source="./media/deploy-sap-security-content/sap-solution.png" alt-text="Screenshot that shows the Microsoft Sentinel solution for SAP applications solution pane." lightbox="./media/deploy-sap-security-content/sap-solution.png":::

1. To start the solution deployment wizard, select **Create**, and then enter the details of the Azure subscription and resource group.

1. For the **Deployment target workspace**, select the Log Analytics workspace (the one that Microsoft Sentinel uses) where you want to deploy the solution.<a id="multi-workspace"></a>

1. If you want to [work with the Microsoft Sentinel solution for SAP applications in multiple workspaces](cross-workspace.md) (preview), select **Some of the data is on a different workspace**, and then do the following steps:

   1. Under **Configure the workspace where the SOC data resides in**, select the SOC subscription and workspace.

   1. Under **Configure the workspace where the SAP data resides in**, select the SAP subscription and workspace.

   For example:

   :::image type="content" source="./media/deploy-sap-security-content/sap-multi-workspace.png" alt-text="Screenshot that shows how to configure the Microsoft Sentinel solution for SAP applications to work across multiple workspaces.":::

   > [!NOTE]
   > If you want the SAP and SOC data to be kept on the same workspace with no additional access controls, do not select **Some of the data is on a different workspace**. If you want the SOC and SAP data to be kept on the same workspace, but to apply additional access controls, review [this scenario](cross-workspace.md#scenario-2-sap-data-kept-only-in-the-soc-workspace).

1. Select **Next** to cycle through the **Data Connectors**, **Analytics**, and **Workbooks** tabs, where you can learn about the components that are deployed with this solution.

   For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).

1. On the **Review + create tab** pane, wait for the **Validation Passed** message, and then select **Create** to deploy the solution.

   > [!TIP]
   > You can also select **Download a template** for a link to deploy the solution as code.

1. When deployment is finished, to display the newly deployed content:

    - For the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks), go to **Threat Management** > **Workbooks** > **My workbooks**.

    - For a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules), go to **Configuration** > **Analytics**.

1. In Microsoft Sentinel, go to the **Microsoft Sentinel for SAP** data connector to confirm the connection:

    :::image type="content" source="./media/deploy-sap-security-content/sap-data-connector.png" alt-text="Screenshot that shows the Microsoft Sentinel for SAP data connector page." lightbox="media/deploy-sap-security-content/sap-data-connector.png":::

    SAP ABAP logs are displayed on the Microsoft Sentinel **Logs** page, under **Custom logs**:

    :::image type="content" source="./media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot that shows the SAP ABAP logs in the Custom Logs area in Microsoft Sentinel." lightbox="media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

    For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference](sap-solution-log-reference.md).

## Troubleshooting and reference

For troubleshooting information, see these articles:

- [Troubleshoot your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
- [Microsoft Sentinel solutions](../sentinel-solutions.md)

For reference, see these articles:

- [Microsoft Sentinel solution for SAP applications solution data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP applications: Security content reference](sap-solution-security-content.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

## Related content

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests and configure authorization](preparing-sap.md)
