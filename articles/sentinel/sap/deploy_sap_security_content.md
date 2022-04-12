---
title: Deploy SAP security content | Microsoft Docs
description: Deploy SAP security content
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 02/01/2022
---

# Deploy SAP security content

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

The following article provides a step-by-step guidance to deploy Microsoft Sentinel security content into existing Microsoft Sentinel workspace.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Deployment milestones
Deployment of the SAP continuous threat monitoring solution is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment by deploying SAP CRs, configure Authorization and create user](preparing-sap.md)

1. [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md)

1. **Deploy SAP security content (*You are here*)**

1. Optional deployment steps
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)



## Deploy SAP security content

Deploy the [SAP security content](sap-solution-security-content.md) from the Microsoft Sentinel **Solutions** and **Watchlists** areas.

The **Microsoft Sentinel - Continuous Threat Monitoring for SAP** solution enables the SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

Add SAP-related watchlists to your Microsoft Sentinel workspace manually.

To deploy SAP solution security content, do the following:

1. In Microsoft Sentinel, on the left pane, select **Solutions (Preview)**.

    The **Solutions** page displays a filtered, searchable list of solutions.

1. To open the SAP solution page, select **Microsoft Sentinel - Continuous Threat Monitoring for SAP (preview)**.

    :::image type="content" source="./media/deploy_sap_security_content/sap-solution.png" alt-text="Screenshot of the 'Microsoft Sentinel - Continuous Threat Monitoring for SAP (preview)' solution pane.":::

1. To launch the solution deployment wizard, select **Create**, and then enter the details of the Azure subscription, resource group, and Log Analytics workspace where you want to deploy the solution.

1. Select **Next** to cycle through the **Data Connectors** **Analytics** and **Workbooks** tabs, where you can learn about the components that will be deployed with this solution.

    The default name for the workbook is **SAP - System Applications and Products - Preview**. Change it in the workbooks tab as needed.

    For more information, see [Microsoft Sentinel SAP solution: security content reference (public preview)](sap-solution-security-content.md).

1. On the **Review + create tab** pane, wait for the **Validation Passed** message, then select **Create** to deploy the solution.

    > [!TIP]
    > You can also select **Download a template** for a link to deploy the solution as code.

1. After the deployment is completed, a confirmation message appears at the upper right.

    To display the newly deployed content, go to:

    - **Threat Management** > **Workbooks** > **My workbooks**, to find the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks).
    - **Configuration** > **Analytics** to find a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

1. Add SAP-related watchlists to use in your search, detection rules, threat hunting, and response playbooks. These watchlists provide the configuration for the Microsoft Sentinel SAP Continuous Threat Monitoring solution. Do the following:

    a. Download SAP watchlists from the Microsoft Sentinel GitHub repository at https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists.  
    b. In the Microsoft Sentinel **Watchlists** area, add the watchlists to your Microsoft Sentinel workspace. Use the downloaded CSV files as the sources, and then customize them as needed for your environment.  

    [ ![SAP-related watchlists added to Microsoft Sentinel.](./media/deploy_sap_security_content/sap-watchlists.png) ](./media/deploy_sap_security_content/sap-watchlists.png#lightbox)

    For more information, see [Use Microsoft Sentinel watchlists](../watchlists.md) and [Available SAP watchlists](sap-solution-security-content.md#available-watchlists).

1. In Microsoft Sentinel, go to the **Microsoft Sentinel Continuous Threat Monitoring for SAP** data connector to confirm the connection:

    [ ![Screenshot of the Microsoft Sentinel Continuous Threat Monitoring for SAP data connector page.](./media/deploy_sap_security_content/sap-data-connector.png) ](./media/deploy_sap_security_content/sap-data-connector.png#lightbox)

    SAP ABAP logs are displayed on the Microsoft Sentinel **Logs** page, under **Custom logs**:

    [ ![Screenshot of the SAP ABAP logs in the 'Custom Logs' area in Microsoft Sentinel.](./media/deploy_sap_security_content/sap-logs-in-sentinel.png) ](./media/deploy_sap_security_content/sap-logs-in-sentinel.png#lightbox)

    For more information, see [Microsoft Sentinel SAP solution logs reference (public preview)](sap-solution-log-reference.md).
