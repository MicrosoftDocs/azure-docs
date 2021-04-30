---
title: Preview features in Azure Database for PostgreSQL - Hyperscale (Citus)
description: Updated list of features currently in preview
author: jonels-msft
ms.author: jonels
ms.custom: mvc
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: overview
ms.date: 04/07/2021
---

# Preview features for PostgreSQL - Hyperscale (Citus)

Azure Database for PostgreSQL - Hyperscale (Citus) offers
previews for unreleased features. Preview versions are provided
without a service level agreement, and aren't recommended for
production workloads. Certain features might not be supported or
might have constrained capabilities.  For more information, see
[Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Features currently in preview

Here are the features currently available for preview:

* **[Basic tier](concepts-hyperscale-tiers.md)**. Run a server
  group using only a coordinator node and no worker nodes. An
  economical way to do initial testing and development, and
  handle small production workloads.
* **[PostgreSQL 12 and 13](concepts-hyperscale-versions.md)**.
  Use the latest database version in your server group.
* **[Citus
  10](concepts-hyperscale-versions.md#citus-and-other-extension-versions)**.
  Installed automatically on server groups running PostgreSQL 13.
* **[Columnar storage](concepts-hyperscale-columnar.md)**.
  Store selected tables' columns (rather than rows) contiguously
  on disk. Supports on-disk compression. Good for analytic and
  data warehousing workloads.
* **[Read replicas](howto-hyperscale-read-replicas-portal.md)**
  (currently same-region only). Any changes that happen to the
  primary server group get reflected in its replica, and queries
  against the replica cause no extra load on the original.
  Replicas are a useful tool to improve performance for
  read-only workloads.
* **[Managed
  PgBouncer](concepts-hyperscale-limits.md#managed-pgbouncer-preview)**.
  A connection pooler that allows many clients to connect to
  the server group at once, while limiting the number of active
  connections. It satisfies connection requests while keeping
  the coordinator node running smoothly.
* **[pgAudit](concepts-hyperscale-audit.md)**. Provides detailed
  session and object audit logging via the standard PostgreSQL
  logging facility. It produces audit logs required to pass
  certain government, financial, or ISO certification audits.

### Available regions for preview features

The pgAudit extension is available in all [regions supported by
Hyperscale
(Citus)](concepts-hyperscale-configuration-options.md#regions).
The other preview features are available in **East US** only.

## Does my server group have access to preview features?

To determine if your Hyperscale (Citus) server group has preview features
enabled, navigate to the server group's **Overview** page in the Azure portal.
If you see the property **Tier: Basic (preview)** or **Tier: Standard
(preview)** then your server group has access to preview features.

### How to get access

When creating a new Hyperscale (Citus) server group, check
the box **Enable preview features.**

## Contact us

Let us know about your experience using preview features, by emailing [Ask
Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com).
(This email address isn't a technical support channel. For technical problems,
open a [support
request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).)
