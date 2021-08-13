---

title: 'Security in Azure Database for PostgreSQL - Flexible Server'
description:  Learn about security in the Flexible Server deployment option for Azure Database for PostgreSQL - Flexible Server
author: gennadNY 
ms.author: gennadyk
ms.service: postgresql
ms.custom: mvc
ms.devlang: python
ms.topic: quickstart
ms.date: 07/26/2021
---


# Security in Azure Database for PostgreSQL - Flexible Server

There are multiple layers of security that are available to protect the data on your Azure Database for PostgreSQL server. This article outlines those security options.

## Information protection and encryption

### In-transit
 Azure Database for PostgreSQL secures your data by encrypting data in-transit with Transport Layer Security. Encryption (SSL/TLS) is enforced by default.

### At-rest
The Azure Database for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, are encrypted on disk, including the temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. This is similar to other at-rest encryption technologies like Transparent Data Encryption (TDE) in SQL Server or Oracle databases. Storage encryption is always on and can't be disabled.


## Network security

You can choose two main networking options when running your Azure Database for PostgreSQL – Flexible Server . The options are private access (VNet integration) and public access (allowed IP addresses). By utilizing private access,  your flexible server is deployed into your   Azure Virtual Network. Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses.
With public access flexible server is accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address, access to which can is secured through firewall that by default blocks all connections. 



### IP firewall rules
IP firewall rules grant access to servers based on the originating IP address of each request. See the [firewall rules overview](concepts-firewall-rules.md) for more information.


### Private VNET Access
You can deploy your flexible server into your Azure Virtual Network. Azure virtual networks provide private and secure network communication. For more information,see the [flexible server](concepts-networking.md)

### Network security groups (NSG)
Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces.  For more information, see [Network Security Groups Overview](../../virtual-network/network-security-groups-overview.md)

## Access management

While creating the Azure Database for PostgreSQL server, you provide credentials for an administrator role. This administrator role can be used to create additional [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html).

You can also connect to the server using [Azure Active Directory (AAD) authentication](../concepts-aad-authentication.md).


### Azure Defender protection

 Azure Database for PostgreSQL -Flexible currently doesn't support [Azure Defender Protection](../../security-center/azure-defender.md). 


[Audit logging](../concepts-audit.md) is available to track activity in your databases. 


## Next steps
  - Enable firewall rules for [IPs](concepts-firewall-rules.md) for public access networking
  - Learn about [private access networking with Azure Database for PostgreSQL - Flexible Server](concepts-networking.md)
  - Learn about [Azure Active Directory authentication](../concepts-aad-authentication.md) in Azure Database for PostgreSQL