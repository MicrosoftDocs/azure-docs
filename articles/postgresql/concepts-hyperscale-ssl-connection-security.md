---
title: TLS - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Instructions and information to configure Azure Database for PostgreSQL - Hyperscale (Citus) and associated applications to properly use TLS connections.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 03/30/2020
---
# Configure TLS in Azure Database for PostgreSQL - Hyperscale (Citus)
Client application connections to the Hyperscale (Citus) coordinator node require Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). Enforcing TLS connections between your database server and your client applications helps protect against "man-in-the-middle" attacks by encrypting the data stream between the server and your application.

## Enforcing TLS connections
For all Azure Database for PostgreSQL servers provisioned through the Azure portal, enforcement of TLS connections is enabled by default. 

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using TLS. The TLS parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

## Ensure your application or framework supports TLS connections
Some application frameworks that use PostgreSQL for their database services do not enable TLS by default during installation. If your PostgreSQL server enforces TLS connections but the application is not configured for TLS, the application may fail to connect to your database server. Consult your application's documentation to learn how to enable TLS connections.

## Applications that require certificate verification for TLS connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file (.cer) to connect securely. The certificate to connect to an Azure Database for PostgreSQL - Hyperscale (Citus) is located at https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem. Download the certificate file and save it to your preferred location.

### Connect using psql
The following example shows how to connect to your Hyperscale (Citus) coordinator node using the psql command-line utility. Use the `sslmode=verify-full` connection string setting to enforce TLS certificate verification. Pass the local certificate file path to the `sslrootcert` parameter.

Below is an example of the psql connection string:
```
psql "sslmode=verify-full sslrootcert=DigiCertGlobalRootCA.crt.pem host=mydemoserver.postgres.database.azure.com dbname=citus user=citus password=your_pass"
```
> [!TIP]
> Confirm that the value passed to `sslrootcert` matches the file path for the certificate you saved.

## Next steps
Increase security further with [Firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus)](concepts-hyperscale-firewall-rules.md).
