---
title: Preview features in Azure Database for PostgreSQL - Hyperscale (Citus)
description: Updated list of features currently in preview
author: jonels-msft
ms.author: jonels
ms.custom: mvc
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: overview
ms.date: 08/03/2021
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
