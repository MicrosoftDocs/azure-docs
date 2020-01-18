---
title: Security in Azure Database for PostgreSQL - Single Server
description: An overview of the security features in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/22/2019
---

# Security in Azure Database for PostgreSQL - Single Server

There are multiple layers of security that are available to protect the data on your Azure Database for PostgreSQL server. This article outlines those security options.

## Information protection and encryption

### In-transit
Azure Database for PostgreSQL secures your data by encrypting data in-transit with Transport Layer Security. Encryption (SSL/TLS) is enforced by default.

### At-rest
The Azure Database for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, are encrypted on disk, with the exception of temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and can't be disabled.


## Network security
Connections to an Azure Database for PostgreSQL server are first routed through a regional gateway. The gateway has a publicly accessible IP, while the server IP addresses are protected. For more information about the gateway, visit the [connectivity architecture article](concepts-connectivity-architecture.md).  

A newly created Azure Database for PostgreSQL server has a firewall that blocks all external connections. Though they reach the gateway, they are not allowed to connect to the server. 

### IP firewall rules
IP firewall rules grant access to servers based on the originating IP address of each request. See the [firewall rules overview](concepts-firewall-rules.md) for more information.

### Virtual network firewall rules
Virtual network service endpoints extend your virtual network connectivity over the Azure backbone. Using virtual network rules you can enable your Azure Database for PostgreSQL server to allow connections from selected subnets in a virtual network. For more information, see the [virtual network service endpoint overview](concepts-data-access-and-security-vnet.md).

### Private IP
Private Link allows you to connect to your Azure Database for PostgreSQL Single server in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside your private Virtual Network (VNet). The PaaS resources can be accessed using the private IP address just like any other resource in the VNet. For more information,see the [private link overview](concepts-data-access-and-security-private-link.md)


## Access management

While creating the Azure Database for PostgreSQL server, you provide credentials for an administrator role. This administrator role can be used to create additional [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html).

You can also connect to the server using [Azure Active Directory (AAD) authentication](concepts-aad-authentication.md).


## Threat protection

You can opt in to [Advanced Threat Protection](concepts-data-access-and-security-threat-protection.md) which detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit servers.

[Audit logging](concepts-audit.md) is available to track activity in your databases. 


## Next steps
- Enable firewall rules for [IPs](concepts-firewall-rules.md) or [virtual networks](concepts-data-access-and-security-vnet.md)
- Learn about [Azure Active Directory authentication](concepts-aad-authentication.md) in Azure Database for PostgreSQL
