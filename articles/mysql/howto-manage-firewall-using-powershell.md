---
title: Create and manage Azure Database for MySQL firewall rules using PowerShell
description: This article describes how to create and manage Azure Database for MySQL firewall rules using PowerShell.
services: mysql
author: lwsrbrts
ms.author: 
manager: 
editor: 
ms.service: mysql
ms.devlang: azure-powershell
ms.topic: article
ms.date: 11/08/2018
---

# Create and manage Azure Database for MySQL firewall rules using PowerShell
Server-level firewall rules allow administrators to manage access to an Azure Database for MySQL Server from a specific IP address or a range of IP addresses. Using PowerShell, you can create, update, delete, list, and show firewall rules to manage your MySQL server. For an overview of Azure Database for MySQL firewalls, see [Azure Database for MySQL server firewall rules](./concepts-firewall-rules.md)

## Prerequisites
* An [Azure Database for MySQL server and database](quickstart-create-mysql-server-database-using-azure-cli.md).

## Firewall rule commands:
There are no native Azure PowerShell commands for controlling Azure Database for MySQL firewall rules, so it is necessary to use Get-AzureRmResource and New-AzureRmResource instead.
You can use these cmdlets to create, delete, list, show, and update firewall rules.

## Log in to Azure and list your Azure Database for MySQL Servers
Securely connect to your subscription by using the cloud shell or your local PowerShell installation. Note if you are using PowerShell locally, you will require the Azure PowerShell module to be installed.

1. From the command-line, run the following command, substituting in the name of your subscription:
   ```azurepowershell-interactive
   Set-AzureRmContext -SubscriptionName 'Pay-As-You-Go'
   ```

2. List the Azure Database for MySQL servers for your subscription.

   ```azurepowershell-interactive
   Get-AzureRmResource -ResourceType Microsoft.DBforMySQL/servers
   ```
   
3. Store the Azure Database for MySQL object in a variable to be used in subsequent steps.
   
   ```azurepowershell-interactive
   $MySQLServer = Get-AzureRmResource -ResourceName 'my-mysql-server'
   ```

## List firewall rules on the Azure Database for MySQL Server 
Using the object stored in the `$MySQLServer` variable, list the existing server firewall rules on the server.

```azurepowershell-interactive
Get-AzureRmResource -ResourceId "$($MySQLServer.Id)/firewallRules" -ApiVersion 2017-12-01
```

The output lists the rules, if any, as PowerShell objects.

## Create a firewall rule on Azure Database for MySQL Server

Create an object which we will use when creating the rule that reflects the start and end IP addresses of the range to be allowed in the rule.
```azurepowershell-interactive
$Range = @{
    startIpAddress = '20.0.0.1' # The start IP address of the range for the rule. 
    endIpAddress   = '20.0.0.1' # The end IP address of the range for the rule. (For a single IP, use the same as the startIpAddress)
}
```

Now create the firewall rule, providing the object (`$Range`) we created in the earlier step. `FirewallRule1` is the name of the new rule to be created.
```azurepowershell-interactive
New-AzureRmResource -ResourceId "$($MySQLServer.Id)/firewallRules/FirewallRule1" -Properties $Range -ApiVersion 2017-12-01
``

To allow applications from Azure IP addresses to connect to your Azure Database for MySQL server, provide the IP address 0.0.0.0 as the Start IP and End IP, as in this example.
```azurepowershell-interactive
az mysql server firewall-rule create --resource-group myresourcegroup --server mysql --name "AllowAllWindowsAzureIps" --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 

Upon success, each create command output lists the details of the firewall rule you have created, in JSON format (by default). If there is a failure, the output shows error message text instead.

## Update a firewall rule on Azure Database for MySQL server 
Using the Azure MySQL server name and the resource group name, update an existing firewall rule on the server. Use the [az mysql server firewall update](/cli/azure/mysql/server/firewall-rule#az-mysql-server-firewall-rule-update) command. Provide the name of the existing firewall rule as input, as well as the start IP and end IP attributes to update.
```azurecli-interactive
az mysql server firewall-rule update --resource-group myresourcegroup --server-name mydemoserver --name FirewallRule1 --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.1
```
Upon success, the command output lists the details of the firewall rule you have updated, in JSON format (by default). If there is a failure, the output shows error message text instead.

> [!NOTE]
> If the firewall rule does not exist, the rule is created by the update command.

## Show firewall rule details on Azure Database for MySQL Server
Using the Azure MySQL server name and the resource group name, show the existing firewall rule details from the server. Use the [az mysql server firewall show](/cli/azure/mysql/server/firewall-rule#az-mysql-server-firewall-rule-show) command. Provide the name of the existing firewall rule as input.
```azurecli-interactive
az mysql server firewall-rule show --resource-group myresourcegroup --server-name mydemoserver --name FirewallRule1
```
Upon success, the command output lists the details of the firewall rule you have specified, in JSON format (by default). If there is a failure, the output shows error message text instead.

## Delete a firewall rule on Azure Database for MySQL Server
Using the Azure MySQL server name and the resource group name, remove an existing firewall rule from the server. Use the [az mysql server firewall delete](/cli/azure/mysql/server/firewall-rule#az-mysql-server-firewall-rule-delete) command. Provide the name of the existing firewall rule.
```azurecli-interactive
az mysql server firewall-rule delete --resource-group myresourcegroup --server-name mydemoserver --name FirewallRule1
```
Upon success, there is no output. Upon failure, error message text displays.

## Next steps
- Understand more about [Azure Database for MySQL Server firewall rules](./concepts-firewall-rules.md).
- [Create and manage Azure Database for MySQL firewall rules using the Azure portal](./howto-manage-firewall-using-portal.md).
