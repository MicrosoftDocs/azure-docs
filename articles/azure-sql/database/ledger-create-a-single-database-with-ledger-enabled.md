---
title: Create a single database with ledger enabled
description: Create a single database in Azure SQL Database with ledger enabled by using the Azure portal.
ms.service: sql-database
ms.subservice: security
ms.topic: quickstart
author: VanMSFT
ms.author: vanto
ms.reviewer: kendralittle, mathoma
ms.date: "01/20/2022"
ms.custom: mode-other
---

# Quickstart: Create a database in Azure SQL Database with ledger enabled

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview.

In this quickstart, you create a [ledger database](ledger-overview.md#ledger-database) in Azure SQL Database and configure [automatic digest storage with Azure Blob Storage](ledger-digest-management-and-database-verification.md#automatic-generation-and-storage-of-database-digests) by using the Azure portal. For more information about ledger, see [Azure SQL Database ledger](ledger-overview.md).

## Prerequisite

You need an active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

## Create a ledger database and configure digest storage

Create a single ledger database in the [serverless compute tier](serverless-tier-overview.md), and configure uploading ledger digests to an Azure Storage account.

# [Portal](#tab/azure-portal)

To create a single database in the Azure portal, this quickstart starts at the Azure SQL page.

1. Browse to the [Select SQL Deployment option](https://portal.azure.com/#create/Microsoft.AzureSQL) page.

1. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

   ![Screenshot that shows adding to Azure SQL.](./media/single-database-create-quickstart/select-deployment.png)

1. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the Azure subscription you want to use.

1. For **Resource group**, select **Create new**, enter **myResourceGroup**, and select **OK**.

1. For **Database name**, enter **demo**.

1. For **Server**, select **Create new**. Fill out the **New server** form with the following values:
   - **Server name**: Enter **mysqlserver**, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. Enter something like **mysqlserver12345**, and the portal lets you know if it's available or not.
   - **Server admin login**: Enter **azureuser**.
   - **Password**: Enter a password that meets requirements. Enter it again in the **Confirm password** box.
   - **Location**: Select a location from the dropdown list.
   - **Allow Azure services to access this server**: Select this option to enable access to digest storage.
   
   Select **OK**.
   
1. Leave **Want to use SQL elastic pool** set to **No**.

1. Under **Compute + storage**, select **Configure database**.

1. This quickstart uses a serverless database, so select **Serverless**, and then select **Apply**. 

      ![Screenshot that shows configuring a serverless database.](./media/single-database-create-quickstart/configure-database.png)

1. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.
1. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.
1. Select **Next: Security** at the bottom of the page.

   :::image type="content" source="media/ledger/ledger-create-database-networking-tab.png" alt-text="Screenshot that shows the Networking tab of the Create SQL Database screen in the Azure portal.":::

1. On the **Security** tab, in the **Ledger** section, select the **Configure ledger** option.

    :::image type="content" source="media/ledger/ledger-configure-ledger-security-tab.png" alt-text="Screenshot that shows configuring a ledger on the Security tab of the Azure portal.":::

1. On the **Configure ledger** pane, in the **Ledger** section, select the **Enable for all future tables in this database** checkbox. This setting ensures that all future tables in the database will be ledger tables. For this reason, all data in the database will show any evidence of tampering. By default, new tables will be created as updatable ledger tables, even if you don't specify `LEDGER = ON` in [CREATE TABLE](/sql/t-sql/statements/create-table-transact-sql). You can also leave this option unselected. You're then required to enable ledger functionality on a per-table basis when you create new tables by using Transact-SQL.

1. In the **Digest Storage** section, **Enable automatic digest storage** is automatically selected. Then, a new Azure Storage account and container where your digests are stored is created.

1. Select **Apply**.

    :::image type="content" source="media/ledger/ledger-configure-ledger-pane.png" alt-text="Screenshot that shows the Configure ledger (preview) pane in the Azure portal.":::

1. Select **Review + create** at the bottom of the page.

    :::image type="content" source="media/ledger/ledger-review-security-tab.png" alt-text="Screenshot that shows reviewing and creating a ledger database on the Security tab of the Azure portal.":::

1. On the **Review + create** page, after you review, select **Create**.

# [The Azure CLI](#tab/azure-cli)

You'll create a resource group, a logical database server, a single ledger database, and configure uploading ledger digests using The Azure CLI.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com](https://shell.azure.com). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names and storage account names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name and the storage account name. 

The resource name must be unique in your subscription. Replace `<your resource group name>` with a unique name, and `<your subscription ID>` with your Subscription ID.

Replace the 0.0.0.0 values in the ip address range to match your specific environment.

Replace **westeurope** with your preferred Azure region name.

```azurecli-interactive
resourceGroupName="<your resource group name>"
location="westeurope"
serverName="mysqlserver"-$RANDOM
databaseName="myLedgerDatabase"
storageAccountName="mystorage"$RANDOM
subscription="<your subscription ID>"
adminLogin=azureuser
adminPassword=Azure1234567!
serverResourceId="/subscriptions/$subscription/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName"

# The ip address range that you want to allow to access your server
startIP=0.0.0.0
endIP=0.0.0.0

# Set variables for your digest storage location
storageAccountName="mystorage"$RANDOM
storageAccountURL1="https://"
storageAccountURL3=".blob.core.windows.net"
storageAccountURL=$storageAccountURL1$storageAccountName$storageAccountURL3
storageAccountResourceId="/subscriptions/$subscription/resourceGroups/$resourceGroupName/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

# Show resource names
echo "Resource group name is" $resourceGroupName
echo "Server name is" $serverName
echo "Database name is" $databaseName
echo "Storage account name is" $storageAccountName
```

### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

```azurecli-interactive
az group create --name $resourceGroupName --location $location
```

### Create a server with a managed identity

Create a server with the [az sql server create](/cli/azure/sql/server) command. The command creates the server with a managed identity assigned.

```azurecli-interactive
az sql server create \
    --name $serverName \
    --resource-group $resourceGroupName \
    --location $location \
    --admin-user $adminLogin \
    --admin-password $adminPassword \
    --assign-identity
```

This command stores the ID in a variable, which will later be used to grant the server permissions to upload ledger digests.

```azurecli-interactive
# Retrieves the assigned identity to be used when granting the server access to the storage account
principalId=`az sql server show \
    --name $serverName \
    --resource-group $resourceGroupName \
    --query identity.principalId \
    --output tsv`
```

### Configure a firewall rule for the server

Create a firewall rule with the [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule) command.

```azurecli-interactive
az sql server firewall-rule create \
    --resource-group $resourceGroupName \
    --server $serverName \
    -n AllowYourIp \
    --start-ip-address $startIP \
    --end-ip-address $endIP
```

### Create a single ledger database 

Create a ledger database with the [az sql db create](/cli/azure/sql/db) command. The following command creates a serverless database with ledger enabled.

```azurecli-interactive
az sql db create \
    --resource-group $resourceGroupName \
    --server $serverName \
    --name $databaseName \
    --edition GeneralPurpose \
    --family Gen5 \
    --capacity 2 \
    --compute-model Serverless \
    --ledger-on
```

### Create a storage account 

Create a storage account to store ledger digests with the [az storage account create](/cli/azure/sql/db) command. 

```azurecli-interactive
az storage account create \
    --name $storageAccountName \
    --resource-group $resourceGroupName \
    --location $location \
    --sku Standard_GRS \
    --kind StorageV2
```

### Grant the server permissions to write ledger digests

Assign the managed identity of the server to the [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role with the [az role assignment create](/cli/azure/sql/db) command.  This gives the SQL server the appropriate permissions to publish database digests to the storage account.

```azurecli-interactive
az role assignment create \
    --assignee-object-id $principalId \
    --assignee-principal-type "ServicePrincipal" \
    --role "Storage Blob Data Contributor" \
    --scope $storageAccountResourceId
```

### Enable database digest uploads

Update the database to start uploading ledger digests to the storage account by using the [az sql db ledger-digest-uploads enable](/cli/azure/sql/db) command.

```azurecli-interactive
az sql db ledger-digest-uploads enable \
    --name $databaseName \
    --resource-group $resourceGroupName \
    --server $serverName \
    --endpoint $storageAccountURL
```

### Configure a time-based retention policy

To  protect the digests from being deleted or updated, it is recommended you configure a time-based retention policy on the **sqldbledgerdigests** container by using the [az storage container immutability-policy create](/cli/azure/sql/db) and [az storage container immutability-policy lock](/cli/azure/sql/db) commands. The policy must allow protected append blobs writes. This ensures the database server can add blocks containing new digests to an existing blob, while deleting or updating the digests is disabled for the specified immutability period.

> [!IMPORTANT]
> The below example uses the immutability period value of 1 day. In a production environment, you should use a much larger value. 

> [!NOTE]
> Once database digests begin to be uploaded to the storage account, you will not be able to delete the storage account until the immutability policy expires.  Setting the immutability policy can be skipped if you plan to clean-up resources immediatly after this QuickStart.

For more information about time-based retention policy for containers, see [Configure immutability policies for containers](../../storage/blobs/immutable-policy-configure-container-scope.md).

```azurecli-interactive
az storage container immutability-policy create \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --container-name sqldbledgerdigests \
    --period 1 \
    --allow-protected-append-writes true
```

```azurecli-interactive
# Retrieves the etag value of the policy to be used when the policy is locked
etag=`az storage container immutability-policy show \
    --account-name $storageAccountName \
    --container-name sqldbledgerdigests \
    --query etag \
    --output tsv`
etag="${etag/$'\r'/}"
```

```azurecli-interactive
az storage container immutability-policy lock \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --container-name sqldbledgerdigests \
    --if-match $etag
```

# [PowerShell](#tab/azure-powershell)

You'll create a resource group, a logical database server, a single ledger database, and configure uploading ledger digests using Windows PowerShell.

### Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com](https://shell.azure.com). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names and storage account names need to be globally unique across all of Azure so the Get-Random cmdlet is used to create the server name and the storage account name. 

The resource name must be unique in your subscription. Replace `<your resource group name>` with a unique name.

Replace the 0.0.0.0 values in the ip address range to match your specific environment.

Replace **westeurope** with your preferred Azure region name.

```azurepowershell-interactive
# Set variables for your server and database
$resourceGroupName = "<your resource group name>"
$location = "westeurope"
$serverName = "mysqlserver-$(Get-Random)"
$databaseName = "myLedgerDatabase"
$storageAccountName = "mystorage$(Get-Random)"

# The ip address range that you want to allow to access your server
$startIP = "0.0.0.0"
$endIP = "0.0.0.0"

# Show resource names
Write-host "Resource group name is" $resourceGroupName
Write-host "Server name is" $serverName
Write-host "Storage account name is" $storageAccountName
```

### Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
Write-host "Creating resource group..."
$resourceGroup = New-AzResourceGroup `
    -Name $resourceGroupName `
    -Location $location
$resourceGroup
```

### Create a server

Create a server with the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) cmdlet. 

The cmdlet creates the server with a managed identity assigned, which you will need later to grant the server permissions to upload ledger digests.

When prompted, enter your SQL administrator username and a password. 

```azurepowershell-interactive
Write-host "Creating primary server..."
$server = New-AzSqlServer `
    -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -Location $location `
    -AssignIdentity `
    -SqlAdministratorCredentials (Get-Credential)
$server
```

### Create a firewall rule

Create a server firewall rule with the [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule) cmdlet.

```azurepowershell-interactive
Write-host "Configuring server firewall rule..."
$serverFirewallRule = New-AzSqlServerFirewallRule -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -FirewallRuleName "AllowedIPs" -StartIpAddress $startIP -EndIpAddress $endIP
$serverFirewallRule
```

### Create a single ledger database

Create a single ledger database with the [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet.

The below example creates a serverless database.

```azurepowershell-interactive
Write-host "Creating a gen5 2 vCore serverless ledger database..."
$database = New-AzSqlDatabase  -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -DatabaseName $databaseName `
    -Edition GeneralPurpose `
    -ComputeModel Serverless `
    -ComputeGeneration Gen5 `
    -VCore 2 `
    -MinimumCapacity 2 `
    -EnableLedger
$database
```

### Create a storage account

Create a storage account to store ledger digests with the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet.

```azurepowershell-interactive
Write-host "Creating a storage account for ledger digests..."
$storage = New-AzStorageAccount -ResourceGroupName $resourceGroupName `
   -Name $storageAccountName `
   -Location $location `
   -SkuName Standard_RAGRS `
   -Kind StorageV2 `
   -AccessTier Hot
$storage
```

### Grant the server permissions to write ledger digests

Assign the managed identity of the server to the [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role with the [New-AzRoleAssignment](/powershell/module/az.Resources/New-azRoleAssignment) cmdlet. This gives the SQL server the appropriate permissions to publish database digests to the storage account.

```azurepowershell-interactive
Write-host "Granting the server access to the storage account..."
$assignment = New-AzRoleAssignment `
    -ObjectId $server.Identity.PrincipalId `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -ResourceGroupName $resourceGroupName `
    -ResourceType "Microsoft.Storage/storageAccounts" `
    -ResourceName $storageAccountName  
$assignment
```

### Enable database digest uploads

Update the database to start uploading ledger digests to the storage account, by using the [Enable-AzSqlDatabaseLedgerDigestUpload](/powershell/module/az.sql/enable-azsqldatabaseledgerdigestupload) cmdlet. The database server will create a new container, named **sqldbledgerdigests**, within the storage account and it will start writing ledger digests to the container.

```azurepowershell-interactive
Write-host "Enabling ledger digest upload..." 
$ledgerDigestUploadConfig = Enable-AzSqlDatabaseLedgerDigestUpload `
     -ResourceGroupName $resourceGroupName `
     -ServerName $serverName `
     -DatabaseName $databaseName `
     -Endpoint $storage.PrimaryEndpoints.Blob
$ledgerDigestUploadConfig
```

### Configure a time-based retention policy

To  protect the digests from being deleted or updated, it is recommended you configure a time-based retention policy on the **sqldbledgerdigests** container by using the [Set-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/set-azrmstoragecontainerimmutabilitypolicy) and [Lock-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/lock-azrmstoragecontainerimmutabilitypolicy) cmdlets. The policy must allow protected append blobs writes. This ensures the database server can add blocks containing new digests to an existing blob, while deleting or updating the digests is disabled for the specified immutability period.

> [!IMPORTANT]
> The below example uses the immutability period value of 1 day. In a production environment, you should use a much larger value. 

> [!NOTE]
> You will not be able to delete the container or the storage account during the specified immutability period.

For more information about time-based retention policy for containers, see [Configure immutability policies for containers](../../storage/blobs/immutable-policy-configure-container-scope.md).

```azurepowershell-interactive
Write-host "Configuring a time-based retention policy..." 
$immutabilityPerdiod = 1
$containerName = "sqldbledgerdigests"
$policy = Set-AzRmStorageContainerImmutabilityPolicy `
   -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -ContainerName $containerName `
    -AllowProtectedAppendWrite $true `
    -ImmutabilityPeriod $immutabilityPerdiod

Lock-AzRmStorageContainerImmutabilityPolicy `
   -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -ContainerName $containerName `
    -Etag $policy.Etag
```

---

## Clean up resources

Keep the resource group, server, and single database for the next steps. You'll learn how to use the ledger feature of your database with different methods.

When you're finished using these resources, delete the resource group you created. This action also deletes the server and single database within it, and the storage account. 

> [!NOTE]
> If you've configured and locked a time-based retention policy on the container, you need to wait until the specified immutability period ends  before you can delete the storage account. 

# [Portal](#tab/azure-portal)

To delete **myResourceGroup** and all its resources by using the Azure portal:

1. In the portal, search for and select **Resource groups**. Then select **myResourceGroup** from the list.
1. On the resource group page, select **Delete resource group**.
1. Under **Type the resource group name**, enter **myResourceGroup**, and then select **Delete**.

# [The Azure CLI](#tab/azure-cli)

To delete the resource group and all its resources, run the following Azure CLI cmdlet, using the name of your resource group:

```azurecli-interactive
az group delete -n resourceGroupName
```

# [PowerShell](#tab/azure-powershell)

To delete the resource group and all its resources, run the following PowerShell cmdlet, using the name of your resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

Connect and query your database by using different tools and languages:

- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md) 
