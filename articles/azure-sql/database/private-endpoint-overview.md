---
title: Azure Private Link
description: Overview of Private endpoint feature.
author: rohitnayakmsft
ms.author: rohitna
titleSuffix: Azure SQL Database and Azure Synapse Analytics
ms.service: sql-database
ms.topic: overview 
ms.custom: sqldbrb=1
ms.reviewer: vanto
ms.date: 03/09/2020
---

# Azure Private Link for Azure SQL Database and Azure Synapse Analytics
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

Private Link allows you to connect to various PaaS services in Azure via a **private endpoint**. For a list of PaaS services that support Private Link functionality, go to the [Private Link Documentation](../../private-link/index.yml) page. A private endpoint is a private IP address within a specific [VNet](../../virtual-network/virtual-networks-overview.md) and subnet.

> [!IMPORTANT]
> This article applies to both Azure SQL Database and Azure Synapse Analytics (formerly Azure SQL Data Warehouse). For simplicity, the term 'database' refers to both databases in Azure SQL Database and Azure Synapse Analytics. Likewise, any references to 'server' is referring to the [logical SQL server](logical-servers.md) that hosts Azure SQL Database and Azure Synapse Analytics. This article does *not* apply to **Azure SQL Managed Instance**.

## Data exfiltration prevention

Data exfiltration in Azure SQL Database is when an authorized user, such as a database admin is able extract data from one system and move it another location or system outside the organization. For example, the user moves the data to a storage account owned by a third party.

Consider a scenario with a user running SQL Server Management Studio (SSMS) inside an Azure virtual machine connecting to a database in SQL Database. This database is in the West US data center. The example below shows how to limit access with public endpoints on SQL Database using network access controls.

1. Disable all Azure service traffic to SQL Database via the public endpoint by setting Allow Azure Services to **OFF**. Ensure no IP addresses are allowed in the server and database level firewall rules. For more information, see [Azure SQL Database and Azure Synapse Analytics network access controls](network-access-controls-overview.md).
1. Only allow traffic to the database in SQL Database using the Private IP address of the VM. For more information, see the articles on [Service Endpoint](vnet-service-endpoint-rule-overview.md) and [virtual network firewall rules](firewall-configure.md).
1. On the Azure VM, narrow down the scope of outgoing connection by using [Network Security Groups (NSGs)](../../virtual-network/manage-network-security-group.md) and Service Tags as follows
    - Specify an NSG rule to allow traffic for Service Tag = SQL.WestUs - only allowing connection to SQL Database in West US
    - Specify an NSG rule (with a **higher priority**) to deny traffic for Service Tag = SQL - denying connections to SQL Database in all regions

At the end of this setup, the Azure VM can connect only to a database in SQL Database in the West US region. However, the connectivity isn't restricted to a single database in SQL Database. The VM can still connect to any database in the West US region, including the databases that aren't part of the subscription. While we've reduced the scope of data exfiltration in the above scenario to a specific region, we haven't eliminated it altogether.

With Private Link, customers can now set up network access controls like NSGs to restrict access to the private endpoint. Individual Azure PaaS resources are then mapped to specific private endpoints. A malicious insider can only access the mapped PaaS resource (for example a database in SQL Database) and no other resource. 

## On-premises connectivity over private peering

When customers connect to the public endpoint from on-premises machines, their IP address needs to be added to the IP-based firewall using a [Server-level firewall rule](firewall-create-server-level-portal-quickstart.md). While this model works well for allowing access to individual machines for dev or test workloads, it's difficult to manage in a production environment.

With Private Link, customers can enable cross-premises access to the private endpoint using [ExpressRoute](../../expressroute/expressroute-introduction.md), private peering, or VPN tunneling. Customers can then disable all access via the public endpoint and not use the IP-based firewall to allow any IP addresses.

## How to set up Private Link for Azure SQL Database 

### Creation Process
Private Endpoints can be created using the Azure portal, PowerShell, or the Azure CLI:
- [The portal](../../private-link/create-private-endpoint-portal.md)
- [PowerShell](../../private-link/create-private-endpoint-powershell.md)
- [CLI](../../private-link/create-private-endpoint-cli.md)

### Approval process
Once the network admin creates the Private Endpoint (PE), the SQL admin can manage the Private Endpoint Connection (PEC) to SQL Database.

1. Navigate to the server resource in the Azure portal as per steps shown in the screenshot below

    - (1) Select the Private endpoint connections in the left pane
    - (2) Shows a list of all Private Endpoint Connections (PECs)
    - (3) Corresponding Private Endpoint (PE) created
![Screenshot of all PECs][3]

1. Select an individual PEC from the list by selecting it.
![Screenshot selected PEC][6]

1. The SQL admin can choose to approve or reject a PEC and optionally add a short text response.
![Screenshot of PEC approval][4]

1. After approval or rejection, the list will reflect the appropriate state along with the response text.
![Screenshot of all PECs after approval][5]

## Use cases of Private Link for Azure SQL Database 

Clients can connect to the Private endpoint from the same virtual network, peered virtual network in same region, or via virtual network to virtual network connection across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

 ![Diagram of connectivity options][1]

## Test connectivity to SQL Database from an Azure VM in same virtual network

For this scenario, assume you've created an Azure Virtual Machine (VM) running Windows Server 2016. 

1. [Start a Remote Desktop (RDP) session and connect to the virtual machine](../../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine). 
1. You can then do some basic connectivity checks to ensure that the VM is connecting to SQL Database via the private endpoint using the following tools:
    1. Telnet
    1. Psping
    1. Nmap
    1. SQL Server Management Studio (SSMS)

### Check Connectivity using Telnet

[Telnet Client](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754293%28v%3dws.10%29) is a Windows feature that can be used to test connectivity. Depending on the version of the Windows OS, you may need to enable this feature explicitly. 

Open a Command Prompt window after you have installed Telnet. Run the Telnet command and specify the IP address and private endpoint of the database in SQL Database.

```
>telnet 10.1.1.5 1433
```

When Telnet connects successfully, you'll see a blank screen at the command window like the below image:

 ![Diagram of telnet][2]

### Check Connectivity using Psping

[Psping](/sysinternals/downloads/psping) can be used as follows to check that the Private endpoint connection(PEC) is listening for connections on port 1433.

Run psping as follows by providing the FQDN for logical SQL server and port 1433:

```
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
```

The output show that Psping could ping the private IP address associated with the PEC.

### Check connectivity using Nmap

Nmap (Network Mapper) is a free and open-source tool used for network discovery and security auditing. For more information and the download link, visit https://nmap.org. You can use this tool to ensure that the private endpoint is listening for connections on port 1433.

Run Nmap as follows by providing the address range of the subnet that hosts the private endpoint.

```
>nmap -n -sP 10.1.1.0/24
...
...
Nmap scan report for 10.1.1.5
Host is up (0.00s latency).
Nmap done: 256 IP addresses (1 host up) scanned in 207.00 seconds
```

The result shows that one IP address is up; which corresponds to the IP address for the private endpoint.

### Check connectivity using SQL Server Management Studio (SSMS)
> [!NOTE]
> Use the **Fully Qualified Domain Name (FQDN)** of the server in connection strings for your clients. Any login attempts made directly to the IP address shall fail. This behavior is by design, since private endpoint routes traffic to the SQL Gateway in the region and the FQDN needs to be specified for logins to succeed.

Follow the steps here to use [SSMS to connect to the SQL Database](connect-query-ssms.md). After you connect to the SQL Database using SSMS, verify that you're connecting from the private IP address of the Azure VM by running the following query:

````
select client_net_address from sys.dm_exec_connections 
where session_id=@@SPID
````

## Limitations 
Connections to private endpoint only support **Proxy** as the [connection policy](connectivity-architecture.md#connection-policy)


## Connecting from an Azure VM in Peered Virtual Network 

Configure [virtual network peering](../../virtual-network/tutorial-connect-virtual-networks-powershell.md) to establish connectivity to the SQL Database from an Azure VM in a peered virtual network.

## Connecting from an Azure VM in virtual network to virtual network environment

Configure [virtual network to virtual network VPN gateway connection](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) to establish connectivity to a database in SQL Database from an Azure VM in a different region or subscription.

## Connecting from an on-premises environment over VPN

To establish connectivity from an on-premises environment to the database in SQL Database, choose and implement one of the options:
- [Point-to-Site connection](../../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)
- [Site-to-Site VPN connection](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
- [ExpressRoute circuit](../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)


## Connecting from Azure Synapse Analytics to Azure Storage using Polybase

PolyBase is commonly used to load data into Azure Synapse Analytics from Azure Storage accounts. If the Azure Storage account that you're loading data from limits access only to a set of virtual network subnets via Private Endpoints, Service Endpoints, or IP-based firewalls, the connectivity from PolyBase to the account will break. For enabling both PolyBase import and export scenarios with Azure Synapse Analytics connecting to Azure Storage that's secured to a virtual network, follow the steps provided [here](vnet-service-endpoint-rule-overview.md#impact-of-using-vnet-service-endpoints-with-azure-storage). 

## Next steps

- For an overview of Azure SQL Database security, see [Securing your database](security-overview.md)
- For an overview of Azure SQL Database connectivity, see [Azure SQL Connectivity Architecture](connectivity-architecture.md)

<!--Image references-->
[1]: media/quickstart-create-single-database/pe-connect-overview.png
[2]: media/quickstart-create-single-database/telnet-result.png
[3]: media/quickstart-create-single-database/pec-list-before.png
[4]: media/quickstart-create-single-database/pec-approve.png
[5]: media/quickstart-create-single-database/pec-list-after.png
[6]: media/quickstart-create-single-database/pec-select.png
