---
title: Transport Layer Security (TLS) - Azure Cosmos DB for PostgreSQL
description: Instructions and information to configure Azure Cosmos DB for PostgreSQL and associated applications to properly use TLS connections.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/05/2023
---
# Configure TLS in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]
The coordinator node requires client applications to connect with Transport Layer Security (TLS). Enforcing TLS between the database server and client applications helps keep data confidential in transit. Extra verification settings described below also protect against "man-in-the-middle" attacks.

## Enforcing TLS connections
Applications use a "connection string" to identify the destination database and settings for a connection. Different clients require different settings. To see a list of connection strings used by common clients, consult the **Connection Strings** section for your cluster in the Azure portal.

The TLS parameters `ssl` and `sslmode` vary based on the capabilities of the connector, for example `ssl=true` or `sslmode=require` or `sslmode=required`.

## Ensure your application or framework supports TLS connections
Some application frameworks don't enable TLS by default for PostgreSQL connections. However, without a secure connection, an application can't connect to the coordinator node. Consult your application's documentation to learn how to enable TLS connections.

## Applications that require certificate verification for TLS connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file (.cer) to connect securely. The certificate to connect to an Azure Cosmos DB for PostgreSQL is located at https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem. Download the certificate file and save it to your preferred location.

> [!NOTE]
>
> To check the certificate's authenticity, you can verify its SHA-256
> fingerprint using the OpenSSL command line tool:
>
> ```sh
> openssl x509 -in DigiCertGlobalRootG2.crt.pem -noout -sha256 -fingerprint
>
> # should output:
> # CB:3C:CB:B7:60:31:E5:E0:13:8F:8D:D3:9A:23:F9:DE:47:FF:C3:5E:43:C1:14:4C:EA:27:D4:6A:5A:B1:CB:5F
> ```

### Connect using psql
The following example shows how to connect to your coordinator node using the psql command-line utility. Use the `sslmode=verify-full` connection string setting to enforce TLS certificate verification. Pass the local certificate file path to the `sslrootcert` parameter.

Below is an example of the psql connection string:
```
psql "sslmode=verify-full sslrootcert=DigiCertGlobalRootG2.crt.pem host=c-mydemocluster.12345678901234.postgres.cosmos.azure.com dbname=citus user=citus password=your_pass"
```
> [!TIP]
> Confirm that the value passed to `sslrootcert` matches the file path for the certificate you saved.

## Next steps
Increase security further with [Firewall rules in Azure Cosmos DB for PostgreSQL](concepts-firewall-rules.md).
