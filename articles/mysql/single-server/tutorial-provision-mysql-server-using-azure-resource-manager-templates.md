---
title: 'Tutorial: Create Azure Database for MySQL - Azure Resource Manager template'
description: This tutorial explains how to provision and automate Azure Database for MySQL server deployments using Azure Resource Manager template.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: tutorial
ms.date: 06/20/2022
ms.custom: mvc, devx-track-arm-template
---

# Tutorial: Provision an Azure Database for MySQL server using Azure Resource Manager template

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

The [Azure Database for MySQL REST API](/rest/api/mysql/) enables DevOps engineers to automate and integrate provisioning, configuration, and operations of managed MySQL servers and databases in Azure.  The API allows the creation, enumeration, management, and deletion of MySQL servers and databases on the Azure Database for MySQL service.

Azure Resource Manager leverages the underlying REST API to declare and program the Azure resources required for deployments at scale, aligning with infrastructure as a code concept. The template parameterizes the Azure resource name, SKU, network, firewall configuration, and settings, allowing it to be created one time and used multiple times.  Azure Resource Manager templates can be easily created using [Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md) or [Visual Studio Code](../../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md?tabs=CLI). They enable application packaging, standardization, and deployment automation, which can be integrated in the DevOps CI/CD pipeline.  For instance, if you are looking to quickly deploy a Web App with Azure Database for MySQL backend, you can perform the end-to-end deployment using this [QuickStart template](https://azure.microsoft.com/resources/templates/webapp-managed-mysql/) from the GitHub gallery.

In this tutorial, you use Azure Resource Manager template and other utilities to learn how to:

> [!div class="checklist"]
> * Create an Azure Database for MySQL server with VNet Service Endpoint using Azure Resource Manager template
> * Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> * Load sample data
> * Query data
> * Update data

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Create an Azure Database for MySQL server with VNet Service Endpoint using Azure Resource Manager template

To get the JSON template reference for an Azure Database for MySQL server, go to [Microsoft.DBforMySQL servers](/azure/templates/microsoft.dbformysql/servers) template reference. Below is the sample JSON template that can be used to create a new server running Azure Database for MySQL with VNet Service Endpoint.
```json
{
  "apiVersion": "2017-12-01",
  "type": "Microsoft.DBforMySQL/servers",
  "name": "string",
  "location": "string",
  "tags": "string",
  "properties": {
    "version": "string",
    "sslEnforcement": "string",
    "administratorLogin": "string",
    "administratorLoginPassword": "string",
    "storageProfile": {
      "storageMB": "string",
      "backupRetentionDays": "string",
      "geoRedundantBackup": "string"
    }
  },
  "sku": {
    "name": "string",
    "tier": "string",
    "capacity": "string",
    "family": "string"
  },
  "resources": [
    {
      "name": "AllowSubnet",
      "type": "virtualNetworkRules",
      "apiVersion": "2017-12-01",
      "properties": {
        "virtualNetworkSubnetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnetName'))]",
        "ignoreMissingVnetServiceEndpoint": true
      },
      "dependsOn": [
        "[concat('Microsoft.DBforMySQL/servers/', parameters('serverName'))]"
      ]
    }
  ]
}
```
In this request, the values that need to be customized are:
+ `name` - Specify the name of your MySQL Server (without domain name).
+ `location` - Specify a valid Azure data center region for your MySQL Server. For example, westus2.
+ `properties/version` - Specify the MySQL server version to deploy. For example, 5.6 or 5.7.
+ `properties/administratorLogin` - Specify the MySQL admin login for the server. The admin sign-in name cannot be azure_superuser, admin, administrator, root, guest, or public.
+ `properties/administratorLoginPassword` - Specify the password for the MySQL admin user specified above.
+ `properties/sslEnforcement` - Specify Enabled/Disabled to enable/disable sslEnforcement.
+ `storageProfile/storageMB` - Specify the max provisioned storage size required for the server in megabytes. For example, 5120.
+ `storageProfile/backupRetentionDays` - Specify the desired backup retention period in days. For example, 7. 
+ `storageProfile/geoRedundantBackup` - Specify Enabled/Disabled depending on Geo-DR requirements.
+ `sku/tier` - Specify Basic, GeneralPurpose, or MemoryOptimized tier for deployment.
+ `sku/capacity` - Specify the vCore capacity. Possible values include 2, 4, 8, 16, 32 or 64.
+ `sku/family` - Specify Gen5 to choose hardware generation for server deployment.
+ `sku/name` - Specify TierPrefix_family_capacity. For example B_Gen5_1, GP_Gen5_16, MO_Gen5_32. See the [pricing tiers](./concepts-pricing-tiers.md) documentation to understand the valid values per region and per tier.
+ `resources/properties/virtualNetworkSubnetId` - Specify the Azure identifier of the subnet in VNet where Azure MySQL server should be placed. 
+ `tags(optional)` - Specify optional tags are key value pairs that you would use to categorize the resources for billing etc.

If you are looking to build an Azure Resource Manager template to automate Azure Database for MySQL deployments for your organization, the recommendation would be to start from the sample [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dbformysql/managed-mysql-with-vnet/azuredeploy.json) in Azure Quickstart GitHub Gallery first and build on top of it. 

If you are new to Azure Resource Manager templates and would like to try it, you can start by following these steps:
+ Clone or download the Sample [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.dbformysql/managed-mysql-with-vnet/azuredeploy.json) from Azure Quickstart gallery.  
+ Modify the azuredeploy.parameters.json to update the parameter values based on your preference and save the file. 
+ Use Azure CLI to create the Azure MySQL server using the following commands

You may use the Azure Cloud Shell in the browser, or Install Azure CLI on your own computer to run the code blocks in this tutorial.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

```azurecli-interactive
az login
az group create -n ExampleResourceGroup  -l "West US2"
az deployment group create -g $ ExampleResourceGroup   --template-file $ {templateloc} --parameters $ {parametersloc}
```

## Get the connection information
To connect to your server, you need to provide host information and access credentials.
```azurecli-interactive
az mysql server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
```json
{
  "administratorLogin": "myadmin",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "mydemoserver.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMySQL/servers/mydemoserver",
  "location": "westus2",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
 "sku": {
    "capacity": 2,
    "family": "Gen5",
    "name": "GP_Gen5_2",
    "size": null,
    "tier": "GeneralPurpose"
  },
  "sslEnforcement": "Enabled",
  "storageProfile": {
    "backupRetentionDays": 7,
    "geoRedundantBackup": "Disabled",
    "storageMb": 5120
  },
  "tags": null,
  "type": "Microsoft.DBforMySQL/servers",
  "userVisibleState": "Ready",
  "version": "5.7"
}
```

## Connect to the server using mysql
Use the [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to establish a connection to your Azure Database for MySQL server. In this example, the command is:
```cmd
mysql -h mydemoserver.database.windows.net -u myadmin@mydemoserver -p
```

## Create a blank database
Once you're connected to the server, create a blank database.
```sql
mysql> CREATE DATABASE mysampledb;
```

At the prompt, run the following command to switch the connection to this newly created database:
```sql
mysql> USE mysampledb;
```

## Create tables in the database
Now that you know how to connect to the Azure Database for MySQL database, complete some basic tasks.

First, create a table and load it with some data. Let's create a table that stores inventory information.
```sql
CREATE TABLE inventory (
  id serial PRIMARY KEY, 
  name VARCHAR(50), 
  quantity INTEGER
);
```

## Load data into the tables
Now that you have a table, insert some data into it. At the open command prompt window, run the following query to insert some rows of data.
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

Now you have two rows of sample data into the table you created earlier.

## Query and update the data in the tables
Execute the following query to retrieve information from the database table.
```sql
SELECT * FROM inventory;
```

You can also update the data in the tables.
```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

The row gets updated accordingly when you retrieve data.
```sql
SELECT * FROM inventory;
```

## Clean up resources

When it's no longer needed, delete the resource group, which deletes the resources in the resource group.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.

2. In the resource group list, choose the name of your resource group.

3. In the **Overview** page of your resource group, select **Delete resource group**.

4. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

---

## Next steps
In this tutorial you learned to:
> [!div class="checklist"]
> * Create an Azure Database for MySQL server with VNet Service Endpoint using Azure Resource Manager template
> * Use the mysql command-line tool to create a database
> * Load sample data
> * Query data
> * Update data

> [!div class="nextstepaction"]
> [How to connect applications to Azure Database for MySQL](./how-to-connection-string.md)
