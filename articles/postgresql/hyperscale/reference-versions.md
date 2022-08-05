---
title: Supported versions – Hyperscale (Citus) - Azure Database for PostgreSQL
description: PostgreSQL versions available in Azure Database for PostgreSQL - Hyperscale (Citus)
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 06/28/2021
---

# Supported database versions in Azure Database for PostgreSQL – Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

## PostgreSQL versions

The version of PostgreSQL running in a Hyperscale (Citus) server group is
customizable during creation. Hyperscale (Citus) currently supports the
following major [PostgreSQL
versions](https://www.postgresql.org/docs/release/):

### PostgreSQL version 14

The current minor release is 14.4. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/14/release-14-1.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 13

The current minor release is 13.7. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/13/release-13-5.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 12

The current minor release is 12.11. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/12/release-12-9.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 11

The current minor release is 11.16. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/11/release-11-14.html) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 10 and older

We don't support PostgreSQL version 10 and older for Azure Database for
PostgreSQL - Hyperscale (Citus).

## Citus and other extension versions

Depending on which version of PostgreSQL is running in a server group,
different [versions of PostgreSQL extensions](reference-extensions.md)
will be installed as well. In particular, PostgreSQL 14 comes with Citus 11, PostgreSQL versions 12 and 13 come with
Citus 10, and earlier PostgreSQL versions come with Citus 9.5.

## Next steps

* See which [extensions](reference-extensions.md) are installed in
  which versions.
* Learn to [create a Hyperscale (Citus) server
  group](quickstart-create-portal.md).
