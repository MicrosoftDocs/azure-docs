---
title: Azure SQL Database Managed Instance VNet Configuration | Microsoft Docs
description: This topic describes configuration options for a virtual network (VNet) with an Azure SQL Database Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: bonova, carlrab
manager: craigg
ms.date: 09/20/2018
---
# Configure a VNet for Azure SQL Database Managed Instance

Azure SQL Database Managed Instance must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). This deployment enables the following scenarios: 
- Connecting to a Managed Instance directly from an on-premises network 
- Connecting a Managed Instance to linked server or another on-premises data store 
- Connecting a Managed Instance to Azure resources  

## Plan

Plan how you deploy a Managed Instance in virtual network using your answers to the following questions: 
- Do you plan to deploy single or multiple Managed Instances? 

  The number of Managed Instances determines the minimum size of the subnet to allocate for your Managed Instances. For more information, see [Determine the size of subnet for Managed Instance](#determine-the-size-of-subnet-for-managed-instances). 
- Do you need to deploy your Managed Instance into an existing virtual network or you are creating a new network? 

   If you plan to use an existing virtual network, you need to modify that network configuration to accommodate your Managed Instance. For more information, see [Modify existing virtual network for Managed Instance](#modify-an-existing-virtual-network-for-managed-instances). 

   If you plan to create new virtual network, see [Create new virtual network for Managed Instance](#create-a-new-virtual-network-for-a-managed-instance).

## Requirements

To create a Managed Instance, create a dedicated subnet (the Managed Instance subnet) inside the virtual network that conforms to the following requirements:
- **Dedicated subnet**: The Managed Instance subnet must not contain any other cloud service associated with it, and it must not be a Gateway subnet. You won’t be able to create a Managed Instance in a subnet that contains resources other than Managed Instance, and you can not later add other resources in the subnet.
- **Compatible Network Security Group (NSG)**: An NSG associated with a Managed Instance subnet must contain rules shown in the following tables (Mandatory inbound security rules and Mandatory outbound security rules) in front of any other rules. You can use an NSG to fully control access to the Managed Instance data endpoint by filtering traffic on port 1433. 
- **Compatible user-defined route table (UDR)**: The Managed Instance subnet must have a user route table with **0.0.0.0/0 Next Hop Internet** as the mandatory UDR assigned to it. In addition, you can add a UDR that routes traffic that has on-premises private IP ranges as a destination through virtual network gateway or virtual network appliance (NVA). 
- **Optional custom DNS**: If a custom DNS is specified on the virtual network, Azure's recursive resolver IP address (such as 168.63.129.16) must be added to the list. For more information, see [Configuring Custom DNS](sql-database-managed-instance-custom-dns.md). The custom DNS server must be able to resolve host names in the following domains and their subdomains: *microsoft.com*, *windows.net*, *windows.com*, *msocsp.com*, *digicert.com*, *live.com*, *microsoftonline.com*, and *microsoftonline-p.com*. 
- **No service endpoints**: The Managed Instance subnet must not have a service endpoint associated to it. Make sure that service endpoints option is disabled when creating the virtual network.
- **Sufficient IP addresses**: The Managed Instance subnet must have the bare minimum of 16 IP addresses (recommended minimum is 32 IP addresses). For more information, see [Determine the size of subnet for Managed Instances](#determine-the-size-of-subnet-for-managed-instances)

> [!IMPORTANT]
> You won’t be able to deploy a new Managed Instance if the destination subnet is not compatible with all of these requirements. When a Managed Instance is created, a *Network Intent Policy* is applied on the subnet to prevent non-compliant changes to networking configuration. After the last instance is removed from the subnet, the *Network Intent Policy* is removed as well

### Mandatory inbound security rules 

| NAME       |PORT                        |PROTOCOL|SOURCE           |DESTINATION|ACTION|
|------------|----------------------------|--------|-----------------|-----------|------|
|management  |9000, 9003, 1438, 1440, 1452|TCP     |Any              |Any        |Allow |
|mi_subnet   |Any                         |Any     |MI SUBNET        |Any        |Allow |
|health_probe|Any                         |Any     |AzureLoadBalancer|Any        |Allow |

### Mandatory outbound security rules 

| NAME       |PORT          |PROTOCOL|SOURCE           |DESTINATION|ACTION|
|------------|--------------|--------|-----------------|-----------|------|
|management  |80, 443, 12000|TCP     |Any              |Any        |Allow |
|mi_subnet   |Any           |Any     |Any              |MI SUBNET  |Allow |

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

## Create a new virtual network for a Managed Instance

The easiest way to create and configure virtual network is to use Azure Resource Manager deployment template.

1. Sign in to the Azure portal.

2. Use **Deploy to Azure** button to deploy virtual network in Azure cloud:

  <a target="_blank" href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sql-managed-instance-azure-environment%2Fazuredeploy.json" rel="noopener" data-linktype="external"> <img src="http://azuredeploy.net/deploybutton.png" data-linktype="external"> </a>

  This button will open a form that you can use to configure network environment where you can deploy Managed Instance.

  > [!Note]
  > This Azure Resource Manager template will deploy virtual network with two subnets. One subnet called **ManagedInstances** is reserved for Managed Instances and has pre-configured route table, while the other subnet called **Default** is used for other resources that should access Managed Instance (for example, Azure Virtual Machines). You can remove **Default** subnet if you don't need it.

3. Configure network environment. On the following form you can configure parameters of your network environment:

![Configure azure network](./media/sql-database-managed-instance-vnet-configuration/create-mi-network-arm.png)

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

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing how to create a VNet, create a Managed Instance, and restore a database from a database backup, see [Creating an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).
- For DNS issues, see [Configuring a Custom DNS](sql-database-managed-instance-custom-dns.md)
