---
title: 'Quickstart: Create Azure Database for MySQL server - Powershell via deployment'
description: This article steps you through creating Mysql server with Powershell using Azure deplouyment. 
services: mysql
author: przemas75
---

# Create Azure Database for Mysql in Powershell

There is no Powershell module for Azure Database for Mysql currently and if you would like to create Mysql without Azure CLI you have to use deployment commandlet.
It is useful if you would like to have some automation.

## Signin to Azure
Signing is possible with commandlets [Connect-AzureRmAccount](/powershell/module/azurerm.profile/Connect-AzureRmAccount) and in case you need to choose subscription [Get-AzureRmContext](/powershell/module/azurerm.profile/Get-AzureRmContext)

## Create Resource Group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```azurepowershell-interactive
$resourcegroup = New-AzureRmResourceGroup -Name "myResourceGroup" -Location "WestEurope"
```

## Create Azure Database for Mysql deployment

```azurepowershell-interactive
$rglocation=(Get-AzureRmResourceGroup -ResourceGroupName $resourcegroup).Location
     $JSONinput = [System.IO.Path]::GetTempFileName()
       $template = @{
          '$schema' = "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"
           contentVersion = "1.0.0.0"
            resources = @(@{type="Microsoft.DBforMySQL/servers"; name="new-mysql-server"; location=$rglocation; sku=@{name="MYSQLB50"; tier="Basic"; capacity="100"; size="51200"; family="SkuFamily"}; apiVersion="2017-12-01"; properties=@{version="5.7"; administratorLogin="mysqladmin"; administratorLoginPassword="verysecurepassword"; storageMB="51200"}})

ConvertTo-Json -InputObject $template -Depth 100 | Out-File -File $JSONinput -Force
New-AzureRmResourceGroupDeployment -ResourceGroupName $resourcegroup -TemplateFile $JSONinput
```

## Adjusting firewakk rules

Newly created server would have to have some firewall rules for accessing, this could be done with another deployment via template.
```azurepowershell-interactive
     $JSONinput = [System.IO.Path]::GetTempFileName()
       $template = @{
          '$schema' = "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"
           contentVersion = "1.0.0.0"
            resources = @(@{type="Microsoft.DBforMySQL/servers"/firewallRules; name="new-mysql-server"; apiVersion="2017-12-01"; properties=@{startIpAddress="192.168.1.10"; endIpAdddress="192.168.1.12"}})

ConvertTo-Json -InputObject $template -Depth 100 | Out-File -File $JSONinput -Force
New-AzureRmResourceGroupDeployment -ResourceGroupName $resourcegroup -TemplateFile $JSONinput
```

## Connecting to your server

It is now possible to connect to your Mysql server and crete database from 192.168.1.10 (remember about 3306 port on your firewall).
```bash-interactive
mysql -h new-mysql-server.mysql.database.azure.com -p -u mysqladmin@new-mysql-server with password "verysecurepassword"
```
