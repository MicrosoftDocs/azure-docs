---
title: Install the Microsoft Sentinel solution for SAP applications
description: Learn how to install the Microsoft Sentinel solution for SAP applications from the content hub to your Microsoft Sentinel workspace.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 07/07/2024
# customer intent: As an security operations (SOC) engineer, I want to know how to deploy the Microsoft Sentinel solution for SAP applications from the content hub so that our organization can start connecting our SAP system to Microsoft Sentinel.
---

# Install the Microsoft Sentinel solution for SAP applications

This article shows you how to deploy the Microsoft Sentinel solution for SAP applications. The solution includes the SAP data connector, which collects logs from your SAP systems and sends them to your Microsoft Sentinel workspace, and out-of-the-box security content, which helps you gain insight into your organization's SAP environment and detect and respond to security threats.

:::image type="content" source="media/deployment-steps/install-solution.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Install solution content step." border="false":::

Content in this article is relevant for your **security** team.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

To deploy the Microsoft Sentinel solution for SAP applications from the content hub, you need:

- A Microsoft Sentinel instance.
- A defined Microsoft Sentinel workspace, and read and write permissions to the workspace.
- [A Microsoft Sentinel for SAP data connector agent set up.](deploy-data-connector-agent-container.md)

## Deploy the solution from the content hub

Deploy the [SAP security content](sap-solution-security-content.md) from the Microsoft Sentinel **Content hub**.

Deploying the Microsoft Sentinel solution for SAP applications causes the Microsoft Sentinel for SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

**To deploy the SAP solution**:

1. In Microsoft Sentinel, select **Content management > Content hub** to display a filtered, searchable list of solutions.

1. To open the SAP solution page, search for and select **SAP applications**. In the side pane, scroll down and select either **Install** to open the solution details page. For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-solution.png" alt-text="Screenshot that shows the Microsoft Sentinel solution for SAP applications solution pane." lightbox="./media/deploy-sap-security-content/sap-solution.png":::

1. To start the solution deployment wizard, select **Create**, and then enter the details of the Azure subscription and resource group.

1. For the **Deployment target workspace**, select the Log Analytics workspace used by Microsoft Sentinel, and where you want to deploy the solution.<a id="multi-workspace"></a>

1. If you want to [work with the Microsoft Sentinel solution for SAP applications in multiple workspaces](cross-workspace.md) (preview), select **Some of the data is on a different workspace**, and then do the following steps:

   1. Under **Configure the workspace where the SOC data resides in**, select the SOC subscription and workspace.

   1. Under **Configure the workspace where the SAP data resides in**, select the SAP subscription and workspace.

   For example:

   :::image type="content" source="./media/deploy-sap-security-content/sap-multi-workspace.png" alt-text="Screenshot that shows how to configure the Microsoft Sentinel solution for SAP applications to work across multiple workspaces.":::

   > [!TIP]
   > If you want the SAP and SOC data to be kept on the same workspace with no additional access controls, do not select **Some of the data is on a different workspace**. You might want the SOC and SAP data to be kept on the same workspace, but to apply additional access controls. In such cases, for more information, see [Store SAP data only in the SOC workspace](cross-workspace.md#store-sap-data-only-in-the-soc-workspace).

1. Select **Next** to cycle through the **Data Connectors**, **Analytics**, and **Workbooks** tabs, where you can learn about the components that are deployed with this solution. You'll deploy the data connector agent on your SAP system before starting to configure the solution components.

   For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).

1. On the **Review + create tab** pane, wait for the **Validation Passed** message, and then select **Create** to deploy the solution. Alternately, select **Download a template** for a link to deploy the solution as code.

## View deployed content and confirm your connection

When the deployment is finished:

1. Display your newly deployed content as follows:

    - For the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks), go to **Threat Management** > **Workbooks** > **My workbooks**.

    - For a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules), go to **Configuration** > **Analytics**.

1. To confirm your connection, go to the **Microsoft Sentinel for SAP** data connector page. For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-data-connector.png" alt-text="Screenshot that shows the Microsoft Sentinel for SAP data connector page." lightbox="media/deploy-sap-security-content/sap-data-connector.png":::

    SAP logs won't be displayed in the Microsoft Sentinel **Logs** page until your SAP system is connected and data starts streaming into Microsoft Sentine.

    <!--, under **Custom logs**:

    :::image type="content" source="./media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot that shows the SAP ABAP logs in the Custom Logs area in Microsoft Sentinel." lightbox="media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

    For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference](sap-solution-log-reference.md).
    -->

## Next step

> [!div class="nextstepaction"]
> [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md)
