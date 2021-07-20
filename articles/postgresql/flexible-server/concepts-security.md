---
title: Security in Azure Database for PostgreSQL - Flexible Server
description: An overview of the security features in Azure Database for PostgreSQL - Flexible Server.
author: GennadNY
ms.author: gennadyk
ms.service: postgresql
ms.topic: conceptual
ms.date: 07/19/2021
---

# Security in Azure Database for PostgreSQL - Flexible Server

There are multiple layers of security that are available to protect the data on your Azure Database for PostgreSQL server. This article outlines those security options.

## Information protection and encryption

### In-transit
Azure Database for PostgreSQL secures your data by encrypting data in-transit with Transport Layer Security. Encryption (SSL/TLS) is enforced by default.

### At-rest
The Azure Database for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, are encrypted on disk, including the temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and can't be disabled.


## Network security
Connections to an Azure Database for PostgreSQL server are first routed through a regional gateway. The gateway has a publicly accessible IP, while the server IP addresses are protected. For more information about the gateway, visit the [connectivity architecture article](concepts-connectivity-architecture.md).  

A newly created Azure Database for PostgreSQL server has a firewall that blocks all external connections. Though they reach the gateway, they are not allowed to connect to the server. 

### IP firewall rules
IP firewall rules grant access to servers based on the originating IP address of each request. See the [firewall rules overview](concepts-firewall-rules.md) for more information.

### Virtual network firewall rules
Virtual network service endpoints extend your virtual network connectivity over the Azure backbone. Using virtual network rules you can enable your Azure Database for PostgreSQL server to allow connections from selected subnets in a virtual network. For more information, see the [virtual network service endpoint overview](concepts-data-access-and-security-vnet.md).

### Private VNET Access
You can deploy your flexible server into your Azure Virtual Network. Azure virtual networks provide private and secure network communication. For more information,see the [flexble server](concepts-networking.md)

### Network security groups (NSG)
Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces.  For more information, see [Network Security Groups Overview](https://docs.microsoft.com/azure/virtual-network/network-security-groups-overview)

## Access management

While creating the Azure Database for PostgreSQL server, you provide credentials for an administrator role. This administrator role can be used to create additional [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html).

You can also connect to the server using [Azure Active Directory (AAD) authentication](concepts-aad-authentication.md).


## Azure Defender protection

 Azure Database for PostgreSQL -Flexible currently doesn't support [Azure Defender Protection](https://docs.microsoft.com/azure/security-center/azure-defender). Its currently planned feature to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit servers.


[Audit logging](concepts-audit.md) is available to track activity in your databases. 


## Next steps
- Enable firewall rules for [IPs](concepts-firewall-rules.md) or [virtual networks](concepts-data-access-and-security-vnet.md)
- Learn about [private networking with Azure Database for PostgreSQL - Flexible Server](concepts-networking.md)
- Learn about [Azure Active Directory authentication](concepts-aad-authentication.md) in Azure Database for PostgreSQL