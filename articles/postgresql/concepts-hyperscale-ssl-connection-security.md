---
title: SSL - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Instructions and information to configure Azure Database for PostgreSQL - Hyperscale (Citus) and associated applications to properly use SSL connections.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/17/2019
---
# Configure SSL in Azure Database for PostgreSQL - Hyperscale (Citus)
Client application connections to the Hyperscale (Citus) coordinator node require Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man-in-the-middle" attacks by encrypting the data stream between the server and your application.

## Enforcing SSL connections
For all Azure Database for PostgreSQL servers provisioned through the Azure portal, enforcement of SSL connections is enabled by default. 

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using SSL. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

## Ensure your application or framework supports SSL connections
Some application frameworks that use PostgreSQL for their database services do not enable SSL by default during installation. If your PostgreSQL server enforces SSL connections but the application is not configured for SSL, the application may fail to connect to your database server. Consult your application's documentation to learn how to enable SSL connections.

## Applications that require certificate verification for SSL connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file (.cer) to connect securely. The certificate to connect to an Azure Database for PostgreSQL - Hyperscale (Citus) is located at https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem. Download the certificate file and save it to your preferred location.

### Connect using psql
The following example shows how to connect to your Hyperscale (Citus) coordinator node using the psql command-line utility. Use the `sslmode=verify-full` connection string setting to enforce SSL certificate verification. Pass the local certificate file path to the `sslrootcert` parameter.

Below is an example of the psql connection string:
```
psql "sslmode=verify-full sslrootcert=DigiCertGlobalRootCA.crt.pem host=mydemoserver.postgres.database.azure.com dbname=citus user=citus password=your_pass"
```
> [!TIP]
> Confirm that the value passed to `sslrootcert` matches the file path for the certificate you saved.

## Next steps
Increase security further with [Firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus)](concepts-hyperscale-firewall-rules.md).
