---
title: Connect Microsoft Dynamics 365 Finance and Operations to Microsoft Sentinel
description: Learn how to deploy the Microsoft Sentinel solution for Business Applications with Microsoft Dynamics 365 Finance and Operations.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 11/14/2024


#Customer intent: As a security administrator, I want to deploy a monitoring solution for Microsoft Dynamics 365 Finance and Operations so that I can detect and respond to threats and suspicious activities in real-time.

---

# Deploy for Dynamics 365 Finance and Operations

This article describes how to deploy the Dynamics 365 Finance and Operations content within the Microsoft Sentinel solution for Microsoft Business Applications. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more. [Read more about the solution](dynamics-365-finance-operations-solution-overview.md).

> [!IMPORTANT]
> - The Microsoft Sentinel solution for Dynamics 365 Finance and Operations is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution for Microsoft Business Applications solution is enabled. 

- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- [Microsoft Dynamics 365 Finance version 10.0.33 or above](/dynamics365/finance/get-started/whats-new-changed-changed-10-0-33) is enabled and you have administrative access to the monitored environments.  
- You can create [Data Collection Rules/Endpoints](/azure/azure-monitor/essentials/data-collection-rule-overview) with the permissions:
  - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`
    
## Collect the environment URL from your Finance and Operations cloud environment

1. Open your Dynamics 365 project in [Microsoft Dynamics Lifecycle Services (LCS)](https://lcs.dynamics.com) and select the specific Finance and Operations environment you want to monitor with Microsoft Sentinel. 
1. In the **Environment version information** section, make sure that you're using application release version 10.0.33 or above. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png" alt-text="Screenshot of the Finance and Operations environment version information." lightbox="media/deploy-dynamics-365-finance-operations-solution/environment-version-information.png":::

1. To collect your environment URL, select **Log on to environment** and save the URL in the browser to use [when you deploy the ARM template](#deploy-the-data-connector). For example: `https://sentineldevc055b257489f70f5devaos.axcloud.dynamics.com`. 

    > [!NOTE]
    > The URL may look different, depending on the environment you use, for example, you could be using a sandbox, or a cloud hosted environment. Remove any trailing slashes: `/`. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/environment-details-new.png" alt-text="Screenshot of the Finance and Operations environment details.":::

## Deploy the solution and enable the data connector

1. Navigate to the **Microsoft Sentinel** service.
1. Select **Content hub**, and in the search bar, search for *Microsoft Business Applications*.
1. Select **Microsoft Business Applications**.
1. Select **Install**.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

## Deploy the data connector 

1. Once the solution deployment is complete, return to your Sentinel workspace and select **Data connectors**. 

1. In the search bar, type *Dynamics 365,* and select **Dynamics 365 Finance and Operations**. 

1. Select **Open connector page**.

In the connector page, make sure that you meet the required prerequisites and complete the following [configuration steps](#configure-the-data-connector).

## Configure the data connector


To enable data collection, you create a new role in Finance and Operations with permissions to view the Database Log entity. The role is then assigned to a dedicated Finance and Operations user, mapped to the Microsoft Entra client ID of an app registration.

### Enable data collection

To collect the managed identity application ID from Microsoft Entra ID:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Entra ID** > **App registrations**.
1. Create a new registration and enter a name for the app registration.

1. Select Accounts in this organization only (single tenant) and click register.

1. From the overview page of the new app registration, take note of the **tenant ID** and **application (Client) ID** for use in the next steps.

1. Within the Certificates & Secrets menu, create a new client secret.

1. Store the **client secret** in a secure location for use in the next steps.

### Create a role for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Workspaces > System administration**, and select **Security Configuration**.

1. Under **Roles**, select **Create new** and give the new role a name, for example, *Database Log Viewer*.

1. Select the new role from the list of roles, and select **Privileges** > **Add references**.

1. Select **Database log Entity View** from the list of privileges. 

1. Select **Unpublished objects**, and select **Publish all** to publish the role. 

#### Create a user for data collection in Finance and Operations 

1. In the Finance and Operations portal, navigate to **Modules > System administration**, and select **Users**.

1. Create a new user and assign the role you [created in the previous step](#create-a-role-for-data-collection-in-finance-and-operations) to the user. 

#### Register the app registration in Finance and Operations

1. In the Finance and Operations portal, navigate to **System administration > Setup > Microsoft Entra ID** applications.

1. Create a new entry in the table:
    - For the **Client Id**, type the application ID of the app registration.
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


### Enable data collection

1. Navigate to the data connectors blade in Microsoft Sentinel, search for **Dynamics 365 Finance and Operations**.

1. Using the **Tenant ID**, **Client ID, Client Secret** and **Environment URL**, connect the data connector.

### Verify that the data connector is ingesting logs to Microsoft Sentinel 

To verify that log ingestion is working:

1. Run activities (create, update, delete) on any of the tables you enabled for monitoring in the [previous step](#enable-auditing-on-the-relevant-dynamics-365-finance-and-operations-data-tables). 
1. Wait up to 15 minutes for Microsoft Sentinel to ingest the logs to the logs table in the workspace.
1. Query the `FinanceOperationsActivity_CL` table in the Microsoft Sentinel workspace under **Logs**. 
1. Check that the table shows new logs that reflect the activities you executed in step 1 of this procedure. 

    :::image type="content" source="media/deploy-dynamics-365-finance-operations-solution/query-finance-operations-table.png" alt-text="Screenshot of viewing a new Finance and Operations incident in Microsoft Sentinel.":::

## Related content

In this article, you learned how to deploy Dynamics 365 Finance and Operations features included in the Microsoft Sentinel solution for Microsoft Business Applications.

- [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
- [Review the solution's security content](dynamics-365-finance-operations-security-content.md)

