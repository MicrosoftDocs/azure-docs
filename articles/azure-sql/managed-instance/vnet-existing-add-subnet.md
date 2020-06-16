---
title: Configure an existing virtual network
titleSuffix: Azure SQL Managed Instance 
description: This article describes how to configure an existing virtual network and subnet where you can deploy Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 03/17/2020
---
# Configure an existing virtual network for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Azure SQL Managed Instance must be deployed within an Azure [virtual network](../../virtual-network/virtual-networks-overview.md) and the subnet dedicated for managed instances only. You can use the existing virtual network and subnet if they're configured according to the [SQL Managed Instance virtual network requirements](connectivity-architecture-overview.md#network-requirements).

If one of the following cases applies to you, you can validate and modify your network by using the script explained in this article:

- You have a new subnet that's still not configured.
- You're not sure that the subnet is aligned with the [requirements](connectivity-architecture-overview.md#network-requirements).
- You want to check that the subnet still complies with the [network requirements](connectivity-architecture-overview.md#network-requirements) after you made changes.

> [!Note]
> You can create a managed instance only in virtual networks created through the Azure Resource Manager deployment model. Azure virtual networks created through the classic deployment model are not supported. Calculate subnet size by following the guidelines in the [Determine the size of subnet for SQL Managed Instance](vnet-subnet-determine-size.md) article. You can't resize the subnet after you deploy the resources inside.
>
> After the managed instance is created, moving the instance or VNet to another resource group or subscription is not supported.

## Validate and modify an existing virtual network

If you want to create a managed instance inside an existing subnet, we recommend the following PowerShell script to prepare the subnet:

```powershell
$scriptUrlBase = 'https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/manage/azure-sql-db-managed-instance/delegate-subnet'

$parameters = @{
    subscriptionId = '<subscriptionId>'
    resourceGroupName = '<resourceGroupName>'
    virtualNetworkName = '<virtualNetworkName>'
    subnetName = '<subnetName>'
    }

Invoke-Command -ScriptBlock ([Scriptblock]::Create((iwr ($scriptUrlBase+'/delegateSubnet.ps1?t='+ [DateTime]::Now.Ticks)).Content)) -ArgumentList $parameters
```

The script prepares the subnet in three steps:

1. Validate: It validates the selected virtual network and subnet for SQL Managed Instance networking requirements.
2. Confirm: It shows the user a set of changes that need to be made to prepare the subnet for SQL Managed Instance deployment. It also asks for consent.
3. Prepare: It properly configures the virtual network and subnet.

## Next steps

- For an overview, see [What is SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- For a tutorial that shows how to create a virtual network, create a managed instance, and restore a database from a database backup, see [Create a managed instance](instance-create-quickstart.md).
- For DNS issues, see [Configuring a custom DNS](custom-dns-configure.md).
