---
title: Private Link for Azure SQL Database and Data Warehouse  | Microsoft Docs
description: Overview of Private endpoint feature
author: rohitnayakmsft
ms.author: rohitna
ms.service: sql-database
ms.topic: overview 
ms.date: 08/07/2019
---

# What is Private Link?
Private Link allows you to connect to various PaaS services in Azure via a **private endpoint**. For a list to PaaS services that support Private Link functionality go to http://aka.ms/privatelink. A private endpoint is essentially a private IP address within a specific Vnet and Subnet. 

For Azure SQL Database, we have traditionally provided [network access controls](sql-database-networkaccess-overview.md) to limit the options for connecting via public endpoint. However these controls failed to properly address customers concerns around data exfiltration prevention and  on-premises connectivity via private peering.

## Data Exfiltration prevention
Data exfiltration - in context of Azure SQL Database - is when an authorized user, for example,  database admin is able extract data from one system - SQL Database owned by their organization - and move it another location/system outside the organization, for example,  SQL Database or storage account owned by a third party.

Let us consider a simple scenario with a user running SQL Server Management Studio (SSMS) inside Azure VM connecting to SQL Database in West US data center. Here is how we could use the current set of network access controls to tighten down access via public endpoints.

On Sql Database, we shall disable all logins via the public endpoint by setting Allow Azure Services to  **OFF** and ensuring no IP addresses are whitelisted in the server and database level firewall rules. Next we shall specifically whitelist traffic using Private Ip address of the VM via Service Endpoint and Vnet Firewall rules.

Next on the Azure VM, we shall narrow down the scope of outgoing connection by using Network Security Groups(NSGs) and Service Tags as follows
- Specify an NSG rule to allow traffic for  Service Tag = SQL.WestUs
- Specify an NSG rule to deny traffic for  Service Tag = SQL (This will deny all other regions)

At the end of this setup, the Azure VM can connect only to SQL Database in the West US region. However. note that the connectivity is not restricted to a single SQL Database; rather it can connect to any SQL Database in the West US region; including those that are not part of the subscription. While we have reduced the scope of data exfiltration to a specific region, we have not eliminated it altogether. 

With Private Link, customers can now set up standard network access controls like NSGs to restrict access to the private endpoint. Individual Azure PaaS resources are mapped to specific private endpoints. Hence a malicious insider can only access the mapped PaaS resource (for example a SQL Database) and no other resource - thereby providing data exfiltration prevention capability

## On-premises connectivity over private peering
When customers connect to the public endpoint from on-premises machines, their IP address needs to be added to the IP-based firewall via a [Server-level firewall rule](sql-database-server-level-firewall-rule.md). While this model works well for whitelisting individual machines for dev/test workloads, it is difficult to manage in a production environment. 
With Private Link, customers can enable cros-premises access to the private endpoint using ER private peering or VPN tunnel.They can subsequently disable all access via public endpoint and not use the IP-based firewall to allow any IP addresses.


## How to set up Private Link for Azure SQL Database 

### Creation Process
*TBD Azure Networking docs TBD*
### DNS configuration process
*TBD Azure Networking docs TBD*

### Approval Process
Once the network admin creates the Private Endpoint(PE), the Sql admin shall manage the Private Endpoint Connection (PEC) to SQL Database. Browse down to the Private endpoint connections blade under SQL Server that will show result like this listing all the PECs and their states
 ![Screenshot of all PECs][3]

Click on individual PECs in Pending State and then choose Approve or Reject. 
![Screenshot of PEC approval][4]

After approval/ rejection the list will reflect the appropriate state
![Screenshot of all PECs after approval][5]

## Use cases of Private Link for Azure SQL Database 
Clients can connect to  the Private endpoint from the same Vnet, peered Vnet in same region or via Vnet2Vnet connection across regions. Additionally they can connect from on-premises using ER private peering or VPN tunnel. Here is a simplified diagram showing the common use cases.

 ![Diagram of connectivity options][1]

### Connect – From Azure VM in same Virtual Network(VNET) 
For this scenario let us assume you have created an Azure Virtual Machine (VM) running Windows Server 2016. 

 Start a Remote Desktop (RDP) session following steps given here https://docs.microsoft.com/en-us/azure/virtual-machines/windows/connect-logon#connect-to-the-virtual-machine. You can then do some basic connectivity checks to ensure that VM is connecting to SQL Database via the private endpoint.

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

The result indicates that there is one IP address that is up; which corresponds to the IP address for the private endpoint.

### Check Connectivity - Telnet
Telnet Client is a Windows feature that can be used to test connectivity. Depending on the version of the Windows OS, you may need to enable this feature explicitly. 

Run the telnet command with the private endpoint as follows
````
>telnet 10.1.1.5 1433
````
When telnet connects successfully, you will see a blank screen at the command window like this 

 ![Diagram of telnet][2]

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