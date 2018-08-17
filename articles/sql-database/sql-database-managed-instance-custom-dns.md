---
title: Azure SQL Database Managed Instance Custom DNS | Microsoft Docs
description: This topic describes configuration options for a custom DNS with an Azure SQL Database Managed Instance.
services: sql-database
author: srdan-bozovic-msft
manager: craigg
ms.service: sql-database
ms.custom: managed instance
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: srbozovi
ms.reviewer: bonova, carlrab
---

# Configuring a Custom DNS for Azure SQL Database Managed Instance

An Azure SQL Database Managed Instance (preview) must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). There are a few scenarios, linked servers to other SQL instances in your cloud or hybrid environment, that require private host names to be resolved from the Managed Instance. In this case, you need to configure a custom DNS inside Azure. Since Managed Instance uses the same DNS for its inner workings, the virtual network DNS configuration needs to be compatible with Managed Instance. 

To make a custom DNS configuration compatible with Managed Instance, you need to complete the following steps: 
- Configure Custom DNS to forward requests to Azure DNS 
- Set up the Custom DNS as primary and Azure DNS as secondary for the VNet 
- Register the Custom DNS as primary and Azure DNS as secondary

## Configure Custom DNS to forward requests to Azure DNS 

To configure DNS forwarding on Windows Server 2016, use these steps: 

1. In **Server Manager**, click **Tools**, and then click **DNS**. 

   ![DNS](./media/sql-database-managed-instance-custom-dns/dns.png) 

2. Double-click **Forwarders**.

   ![Forwarders](./media/sql-database-managed-instance-custom-dns/forwarders.png) 

3. Click **Edit**. 

   ![Forwarders-list](./media/sql-database-managed-instance-custom-dns/forwarders-list.png) 

4. Enter Azure's recursive resolvers IP address, such as 168.63.129.16.

   ![Recursive resolvers ip address](./media/sql-database-managed-instance-custom-dns/recursive-resolvers-ip-address.png) 
 
## Set up Custom DNS as primary and Azure DNS as secondary 
 
DNS configuration on an Azure VNet requires that you enter IP addresses, so configure the Azure VM that hosts the DNS server with a static IP address using the following next steps: 

1. In the Azure portal, open the custom DNS VM network interface.

   ![network-interface](./media/sql-database-managed-instance-custom-dns/network-interface.png) 

2. In IP Configurations section. select IP configuration 

   ![ip configuration](./media/sql-database-managed-instance-custom-dns/ip-configuration.png) 


3. Set private IP address as Static. Write down the IP address (10.0.1.5 on this screenshot) 

   ![static](./media/sql-database-managed-instance-custom-dns/static.png) 


## Register Custom DNS as primary and Azure DNS as secondary 

1. In the Azure portal, find custom DNS option for your VNet.

   ![custom dns option](./media/sql-database-managed-instance-custom-dns/custom-dns-option.png) 

2. Switch to Custom and enter your custom DNS server IP address as well as Azure's recursive resolvers IP address, such as 168.63.129.16. 

   ![custom dns option](./media/sql-database-managed-instance-custom-dns/custom-dns-server-ip-address.png) 

   > [!IMPORTANT]
   > Not setting Azure’s recursive resolver in DNS list causes the Managed Instance to enter faulty state. Recovering from that state may require you to create new instance in a VNet with the compliant networking policies, create instance level data, and restore your databases. See [VNet Configuration](sql-database-managed-instance-vnet-configuration.md).

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing you how to create a new Managed Instance, see [Creating a Managed Instance](sql-database-managed-instance-create-tutorial-portal.md).
- For information about configuring a VNet for a Managed Instance, see [VNet configuration for Managed Instances](sql-database-managed-instance-vnet-configuration.md)
