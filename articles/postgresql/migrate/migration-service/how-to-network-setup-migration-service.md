---
title: "Migration service - networking scenarios"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Network scenarios for connecting source and target
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.topic: how-to
---

# Network guide for migration service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This document outlines various scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. Each scenario presents different networking requirements and configurations to establish a successful connection for migration. Specific details vary based on the actual network setup and requirements of the source and target environments.

The below table summarizes the different scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. It indicates whether each scenario is supported based on the configurations of the source and target environments.

| PostgreSQL Source | Target | Supported |
|------------------------|-------------------|------------------| 
| On-premises with public IP | Azure Database for PostgreSQL - Flexible Server with public access | Yes |
| On-premises with private IP via VPN/ExpressRoute | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| AWS RDS for PostgreSQL with public IP | Azure Database for PostgreSQL - Flexible Server with public access | Yes |
| AWS RDS for PostgreSQL with private access via VPN/ExpressRoute | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| PostgreSQL installed Azure VM in same/different VNet | VNet-integrated Azure Database for PostgreSQL - Flexible Server in same/different VNet | Yes |
| Azure Database for PostgreSQL - Single Server with public access | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| Azure Database for PostgreSQL - Single Server with private endpoint | VNet-integrated Azure Database for PostgreSQL - Flexible Server | Yes |
| Azure Database for PostgreSQL - Single Server with private endpoint | Azure Database for PostgreSQL - Flexible Server with private endpoint | Planned for future release |
| On-premises/Azure VM/AWS with private access | Azure Database for PostgreSQL - Flexible Server with private endpoint | Planned for future release |
| On-premises/Azure VM/AWS with private access | Azure Database for PostgreSQL - Flexible Server with public access | Planned for future release |


## Scenario 1: On-premises source to Azure Database for PostgreSQL with public access

**Networking Steps:**

- The source database server must have a public IP address.
- Configure the firewall to allow outbound connections on the PostgreSQL port (default 5432).
- Ensure the source database server is accessible over the internet.
- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 2: Private IP on-premises source to virtual network-Integrated Azure Database for PostgreSQL via Express Route/IPSec VPN

:::image type="content" source="media\how-to-network-setup-migration-service\on-premises-to-azure-vpn.png" alt-text="Screenshot of an on-premises data center is connected to Azure via ExpressRoute or VPN Gateway. The on-premises PostgreSQL server connects through the secure link to the Azure Database for PostgreSQL." lightbox="media\how-to-network-setup-migration-service\on-premises-to-azure-vpn.png":::

**Networking Steps:**

- Set up a Site-to-Site VPN or ExpressRoute for a secure, reliable connection between the on-premises network and Azure.
- Configure Azure's Virtual Network (virtual network) to allow access from the on-premises IP range.
- Set up Network Security Group (NSG) rules to allow traffic on the PostgreSQL port (default 5432) from the on-premises network.
- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 3: AWS RDS for PostgreSQL to Azure Database for PostgreSQL

:::image type="content" source="media\how-to-network-setup-migration-service\aws-to-azure-vpn.png" alt-text="Screenshot of an AWS RDS for PostgreSQL connects to Azure Database for PostgreSQL through the internet or a direct connect service like Express Route or AWS Direct Connect." lightbox="media\how-to-network-setup-migration-service\aws-to-azure-vpn.png":::

The source database in another cloud provider (AWS) must have a public IP or a direct connection to Azure.

**Networking Steps:**

- **Public Access:**
    - If your AWS RDS instance isn't publicly accessible, you can modify the instance to allow connections from Azure. This can be done through the AWS Management Console by changing the Publicly Accessible setting to Yes.
    - In the AWS RDS security group, add an inbound rule to allow traffic from the Azure Database for PostgreSQL's public IP address/domain.

- **Private Access**
    - Establish a secure connection using express route, or a VPN from AWS to Azure.
    - In the AWS RDS security group, add an inbound rule to allow traffic from the Azure Database for PostgreSQL's public IP address/domain or the range of IP addresses in the Azure virtual network on the PostgreSQL port (default 5432).
    - Create an Azure Virtual Network (virtual network) where your Azure Database for PostgreSQL resides. Configure the virtual network's Network Security Group (NSG) to allow outbound connections to the AWS RDS instance's IP address on the PostgreSQL port.
    - Set up NSG rules in Azure to permit incoming connections from the cloud provider, AWS RDS IP range.
    - Test the connectivity between AWS RDS and Azure Database for PostgreSQL to ensure no network issues.

## Scenario 4: Azure VMs to Azure Database for PostgreSQL (different virtual networks)

This scenario describes connectivity between an Azure VMs and an Azure Database for PostgreSQL located in different virtual networks. Virtual network peering and appropriate NSG rules are required to facilitate traffic between the VNets.

:::image type="content" source="media\how-to-network-setup-migration-service\vm-to-azure-peering.png" alt-text="Screenshot of an Azure VM in one virtual network connects to the Azure Database for PostgreSQL in another virtual network." lightbox="media\how-to-network-setup-migration-service\vm-to-azure-peering.png":::

**Networking Steps:**

- Set up virtual network peering between the two VNets to enable direct network connectivity.
- Configure NSG rules to allow traffic between the VNets on the PostgreSQL port.

## Scenario 5: Azure VMs to Azure PostgreSQL (same virtual network)

When an Azure VM and Azure Database for PostgreSQL are within the same virtual network, the configuration is straightforward. NSG rules should be set to allow internal traffic on the PostgreSQL port, with no additional firewall rules necessary for the Azure Database for PostgreSQL since the traffic remains within the VNet.

:::image type="content" source="media\how-to-network-setup-migration-service\vm-to-azure-same-vnet.png" alt-text="Screenshot of an Azure VM in the same virtual network connects directly to the Azure Database for PostgreSQL." lightbox="media\how-to-network-setup-migration-service\vm-to-azure-same-vnet.png":::

**Networking Steps:**

- Ensure that the VM and the PostgreSQL server are in the same virtual network.
- Configure NSG rules to allow traffic within the virtual network on the PostgreSQL port.
- No other firewall rules are needed for the Azure Database for PostgreSQL since the traffic is internal to the virtual network.

## Scenario 6: Azure Database for PostgreSQL - Single server to VNet-Integrated Azure Database for PostgreSQL - Flexible server

To facilitate connectivity between an Azure Database for PostgreSQL - Single Server with public access and a Vnet-Integrated Flexible Server, you need to configure the Single Server to allow connections from the subnet where the Flexible Server is deployed. Here's a brief outline of the steps to set up this connectivity:

**Add VNet Rule to Single Server:**

- Navigate to the Azure portal and open your PostgreSQL Single Server instance.
- Go to the "Connection Security" settings.
- Locate the "VNet rules" section and click on "Add existing virtual network".
- This action allows you to specify which virtual network can connect to your Single Server.

    :::image type="content" source="media\how-to-network-setup-migration-service\add-vnet-rule-single-server.png" alt-text="Screenshot of adding a vnet rule in single server." lightbox="media\how-to-network-setup-migration-service\add-vnet-rule-single-server.png":::

**Configure Rule Settings:**

- In the configuration panel that appears, enter a name for the new VNet rule.
- Select the subscription where your Flexible Server is located.
- Choose the virtual network (VNet) and the specific subnet associated with your Flexible Server.
- Confirm the settings by clicking "OK".

    :::image type="content" source="media\how-to-network-setup-migration-service\allow-flexible-server-subnet.png" alt-text="Screenshot of allowing the flexible server subnet." lightbox="media\how-to-network-setup-migration-service\allow-flexible-server-subnet.png":::

After completing these steps, the Single Server will be configured to accept connections from the Flexible Server's subnet, enabling secure communication between the two servers.

## Scenario 7: Azure Database for PostgreSQL - Single server with private endpoint to VNet-Integrated Azure Database for PostgreSQL - Flexible server

To facilitate connectivity from an Azure Database for PostgreSQL Single Server with a private endpoint to a VNet-integrated Flexible Server, follow these steps:

**Get private endpoint details:**

- In the Azure portal, navigate to the Single Server instance and click on the private endpoint to view its VNet and subnet details.
- Access the Networking blade of the Flexible Server to note its VNet and subnet information.

     :::image type="content" source="media\how-to-network-setup-migration-service\private-endpoint-single-server.png" alt-text="Screenshot of private endpoint connection in single server." lightbox="media\how-to-network-setup-migration-service\allow-flexible-server-subnet.png":::

    :::image type="content" source="media\how-to-network-setup-migration-service\vnet-details-single-server.png" alt-text="Screenshot showing vnet and subnet details of single server's private endpoint." lightbox="media\how-to-network-setup-migration-service\vnet-details-single-server.png":::

**Assess VNet Peering Requirements**
- If both are in different VNets, you need to enable VNet peering to establish connection from one VNet to another. If they are in the same VNet but in different subnets, peering isn't required. Make sure that there are no network security groups(NSG) blocking the traffic from flexible server to single server.

**Private DNS Zone Configuration**
- Go to the **Networking** blade on the flexible server and check if a private DNS zone is being used. If used, open this private DNS zone in portal. In the left pane, click on the **Virtual network links** and check if the Vnet of single server and flexible server is added to this list.

    :::image type="content" source="media\how-to-network-setup-migration-service\private-dns-zone-vnet-link.png" alt-text="Screenshot vnet linked to a private DNS Zone." lightbox="media\how-to-network-setup-migration-service\private-dns-zone-vnet-link.png":::

    If not, click on the **Add** button and create a link for the VNets of single and flexible server to this private DNS zone.

- Go to the private endpoint on your single server and click on the **DNS configuration** blade. Check if a private DNS zone is attached with this end point. If not, attach a private DNS zone by clicking on the **Add Configuration** button.

    :::image type="content" source="media\how-to-network-setup-migration-service\private-dns-zone-private-end-point.png" alt-text="Screenshot showing a private DNS Zone used in private end point." lightbox="media\how-to-network-setup-migration-service\private-dns-zone-private-end-point.png":::

- Click on the Private DNS zone on your single server private end point and check if the Vnets of single server and flexible server are added to the Virtual network links. If not, follow the steps mentioned in the above step to add the links to the Vnets of single and flexible server to this private DNS zone.

- The final check would be to go the private DNS zone of the private end point on your single server and check if there exists an **A record** for your single server that points a private IP address.

    :::image type="content" source="media\how-to-network-setup-migration-service\private-dns-zone-arecord.png" alt-text="Screenshot showing a private IP address assigned to private end point." lightbox="media\how-to-network-setup-migration-service\private-dns-zone-arecord.png":::

Completing these steps will enable the Azure Database for PostgreSQL - Flexible Server to connect to the Azure Database for PostgreSQL - Single Server

## Resources for Networking Setup

- To establish an **ExpressRoute** connection, refer to the [Azure ExpressRoute Overview](/azure/expressroute/expressroute-introduction).
- For setting up an **IPsec VPN**, consult the guide on [Azure Point-to-Site VPN connections](/azure/vpn-gateway/point-to-site-about).
- For virtual network peering, [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview)

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
- https://ops.microsoft.com/#/repos/b6b6fd6c-9d21-fafb-c32b-81062ab07537
