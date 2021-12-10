---
title: Change compute quotas - Azure portal - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Learn how to increase vCore quotas per region in Azure Database for PostgreSQL - Hyperscale (Citus) from the Azure portal.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 12/10/2021
---

# Adjust compute quota in Azure Database for PostgreSQL - Hyperscale (Citus) from the Azure portal

Azure enforces a vCore quota per subscription per region. There are two
independently adjustable limits: vCores for coordinator nodes, and vCores for
worker nodes.

## Request quota increase

* Select **New support request** in the Azure portal menu for your Hyperscale
  (Citus) server group.
* Fill out **Summary** with the quota increase request for your region, e.g.
  "Quota increase in West Europe region."
* These fields should be auto-selected, but verify:
   * **Issue Type** should be "Technical + your subscription"
   * **Service type** should be "Azure Database for PostgreSQL"
* Select "Create, Update, and Drop Resources" for **Problem type**.
* Select "Node compute or storage scaling" for **Problem subtype**.
* Select **Next: Solutions >>** then **Next: Details >>**
* In the problem description include two pieces of information:
   1. The region where you want the quota(s) increased
   2. The quota increase desired, e.g. "Need to increase worker node quota in
	  West Europe to 512 vCores"

![support request in Azure portal](media/howto-hyperscale-compute-quota/support-request.png)

## Next steps

* Learn about other Hyperscale (Citus) [quotas and limits](concepts-hyperscale-limits.md).
