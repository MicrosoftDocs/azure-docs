---
title: Azure SQL Database Managed Instance configuring existing VNET/subnet | Microsoft Docs
description: This topic describes how to configure an existing virtual network (VNet) and subnet where you can deploy Azure SQL Database Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: howto
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: bonova, carlrab
manager: craigg
ms.date: 09/20/2018
---
# Configure an existing VNet for Azure SQL Database Managed Instance

Azure SQL Database Managed Instance must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md) and the subnet dedicated for Managed Instances only. You can use the existing VNet and subnet if it is configured according to the [Managed Instance VNet requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements). 

If you have a new subnet that is still not configured, you are not sure is the subnet aligned with the [requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements), or you want to check is the subnet still compliant with the [network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements) after some changes that you made, you can validate and modify your network using the script explained in this section. 

  > [!Note]
  > You can only create a Managed Instance in Resource Manager virtual networks. Azure VNets deployed using Classic deployment model are not suported. Make sure that you calculate subnet size by following the guidelines in the [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances) section, becuase the subnet cannot be resized once you deploy the resources inside.

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
Subnet preparation is done in three simple steps:

1. Validate - Selected virtual network and subnet are validated for Managed Instance networking requirements.
2. Confirm - User is shown a set of changes that need to be made to prepare subnet for Managed Instance deployment and asked for consent.
3. Prepare - Virtual network and subnet are configured properly.

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing how to create a VNet, create a Managed Instance, and restore a database from a database backup, see [Creating an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md).
