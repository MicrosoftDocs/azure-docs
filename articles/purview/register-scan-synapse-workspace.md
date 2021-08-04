---
title: 'How to scan Azure Synapse Analytics workspaces'
description: Learn how to scan an Azure Synapse workspace in your Azure Purview data catalog. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 06/18/2021
---

# Register and scan Azure Synapse Analytics workspaces

This article outlines how to register an Azure Synapse Analytics workspace in Azure Purview and set up a scan on it.

## Supported capabilities

Azure Synapse Analytics workspace scans support capturing metadata and schema for the dedicated and serverless SQL databases within them. The workspace scans also classify the data automatically, based on system and custom classification rules.

## Prerequisites

- Before you register your data sources, create an Azure Purview account. For more information, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You must be an Azure Purview data source administrator.
- Set up authentication as described in the following sections.

## Register and scan an Azure Synapse workspace

> [!IMPORTANT]
> To scan your workspace successfully, follow the steps and apply the permissions exactly as they're outlined in the next sections.

### **Step 1**: Register your source

> [!NOTE]
> Only users with at least a *Reader* role on the Azure Synapse workspace who are also *data source administrators* in Azure Purview can perform this step.

To register a new Azure Synapse Source in your data catalog, do the following:

1. Go to your Azure Purview account.
1. On the left pane, select **Sources**.
1. Select **Register**.
1. Under **Register sources**, select **Azure Synapse Analytics (multiple)**.
1. Select **Continue**.

   :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source.png" alt-text="Screenshot of a selection of sources in Azure Purview, including Azure Synapse Analytics.":::

1. On the **Register sources (Azure Synapse Analytics)** page, do the following:

    a. Enter a **Name** for the data source to be listed in the data catalog.  
    b. Optionally, choose a **subscription** to filter down to.  
    c. In the **Workspace name** dropdown list, select the workspace that you're working with.  
    d. In the endpoints dropdown lists, the SQL endpoints are automatically filled in based on your workspace selection.  
    e. In the **Select a collection** dropdown list, choose the collection you're working with or, optionally, create a new one.  
    f. Select **Register** to finish registering the data source.
    
    :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source-details.png" alt-text="Screenshot of the 'Register sources (Azure Synapse Analytics)' page for entering details about the Azure Synapse source.":::


### **Step 2**: Apply permissions to enumerate the contents of the Azure Synapse workspace

#### Set up authentication for enumerating dedicated SQL database resources

1. In the Azure portal, go to the Azure Synapse workspace resource.  
1. On the left pane, select **Access Control (IAM)**. 

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role on the resource.
   
1. Select the **Add** button.   
1. Set the **Reader** role and enter your Azure Purview account name, which represents its managed service identity (MSI).
1. Select **Save** to finish assigning the role.

> [!NOTE]
> If you're planning to register and scan multiple Azure Synapse workspaces in your Azure Purview account, you can also assign the role from a higher level, such as a resource group or a subscription. 

#### Set up authentication for enumerating serverless SQL database resources

There are three places you will need to set authentication to allow Purview to enumerate your serverless SQL database resources: the Synapse workspace, the associated storage, and on the Serverless databases. The steps below will set permissions for all three.

1. In the Azure portal, go to the Azure Synapse workspace resource.  
1. On the left pane, select **Access Control (IAM)**. 

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role on the resource.
   
1. Select the **Add** button.   
1. Set the **Reader** role and enter your Azure Purview account name, which represents its managed service identity (MSI).
1. Select **Save** to finish assigning the role.
1. In the Azure portal, go to the **Resource group** or **Subscription** that the Azure Synapse workspace is in.
1. On the left pane, select **Access Control (IAM)**. 

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role in the **Resource group** or **Subscription** fields. 

1. Select the **Add** button. 
1. Set the **Storage blob data reader** role and enter your Azure Purview account name (which represents its MSI) in the **Select** box. 
1. Select **Save** to finish assigning the role.
1. Go to your Azure Synapse workspace and open the Synapse Studio.
1. Select the **Data** tab on the left menu.
1. Select the ellipsis (**...**) next to one of your databases, and then start a new SQL script.
1. Add the Azure Purview account MSI (represented by the account name) on the serverless SQL databases. You do so by running the following command in your SQL script:
    ```sql
    CREATE LOGIN [PurviewAccountName] FROM EXTERNAL PROVIDER;
    ```

### **Step 3**: Apply permissions to scan the contents of the workspace

You can set up authentication for an Azure Synapse source in either of two ways:

- Use a managed identity
- Use a service principal

> [!IMPORTANT]
> These steps for serverless databases **do not** apply to replicated databases. Currently in Synapse, serverless databases that are replicated from Spark databases are read-only. For more information, go [here](../synapse-analytics/sql/resources-self-help-sql-on-demand.md#operation-is-not-allowed-for-a-replicated-database).

> [!NOTE]
> You must set up authentication on each dedicated SQL database in your Azure Synapse workspace that you intend to register and scan. The permissions that are mentioned in the following sections for serverless SQL database apply to all databases within your workspace. That is, you'll have to set up authentication only once.

#### Use a managed identity for dedicated SQL databases

1. Go to your Azure Synapse workspace.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to it, and then start a new SQL script.

   > [!NOTE]
   > To run the commands in the following procedure, you must be an *Azure Synapse administrator* on the workspace. For more information about Azure Synapse Analytics permissions, see: [Set up access control for your Azure Synapse workspace](../synapse-analytics/security/how-to-set-up-access-control.md).

1. Add the Azure Purview account MSI (represented by the account name) as **db_datareader** on the dedicated SQL database. You do so by running the following command in your SQL script:

    ```sql
    CREATE USER [PurviewAccountName] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [PurviewAccountName]
    GO
    ```
#### Use a managed identity for serverless SQL databases

1. Go to your Azure Synapse workspace.
1. Go to the **Data** section, and follow the next steps for **each database you want to scan.**
1. Select the ellipsis (**...**) next to your database, and then start a new SQL script.
1. Add the Azure Purview account MSI (represented by the account name) as **db_datareader** on the serverless SQL databases. You do so by running the following command in your SQL script:
    ```sql
    CREATE USER [PurviewAccountName] FOR LOGIN [PurviewAccountName];
    ALTER ROLE db_datareader ADD MEMBER [PurviewAccountName]; 
    ```

#### Use a service principal for dedicated SQL databases

> [!NOTE]
> You must first set up a new *credential* of type *Service Principal* by following the instructions in [Credentials for source authentication in Azure Purview](manage-credentials.md).

1. Go to your **Azure Synapse workspace**.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to it, and then start a new SQL script.
1. Add the **Service Principal ID** as **db_datareader** on the dedicated SQL database. You do so by running the following command in your SQL script:

    ```sql
    CREATE USER [ServicePrincipalID] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [ServicePrincipalID]
    GO
    ```
> [!NOTE]
> Repeat the previous step for all dedicated SQL databases in your Synapse workspace. 

#### Use a service principal for serverless SQL databases

1. Go to your Azure Synapse workspace.
1. Go to the **Data** section, and then look for one of your serverless SQL databases.
1. Select the ellipsis (**...**) next to it, and then start a new SQL script.
1. Add the **Service Principal ID** on the serverless SQL databases. You do so by running the following command in your SQL script:
    ```sql
    CREATE LOGIN [ServicePrincipalID] FROM EXTERNAL PROVIDER;
    ```
    
1. Add **Service Principal ID** as **db_datareader** on each of the serverless SQL databases you want to scan. You do so by running the following command in your SQL script:
   ```sql
    CREATE USER [ServicePrincipalID] FOR LOGIN [ServicePrincipalID];
    ALTER ROLE db_datareader ADD MEMBER [ServicePrincipalID]; 
    ```

### **Step 4**: Set up Azure Synapse workspace firewall access

1. In the Azure portal, go to the Azure Synapse workspace. 

1. On the left pane, select **Firewalls**.

1. For **Allow Azure services and resources to access this workspace** control, select **ON**.

1. Select **Save**.

### **Step 5**: Set up a scan on the workspace

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in Purview Studio.

1. Select the data source that you registered.

1. Select **View details**, and then select **New scan**. Alternatively, you can select the **Scan quick action** icon on the source tile.

1. On the **Scan** details pane, in the **Name** box, enter a name for the scan.
1. In the **Type** dropdown list, select the types of resources that you want to scan within this source. **SQL Database** is the only type we currently support within an Azure Synapse workspace.
   
    :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-setup.png" alt-text="Screenshot of the details pane for the Azure Synapse source scan.":::

1. In the **Credential** dropdown list, select the credential to connect to the resources within your data source. 
  
1. Within each type, you can select to scan either all the resources or a subset of them by name.

1.	Select **Continue** to proceed. 

1.	Select **Scan rule sets** of type **Azure Synapse SQL**. You can also create scan rule sets inline.

1. Choose your scan trigger. You can schedule it to run **weekly/monthly** or **once**.

1. Review your scan, and then select **Save** to complete the setup.   

#### View your scans and scan runs

1. View source details by selecting **view details** on the tile under the sources section. 

      :::image type="content" source="media/register-scan-synapse-workspace/synapse-source-details.png" alt-text="Screenshot of the Azure Synapse Analytics source details page."::: 

1. View scan run details by going to the **scan details** page.

    * The **status bar** displays a brief summary of the running status of the child resources. The status is displayed on the workspace level scan.  
    * Green indicates a successful scan run, red indicates a failed scan run, and gray indicates that the scan run is still in progress.  
    * You can view more granular information about the scan runs by clicking into them.

      :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-details.png" alt-text="Screenshot of the Azure Synapse Analytics scan details page." lightbox="media/register-scan-synapse-workspace/synapse-scan-details.png"::: 

    * You can view a summary of recent failed scan runs at the bottom of the **source details** page. Again, you can view more granular information about the scan runs by clicking into them.

#### Manage your scans

To edit, delete, or cancel a scan, do the following:

1. Go to the management center. In the **Sources and scanning** section, select **Data sources**, and then select the data source you want to manage.

1. Select the scan you want to manage, and then select **Edit**.

   - To delete your scan, select **Delete**.
   - If a scan is currently running, you can cancel it.

## Next steps

- [Browse the Azure Purview Data Catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)   
