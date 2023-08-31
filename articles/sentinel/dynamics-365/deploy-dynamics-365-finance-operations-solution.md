---
title: Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations
description: This article introduces you to the process of deploying the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/14/2023
---

# Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations

This article describes how to deploy the Microsoft Sentinel solution for Dynamics 365 Finance and Operations. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more. [Read more about the solution](dynamics-365-finance-operations-solution-overview.md).

> [!IMPORTANT]
> - The Microsoft Sentinel solution for Dynamics 365 Finance and Operations is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution is enabled. 
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- [Microsoft Dynamics 365 Finance version 10.0.33 or above](/dynamics365/finance/get-started/whats-new-changed-changed-10-0-33) is enabled and you have administrative access to the monitored environments.  
- You can create an [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.
- You can create [Data Collection Rules/Endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) with the permissions: 
    - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`.
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 

## Collect the environment URL from your Finance and Operations cloud environment

1. Open your Dynamics 365 project in [Microsoft Dynamics Lifecycle Services (LCS)](https://lcs.dynamics.com) and select the specific Finance and Operations environment you want to monitor with Microsoft Sentinel. 
1. In the **Environment version information** section, make sure that you're using application release version 10.0.33 or above. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png" alt-text="Screenshot of the Finance and Operations environment version information." lightbox="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png":::

1. To collect your environment URL, select **Log on to environment** and save the URL in the browser to use [when you deploy the ARM template](#deploy-the-data-connector). For example: ``` https://sentineldevc055b257489f70f5devaos.axcloud.dynamics.com ```. 

    > [!NOTE]
    > The URL may look different, depending on the environment you use, for example, you could be using a sandbox, or a cloud hosted environment. Remove any trailing slashes: `/`. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-details-new.png" alt-text="Screenshot of the Finance and Operations environment details.":::

## Deploy the solution and enable the data connector

1. Navigate to the **Microsoft Sentinel** service.
1. Select **Content hub**, and in the search bar, search for *Dynamics 365 Finance and Operations*.
1. Select **Dynamics 365 Finance and Operations**.
1. Select **Install**.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

## Deploy the data connector 

1. Once the solution deployment is complete, return to your Sentinel workspace and select **Data connectors**. 

1. In the search bar, type *Dynamics 365 F&O*, and select **Dynamics 365 F&O (Using Azure Function)**. 

1. Select **Open connector page**.

In the connector page, make sure that you meet the required prerequisites and complete the following [configuration steps](#configure-the-data-connector).

## Configure the data connector

> [!NOTE]
> This connector uses Azure Functions to connect to Dynamics Finance and Operations to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details. 

### Deploy the Azure Resource Manager (ARM) template

1. Select **Deploy to Azure**.

1. Follow the installation wizard to complete deployment. The **Finance Operations API Host** parameter in the deployment wizard refers to the environment URL collected in [this step](#collect-the-environment-url-from-your-finance-and-operations-cloud-environment). 

### Enable data collection

To enable data collection, you create a new role in Finance and Operations with permissions to view the Database Log entity. The role is then assigned to a dedicated Finance and Operations user, mapped to the Azure Active Directory client ID of the Function App's system assigned managed identity.

To collect the managed identity application ID from Azure Active Directory: 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** > **Enterprise applications**.
1. Change the application type filter to **Managed Identities**.
1. Search for and open the Function App created in the [previous step](#deploy-the-azure-resource-manager-arm-template). Copy the Application ID and save it for later use. 

### Create a role for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Workspaces > System administration**, and select **Security Configuration**.

1. Under **Roles**, select **Create new** and give the new role a name, for example, *Database Log Viewer*.

1. Select the new role from the list of roles, and select **Privileges** > **Add references**.

1. Select **Database log Entity View** from the list of privileges. 

1. Select **Unpublished objects**, and select **Publish all** to publish the role. 

#### Create a user for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Modules > System administration**, and select **Users**.

1. Create a new user and assign the role you [created in the previous step](#create-a-role-for-data-collection-in-finance-and-operations) to the user. 

#### Register the managed identity in Finance and Operations

1. In the Finance and Operations portal, navigate to **System administration > Setup > Azure Active Directory** applications.

1. Create a new entry in the table: 
    - For the **Client Id**, type the application ID of the managed identity.
    - For the **Name**, type a name for the application. 
    - For the **User ID**, type the user ID created in the [previous step](#create-a-user-for-data-collection-in-finance-and-operations). 

### Enable auditing on the relevant Dynamics 365 Finance and Operations data tables 

> [!NOTE]
> Before you enable auditing on Dynamics 365 F&O, review the [database logging recommended practices](/dynamics365/fin-ops-core/dev-itpro/sysadmin/configure-manage-database-log#database-logging-and-performance).

The analytics rules currently provided with this solution monitor and detect threats based on logs sourced from these tables:  

- All tables under **System**
- The **Bank accounts** table under **Bank** 

If you're planning to use the analytics rules provided in this solution, enable auditing for the **System** and **Bank accounts** tables.

This screenshot shows the **System** and **Bank accounts** tables under **logging database changes**. 

:::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-tables-new.png" alt-text="Screenshot of the selected Finance and Operations database tables to enable auditing.":::

To enable auditing on Finance and Operations tables you want to monitor: 

1. In the Finance and Operations portal, Select **Modules > System Administration > Database log > Database log setup**.
1. Select **New** > **Next**, and select the tables you want to monitor. 
1. Select **Next**.  
1. To enable auditing on all fields of the selected tables, mark all four check marks to the right of the table names with empty field labels. To see the tables with empty field labels at the top, sort the table list by the field table in ascending order (A to Z):

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/finance-and-operations-logging-database-changes-new.png" alt-text="Screenshot of configuring the selected Finance and Operations database tables.":::

1. Select **Next** and then **Finish**.
1. Select **Yes** in all warning messages. 

### Verify that the data connector is ingesting logs to Microsoft Sentinel 

To verify that log ingestion is working: 

1. Run activities (create, update, delete) on any of the tables you enabled for monitoring in the [previous step](#enable-auditing-on-the-relevant-dynamics-365-finance-and-operations-data-tables). 
1. Wait up to 15 minutes for Microsoft Sentinel to ingest the logs to the logs table in the workspace.
1. Query the `FinanceOperationsActivity_CL` table in the Microsoft Sentinel workspace under **Logs**. 
1. Check that the table shows new logs that reflect the activities you executed in step 1 of this procedure. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/query-finance-operations-table.png" alt-text="Screenshot of viewing a new Finance and Operations incident in Microsoft Sentinel.":::

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.
 
- [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
- [Review the solution's security content](dynamics-365-finance-operations-security-content.md)
