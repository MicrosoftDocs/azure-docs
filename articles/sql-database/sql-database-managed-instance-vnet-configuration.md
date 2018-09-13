---
title: Azure SQL Database Managed Instance VNet Configuration | Microsoft Docs
description: This topic describes configuration options for a virtual network (VNet) with an Azure SQL Database Managed Instance.
services: sql-database
author: srdan-bozovic-msft
manager: craigg
ms.service: sql-database
ms.custom: managed instance
ms.topic: conceptual
ms.date: 08/21/2018
ms.author: srbozovi
ms.reviewer: bonova, carlrab
---

# Configure a VNet for Azure SQL Database Managed Instance

Azure SQL Database Managed Instance (preview) must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). This deployment enables the following scenarios: 
- Connecting to a Managed Instance directly from an on-premises network 
- Connecting a Managed Instance to linked server or another on-premises data store 
- Connecting a Managed Instance to Azure resources  

## Plan

Plan how you deploy a Managed Instance in virtual network using your answers to the following questions: 
- Do you plan to deploy single or multiple Managed Instances? 

  The number of Managed Instances determines the minimum size of the subnet to allocate for your Managed Instances. For more information, see [Determine the size of subnet for Managed Instance](#determine-the-size-of-subnet-for-managed-instances). 
- Do you need to deploy your Managed Instance into an existing virtual network or you are creating a new network? 

   If you plan to use an existing virtual network, you need to modify that network configuration to accommodate your Managed Instance. For more information, see [Modify existing virtual network for Managed Instance](#modify-an-existing-virtual-network-for-managed-instances). 

   If you plan to create new virtual network, see [Create new virtual network for Managed Instance](#create-a-new-virtual-network-for-managed-instances).

## Requirements

For Managed Instance creation you need to dedicate a subnet inside the VNet that conforms to the following requirements:
- **Dedicated subnet**: The subnet must not contain any other cloud service associated to it, and it must not be Gateway subnet. You won’t be able to create Managed Instance in subnet that contains resources other than managed instance or add other resources inside the subnet later.
- **No NSG**: The subnet must not have a Network Security Group associated with it. 
- **Have specific route table**: The subnet must have a User Route Table (UDR) with 0.0.0.0/0 Next Hop Internet as the only route assigned to it. For more information, see [Create the required route table and associate it](#create-the-required-route-table-and-associate-it)
3. **Optional custom DNS**: If custom DNS is specified on the VNet, Azure's recursive resolvers IP address (such as 168.63.129.16) must be added to the list. For more information, see [Configuring Custom DNS](sql-database-managed-instance-custom-dns.md).
4. **No Service endpoints**: The subnet must not have a Service endpoint associated to it. Make sure that Service endpoints option is Disabled when creating VNet.
5. **Sufficient IP addresses**: The subnet must have the bare minimum of 16 IP addresses (recommended minimum is 32 IP addresses). For more information, see [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances)

> [!IMPORTANT]
> You won’t be able to deploy new Managed Instance if the destination subnet is not compatible with all of the preceding requirements. The destination Vnet and the subnet must be kept in accordance with these Managed Instance requirements (before and after deployment), as any violation may cause instance to enter faulty state and become unavailable. Recovering from that state requires you to create new instance in a VNet with the compliant networking policies, recreate instance level data, and restore your databases. This introduces significant downtime for your applications.

With introduction of _Network Intent Policy_, you can add a Network security group (NSG) on a Managed Instance subnet after the Managed Instance is created.

You can now use an NSG to narrow down the IP ranges from which applications and users can query and manage the data by filtering network traffic that goes to port 1433. 

> [!IMPORTANT]
> When you are configuring the NSG rules that will restrain access to port 1433, you also need to insert the highest priority inbound rules displayed in the table below. Otherwise Network Intent Policy blocks the change as non compliant.

| NAME       |PORT                        |PROTOCOL|SOURCE           |DESTINATION|ACTION|
|------------|----------------------------|--------|-----------------|-----------|------|
|management  |9000, 9003, 1438, 1440, 1452|Any     |Any              |Any        |Allow |
|mi_subnet   |Any                         |Any     |MI SUBNET        |Any        |Allow |
|health_probe|Any                         |Any     |AzureLoadBalancer|Any        |Allow |

The routing experiance has also been improved so that in addition to the 0.0.0.0/0 next hop type Internet route, you can now add UDR to route traffic towards your on-premises private IP ranges through virtual network gateway or virtual network appliance (NVA).

##  Determine the size of subnet for Managed Instances

When you create a Managed Instance, Azure allocates a number of virtual machines depending on the tier you selected during provisioning. Because these virtual machines are associated with your subnet, they require IP addresses. To ensure high availability during regular operations and service maintenance, Azure may allocate additional virtual machines. As a result, the number of required IP addresses in a subnet is larger than the number of Managed Instances in that subnet. 

By design, a Managed Instance needs a minimum of 16 IP addresses in a subnet and may use up to 256 IP addresses. As a result, you can use subnet masks /28 to /24 when defining your subnet IP ranges. 

> [!IMPORTANT]
> Subnet size with 16 IP addresses is the bare minimum with limited potential for the further Managed Instance scale out. Choosing subnet with the prefix /27 or below is highly recommended. 

If you plan to deploy multiple Managed Instances inside the subnet and need to optimize on subnet size, use these parameters to form a calculation: 

- Azure uses five IP addresses in the subnet for its own needs 
- Each General Purpose instance needs two addresses 
- Each Business Critical instance needs four addresses

**Example**: You plan to have three General Purpose and two Business Critical Managed Instances. That means you need 5 + 3 * 2 + 2 * 4 = 19 IP addresses. As IP ranges are defined in power of 2, you need the IP range of 32 (2^5) IP addresses. Therefore, you need to reserve the subnet with subnet mask of /27. 

> [!IMPORTANT]
> Calculation displayed above will become obsolete with further improvements. 

## Create a new virtual network for Managed Instance using Azure Resource Manager deployment

The easiest way to create and configure virtual network is to use Azure Resource Manager deployment template.

1. Sign in to the Azure portal.

2. Use **Deploy to Azure** button to deploy virtual network in Azure cloud:

  <a target="_blank" href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sql-managed-instance-azure-environment%2Fazuredeploy.json" rel="noopener" data-linktype="external"> <img src="http://azuredeploy.net/deploybutton.png" data-linktype="external"> </a>

  This button will open a form that you can use to configure network environment where you can deploy Managed Instance.

  > [!Note]
  > This Azure Resource Manager template will deploy virtual network with two subnets. One subnet called **ManagedInstances** is reserved for Managed Instances and has pre-configured route table, while the other subnet called **Default** is used for other resources that should access Managed Instance (for example, Azure Virtual Machines). You can remove **Default** subnet if you don't need it.

3. Configure network environment. On the following form you can configure parameters of your network environment:

![Configure azure network](./media/sql-database-managed-instance-get-started/create-mi-network-arm.png)

You might change the names of VNet and subnets and adjust IP ranges associated to your networking resources. Once you press "Purchase" button, this form will create and configure your environment. If you don't need two subnets you can delete the default one. 

## Modify an existing virtual network for Managed Instances 

The questions and answers in this section show you how to add a Managed Instance to existing virtual network. 

**Are you using Classic or Resource Manager deployment model for the existing virtual network?** 

You can only create a Managed Instance in Resource Manager virtual networks. 

**Would you like to create new subnet for SQL Managed instance or use existing one?**

If you would like to create new one: 

- Calculate subnet size by following the guidelines in the [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances) section.
- Follow the steps in [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md). 
- Create a route table that contains single entry, **0.0.0.0/0**, as the next hop Internet and associate it with the subnet for the Managed Instance.  

If you want to create a Managed Instance inside an existing subnet, we recommend the following PowerShell script to prepare the subnet.
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

- Validate - Selected virtual netwok and subnet are validated for Managed Instance networking requirements
- Confirm - User is shown a set of changes that need to be made to prepare subnet for Managed Instance deployment and asked for consent
- Prepare - Virtual network and subnet are configured properly

**Do you have custom DNS server configured?** 

If yes, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md). 

- Create the required route table and associate it: see [Create the required route table and associate it](#create-the-required-route-table-and-associate-it)

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing how to create a VNet, create a Managed Instance, and restore a database from a database backup, see [Creating an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md)
