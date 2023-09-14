---
title: Encrypted connectivity using TLS/SSL in Azure Database for PostgreSQL - Flexible Server
description: Instructions and information on how to connect using TLS/SSL in Azure Database for PostgreSQL - Flexible Server.
author: sunilagarwal 
ms.author: sunila
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Encrypted connectivity using Transport Layer Security in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports connecting your client applications to the PostgreSQL service using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements.

Azure Database for PostgreSQL - Flexible Server supports encrypted connections using Transport Layer Security (TLS 1.2+) and all incoming connections with TLS 1.0 and TLS 1.1 will be denied. For all flexible servers enforcement of TLS connections is enabled. 

>[!Note]
> By default, secured connectivity between the client and the server is enforced. If you want to disable TLS/SSL for connecting to flexible server, you can change the server parameter *require_secure_transport* to *OFF*. You can also set TLS version by setting *ssl_max_protocol_version* server parameters.

## Applications that require certificate verification for TLS/SSL connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. Azure Database for PostgreSQL - Flexible Server uses *DigiCert Global Root CA*. Download this certificate needed to communicate over SSL from [DigiCert Global Root CA](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) and save the certificate file to your preferred location. For example, this tutorial uses `c:\ssl`.


### Connect using psql
If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server.

If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server.

The following example shows how to connect to your server using the psql command-line interface. Use the `sslmode=verify-full` connection string setting to enforce TLS/SSL certificate verification. Pass the local certificate file path to the `sslrootcert` parameter.

```bash
 psql "sslmode=verify-full sslrootcert=c:\\ssl\DigiCertGlobalRootCA.crt.pem host=mydemoserver.postgres.database.azure.com dbname=postgres user=myadmin"
```
> [!Note]
> Confirm that the value passed to *sslrootcert* matches the file path for the certificate you saved.

## Ensure your application or framework supports TLS connections

Some application frameworks that use PostgreSQL for their database services do not enable TLS by default during installation. Your PostgreSQL server enforces TLS connections but if the application is not configured for TLS, the application may fail to connect to your database server. Consult your application's documentation to learn how to enable TLS connections.

## Next steps
- [Create and manage Azure Database for PostgreSQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- Learn more about [networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking.md)
- Understand more about [Azure Database for PostgreSQL - Flexible Server firewall rules](./concepts-networking.md#public-access-allowed-ip-addresses)
