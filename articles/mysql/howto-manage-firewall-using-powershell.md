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
There are no Azure PowerShell specific cmdlets for controlling Azure Database for MySQL firewall rules, so it is necessary to use `Get-AzureRmResource` and `New-AzureRmResource` instead.
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

To review the details of a single rule, use the following command:

```azurepowershell-interactive
Get-AzureRmResource -ResourceType 'Microsoft.DBforMySQL/servers/firewallRules' -ApiVersion 2017-12-01 -ResourceName 'my-mysql-server/FirewallRule1' -ResourceGroupName 'my-mysql-server-resourcegroup'
```

If the name of the rule being requested does not exist, an error will be returned.

## Create a firewall rule on Azure Database for MySQL Server

Firstly, create an object which we will use when creating the rule that reflects the start and end IP addresses of the range to be allowed in the rule.
```azurepowershell-interactive
$Range = @{
    startIpAddress = '20.0.0.1' # The start IP address of the range for the rule. 
    endIpAddress   = '20.0.0.1' # The end IP address of the range for the rule. (For a single IP, use the same as the startIpAddress)
}
```

Now create the firewall rule, providing the object (`$Range`) we created in the earlier step. `FirewallRule1` is the name of the new rule to be created.

```azurepowershell-interactive
New-AzureRmResource -ResourceId "$($MySQLServer.Id)/firewallRules/FirewallRule1" -Properties $Range -ApiVersion 2017-12-01
```

You will be prompted to confirm creation of the new rule. Enter `y` to confirm and press Enter. Note you can use the `-Force` and `-Confirm:$false` defaults in an automation script if required.

To allow applications from Azure IP addresses to connect to your Azure Database for MySQL server, provide the IP address 0.0.0.0 as the Start IP and End IP, as in this example. Note the name of the rule.

```azurepowershell-interactive
$Range = @{
    startIpAddress = '0.0.0.0'
    endIpAddress   = '0.0.0.0'
}

New-AzureRmResource -ResourceId "$($MySQLServer.Id)/firewallRules/AllowAllWindowsAzureIps" -Properties $Range -ApiVersion 2017-12-01
```

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorised users.
> 

Upon success, the command returns an object containing the details of the firewall rule you have created.

## Update a firewall rule on Azure Database for MySQL server 
To update a firewall rule, follow the same process as though you are creating a new rule but specify the name of an existing rule.

```azurepowershell-interactive
$Range = @{
    startIpAddress = '20.0.0.1' # The start IP address of the range for the rule. 
    endIpAddress   = '20.0.0.200' # The end IP address of the range for the rule.
}

New-AzureRmResource -ResourceId "$($MySQLServer.Id)/firewallRules/FirewallRule1" -Properties $Range -ApiVersion 2017-12-01
```

Upon success, the command output lists the details of the firewall rule you have updated.

> [!NOTE]
> If the firewall rule does not exist, the rule is created.

## Delete a firewall rule on Azure Database for MySQL Server

To delete a firewall rule, ensure that the `$MySQLServer` object that the rule relates to is populated, or specify the name of the server and resource group manually.

```azurepowershell-interactive
Remove-AzureRmResource -ResourceType 'Microsoft.DBforMySQL/servers/firewallRules' -ApiVersion 2017-12-01 -ResourceName "$($MySQLServer.Name)/FirewallRule1" -ResourceGroupName $MySQLServer.ResourceGroupName
```

Upon success, a boolean value (true or false) is returned. Upon failure, an error message is displayed.

## Next steps
- Understand more about [Azure Database for MySQL Server firewall rules](./concepts-firewall-rules.md).
- [Create and manage Azure Database for MySQL firewall rules using the Azure portal](./howto-manage-firewall-using-portal.md).
- [Create and manage Azure Database for MySQL firewall rules using Azure CLI](./howto-manage-firewall-using-cli.md).
