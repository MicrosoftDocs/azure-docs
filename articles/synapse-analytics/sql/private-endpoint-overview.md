---
title: Azure Private Link
titleSuffix: Azure Synapse Analytics
description: Understand private endpoints and Azure Private Link for dedicated and serverless SQL pools in Azure Synapse Analytics.
author: VanMSFT
ms.author: vanto
ms.reviewer: vanto
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: overview
---

# Azure Private Link for Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

By using [Azure Private Link](/azure/private-link/private-link-overview), you can connect to Synapse SQL through a private endpoint. A private endpoint is a network interface with a private IP address in your virtual network and subnet. Traffic stays on the Microsoft backbone network instead of going through the public internet.

Always use the fully qualified domain name (FQDN) of the server (`<server>.database.windows.net`) in connection strings for all client drivers and tools. Authentication attempts that use the private IP address or the private link FQDN (`<server>.privatelink.database.windows.net`) don't work. This behavior is by design because the private endpoint routes traffic to the SQL Gateway, which needs the correct FQDN to route authentication requests successfully.

<a id="how-to-set-up-private-link-for-azure-sql-database"></a>

## How to set up Private Link

### Creation process

Create private endpoints by using the Azure portal, PowerShell, or the Azure CLI:

- [The portal](/azure/private-link/create-private-endpoint-portal)
- [PowerShell](/azure/private-link/create-private-endpoint-powershell)
- [CLI](/azure/private-link/create-private-endpoint-cli)

### Approval process

After the network admin creates the private endpoint (PE), the SQL admin can manage the private endpoint connection (PEC) to SQL Database.

1. Go to the server resource in the [Azure portal](https://portal.azure.com).
1. Go to the private endpoint approval page. In the Azure Synapse Analytics **SQL server** resource, under **Security** in the resource menu, select **Private endpoint connections**.
1. View the following:
   - A list of all private endpoint connections (PECs)
   - Created private endpoints (PE)
1. If there are no private endpoints, create one by selecting **Create a private endpoint**. Otherwise, choose an individual PEC from the list by selecting it.
1. The SQL admin can approve or reject a PEC and optionally add a short text response.
1. After approval or rejection, the list reflects the appropriate state along with the response text.
1. Select the private endpoint name.

   This action takes you to the **Private endpoint** overview page. Select the **Network interfaces** link to view the network interface details for the private endpoint connection.

   The **Network interface** page shows the private IP address for the private endpoint connection.

> [!IMPORTANT]  
> When you add a private endpoint connection, public routing to your logical server isn't blocked by default. In the **Firewall and virtual networks** pane, the setting **Deny public network access** isn't selected by default. To disable public network access, ensure that you select **Deny public network access**.

## Disable public access to your logical server

In your Azure Synapse Analytics **SQL server**, you can disable all public access to your logical server and allow connections only from your virtual network.

First, ensure that your private endpoint connections are enabled and configured. Then, to disable public access to your logical server:

1. Go to the **Networking** page of your logical server.
1. Select the **Deny public network access** checkbox.

## Test connectivity to SQL Database from an Azure VM in same virtual network

For this scenario, assume you created an Azure Virtual Machine (VM) running a recent version of Windows in the same virtual network as the private endpoint.

1. [Start a Remote Desktop (RDP) session and connect to the virtual machine](/azure/virtual-machines/windows/connect-logon#connect-to-the-virtual-machine).

1. You can then do some basic connectivity checks to ensure that the VM is connecting to SQL Database via the private endpoint by using the following tools:

   - Telnet
   - PsPing
   - Nmap
   - [SQL Server Management Studio (SSMS)](https://aka.ms/ssms)

### Check connectivity by using Telnet

Telnet is a Windows feature that you can use to test connectivity. Depending on the version of Windows, you might need to explicitly enable this feature.

Open a Command Prompt window after you install Telnet. Run the **Telnet** command and specify the IP address and private endpoint of the database in SQL Database.

```console
telnet 10.9.0.4 1433
```

When Telnet connects successfully, it returns a blank screen at the command window. 

### Check connectivity by using PowerShell

Use a PowerShell command to check the connectivity:

```powershell
Test-NetConnection -computer myserver.database.windows.net -port 1433
```

### Check connectivity by using PsPing

Use **[PsPing](/sysinternals/downloads/PsPing)** as follows to check that the private endpoint is listening for connections on port 1433.

Run **PsPing** by providing the FQDN for logical SQL server and port 1433:

```console
PsPing.exe mysqldbsrvr.database.windows.net:1433
```

This example shows the expected output:

```output
TCP connect to 10.9.0.4:1433:
5 iterations (warmup 1) ping test:
Connecting to 10.9.0.4:1433 (warmup): from 10.6.0.4:49953: 2.83ms
Connecting to 10.9.0.4:1433: from 10.6.0.4:49954: 1.26ms
Connecting to 10.9.0.4:1433: from 10.6.0.4:49955: 1.98ms
Connecting to 10.9.0.4:1433: from 10.6.0.4:49956: 1.43ms
Connecting to 10.9.0.4:1433: from 10.6.0.4:49958: 2.28ms
```

The output shows that **PsPing** can ping the private IP address associated with the private endpoint.

### Check connectivity by using Nmap

Nmap (Network Mapper) is a free and open-source tool for network discovery and security auditing. For more information and the download link, visit https://Nmap.org. Use this tool to ensure that the private endpoint is listening for connections on port 1433.

Run **Nmap** by providing the address range of the subnet that hosts the private endpoint.

```console
Nmap -n -sP 10.9.0.0/24
```

This example shows the expected output:

```output
Nmap scan report for 10.9.0.4
Host is up (0.00s latency).
Nmap done: 256 IP addresses (1 host up) scanned in 207.00 seconds
```

The result shows that one IP address is up, which corresponds to the IP address for the private endpoint.

### Check connectivity by using SQL Server Management Studio (SSMS)

Use the **Fully Qualified Domain Name (FQDN)** of the server in connection strings for your clients (`<server>.database.windows.net`). Any login attempts made directly to the IP address or by using the private link FQDN (`<server>.privatelink.database.windows.net`) fail. This behavior is by design, since the private endpoint routes traffic to the SQL Gateway in the region. You need to specify the correct FQDN for logins to succeed.

Follow the steps in [Use SSMS to connect to the SQL Database](connect-overview.md). After you connect by using SSMS, the following query returns `client_net_address` that matches the private IP address of the Azure VM you're connecting from:

```sql
SELECT client_net_address
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;
```

## On-premises connectivity over private peering

When you connect to the public endpoint from on-premises machines, you need to add your IP address to the IP-based firewall by using a server-level firewall rule. While this model works well for allowing access to individual machines for dev or test workloads, it's difficult to manage in a production environment.

By using Private Link, you can enable cross-premises access to the private endpoint by using [ExpressRoute](/azure/expressroute/expressroute-introduction), private peering, or VPN tunneling. You can then disable all access through the public endpoint and not use the IP-based firewall to allow any IP addresses.

## Use cases of Private Link

Clients can connect to the private endpoint from the same virtual network, peered virtual network in the same region, or via virtual network to virtual network connection across regions. Additionally, clients can connect from on-premises by using ExpressRoute, private peering, or VPN tunneling. The following simplified diagram shows the common use cases.

In addition, services that aren't running directly in the virtual network but are integrated with it (for example, App Service web apps or Functions) can also achieve private connectivity to the database.

## Connect from an Azure VM in peered virtual network

Configure [virtual network peering](/azure/virtual-network/tutorial-connect-virtual-networks-powershell) to establish connectivity to the SQL Database from an Azure VM in a peered virtual network.

## Connect from an Azure VM in virtual network to virtual network environment

Configure [virtual network to virtual network VPN gateway connection](/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal) to establish connectivity to a database in SQL Database from an Azure VM in a different region or subscription.

## Connect from an on-premises environment over VPN

To establish connectivity from an on-premises environment, choose and implement one of the following options:

- [Point-to-Site connection](/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)
- [Site-to-Site VPN connection](/azure/vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell)
- [ExpressRoute circuit](/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager)

Consider [DNS configuration scenarios](/azure/private-link/private-endpoint-dns#dns-configuration-scenarios) as well, as the FQDN of the service can resolve to the public IP address.

## Connect from Azure Synapse Analytics to Azure Storage by using PolyBase and the COPY statement

Use PolyBase and the COPY statement to load data into Azure Synapse Analytics from Azure Storage accounts. If the Azure Storage account that you're loading data from limits access only to a set of virtual network subnets by using Private Endpoints, Service Endpoints, or IP-based firewalls, the connectivity from PolyBase and the COPY statement to the account breaks. For enabling both import and export scenarios with Azure Synapse Analytics connecting to Azure Storage that's secured to a virtual network, see [Impact of using virtual network service endpoints with Azure Storage](vnet-service-endpoint-rule-overview.md#impact-of-using-virtual-network-service-endpoints-with-azure-storage).

## Data exfiltration prevention

Data exfiltration happens when a user, such as a database admin, extracts data from one system and moves it to another location or system outside the organization. For example, the user moves the data to a storage account owned by a non-Microsoft entity.

Consider a scenario with a user running SQL Server Management Studio (SSMS) inside an Azure virtual machine connecting to a database in SQL Database. This database is in the West US data center. The following example shows how to limit access with public endpoints by using network access controls.

1. Disable all Azure service traffic to SQL Database through the public endpoint by setting **Allow Azure Services** to **OFF**. Ensure that the server and database level firewall rules don't allow any IP addresses. For more information, see [Azure Synapse Analytics network access controls](network-access-controls-overview.md).
1. Allow traffic only to the private IP address of the VM. For more information, see [virtual network firewall rules](firewall-configure.md).
1. On the Azure VM, narrow the scope of outgoing connections by using [Network Security Groups (NSGs)](/azure/virtual-network/manage-network-security-group) and Service Tags as follows:
   - Specify an NSG rule to allow traffic for Service Tag = `SQL.WestUs` - only allowing connection to SQL Database in West US.
   - Specify an NSG rule with a **higher priority** to deny traffic for Service Tag = `Sql` - denying connections to SQL Database in all regions.

At the end of this setup, the Azure VM can connect only to a resource in the West US region. However, the connectivity isn't restricted to a single database. The VM can still connect to any database in the West US region, including databases that aren't part of the subscription. While you reduce the scope of data exfiltration in the preceding scenario to a specific region, you didn't eliminate it altogether.

By using Private Link, you can set up network access controls like NSGs to restrict access to the private endpoint. You can map individual Azure PaaS resources to specific private endpoints. A malicious insider can only access the mapped PaaS resource and no other resource.

## Related content

- [Azure Synapse Analytics network access controls](network-access-controls-overview.md)
- [What is Azure Private Link?](/azure/private-link/private-link-overview)
- [Azure Private Endpoint private DNS zone values](/azure/private-link/private-endpoint-dns)
- [Azure Synapse Analytics security white paper: Network security](../guidance/security-white-paper-network-security.md)
