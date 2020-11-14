---
title: 'Tutorial: Accept & receive data - Azure Data Share'
description: Tutorial - Accept and receive data using Azure Data Share 
author: jifems
ms.author: jife
ms.service: data-share
ms.topic: tutorial
ms.date: 11/12/2020
---
# Tutorial: Accept and receive data using Azure Data Share  

In this tutorial, you will learn how to accept a data share invitation using Azure Data Share. You will learn how to receive data being shared with you, as well as how to enable a regular refresh interval to ensure that you always have the most recent snapshot of the data being shared with you. 

> [!div class="checklist"]
> * How to accept an Azure Data Share invitation
> * Create an Azure Data Share account
> * Specify a destination for your data
> * Create a subscription to your data share for scheduled refresh

## Prerequisites
Before you can accept a data share invitation, you must provision a number of Azure resources, which are listed below. 

Ensure that all pre-requisites are complete before accepting a data share invitation. 

* Azure Subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Data Share invitation: An invitation from Microsoft Azure with a subject titled "Azure Data Share invitation from **<yourdataprovider@domain.com>**".
* Register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the Azure subscription where you will create a Data Share resource and the Azure subscription where your target Azure data stores are located.

### Receive data into a storage account

* An Azure Storage account: If you don't already have one, you can create an [Azure Storage account](../storage/common/storage-account-create.md). 
* Permission to write to the storage account, which is present in *Microsoft.Storage/storageAccounts/write*. This permission exists in the Contributor role. 
* Permission to add role assignment to the storage account, which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the Owner role.  

### Receive data into a SQL-based target
If you choose to receive data into Azure SQL Database, Azure Synapse Analytics, below is the list of prerequisites. 

#### Prerequisites for receiving data into Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)
You can follow the [step by step demo](https://youtu.be/aeGISgK1xro) to configure prerequisites.

* An Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW).
* Permission to write to databases on the SQL server, which is present in *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role. 
* Permission for the Data Share resource's managed identity to access the Azure SQL Database or Azure Synapse Analytics. This can be done through the following steps: 
    1. In Azure portal, navigate to the SQL server and set yourself as the **Azure Active Directory Admin**.
    1. Connect to the Azure SQL Database/Data Warehouse using [Query Editor](../azure-sql/database/connect-query-portal.md#connect-using-azure-active-directory) or SQL Server Management Studio with Azure Active Directory authentication. 
    1. Execute the following script to add the Data Share Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'. You must connect using Active Directory and not SQL Server authentication. 

        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```      
        Note that the *<share_acc_name>* is the name of your Data Share resource. If you have not created a Data Share resource as yet, you can come back to this pre-requisite later.         

* SQL Server Firewall access. This can be done through the following steps: 
    1. In SQL server in Azure portal, navigate to *Firewalls and virtual networks*
    1. Click **Yes** for *Allow Azure services and resources to access this server*.
    1. Click **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Click **Save**. 
 
#### Prerequisites for receiving data into Azure Synapse Analytics (workspace) SQL pool

* An Azure Synapse Analytics (workspace) dedicated SQL pool. Receiving data into serverless SQL pool is not currently supported.
* Permission to write to the SQL pool in Synapse workspace, which is present in *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the **Contributor** role.
* Permission for the Data Share resource's managed identity to access the Synapse workspace SQL pool. This can be done through the following steps: 
    1. In Azure portal, navigate to Synapse workspace. Select SQL Active Directory admin from left navigation and set yourself as the **Azure Active Directory admin**.
    1. Open Synapse Studio, select *Manage* from the left navigation. Select *Access control* under Security. Assign yourself **SQL admin** or **Workspace admin** role.
    1. In Synapse Studio, select *Develop* from the left navigation. Execute the following script in SQL pool to add the Data Share resource Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'. 
    
        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```                   
       Note that the *<share_acc_name>* is the name of your Data Share resource. If you have not created a Data Share resource as yet, you can come back to this pre-requisite later.  

* Synapse workspace Firewall access. This can be done through the following steps: 
    1. In Azure portal, navigate to Synapse workspace. Select *Firewalls* from left navigation.
    1. Click **ON** for *Allow Azure services and resources to access this workspace*.
    1. Click **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Click **Save**. 

### Receive data into an Azure Data Explorer cluster: 

* An Azure Data Explorer cluster in the same Azure data center as the data provider's Data Explorer cluster: If you don't already have one, you can create an [Azure Data Explorer cluster](/azure/data-explorer/create-cluster-database-portal). If you don't know the Azure data center of the data provider's cluster, you can create the cluster later in the process.
* Permission to write to the Azure Data Explorer cluster, which is present in *Microsoft.Kusto/clusters/write*. This permission exists in the Contributor role. 
* Permission to add role assignment to the Azure Data Explorer cluster, which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the Owner role. 

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Open invitation

1. You can open invitation from email or directly from Azure portal. 

   To open invitation from email, check your inbox for an invitation from your data provider. The invitation is from Microsoft Azure, titled **Azure Data Share invitation from <yourdataprovider@domain.com>**. Click on **View invitation** to see your invitation in Azure. 

   To open invitation from Azure portal directly, search for **Data Share Invitations** in Azure portal. This takes you to the list of Data Share invitations.

   ![List of Invitations](./media/invitations.png "List of invitations") 

1. Select the share you would like to view. 

## Accept invitation
1. Make sure all fields are reviewed, including the **Terms of Use**. If you agree to the terms of use, you'll be required to check the box to indicate you agree. 

   ![Terms of use](./media/terms-of-use.png "Terms of use") 

1. Under *Target Data Share Account*, select the Subscription and Resource Group that you'll be deploying your Data Share into. 

   For the **Data Share Account** field, select **Create new** if you don't have an existing Data Share account. Otherwise, select an existing Data Share account that you'd like to accept your data share into. 

   For the **Received Share Name** field, you may leave the default specified by the data provide, or specify a new name for the received share. 

   Once you've agreed to the terms of use and specified a Data Share account to manage your received share, Select **Accept and configure**. A share subscription will be created. 

   ![Accept options](./media/accept-options.png "Accept options") 

   This takes you to your the received share in your Data Share account. 

   If you don't want to accept the invitation, Select *Reject*. 

## Configure received share
Follow the steps below to configure where you want to receive data.

1. Select **Datasets** tab. Check the box next to the dataset you'd like to assign a destination to. Select **+ Map to target** to choose a target data store. 

   ![Map to target](./media/dataset-map-target.png "Map to target") 

1. Select a target data store type that you'd like the data to land in. Any data files or tables in the target data store with the same path and name will be overwritten. 

   For in-place sharing, select a data store in the Location specified. The Location is the Azure data center where data provider's source data store is located at. Once dataset is mapped, you can follow the link in the Target Path to access the data.

   ![Target storage account](./media/dataset-map-target-sql.png "Target storage") 

1. For snapshot-based sharing, if the data provider has created a snapshot schedule to provide regular update to the data, you can also enable snapshot schedule by selecting the **Snapshot Schedule** tab. Check the box next to the snapshot schedule and select **+ Enable**.

   ![Enable snapshot schedule](./media/enable-snapshot-schedule.png "Enable snapshot schedule")

## Trigger a snapshot
These steps only apply to snapshot-based sharing.

1. You can trigger a snapshot by selecting **Details** tab followed by **Trigger snapshot**. Here, you can trigger a full or  incremental snapshot of your data. If it is your first time receiving data from your data provider, select full copy. 

   ![Trigger snapshot](./media/trigger-snapshot.png "Trigger snapshot") 

1. When the last run status is *successful*, go to target data store to view the received data. Select **Datasets**, and click on the link in the Target Path. 

   ![Consumer datasets](./media/consumer-datasets.png "Consumer dataset mapping") 

## View history
This step only applies to snapshot-based sharing. To view history of your snapshots, select **History** tab. Here you'll find history of all snapshots that were generated for the past 30 days.

## Clean up resources

When the resource is no longer needed, go to the **Data Share Overview** page and select **Delete** to remove it.

## Next steps
In this tutorial, you learned how to accept and receive an Azure Data Share. To learn more about Azure Data Share concepts, continue to Azure Data Share Terminology.

> [!div class="nextstepaction"]
> [Azure Data Share Concepts](terminology.md)