---
title: Azure SQL Database Managed Instance VNet Configuration | Microsoft Docs
description: This topic describes configuration options for a virtual network (VNet) with an Azure SQL Database Managed Instance.
services: sql-database
author: CarlRabeler
manager: Craig.Guyer
editor: ''
ms.assetid: 
ms.service: sql-database
ms.custom: managed instance
ms.devlang: na
ms.topic: article
ms.date: 03/07/2018
ms.author: carlrab
---

# Configure a VNet for Azure SQL Database Managed Instance

Azure SQL Managed Instance has to be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). This deployment enables the following scenarios: 
- Connecting to a Managed Instance directly form an on-premises network 
- Connecting a Managed Instance to linked server or other on-premises data store 
- Connecting a Managed Instance to Azure resources  

## Plan

Use your answers to the following questions to plan how you deploy a Managed Instance in virtual network: 
- Do you plan to deploy single or multiple Managed Instances? 

  The number of Managed Instances determines the minimum size of the subnet to allocate for your Managed Instances. For more information, see [Determinethe size of subnet for SQL Managed Instance](#create-a-new-virtual-network-for-managed-instances). 
- Do you need to deploy your Managed Instance into an existing virtual network or you are creating a new network? 

   If you plan to use an existing virtual network, you need to modify that network configuration to accommodate your Managed Instance. For more information, see [Modify existing virtual network for SQL Managed Instance](#modify-an-existing-virtual-network-for-managed-instances). 

   If you plan to create new virtual network, see [Create new virtual network for SQL Managed Instance](#create-new-virtual-network-for-managed-instances).

##  Determine the size of subnet for Managed Instances

When you create a Managed Instance, Azure allocates a number of virtual machines depending on the tier size you select during provisioning. Because these virtual machines are associated with your subnet, they require IP addresses. To retain high availability in some maintenance scenarios, Azure allocates additional virtual machines before deallocating existing ones. As a result, the number of required IP addresses per SQL Managed Instance is larger than the number of virtual machines that are running the service. 

By design, a Managed Instance needs a minimum of 16 IP addresses and may use up to 256 IP addresses. As a result, you can use subnet masks /28 to /24 when defining your subnet IP ranges. 

If you plan to deploy multiple Managed Instances inside the subnet and need to optimize on subnet size, use these parameters to form a calculation: 

- Azure uses 5 IP addresses in the subnet for its own needs 
- Each General Purpose instance needs 2 addresses 

**Example**: You plan to have 8 Managed Instances. That means you need 5 + 8 * 2 = 21 IP addresses. As IP ranges are defined in power of 2, you need the IP range of 32 (2^5) IP addresses. Therefore, you need to reserve the subnet with subnet mask of /27. 

## Create a new virtual network for Managed Instances 

Creating an Azure virtual network is a prerequisite for creating a Managed Instance. You can use the Azure portal, [PowerShell](../virtual-network/quick-create-powershell.md), or [Azure CLI](../virtual-network/quick-create-cli.md). The following section shows the steps using the Azure portal. The details discussed here apply to each of these methods.

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.
2. Locate and then click **Virtual Network**, verify the **Resource Manager** is selected as the deployment mode, and then click **Create**.

   ![virtual network create](./media/sql-database-managed-instance-tutorial/virtual-network-create.png)

3. Fill out the virtual network form with the requested information, in a manner similar to the following screenshot.

   ![virtual network create form](./media/sql-database-managed-instance-tutorial/virtual-network-create-form.png)

4. Click **Create**.

   The address space and subnet are specified in CIDR notation. 

   > [!IMPORTANT]
   > The default values will create subnet that will take all the VNet address space. If you choose this option you will not be able to create any other resources inside the virtual network other than SQL Managed Instance. 

   The recommended approach would be the following: 
   - Calculate subnet size by following [Determine the size of subnet for SQL Managed Instance](#determine-the-size-of-subnet-for-managed-instances) section  
   - Assess the needs for the rest of VNet 
   - Fill in VNet and subnet address ranges accordingly 

   Make sure that Service endpoints option stays Disabled. 

## Create the required route table and associate it

1. Sign in to the Azure portal  
2. Locate and then click **Route table**, and then click **Create** on the Route table page.

   ![route table create form](./media/sql-database-managed-instance-tutorial/route-table-create-form.png)

3. Create a 0.0.0.0/0 Next Hop Internet route, in a manner similar to the following screenshots.

   ![route table add](./media/sql-database-managed-instance-tutorial/route-table-add.png)

   ![route](./media/sql-database-managed-instance-tutorial/route.png)

4. Associate this route with the subnet for the Managed Instance, in a manner similar to the following screenshots.

    ![subnet](./media/sql-database-managed-instance-tutorial/subnet.png)

    ![set route table](./media/sql-database-managed-instance-tutorial/set-route-table.png)

    ![set route table-save](./media/sql-database-managed-instance-tutorial/set-route-table-save.png)


Once your VNet has been created, you are ready to create your Managed Instance.  

## Modify an existing virtual network for Managed Instances 

The questions and answers in this section show you how to add a Managed Instance to existing virtual network. 

**Are you using Classic or Resource Manager deployment model for the existing virtual network?** 

You can only create a Managed Instance in Resource Manager virtual networks. 

**Would you like to create new subnet for SQL Managed instance or use existing one?**

If you would like to create new one: 

- Calculate subnet size by following the guidelines in the [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances) section.
- Follow steps in [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md). 
- Create a route table that contains single entry, 0.0.0.0/0 as the next hop Internet and associate it with the subnet for the Managed Instance.  

In case you would like to create a Managed Instance inside an existing subnet: 
- Check if the subnet is empty - a Managed Instance cannot be created in a subnet that contains other resources including the Gateway subnet 
- Calculate subnet size by following the guidelines in the [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances) section and verify that it is sized appropriately. 
- Check that service endpoints are not enabled on the subnet.
- Make sure that there are no network security groups associated with the subnet 

**Do you have custom DNS server configured?** 

If yes, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md). 

- Create the create the required route table and associate it: see [Create the required route table and associate it](#create-the-required-route-table-and-associate-it)

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing how to create a VNet, create a Managed Instance, and restore a database from a database backup, see [Creating an Azure SQL Database Managed Instance](sql-database-managed-instance-tutorial-portal.md).
- For DNS issues, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md)
