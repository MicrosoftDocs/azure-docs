---
title: Connect Microsoft Dynamics 365 Finance and Operations to Microsoft Sentinel
description: Learn how to deploy the Microsoft Sentinel solution for Business Applications with Microsoft Dynamics 365 Finance and Operations
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 11/14/2024


#Customer intent: As a security administrator, I want to deploy a monitoring solution for Dynamics 365 Finance and Operations so that I can detect and respond to threats and suspicious activities in real-time.

---

# Connect Microsoft Dynamics 365 Finance and Operations to Microsoft Sentinel

This article describes how to deploy the [Microsoft Sentinel solution for Microsoft Business Apps](../business-applications/solution-overview.md) to connect your Microsoft Dynamics 365 Finance and Operations system to Microsoft Sentinel. The solution collects audit and activity logs to detect threats, suspicious activities, illegitimate activities, and more.

To configure data collection for Dynamics 365 Finance and Operations, you need to deploy an Azure Resource Manager (ARM) template, enable data collection, and enable auditing on the relevant Dynamics 365 Finance and Operations data tables.

> [!IMPORTANT]
>
> - The Microsoft Sentinel solution for Microsoft Business Apps is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - The **Dynamics 365 F&O** data connector uses Azure Functions to connect to Dynamics Finance and Operations to pull its logs into Microsoft Sentinel, which might result in additional data ingestion costs. For more information, see [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).
 
## Prerequisites

Before deploying the Microsoft Sentinel solution for Microsoft Business Apps, ensure that you meet the following prerequisites:

- Your Log Analytics workspace must be enabled for Microsoft Sentinel

- You must have read and write access to the workspace. You must be able to create:

    - An [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.

    - [Data Collection Rules/Endpoints](/azure/azure-monitor/essentials/data-collection-rule-overview), with the `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules` permissions, and permissions to assign the Monitoring Metrics Publisher role to the Azure Function.

    - [Microsoft Dynamics 365 Finance version 10.0.33 or above](/dynamics365/finance/get-started/whats-new-changed-changed-10-0-33) must be enabled and you must have administrative access to the monitored environments.

    - You must have your Microsoft Dynamics 365 Finance and Operations environment URL, such as `https://sentineldevc055b257489f70f5devaos.axcloud.dynamics.com `. Depending on the environment you're using, such as in a sandbox or a cloud hosted environment, the URL might look different. Remove any trailing slashes: `/`.

## Install the solution and deploy your data connector

1. Start by installing the Microsoft Sentinel solution for Microsoft Business Apps from the Microsoft Sentinel **Content hub**. <!--is this the exact name?-->

    For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Configuration > Data connectors**, and locate the **Dynamics 365 F&O** data connector.

1. On the side pane, select **Open connector page > Connect**.

## Deploy a function app via ARM template

1. In the Microsoft Sentinel **Configuration** > **Dynamics 365 F&O (using Azure Functions)** data connector page, select **Deploy to Azure**. This ARM template deploys a function app to your workspace.

1. Follow the installation wizard to complete deployment. When prompted for the **Finance Operations API Host** parameter, enter your Microsoft Dynamics 365 Finance and Operations environment URL. Make sure to remove any trailing slashes `/`.

## Create a role and user for data collection

Create a new role in Finance and Operations with permissions to view the Database Log entity. You'll then assign the role to a dedicated Finance and Operations user, which is mapped to the Microsoft Entra client ID of the Function App's system assigned managed identity.

### Collect the managed identity application ID from Microsoft Entra ID

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Entra ID** > **Enterprise applications**.
1. Change the application type filter to **Managed Identities**.
1. Search for and open the Function App that was created when you [deployed the ARM template to Azure](#create-a-role-and-user-for-data-collection).
1. Copy the Application ID and save it to use when [registering the managed identity in Finance and Operations](#register-the-managed-identity-in-finance-and-operations).

### Create your role in Finance and Operations

1. In the Finance and Operations portal, select **Workspaces > System administration** > **Security Configuration** > **Roles** >**Create new**.
1. Enter a meaningful name for your role, such as *Database Log Viewer*.
1. Select the new role from the list of roles, and then select **Privileges** > **Add references**.
1. Select **Database log Entity View** from the list of privileges. 
1. Select **Unpublished objects**, and select **Publish all** to publish the role. 

### Create a user for data collection

1. In the Finance and Operations portal, select **Modules > System administration** > **Users**.
1. Create a new user and assign the role you created in the previous step to your user.
1. Note the user's user ID for use in [registering the managed identity in Finance and Operations](#register-the-managed-identity-in-finance-and-operations).

### Register the managed identity in Finance and Operations

1. In the Finance and Operations portal, select **System administration > Setup > Microsoft Entra ID** applications.

1. Create a new entry in the table:

    - For the **Client Id**, enter the [application ID](#to-collect-the-managed-identity-application-id-from-microsoft-entra-id) of the managed identity.
    - For the **Name**, enter a name for the application. 
    - For the **User ID**, enter the user ID for the user created [earlier](#to-create-a-user-for-data-collection).

## Enable auditing on Dynamics 365 Finance and Operations data tables

> [!NOTE]
> Before you enable auditing on Dynamics 365 F&O, review the [database logging recommended practices](/dynamics365/fin-ops-core/dev-itpro/sysadmin/configure-manage-database-log#database-logging-and-performance).

The analytics rules provided with this solution for Microsoft Dynamics 365 Finance and Operations monitor and detect threats based on logs generated in the System Database Log. If you're planning to use the analytics rules provided in this solution, enable auditing for the following tables:

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

After deploying your data connectors and configuring data collection, run activities like create, update, and delete to generate logs for data that you enabled for monitoring. Make sure to perform activities that generate logs in the tables you [enabled for auditing](#enable-auditing-on-the-relevant-dynamics-365-finance-and-operations-data-tables).

It takes about 15 minutes for Microsoft Sentinel to ingest the data.

Then, to verify that Microsoft Sentinel is getting the data you expect, run KQL queries against the data tables that collect logs from your data connectors.

For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), run KQL queries on the **General** > **Logs** page. In the [Defender portal](https://security.microsoft.com/), run KQL queries in the **Investigation & response** > **Hunting** > **Advanced hunting**.

Verify that the results for each table show the activities you generated.

For example, run the following query to return 50 rows from the table with the Finance and Operations activity logs.

```kusto
FinanceOperationsActivity_CL
| take 50
```

:::image type="content" source="../dynamics-365/media/deploy-dynamics-365-finance-operations-solution/query-finance-operations-table.png" alt-text="Screenshot of viewing a new Finance and Operations incident in Microsoft Sentinel":::

## Related content

- [What is the Microsoft Sentinel solution for Microsoft Business Apps?](solution-overview.md)
- [Security content reference for Dynamics 365 Finance and Operations](../dynamics-365/dynamics-365-finance-operations-security-content.md)
