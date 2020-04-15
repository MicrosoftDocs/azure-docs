---
title: Network Access Controls 
description: Overview of network access controls for Azure SQL Database and Data Warehouse to manage access, and configure a single or pooled database.
services: sql-database
ms.service: sql-database
ms.subservice: security
titleSuffix: Azure SQL Database and SQL Data Warehouse
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto
ms.date: 03/09/2020
---

# Azure SQL Database and Data Warehouse network access controls

> [!NOTE]
> This article applies to Azure SQL server, and to both SQL Database and SQL Data Warehouse databases that are created on the Azure SQL server. For simplicity, SQL Database is used when referring to both SQL Database and SQL Data Warehouse.

> [!IMPORTANT]
> This article does *not* apply to **Azure SQL Database Managed Instance**. for more information about the networking configuration, see [connecting to a Managed Instance](sql-database-managed-instance-connect-app.md) .

When you create a new Azure SQL Server from the [Azure portal](sql-database-single-database-get-started.md), the result is a public endpoint in the format, *yourservername.database.windows.net*.

You can use the following network access controls to selectively allow access to the SQL Database via the public endpoint:
- Allow Azure Services: When set to ON, other resources within the Azure boundary, for example an Azure Virtual Machine, can access SQL Database

- IP firewall rules: Use this feature to explicitly allow connections from a specific IP address, for example from on-premises machines

You can also allow private access to the SQL Database from [Virtual Networks](../virtual-network/virtual-networks-overview.md) via:
- Virtual Network firewall rules: Use this feature to allow traffic from a specific Virtual Network within the Azure boundary

- Private Link: Use this feature to create a private endpoint for Azure SQL Server within a specific Virtual Network



See the below video for a high level explanation of these access controls and what they do:
> [!VIDEO https://channel9.msdn.com/Shows/Data-Exposed/Data-Exposed--SQL-Database-Connectivity-Explained/player?WT.mc_id=dataexposed-c9-niner]


## Allow Azure services 
During creation of a new Azure SQL Server [from  Azure portal](sql-database-single-database-get-started.md), this setting is left unchecked.



You can also change this setting via the firewall pane after the Azure SQL Server is created as follows.
  
 ![Screenshot of manage server firewall][2]

When set  to **ON** Azure SQL Server allows communications from all resources inside the Azure boundary, that may or may not be part of your subscription.

In many cases, the **ON** setting is more permissive than what most customers want. They may want to set this setting to **OFF** and replace it with more restrictive IP firewall rules or Virtual Network firewall rules. Doing so affects the following features that run on VMs in Azure that not part of your VNet and hence connect to Sql Database via an Azure IP address.

### Import Export Service
Import Export Service does not work when **Allow access to Azure services** is set to **OFF**. However you can work around the problem [by manually running sqlpackage.exe from an Azure VM or performing the export](https://docs.microsoft.com/azure/sql-database/import-export-from-vm) directly in your code by using the DACFx API.

### Data Sync
To use the Data sync feature with **Allow access to Azure services** set to **OFF**, you need to create individual firewall rule entries to [add IP addresses](sql-database-server-level-firewall-rule.md) from the **Sql service tag** for the region hosting the **Hub** database.
Add these server level firewall rules to the logical servers hosting both **Hub** and **Member** databases ( which may be in different regions)

Use the following PowerShell script to generate the IP addresses corresponding to Sql service tag for West US region
```powershell
PS C:\>  $serviceTags = Get-AzNetworkServiceTag -Location eastus2
PS C:\>  $sql = $serviceTags.Values | Where-Object { $_.Name -eq "Sql.WestUS" }
PS C:\> $sql.Properties.AddressPrefixes.Count
70
PS C:\> $sql.Properties.AddressPrefixes
13.86.216.0/25
13.86.216.128/26
13.86.216.192/27
13.86.217.0/25
13.86.217.128/26
13.86.217.192/27
```

> [!TIP]
> Get-AzNetworkServiceTag returns the global range for Sql Service Tag despite specifying the Location parameter. Be sure to filter it to the region that hosts the Hub database used by your sync group

Note that the output of the PowerShell script is in  Classless Inter-Domain Routing (CIDR) notation and this needs to be converted to a format of Start and End IP address using [Get-IPrangeStartEnd.ps1](https://gallery.technet.microsoft.com/scriptcenter/Start-and-End-IP-addresses-bcccc3a9) like this
```powershell
PS C:\> Get-IPrangeStartEnd -ip 52.229.17.93 -cidr 26                                                                   
start        end
-----        ---
52.229.17.64 52.229.17.127
```

Do the following additional steps to convert all the IP addresses from CIDR to Start and End IP address format.

```powershell
PS C:\>foreach( $i in $sql.Properties.AddressPrefixes) {$ip,$cidr= $i.split('/') ; Get-IPrangeStartEnd -ip $ip -cidr $cidr;}                                                                                                                
start          end
-----          ---
13.86.216.0    13.86.216.127
13.86.216.128  13.86.216.191
13.86.216.192  13.86.216.223
```
You can now add these as distinct firewall rules and then set **Allow Azure services to access server**  to OFF.


## IP firewall rules
Ip based firewall is a feature of Azure SQL Server that prevents all access to your database server until you explicitly [add IP addresses](sql-database-server-level-firewall-rule.md) of the client machines.


## Virtual Network firewall rules

In addition to IP rules, the Azure SQL Server firewall allows you to define *virtual network rules*.  
To learn more, see [Virtual Network service endpoints and rules for Azure SQL Database](sql-database-vnet-service-endpoint-rule-overview.md) or watch this video:

> [!VIDEO https://channel9.msdn.com/Shows/Data-Exposed/Data-Exposed--Demo--Vnet-Firewall-Rules-for-SQL-Database/player?WT.mc_id=dataexposed-c9-niner]

 ### Azure Networking terminology  
Be aware of the following Azure Networking terms as you explore Virtual Network firewall rules

**Virtual network:** You can have virtual networks associated with your Azure subscription 

**Subnet:** A virtual network contains **subnets**. Any Azure virtual machines (VMs) that you have are assigned to subnets. One subnet can contain multiple VMs or other compute nodes. Compute nodes that are outside of your virtual network cannot access your virtual network unless you configure your security to allow access.

**Virtual Network service endpoint:** A [Virtual Network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) is a subnet whose property values include one or more formal Azure service type names. In this article we are interested in the type name of **Microsoft.Sql**, which refers to the Azure service named SQL Database.

**Virtual network rule:** A virtual network rule for your SQL Database server is a subnet that is listed in the access control list (ACL) of your SQL Database server. To be in the ACL for your SQL Database, the subnet must contain the **Microsoft.Sql** type name. A virtual network rule tells your SQL Database server to accept communications from every node that is on the subnet.


## IP vs. Virtual Network firewall rules

The Azure SQL Server firewall allows you to specify IP address ranges from which communications are accepted into SQL Database. This approach is fine for stable IP addresses that are outside the Azure private network. However, virtual machines (VMs) within the Azure private network are configured with *dynamic* IP addresses. Dynamic IP addresses can change when your VM is restarted and in turn invalidate the IP-based firewall rule. It would be folly to specify a dynamic IP address in a firewall rule, in a production environment.

You can work around this limitation by obtaining a *static* IP address for your VM. For details, see [Configure private IP addresses for a virtual machine by using the Azure portal](../virtual-network/virtual-networks-static-private-ip-arm-pportal.md). However, the static IP approach can become difficult to manage, and it is costly when done at scale. 

Virtual network rules are easier alternative to establish and to manage access from a specific subnet that contains your VMs.

> [!NOTE]
> You cannot yet have SQL Database on a subnet. If your Azure SQL Database server was a node on a subnet in your virtual network, all nodes within the virtual network could communicate with your SQL Database. In this case, your VMs could communicate with SQL Database without needing any virtual network rules or IP rules.

## Private Link 
Private Link allows you to connect to Azure SQL Server via a **private endpoint**. A private endpoint is a private IP address within a specific [Virtual Network](../virtual-network/virtual-networks-overview.md) and Subnet.

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

