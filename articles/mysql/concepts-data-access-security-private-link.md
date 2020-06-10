---
title: Private Link - Azure Database for MySQL
description: Learn how Private link works for Azure Database for MySQL.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 03/10/2020
---

# Private Link for Azure Database for MySQL

Private Link allows you to connect to various PaaS services in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside your private Virtual Network (VNet). The PaaS resources can be accessed using the private IP address just like any other resource in the VNet.

For a list to PaaS services that support Private Link functionality, review the Private Link [documentation](https://docs.microsoft.com/azure/private-link/index). A private endpoint is a private IP address within a specific [VNet](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) and Subnet.

> [!NOTE]
> This feature is available in all Azure regions where Azure Database for MySQL supports General Purpose and Memory Optimized pricing tiers.

## Data exfiltration prevention

Data ex-filtration in Azure Database for MySQL is when an authorized user, such as a database admin, is able to extract data from one system and move it to another location or system outside the organization. For example, the user moves the data to a storage account owned by a third party.

Consider a scenario with a user running MySQL Workbench inside an Azure Virtual Machine (VM) that is connecting to an Azure Database for MySQL server provisioned in West US. The example below shows how to limit access with public endpoints on Azure Database for MySQL using network access controls.

* Disable all Azure service traffic to Azure Database for MySQL via the public endpoint by setting *Allow Azure Services* to OFF. Ensure no IP addresses or ranges are allowed to access the server either via [firewall rules](https://docs.microsoft.com/azure/mysql/concepts-firewall-rules) or [virtual network service endpoints](https://docs.microsoft.com/azure/mysql/concepts-data-access-and-security-vnet).

* Only allow traffic to the Azure Database for MySQL using the Private IP address of the VM. For more information, see the articles on [Service Endpoint](concepts-data-access-and-security-vnet.md) and [VNet firewall rules](howto-manage-vnet-using-portal.md).

* On the Azure VM, narrow down the scope of outgoing connection by using Network Security Groups (NSGs) and Service Tags as follows

    * Specify an NSG rule to allow traffic for *Service Tag = SQL.WestUs* - only allowing connection to Azure Database for MySQL in West US
    * Specify an NSG rule (with a higher priority) to deny traffic for *Service Tag = SQL* - denying connections to Update to Azure Database for MySQL in all regions</br></br>

At the end of this setup, the Azure VM can connect only to Azure Database for MySQL in the West US region. However, the connectivity isn't restricted to a single Azure Database for MySQL. The VM can still connect to any Azure Database for MySQL in the West US region, including the databases that aren't part of the subscription. While we've reduced the scope of data exfiltration in the above scenario to a specific region, we haven't eliminated it altogether.</br>

With Private Link, you can now set up network access controls like NSGs to restrict access to the private endpoint. Individual Azure PaaS resources are then mapped to specific private endpoints. A malicious insider can only access the mapped PaaS resource (for example an Azure Database for MySQL) and no other resource.

## On-premises connectivity over private peering

When you connect to the public endpoint from on-premises machines, your IP address needs to be added to the IP-based firewall using a server-level firewall rule. While this model works well for allowing access to individual machines for dev or test workloads, it's difficult to manage in a production environment.

With Private Link, you can enable cross-premises access to the private endpoint using [Express Route](https://azure.microsoft.com/services/expressroute/) (ER), private peering or [VPN tunnel](https://docs.microsoft.com/azure/vpn-gateway/). They can subsequently disable all access via public endpoint and not use the IP-based firewall.

> [!NOTE]
> In some cases the Azure Database for MySQL and the VNet-subnet are in different subscriptions. In these cases you must ensure the following configurations:
> - Make sure that both the subscription has the **Microsoft.DBforMySQL** resource provider registered. For more information refer [resource-manager-registration][resource-manager-portal]

## Configure Private Link for Azure Database for MySQL

### Creation Process

Private endpoints are required to enable Private Link. This can be done using the following how-to guides.

* [Azure portal](https://docs.microsoft.com/azure/mysql/howto-configure-privatelink-portal)
* [CLI](https://docs.microsoft.com/azure/mysql/howto-configure-privatelink-cli)

### Approval Process
Once the network admin creates the private endpoint (PE), the MySQL admin can manage the private endpoint Connection (PEC) to Azure Database for MySQL. This separation of duties between the network admin and the DBA is helpful for management of the Azure Database for MySQL connectivity. 

* Navigate to the Azure Database for MySQL server resource in the Azure portal. 
    * Select the private endpoint connections in the left pane
    * Shows a list of all private endpoint Connections (PECs)
    * Corresponding private endpoint (PE) created

![select the private endpoint portal](media/concepts-data-access-and-security-private-link/select-private-link-portal.png)

* Select an individual PEC from the list by selecting it.

![select the private endpoint pending approval](media/concepts-data-access-and-security-private-link/select-private-link.png)

* The MySQL server admin can choose to approve or reject a PEC and optionally add a short text response.

![select the private endpoint message](media/concepts-data-access-and-security-private-link/select-private-link-message.png)

* After approval or rejection, the list will reflect the appropriate state along with the response text

![select the private endpoint final state](media/concepts-data-access-and-security-private-link/show-private-link-approved-connection.png)

## Use cases of Private Link for Azure Database for MySQL

Clients can connect to the private endpoint from the same VNet, peered VNet in same region, or via VNet-to-VNet connection across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

![select the private endpoint overview](media/concepts-data-access-and-security-private-link/show-private-link-overview.png)

### Connecting from an Azure VM in Peered Virtual Network (VNet)
Configure [VNet peering](https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-powershell) to establish connectivity to the Azure Database for MySQL from an Azure VM in a peered VNet.

### Connecting from an Azure VM in VNet-to-VNet environment
Configure [VNet-to-VNet VPN gateway connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal) to establish connectivity to a Azure Database for MySQL from an Azure VM in a different region or subscription.

### Connecting from an on-premises environment over VPN
To establish connectivity from an on-premises environment to the Azure Database for MySQL, choose and implement one of the options:

* [Point-to-Site connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)
* [Site-to-Site VPN connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell)
* [ExpressRoute circuit](https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager)

## Private Link combined with firewall rules

The following situations and outcomes are possible when you use Private Link in combination with firewall rules:

* If you don't configure any firewall rules, then by default, no traffic will be able to access the Azure Database for MySQL.

* If you configure public traffic or a service endpoint and you create private endpoints, then different types of incoming traffic are authorized by the corresponding type of firewall rule.

* If you don't configure any public traffic or service endpoint and you create private endpoints, then the Azure Database for MySQL is accessible only through the private endpoints. If you don't configure public traffic or a service endpoint, after all approved private endpoints are rejected or deleted, no traffic will be able to access the Azure Database for MySQL.

## Deny public access for Azure Database for MySQL

If you want to rely only on private endpoints for accessing their Azure Database for MySQL, you can disable setting all public endpoints (i.e. [firewall rules](concepts-firewall-rules.md) and [VNet service endpoints](concepts-data-access-and-security-vnet.md)) by setting the **Deny Public Network Access** configuration on the database server. 

When this setting is set to *YES*, only connections via private endpoints are allowed to your Azure Database for MySQL. When this setting is set to *NO*, clients can connect to your Azure Database for MySQL based on your firewall or VNet service endpoint settings. Additionally, once the value of the Private network access is set, customers cannot add and/or update existing 'Firewall rules' and 'VNet service endpoint rules'.

> [!Note]
> This feature is available in all Azure regions where Azure Database for PostgreSQL - Single server supports General Purpose and Memory Optimized pricing tiers.
>
> This setting does not have any impact on the SSL and TLS configurations for your Azure Database for MySQL.

To learn how to set the **Deny Public Network Access** for your Azure Database for MySQL from Azure portal, refer to [How to configure Deny Public Network Access](howto-deny-public-network-access.md).

## Next steps

To learn more about Azure Database for MySQL security features, see the following articles:

* To configure a firewall for Azure Database for MySQL, see [Firewall support](https://docs.microsoft.com/azure/mysql/concepts-firewall-rules).

* To learn how to configure a virtual network service endpoint for your Azure Database for MySQL, see [Configure access from virtual networks](https://docs.microsoft.com/azure/mysql/concepts-data-access-and-security-vnet).

* For an overview of Azure Database for MySQL connectivity, see [Azure Database for MySQL Connectivity Architecture](https://docs.microsoft.com/azure/mysql/concepts-connectivity-architecture)

<!-- Link references, to text, Within this same GitHub repo. -->
[resource-manager-portal]: ../azure-resource-manager/management/resource-providers-and-types.md