---
title: Microsoft Sentinel solution for Microsoft Business Apps 
description: Learn about the Microsoft Sentinel solution for Microsoft Business Apps, including both Power Platform and Dynamics 365 Finance and Operations.
author: batamig
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: install-set-up-deploy #Don't change
ms.date: 11/13/2024

#customer intent: As a security engineer, I want to deploy the Microsoft Sentinel solution for Microsoft Business Apps so that I can monitor and protect my organization's Microsoft Power Platform and Dynamics 365 Finance and Operations environments.

---

# Deploy the Microsoft Sentinel solution for Microsoft Business Apps

The Microsoft Sentinel solution for Power Platform allows you to monitor and detect suspicious or malicious activities in your Power Platform environment. The solution collects activity logs from different Power Platform components and inventory data. For more information, see [Microsoft Sentinel solution for Microsoft Power Platform overview](power-platform-solution-overview.md).

This article describes how to deploy the Microsoft Sentinel solution for Dynamics 365 Finance and Operations. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more. [Read more about the solution](dynamics-365-finance-operations-solution-overview.md).

> [!IMPORTANT]
>
> - The Microsoft Sentinel solution for Microsoft Business Apps is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

## Prerequisites

Before deploying the Microsoft Sentinel solution for Microsoft Business Apps, ensure that you meet the following prerequisites:

- Your Log Analytics workspace must be enabled for Microsoft Sentinel

- You must have read and write access to the workspace. You must be able to create:

    - An [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.

    - [Data Collection Rules/Endpoints](/azure/azure-monitor/essentials/data-collection-rule-overview), with the `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules` permissions, and permissions to assign the Monitoring Metrics Publisher role to the Azure Function.

- For Power Platform, your organization must use Power Platform to create and use Power Apps.

    - Audit logging must also enabled in Microsoft Purview. For more information, see [Turn auditing on or off for Microsoft Purview](/microsoft-365/compliance/audit-log-enable-disable)
    - If you're working with Microsoft Dataverse, audit logging is supported only for production environments. For more information, see [Microsoft Dataverse and model-driven apps activity logging requirements](/power-platform/admin/enable-use-comprehensive-auditing#requirements).

- For Microsoft 365 Dynamics Finance and Operations, [Microsoft Dynamics 365 Finance version 10.0.33 or above](/dynamics365/finance/get-started/whats-new-changed-changed-10-0-33) must be enabled and you must have administrative access to the monitored environments.  

## Install the solution

Start by installing the Microsoft Sentinel solution for Microsoft Business Apps from your Microsoft Sentinel **Content hub**. <!--is this the exact name?-->

For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

## Deploy data connectors

1. In Microsoft Sentinel select **Configuration > Data connectors**, and locate any of the following data connectors you want to deploy:

    - **Microsoft Power Platform**:
        - Microsoft Dataverse
        - Microsoft Power Apps
        - Microsoft Power Automate
        - Microsoft Power Platform Admin Activity
        - Microsoft Power Platform Connectors
        - Microsoft Power Platform DLP

    - **Microsoft Dynamics 365**: Dynamics 365 F&O.

        > [!IMPORTANT]
        > This connector uses Azure Functions to connect to Dynamics Finance and Operations to pull its logs into Microsoft Sentinel, which might result in additional data ingestion costs. For more information, see [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).
 
1. On the side pane, select **Open connector page > Connect**.

## Configure data collection for Dataverse

When working with Microsoft Dataverse, Dataverse activity logging is available only for production environments, and isn't enabled by default. Enable auditing at both the [global level for Dataverse](/power-platform/admin/manage-dataverse-auditing#startstop-auditing-for-an-environment-and-set-retention-policy), and for each Dataverse entity:

- To enable auditing on default entities, import one of the following Power Platform managed solutions:

    - For use with Dynamics 365 CE Apps, import [https://aka.ms/AuditSettings/Dynamics](https://aka.ms/AuditSettings/Dynamics).
    - Otherwise, import [https://aka.ms/AuditSettings/DataverseOnly](https://aka.ms/AuditSettings/DataverseOnly).

    The solution enables detailed auditing for each of the default entities listed in the following file: [https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g).

- To enable auditing on custom entities, you must manually enable detailed auditing on each of the custom entities. For more information, see [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#turn-on-or-off-auditing-for-specific-fields-on-an-entity).

    To get the full incident detection value of the solution, we recommend that you enable, for each Dataverse entity you want to audit, the following options in the **General** tab of the Dataverse entity settings page:

    -  Under the **Data Services** section, select **Auditing**.
    -  Under the **Auditing** section, select **Single record auditing** and **Multiple record auditing**. 

    Make sure to save and publish your customizations.

## Configure data collection for Dynamics 365 Finance and Operations

### Collect the environment URL from your Finance and Operations cloud environment

1. Open your Dynamics 365 project in [Microsoft Dynamics Lifecycle Services (LCS)](https://lcs.dynamics.com) and select the specific Finance and Operations environment you want to monitor with Microsoft Sentinel. 
1. In the **Environment version information** section, make sure that you're using application release version 10.0.33 or above. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png" alt-text="Screenshot of the Finance and Operations environment version information." lightbox="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png":::

1. To collect your environment URL, select **Log on to environment** and save the URL in the browser to use [when you deploy the ARM template](#deploy-the-data-connector). For example: ``` https://sentineldevc055b257489f70f5devaos.axcloud.dynamics.com ```. 

    > [!NOTE]
    > The URL may look different, depending on the environment you use, for example, you could be using a sandbox, or a cloud hosted environment. Remove any trailing slashes: `/`. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-details-new.png" alt-text="Screenshot of the Finance and Operations environment details.":::


### Deploy the Azure Resource Manager (ARM) template

1. Select **Deploy to Azure**.

1. Follow the installation wizard to complete deployment. The **Finance Operations API Host** parameter in the deployment wizard refers to the environment URL collected in [this step](#collect-the-environment-url-from-your-finance-and-operations-cloud-environment). 

### Enable data collection

To enable data collection, you create a new role in Finance and Operations with permissions to view the Database Log entity. The role is then assigned to a dedicated Finance and Operations user, mapped to the Microsoft Entra client ID of the Function App's system assigned managed identity.

To collect the managed identity application ID from Microsoft Entra ID:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Entra ID** > **Enterprise applications**.
1. Change the application type filter to **Managed Identities**.
1. Search for and open the Function App created in the [previous step](#deploy-the-azure-resource-manager-arm-template). Copy the Application ID and save it for later use. 

### Create a role for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Workspaces > System administration**, and select **Security Configuration**.

1. Under **Roles**, select **Create new** and give the new role a name, for example, *Database Log Viewer*.

1. Select the new role from the list of roles, and select **Privileges** > **Add references**.

1. Select **Database log Entity View** from the list of privileges. 

1. Select **Unpublished objects**, and select **Publish all** to publish the role. 

### Create a user for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Modules > System administration**, and select **Users**.

1. Create a new user and assign the role you [created in the previous step](#create-a-role-for-data-collection-in-finance-and-operations) to the user. 

### Register the managed identity in Finance and Operations

1. In the Finance and Operations portal, navigate to **System administration > Setup > Microsoft Entra ID** applications.

1. Create a new entry in the table:
    - For the **Client Id**, type the application ID of the managed identity.
    - For the **Name**, type a name for the application. 
    - For the **User ID**, type the user ID created in the [previous step](#create-a-user-for-data-collection-in-finance-and-operations). 

### Enable auditing on the relevant Dynamics 365 Finance and Operations data tables

> [!NOTE]
> Before you enable auditing on Dynamics 365 F&O, review the [database logging recommended practices](/dynamics365/fin-ops-core/dev-itpro/sysadmin/configure-manage-database-log#database-logging-and-performance).

The analytics rules provided with this solution monitor and detect threats based on logs generated in the System Database Log.

If you're planning to use the analytics rules provided in this solution, enable auditing for the following tables:

|Category  |Table  |
|---------|---------|
|System     |  `UserInfo`       |
|Bank     |    `BankAccountTable`     |
|Not specified     | `SysAADClientTable`        |

Enable auditing on tables using the **Database log setup** wizard in the Finance and Operations portal. 

- In the **Tables and fields** page, you might want to select the **Show table names** checkbox to make it easier to find your tables.
- To enable auditing of all fields in the selected tables, in the **Types of change** page, select all four check boxes for any relevant table names with empty field labels. Sort the table list by the **Field label** column in ascending order (A-Z).
- Select **Yes** for all warning messages.

For more information, see [Set up database logging](/dynamics365/fin-ops-core/dev-itpro/sysadmin/configure-manage-database-log#set-up-database-logging).

## Verify log ingestion to Microsoft Sentinel

After deploying your data connectors and configuring data collection, use the following procedures to verify that log ingestion is working.

### Generate activity and inventory logs

1. Run activities like create, update, and delete to generate logs for data that you enabled for monitoring. For Dynamics 365, make sure to perform activities that generate logs in the tables you [enabled for auditing](#enable-auditing-on-the-relevant-dynamics-365-finance-and-operations-data-tables).

1. Wait for the following time periods for Microsoft Sentinel to ingest the data, depending on the data connectors you deployed:

    - **Power Platform activity logs**: 60 minutes
    - **Power Playform inventory data**: 24 hours
    - **Dynamics 365 Finance and Operations activity logs**: 15 minutes

### View ingested data in Microsoft Sentinel

To verify that Microsoft Sentinel is getting the data you expect, run KQL queries against the data tables that collect logs from your data connectors.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), run KQL queries on the **General** > **Logs** oage. In the [Defender portal](https://security.microsoft.com/), run KQL queries in the **Investigation & response** > **Hunting** > **Advanced hunting**.

1. Verify that the results for each table show the activities you generated.

### Verifications for Power Platform data connectors

For example, to verify your Power Platform log ingestion, run the following query to return 50 rows from the table with the Power Apps activity logs.

```kusto
PowerPlatformAdminActivity
| take 50
```

The following table lists the Log Analytics tables to query.

|Log Analytics tables |Data collected |
|---------|---------|
|PowerPlatformAdminActivity|Power Platform administrative logs|
|PowerAutomateActivity |Power Automate activity logs  |
|DataverseActivity |Dataverse and model-driven apps activity logging  |  

Use the following parsers to return inventory and watchlist data.

|Parser  |Data returned |
|---------|---------|
|`InventoryApps` | Power Apps Inventory | 
|`InventoryAppsConnections` |  Power Apps connections Inventoryconnections       |  
|`InventoryEnvironments`   |Power Platform environments Inventory         | 
|`InventoryFlows`   |  Power Automate flows Inventory       | 
|`MSBizAppsTerminatedEmployees`    | Terminated employees watchlist |  

### Verifications for the Dynamics 365 Finance and Operations data connector

To verify your Dynamics 365 Finance and Operations log ingestion, run the following query to return 50 rows from the table with the Finance and Operations activity logs.

```kusto
FinanceOperationsActivity_CL
| take 50
```

For example:

:::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/query-finance-operations-table.png" alt-text="Screenshot of viewing a new Finance and Operations incident in Microsoft Sentinel.":::

## Related content

- [What is the Microsoft Sentinel solution for Microsoft Business Apps?](solution-overview.md)
- [Security content reference for Microsoft Power Platform](power-platform-solution-security-content.md)
- [Security content reference for Dynamics 365 Finance and Operations](../dynamics-365/dynamics-365-finance-operations-security-content.md)
- [Troubleshoot the Microsoft Sentinel solution for Microsoft Power Platform](power-platform-solution-troubleshoot.md)