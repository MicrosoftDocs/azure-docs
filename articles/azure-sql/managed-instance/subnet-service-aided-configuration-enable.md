---
title: Enabling service-aided subnet configuration for Azure SQL Managed Instance
description: Enabling service-aided subnet configuration for Azure SQL Managed Instance
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.date: 03/12/2020
---
# Enabling service-aided subnet configuration for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Service-aided subnet configuration provides automated network configuration management for subnets hosting managed instances. With service-aided subnet configuration user stays in full control of access to data (TDS traffic flows) while managed instance takes responsibility to ensure uninterrupted flow of management traffic in order to fulfill SLA.

Automatically configured network security groups and route table rules are visible to customer and annotated with prefix _Microsoft.Sql-managedInstances_UseOnly__.

Service-aided configuration is enabled automatically once you turn on [subnet-delegation](../../virtual-network/subnet-delegation-overview.md) for `Microsoft.Sql/managedInstances` resource provider.

> [!IMPORTANT] 
> Once subnet-delegation is turned on you could not turn it off until you remove last virtual cluster from the subnet. For more details on how to delete virtual cluster see the following [article](virtual-cluster-delete.md#delete-a-virtual-cluster-from-the-azure-portal).

> [!NOTE] 
> As service-aided subnet configuration is essential feature for maintaining SLA, starting May 1st 2020, it won't be possible to deploy managed instances in subnets that are not delegated to managed instance resource provider. On July 1st 2020 all subnets containing managed instances will be automatically delegated to managed instance resource provider. 

## Enabling subnet-delegation for new deployments
To deploy managed instance in to empty subnet you need to delegate it to `Microsoft.Sql/managedInstances` resource provider as described in following [article](../../virtual-network/manage-subnet-delegation.md). _Please note that referenced article uses `Microsoft.DBforPostgreSQL/serversv2` resource provider for example. You'll need to use `Microsoft.Sql/managedInstances` resource provider instead._

## Enabling subnet-delegation for existing deployments

In order to enable subnet-delegation for your existing managed instance deployment you need to find out virtual network subnet where it is placed. 

To learn this you can check `Virtual network/subnet` at the `Overview` portal blade of your managed instance.

As an alternative, you could run the following PowerShell commands to learn this. Replace **subscription-id** with your subscription ID. Also replace **rg-name** with the resource group for your managed instance, and replace **mi-name** with the name of your managed instance.

```powershell
Install-Module -Name Az

Import-Module Az.Accounts
Import-Module Az.Sql

Connect-AzAccount

# Use your subscription ID in place of subscription-id below

Select-AzSubscription -SubscriptionId {subscription-id}

# Replace rg-name with the resource group for your managed instance, and replace mi-name with the name of your managed instance

$mi = Get-AzSqlInstance -ResourceGroupName {rg-name} -Name {mi-name}

$mi.SubnetId
```

Once you find managed instance subnet you need to delegate it to `Microsoft.Sql/managedInstances` resource provider as described in following [article](../../virtual-network/manage-subnet-delegation.md). _Please note that referenced article uses `Microsoft.DBforPostgreSQL/serversv2` resource provider for example. You'll need to use `Microsoft.Sql/managedInstances` resource provider instead._


> [!IMPORTANT]
> Enabling service-aided configuration doesn't cause failover or interruption in connectivity for managed instances that are already in the subnet.
