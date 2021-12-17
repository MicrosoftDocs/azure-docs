---
title: Share and receive data from Azure SQL Database and Azure Synapse Analytics
description: Learn how to share and receive data from Azure SQL Database and Azure Synapse Analytics
author: jifems
ms.author: jife
ms.service: data-share
ms.topic: how-to
ms.date: 09/10/2021
---
# Share and receive data from Azure SQL Database and Azure Synapse Analytics

[!INCLUDE [appliesto-sql](includes/appliesto-sql.md)]

Azure Data Share allows you to securely share snapshots of data from your Azure SQL Database and Azure Synapse Analytics resources, to other Azure subscriptions. Including Azure subscriptions outside your tenant. This article will guide you through what kinds of data can be shared, how to prepare you environment, how to create a share, and how to receive shared data.

:::image type="content" source="media/how-to/how-to-share-from-sql/data-share-flow.png" alt-text="Image showing the data flow between data owners and data consumers.":::

## What's supported

### Share data

Azure Data Share supports sharing data full data snapshots from several SQL resources in Azure. Incremental snapshots are not currently supported for these resources.

|Resource type | Share tables   | Share views |
|----------|-----------|------------|
| Azure SQL Database    | Yes       | Yes      |
|Azure Synapse Analytics (formerly Azure SQL DW)|Yes   |Yes|
|Synapse Analytics (workspace) dedicated SQL pool|Yes   |No|

>[!NOTE]
> Sharing from Azure Synapse Analytics (workspace) serverless SQL pool is not currently supported.

>[!NOTE]
> Currently, Azure Data Share does not support Azure SQL databases with Always Encrypted configured. 

### Receive shared data

Data consumers can choose to accept shared data into several Azure resources:

* Azure Data Lake Storage Gen2
* Azure Blob Storage
* Azure SQL Database
* Azure Synapse Analytics

Shared data in **Azure Data Lake Storage Gen 2** or **Azure Blob Storage** can be stored as a csv or parquet file. Full data snapshots overwrite the contents of the target file if already exists.

Shared data in **Azure SQL Database** and **Azure Synapse Analytics** is stored in tables. If the target table does not already exist, Azure Data Share creates the SQL table with the source schema. If a target table with the same name already exists, it will be dropped and overwritten with the latest full snapshot. 

>[!NOTE] 
> For source SQL tables with dynamic data masking, data will appear masked on the recipient side.

### Supported data types
When you share data from SQL source, the following mapping are used from SQL Server data types to Azure Data Share interim data types during snapshot process. 

>[!NOTE]
> 1. For data types that map to the Decimal interim type, currently snapshot supports precision up to 28. If you have data that requires precision larger than 28, consider converting to a string. 
> 1.  If you are sharing data from Azure SQL database to Azure Synapse Analytics, not all data types are supported. Refer to [Table data types in dedicated SQL pool](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-data-types.md) for details. 

| SQL Server data type | Azure Data Share interim data type |
|:--- |:--- |
| bigint |Int64 |
| binary |Byte[] |
| bit |Boolean |
| char |String, Char[] |
| date |DateTime |
| Datetime |DateTime |
| datetime2 |DateTime |
| Datetimeoffset |DateTimeOffset |
| Decimal |Decimal |
| FILESTREAM attribute (varbinary(max)) |Byte[] |
| Float |Double |
| image |Byte[] |
| int |Int32 |
| money |Decimal |
| nchar |String, Char[] |
| ntext |String, Char[] |
| numeric |Decimal |
| nvarchar |String, Char[] |
| real |Single |
| rowversion |Byte[] |
| smalldatetime |DateTime |
| smallint |Int16 |
| smallmoney |Decimal |
| sql_variant |Object |
| text |String, Char[] |
| time |TimeSpan |
| timestamp |Byte[] |
| tinyint |Int16 |
| uniqueidentifier |Guid |
| varbinary |Byte[] |
| varchar |String, Char[] |
| xml |String |


##  Prerequisites to share data

To share data snapshots from your Azure SQL resources, you need to prepare your environment. You'll need:

* An Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An [Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md) or [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace) with tables and views that you want to share.
* [An Azure Data Share account](share-your-data-portal.md#create-a-data-share-account).
* Your data recipient's Azure login e-mail address (using their e-mail alias won't work).
* If your Azure SQL resource is in a different Azure subscription than your Azure Data Share account, register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the subscription where your source Azure SQL resource is located.

There are also source-specific prerequisites for sharing. Select your source and follow the steps:

* [Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)](#prerequisitesforsharingazuresqlorsynapse)
* [Azure Synapse Analytics (workspace) SQL pool](#prerequisitesforsharingazuresynapseworkspace)

### <a id="prerequisitesforsharingazuresqlorsynapse">Prerequisites for sharing from Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)</a>

You can use one of these methods to authenticate with Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW):
* [Azure Active Directory authentication](#azure-active-directory-authentication)
* [SQL authentication](#sql-authentication)

#### Azure Active Directory authentication

* Permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
* SQL Server **Azure Active Directory Admin** permissions.
* SQL Server Firewall access: 
    1. In the [Azure portal](https://portal.azure.com/), navigate to your SQL server. Select *Firewalls and virtual networks* from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from the Azure portal. You can also add an IP range.
    1. Select **Save**.

#### SQL authentication

You can follow the [step by step demo video](https://youtu.be/hIE-TjJD8Dc) to configure authentication, or follow these steps below:

* Permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
* Permission for the Azure Data Share resource's managed identity to access the database:
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and set yourself as the **Azure Active Directory Admin**.
    1. Connect to the Azure SQL Database/Data Warehouse using the [Query Editor](../azure-sql/database/connect-query-portal.md#connect-using-azure-active-directory) or SQL Server Management Studio with Azure Active Directory authentication. 
    1. Execute the following script to add the Data Share resource Managed Identity as a db_datareader. You must connect using Active Directory and not SQL Server authentication. 
    
        ```sql
        create user "<share_acct_name>" from external provider;     
        exec sp_addrolemember db_datareader, "<share_acct_name>"; 
        ```                   
       Note that the *<share_acc_name>* is the name of your Data Share resource. If you have not created a Data Share resource as yet, you can come back to this pre-requisite later.  

* An Azure SQL Database User with **'db_datareader'** access to navigate and select the tables and/or views you wish to share. 

* SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to SQL server. Select *Firewalls and virtual networks* from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 

### <a id="prerequisitesforsharingazuresynapseworkspace">Prerequisites for sharing from Azure Synapse Analytics (workspace) SQL pool</a>

* Permission to write to the SQL pool in Synapse workspace: *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the **Contributor** role.
* Permission for the Data Share resource's managed identity to access Synapse workspace SQL pool: 
    1. In the [Azure portal](https://portal.azure.com/), navigate to your Synapse workspace. Select **SQL Active Directory admin** from left navigation and set yourself as the **Azure Active Directory admin**.
    1. Open the Synapse Studio, select **Manage** from the left navigation. Select **Access control** under Security. Assign yourself the **SQL admin** or **Workspace admin** role.
    1. Select **Develop** from the left navigation in the Synapse Studio. Execute the following script in SQL pool to add the Data Share resource Managed Identity as a db_datareader. 
    
        ```sql
        create user "<share_acct_name>" from external provider;     
        exec sp_addrolemember db_datareader, "<share_acct_name>"; 
        ```                   
       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.

* Synapse workspace Firewall access: 
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace. Select **Firewalls** from left navigation.
    1. Select **ON** for **Allow Azure services and resources to access this workspace**.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 

## Create a share

1. Navigate to your Data Share Overview page.

    ![Share your data](./media/share-receive-data.png "Share your data") 

1. Select **Start sharing your data**.

1. Select **Create**.   

1. Fill out the details for your share. Specify a name, share type, description of share contents, and terms of use (optional). 

    ![EnterShareDetails](./media/enter-share-details.png "Enter Share details") 

1. Select **Continue**.

1. To add Datasets to your share, select **Add Datasets**. 

    ![Add Datasets to your share](./media/datasets.png "Datasets")

1. Select the dataset type that you would like to add. You will see a different list of dataset types depending on the share type (snapshot or in-place) you have selected in the previous step. 

    ![AddDatasets](./media/add-datasets.png "Add Datasets")    

1. Select your SQL server or Synapse workspace. If you are using AAD authentication and the checkbox **Allow Data Share to run the above 'create user' SQL script on my behalf** appears, check the checkbox. If you are using SQL authentication, provide credentials, and be sure you have followed the prerequisites so that you have permissions.

   Select **Next** to navigate to the object you would like to share and select 'Add Datasets'. You can select tables and views from Azure SQL Database and Azure Synapse Analytics (formerly Azure SQL DW), or tables from Azure Synapse Analytics (workspace) dedicated SQL pool. 

    ![SelectDatasets](./media/select-datasets-sql.png "Select Datasets")    

1. In the Recipients tab, enter in the email addresses of your Data Consumer by selecting '+ Add Recipient'. The email address needs to be recipient's Azure login email.

    ![AddRecipients](./media/add-recipient.png "Add recipients") 

1. Select **Continue**.

1. If you have selected snapshot share type, you can configure snapshot schedule to provide updates of your data to your data consumer. 

    ![EnableSnapshots](./media/enable-snapshots.png "Enable snapshots") 

1. Select a start time and recurrence interval. 

1. Select **Continue**.

1. In the Review + Create tab, review your Package Contents, Settings, Recipients, and Synchronization Settings. Select **Create**.

Your Azure Data Share has now been created and the recipient of your Data Share can now accept your invitation. 

## Prerequisites to receive data
Before you can accept a data share invitation, you need to prepare your environment.

Confirm that all pre-requisites are complete before accepting a data share invitation:

* Azure Subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Data Share invitation: An invitation from Microsoft Azure with a subject titled "Azure Data Share invitation from **<yourdataprovider@domain.com>**".
* Register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the Azure subscription where you will create a Data Share resource and the Azure subscription where your target Azure data stores are located.
* You will need a resource in Azure where you will store the data, which can be one of these kinds of resources:
    - [Azure Storage](../storage/common/storage-account-create.md)
    - [Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md)
    - [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace.md)

There are also prerequisites for the resource where the received data will be stored. 
Select your resource type and follow the steps:

* [Azure Storage prerequisites](#prerequisites-for-target-storage-account)
* [Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW) prerequisites](#prerequisitesforreceivingtoazuresqlorsynapse)
* [Azure Synapse Analytics (workspace) SQL pool prerequisites](#prerequisitesforreceivingtoazuresynapseworkspacepool)

### Prerequisites for target storage account
If you choose to receive data into Azure Storage, complete these prerequisites before accepting a data share:

* An [Azure Storage account](../storage/common/storage-account-create.md). 
* Permission to write to the storage account: *Microsoft.Storage/storageAccounts/write*. This permission exists in the Azure RBAC **Contributor** role. 
* Permission to add role assignment of the Data Share resource's managed identity to the storage account: which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the Azure RBAC **Owner** role.  

### <a id="prerequisitesforreceivingtoazuresqlorsynapse">Prerequisites for receiving data into Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)</a>

To receive data into a SQL server where you are the **Azure Active Directory admin** of the SQL server, complete these prerequisites before accepting a data share:

* An [Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md) or [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace).
* Permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the Azure RBAC **Contributor** role.
* SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to your SQL server. Select **Firewalls and virtual networks** from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 
    
To receive data into a SQL server where you are not the **Azure Active Directory admin**, complete these prerequisites before accepting a data share: 

You can follow the [step by step demo video](https://youtu.be/aeGISgK1xro), or the steps below to configure prerequisites.

* An [Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md) or [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace).
* Permission to write to databases on the SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the Azure RBAC **Contributor** role. 
* Permission for the Data Share resource's managed identity to access the Azure SQL Database or Azure Synapse Analytics: 
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and set yourself as the **Azure Active Directory Admin**.
    1. Connect to the Azure SQL Database/Data Warehouse using the [Query Editor](../azure-sql/database/connect-query-portal.md#connect-using-azure-active-directory) or SQL Server Management Studio with Azure Active Directory authentication. 
    1. Execute the following script to add the Data Share Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'.

        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```      
       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.       

* SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and select **Firewalls and virtual networks**.
    1. Select **Yes** for **Allow Azure services and resources to access this server**.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 
 
### <a id="prerequisitesforreceivingtoazuresynapseworkspacepool">Prerequisites for receiving data into Azure Synapse Analytics (workspace) SQL pool</a>

* An Azure Synapse Analytics (workspace) dedicated SQL pool. Receiving data into serverless SQL pool is not currently supported.
* Permission to write to the SQL pool in Synapse workspace: *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the Azure RBAC **Contributor** role.
* Permission for the Data Share resource's managed identity to access the Synapse workspace SQL pool:
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace. 
    1. Select SQL Active Directory admin from left navigation and set yourself as the **Azure Active Directory admin**.
    1. Open Synapse Studio, select **Manage** from the left navigation. Select **Access control** under Security. Assign yourself the **SQL admin** or **Workspace admin** role.
    1. In Synapse Studio, select **Develop** from the left navigation. Execute the following script in SQL pool to add the Data Share resource Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'. 
    
        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```                   
       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.  

* Synapse workspace Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace. Select *Firewalls* from left navigation.
    1. Select **ON** for **Allow Azure services and resources to access this workspace**.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 

## Receive shared data

### Open invitation

You can open invitation from email or directly from the [Azure portal](https://portal.azure.com/). 

To open an invitation from email, check your inbox for an invitation from your data provider. The invitation is from Microsoft Azure, titled **Azure Data Share invitation from <yourdataprovider@domain.com>**. Click on **View invitation** to see your invitation in Azure. 

To open an invitation from Azure portal directly, search for **Data Share Invitations** in th Azure portal. This takes you to the list of Data Share invitations.

If you are a guest user of a tenant, you will be asked to verify your email address for the tenant prior to viewing Data Share invitation for the first time. Once verified, it is valid for 12 months.

![List of Invitations](./media/invitations.png "List of invitations") 

Then, select the share you would like to view. 

### Accept invitation
1. Make sure all fields are reviewed, including the **Terms of Use**. If you agree to the terms of use, you'll be required to check the box to indicate you agree. 

   ![Terms of use](./media/terms-of-use.png "Terms of use") 

1. Under *Target Data Share Account*, select the Subscription and Resource Group that you'll be deploying your Data Share into. 

   For the **Data Share Account** field, select **Create new** if you don't have an existing Data Share account. Otherwise, select an existing Data Share account that you'd like to accept your data share into. 

   For the **Received Share Name** field, you may leave the default specified by the data provide, or specify a new name for the received share. 

   Once you've agreed to the terms of use and specified a Data Share account to manage your received share, Select **Accept and configure**. A share subscription will be created. 

   ![Accept options](./media/accept-options.png "Accept options") 

   This takes you to the received share in your Data Share account. 

   If you don't want to accept the invitation, Select *Reject*. 

### Configure received share
Follow the steps below to configure where you want to receive data.

1. Select **Datasets** tab. Check the box next to the dataset you'd like to assign a destination to. Select **+ Map to target** to choose a target data store. 

   ![Map to target](./media/dataset-map-target.png "Map to target") 

1. Select a target data store that you'd like the data to land in. Any data files or tables in the target data store with the same path and name will be overwritten. If you are receiving data into SQL target, and the **Allow Data Share to run the above 'create user' SQL script on my behalf** checkbox appears, check the checkbox. Otherwise, follow the instruction in prerequisites to run the script appear on the screen. This will give Data Share resource write permission to your target SQL DB.

   ![Target storage account](./media/dataset-map-target-sql.png "Target Data Store") 

1. For snapshot-based sharing, if the data provider has created a snapshot schedule to provide regular update to the data, you can also enable snapshot schedule by selecting the **Snapshot Schedule** tab. Check the box next to the snapshot schedule and select **+ Enable**. Note that the first scheduled snapshot will start within one minute of the schedule time and subsequent snapshots will start within seconds of the scheduled time.

   ![Enable snapshot schedule](./media/enable-snapshot-schedule.png "Enable snapshot schedule")

### Trigger a snapshot
These steps only apply to snapshot-based sharing.

1. You can trigger a snapshot by selecting **Details** tab followed by **Trigger snapshot**. Here, you can trigger a full or incremental snapshot of your data. If it is your first time receiving data from your data provider, select full copy. For SQL sources, only full snapshot is supported. When a snapshot is executing, subsequent snapshots will not start until the previous one complete.

   ![Trigger snapshot](./media/trigger-snapshot.png "Trigger snapshot") 

1. When the last run status is *successful*, go to target data store to view the received data. Select **Datasets**, and click on the link in the Target Path. 

   ![Consumer datasets](./media/consumer-datasets.png "Consumer dataset mapping") 

### View history
This step only applies to snapshot-based sharing. To view history of your snapshots, select **History** tab. Here you'll find history of all snapshots that were generated for the past 30 days. 

## Snapshot performance
SQL snapshot performance is impacted by a number of factors. It is always recommended to conduct your own performance testing. Below are some example factors impacting performance.

* Source or destination data store input/output operations per second (IOPS) and bandwidth.
* Hardware configuration (e.g. vCores, memory, DWU) of the source and target SQL data store. 
* Concurrent access to the source and target data stores. If you are sharing multiple tables and views from the same SQL data store, or receive multiple tables and views into the same SQL data store, performance will be impacted.
* Network bandwidth between the source and destination data stores, and location of source and target data stores.
* Size of the tables and views being shared. SQL snapshot sharing does a full copy of the entire table. If the size of the table grows over time, snapshot will take longer. 

For large tables where incremental updates are desired, you can export updates to storage account and leverage storage account’s incremental sharing capability for faster performance.

## Troubleshoot snapshot failure
The most common cause of snapshot failure is that Data Share does not have permission to the source or target data store. In order to grant Data Share permission to the source or target Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW), you must run the provided SQL script when connecting to the SQL database using Azure Active Directory authentication. To troubleshoot additional SQL snapshot failure, refer to [Troubleshoot snapshot failure](data-share-troubleshoot.md#snapshots).

## Next steps
You have learned how to share and receive data from SQL sources using Azure Data Share service. To learn more about sharing from other data sources, continue to [supported data stores](supported-data-stores.md).
