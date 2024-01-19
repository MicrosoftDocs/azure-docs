---
title: "Migration service - networking scenarios"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Network scenarios for connecting source and target
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/18/2024
ms.service: postgresql
ms.topic: conceptual
ms.custom:
---

# Network guide for migration service in Azure Database for PostgreSQL - Flexible Server

This document outlines various scenarios for connecting a source database to an Azure Database for PostgreSQL using the migration service. Each scenario presents different networking requirements and configurations to establish a successful connection for migration. Specific details vary based on the actual network setup and requirements of the source and target environments.

## Scenario 1: On-premises source to Azure Database for PostgreSQL with public access

**Networking Steps:**

- The source database server must have a public IP address.

- Configure the firewall to allow outbound connections on the PostgreSQL port (default 5432).

- Ensure the source database server is accessible over the internet.

- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 2: Private IP on-premises source to virtual network-Integrated Azure Database for PostgreSQL via Express Route/IPSec VPN

:::image type="content" source="media\network-setup-migration-service\on-premise-to-azure-vpn.png" alt-text="Screenshot of an on-premises data center is connected to Azure via ExpressRoute or VPN Gateway. The on-premises PostgreSQL server connects through the secure link to the Azure Database for PostgreSQL." lightbox="media\network-setup-migration-service\on-premise-to-azure-vpn.png":::

**Networking Steps:**

- Set up a Site-to-Site VPN or ExpressRoute for a secure, reliable connection between the on-premises network and Azure.

- Configure Azure's Virtual Network (virtual network) to allow access from the on-premises IP range.

- Set up Network Security Group (NSG) rules to allow traffic on the PostgreSQL port (default 5432) from the on-premises network.

- Verify the network configuration by testing connectivity from the target Azure Database for PostgreSQL to the source database, confirming that the migration service can access the source data.

## Scenario 3: AWS RDS for PostgreSQL to Azure Database for PostgreSQL

:::image type="content" source="media\network-setup-migration-service\aws-to-azure-vpn.png" alt-text="Screenshot of an AWS RDS for PostgreSQL connects to Azure Database for PostgreSQL through the internet or a direct connect service like Express Route or AWS Direct Connect." lightbox="media\network-setup-migration-service\aws-to-azure-vpn.png":::

The source database in another cloud provider (AWS) must have a public IP or a direct connection to Azure.

**Networking Steps:**

- **Public Access:** If your AWS RDS instance isn't publicly accessible, you can modify the instance to allow connections from Azure. This can be done through the AWS Management Console by changing the Publicly Accessible setting to Yes.

- **Private Access**
    - Establish a secure connection using Express Route, AWS Direct Connect, or a VPN from AWS to Azure.
    - In the AWS RDS security group, add an inbound rule to allow traffic from the Azure Database for PostgreSQL's public IP address/domain or the range of IP addresses in the Azure virtual network on the PostgreSQL port (default 5432).
    - Create an Azure Virtual Network (virtual network) where your Azure Database for PostgreSQL resides. Configure the virtual network's Network Security Group (NSG) to allow outbound connections to the AWS RDS instance's IP address on the PostgreSQL port.
    - Set up NSG rules in Azure to permit incoming connections from the cloud provider, AWS RDS IP range.
    - Allowlist the cloud provider's IP range in the Azure Database for PostgreSQL firewall settings.
    - Test the connectivity between AWS RDS and Azure Database for PostgreSQL to ensure no network issues.

## Scenario 4: Azure VM to Azure Database for PostgreSQL (different virtual networks)

:::image type="content" source="media\network-setup-migration-service\vm-to-azure-peering.png" alt-text="Screenshot of an Azure VM in one virtual network connects to the Azure Database for PostgreSQL in another virtual network." lightbox="media\network-setup-migration-service\vm-to-azure-peering.png":::

**Networking Steps:**

- Set up virtual network peering between the two VNets to enable direct network connectivity.

- Configure NSG rules to allow traffic between the VNets on the PostgreSQL port.

## Scenario 5: Azure VM to Azure PostgreSQL (same virtual network)

:::image type="content" source="media\network-setup-migration-service\vm-to-azure-same-vnet.png" alt-text="Screenshot of an Azure VM in the same virtual network connects directly to the Azure Database for PostgreSQL." lightbox="media\network-setup-migration-service\vm-to-azure-same-vnet.png":::

**Networking Steps:**

- Ensure that the VM and the PostgreSQL server are in the same virtual network.

- Configure NSG rules to allow traffic within the virtual network on the PostgreSQL port.

- No other firewall rules are needed for the Azure Database for PostgreSQL since the traffic is internal to the virtual network.
The migration service requires direct connectivity to the source database to perform the migration. Ensure all network security and compliance requirements are met when configuring public access or cross-network connections. Always test connectivity thoroughly before initiating the migration process.

## Related content

- [Known issues and limitations](known-issues-migration-service.md)
- [Premigration validations](premigration-migration-service.md)
- [Prerequisites](prerequisites-migration-service.md)