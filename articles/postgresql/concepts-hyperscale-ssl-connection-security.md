---
title: Transport Layer Security (TLS) - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Instructions and information to configure Azure Database for PostgreSQL - Hyperscale (Citus) and associated applications to properly use TLS connections.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 07/16/2020
---
# Configure TLS in Azure Database for PostgreSQL - Hyperscale (Citus)
The Hyperscale (Citus) coordinator node requires client applications to connect with Transport Layer Security (TLS). Enforcing TLS between the database server and client applications helps keep data confidential in transit. Extra verification settings described below also protect against "man-in-the-middle" attacks.

## Enforcing TLS connections
Applications use a "connection string" to identify the destination database and settings for a connection. Different clients require different settings. To see a list of connection strings used by common clients, consult the **Connection Strings** section for your server group in the Azure portal.

The TLS parameters `ssl` and `sslmode` vary based on the capabilities of the connector, for example `ssl=true` or `sslmode=require` or `sslmode=required`.

## Ensure your application or framework supports TLS connections
Some application frameworks don't enable TLS by default for PostgreSQL connections. However, without a secure connection an application can't connect to a Hyperscale (Citus) coordinator node. Consult your application's documentation to learn how to enable TLS connections.

## Applications that require certificate verification for TLS connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file (.cer) to connect securely. The certificate to connect to an Azure Database for PostgreSQL - Hyperscale (Citus) is located at https://cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem. Download the certificate file and save it to your preferred location.

> [!NOTE]
>
> To check the certificate's authenticity, you can verify its SHA-256
> fingerprint using the OpenSSL command line tool:
>
> ```sh
> openssl x509 -in DigiCertGlobalRootCA.crt.pem -noout -sha256 -fingerprint
>
> # should output:
> # 43:48:A0:E9:44:4C:78:CB:26:5E:05:8D:5E:89:44:B4:D8:4F:96:62:BD:26:DB:25:7F:89:34:A4:43:C7:01:61
> ```

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
