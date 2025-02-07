---
title: Install a Microsoft Sentinel solution for SAP applications
description: Learn how to install a Microsoft Sentinel solution for SAP applications from the content hub to your Log Analytics workspace enabled for Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 09/16/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
zone_pivot_groups: sentinel-sap-connection


#Customer intent: As a security administrator, I want to deploy and configure security monitoring for SAP applications using Microsoft Sentinel so that I can enhance the security posture and threat detection capabilities of my SAP environment.

---

# Install a Microsoft Sentinel solution for SAP applications

The Microsoft Sentinel solutions for SAP applications include an SAP data connector, which collects logs from your SAP systems and sends them to your Microsoft Sentinel workspace, and out-of-the-box security content, which helps you gain insight into your organization's SAP environment and detect and respond to security threats. Installing your solution is a required step before you can configure your data connector agent container.

Microsoft Sentinel supports both a containerized data collector agent and an agentless solution. Select the deployment option at the top of the page that matches your environment.

:::image type="content" source="media/deployment-steps/install-solution.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Install solution content step." border="false":::

Content in this article is relevant for your **security** team.

:::zone pivot="connection-agentless"

> [!IMPORTANT]
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it’s commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also [requires registration](https://aka.ms/SentinelSAPAgentlessSignUp) and is only available to approved customers and partners during the preview period. For more information, see [Microsoft Sentinel for SAP goes agentless ](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238).

:::zone-end

## Prerequisites

To deploy a Microsoft Sentinel solution for SAP applications from the content hub, you need:

- A Log Analytics workspace enabled for Microsoft Sentinel.
- Read and write permissions to the workspace. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md).

Make sure that you also review the [prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md), especially [Azure prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#azure-prerequisites).

## Install the solution from the content hub

:::zone pivot="connection-agent"
Installing the Microsoft Sentinel **SAP applications** solution makes the **Microsoft Sentinel for SAP** data connector available for you in as a Microsoft Sentinel data connector. The solution also deploys security content, such as the **SAP -Audit Controls** workbook and SAP-related analytics rules.

1. In the Microsoft Sentinel **Content hub**, search for **SAP applications** to install the solution with the containerized data connector agent on your Log Analytics workspace enabled for Microsoft Sentinel.

1. On the **Microsoft Sentinel solution for SAP applications** page, select **Create** to define deployment settings. For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-solution.png" alt-text="Screenshot that shows the Microsoft Sentinel solution for SAP applications solution pane." lightbox="./media/deploy-sap-security-content/sap-solution.png":::

1. On the **Basics** tab, under **Project details**, select the **Subscription** and **Resource group** where you want to install the solution.

1. Under **Instance details**, select the Log Analytics workspace enabled for Microsoft Sentinel where you want to install the solution.

    If you're working with [the Microsoft Sentinel solution for SAP applications in multiple workspaces](cross-workspace.md), select **Some of the data is on a different workspace**, and then define your target workspace, your SOC workspace, and SAP workspace. For example:

    For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-multi-workspace.png" alt-text="Screenshot that shows how to configure the Microsoft Sentinel solution for SAP applications to work across multiple workspaces.":::

1. Select **Review + create** or **Next** to browse through the solution components. When you're ready, select **Create**

    The deployment process can take a few minutes. After the deployment is finished, you can view the deployed content in Microsoft Sentinel.

> [!TIP]
> If you want the SAP and SOC data to be kept on the same workspace with no additional access controls, do not select **Some of the data is on a different workspace**. In such cases, for more information, see [SAP and SOC data maintained in the same workspace](cross-workspace.md#sap-and-soc-data-maintained-in-the-same-workspace).

:::zone-end

:::zone pivot="connection-agentless"

Installing the Microsoft Sentinel **SAP Agentless** solution makes the agentless **Microsoft Sentinel for SAP** available for you in as a Microsoft Sentinel data connector. The solution also deploys security content, such as the **SAP -Audit Controls** workbook and SAP-related analytics rules, a data collection endpoint, and a data collection rule (DCR).

1. In the Microsoft Sentinel **Content hub**, search for **SAP Agentless (Preview)** to install the solution with the agentless data connector on your Log Analytics workspace enabled for Microsoft Sentinel.

1. On the **Sentinel Solution for SAP (Agentless) (preview)** page, select **Create** to define deployment settings.

1. On the **Basics** tab, under **Project details**, select the **Subscription** and **Resource group** where you want to install the solution.

1. Under **Instance details**, select the Log Analytics workspace enabled for Microsoft Sentinel where you want to install the solution.

1. Select **Review + create** or **Next** to browse through the solution components. When you're ready, select **Create**

    The deployment process can take a few minutes. After the deployment is finished, you can view the deployed content in Microsoft Sentinel.

1. In the Microsoft Sentinel **Configuration > Data connectors** page, locate and select the **SAP ABAP and S/4 via cloud connector (Preview)** data connector.

1. On the **SAP ABAP and S/4 via cloud connector (Preview)** page,  in the **Configuration** area, select **Deploy push connector resources** to deploy a data collection rule (DCR) and Microsoft Entra ID app registration to your subscription.

1. <a name="deployment"></a>Once deployed, note the following values for later use:

    - **Immutable ID**
    - **Logs Ingestion URL**
    - **Tenant ID**
    - **Entra Application ID**
    - **Entra Application Secret**

> [!IMPORTANT]
> Make sure to complete all SAP deployment steps in [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md) before selecting [**Add connection** to create the connector](deploy-data-connector-agent-container.md). The SAP iflow must be fully configured and deployed before you can connect your SAP system to Microsoft Sentinel.
>

:::zone-end

For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

## View deployed content

When the deployment is finished, display your new content by browsing again to the Microsoft Sentinel for SAP applications solution from the **Content hub**. Alternatively:

- For the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks), in Microsoft Sentinel, go to **Threat Management** > **Workbooks** > **Templates**.

- For a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules), go to **Configuration** > **Analytics** **Rule templates**.

Your data connector doesn't appear as connected until you [configure your data connector](deploy-data-connector-agent-container.md) and complete the connection.

## Next step

> [!div class="nextstepaction"]
> [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md)

## Related content

For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).
