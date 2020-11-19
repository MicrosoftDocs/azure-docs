---
title: 'How to scan Azure Synapse Analytics'
description: This how to guide describes details of how to scan Azure Synapse Analytics. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/22/2020
---
# Register and scan Azure Synapse Analytics

This article discusses how to register and scan an instance of Azure Synapse Analytics.

## Supported capabilities

The following scanning functions are supported for Azure Synapse Analytics:

 Full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications

## Prerequisites

1. You need to be a Catalog Admin or Data Source Admin

1. Create a new Babylon account if you don't already have one.

1. Networking access between the Babylon account and Azure Synapse Analytics.

1. Authentication to scan Azure Synapse Analytics. There are three authentication methods that Babylon supports today:

    > [!Note]
    > Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about 15 minutes after granting permission, the Babylon account should have the appropriate permissions to be able to scan the resource(s).

   1. **SQL authentication:** You can follow the instructions in [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database. 

   1. **Service Principal:** You need to [create an Azure AD application and service principal that can access resources if you don't have one already](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal). In addition, you must also create an Azure AD user in Azure SQL Database by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-service-principal-tutorial). Example SQL syntax to create user and grant permission:

      ```sql
      CREATE USER [ServicePrincipalName] FROM EXTERNAL PROVIDER
      GO

      EXEC sp_addrolemember 'db_owner', [ServicePrincipalName]
      GO
      ```

      > [!Note]
      > Babylon will need the **Application (client) ID** and the **client secret** in order to scan.

   1. **Managed Identity:** Your Babylon account has its own Managed Identity which is basically your Babylon name when you created it. You must create an Azure AD user in Azure Synapse Analytics with the exact Babylon's Managed Identity name by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-service-principal-tutorial). Example SQL syntax to create user and grant permission:

      ```sql
      CREATE USER [BabylonManagedIdentity] FROM EXTERNAL PROVIDER
      GO

      EXEC sp_addrolemember 'db_owner', [BabylonManagedIdentity]
      GO
      ```

1. The authentication must have permission to get metadata for the database, schemas and tables. It must also be able to query the tables to sample for classification. The recommendation is to assign `db_owner` permission to the identity.

## Register an Azure Synapse Analytics server

To register a new Azure Synapse Analytics server in your Data Catalog, do the following:

1. Navigate to your Purview Data Catalog.
1. Select **Management center** on the left navigation.
1. Select **Data sources** under **Sources and scanning**.
1. Select **+ New**.
1. On **Register sources**, select **Azure Synapse Analytics**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-synapse-analytics/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Synapse Analytics)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate server from the **Server name** drop down box.
   1. Or, you can select **Enter manually** and enter a **Server name**.
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-synapse-analytics/register-sources.png" alt-text="register sources options" border="true":::

## Set up authentication for a scan

1. Set up authentication for Azure Synapse Analytics using Azure subscription or manually.

2. Select authentication method as **Enter Manually**

3. Pick the server name

4. Click "Finish"

## Create and run a scan

### Scope your scan

The next screen here is to scope the scan. Please select the folders you want to scan and select continue (by default all the folders will be selected)

:::image type="content" source="./media/register-scan-azure-synapse-analytics/scope-scan.png" alt-text="Screenshot scope scans":::

The next screen is where you set your scan trigger, telling the system how often you would like to scan.

> [!NOTE]
> Once means no schedule, which is an indication to the system that the scan should only run once.

Here are some examples of triggers that are set up on a monthly cadence below. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

You can also set up a trigger on a weekly cadence with an option to choose the day of the week.

### Set scan rule set

Select a scan rule set to be used by your scan from the list of available

:::image type="content" source="./media/register-scan-azure-synapse-analytics/select-scan-rule-set.png" alt-text="Screenshot showing scan rule set":::

### Review your scan

When you click Continue, you will be presented with scan summary page, where you can view all the settings for your scan.

:::image type="content" source="./media/register-scan-azure-synapse-analytics/review-save-run.png" alt-text="Screenshot showing review your scan":::

### Edit a scan

Select a scan and click **Edit** to edit the selected scan. You can only edit one scan at a time.

### Remove a scan

To remove a scan, select one or more scans from the list, then select **Remove**.

### Scan history

Select any scan in the list to get to the scan history page. This page will show you whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

### Run a scan manually

From the **Scan History page**, you can choose **Run Scan now** to launch a new scan immediately. This action will run a full scan, not an incremental scan.

### Cancel scans in progress

Select one or more scans that are in progress by selecting the checkbox for each.

Then select **Cancel Scan** to stop all the selected scans from running.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)

