---
title: Private Link with Azure Database for MySQL - Flexible Server
description: Learn how Private Link works for Azure Database for MySQL - Flexible Server.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 05/10/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Private Link for Azure Database for MySQL - Flexible Server 

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Private Link allows you to connect to various PaaS services, such as Azure Database for MySQL flexible server, in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside your private Virtual Network (VNet). Using the private IP address, the MySQL flexible server is accessible just like any other resource within the VNet.

A private endpoint is a private IP address within a specific [VNet](../../virtual-network/virtual-networks-overview.md) and Subnet.

> [!NOTE]
> Enabling Private Link is exclusively possible for Azure Database for MySQL - Flexible Server instances that are created with public access. Learn how to enable private endpoint using the [Azure portal](how-to-networking-private-link-portal.md) or [Azure CLI](how-to-networking-private-link-azure-cli.md).
## Benefits of Private Link for MySQL flexible server

Here are some benefits for using the networking private link feature with MySQL flexible server.

### Data exfiltration prevention

Data exfiltration in MySQL flexible server is when an authorized user, such as a database admin, can extract data from one system and move it to another location or system outside the organization. For example, the user moves the data to a storage account owned by a third party.

Consider a scenario with a user running MySQL Workbench inside an Azure Virtual Machine (VM) connecting to an Azure Database for MySQL flexible server provisioned in West US. The example below shows how to limit access with public endpoints on Azure Database for MySQL flexible server using network access controls.

- Disable all Azure service traffic to Azure Database for MySQL flexible server via the public endpoint by setting *Allow Azure Services* to OFF. Ensure no IP addresses or ranges can access the server via [firewall rules](../single-server/concepts-firewall-rules.md).

- Only allow traffic to the Azure Database for MySQL flexible server using the Private IP address of the VM. For more information, see the article on [VNet firewall rules](../single-server/how-to-manage-vnet-using-portal.md).

- On the Azure VM, narrow down the scope of outgoing connection by using Network Security Groups (NSGs) and Service Tags as follows

    - Specify an NSG rule to allow traffic for *Service Tag = SQL.WestUs* - only allowing connection to Azure Database for MySQL in West US
    - Specify an NSG rule (with a higher priority) to deny traffic for *Service Tag = SQL* - denying connections to Update to Azure Database for MySQL in all regions

At the end of this setup, the Azure VM can connect only to Azure Database for MySQL flexible server in the West US region. However, the connectivity isn't restricted to a single MySQL flexible server. The VM can still connect to any Azure Database for MySQL flexible server in the West US region, including the databases that aren't part of the subscription. While we've reduced the scope of data exfiltration in the above scenario to a specific region, we still need to eliminate it.

With Private Link, you can now set up network access controls like NSGs to restrict access to the private endpoint. By mapping individual Azure PaaS resources to specific private endpoints, access is limited solely to the designated PaaS resource. This effectively restricts a malicious user from accessing any other resource beyond their authorized scope.

### On-premises connectivity over private peering

When you connect to the public endpoint from on-premises machines, your IP address must be added to the IP-based firewall using a server-level firewall rule. While this model allows access to individual machines for dev or test workloads, it's difficult to manage in a production environment.

With Private Link, you can enable cross-premises access to the private endpoint using [Express Route](https://azure.microsoft.com/services/expressroute/) (ER), private peering, or [VPN tunnel](../../vpn-gateway/index.yml). They can then disable all access via public endpoint and not use the IP-based firewall.

> [!NOTE]  
> In some cases, the Azure Database for MySQL flexible server and the VNet-subnet are in different subscriptions. In these cases, you must ensure the following configurations:
> - Make sure that both subscriptions have the **Microsoft.DBforMySQL/flexibleServers** resource provider registered. For more information refer [resource-manager-registration](../../azure-resource-manager/management/resource-providers-and-types.md).

## Use cases of Private Link for Azure Database for MySQL

Clients can connect to the private endpoint from the same VNet, peered VNet in the same region or across regions, or via VNet-to-VNet connection across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

:::image type="content" source="media/concepts-networking-private-link/diagram-of-private-link-mysql.png" alt-text="Diagram of private link.":::

### Connect from an Azure VM in peered virtual network (VNet)

Configure [VNet peering](../../virtual-network/tutorial-connect-virtual-networks-powershell.md) to establish connectivity to the Azure Database for MySQL from an Azure VM in a peered VNet.

### Connect from an Azure VM in a VNet-to-VNet environment

Configure [VNet-to-VNet VPN gateway connection](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) to establish connectivity to an Azure Database for MySQL from an Azure VM in a different region or subscription.

### Connect from an on-premises environment over VPN

To establish connectivity from an on-premises environment to the Azure Database for MySQL, choose and implement one of the options:

- [Point-to-Site connection](../../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)
- [Site-to-Site VPN connection](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
- [ExpressRoute circuit](../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)

## Private Link combined with firewall rules

Combining Private Link with firewall rules can result in several scenarios and outcomes:

- The Azure Database for MySQL flexible server is inaccessible without firewall rules or a private endpoint. The server becomes inaccessible if all approved private endpoints are deleted or rejected and no public access is configured.

- Private endpoints are the only means of accessing the Azure Database for MySQL flexible server when public traffic is disallowed.

- Different forms of incoming traffic are authorized based on appropriate firewall rules when public access is enabled with private endpoints.

## Deny public access

You can disable public access on your Azure Database for MySQL flexible server if you prefer to rely solely on private endpoints for access.

:::image type="content" source="media/concepts-networking-private-link/screenshot-of-public-access-checkbox-mysql.png" alt-text="Screenshot of public access checkbox.":::

Clients can connect to the server based on the firewall configuration when this setting is enabled. If this setting is disabled, only connections through private endpoints are allowed, and users can't modify the firewall rules.

> [!NOTE]  
> This setting does not impact the SSL and TLS configurations for your Azure Database for MySQL.

To learn how to set the **Deny Public Network Access** for your Azure Database for MySQL flexible server from the Azure portal, refer to [Deny Public Network Access using the Azure portal](how-to-networking-private-link-deny-public-access.md).

## Limitation

When a user tries to delete both the MySQL flexible server and Private Endpoint simultaneously, they may encounter an Internal Server error. To avoid this issue, we recommend deleting the Private Endpoint(s) first and then proceeding to delete the MySQL flexible server after a short pause.

## Next steps

To learn more about Azure Database for MySQL security features, see the following articles:

- To configure a firewall for Azure Database for MySQL, see [firewall support](../single-server/concepts-firewall-rules.md).

- For an overview of Azure Database for MySQL connectivity, see [Azure Database for MySQL Connectivity Architecture](../single-server/concepts-connectivity-architecture.md)


