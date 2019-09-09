---
title: Private Link for Azure SQL Database and Data Warehouse  | Microsoft Docs
description: Overview of Private endpoint feature
author: rohitnayakmsft
ms.author: rohitna
ms.service: sql-database
ms.topic: overview 
ms.reviewer: vanto
ms.date: 08/07/2019
---

# What is Private Link?
Private Link allows you to connect to various PaaS services in Azure via a **private endpoint**. For a list to PaaS services that support Private Link functionality go to https://docs.microsoft.com/en-us/azure/privatelink. A private endpoint resource maps to a specific private IP address within a specific Virtual Network(Vnet) and Subnet. 

For Azure SQL Database, we have traditionally provided [network access controls](sql-database-networkaccess-overview.md) to limit the options for connecting via public endpoint. However these controls failed to properly address customers concerns around data exfiltration prevention and  on-premises connectivity via private peering.

## Data Exfiltration prevention
Data exfiltration - in context of Azure SQL Database - is when an authorized user, for example,  database admin is able extract data from one system - SQL Database owned by their organization - and move it another location/system outside the organization, for example,  SQL Database or storage account owned by a third party.

With Private Link, customers can now set up standard network access controls on the client side to restrict access to the private endpoint. Individual Azure PaaS resources are mapped to specific private endpoints. Hence a malicious insider can only access the mapped PaaS resource (for example a SQL Database) and no other resource - thereby providing data exfiltration prevention capability

## On-premises connectivity over private peering
When customers connect to the public endpoint from on-premises machines, their IP address needs to be added to the IP-based firewall via a [Server-level firewall rule](sql-database-server-level-firewall-rule.md). 

With Private Link, customers can enable cross-premises access to the private endpoint using ER private peering or VPN tunnel.They can subsequently disable all access via public endpoint and not use the IP-based firewall.

## How to set up Private Link for Azure SQL Database 
Private endpoints(PEs) can be created as follows
- Portal: https://docs.microsoft.com/en-us/azure/privatelink/create-privatelink-portal
- PowerShell: https://docs.microsoft.com/en-us/azure/privatelink/create-privatelink-powershell
- CLI: https://docs.microsoft.com/en-us/azure/privatelink/create-privatelink-cli

### Approval Process
Once the network admin creates the Private Endpoint(PE), the Sql admin shall manage the Private Endpoint Connection (PEC) to SQL Database. 
Browse down to the Private endpoint connections blade(#1 in the screenshot below) to see a list of all Private Endpoint Connections(PECs) (#2) corresponding to each Private Endpoint(PE) (#3) created
 ![Screenshot of all PECs][3]

Select an individual PEC from the list by clicking on it
![Screenshot-selected PEC][6]

Sql Admin can choose Approve or Reject a PEC and optionally add a short text response 
![Screenshot of PEC approval][4]

After approval/ rejection the list will reflect the appropriate state along with the response text
![Screenshot of all PECs after approval][5]

## Use cases of Private Link for Azure SQL Database 
Clients can connect to  the Private endpoint from the same Vnet, peered Vnet in same region or via Vnet2Vnet connection across regions. Additionally they can connect from on-premises using ER private peering or VPN tunnel. Here is a simplified diagram showing the common use cases.

 ![Diagram of connectivity options][1]

### Connect – From Azure VM in same Virtual Network(VNET) 
For this scenario let us assume you have created an Azure Virtual Machine (VM) running Windows Server 2016.

Start a Remote Desktop (RDP) session following steps given here https://docs.microsoft.com/en-us/azure/virtual-machines/windows/connect-logon#connect-to-the-virtual-machine. You can then do some basic connectivity checks to ensure that VM is connecting to SQL Database via the Private endpoint connection(PEC)

### Check Connectivity - Telnet
Telnet Client is a Windows feature that can be used to test connectivity. Depending on the version of the Windows OS, you may need to enable this feature explicitly. 

Run the telnet command with the private endpoint as follows
````
>telnet 10.1.1.5 1433
````
When telnet connects successfully, you will see a blank screen at the command window like this 

 ![Diagram of telnet][2]

### Check Connectivity – Psping
[Psping](https://docs.microsoft.com/en-us/sysinternals/downloads/psping) can be used as follows to check that the Private endpoint connection(PEC) is listening for connections on port 1433 

Run psping as follows by providing the FQDn for your SQL Database server and port 1433
````
>psping.exe mysqldbsrvr.database.windows.net:1433

PsPing v2.10 - PsPing - ping, latency, bandwidth measurement utility
Copyright (C) 2012-2016 Mark Russinovich
Sysinternals - www.sysinternals.com

TCP connect to 10.6.1.4:1433:
5 iterations (warmup 1) ping test:
Connecting to 10.6.1.4:1433 (warmup): from 10.6.0.4:49953: 2.83ms
Connecting to 10.6.1.4:1433: from 10.6.0.4:49954: 1.26ms
Connecting to 10.6.1.4:1433: from 10.6.0.4:49955: 1.98ms
Connecting to 10.6.1.4:1433: from 10.6.0.4:49956: 1.43ms
Connecting to 10.6.1.4:1433: from 10.6.0.4:49958: 2.28ms
````
The output show that Psping could ping the private IP address associated with the PEC

### Check Connectivity – Nmap 
Nmap("Network Mapper") is a free and open-source tool used for network discovery and security auditing. It is available for download at https://nmap.org/. In this case, you can use it to ensure that the private endpoint is listening for connections on port 1433.

Run nmap as follows  by providing the address range of the subnet that hosts the private endpoint 
````
>nmap -n -sP 10.1.1.0/24
...
...
Nmap scan report for 10.1.1.5
Host is up (0.00s latency).
Nmap done: 256 IP addresses (1 host up) scanned in 207.00 seconds
````

The result shows that one IP address is up; which corresponds to the IP address for the private endpoint.


### Check Connectivity – SQL Server Management Studio (SSMS)
Finally you can use [SSMS to connect to SQL Database](sql-database-connect-query-ssms.md) and then verify that you are connecting from the private IP address of the Azure Vm by running the following query 

````
select client_net_address from sys.dm_exec_connections 
where session_id=@@SPID
````

### Connect – From Azure VM in Peered Virtual Network(VNET) 
Configure [VNET peering](https://docs.microsoft.com/en-us/azure/virtual-network/tutorial-connect-virtual-networks-powershell) to establish connectivity from Azure VM in a peered Vnet.

### Connect – From Azure VM in Vnet2Vnet
Configure [VNet-to-VNet VPN gateway connection](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal) to establish connectivity from Azure VM in a different region and/or subscription.

### Connect – From on-premises over VPN
To establish connectivity from on-premises, choose & implement one of the options given below
- [Point-to-Site connection](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)
- [Site-to-Site VPN connection](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell)
- [ExpressRoute circuit](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager)

## Next steps
- For an overview of Azure SQL Database security, see [Securing your database](sql-database-security-overview.md)
- For an overview of Azure SQL Database Connectivity, see [Azure SQL Connectivity Architecture](sql-database-connectivity-architecture.md)

<!--Image references-->
[1]: ./media/sql-database-get-started-portal/pe-connect-overview.png
[2]: ./media/sql-database-get-started-portal/telnet-result.png
[3]: ./media/sql-database-get-started-portal/pec-list-before.png
[4]: ./media/sql-database-get-started-portal/pec-approve.png
[5]: ./media/sql-database-get-started-portal/pec-list-after.png
[6]: ./media/sql-database-get-started-portal/pec-select.png