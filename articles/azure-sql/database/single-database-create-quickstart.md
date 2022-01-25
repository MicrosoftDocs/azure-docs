---
title: Create a single database
description: Create a single database in Azure SQL Database using the Azure portal, PowerShell, or the Azure CLI.
services: sql-database
ms.service: sql-database
ms.subservice: deployment-configuration
ms.custom: contperf-fy21q1, devx-track-azurecli, devx-track-azurepowershell, mode-ui
ms.topic: quickstart
author: LitKnd
ms.author: kendralittle
ms.reviewer: mathoma
ms.date: 01/17/2022
---
# Quickstart: Create an Azure SQL Database single database

In this quickstart, you create a [single database](single-database-overview.md) in Azure SQL Database using either the Azure portal, a PowerShell script, or an Azure CLI script. You then query the database using **Query editor** in the Azure portal.

## Prerequisites

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- The latest version of either [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli-windows).

## Create a single database

This quickstart creates a single database in the [serverless compute tier](serverless-tier-overview.md).

# [Portal](#tab/azure-portal)

To create a single database in the Azure portal, this quickstart starts at the Azure SQL page.

1. Browse to the [Select SQL Deployment option](https://portal.azure.com/#create/Microsoft.AzureSQL) page.
1. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

   ![Add to Azure SQL](./media/single-database-create-quickstart/select-deployment.png)

1. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the desired Azure **Subscription**.
1. For **Resource group**, select **Create new**, enter *myResourceGroup*, and select **OK**.
1. For **Database name**, enter *mySampleDatabase*.
1. For **Server**, select **Create new**, and fill out the **New server** form with the following values:
   - **Server name**: Enter *mysqlserver*, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. So enter something like mysqlserver12345, and the portal lets you know if it's available or not.
   - **Server admin login**: Enter *azureuser*.
   - **Password**: Enter a password that meets requirements, and enter it again in the **Confirm password** field.
   - **Location**: Select a location from the dropdown list.

   Select **OK**.

1. Leave **Want to use SQL elastic pool** set to **No**.
1. Under **Compute + storage**, select **Configure database**.
1. This quickstart uses a serverless database, so select **Serverless**, and then select **Apply**.

      ![configure serverless database](./media/single-database-create-quickstart/configure-database.png)

1. Select **Next: Networking** at the bottom of the page.

   ![New SQL database - Basic tab](./media/single-database-create-quickstart/new-sql-database-basics.png)

1. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.
1. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.
1. Select **Next: Additional settings** at the bottom of the page.

   ![Networking tab](./media/single-database-create-quickstart/networking.png)
  
1. On the **Additional settings** tab, in the **Data source** section, for **Use existing data**, select **Sample**. This creates an AdventureWorksLT sample database so there's some tables and data to query and experiment with, as opposed to an empty blank database.
1. Optionally, enable [Microsoft Defender for SQL](../database/azure-defender-for-sql.md).
1. Optionally, set the [maintenance window](../database/maintenance-window.md) so planned maintenance is performed at the best time for your database.
1. Select **Review + create** at the bottom of the page:

   ![Additional settings tab](./media/single-database-create-quickstart/additional-settings.png)

1. On the **Review + create** page, after reviewing, select **Create**.

# [Azure CLI](#tab/azure-cli)

You can create an Azure resource group, server, and single database using the Azure command-line interface (Azure CLI).

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name.

Change the location as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment. Use the public IP address of the computer you're using to restrict access to the server to only your IP address.

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="4-18":::

### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="19-21":::

### Create a server

Create a server with the [az sql server create](/cli/azure/sql/server) command.

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="22-24":::

### Configure a server-based firewall rule

Create a firewall rule with the [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule) command.

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="25-27":::

### Create a single database

Create a database with the [az sql db create](/cli/azure/sql/db) command in the [serverless compute tier](serverless-tier-overview.md).

```azurecli
az sql db create \
    --resource-group $resourceGroup \
    --server $server \
    --name $database \
    --sample-name AdventureWorksLT \
    --edition GeneralPurpose \
    --compute-model Serverless \
    --family Gen5 \
    --capacity 2
```

# [Azure CLI (sql up)](#tab/azure-cli-sql-up)

You can create an Azure resource group, server, and single database using the Azure command-line interface (Azure CLI). If you don't want to use the Azure Cloud Shell, [install Azure CLI](/cli/azure/install-azure-cli) on your computer.

The following Azure CLI code blocks create a resource group, server, single database, and server-level IP firewall rule for access to the server. Make sure to record the generated resource group and server names, so you can manage these resources later.

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name.

Change the location as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment.

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="4-18":::

> [!NOTE]
> [az sql up](/cli/azure/sql#az_sql_up) is currently in preview and does not currently support the serverless compute tier. Also, the use of non-alphabetic and non-numeric characters in the database name are not currently supported.

### Create a database and resources

The [az sql up](/cli/azure/sql#az_sql_up) command simplifies the database creation process. With it, you can create a database and all of its associated resources with a single command. This includes the resource group, server name, server location, database name, and login information. The database is created with a default pricing tier of General Purpose, Provisioned, Gen5, 2 vCores.

This command creates and configures a [logical server](logical-servers.md) for Azure SQL Database for immediate use. For more granular resource control during database creation, use the standard Azure CLI commands in this article.

> [!NOTE]
> When running the `az sql up` command for the first time, Azure CLI prompts you to install the `db-up` extension. This extension is currently in preview. Accept the installation to continue. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

1. Run the `az sql up` command. If any required parameters aren't used, like `--server-name`, that resource is created with a random name and login information assigned to it.

    ```azurecli
    az sql up \
        --resource-group $resourceGroup \
        --location $location \
        --server-name $server \
        --database-name $database \\
        --admin-user $login \
        --admin-password $password

    ```

2. A server firewall rule is automatically created. If the server declines your IP address, create a new firewall rule using the `az sql server firewall-rule create` command and specifying appropriate start and end IP addresses.

    ```azurecli
    startIp=0.0.0.0
    endIp=0.0.0.0
    az sql server firewall-rule create \
        --resource-group $resourceGroup \
        --server $server \
        -n AllowYourIp \
        --start-ip-address $startIp \
        --end-ip-address $endIp

    ```

3. All required resources are created, and the database is ready for queries.

# [PowerShell](#tab/azure-powershell)

You can create a resource group, server, and single database using Windows PowerShell.

### Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com](https://shell.azure.com).

When Cloud Shell opens, verify that **PowerShell** is selected for your environment. Subsequent sessions will use Azure CLI in a Bash environment, Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

### Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the Get-Random cmdlet is used to create the server name. Replace the 0.0.0.0 values in the ip address range to match your specific environment.

```azurepowershell-interactive
   # Set variables for your server and database
   $resourceGroupName = "myResourceGroup"
   $location = "eastus"
   $adminLogin = "azureuser"
   $password = "Azure1234567!"
   $serverName = "mysqlserver-$(Get-Random)"
   $databaseName = "mySampleDatabase"

   # The ip address range that you want to allow to access your server
   $startIp = "0.0.0.0"
   $endIp = "0.0.0.0"

   # Show randomized variables
   Write-host "Resource group name is" $resourceGroupName
   Write-host "Server name is" $serverName


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

### Create a single database with PowerShell

Create a single database with the [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet.

```azurepowershell-interactive
   Write-host "Creating a gen5 2 vCore serverless database..."
   $database = New-AzSqlDatabase  -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName `
      -Edition GeneralPurpose `
      -ComputeModel Serverless `
      -ComputeGeneration Gen5 `
      -VCore 2 `
      -MinimumCapacity 2 `
      -SampleName "AdventureWorksLT"
   $database
```

---

## Query the database

Once your database is created, you can use the **Query editor (preview)** in the Azure portal to connect to the database and query data.

1. In the portal, search for and select **SQL databases**, and then select your database from the list.
1. On the page for your database, select **Query editor (preview)** in the left menu.
1. Enter your server admin login information, and select **OK**.

   ![Sign in to Query editor](./media/single-database-create-quickstart/query-editor-login.png)

1. Enter the following query in the **Query editor** pane.

   ```sql
   SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
   FROM SalesLT.ProductCategory pc
   JOIN SalesLT.Product p
   ON pc.productcategoryid = p.productcategoryid;
   ```

1. Select **Run**, and then review the query results in the **Results** pane.

   ![Query editor results](./media/single-database-create-quickstart/query-editor-results.png)

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

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command - unless you have an ongoing need for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

# [Azure CLI (sql up)](#tab/azure-cli-sql-up)

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

# [PowerShell](#tab/azure-powershell)

To delete the resource group and all its resources, run the following PowerShell cmdlet, using the name of your resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

[Connect and query](connect-query-content-reference-guide.md) your database using different tools and languages:
> [!div class="nextstepaction"]
> [Connect and query using SQL Server Management Studio](connect-query-ssms.md)
>
> [Connect and query using Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
