---
title: 'Security in Azure Database for PostgreSQL - Flexible Server'
description: Learn about security in the Flexible Server deployment option for Azure Database for PostgreSQL.
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: mvc, mode-other
ms.devlang: python
ms.topic: quickstart
ms.date: 11/30/2021
---


# Security in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Multiple layers of security are available to help protect the data on your Azure Database for PostgreSQL server. This article outlines those security options.

## Information protection and encryption

Azure Database for PostgreSQL encrypts data in two ways:

- **Data in transit**: Azure Database for PostgreSQL encrypts in-transit data with Secure Sockets Layer and Transport Layer Security (SSL/TLS). Encryption is enforced by default. See this [guide](how-to-connect-tls-ssl.md) for more details. For better security, you may choose to enable [SCRAM authentication](how-to-connect-scram.md).

   Although its not recommended, if needed, you have an option to disable TLS\SSL for connections to Azure Database for PostgreSQL - Flexible Server by updating  the `require_secure_transport` server parameter to OFF. You can also set TLS version by setting `ssl_min_protocol_version` and `ssl_max_protocol_version` server parameters.


- **Data at rest**: For storage encryption, Azure Database for PostgreSQL uses the FIPS 140-2 validated cryptographic module. Data is encrypted on disk, including backups and the temporary files created while queries are running. 

  The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. This is similar to other at-rest encryption technologies, like transparent data encryption in SQL Server or Oracle databases. Storage encryption is always on and can't be disabled.


## Network security

When you're running Azure Database for PostgreSQL - Flexible Server, you have two main networking options:

- **Private access**: You can deploy your server into an Azure virtual network. Azure virtual networks help provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses. For more information, see the [networking overview for Azure Database for PostgreSQL - Flexible Server](concepts-networking.md).

  Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. For more information, see the [overview of network security groups](../../virtual-network/network-security-groups-overview.md).

- **Public access**: The server can be accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address. Access to it is secured through a firewall that blocks all connections by default. 

  IP firewall rules grant access to servers based on the originating IP address of each request. For more information, see the [overview of firewall rules](concepts-firewall-rules.md).

## Access management

While you're creating the Azure Database for PostgreSQL server, you provide credentials for an administrator role. This administrator role can be used to create more [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html).

For example,

```SQL
postgres=> create role demouser with password 'password123';
```

You can periodically audit the list of roles in your server. For example, you can connect using `psql` client and query the `pg_roles` table which lists all the roles along with privileges such as create additional roles, create databases, replication etc. 

```SQL
postgres=> \x
Expanded display is on.
postgres=> select * from pg_roles where rolname='demouser';
-[ RECORD 1 ]--+---------
rolname        | demouser
rolsuper       | f
rolinherit     | t
rolcreaterole  | f
rolcreatedb    | f
rolcanlogin    | f
rolreplication | f
rolconnlimit   | -1
rolpassword    | ********
rolvaliduntil  |
rolbypassrls   | f
rolconfig      |
oid            | 24827

```

[Audit logging](concepts-audit.md) is also available with Flexible Server to track activity in your databases. 

> [!NOTE]
> Azure Database for PostgreSQL - Flexible Server currently doesn't support [Microsoft Defender for Cloud protection](../../security-center/azure-defender.md). 

## Updating passwords

For better security, it is a good practice to periodically rotate your admin password and database user passwords. It is recommended to use strong passwords using upper and lower cases, numbers and special characters.

### Reset administrator password

Follow the [how to guide](./how-to-manage-server-portal.md#reset-admin-password) to reset the admin password.

### Update database user password

You can use client tools to update database user passwords. 
For example,
```SQL
postgres=> alter role demouser with password 'Password123!';
ALTER ROLE
```
## Next steps
- Enable [firewall rules for IP addresses](concepts-firewall-rules.md) for public access networking.
- Learn about [private access networking with Azure Database for PostgreSQL - Flexible Server](concepts-networking.md).
- Learn about [Azure Active Directory authentication](../concepts-aad-authentication.md) in Azure Database for PostgreSQL.
