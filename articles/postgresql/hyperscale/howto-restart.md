---
title: Restart server - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Learn how to restart your Hyperscale (Citus) server group from the Azure portal.
ms.custom: kr2b-contr-experiment
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/06/2022
---

# Restart Azure Database for PostgreSQL - Hyperscale (Citus)

If you'd like to restart your Hyperscale (Citus) server group, you can do it
from the group's **Overview** page in the Azure portal. Select the **Restart**
button on the top bar. A confirmation dialog will appear. Select **Restart
all** to continue.

> [!NOTE]
> If the Restart button is not yet present for your server group, please open
> an Azure support request to restart the server group.

Restarting the server group applies to all nodes; you can't selectively restart
individual nodes. The restart applies to the PostgreSQL server processes in the
nodes. Any applications attempting to use the database will experience
connectivity downtime while the restart happens.

**Next steps**

- Changing some server parameters requires a restart. See the list of [all
  server parameters](reference-parameters.md) configurable on
  Hyperscale (Citus).
