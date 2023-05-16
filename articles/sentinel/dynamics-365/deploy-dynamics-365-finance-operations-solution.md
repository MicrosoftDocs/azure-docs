---
title: Deploy Microsoft Sentinel solution for D365 F&O
description: This article introduces you to the process of deploying the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations (D365 F&O)ץ
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/14/2023
---

# Deploy Microsoft Sentinel solution for D365 F&O

This article describes how to deploy the Microsoft Sentinel solution for D365 F&O. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more. [Read more about the solution](dynamics-365-finance-operations-solution-overview.md).

> [!IMPORTANT]
> The Microsoft Sentinel solution for D365 F&O is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution is enabled. 
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- [Microsoft Dynamics 365 Finance version 10.0.33 or above](/dynamics365/finance/get-started/whats-new-changed-changed-10-0-33) is enabled and you have administrative access to the monitored environments.  
- You have the Microsoft Sentinel Contributor role.
- You can create an [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.
- You can create [Data Collection Rules/Endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) with the permissions: 
    - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`.
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 

## Set up the solution

### Collect the environment URL from your Finance and Operations cloud environment

1. Open your Dynamics 365 project in [Microsoft Dynamics Lifecycle Services (LCS)](https://lcs.dynamics.com) and select the specific Finance and Operations environment you want to monitor with Microsoft Sentinel. 
1. In the **Environment version information** section, make sure that you're using application release version 10.0.33 or above. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png" alt-text="Screenshot of the Finance and Operations environment version information.":::

1. To collect your environment URL, select **Login to environment** and save the URL in the browser to use [when you deploy the ARM template](#deploy-the-fo-data-connector). For example: https://sentineldevc055b257489f70f5devaos.axcloud.dynamics.com. 

    > [!NOTE]
    > The URL may look different, depending on the environment you use, for example, you could be using a sandbox, or a cloud hosted environment. Remove any trailing slashes: `/`. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-details.png" alt-text="Screenshot of the Finance and Operations environment details." lightbox="media/deploy-dynamics-365-finance-operations-solution/environment-details.png":::

### Deploy the solution and enable the data connector

1. Navigate to the **Microsoft Sentinel** service.
1. Select **Content hub**, and in the search bar, search for *F&O*.
1. Select **Microsoft Sentinel solution for D365 F&O**.
1. Select **Install**.

    Image - TBD

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Create**.

   Image - TBD

1. Select the resource group and the Sentinel workspace in which you want to deploy the solution. 
1. Select **Next** until you pass validation and select **Create**.
1. Once the solution deployment is complete, return to your Sentinel workspace and select **Data connectors**. 
1. In the search bar, type *Dynamics 365 F&O*, and select **Dynamics 365 F&O (Using Azure Function)**. 
1. Select **Open connector page**.

## Deploy the data connector 

In the connector page, make sure that you meet the required prerequisites and follow the configuration steps in the UI. During this process, you: 

    - Deploy the ARM template (Function App). 
    - Create a new security role in Finance and Operations and grant permissions to the Function App's managed identity. 

### Enable auditing on the relevant Dynamics 365 Finance and Operations data tables 

To enable the analytics rules provided with this solution, enable auditing for these tables:    
 
- All tables under **System**
- The **Bank accounts** table under **Bank**

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-tables.png" alt-text="Screenshot of the selected Finance and Operations database tables to enable auditing." lightbox="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-tables.png":::

To enable auditing for these tables:

1. Review the [recommended practices for database logging](/dynamics365/fin-ops-core/dev-itpro/sysadmin/configure-manage-database-log#database-logging-and-performance).    
1. Select **Modules** > **System Administration** > **Database log** > **Database log setup**.
1. Select **New**, select **Next**, and select the tables you want to monitor. 
1. Select **Next**. 
1. To enable auditing on all fields of the selected tables, mark all four check marks to the right of the table names with empty field labels. To see the tables with empty field labels at the top, sort the table list by the field table in ascending order:

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-changes.png" alt-text="Screenshot of configuring the selected Finance and Operations database tables." lightbox="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-changes.png":::

1. Select **Finish**.
1. Select **Yes** in all warning messages. 

### Verify that the data connector is ingesting logs to Microsoft Sentinel 

To verify that log ingestion is working, you try to enable the **F&O – Bank account number changed** analytics rule, and trigger the rule to create an incident. 

1. To enable the **F&O – Bank account number changed** analytics rule, follow these [guidelines](../sentinel-solutions-deploy.md#analytics-rule).
1. To trigger a detection, change the bank account number:
    1. Select **Modules** > **General ledger** > **ledger setup** > **ledger**.
    1. Under the account structures, select **Add**, and select any of the account structures (for example, **Manufacturing B/S**). 
    1. In the dialog, select **Yes**.
    1. Select **workspace** > **bank management** and select all bank accounts. 
    1. In the new record, under **bank account**, add any name.
    1. Select any main account and fill in a bank account number in the relevant field. 
    1. Select **save**.
    1. To trigger the detection, change the bank account number and select **save**. 
1. Wait up to 15 minutes for Microsoft Sentinel to ingest the log and trigger the detection. 
1. In Microsoft Sentinel, select **Incidents** and check for a new incident: 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-new-incident.png" alt-text="Screenshot of viewing a new Finance and Operations incident in Microsoft Sentinel." lightbox="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-new-incident.png":::

1. If you want to view the raw logs, query the `FinanceOperationsActivity_CL` table: 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/query_FinanceOperationsActivity_CL_table.png" alt-text="Screenshot of querying the query_FinanceOperationsActivity_CL_table to view the raw logs in Microsoft Sentinel." lightbox="media/deploy-dynamics-365-finance-operations-solution/query_FinanceOperationsActivity_CL_table.png"::: 

1. Repeat this procedure (steps 1-5) to enable the rest of the [analytics rules provided with the solution](dynamics-365-finance-operations-security-content#built-in-analytics-rules.md).

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel solution for D365 F&O.
> 
> - [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
> - [Review the solution's security content](dynamics-365-finance-operations-security-content.md)