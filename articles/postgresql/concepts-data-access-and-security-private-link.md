---
title: Private Link for Azure Database for PostgreSQL - Single server (Preview)
description: Learn how Private link works for Azure Database for PostgreSQL - Single server.
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 12/23/2019
---

# Private Link for Azure Database for PostgreSQL-Single server (Preview)

Private Link allows you to connect to various PaaS services in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside the customer’s private VNet. The PaaS resources can be accessed using the private IP address just like any other resource in the VNet. This significantly simplifies the network configuration by keeping access rules private.

For a list to PaaS services that support Private Link functionality, go to the [Private Link Documentation page](https://docs.microsoft.com/azure/private-link/index). A private endpoint is a private IP address within a specific [VNet](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) and Subnet.

> [!NOTE]
> This feature is available in all regions of Azure public cloud where Azure Database for PostgreSQL is deployed for General Purpose and Memory Optimized servers.

## Data exfiltration prevention

Data ex-filtration in Azure Database for PostgreSQL Single server is when an authorized user, such as a database admin is able extract data from one system and move it another location or system outside the organization. For example, the user moves the data to a storage account owned by a third party.

Consider a scenario with a user running PostgreSQL Single server workbench inside an Azure VM connecting to an Azure Database for PostgreSQL Single server instance. This PostgreSQL Single server instance is in the West US data center. The example below shows how to limit access with public endpoints on Azure Database for PostgreSQL Single server using network access controls.

* Disable all Azure service traffic to Azure Database for PostgreSQL Single server via the public endpoint by setting Allow Azure Services to OFF. Ensure no IP addresses are allowed in the server either via [firewall rules](https://docs.microsoft.com/azure/postgresql/concepts-firewall-rules) or [virtual network service endpoints](https://docs.microsoft.com/azure/postgresql/concepts-data-access-and-security-vnet).

* Only allow traffic to the Azure Database for PostgreSQL Single server using the Private IP address of the VM. For more information, see the articles on Service Endpoint and VNet firewall rules.

    * On the Azure VM, narrow down the scope of outgoing connection by using Network Security Groups (NSGs) and Service Tags as follows
    * Specify an NSG rule to allow traffic for Service Tag = SQL.WestUs - only allowing connection to Azure Database for PostgreSQL Single server in West US
    * Specify an NSG rule (with a higher priority) to deny traffic for Service Tag = SQL - denying connections to PostgreSQL Database in all regions</br></br>

At the end of this setup, the Azure VM can connect only to Azure Database for PostgreSQL Single server in the West US region. However, the connectivity isn't restricted to a single Azure Database for PostgreSQL Single server. The VM can still connect to any Azure Database for PostgreSQL Single server in the West US region, including the databases that aren't part of the subscription. While we've reduced the scope of data exfiltration in the above scenario to a specific region, we haven't eliminated it altogether.</br>

With Private Link, customers can now set up network access controls like NSGs to restrict access to the private endpoint. Individual Azure PaaS resources are then mapped to specific private endpoints. A malicious insider can only access the mapped PaaS resource (for example an Azure Database for PostgreSQL Single server) and no other resource.

## On-premises connectivity over private peering

When customers connect to the public endpoint from on-premises machines, their IP address needs to be added to the IP-based firewall using a Server-level firewall rule. While this model works well for allowing access to individual machines for dev or test workloads, it's difficult to manage in a production environment.

With Private Link, customers can enable cross-premises access to the private endpoint using ExpressRoute, private peering, or VPN tunneling. Customers can then disable all access via the public endpoint and not use the IP-based firewall to allow any IP addresses.

With Private Link, customers can enable cross-premises access to the private endpoint using Express Route (ER) private peering or VPN tunnel. They can subsequently disable all access via public endpoint and not use the IP-based firewall.

## How to set up Private Link for Azure Database for PostgreSQL - Single Server

### Creation Process

Private Endpoints can be created using:

* [Portal](https://docs.microsoft.com/azure/postgresql/howto-configure-privatelink-portal)
* [CLI](https://docs.microsoft.com/azure/postgresql/howto-configure-privatelink-cli)

### Approval Process
Once the network admin creates the Private Endpoint (PE), the PostgreSQL admin can manage the Private Endpoint Connection (PEC) to Azure Database for PostgreSQL.

* Navigate to the Azure Database for PostgreSQL server resource in the Azure portal. 
    * Select the Private endpoint connections in the left pane
    * Shows a list of all Private Endpoint Connections (PECs)
    * Corresponding Private Endpoint (PE) created

![select the Private endpoint portal](media/concepts-data-access-and-security-private-link/select-private-link-portal.png)

* Select an individual PEC from the list by selecting it.

![select the Private endpoint pending approval](media/concepts-data-access-and-security-private-link/select-private-link.png)

* The PostgreSQL server admin can choose to approve or reject a PEC and optionally add a short text response.

![select the Private endpoint message](media/concepts-data-access-and-security-private-link/select-private-link-message.png)

* After approval or rejection, the list will reflect the appropriate state along with the response text

![select the Private endpoint final state](media/concepts-data-access-and-security-private-link/show-private-link-approved-connection.png)

## Use cases of Private Link for Azure database for PostgreSQL

Clients can connect to the Private endpoint from the same VNet, peered VNet in same region, or via VNet-to-VNet connection across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

![select the Private endpoint overview](media/concepts-data-access-and-security-private-link/show-private-link-overview.png)

### Connecting from an Azure VM in Peered Virtual Network (VNet)
Configure [VNet peering](https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-powershell) to establish connectivity to the Azure Database for PostgreSQL - Single server from an Azure VM in a peered VNet.

### Connecting from an Azure VM in VNet-to-VNet environment
Configure [VNet-to-VNet VPN gateway connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal) to establish connectivity to a Azure Database for PostgreSQL - Single server from an Azure VM in a different region or subscription.

### Connecting from an on-premises environment over VPN
To establish connectivity from an on-premises environment to the Azure Database for PostgreSQL - Single server, choose and implement one of the options:

* [Point-to-Site connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)
* [Site-to-Site VPN connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell)
* [ExpressRoute circuit](https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager)

## Private Link combined with firewall rules

The following situations and outcomes are possible when you use Private Link in combination with firewall rules:

* If you don't configure any firewall rules, then by default, no traffic will be able to access the Azure Database for PostgreSQL Single server.

* If you configure public traffic or a service endpoint and you create private endpoints, then different types of incoming traffic are authorized by the corresponding type of firewall rule.

* If you don't configure any public traffic or service endpoint and you create private endpoints, then the Azure Database for PostgreSQL Single server is accessible only through the private endpoints. If you don't configure public traffic or a service endpoint, after all approved private endpoints are rejected or deleted, no traffic will be able to access the Azure Database for PostgreSQL Single server.

## Next steps

To learn more about Azure Database for PostgreSQL Single server security features, see the following articles:

* To configure a firewall for Azure Database for PostgreSQL Single server, see [Firewall support](https://docs.microsoft.com/azure/postgresql/concepts-firewall-rules).

* To learn how to configure a virtual network service endpoint for your Azure Database for PostgreSQL Single server, see [Configure access from virtual networks](https://docs.microsoft.com/azure/postgresql/concepts-data-access-and-security-vnet).

* For an overview of Azure Database for PostgreSQL Single server connectivity, see [Azure Database for MySQL Connectivity Architecture](https://docs.microsoft.com/azure/postgresql/concepts-connectivity-architecture)