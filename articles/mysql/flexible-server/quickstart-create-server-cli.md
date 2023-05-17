---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for MySQL - Flexible Server'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL - Flexible Server in an Azure resource group.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.devlang: azurecli
ms.custom: mvc, devx-track-azurecli, mode-api
ms.date: 9/21/2020
---

# Quickstart: Create an Azure Database for MySQL - Flexible Server using Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for MySQL - Flexible Server in five minutes. 

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]


## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account#az-account-set) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli-interactive
az account set --subscription <subscription id>
```

## Create a flexible server

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) using the `az group create` command and then create your MySQL flexible server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `eastus2` location.

```azurecli-interactive
az group create --name myresourcegroup --location eastus2
```

Create a flexible server with the `az mysql flexible-server create` command. A server can contain multiple databases. The following command creates a server using service defaults and values from your Azure CLI's local context:

```azurecli-interactive
az mysql flexible-server create
```

The server created has the below attributes:
- Auto-generated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group
- Service defaults for remaining server configurations: compute tier (Burstable), compute size/SKU (B1MS), backup retention period (7 days), and MySQL version (5.7)
- The default connectivity method is Private access (VNet Integration) with an auto-generated virtual network and subnet

> [!NOTE]
> The connectivity method cannot be changed after creating the server. For example, if you selected *Private access (VNet Integration)* during create then you cannot change to *Public access (allowed IP addresses)* after create. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking.md).

If you'd like to change any defaults, please refer to the Azure CLI [reference documentation](/cli/azure/mysql/flexible-server) for the complete list of configurable CLI parameters.

Below is some sample output:

```json
Creating Resource Group 'groupXXXXXXXXXX'...
Creating new vnet "serverXXXXXXXXXVNET" in resource group "groupXXXXXXXXXX"...
Creating new subnet "serverXXXXXXXXXSubnet" in resource group "groupXXXXXXXXXX" and delegating it to "Microsoft.DBforMySQL/flexibleServers"...
Creating MySQL Server 'serverXXXXXXXXX' in group 'groupXXXXXXXXXX'...
Your server 'serverXXXXXXXXX' is using sku 'Standard_B1ms' (Paid Tier). Please refer to https://aka.ms/mysql-pricing for pricing details
Creating MySQL database 'flexibleserverdb'...
Make a note of your password. If you forget, you would have to reset your password with 'az mysql flexible-server update -n serverXXXXXXXXX -g groupXXXXXXXXXX -p <new-password>'.
{
  "connectionString": "server=serverXXXXXXXXX.mysql.database.azure.com;database=flexibleserverdb;uid=secureusername;pwd=securepasswordstring",
  "databaseName": "flexibleserverdb",
  "host": "serverXXXXXXXXX.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/groupXXXXXXXXXX/providers/Microsoft.DBforMySQL/flexibleServers/serverXXXXXXXXX",
  "location": "East US 2",
  "password": "securepasswordstring",
  "resourceGroup": "groupXXXXXXXXXX",
  "skuname": "Standard_B1ms",
  "subnetId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/groupXXXXXXXXXX/providers/Microsoft.Network/virtualNetworks/serverXXXXXXXXXVNET/subnets/serverXXXXXXXXXSubnet",
  "username": "secureusername",
  "version": "5.7"
}
```

If you'd like to change any defaults, please refer to the Azure CLI [reference documentation](/cli/azure/mysql/flexible-server) for the complete list of configurable CLI parameters.

## Create a database
Run the following command to create a database, **newdatabase** if you have not already created one.

```azurecli-interactive
az mysql flexible-server db create -d newdatabase
```

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az mysql flexible-server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**. Below is a sample of the JSON output:

```json
{
  "administratorLogin": "myadminusername",
  "administratorLoginPassword": null,
  "delegatedSubnetArguments": {
    "subnetArmResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/mydemoserverVNET/subnets/mydemoserverSubnet"
  },
  "fullyQualifiedDomainName": "mydemoserver.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMySQL/flexibleServers/mydemoserver",
  "location": "East US 2",
  "name": "mydemoserver",
  "publicNetworkAccess": "Disabled",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 0,
    "name": "Standard_B1ms",
    "tier": "Burstable"
  },
  "storageProfile": {
    "backupRetentionDays": 7,
    "fileStorageSkuName": "Premium_LRS",
    "storageAutogrow": "Disabled",
    "storageIops": 0,
    "storageMb": 10240
  },
  "tags": null,
  "type": "Microsoft.DBforMySQL/flexibleServers",
  "version": "5.7"
}
```

## Connect and test the connection using Azure CLI

Azure Database for MySQL - Flexible Server enables you to connect to your mysql server with Azure CLI ```az mysql flexible-server connect``` command. This command allows you test connectivity to your database server, create a quick starter database and run queries directly against your server without having to install mysql.exe or MySQL Workbench.  You can also use run the command in an interactive mode for running multiple queries.

Run the following script to test and validate the connection to the database from your development environment.

```azurecli-interactive
az mysql flexible-server connect -n <servername> -u <username> -p <password> -d <databasename>
```
**Example:**
```azurecli-interactive
az mysql flexible-server connect -n mysqldemoserver1 -u dbuser -p "dbpassword" -d newdatabase
```
You should see the following output for successful connection:

```output
Connecting to newdatabase database.
Successfully connected to mysqldemoserver1.
```
If the connection failed, try these solutions:
- Check if port 3306 is open on your client machine.
- if your server administrator user name and password are correct
- if you have configured firewall rule for your client machine
- if you have configured your server with private access in virtual networking, make sure your client machine is in the same virtual network.

Run the following command to execute a single query using ```--querytext``` argument, ```-q```.

```azurecli-interactive
az mysql flexible-server connect -n <server-name> -u <username> -p "<password>" -d <database-name> --querytext "<query text>"
```

**Example:**
```azurecli-interactive
az mysql flexible-server connect -n mysqldemoserver1 -u dbuser -p "dbpassword" -d newdatabase -q "select * from table1;" --output table
```
To learn more about using ```az mysql flexible-server connect``` command, refer to the [connect and query](connect-azure-cli.md) documentation.

## Connect using mysql command-line client

If you created your flexible server by using private access (VNet Integration), you'll need to connect to your server from a resource within the same virtual network as your server. You can create a virtual machine and add it to the virtual network created with your flexible server. Refer configuring [private access documentation](how-to-manage-virtual-network-portal.md) to learn more.

If you created your flexible server by using public access (allowed IP addresses), you can add your local IP address to the list of firewall rules on your server. Refer [create or manage firewall rules documentation](how-to-manage-firewall-portal.md) for step by step guidance.

You can use either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. Azure Database for MySQL - Flexible Server supports connecting your client applications to the MySQL service using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements.To connect with your MySQL flexible server, you will require to download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) for certificate authority verification. To learn more about connecting with encrypted connections or disabling SSL, refer to [Connect to Azure Database for MySQL - Flexible Server with encrypted connections](how-to-connect-tls-ssl.md) documentation.

The following example shows how to connect to your flexible server using the mysql command-line interface. You will first install the mysql command-line if it is not installed already. You will download the DigiCertGlobalRootCA certificate required for SSL connections. Use the --ssl-mode=REQUIRED connection string setting to enforce TLS/SSL certificate verification. Pass the local certificate file path to the --ssl-ca parameter. Replace values with your actual server name and password.

```bash
sudo apt-get install mysql-client
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl-mode=REQUIRED --ssl-ca=DigiCertGlobalRootCA.crt.pem
```

If you have provisioned your flexible server using **public access**, you can also use [Azure Cloud Shell](https://shell.azure.com/bash) to connect to your flexible server using pre-installed mysql client as shown below:

In order to use Azure Cloud Shell to connect to your flexible server, you will need to allow networking access from Azure Cloud Shell to your flexible server. To achieve this, you can go to **Networking** blade on Azure portal for your MySQL flexible server and check the box under **Firewall** section which says, "Allow public access from any Azure service within Azure to this server" as shown in the screenshot below and click Save to persist the setting.

 > :::image type="content" source="./media/quickstart-create-server-portal/allow-access-to-any-azure-service.png" alt-text="Screenshot that shows how to allow Azure Cloud Shell access to MySQL flexible server for public access network configuration.":::


> [!NOTE]
> Checking the **Allow public access from any Azure service within Azure to this server** should be used for development or testing only. It configures the firewall to allow connections from IP addresses allocated to any Azure service or asset, including connections from the subscriptions of other customers.

Click on **Try it** to launch the Azure Cloud Shell and using the following commands to connect to your flexible server. Use your server name, user name, and password in the command.

```azurecli-interactive
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl=true --ssl-ca=DigiCertGlobalRootCA.crt.pem
```
> [!IMPORTANT]
>While connecting to your flexible server using Azure Cloud Shell, you will require to use --ssl=true parameter and not --ssl-mode=REQUIRED.
> The primary reason is Azure Cloud Shell comes with pre-installed mysql.exe client from MariaDB distribution which requires --ssl parameter while mysql client from Oracle's distribution requires --ssl-mode parameter.

If you see the following error message while connecting to your flexible server following the command earlier, you missed setting the firewall rule using the "Allow public access from any Azure service within Azure to this server" mentioned earlier or the option isn't saved. Please retry setting firewall and try again.

ERROR 2002 (HY000): Can't connect to MySQL server on \<servername\> (115)

## Clean up resources

If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command:

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run the `az mysql server delete` command.

```azurecli-interactive
az mysql flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

>[!div class="nextstepaction"]
> [Connect and query using Azure CLI](connect-azure-cli.md)
> [Connect to Azure Database for MySQL - Flexible Server with encrypted connections](how-to-connect-tls-ssl.md)
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
