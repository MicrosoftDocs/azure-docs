---
title: 'How to scan Azure Synapse Workspaces'
description: Learn how to scan a Synapse Workspace in your Azure Purview data catalog. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 3/31/2021
---

# Register and scan Azure Synapse workspaces

This article outlines how to register an Azure Synapse Workspace in Purview and set up a scan on it.

## Supported capabilities

Azure Synapse Workspace scans support capturing metadata and schema for dedicated and serverless SQL databases within them. It also classifies the data automatically based on system and custom classification rules.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be an Azure Purview Data Source Admin
- Setting up authentication as described in the sections below

### Setting up authentication for enumerating dedicated SQL database resources under a Synapse Workspace

1. Navigate to the **Resource group** or **Subscription** that the Synapse workspace is in, in the Azure portal.  
1. Select **Access Control (IAM)** from the left navigation menu 
1. You must be owner or user access administrator to add a role on the Resource group or Subscription. Select *+Add* button. 
1. Set the **Reader** Role and enter your Azure Purview account name (which represents its MSI) under Select input box. Click *Save* to finish the role assignment.
1. Follow steps 2 to 4 above to also add **Storage blob data reader** Role for the Azure Purview MSI on the resource group or subscription that the Synapse workspace is in.

### Setting up authentication for enumerating serverless SQL database resources under a Synapse Workspace

> [!NOTE]
> You must be a **Synapse administrator** on the workspace to run these commands. Learn more about Synapse permissions [here](../synapse-analytics/security/how-to-set-up-access-control.md).

1. Navigate to your Synapse workspace
1. Navigate to the **Data** section and to one of your serverless SQL databases
1. Click on the ellipses icon and start a New SQL script
1. Add the Azure Purview account MSI (represented by the account name) as **sysadmin** on the serverless SQL databases by running the command below in your SQL script:
    ```sql
    CREATE LOGIN [PurviewAccountName] FROM EXTERNAL PROVIDER;
    ALTER SERVER ROLE sysadmin ADD MEMBER [PurviewAccountName];
    ```

### Setting up authentication to scan resources under a Synapse workspace

There are three ways to set up authentication for an Azure Synapse source:

- Managed Identity
- Service Principal
 
#### Using Managed identity for Dedicated SQL databases

1. Navigate to your **Synapse workspace**
1. Navigate to the **Data** section and to one of your serverless SQL databases
1. Click on the ellipses icon and start a New SQL script
1. Add the Azure Purview account MSI (represented by the account name) as **db_owner** on the dedicated SQL database by running the command below in your SQL script:

    ```sql
    CREATE USER [PurviewAccountName] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_owner', [PurviewAccountName]
    GO
    ```
#### Using Managed identity for Serverless SQL databases

1. Navigate to your **Synapse workspace**
1. Navigate to the **Data** section and to one of your serverless SQL databases
1. Click on the ellipses icon and start a New SQL script
1. Add the Azure Purview account MSI (represented by the account name) as **sysadmin** on the serverless SQL databases by running the command below in your SQL script:
    ```sql
    CREATE LOGIN [PurviewAccountName] FROM EXTERNAL PROVIDER;
    ALTER SERVER ROLE sysadmin ADD MEMBER [PurviewAccountName];
    ```

#### Using Service Principal for Dedicated SQL databases

> [!NOTE]
> You must first set up a new **credential** of type Service Principal by following instructions [here](manage-credentials.md).

1. Navigate to your **Synapse workspace**
1. Navigate to the **Data** section and to one of your serverless SQL databases
1. Click on the ellipses icon and start a New SQL script
1. Add the **Service Principal ID** as **db_owner** on the dedicated SQL database by running the command below in your SQL script:

    ```sql
    CREATE USER [ServicePrincipalID] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_owner', [ServicePrincipalID]
    GO
    ```

#### Using Service Principal for Serverless SQL databases

1. Navigate to your **Synapse workspace**
1. Navigate to the **Data** section and to one of your serverless SQL databases
1. Click on the ellipses icon and start a New SQL script
1. Add the Azure Purview account MSI (represented by the account name) as **sysadmin** on the serverless SQL databases by running the command below in your SQL script:
    ```sql
    CREATE LOGIN [ServicePrincipalID] FROM EXTERNAL PROVIDER;
    ALTER SERVER ROLE sysadmin ADD MEMBER [ServicePrincipalID];
    ```

> [!NOTE]
> You must set up authentication on each Dedicated SQL database within your Synapse workspace, that you intend to register and scan. The permissions mentioned above for Serverless SQL database apply to all of them within your workspace i.e. you will have to run it only once.
    
## Register an Azure Synapse Source

To register a new Azure Synapse Source in your data catalog, do the following:

1. Navigate to your Purview account
1. Select **Sources** on the left navigation
1. Select **Register**
1. On **Register sources**, select **Azure Synapse Analytics (multiple)**
1. Select **Continue**

   :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source.png" alt-text="Set up Azure Synapse source":::

On the **Register sources (Azure Synapse Analytics)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Optionally choose a **subscription** to filter down to.
1. **Select a Synapse workspace name** from the dropdown. The SQL endpoints get automatically filled based on your workspace selection. 
1. Select a **collection** or create a new one (Optional)
1. **Finish** to register the data source

    :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source-details.png" alt-text="Fill details for Azure Synapse source":::

## Creating and running a scan

To create and run a new scan, do the following:

1. Navigate to the **Sources** section.

1. Select the data source that you registered.

1. Click on view details and Select **+ New scan** or use the scan quick action icon on the source tile

1. Fill in the *name* and select all the types of resource you want to scan within this source. **SQL Database** is the only type we support currently within a Synapse workspace.
   
    :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-setup.png" alt-text="Azure Synapse Source scan":::

1. Select the **credential** to connect to the resources within your data source. 
  
1. Within each type you can select to either scan all the resources or a subset of them by name.
1.	Click **Continue** to proceed. 

1.	Select a **scan rule sets** of type Azure Synapse SQL. You can also create scan rule sets inline.

1. Choose your scan trigger. You can scheduled it to run **weekly/monthly** or **once**

1. Review your scan and select Save to complete set up   

## Viewing your scans and scan runs

1. View source details by clicking on **view details** on the tile under the sources section. 

      :::image type="content" source="media/register-scan-synapse-workspace/synapse-source-details.png" alt-text="Azure Synapse Source details"::: 

1. View scan run details by navigating to the **scan details** page.
    1. The *status bar* is a brief summary on the running status of the children resources. It will be displayed on the workspace level scan.
    1. Green means successful, while red means failed. Grey means that the scan is still in-progress
    1. You can click into each scan to view more fine grained details

      :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-details.png" alt-text="Azure Synapse scan details" lightbox="media/register-scan-synapse-workspace/synapse-scan-details.png"::: 

1. View a summary of recent failed scan runs at the bottom of the source details page. You can also click into view more granular details pertaining to these runs.

## Manage your scans - edit, delete, or cancel
To manage or delete a scan, do the following:

- Navigate to the management center. Select Data sources under the Sources and scanning section then select on the desired data source.

- Select the scan you would like to manage. You can edit the scan by selecting Edit.

- You can delete your scan by selecting Delete.
- If a scan is running, you can cancel it as well.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)   