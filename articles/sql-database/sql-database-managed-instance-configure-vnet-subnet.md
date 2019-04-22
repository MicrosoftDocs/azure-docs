---
title: Configure an existing virtual network for Azure SQL Database Managed Instance | Microsoft Docs
description: This article describes how to configure an existing virtual network and subnet where you can deploy Azure SQL Database Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
manager: craigg
ms.date: 01/15/2019
---
# Configure an existing virtual network for Azure SQL Database Managed Instance

Azure SQL Database Managed Instance must be deployed within an Azure [virtual network](../virtual-network/virtual-networks-overview.md) and the subnet dedicated for Managed Instances only. You can use the existing virtual network and subnet if it's configured according to the [Managed Instance virtual network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements).

If one of the following cases applies to you, you can validate and modify your network by using the script explained in this article:

- You have a new subnet that's still not configured.
- You're not sure that the subnet is aligned with the [requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements).
- You want to check that the subnet still complies with the [network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements) after you made changes.

> [!Note]
> You can create a Managed Instance only in virtual networks created through the Azure Resource Manager deployment model. Azure virtual networks created through the classic deployment model are not supported. Calculate subnet size by following the guidelines in the [Determine the size of subnet for Managed Instances](sql-database-managed-instance-determine-size-vnet-subnet.md) article. You can't resize the subnet after you deploy the resources inside.

## Validate and modify an existing virtual network

If you want to create a Managed Instance inside an existing subnet, we recommend the following PowerShell script to prepare the subnet:

```powershell
$scriptUrlBase = 'https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/manage/azure-sql-db-managed-instance/prepare-subnet'

$parameters = @{
    subscriptionId = '<subscriptionId>'
    resourceGroupName = '<resourceGroupName>'
    virtualNetworkName = '<virtualNetworkName>'
    subnetName = '<subnetName>'
    }

Invoke-Command -ScriptBlock ([Scriptblock]::Create((iwr ($scriptUrlBase+'/prepareSubnet.ps1?t='+ [DateTime]::Now.Ticks)).Content)) -ArgumentList $parameters
```

The script prepares the subnet in three steps:

1. Validate: It validates the selected virtual network and subnet for Managed Instance networking requirements.
2. Confirm: It shows the user a set of changes that need to be made to prepare the subnet for Managed Instance deployment. It also asks for consent.
3. Prepare: It properly configures the virtual network and subnet.

## Next steps

- For an overview, see [What is a Managed Instance?](sql-database-managed-instance.md).
- For a tutorial that shows how to create a virtual network, create a Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a custom DNS](sql-database-managed-instance-custom-dns.md).
