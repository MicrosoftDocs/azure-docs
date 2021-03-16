---
title: Preview features in Azure Database for PostgreSQL - Hyperscale (Citus)
description: Updated list of features currently in preview
author: jonels-msft
ms.author: jonels
ms.custom: mvc
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: overview
ms.date: 03/15/2021
---

# Preview features for PostgreSQL - Hyperscale (Citus)

Azure Database for PostgreSQL - Hyperscale (Citus) sometimes
offers previews features not yet released. Preview versions are
provided without a service level agreement, and aren't
recommended for production workloads. Certain features might not
be supported or might have constrained capabilities.  For more
information, see [Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Features currently in preview

Here are the features currently available for preview:

* [Columnar storage](concepts-hyperscale-columnar.md). Store
  selected tables' columns (rather than rows) contiguously on
  disk. Supports on-disk compression.  Good for analytic and
  data warehousing workloads.
* **PostgreSQL 12 and 13**. Use the latest database version
  in your server group.
* [Basic tier](concepts-hyperscale-tiers.md). Run a server
  group using only a coordinator node and no worker nodes. An
  economical way to do initial testing and development, and
  handle small production workloads.
* **Read replicas** (currently same-region only). Any changes
  that happen to the original server group get promptly
  reflected in its replica, and queries against the replica
  cause no extra load on the original. Replicas are a useful
  tool to improve performance for read-only workloads.
* **Managed pgBouncer**. A connection pooler allowing more
  clients to connect to the server group at once. While
  allowing many clients to connect, it limits the number of
  active connections to keep the coordinator node running
  smoothly.
* **pgAudit** Provides detailed session and object audit
  logging via the standard PostgreSQL logging facility. It
  produces audit logs required to pass certain government,
  financial, or ISO certification audits.

### Available regions for preview features

The pgAudit extension is available in all [regions supported by
Hyperscale
(Citus)](concepts-hyperscale-configuration-options.md#regions).
The other preview features are available in **East US** only.

## Does my server group have access to preview features?

To determine if your Hyperscale (Citus) server group has preview
features enabled, navigate to the **Overview** page for the
server group in the Azure portal. If you see the property
**Tier: Basic (preview)** or **Tier: Standard (preview)** then
your server group has access to preview features.

### How to get access

When creating a new Hyperscale (Citus) server group, check
the box **Enable preview features.**
