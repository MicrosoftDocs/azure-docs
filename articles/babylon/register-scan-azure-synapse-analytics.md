---
title: 'How to scan Azure Synapse Analytics'
titleSuffix: Babylon
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

Navigate to your Babylon catalog.

1. Click on **Management Center** on the left navigation pane.

<!---![Screenshot showing how to go to Management Center]--->

2. Under **Sources and Scanning** pane, go to **Data sources** and hit the + sign on the right pane.

3. You can see **Register sources** pane open up on the right side of your screen. From the tiles of data sources, select **Azure Synapse Analytics** and hit **continue**

4. **Register sources** appears. Select a source name of your choice.

:::image type="content" source="./media/register-scan-azure-synapse-analytics/register.png" alt-text="Screenshot showing registration of source":::

## Set up authentication for a scan

1. Set up authentication for Azure Synapse Analytics using Azure subscription or manually.

2. Select authentication method as **Enter Manually**

3. Pick the server name

4. Click "Finish"

## Create and run a scan

1. Go to the data source name that you picked in step 5 and click **+ New scan** to set up a scan. You can enter the database name along with user name and pass word and test the connection.

<!---![screenshot to register data source]--->

2. Hit **Continue** once the connection is successful. 

### Set scan trigger

> [!NOTE] 
> Once means no schedule, which is an indication to the system that the scan should only run once. Recurring allows you to create a schedule the system should run the scan according to. The first execution of the scan will begin on the start date and time provided. Options include Monthly or Weekly scans.

1. You have the option to scan once or set up a recurring scan where you pick a date and time to run the scan periodically.

2. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. 

3. Choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

4. Set up a trigger on a weekly cadence with an option to choose the day of the week.

### Set scan rule set

Select a scan rule set to be used by your scan from the list of available

<!---![Screenshot showing scan rule set]--->

### Review your scan
Once you click Continue, you will view all the settings for your scan.

<!---![Screenshot showing scan rule set]--->

### Edit a scan

Select a scan and click Edit to edit the selected scan. You can only edit one scan at a time.

### Remove a scan

To remove a scan, select one or more scans from the list, then click Remove.

### Scan history

Click on any scan in the list to get to the scan history page. This page will show you whether your scan was schedule or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

### Run a scan manually

From the Scan History page, you can choose Run Scan now to launch a new scan immediately. This action will run a full scan, not an incremental scan.

### Cancel scans in progress

Select one or more scans that are in progress by selecting the checkbox for each.

Then click Cancel Scan to stop all the selected scans from running.

## Summary

In this tutorial you scanned an Azure Synapse Analytics account using the portal.

## Next Steps

- [How to Browse Data catalog](how-to-browse-catalog.md)
