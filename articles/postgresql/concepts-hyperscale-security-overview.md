---
title: Security overview - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Information protection and network security for Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 10/15/2021
---

# Security in Azure Database for PostgreSQL – Hyperscale (Citus)

This page outlines the multiple layers of security available to protect the data in your
Hyperscale (Citus) server group. This page outlines them.

## Information protection and encryption

### In transit

Whenever data is ingested into a node, Hyperscale (Citus) secures your data by
encrypting it in-transit with Transport Layer Security 1.2. Encryption
(SSL/TLS) is always enforced, and can’t be disabled.

### At rest

The Hyperscale (Citus) service uses the FIPS 140-2 validated cryptographic
module for storage encryption of data at-rest. Data, including backups, are
encrypted on disk, including the temporary files created while running queries.
The service uses the AES 256-bit cipher included in Azure storage encryption,
and the keys are system-managed. Storage encryption is always on, and can't be
disabled.

## Network security

[!INCLUDE [azure-postgresql-hyperscale-access](../../includes/azure-postgresql-hyperscale-access.md)]

## Limits and limitations

See Hyperscale (Citus) [limits and limitations](concepts-hyperscale-limits.md)
page.

## Next steps

* Learn how to [enable and manage private
  access](howto-hyperscale-private-access.md) (preview)
* Learn about [private
  endpoints](/azure/private-link/private-endpoint-overview)
* Learn about [virtual
  networks](/azure/virtual-network/concepts-and-best-practices)
* Learn about [private DNS zones](/azure/dns/private-dns-overview)
