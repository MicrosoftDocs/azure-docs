---
title: Upgrade server group - Hyperscale (Citus) - Azure Database for PostgreSQL
description: This article describes how you can upgrade PostgreSQL and Citus in Azure Database for PostgreSQL - Hyperscale (Citus).
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 08/29/2022
---

# Upgrade Hyperscale (Citus) server group

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

These instructions describe how to upgrade to a new major version of PostgreSQL
on all server group nodes.

## Test the upgrade first

Upgrading PostgreSQL causes more changes than you might imagine, because
Hyperscale (Citus) will also upgrade the [database
extensions](reference-extensions.md), including the Citus extension. Upgrades
also require downtime in the database cluster.

We strongly recommend you to test your application with the new PostgreSQL and
Citus version before you upgrade your production environment.  Also, see
our list of [upgrade precautions](concepts-upgrade.md).

A convenient way to test is to make a copy of your server group using
[point-in-time restore](concepts-backup.md#restore). Upgrade the
copy and test your application against it. Once you've verified everything
works properly, upgrade the original server group.

## Upgrade a server group in the Azure portal

1. In the **Overview** section of a Hyperscale (Citus) server group, select the
   **Upgrade** button.
1. A dialog appears, showing the current version of PostgreSQL and Citus.
   Choose a new PostgreSQL version in the **Upgrade to** list.
1. Verify the value in **Citus version after upgrade** is what you expect.
   This value changes based on the PostgreSQL version you selected.
1. Select the **Upgrade** button to continue.

## Next steps

* Learn about [supported PostgreSQL versions](reference-versions.md).
* See [which extensions](reference-extensions.md) are packaged with
  each PostgreSQL version in a Hyperscale (Citus) server group.
* Learn more about [upgrades](concepts-upgrade.md)
