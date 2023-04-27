---
title: 'Tutorial: Accept & receive data - Azure Data Share'
description: Tutorial - Accept and receive data using Azure Data Share 
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: tutorial
ms.date: 11/30/2022
---
# Tutorial: Accept and receive data using Azure Data Share  

In this tutorial, you'll learn how to accept a data share invitation using Azure Data Share. You'll learn how to receive data being shared with you, and how to enable a regular refresh interval to ensure that you always have the most recent snapshot of the data being shared with you. 

> [!div class="checklist"]
> * How to accept an Azure Data Share invitation
> * Create an Azure Data Share account
> * Specify a destination for your data
> * Create a subscription to your data share for scheduled refresh

## Prerequisites
Before you can accept a data share invitation, you must create some Azure resources, which are listed below. 

Ensure that all prerequisites are complete before accepting a data share invitation. 

* Azure Subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Data Share invitation: An invitation from Microsoft Azure with a subject titled "Azure Data Share invitation from **<yourdataprovider@domain.com>**".
* Register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the Azure subscription where you'll create a Data Share resource and the Azure subscription where your target Azure data stores are located.

### Receive data into a storage account

* An Azure Storage account: If you don't already have one, you can create an [Azure Storage account](../storage/common/storage-account-create.md). 
* Permission to write to the storage account, which is present in *Microsoft.Storage/storageAccounts/write*. This permission exists in the **Storage Blob Data Contributor** role. 
* Permission to add role assignment to the storage account, which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the Owner role.  

### Receive data into a SQL-based target
If you choose to receive data into Azure SQL Database, Azure Synapse Analytics, below is the list of prerequisites. 

#### Prerequisites for receiving data into Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW)

* An Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW).
* Permission to write to databases on the SQL server, which is present in *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role. 
* **Azure Active Directory Admin** of the SQL server
* SQL Server Firewall access. This can be done through the following steps: 
    1. In SQL server in Azure portal, navigate to *Firewalls and virtual networks*
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you're sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 
 
#### Prerequisites for receiving data into Azure Synapse Analytics (workspace) SQL pool

* An Azure Synapse Analytics (workspace) dedicated SQL pool. Receiving data into serverless SQL pool isn't currently supported.
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
       The *<share_acc_name>* is the name of your Data Share resource. If you haven't created a Data Share resource as yet, you can come back to this pre-requisite later.  

* Synapse workspace Firewall access. This can be done through the following steps: 
    1. In Azure portal, navigate to Synapse workspace. Select *Firewalls* from left navigation.
    1. Select **ON** for *Allow Azure services and resources to access this workspace*.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you're sharing SQL data from Azure portal. You can also add an IP range.
    1. Select **Save**. 

### Receive data into an Azure Data Explorer cluster: 

* An Azure Data Explorer cluster in the same Azure data center as the data provider's Data Explorer cluster: If you don't already have one, you can create an [Azure Data Explorer cluster](/azure/data-explorer/create-cluster-database-portal). If you don't know the Azure data center of the data provider's cluster, you can create the cluster later in the process.
* Permission to write to the Azure Data Explorer cluster, which is present in *Microsoft.Kusto/clusters/write*. This permission exists in the Contributor role. 

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Open invitation

### [Portal](#tab/azure-portal)

1. You can open invitation from email or directly from Azure portal. 

   To open invitation from email, check your inbox for an invitation from your data provider. The invitation is from Microsoft Azure, titled **Azure Data Share invitation from <yourdataprovider@domain.com>**. Select on **View invitation** to see your invitation in Azure. 

   To open invitation from Azure portal directly, search for **Data Share Invitations** in Azure portal. This action takes you to the list of Data Share invitations.

   If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant prior to viewing Data Share invitation for the first time. Once verified, it's valid for 12 months.

   ![List of Invitations](./media/invitations.png "List of invitations") 

1. Select the invitation you would like to view. 

### [Azure CLI](#tab/azure-cli)

Prepare your Azure CLI environment and then view your invitations.

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Run the [az datashare consumer-invitation list-invitation](/cli/azure/datashare/consumer-invitation) command to see your current invitations:

```azurecli
az datashare consumer consumer-invitation list-invitation
```

Copy your invitation ID for use in the next section.

### [PowerShell](#tab/powershell)

Start by preparing your environment for PowerShell. You can either run PowerShell commands locally or using the Bash environment in the Azure Cloud Shell.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

   [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

1. Use the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command to connect to your Azure account.

    ```azurepowershell
    Connect-AzAccount
    ```

1. Run the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) command to set the correct subscription, if you have multiple subscriptions.

    ```azurepowershell
    Set-AzContext [SubscriptionID/SubscriptionName]
    ```

1. Run the [Get-AzDataShareReceivedInvitation](/powershell/module/az.datashare/get-azdatasharereceivedinvitation) command to see your current invitations:

    ```azurepowershell
    Get-AzDataShareReceivedInvitation
    ```

Copy your invitation ID for use in the next section.

---

## Accept invitation

### [Portal](#tab/azure-portal)

1. Make sure all fields are reviewed, including the **Terms of Use**. If you agree to the terms of use, you'll be required to check the box to indicate you agree. 

   ![Terms of use](./media/terms-of-use.png "Terms of use") 

1. Under *Target Data Share Account*, select the Subscription and Resource Group that you'll be deploying your Data Share into. 

   For the **Data Share Account** field, select **Create new** if you don't have an existing Data Share account. Otherwise, select an existing Data Share account that you'd like to accept your data share into. 

   For the **Received Share Name** field, you may leave the default specified by the data provide, or specify a new name for the received share. 

   Once you've agreed to the terms of use and specified a Data Share account to manage your received share, Select **Accept and configure**. A share subscription will be created. 

   ![Accept options](./media/accept-options.png "Accept options") 

   This action takes you to the received share in your Data Share account. 

   If you don't want to accept the invitation, Select *Reject*. 

### [Azure CLI](#tab/azure-cli)

Use the [az datashare share-subscription create](/cli/azure/datashare/share-subscription#az-datashare-share-subscription-create) command to create the Data Share.

```azurecli
az datashare share-subscription create --resource-group share-rg \
  --name "fabrikamsolutions" --account-name FabrikamDataShareAccount \
  --invitation-id 89abcdef-0123-4567-89ab-cdef01234567 \
  --source-share-location "East US 2"
```

### [PowerShell](#tab/powershell)

Use the [New-AzDataShareSubscription](/powershell/module/az.datashare/new-azdatasharesubscription) command to create the Data Share. The InvitationId will be the ID you gathered from the previous step.

```azurepowershell
New-AzDataShareSubscription -ResourceGroupName <String> -AccountName <String> -Name <String> -InvitationId <String>
```

---

## Configure received share

### [Portal](#tab/azure-portal)

Follow the steps below to configure where you want to receive data.

1. Select **Datasets** tab. Check the box next to the dataset you'd like to assign a destination to. Select **+ Map to target** to choose a target data store. 

   ![Map to target](./media/dataset-map-target.png "Map to target") 

1. Select a target data store type that you'd like the data to land in. Any data files or tables in the target data store with the same path and name will be overwritten. If you're receiving data into Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL DW), check the checkbox **Allow Data Share to run the above 'create user' script on my behalf**.

   For in-place sharing, select a data store in the Location specified. The Location is the Azure data center where data provider's source data store is located at. Once dataset is mapped, you can follow the link in the Target Path to access the data.

   ![Target storage account](./media/dataset-map-target-sql.png "Target storage") 

1. For snapshot-based sharing, if the data provider has created a snapshot schedule to provide regular update to the data, you can also enable snapshot schedule by selecting the **Snapshot Schedule** tab. Check the box next to the snapshot schedule and select **+ Enable**. The first scheduled snapshot will start within one minute of the schedule time and subsequent snapshots will start within seconds of the scheduled time.

   ![Enable snapshot schedule](./media/enable-snapshot-schedule.png "Enable snapshot schedule")
   
   The metadata of copied files isn't persisted after each run. This is by design.

### [Azure CLI](#tab/azure-cli)

Use these commands to configure where you want to receive data.

1. Run the [az datashare consumer-source-data-set list](/cli/azure/datashare/consumer-source-data-set#az-datashare-consumer-source-data-set-list) command to get the data set ID:

   ```azurecli
   az datashare consumer-source-data-set list --resource-group "share-rg" \
    --account-name "FabrikamDataShareAccount" \
      --share-subscription-name "fabrikamsolutions" \
   ```

1. If you need a storage account, run the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create a storage account for this Data Share:

   ```azurecli
   az storage account create --resource-group "share-rg" --name "FabrikamDataShareStorageAccount" \
   ```

1. Use the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command to get the storage account ID:

   ```azurecli
   az storage account show --resource-group "share-rg" --name "FabrikamDataShareStorageAccount" \
    --query "id"
   ```

1. Use the following command to get the account principal ID:

   ```azurecli
   az datashare account show --resource-group "share-rg" --name "FabrikamDataShareAccount" \
     --query "identity.principalId"
   ```

1. Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to create a role assignment for the account principal using the account principal ID and your storage account ID:

   ```azurecli
   az role assignment create --role "Contributor" \
     --assignee-object-id 6789abcd-ef01-2345-6789-abcdef012345 
     --assignee-principal-type ServicePrincipal --scope "your\storage\account\id\path"
   ```

1. Create a variable for the mapping based on the data set ID from step 1:

   ```azurecli
   $mapping='{\"data_set_id\":\"' + $dataset_id + '\",\"container_name\":\"newcontainer\",
     \"storage_account_name\":\"datashareconsumersa\",\"kind\":\"BlobFolder\",\"prefix\":\"consumer\"}'
   ```

1. Use the [az datashare data-set-mapping create](/cli/azure/datashare/data-set-mapping#az-datashare-data-set-mapping-create) command to create the dataset mapping:

   ```azurecli
   az datashare data-set-mapping create --account-name "FabrikamDataShareAccount" \
    --data-set-mapping-name "datasetmapping" --resource-group "share-rg" \
    --share-subscription-name "fabrikamsolutions" --blob-folder-data-set-mapping $mapping
    ```

1. Run the [az datashare share-subscription synchronize](/cli/azure/datashare/share-subscription#az-datashare-share-subscription-synchronize) command to start dataset synchronization.

   ```azurecli
   az datashare share-subscription synchronize \
     --resource-group "share-rg" --account-name "FabrikamDataShareAccount"  \
     --name "Fabrikam Solutions" --synchronization-mode "Incremental" \
   ```

   Run the [az datashare share-subscription list-synchronization](/cli/azure/datashare/share-subscription#az-datashare-share-subscription-list-synchronization) command to see a list of your synchronizations:

   ```azurecli
   az datashare share-subscription list-synchronization \
     --resource-group "share-rg" --account-name "FabrikamDataShareAccount" \
     --share-subscription-name "Fabrikam Solutions" \
   ```

   Use the [az datashare share-subscription list-source-share-synchronization-setting](/cli/azure/datashare/share-subscription#az-datashare-share-subscription-list-source-share-synchronization-setting) command to see synchronization settings set on your share.

   ```azurecli
   az datashare share-subscription list-source-share-synchronization-setting \
     --resource-group "share-rg" --account-name "FabrikamDataShareAccount" \
     --share-subscription-name "Fabrikam Solutions"
   ```

### [PowerShell](#tab/powershell)

Use these commands to configure where you want to receive data.

1. Run the [Get-AzDataShareSourceDataSet](/powershell/module/az.datashare/get-azdatasharesourcedataset) command to get the data set ID:

   ```azurepowershell
   Get-AzDataShareSourceDataSet -ResourceGroupName <String> -AccountName <String> -ShareSubscriptionName <String>
   ```

1. If you don't already have a location where you would like to store the shared data, you can follow these steps to create a storage account. If you already have storage, you may skip to the next steps.

    1. Run the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command to create an Azure Storage account:

       ```azurepowershell
       $storageAccount = New-AzStorageAccount -ResourceGroupName <String> -AccountName <String> -Location <String> -SkuName <String>

       $ctx = $storageAccount.Context
       ```

    1. Run the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) command to create a container in your new Azure Storage account that will hold your data:

       ```azurepowershell
       $containerName = <String>

       New-AzStorageContainer -Name $containerName -Context $ctx -Permission blob
       ```

    1. Run the [Set-AzStorageBlobContent](/powershell/module/az.storage/new-azstoragecontainer) command to upload a file. The following example uploads _textfile.csv_ from the _D:\testFiles_ folder on local memory, to the container you created.
               
       ```azurepowershell
       Set-AzStorageBlobContent -File "D:\testFiles\textfile.csv" -Container $containerName -Blob "textfile.csv" -Context $ctx
       ```

    For more information about working with Azure Storage in PowerShell, follow this [Azure Storage PowerShell guide](../storage/blobs/storage-quickstart-blobs-powershell.md).

1. Use the [Get-AzStorageAccount](/powershell/module/az.storage/Get-azStorageAccount) command to get the storage account ID:

   ```azurepowershell
   Get-AzStorageAccount -ResourceGroupName <String> -Name <String>
   ```

1. Use the data set ID from the first step, then run the [New-AzDataShareDataSetMapping](/powershell/module/az.datashare/new-azdatasharedatasetmapping) command to create the dataset mapping:

   ```azurepowershell
   New-AzDataShareDataSetMapping -ResourceGroupName <String> -AccountName <String> -ShareSubscriptionName <String> -Name <String> -StorageAccountResourceId <String> -DataSetId <String> -Container <String>
   ```

1. Run the [Start-AzDataShareSubscriptionSynchronization](/powershell/module/az.datashare/start-azdatasharesubscriptionsynchronization) command to start dataset synchronization.

   ```azurepowershell
   Start-AzDataShareSubscriptionSynchronization -ResourceGroupName <String> -AccountName <String> -ShareSubscriptionName <String> -SynchronizationMode <String>
   ```

   Run the [Get-AzDataShareSubscriptionSynchronization](/powershell/module/az.datashare/get-azdatasharesubscriptionsynchronization) command to see a list of your synchronizations:

   ```azurepowershell
   Get-AzDataShareSubscriptionSynchronization -ResourceGroupName <String> -AccountName <String> -ShareSubscriptionName <String>
   ```

   Use the [Get-AzDataShareSubscriptionSynchronizationDetail](/powershell/module/az.datashare/get-azdatasharesubscriptionsynchronizationdetail) command to see synchronization settings set on your share.

   ```azurepowershell
   Get-AzDataShareSubscriptionSynchronizationDetail -ResourceGroupName <String> -AccountName <String> -ShareSubscriptionName <String> -SynchronizationId <String>
   ```
---

## Trigger a snapshot

### [Portal](#tab/azure-portal)

These steps only apply to snapshot-based sharing.

1. You can trigger a snapshot by selecting **Details** tab followed by **Trigger snapshot**. Here, you can trigger a full or  incremental snapshot of your data. If it is your first time receiving data from your data provider, select full copy. 

   ![Trigger snapshot](./media/trigger-snapshot.png "Trigger snapshot") 

1. When the last run status is *successful*, go to target data store to view the received data. Select **Datasets**, and select the link in the Target Path. 

   ![Consumer datasets](./media/consumer-datasets.png "Consumer dataset mapping") 

### [Azure CLI](#tab/azure-cli)

Run the [az datashare trigger create](/cli/azure/datashare/trigger#az-datashare-trigger-create) command to trigger a snapshot:

```azurecli
az datashare trigger create --account-name "FabrikamDataShareAccount" --resource-group "share-rg" --share-subscription-name "Fabrikam Solutions" --scheduled-trigger recurrence-interval="Day" synchronization-mode="Incremental" synchronization-time="2018-11-14T04:47:52.9614956Z" --name "Trigger1"
```

### [PowerShell](#tab/powershell)

These steps only apply to snapshot-based sharing.

Run the [New-AzDataShareTrigger](/powershell/module/az.datashare/new-azdatasharetrigger) command to trigger a snapshot:

   ```azurepowershell
   New-AzDataShareTrigger -ResourceGroupName <String> -AccountName <String> -Name <String> -RecurrenceInterval <String> -SynchronizationTime <DateTime>
   ```
---

## View history
This step only applies to snapshot-based sharing. To view history of your snapshots, select **History** tab. Here you'll find history of all snapshots that were generated for the past 30 days.

## Clean up resources

When the resource is no longer needed, go to the Data Share Overview page, and select **Delete** to remove it.

## Next steps
In this tutorial, you learned how to accept and receive an Azure Data Share. To learn more about Azure Data Share concepts, continue to Azure Data Share Terminology.

> [!div class="nextstepaction"]
> [Azure Data Share Concepts](terminology.md)
