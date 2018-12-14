---
title: Azure SQL Database Managed Instance Create VNet | Microsoft Docs
description: This topic describes how to create a virtual network (VNet) where you can deploy an Azure SQL Database Managed Instance.
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
# Configure a VNet for Azure SQL Database Managed Instance

This topic explains how to create a valid VNet and subnet where you can deploy Azure SQL Database Managed Instances.

Azure SQL Database Managed Instance must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). This deployment enables the following scenarios: 
- Secure private IP address.
- Connecting to a Managed Instance directly from an on-premises network 
- Connecting a Managed Instance to linked server or another on-premises data store 
- Connecting a Managed Instance to Azure resources  

  > [!Note]
  > You should [determine the size of subnet for Managed Instance](sql-database-managed-instance-determine-size-vnet-subnet.md) before you deploy first instance because the sunet cannot be resized once you put the resources inside.
  > If you plan to use an existing virtual network, you need to modify that network configuration to accommodate your Managed Instance. For more information, see [Modify existing virtual network for Managed Instance](sql-database-managed-instance-configure-vnet-subnet.md). 

## Create a new virtual network

The easiest way to create and configure virtual network is to use Azure Resource Manager deployment template.

1. Sign in to the Azure portal.

2. Use **Deploy to Azure** button to deploy virtual network in Azure cloud:

  <a target="_blank" href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sql-managed-instance-azure-environment%2Fazuredeploy.json" rel="noopener" data-linktype="external"> <img src="http://azuredeploy.net/deploybutton.png" data-linktype="external"> </a>

  This button will open a form that you can use to configure network environment where you can deploy Managed Instance.

  > [!Note]
  > This Azure Resource Manager template will deploy virtual network with two subnets. One subnet called **ManagedInstances** is reserved for Managed Instances and has pre-configured route table, while the other subnet called **Default** is used for other resources that should access Managed Instance (for example, Azure Virtual Machines). You can remove **Default** subnet if you don't need it.

3. Configure network environment. On the following form you can configure parameters of your network environment:

![Configure azure network](./media/sql-database-managed-instance-vnet-configuration/create-mi-network-arm.png)

You might change the names of VNet and subnets and adjust IP ranges associated to your networking resources. Once you press "Purchase" button, this form will create and configure your environment. If you don't need two subnets, you can delete the default one. 

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md).
- Learn about [connectivity architecture in Managed Instance](sql-database-managed-instance-connectivity-architecture.md).
- Lear how to [modify existing virtual network for Managed Instance](sql-database-managed-instance-configure-vnet-subnet.md)
- For a tutorial showing how to create a VNet, create a Managed Instance, and restore a database from a database backup, see [Creating an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md)
