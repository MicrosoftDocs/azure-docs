---
title: Security overview - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Information protection and network security for Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 9/20/2021
---

# Security in Azure Database for PostgreSQL – Hyperscale (Citus)

There are multiple layers of security available to protect the data in your
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

Connections to a Hyperscale (Citus) node are first routed through a regional
gateway. The gateway has a publicly accessible IP, while the server IP
addresses are protected. For more information about the gateway, visit the
connectivity architecture article.

A newly created Azure Database for PostgreSQL server has a firewall that blocks
all external connections. Though they reach the gateway, they are not allowed
to connect to the server.

[!INCLUDE [azure-postgresql-hyperscale-access](../../includes/azure-postgresql-hyperscale-access.md)]

## Limits and limitations

See Hyperscale (Citus) [limits and limitations](concepts-hyperscale-limits.md)
page.

## Next steps

* Learn how to enable and manage private access
* Learn about private link
* Learn about [private
  endpoints](/azure/private-link/private-endpoint-overview)
* Learn about [virtual
  networks](/azure/virtual-network/concepts-and-best-practices)
* Learn about [private DNS zones](/azure/dns/private-dns-overview)
