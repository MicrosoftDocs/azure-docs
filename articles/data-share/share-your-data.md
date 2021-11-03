---
title: 'Tutorial: Share outside your org - Azure Data Share'
description: Tutorial - Share data with customers and partners using Azure Data Share  
author: jifems
ms.author: jife
ms.service: data-share
ms.topic: tutorial
ms.date: 03/24/2021
---
# Tutorial: Share data using Azure Data Share  

In this tutorial, you will learn how to set up a new Azure Data Share and start sharing your data with customers and partners outside of your Azure organization. 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a Data Share.
> * Add datasets to your Data Share.
> * Enable a snapshot schedule for your Data Share. 
> * Add recipients to your Data Share. 

## Prerequisites

* Azure Subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Your recipient's Azure login e-mail address (using their e-mail alias won't work).
* If the source Azure data store is in a different Azure subscription than the one you will use to create Data Share resource, register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the subscription where the Azure data store is located. 

### Share from a storage account

* An Azure Storage account: If you don't already have one, you can create an [Azure Storage account](../storage/common/storage-account-create.md)
* Permission to write to the storage account, which is present in *Microsoft.Storage/storageAccounts/write*. This permission exists in the **Contributor** role.
* Permission to add role assignment to the storage account, which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the **Owner** role. 


### Share from a SQL-based source
Below is the list of prerequisites for sharing data from SQL source. 

#### Prerequisites for sharing from Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)

* An Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW) with tables and views that you want to share.
* Permission to write to the databases on SQL server, which is present in *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
* **Azure Active Directory Admin** of the SQL server
* SQL Server Firewall access. This can be done through the following steps: 
    1. In Azure portal, navigate to SQL server. Select *Firewalls and virtual networks* from left navigation.
    1. Click **Yes** for *Allow Azure services and resources to access this server*.
    1. Click **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Click **Save**. 

#### Prerequisites for sharing from Azure Synapse Analytics (workspace) SQL pool

* * An Azure Synapse Analytics (workspace) dedicated SQL pool with tables that you want to share. Sharing of view is not currently supported. Sharing from serverless SQL pool is not currently supported.
* Permission to write to the SQL pool in Synapse workspace, which is present in *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the **Contributor** role.
* Permission for the Data Share resource's managed identity to access Synapse workspace SQL pool. This can be done through the following steps: 
    1. In Azure portal, navigate to Synapse workspace. Select SQL Active Directory admin from left navigation and set yourself as the **Azure Active Directory admin**.
    1. Open Synapse Studio, select *Manage* from the left navigation. Select *Access control* under Security. Assign yourself **SQL admin** or **Workspace admin** role.
    1. In Synapse Studio, select *Develop* from the left navigation. Execute the following script in SQL pool to add the Data Share resource Managed Identity as a db_datareader. 
    
        ```sql
        create user "<share_acct_name>" from external provider;     
        exec sp_addrolemember db_datareader, "<share_acct_name>"; 
        ```                   
       Note that the *<share_acc_name>* is the name of your Data Share resource. If you have not created a Data Share resource as yet, you can come back to this pre-requisite later.  

* Synapse workspace Firewall access. This can be done through the following steps: 
    1. In Azure portal, navigate to Synapse workspace. Select *Firewalls* from left navigation.
    1. Click **ON** for *Allow Azure services and resources to access this workspace*.
    1. Click **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you are sharing SQL data from Azure portal. You can also add an IP range.
    1. Click **Save**. 


### Share from Azure Data Explorer
* An Azure Data Explorer cluster with databases you want to share.
* Permission to write to Azure Data Explorer cluster, which is present in *Microsoft.Kusto/clusters/write*. This permission exists in the **Contributor** role.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a Data Share Account

### [Portal](#tab/azure-portal)

Create an Azure Data Share resource in an Azure resource group.

1. Select the menu button in the upper-left corner of the portal, then select **Create a resource** (+).

1. Search for *Data Share*.

1. Select Data Share and Select **Create**.

1. Fill out the basic details of your Azure Data Share resource with the following information. 

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your data share account.|
    | Resource group | *testresourcegroup* | Use an existing resource group or create a new resource group. |
    | Location | *East US 2* | Select a region for your data share account.
    | Name | *datashareaccount* | Specify a name for your data share account. |
    | | |

1. Select **Review + create**, then **Create** to provision your data share account. Provisioning a new data share account typically takes about 2 minutes or less. 

1. When the deployment is complete, select **Go to resource**.

### [Azure CLI](#tab/azure-cli)

Create an Azure Data Share resource in an Azure resource group.

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

Use these commands to create the resource:

1. Use the [az account set](/cli/azure/account#az_account_set) command to set your subscription to be the current default subscription:

   ```azurecli
   az account set --subscription 00000000-0000-0000-0000-000000000000
   ```

1. Run the [az provider register](/cli/azure/provider#az_provider_register) command to register the resource provider:

   ```azurecli
   az provider register --name "Microsoft.DataShare"
   ```

1. Run the [az group create](/cli/azure/group#az_group_create) command to create a resource group or use an existing resource group:

   ```azurecli
   az group create --name testresourcegroup --location "East US 2"
   ```

1. Run the [az datashare account create](/cli/azure/datashare/account#az_datashare_account_create) command to create a Data Share account:

   ```azurecli
   az datashare account create --resource-group testresourcegroup --name datashareaccount --location "East US 2" 
   ```

   Run the [az datashare account list](/cli/azure/datashare/account#az_datashare_account_list) command to see your Data Share accounts:

   ```azurecli
   az datashare account list --resource-group testresourcegroup
   ```

---

## Create a share

### [Portal](#tab/azure-portal)

1. Navigate to your Data Share Overview page.

    ![Share your data](./media/share-receive-data.png "Share your data") 

1. Select **Start sharing your data**.

1. Select **Create**.   

1. Fill out the details for your share. Specify a name, share type, description of share contents, and terms of use (optional). 

    ![EnterShareDetails](./media/enter-share-details.png "Enter Share details") 

1. Select **Continue**.

1. To add Datasets to your share, select **Add Datasets**. 

    ![Add Datasets to your share](./media/datasets.png "Datasets")

1. Select the dataset type that you would like to add. You will see a different list of dataset types depending on the share type (snapshot or in-place) you have selected in the previous step. If sharing from an Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW), you will be prompted for authentication method to list tables. Select AAD authentication, and check the checkbox **Allow Data Share to run the above 'create user' script on my behalf**. 

    ![AddDatasets](./media/add-datasets.png "Add Datasets")    

1. Navigate to the object you would like to share and select 'Add Datasets'. 

    ![SelectDatasets](./media/select-datasets.png "Select Datasets")    

1. In the Recipients tab, enter in the email addresses of your Data Consumer by selecting '+ Add Recipient'. 

    ![AddRecipients](./media/add-recipient.png "Add recipients") 

1. Select **Continue**.

1. If you have selected snapshot share type, you can configure snapshot schedule to provide updates of your data to your data consumer. 

    ![EnableSnapshots](./media/enable-snapshots.png "Enable snapshots") 

1. Select a start time and recurrence interval. 

1. Select **Continue**.

1. In the Review + Create tab, review your Package Contents, Settings, Recipients, and Synchronization Settings. Select **Create**.

### [Azure CLI](#tab/azure-cli)

1. Run the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command to create a Data Share:

   ```azurecli
   az storage account create --resource-group testresourcegroup --name ContosoMarketplaceAccount
   ```

1. Use the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create a container for the share in the previous command:

   ```azurecli
   az storage container create --name ContosoMarketplaceContainer --account-name ContosoMarketplaceAccount
   ```

1. Run the [az datashare create](/cli/azure/datashare#az_datashare_create) command to create your Data Share:

   ```azurecli
   az datashare create --resource-group testresourcegroup \
     --name ContosoMarketplaceDataShare --account-name ContosoMarketplaceAccount \
     --description "Data Share" --share-kind "CopyBased" --terms "Confidential"
   ```

1. Use the [az datashare invitation create](/cli/azure/datashare/invitation#az_datashare_invitation_create) command to create the invitation for the specified address:

   ```azurecli
   az datashare invitation create --resource-group testresourcegroup \
     --name DataShareInvite --share-name ContosoMarketplaceDataShare \
     --account-name ContosoMarketplaceAccount --target-email "jacob@fabrikam"
   ```

---

Your Azure Data Share has now been created and the recipient of your Data Share is now ready to accept your invitation.

## Clean up resources

When the resource is no longer needed, go to the **Data Share Overview** page and select **Delete** to remove it.

## Next steps

In this tutorial, you learnt how to create an Azure Data Share and invite recipients. To learn about how a Data Consumer can accept and receive a data share, continue to the accept and receive data tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Accept and receive data using Azure Data Share](subscribe-to-data-share.md)
