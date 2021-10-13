---
title: Synchronize virtual network DNS servers setting on SQL Managed Instance virtual cluster
description: Learn how synchronize virtual network DNS servers setting on SQL Managed Instance virtual cluster.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
author: srdan-bozovic-msft
ms.author: srbozovi
ms.topic: how-to
ms.date: 01/17/2021 
ms.custom: devx-track-azurepowershell
---

# Synchronize virtual network DNS servers setting on SQL Managed Instance virtual cluster
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains when and how to synchronize virtual network DNS servers setting on SQL Managed Instance virtual cluster.

## When to synchronize the DNS setting

There are a few scenarios (for example, db mail, linked servers to other SQL Server instances in your cloud or hybrid environment) that require private host names to be resolved from SQL Managed Instance. In this case, you need to configure a custom DNS inside Azure. See [Configure a custom DNS for Azure SQL Managed Instance](custom-dns-configure.md) for details.

If this change is implemented after [virtual cluster](connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture) hosting Managed Instance is created you'll need to synchronize DNS servers setting on the virtual cluster with the virtual network configuration.

> [!IMPORTANT]
> Synchronizing DNS servers setting will affect all of the Managed Instances hosted in the virtual cluster.

## How to synchronize the DNS setting

### Azure RBAC permissions required

User synchronizing DNS server configuration will need to have one of the following Azure roles:

- Subscription contributor role, or
- Custom role with the following permission:
  - `Microsoft.Sql/virtualClusters/updateManagedInstanceDnsServers/action`

### Use Azure PowerShell

Get virtual network where DNS servers setting has been updated.

```PowerShell
$ResourceGroup = 'enter resource group of virtual network'
$VirtualNetworkName = 'enter virtual network name'
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroup $ResourceGroup -Name $VirtualNetworkName
```
Use PowerShell command [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) to synchronize DNS servers configuration for all the virtual clusters in the subnet.

```PowerShell
Get-AzSqlVirtualCluster `
    | where SubnetId -match $virtualNetwork.Id `
    | select Id `
    | Invoke-AzResourceAction -Action updateManagedInstanceDnsServers -Force
```
### Use the Azure CLI

Get virtual network where DNS servers setting has been updated.

```Azure CLI
resourceGroup="auto-failover-group"
virtualNetworkName="vnet-fog-eastus"
virtualNetwork=$(az network vnet show -g $resourceGroup -n $virtualNetworkName --query "id" -otsv)
```

Use Azure CLI command [az resource invoke-action](/cli/azure/resource#az_resource_invoke_action) to synchronize DNS servers configuration for all the virtual clusters in the subnet.

```Azure CLI
az sql virtual-cluster list --query "[? contains(subnetId,'$virtualNetwork')].id" -o tsv \
	| az resource invoke-action --action updateManagedInstanceDnsServers --ids @-
```
## Next steps

- Learn more about configuring a custom DNS [Configure a custom DNS for Azure SQL Managed Instance](custom-dns-configure.md).
- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
