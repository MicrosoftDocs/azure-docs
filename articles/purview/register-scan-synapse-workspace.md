---
title: Connect to and manage Azure Synapse Analytics workspaces
description: This guide describes how to connect to Azure Synapse Analytics workspaces in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Azure Synapse Analytics workspace source.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 03/14/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Azure Synapse Analytics workspaces in Microsoft Purview

This article outlines how to register Azure Synapse Analytics workspaces and how to authenticate and interact with Azure Synapse Analytics workspaces in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | No| [Yes](#scan)| No| [Yes- Synapse pipelines](how-to-lineage-azure-synapse-analytics.md)|

>[!NOTE]
>Currently, Azure Synapse lake databases are not supported.

<!-- 4. Prerequisites
Required. Add any relevant/source-specific prerequisites for connecting with this source. Authentication/Registration should be covered by the sections below and does not need to be covered here.
-->

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register Azure Synapse Analytics workspaces in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

Only a user with at least a *Reader* role on the Azure Synapse workspace and who is also *data source administrators* in Microsoft Purview can register an Azure Synapse workspace.

### Steps to register

1. Go to your Microsoft Purview account.
1. On the left pane, select **Sources**.
1. Select **Register**.
1. Under **Register sources**, select **Azure Synapse Analytics (multiple)**.
1. Select **Continue**.

   :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source.png" alt-text="Screenshot of a selection of sources in Microsoft Purview, including Azure Synapse Analytics.":::

1. On the **Register sources (Azure Synapse Analytics)** page, do the following:

    a. Enter a **Name** for the data source to be listed in the data catalog.  
    b. Optionally, choose a **subscription** to filter down to.  
    c. In the **Workspace name** dropdown list, select the workspace that you're working with.  
    d. In the endpoints dropdown lists, the SQL endpoints are automatically filled in based on your workspace selection.  
    e. In the **Select a collection** dropdown list, choose the collection you're working with or, optionally, create a new one.  
    f. Select **Register** to finish registering the data source.

    :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source-details.png" alt-text="Screenshot of the 'Register sources (Azure Synapse Analytics)' page for entering details about the Azure Synapse source.":::

## Scan

Follow the steps below to scan Azure Synapse Analytics workspaces to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

You will first need to set up authentication for enumerating for either your [dedicated](#authentication-for-enumerating-dedicated-sql-database-resources) or [serverless](#authentication-for-enumerating-serverless-sql-database-resources) resources. This will allow Microsoft Purview to enumerate your workspace assets and perform scans.

Then, you will need to [apply permissions to scan the contents of the workspace](#apply-permissions-to-scan-the-contents-of-the-workspace).

### Authentication for enumerating dedicated SQL database resources

1. In the Azure portal, go to the Azure Synapse workspace resource.  
1. On the left pane, select **Access Control (IAM)**.

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role on the resource.

1. Select the **Add** button.
1. Set the **Reader** role and enter your Microsoft Purview account name, which represents its managed service identity (MSI).
1. Select **Save** to finish assigning the role.

> [!NOTE]
> If you're planning to register and scan multiple Azure Synapse workspaces in your Microsoft Purview account, you can also assign the role from a higher level, such as a resource group or a subscription.

### Authentication for enumerating serverless SQL database resources

There are three places you will need to set authentication to allow Microsoft Purview to enumerate your serverless SQL database resources: The Azure Synapse workspace, the associated storage, and the Azure Synapse serverless databases. The steps below will set permissions for all three.

#### Azure Synapse workspace

1. In the Azure portal, go to the Azure Synapse workspace resource.  
1. On the left pane, select **Access Control (IAM)**. 

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role on the resource.
   
1. Select the **Add** button.   
1. Set the **Reader** role and enter your Microsoft Purview account name, which represents its managed service identity (MSI).
1. Select **Save** to finish assigning the role.

#### Storage account

1. In the Azure portal, go to the **Resource group** or **Subscription** that the storage account associated with the Azure Synapse workspace is in.
1. On the left pane, select **Access Control (IAM)**. 

   > [!NOTE]
   > You must be an *owner* or *user access administrator* to add a role in the **Resource group** or **Subscription** fields. 
1. Select the **Add** button. 
1. Set the **Storage blob data reader** role and enter your Microsoft Purview account name (which represents its MSI) in the **Select** box. 
1. Select **Save** to finish assigning the role.

#### Azure Synapse serverless database

1. Go to your Azure Synapse workspace and open the Synapse Studio.
1. Select the **Data** tab on the left menu.
1. Select the ellipsis (**...**) next to one of your databases, and then start a new SQL script.
1. Add the Microsoft Purview account MSI (represented by the account name) on the serverless SQL databases. You do so by running the following command in your SQL script:
    ```sql
    CREATE LOGIN [PurviewAccountName] FROM EXTERNAL PROVIDER;
    ```

### Apply permissions to scan the contents of the workspace

You can set up authentication for an Azure Synapse source in either of two ways:

- Use a managed identity
- Use a service principal

> [!IMPORTANT]
> These steps for serverless databases **do not** apply to replicated databases. Currently in Synapse, serverless databases that are replicated from Spark databases are read-only. For more information, go [here](../synapse-analytics/sql/resources-self-help-sql-on-demand.md#operation-isnt-allowed-for-a-replicated-database).

> [!NOTE]
> You must set up authentication on each SQL database that you intended to register and scan from your Azure Synapse workspace.

#### Use a managed identity for dedicated SQL databases

1. Go to your Azure Synapse workspace.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to it, and then start a new SQL script.

   > [!NOTE]
   > To run the commands in the following procedure, you must be an *Azure Synapse administrator* on the workspace. For more information about Azure Synapse Analytics permissions, see: [Set up access control for your Azure Synapse workspace](../synapse-analytics/security/how-to-set-up-access-control.md).

1. Add the Microsoft Purview account MSI (represented by the account name) as **db_datareader** on the dedicated SQL database. You do so by running the following command in your SQL script:

    ```sql
    CREATE USER [PurviewAccountName] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [PurviewAccountName]
    GO
    ```
1. Follow the same steps for **each database you want to scan.**

#### Use a managed identity for serverless SQL databases

1. Go to your Azure Synapse workspace.
1. Go to the **Data** section, and select one of your SQL databases.
1. Select the ellipsis (**...**) next to your database, and then start a new SQL script.
1. Add the Microsoft Purview account MSI (represented by the account name) as **db_datareader** on the serverless SQL databases. You do so by running the following command in your SQL script:
    ```sql
    CREATE USER [PurviewAccountName] FOR LOGIN [PurviewAccountName];
    ALTER ROLE db_datareader ADD MEMBER [PurviewAccountName]; 
    ```

1. Follow the same steps for **each database you want to scan.**

#### Grant permission to use credentials for external tables

If the Azure Synapse workspace has any external tables, the Microsoft Purview managed identity must be given References permission on the external table scoped credentials. With the References permission, Microsoft Purview can read data from external tables.

```sql
GRANT REFERENCES ON DATABASE SCOPED CREDENTIAL::[scoped_credential] TO [PurviewAccountName];
```

#### Use a service principal for dedicated SQL databases

> [!NOTE]
> You must first set up a new *credential* of type *Service Principal* by following the instructions in [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

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

### Set up Azure Synapse workspace firewall access

1. In the Azure portal, go to the Azure Synapse workspace. 

1. On the left pane, select **Firewalls**.

1. For **Allow Azure services and resources to access this workspace** control, select **ON**.

1. Select **Save**.

> [!IMPORTANT]
> Currently, we do not support setting up scans for an Azure Synapse workspace from the Microsoft Purview governance portal, if you cannot enable **Allow Azure services and resources to access this workspace** on your Azure Synapse workspaces. In this case:
>  - You can use [Microsoft Purview REST API - Scans - Create Or Update](/rest/api/purview/scanningdataplane/scans/create-or-update/) to create a new scan for your Synapse workspaces including dedicated and serverless pools.
>  - You must use **SQL Auth** as authentication mechanism.

### Create and run scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

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

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
