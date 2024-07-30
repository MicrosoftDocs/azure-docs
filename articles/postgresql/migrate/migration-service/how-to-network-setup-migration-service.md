---
title: "Migration service - networking scenarios"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Network scenarios for connecting source and target
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: how-to
---

# Network guide for migration service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This document outlines various scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. Each scenario presents different networking requirements and configurations to establish a successful connection for migration. Specific details vary based on the actual network setup and requirements of the source and target environments.

The table summarizes the scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. It indicates whether each scenario is supported based on the configurations of the source and target environments.

| PostgreSQL Source | Target | Supported |
| --- | --- | --- |
| On-premises with public IP | Azure Database for PostgreSQL - Flexible Server with public access | Yes |
| On-premises with private IP via VPN/ExpressRoute | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| AWS RDS for PostgreSQL with public IP | Azure Database for PostgreSQL - Flexible Server with public access | Yes |
| AWS RDS for PostgreSQL with private access via VPN/ExpressRoute | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| PostgreSQL installed Azure VM in same/different virtual network | VNet-integrated Azure Database for PostgreSQL - Flexible Server in same/different virtual network | Yes |
| Azure Database for PostgreSQL - Single Server with public access | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| Azure Database for PostgreSQL - Single Server with private endpoint | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| Azure Database for PostgreSQL - Single Server with private endpoint | Azure Database for PostgreSQL - Flexible Server with private endpoint | Yes |
| On-premises/Azure VM/AWS with private access | Azure Database for PostgreSQL - Flexible Server with private endpoint | Yes |
| On-premises/Azure VM/AWS with private access | Azure Database for PostgreSQL - Flexible Server with public access | No |

## Scenario 1: On-premises source to Azure Database for PostgreSQL with public access

**Networking Steps:**

- The source database server must have a public IP address.
- Configure the firewall to allow outbound connections on the PostgreSQL port (default 5432).
- Ensure the source database server is accessible over the internet.
- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 2: Private IP on-premises source to virtual network-Integrated Azure Database for PostgreSQL via Express Route/IPSec VPN

:::image type="content" source="media/how-to-network-setup-migration-service/on-premises-to-azure-vpn.png" alt-text="Screenshot of an on-premises data center is connected to Azure via ExpressRoute or VPN Gateway. The on-premises PostgreSQL server connects through the secure link to the Azure Database for PostgreSQL." lightbox="media/how-to-network-setup-migration-service/on-premises-to-azure-vpn.png":::

**Networking Steps:**

- Set up a Site-to-Site VPN or ExpressRoute for a secure, reliable connection between the on-premises network and Azure.
- Configure Azure's Virtual Network (virtual network) to allow access from the on-premises IP range.
- Set up Network Security Group (NSG) rules to allow traffic on the PostgreSQL port (default 5432) from the on-premises network.
- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 3: AWS RDS for PostgreSQL to Azure Database for PostgreSQL

:::image type="content" source="media/how-to-network-setup-migration-service/aws-to-azure-vpn.png" alt-text="Screenshot of an AWS RDS for PostgreSQL connects to Azure Database for PostgreSQL through the internet or a direct connect service like Express Route or AWS Direct Connect." lightbox="media/how-to-network-setup-migration-service/aws-to-azure-vpn.png":::

The source database in another cloud provider (AWS) must have a public IP or a direct connection to Azure.

**Networking Steps:**

- **Public Access:**
    - If your AWS RDS instance isn't publicly accessible, you can modify the instance to allow connections from Azure. This can be done through the AWS Management Console by changing the Publicly Accessible setting to Yes.
    - In the AWS RDS security group, add an inbound rule to allow traffic from the Azure Database for PostgreSQL's public IP address/domain.

- **Private Access**
    - Establish a secure connection using the express route or a VPN from AWS to Azure.
    - In the AWS RDS security group, add an inbound rule to allow traffic from the Azure Database for PostgreSQL's public IP address/domain or the range of IP addresses in the Azure virtual network on the PostgreSQL port (default 5432).
    - Create an Azure Virtual Network (virtual network) where your Azure Database for PostgreSQL resides. Configure the virtual network's Network Security Group (NSG) to allow outbound connections to the AWS RDS instance's IP address on the PostgreSQL port.
    - Set up NSG rules in Azure to permit incoming connections from the cloud provider, AWS RDS IP range.
    - Test the connectivity between AWS RDS and Azure Database for PostgreSQL to ensure no network issues.

## Scenario 4: Azure VMs to Azure Database for PostgreSQL (different virtual networks)

This scenario describes the connectivity between an Azure VM and an Azure Database for PostgreSQL, which are located in different virtual networks. Virtual network peering and appropriate NSG rules are required to facilitate traffic between the VNets.

:::image type="content" source="media/how-to-network-setup-migration-service/vm-to-azure-peering.png" alt-text="Screenshot of an Azure VM in one virtual network connects to the Azure Database for PostgreSQL in another virtual network." lightbox="media/how-to-network-setup-migration-service/vm-to-azure-peering.png":::

**Networking Steps:**

- Set up virtual network peering between the two VNets to enable direct network connectivity.
- Configure NSG rules to allow traffic between the VNets on the PostgreSQL port.

## Scenario 5: Azure VMs to Azure PostgreSQL (same virtual network)

The configuration is straightforward when an Azure VM and Azure Database for PostgreSQL are within the same virtual network. NSG rules should be set to allow internal traffic on the PostgreSQL port, and no additional firewall rules are necessary for the Azure Database for PostgreSQL since the traffic remains within the virtual network.

:::image type="content" source="media/how-to-network-setup-migration-service/vm-to-azure-same-vnet.png" alt-text="Screenshot of an Azure VM in the same virtual network connects directly to the Azure Database for PostgreSQL." lightbox="media/how-to-network-setup-migration-service/vm-to-azure-same-vnet.png":::

**Networking Steps:**

- Ensure that the VM and the PostgreSQL server are in the same virtual network.
- Configure NSG rules to allow traffic within the virtual network on the PostgreSQL port.
- No other firewall rules are needed for the Azure Database for PostgreSQL since the traffic is internal to the virtual network.

## Scenario 6: Azure Database for PostgreSQL - Single server to VNet-Integrated Azure Database for PostgreSQL - Flexible server

To facilitate connectivity between an Azure Database for PostgreSQL - Single Server with public access and a Vnet-Integrated Flexible Server, you need to configure the Single Server to allow connections from the subnet where the Flexible Server is deployed. Here's a brief outline of the steps to set up this connectivity:

**Add VNet Rule to Single Server:**

- Navigate to the Azure portal and open your PostgreSQL Single Server instance.
- Go to the "Connection Security" settings.
- Locate the "virtual network rules" section and select "Add existing virtual network".
- This action lets you specify which virtual network can connect to your Single Server.

    :::image type="content" source="media/how-to-network-setup-migration-service/add-vnet-rule-single-server.png" alt-text="Screenshot of adding a virtual network rule in single server." lightbox="media/how-to-network-setup-migration-service/add-vnet-rule-single-server.png":::

**Configure Rule Settings:**

- Enter a name for the new virtual network rule in the configuration panel that appears.
- Select the subscription where your Flexible Server is located.
- Choose the virtual network (virtual network) and the specific subnet associated with your Flexible Server.
- Confirm the settings by selecting "OK".

    :::image type="content" source="media/how-to-network-setup-migration-service/allow-flexible-server-subnet.png" alt-text="Screenshot of allowing the flexible server subnet." lightbox="media/how-to-network-setup-migration-service/allow-flexible-server-subnet.png":::

After completing these steps, the Single Server will be configured to accept connections from the Flexible Server's subnet, enabling secure communication between the two servers.

## Scenario 7: Azure Database for PostgreSQL - Single server with private endpoint to VNet-Integrated Azure Database for PostgreSQL - Flexible server

To facilitate connectivity from an Azure Database for PostgreSQL Single Server with a private endpoint to a VNet-integrated Flexible Server, follow these steps:

**Get private endpoint details:**

- In the Azure portal, navigate to the Single Server instance and select on the private endpoint to view its virtual network and subnet details.
- Access the Networking page of the Flexible Server to note its virtual network and subnet information.

     :::image type="content" source="media/how-to-network-setup-migration-service/private-endpoint-single-server.png" alt-text="Screenshot of private endpoint connection in single server." lightbox="media/how-to-network-setup-migration-service/allow-flexible-server-subnet.png":::

    :::image type="content" source="media/how-to-network-setup-migration-service/vnet-details-single-server.png" alt-text="Screenshot showing virtual network and subnet details of single server's private endpoint." lightbox="media/how-to-network-setup-migration-service/vnet-details-single-server.png":::

**Assess VNet Peering Requirements**
- If both are in different VNets, you need to enable virtual network peering to connect one virtual network to another. Peering is optional if they are in the same virtual network but in different subnets. Ensure that no network security groups (NSGs) block the traffic from flexible server to single server.

**Private DNS Zone Configuration**
- Go to the **Networking** page on the flexible server and check if a private DNS zone is being used. If used, open this private DNS zone in the portal. In the left pane, select on the **Virtual network links** and check if the virtual network of single server and flexible server is added to this list.

    :::image type="content" source="media/how-to-network-setup-migration-service/private-dns-zone-vnet-link.png" alt-text="Screenshot virtual network linked to a private DNS Zone." lightbox="media/how-to-network-setup-migration-service/private-dns-zone-vnet-link.png":::

If not, select the **Add** button and create a link to this private DNS zone for the VNets of single and flexible servers.

- Go to the private endpoint on your single server and select on the **DNS configuration** page. Check if a private DNS zone is attached with this endpoint. If not, attach a private DNS zone by selecting on the **Add Configuration** button.

    :::image type="content" source="media/how-to-network-setup-migration-service/private-dns-zone-private-end-point.png" alt-text="Screenshot showing a private DNS Zone used in private end point." lightbox="media/how-to-network-setup-migration-service/private-dns-zone-private-end-point.png":::

- Select on the Private DNS zone on your single server private endpoint and check if the Vnets of single server and flexible server are added to the Virtual network links. If not, follow the steps mentioned in the above step to add the links to the virtual networks of the single and flexible server to this private DNS zone.

- The final check would be to go the private DNS zone of the private endpoint on your single server and check if there exists an **A record** for your single server that points a private IP address.

    :::image type="content" source="media/how-to-network-setup-migration-service/private-dns-zone-record.png" alt-text="Screenshot showing a private IP address assigned to private end point." lightbox="media/how-to-network-setup-migration-service/private-dns-zone-record.png":::

Completing these steps enables the Azure Database for PostgreSQL - Flexible Server to connect to the Azure Database for PostgreSQL - Single Server.

## Scenario 8: Azure Database for PostgreSQL single server with private endpoint to Azure Database for PostgreSQL flexible server with private endpoint

Below are the essential networking steps for migrating from a Single Server with a private endpoint to a Flexible Server with a private endpoint in Azure PostgreSQL, including the integration of a runtime server's virtual network with private endpoint configurations. For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

- **Gather Private Endpoint Details for Single Server**
    - Access the Azure portal and locate the Azure Database for PostgreSQL - Single Server instance.
    - Record the Virtual Network (virtual network) and subnet details listed under the private endpoint connection of the Single Server.

    :::image type="content" source="media/how-to-network-setup-migration-service/single-server-private-endpoint.png" alt-text="Screenshot of Single Server with PE." lightbox="media/how-to-network-setup-migration-service/single-server-private-endpoint.png":::

- **Gather Private Endpoint Details for Flexible Server**
    - Access the Azure portal and locate the Azure Database for PostgreSQL - Flexible Server instance.
    - Record the Virtual Network (virtual network) and subnet details listed under the private endpoint connection of the Flexible Server.

    :::image type="content" source="media/how-to-network-setup-migration-service/flexible-server-private-endpoint.png" alt-text="Screenshot of Flexible Server with PE." lightbox="media/how-to-network-setup-migration-service/flexible-server-private-endpoint.png":::

- **Gather VNET details for Migration Runtime Server**
    - Access the Azure portal and locate the migration runtime server, that is, Azure Database for PostgreSQL - Flexible Server (VNET Integrated) instance.
    - Record the Virtual Network (virtual network) and subnet details listed under the virtual network.

    :::image type="content" source="media/how-to-network-setup-migration-service/instance-vnet.png" alt-text="Screenshot of migration runtime server with virtual network." lightbox="media/how-to-network-setup-migration-service/instance-vnet.png":::

- **Assess VNet Peering Requirements**
    - Enable virtual network peering if the servers are in different VNets; no peering is needed in the same virtual network but with different subnets.
    - Ensure no NSGs block traffic between the source, migration runtime, and target servers.

- **Private DNS Zone Configuration**
    - Verify the use of a private DNS zone on the networking page of the Migration Runtime Server.
    - Ensure both source Azure Database for PostgreSQL - Single Server and target Azure Database for PostgreSQL - Flexible Server VNets are linked to the private DNS zone of the migration runtime server

    :::image type="content" source="media/how-to-network-setup-migration-service/instance-dns-zone.png" alt-text="Screenshot of private DNS zone of runtime server." lightbox="media/how-to-network-setup-migration-service/instance-dns-zone.png":::

    - Attach a private DNS zone to the Single Server's private endpoint if not already configured.
    - Add virtual network links for the Single Server and Migration Runtime Server to the private DNS zone.
    - Repeat the DNS zone attachment and virtual network linking process for the Flexible Server's private endpoint.

    :::image type="content" source="media/how-to-network-setup-migration-service/source-dns-zone.png" alt-text="Screenshot of private DNS zone of source/target server." lightbox="media/how-to-network-setup-migration-service/source-dns-zone.png":::

## Scenario 9: On-premises, Azure VM, AWS RDS with private IPs to Azure Database for PostgreSQL flexible server with private endpoint

Below are the networking steps for migrating a PostgreSQL database from an on-premises environment, Azure VM, or AWS instance—all of which are configured with private IPs—to an Azure Database for PostgreSQL Flexible Server that is secured with a private endpoint. The migration ensures secure data transfer within a private network space, using Azure's VPN or ExpressRoute for on-premises connections and virtual network peering or VPN for cloud-to-cloud migrations. For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

- **Establish Network Connectivity:**
   - For on-premises sources, set up a Site-to-Site VPN or ExpressRoute to connect your local network to Azure's virtual network.
   - For Azure VM or AWS instances, ensure virtual network peering or a VPN gateway or a ExpressRoute is in place for secure connectivity to Azure's virtual network.

- **Gather VNET details for Migration Runtime Server**
    - Access the Azure portal and locate the migration runtime server, that is, Azure Database for PostgreSQL - Flexible Server (VNET Integrated) instance.
    - Record the Virtual Network (virtual network) and subnet details listed under the virtual network.

- **Assess VNet Peering Requirements**
    - Enable virtual network peering if the servers are in different VNets; no peering is needed in the same virtual network but with different subnets.
    - Ensure no NSGs are blocking traffic between the source, migration runtime, and target servers.

- **Private DNS Zone Configuration**
    - Verify the use of a private DNS zone on the networking page of the Migration Runtime Server.
    - Ensure both source and target Azure Database for PostgreSQL - Flexible Server VNets are linked to the private DNS zone of the migration runtime server.
    - Attach a private DNS zone to the Flexible Server's private endpoint if not already configured.
    - Add virtual network links for the Flexible Server and Migration Runtime Server to the private DNS zone.

## Resources for network setup

- To establish an **ExpressRoute** connection, refer to the [What is Azure ExpressRoute?](../../../expressroute/expressroute-introduction.md).
- For setting up an **IPsec VPN**, consult the guide on [About Point-to-Site VPN](../../../vpn-gateway/point-to-site-about.md).
- For virtual network peering, [Virtual network peering](../../../virtual-network/virtual-network-peering-overview.md)

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
