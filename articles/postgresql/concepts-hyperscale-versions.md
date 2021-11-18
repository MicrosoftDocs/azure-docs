---
title: Supported versions – Hyperscale (Citus) - Azure Database for PostgreSQL
description: PostgreSQL versions available in Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 10/01/2021
---

# Supported database versions in Azure Database for PostgreSQL – Hyperscale (Citus)

## PostgreSQL versions

The version of PostgreSQL running in a Hyperscale (Citus) server group is
customizable during creation. Hyperscale (Citus) currently supports the
following major versions:

### PostgreSQL version 14

The current minor release is 14.0. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/14/release-14.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 13

The current minor release is 13.4. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/13/release-13-4.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 12

The current minor release is 12.8. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/12/release-12-8.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 11

The current minor release is 11.13. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/11/release-11-13.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 10 and older

We don't support PostgreSQL version 10 and older for Azure Database for
PostgreSQL - Hyperscale (Citus).

## Citus and other extension versions

Depending on which version of PostgreSQL is running in a server group,
different [versions of Postgres extensions](concepts-hyperscale-extensions.md)
will be installed as well. In particular, Postgres versions 12-14 come with
Citus 10, and earlier Postgres versions come with Citus 9.5.

## Next steps

* See which [extensions](concepts-hyperscale-extensions.md) are installed in
  which versions.
* Learn to [create a Hyperscale (Citus) server
  group](quickstart-create-hyperscale-portal.md).
