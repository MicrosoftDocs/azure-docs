---
title: Create a Hyperscale database
description: Create a Hyperscale database in Azure SQL Database using the Azure portal, Transact-SQL, PowerShell, or the Azure CLI.
services: sql-database
ms.service: sql-database
ms.subservice: deployment-configuration
ms.topic: quickstart
author: LitKnd
ms.author: kendralittle
ms.reviewer: mathoma
ms.date: 2/17/2022
---
# Quickstart: Create a Hyperscale database in Azure SQL Database

In this quickstart, you create a [logical server in Azure](logical-servers.md) and a [Hyperscale](service-tier-hyperscale.md) database in Azure SQL Database using the Azure portal, a PowerShell script, or an Azure CLI script, with the option to create one or more [High Availability (HA) replicas](service-tier-hyperscale-replicas.md#high-availability-replica). If you would like to use an existing logical server in Azure, you can also create a Hyperscale database using Transact-SQL.

## Prerequisites

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- The latest version of either [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli-windows), if you would like to follow the quickstart programmatically. Alternately, you can complete the quickstart in the Azure portal.
- An existing [logical server](logical-servers.md) in Azure is required if you would like to create a Hyperscale database with Transact-SQL. For this approach, you will need to install [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), or the client of your choice to run Transact-SQL commands ([sqlcmd](/sql/tools/sqlcmd-utility), etc.).

## Create a Hyperscale database

This quickstart creates a single database in the [Hyperscale service tier](service-tier-hyperscale.md).

# [Portal](#tab/azure-portal)

To create a single database in the Azure portal, this quickstart starts at the Azure SQL page.

1. Browse to the [Select SQL Deployment option](https://portal.azure.com/#create/Microsoft.AzureSQL) page.
1. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

    :::image type="content" source="media/hyperscale-database-create-quickstart/azure-sql-create-resource.png" alt-text="Screenshot of the Azure SQL page in the Azure portal. The page offers the ability to select a deployment option including creating SQL databases, SQL managed instances, and SQL virtual machines." lightbox="media/hyperscale-database-create-quickstart/azure-sql-create-resource.png":::

1. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the desired Azure **Subscription**.
1. For **Resource group**, select **Create new**, enter *myResourceGroup*, and select **OK**.
1. For **Database name**, enter *mySampleDatabase*.
1. For **Server**, select **Create new**, and fill out the **New server** form with the following values:
   - **Server name**: Enter *mysqlserver*, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. Enter a name such as *mysqlserver12345*, and the portal will let you know if it's available.
   - **Server admin login**: Enter *azureuser*.
   - **Password**: Enter a password that meets requirements, and enter it again in the **Confirm password** field.
   - **Location**: Select a location from the dropdown list.

   Select **OK**.

1. Under **Compute + storage**, select **Configure database**.
1. This quickstart creates a Hyperscale database. For **Service tier**, select **Hyperscale**.

    :::image type="content" source="media/hyperscale-database-create-quickstart/create-database-select-hyperscale-service-tier.png" alt-text="Screenshot of the service and compute tier configuration page for a new database in Azure SQL Database. The Hyperscale service tier has been selected." lightbox="media/hyperscale-database-create-quickstart/create-database-select-hyperscale-service-tier.png":::

1. Under **Compute Hardware**, select **Change configuration**. Review the available hardware configurations and select the most appropriate configuration for your database. For this example, we will select the **Gen5** configuration.
1. Select **OK** to confirm the hardware generation.
1. Under **Save money**, review if you qualify to use Azure Hybrid Benefit for this database. If so, select **Yes** and then confirm you have the required license.
1. Optionally, adjust the **vCores** slider if you would like to increase the number of vCores for your database. For this example, we will select 2 vCores.
1. Adjust the **High-Availability Secondary Replicas** slider to create one [High Availability (HA) replica](service-tier-hyperscale-replicas.md#high-availability-replica).
1. Select **Apply**.
1. Carefully consider the configuration option for **Backup storage redundancy** when creating a Hyperscale database. Storage redundancy can only be specified during the database creation process for Hyperscale databases. You may choose locally redundant (preview), zone-redundant (preview), or geo-redundant storage. The selected storage redundancy option will be used for the lifetime of the database for both [data storage redundancy](hyperscale-architecture.md#azure-storage) and [backup storage redundancy](automated-backups-overview.md#backup-storage-redundancy). Existing databases can migrate to different storage redundancy using [database copy](database-copy.md) or point in time restore.

    :::image type="content" source="media/hyperscale-database-create-quickstart/azure-sql-create-database-basics-tab.png" alt-text="Screenshot of the basics tab in the create database process after the Hyperscale service tier has been selected and configured." lightbox="media/hyperscale-database-create-quickstart/azure-sql-create-database-basics-tab.png":::


1. Select **Next: Networking** at the bottom of the page.
1. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.
1. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.
1. Select **Next: Security** at the bottom of the page.

    :::image type="content" source="media/hyperscale-database-create-quickstart/azure-sql-database-configure-network.png" alt-text="Screenshot of the networking configuration page for a new database in Azure SQL Database that enables you to configure endpoints and optionally add a firewall rule for your client IP address." lightbox="media/hyperscale-database-create-quickstart/azure-sql-database-configure-network.png":::

1. Optionally, enable [Microsoft Defender for SQL](../database/azure-defender-for-sql.md).
1. Select **Next: Additional settings** at the bottom of the page.
1. On the **Additional settings** tab, in the **Data source** section, for **Use existing data**, select **Sample**. This creates an AdventureWorksLT sample database so there's some tables and data to query and experiment with, as opposed to an empty blank database.
1. Select **Review + create** at the bottom of the page:
    
    :::image type="content" source="media/hyperscale-database-create-quickstart/azure-sql-create-database-sample-data.png" alt-text="Screenshot of the 'Additional Settings' screen to create a database in Azure SQL Database allows you to select sample data." lightbox="media/hyperscale-database-create-quickstart/azure-sql-create-database-sample-data.png":::

1. On the **Review + create** page, after reviewing, select **Create**.

# [Azure CLI](#tab/azure-cli)

The Azure CLI code blocks in this section create a resource group, server, single database, and server-level IP firewall rule for access to the server. Make sure to record the generated resource group and server names, so you can manage these resources later.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment-h3.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name.

Before running the sample code, change the `location` as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment. Use the public IP address of the computer you're using to restrict access to the server to only your IP address.

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="4-18":::

```azurecli-interactive
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroupName="myResourceGroup"
tag="create-and-configure-database"
serverName="mysqlserver-$randomIdentifier"
databaseName="mySampleDatabase"
login="azureuser"
password="Pa$$w0rD-$randomIdentifier"
# Specify appropriate IP address values for your environment
# to limit access to the SQL Database server
startIp=0.0.0.0
endIp=0.0.0.0

echo "Using resource group $resourceGroupName with login: $login, password: $password..."

```

### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group in the location specified for the `location` parameter in the prior step:

```azurecli-interactive
echo "Creating $resourceGroupName in $location..."
az group create --name $resourceGroupName --location "$location" --tag $tag

```

### Create a server

Create a [logical server](logical-servers.md) with the [az sql server create](/cli/azure/sql/server) command.

```azurecli-interactive

echo "Creating $serverName in $location..."
az sql server create --name $serverName --resource-group $resourceGroupName --location "$location" --admin-user $login --admin-password $password

```

### Configure a server-based firewall rule

Create a firewall rule with the [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule) command.

```azurecli-interactive
echo "Configuring firewall..."
az sql server firewall-rule create --resource-group $resourceGroupName --server $serverName -n AllowYourIp --start-ip-address $startIp --end-ip-address $endIp

```

### Create a single database

Create a database in the [Hyperscale service tier](service-tier-hyperscale.md) with the [az sql db create](/cli/azure/sql/db) command.

When creating a Hyperscale database, carefully consider the setting for `backup-storage-redundancy`. Storage redundancy can only be specified during the database creation process for Hyperscale databases. You may choose locally redundant (preview), zone-redundant (preview), or geo-redundant storage. The selected storage redundancy option will be used for the lifetime of the database for both [data storage redundancy](hyperscale-architecture.md#azure-storage) and [backup storage redundancy](automated-backups-overview.md#backup-storage-redundancy). Existing databases can migrate to different storage redundancy using [database copy](database-copy.md) or point in time restore. Allowed values for the `backup-storage-redundancy` parameter are: `Local`, `Zone`, `Geo`. Unless explicitly specified, databases will be configured to use geo-redundant backup storage.

Run the following command to create a Hyperscale database populated with AdventureWorksLT sample data. The database uses Gen5 hardware with 2 vCores. Geo-redundant backup storage is used for the database. The command also creates one [High Availability (HA) replica](service-tier-hyperscale-replicas.md#high-availability-replica).

```azurecli
az sql db create \
    --resource-group $resourceGroupName \
    --server $serverName \
    --name $databaseName \3
    --sample-name AdventureWorksLT \
    --edition Hyperscale \
    --compute-model Provisioned \
    --family Gen5 \
    --capacity 2 \
    --backup-storage-redundancy Geo \
    --ha-replicas 1 

```

# [PowerShell](#tab/azure-powershell)

You can create a resource group, server, and single database using Azure PowerShell.

### Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com](https://shell.azure.com).

When Cloud Shell opens, verify that **PowerShell** is selected for your environment. Subsequent sessions will use Azure CLI in a Bash environment, Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the Get-Random cmdlet is used to create the server name.

Before running the sample code, change the `location` as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment. Use the public IP address of the computer you're using to restrict access to the server to only your IP address.

```azurepowershell-interactive
   # Set variables for your server and database
   $resourceGroupName = "myResourceGroup"
   $location = "eastus"
   $adminLogin = "azureuser"
   $password = "Pa$$w0rD-$(Get-Random)"
   $serverName = "mysqlserver-$(Get-Random)"
   $databaseName = "mySampleDatabase"

   # The ip address range that you want to allow to access your server
   $startIp = "0.0.0.0"
   $endIp = "0.0.0.0"

   # Show randomized variables
   Write-host "Resource group name is" $resourceGroupName
   Write-host "Server name is" $serverName
   Write-host "Password is" $password

```

### Create resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
   Write-host "Creating resource group..."
   $resourceGroup = New-AzResourceGroup -Name $resourceGroupName -Location $location -Tag @{Owner="SQLDB-Samples"}
   $resourceGroup

```

### Create a server

Create a server with the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) cmdlet.

```azurepowershell-interactive
  Write-host "Creating primary server..."
   $server = New-AzSqlServer -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -Location $location `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
      -ArgumentList $adminLogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
   $server

```

### Create a firewall rule

Create a server firewall rule with the [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule) cmdlet.

```azurepowershell-interactive
   Write-host "Configuring server firewall rule..."
   $serverFirewallRule = New-AzSqlServerFirewallRule -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -FirewallRuleName "AllowedIPs" -StartIpAddress $startIp -EndIpAddress $endIp
   $serverFirewallRule

```

### Create a single database

Create a single database with the [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet.

When creating a Hyperscale database, carefully consider the setting for `BackupStorageRedundancy`. Storage redundancy can only be specified during the database creation process for Hyperscale databases. You may choose locally redundant (preview), zone-redundant (preview), or geo-redundant storage. The selected storage redundancy option will be used for the lifetime of the database for both [data storage redundancy](hyperscale-architecture.md#azure-storage) and [backup storage redundancy](automated-backups-overview.md#backup-storage-redundancy). Existing databases can migrate to different storage redundancy using [database copy](database-copy.md) or point in time restore. Allowed values for the `BackupStorageRedundancy` parameter are: `Local`, `Zone`, `Geo`. Unless explicitly specified, databases will be configured to use geo-redundant backup storage.

Run the following command to create a Hyperscale database populated with AdventureWorksLT sample data. The database uses Gen5 hardware with 2 vCores. Geo-redundant backup storage is used for the database. The command also creates one [High Availability (HA) replica](service-tier-hyperscale-replicas.md#high-availability-replica).

```azurepowershell-interactive
   Write-host "Creating a gen5 2 vCore Hyperscale database..."
   $database = New-AzSqlDatabase  -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName `
      -Edition Hyperscale `
      -ComputeModel Provisioned `
      -ComputeGeneration Gen5 `
      -VCore 2 `
      -MinimumCapacity 2 `
      -SampleName "AdventureWorksLT" `
      -BackupStorageRedundancy Geo `
      -HighAvailabilityReplicaCount 1
   $database

```

# [Transact-SQL](#tab/t-sql)

To create a Hyperscale database with Transact-SQL, you must first [create or identify connection information for an existing logical server](logical-servers.md) in Azure.

Connect to the master database using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), or the client of your choice to run Transact-SQL commands ([sqlcmd](/sql/tools/sqlcmd-utility), etc.).

When creating a Hyperscale database, carefully consider the setting for `BACKUP_STORAGE_REDUNDANCY`. Storage redundancy can only be specified during the database creation process for Hyperscale databases. You may choose locally redundant (preview), zone-redundant (preview), or geo-redundant storage. The selected storage redundancy option will be used for the lifetime of the database for both [data storage redundancy](hyperscale-architecture.md#azure-storage) and [backup storage redundancy](automated-backups-overview.md#backup-storage-redundancy). Existing databases can migrate to different storage redundancy using [database copy](database-copy.md) or point in time restore. Allowed values for the `BackupStorageRedundancy` parameter are: `LOCAL`, `ZONE`, `GEO`.  Unless explicitly specified, databases will be configured to use geo-redundant backup storage.

Run the following Transact-SQL command to create a new Hyperscale database with Gen 5 hardware, 2 vCores, and geo-redundant backup storage. You must specify both the edition and service objective in the `CREATE DATABASE` statement. Refer to the [resource limits](./resource-limits-vcore-single-databases.md#hyperscale---provisioned-compute---gen4) for a list of valid service objectives, such as `HS_Gen5_2`.

This example code creates an empty database. If you would like to create a database with sample data, use the Azure portal, Azure CLI, or PowerShell examples in this quickstart.

```sql
CREATE DATABASE [myHyperscaleDatabase] 
    (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_2', BACKUP_STORAGE_REDUNDANCY= 'GEO');
GO
```

Refer to [CREATE DATABASE (Transact-SQL)](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current&preserve-view=true) for more parameters and options.

To add one or more [High Availability (HA) replicas](service-tier-hyperscale-replicas.md#high-availability-replica) to your database, use the **Compute and storage** pane for the database in the Azure portal, the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) PowerShell command, or the [az sql db update](/cli/azure/sql/db#az_sql_db_update) Azure CLI command.

---

## Query the database

Once your database is created, you can use the **Query editor (preview)** in the Azure portal to connect to the database and query data. If you prefer, you can alternately query the database by [connecting with Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database), [SQL Server Management Studio (SSMS)](connect-query-ssms.md), or the client of your choice to run Transact-SQL commands ([sqlcmd](/sql/tools/sqlcmd-utility), etc.).

1. In the portal, search for and select **SQL databases**, and then select your database from the list.
1. On the page for your database, select **Query editor (preview)** in the left menu.
1. Enter your server admin login information, and select **OK**.

    :::image type="content" source="media/hyperscale-database-create-quickstart/query-editor-azure-portal-authenticate.png" alt-text="Screenshot of the Query editor (preview) pane in Azure SQL Database gives two options for authentication. In this example, we have filled in Login and Password under SQL server authentication." lightbox="media/hyperscale-database-create-quickstart/query-editor-azure-portal-authenticate.png":::

1. If you created your Hyperscale database from the AdventureWorksLT sample database, enter the following query in the **Query editor** pane.

    ```sql
    SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
    FROM SalesLT.ProductCategory pc
    JOIN SalesLT.Product p
          ON pc.productcategoryid = p.productcategoryid;
    ```

    If you created an empty database using [the Transact-SQL sample code](?tabs=t-sql#create-a-hyperscale-database), enter another example query in the **Query editor** pane, such as the following:

    ```sql
    CREATE TABLE dbo.TestTable(
    	TestTableID int IDENTITY(1,1) NOT NULL,
    	TestTime datetime NOT NULL,
    	TestMessage nvarchar(4000) NOT NULL,
     CONSTRAINT PK_TestTable_TestTableID PRIMARY KEY CLUSTERED (TestTableID ASC)
    ) 
    GO
    
    ALTER TABLE dbo.TestTable ADD CONSTRAINT DF_TestTable_TestTime  DEFAULT (getdate()) FOR TestTime
    GO
    
    INSERT dbo.TestTable (TestMessage)
    VALUES (N'This is a test');
    GO
    
    SELECT TestTableID, TestTime, TestMessage
    FROM dbo.TestTable;
    GO
    ```

1. Select **Run**, and then review the query results in the **Results** pane.
    
    :::image type="content" source="media/hyperscale-database-create-quickstart/query-editor-azure-portal-run-query.png" alt-text="Screenshot of the Query editor (preview) pane in Azure SQL Database after a query has been run against AdventureWorks sample data." lightbox="media/hyperscale-database-create-quickstart/query-editor-azure-portal-run-query.png":::

1. Close the **Query editor** page, and select **OK** when prompted to discard your unsaved edits.

## Clean up resources

Keep the resource group, server, and single database to go on to the next steps, and learn how to connect and query your database with different methods.

When you're finished using these resources, you can delete the resource group you created, which will also delete the server and single database within it.

# [Portal](#tab/azure-portal)

To delete **myResourceGroup** and all its resources using the Azure portal:

1. In the portal, search for and select **Resource groups**, and then select **myResourceGroup** from the list.
1. On the resource group page, select **Delete resource group**.
1. Under **Type the resource group name**, enter *myResourceGroup*, and then select **Delete**.

# [Azure CLI](#tab/azure-cli)

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command - unless you have an ongoing need for these resources. Some of these resources may take a while to create, and to delete.

```azurecli-interactive
az group delete --name $resourceGroup

```

# [PowerShell](#tab/azure-powershell)

To delete the resource group and all its resources, run the following PowerShell cmdlet, using the name of your resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroupName

```

# [Transact-SQL](#tab/t-sql)

This option deletes only the Hyperscale database. It doesn't remove any logical SQL servers or resource groups that you may have created in addition to the database.

To delete a Hyperscale database with Transact-SQL, connect to the master database using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), or the client of your choice to run Transact-SQL commands ([sqlcmd](/sql/tools/sqlcmd-utility), etc.).

Run the following Transact-SQL command to drop the database:

```sql
DROP DATABASE [myHyperscaleDatabase];
GO
```

---

## Next steps

[Connect and query](connect-query-content-reference-guide.md) your database using different tools and languages:
- [Connect and query using SQL Server Management Studio](connect-query-ssms.md)
- [Connect and query using Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)

Learn more about Hyperscale databases in the following articles:

- [Hyperscale service tier](service-tier-hyperscale.md)
- [Azure SQL Database Hyperscale FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml)
- [Hyperscale secondary replicas](service-tier-hyperscale-replicas.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml)
