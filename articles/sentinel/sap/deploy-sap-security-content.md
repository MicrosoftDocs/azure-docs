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

The Microsoft Sentinel solution for SAP applications includes the SAP data connector, which collects logs from your SAP systems and sends them to your Microsoft Sentinel workspace, and out-of-the-box security content, which helps you gain insight into your organization's SAP environment and detect and respond to security threats. Installing your solution is a required step before you can configure your data connector agent container.

:::image type="content" source="media/deployment-steps/install-solution.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Install solution content step." border="false":::

Content in this article is relevant for your **security** team.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

To deploy the Microsoft Sentinel solution for SAP applications from the content hub, you need:

- A Microsoft Sentinel instance.
- A defined Microsoft Sentinel workspace, and read and write permissions to the workspace. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md).
- [A Microsoft Sentinel for SAP data connector agent set up.](deploy-data-connector-agent-container.md)

Make sure that you also review the [prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md), especially [Azure prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#azure-prerequisites).

## Deploy the solution from the content hub

In the Microsoft Sentinel **Content hub**, search for the **SAP applications** solution and install it on your Microsoft Sentinel workspace. 

Deploying the Microsoft Sentinel solution for SAP applications causes the Microsoft Sentinel for SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys security content, such as the **SAP - System Applications and Products** workbook and SAP-related analytics rules. You deploy the data connector agent on your SAP system before starting to configure the solution components.

:::image type="content" source="./media/deploy-sap-security-content/sap-solution.png" alt-text="Screenshot that shows the Microsoft Sentinel solution for SAP applications solution pane." lightbox="./media/deploy-sap-security-content/sap-solution.png":::

If you want to [work with the Microsoft Sentinel solution for SAP applications in multiple workspaces](cross-workspace.md) (preview), select **Some of the data is on a different workspace**, and then do the following steps:

1. Under **Configure the workspace where the SOC data resides in**, select the SOC subscription and workspace.

1. Under **Configure the workspace where the SAP data resides in**, select the SAP subscription and workspace.

For example:

:::image type="content" source="./media/deploy-sap-security-content/sap-multi-workspace.png" alt-text="Screenshot that shows how to configure the Microsoft Sentinel solution for SAP applications to work across multiple workspaces.":::

> [!TIP]
> If you want the SAP and SOC data to be kept on the same workspace with no additional access controls, do not select **Some of the data is on a different workspace**. You might want the SOC and SAP data to be kept on the same workspace, but to apply additional access controls. In such cases, for more information, see [Store SAP data only in the SOC workspace](cross-workspace.md#store-sap-data-only-in-the-soc-workspace).

For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

## View deployed content

When the deployment is finished, display your newly deployed content as follows:

- For the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks), go to **Threat Management** > **Workbooks** > **My workbooks**.

- For a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules), go to **Configuration** > **Analytics**.

Your data connector doesn't appear as connected until you [configure your data connector agent container](deploy-data-connector-agent-container.md) to complete the connection.

## Next step

> [!div class="nextstepaction"]
> [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md)

## Related content

For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).
