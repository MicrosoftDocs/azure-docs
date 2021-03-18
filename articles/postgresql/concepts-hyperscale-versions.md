---
title: Supported versions – Hyperscale (Citus) - Azure Database for PostgreSQL
description: PostgreSQL versions available in Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 03/18/2021
---

# Supported database versions in Azure Database for PostgreSQL – Hyperscale (Citus)

> [!IMPORTANT]
> Customizable PostgreSQL versions in Hyperscale (Citus) is currently in
> preview.  This preview is provided without a service level agreement, and
> it's not recommended for production workloads. Certain features might not be
> supported or might have constrained capabilities.  For more information, see
> [Supplemental Terms of Use for Microsoft Azure
> Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The version of PostgreSQL running in a Hyperscale (Citus) server group is
customizable during creation. You can choose between PostgreSQL versions
**11**, **12**, or **13**. Choosing anything other than version 11 is currently
a preview feature.

Depending on which version of PostgreSQL is running in a server group,
different versions Postgres extensions will be installed as well.  In
particular, Postgres 13 comes with Citus 10, and earlier Postgres versions come
with Citus 9.5.

## Next steps

* See which [extensions](concepts-hyperscale-extensions.md) are installed in
  which versions.
* Learn to [create a Hyperscale (Citus) server
  group](quickstart-create-hyperscale-portal.md).
