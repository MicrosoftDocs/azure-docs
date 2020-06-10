---
title: Create a virtual network
titleSuffix: Azure SQL Managed Instance 
description: This article describes how to create a virtual network configured to support deploying Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 09/12/2019
---
# Create a virtual network for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to create a valid virtual network and subnet where you can deploy Azure SQL Managed Instance.

Azure SQL Managed Instance must be deployed within an Azure [virtual network](../../virtual-network/virtual-networks-overview.md). This deployment enables the following scenarios:

- Secure private IP address
- Connecting to SQL Managed Instance directly from an on-premises network
- Connecting SQL Managed Instance to a linked server or another on-premises data store
- Connecting SQL Managed Instance to Azure resources  

> [!NOTE]
> You should [determine the size of the subnet for SQL Managed Instance](vnet-subnet-determine-size.md) before you deploy the first instance. You can't resize the subnet after you put the resources inside.
>
> If you plan to use an existing virtual network, you need to modify that network configuration to accommodate SQL Managed Instance. For more information, see [Modify an existing virtual network for SQL Managed Instance](vnet-existing-add-subnet.md).
>
> After a managed instance is created, moving the managed instance or virtual network to another resource group or subscription is not supported.  Moving the managed instance to another subnet also is not supported.
>

## Create a virtual network

The easiest way to create and configure a virtual network is to use an Azure Resource Manager deployment template.

1. Sign in to the Azure portal.

2. Select the **Deploy to Azure** button:

   <a target="_blank" href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sql-managed-instance-azure-environment%2Fazuredeploy.json" rel="noopener" data-linktype="external"> <img src="https://azuredeploy.net/deploybutton.png" data-linktype="external"> </a>

   This button opens a form that you can use to configure the network environment where you can deploy SQL Managed Instance.

   > [!Note]
   > This Azure Resource Manager template will deploy a virtual network with two subnets. One subnet, called **ManagedInstances**, is reserved for SQL Managed Instance and has a preconfigured route table. The other subnet, called **Default**, is used for other resources that should access SQL Managed Instance (for example, Azure Virtual Machines).

3. Configure the network environment. On the following form, you can configure parameters of your network environment:

   ![Resource Manager template for configuring the Azure network](./media/virtual-network-subnet-create-arm-template/create-mi-network-arm.png)

   You might change the names of the virtual network and subnets, and adjust the IP ranges associated with your networking resources. After you select the **Purchase** button, this form will create and configure your environment. If you don't need two subnets, you can delete the default one.

## Next steps

- For an overview, see [What is SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn about [connectivity architecture in SQL Managed Instance](connectivity-architecture-overview.md).
- Learn how to [modify an existing virtual network for SQL Managed Instance](vnet-existing-add-subnet.md).
- For a tutorial that shows how to create a virtual network, create a managed instance, and restore a database from a database backup, see [Create a managed instance](instance-create-quickstart.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
