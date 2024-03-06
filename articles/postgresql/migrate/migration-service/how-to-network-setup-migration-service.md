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

# Network guide for migration service in Azure Database for PostgreSQL Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This document outlines various scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. Each scenario presents different networking requirements and configurations to establish a successful connection for migration. Specific details vary based on the actual network setup and requirements of the source and target environments.

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

## Resources for Networking Setup

- To establish an **ExpressRoute** connection, refer to the [Azure ExpressRoute Overview](/azure/expressroute/expressroute-introduction).
- For setting up an **IPsec VPN**, consult the guide on [Azure Point-to-Site VPN connections](/azure/vpn-gateway/point-to-site-about).
- For virtual network peering, [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview)

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
- https://ops.microsoft.com/#/repos/b6b6fd6c-9d21-fafb-c32b-81062ab07537
