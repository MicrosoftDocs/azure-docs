---
title: Security overview - Azure Cosmos DB for PostgreSQL
description: Information protection and network security for Azure Cosmos DB for PostgreSQL.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 01/14/2022
---

# Security in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This page outlines the multiple layers of security available to protect the data in your
cluster. 

## Information protection and encryption

### In transit

Whenever data is ingested into a node, Azure Cosmos DB for PostgreSQL secures your data by
encrypting it in-transit with Transport Layer Security 1.2. Encryption
(SSL/TLS) is always enforced, and can’t be disabled.

### At rest

The Azure Cosmos DB for PostgreSQL service uses the FIPS 140-2 validated cryptographic
module for storage encryption of data at-rest. Data, including backups, are
encrypted on disk, including the temporary files created while running queries.
The service uses the AES 256-bit cipher included in Azure storage encryption,
and the keys are system-managed. Storage encryption is always on, and can't be
disabled.

## Network security

[!INCLUDE [access](includes/access.md)]

## Limits and limitations

See Azure Cosmos DB for PostgreSQL [limits and limitations](reference-limits.md)
page.

## Next steps

* Learn how to [enable and manage private access](howto-private-access.md)
* Learn about [private
  endpoints](../../private-link/private-endpoint-overview.md)
* Learn about [virtual
  networks](../../virtual-network/concepts-and-best-practices.md)
* Learn about [private DNS zones](../../dns/private-dns-overview.md)
