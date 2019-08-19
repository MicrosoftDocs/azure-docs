---
title: Azure SQL Database and Data Warehouse Network Access Controls | Microsoft Docs
description: Overview of network access controls for Azure SQL Database and Data Warehouse to manage access, and configure a single or pooled database.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto
ms.date: 08/05/2019
---

# Azure SQL Database and Data Warehouse network access controls

> [!NOTE]
> This article applies to Azure SQL server, and to both SQL Database and SQL Data Warehouse databases that are created on the Azure SQL server. For simplicity, SQL Database is used when referring to both SQL Database and SQL Data Warehouse.

> [!IMPORTANT]
> This article does *not* apply to **Azure SQL Database Managed Instance**. for more information about the networking configuration, see [connecting to a Managed Instance](sql-database-managed-instance-connect-app.md) .

When you create a new Azure SQL Server [from Azure portal](sql-database-single-database-get-started.md), the result is a public endpoint in the format *yourservername.database.windows.net*. By design, all access to the public endpoint is denied. 
You can then use the following network access controls to selectively allow access to the SQl Database via the public endpoint
- Allow Azure Services: - When set to ON, other resources within the Azure boundary, for example an Azure Virtual Machine, can access SQL Database

- IP firewall rules: - Use this feature to explicitly allow connections from a specific IP address, for example from on-premises machines.

- Virtual Network firewall rules: - Use this feature to allow traffic from a specific Virtual Network within the Azure boundary


## Allow Azure services 
During creation of a new Azure SQL Server [from  Azure portal](sql-database-single-database-get-started.md), this setting is left unchecked.

 ![Screenshot of new server create][1]

You can also change this setting via the firewall pane after the Azure SQL Server is created as follows.
  
 ![Screenshot of manage server firewall][2]

When set  to **ON** Azure SQL Server allows communications from all resources inside the Azure boundary, that may or may not be part of your subscription.

In many cases, the **ON** setting is more permissive than what most customers want.They may want to set this setting to **OFF** and replace it with more restrictive IP firewall rules or Virtual Network firewall rules. Doing so affects the following features:

### Import Export Service

Azure SQL Database Import Export Service runs on VMs in Azure. These VMs are not in your VNet and hence get an Azure IP when connecting to your
database. On removing **Allow Azure services to access server** these VMs will not be able to access your databases.
You can work around the problem by running the BACPAC import or export directly in your code by using the DACFx API.

### SQL Database Query Editor

The Azure SQL Database Query Editor is deployed on VMs in Azure. These VMs are not in your VNet. Therefore the VMs get an Azure IP when connecting to your database. On removing **Allow Azure services to access server**, these VMs will not be able to access your databases.

### Table Auditing

At present, there are two ways to enable auditing on your SQL Database. Table auditing fails after you have enabled service endpoints on your Azure SQL Server. Mitigation here is to move to Blob auditing.

### Impact on Data Sync

Azure SQL Database has the Data Sync feature that connects to your databases using Azure IPs. When using service endpoints, you will turn off **Allow Azure services to access server** access to your SQL Database server and will break the Data Sync feature.

## IP firewall rules
Ip based firewall is a feature of Azure SQL Server that prevents all access to your database server until you explicitly [add IP addresses](sql-database-server-level-firewall-rule.md) of the client machines.


## Virtual Network firewall rules

In addition to IP rules, the Azure SQL Server firewall allows you to define *virtual network rules*.  
To learn more, see [Virtual Network service endpoints and rules for Azure SQL Database](sql-database-vnet-service-endpoint-rule-overview.md).

 ### Azure Networking terminology  
Be aware of the following Azure Networking terms as you explore Virtual Network firewall rules

**Virtual network:** You can have virtual networks associated with your Azure subscription 

**Subnet:** A virtual network contains **subnets**. Any Azure virtual machines (VMs) that you have are assigned to subnets. One subnet can contain multiple VMs or other compute nodes. Compute nodes that are outside of your virtual network cannot access your virtual network unless you configure your security to allow access.

**Virtual Network service endpoint:** A [Virtual Network service endpoint][vm-virtual-network-service-endpoints-overview-649d] is a subnet whose property values include one or more formal Azure service type names. In this article we are interested in the type name of **Microsoft.Sql**, which refers to the Azure service named SQL Database.

**Virtual network rule:** A virtual network rule for your SQL Database server is a subnet that is listed in the access control list (ACL) of your SQL Database server. To be in the ACL for your SQL Database, the subnet must contain the **Microsoft.Sql** type name. A virtual network rule tells your SQL Database server to accept communications from every node that is on the subnet.


## IP vs. Virtual Network firewall rules

The Azure SQL Server firewall allows you to specify IP address ranges from which communications are accepted into SQL Database. This approach is fine for stable IP addresses that are outside the Azure private network. However, virtual machines (VMs) within the Azure private network are configured with *dynamic* IP addresses. Dynamic IP addresses can change when your VM is restarted and in turn invalidate the IP-based firewall rule. It would be folly to specify a dynamic IP address in a firewall rule, in a production environment.

You can work around this limitation by obtaining a *static* IP address for your VM. For details, see [Configure private IP addresses for a virtual machine by using the Azure portal][vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w].However, the static IP approach can become difficult to manage, and it is costly when done at scale. 

Virtual network rules are easier alternative to establish and to manage access from a specific subnet that contains your VMs.

> [!NOTE]
> You cannot yet have SQL Database on a subnet. If your Azure SQL Database server was a node on a subnet in your virtual network, all nodes within the virtual network could communicate with your SQL Database. In this case, your VMs could communicate with SQL Database without needing any virtual network rules or IP rules.

## Next steps

- For a quickstart on creating a server-level IP firewall rule, see [Create an Azure SQL database](sql-database-single-database-get-started.md).

- For a quickstart on creating a server-level Vnet firewall rule, see [Virtual Network service endpoints and rules for Azure SQL Database](sql-database-vnet-service-endpoint-rule-overview.md).

- For help with connecting to an Azure SQL database from open source or third-party applications, see [Client quickstart code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).

- For information on additional ports that you may need to open, see the **SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md)

- For an overview of Azure SQL Database Connectivity, see [Azure SQL Connectivity Architecture](sql-database-connectivity-architecture.md)

- For an overview of Azure SQL Database security, see [Securing your database](sql-database-security-overview.md)

<!--Image references-->
[1]: ./media/sql-database-get-started-portal/new-server2.png
[2]: ./media/sql-database-get-started-portal/manage-server-firewall.png
